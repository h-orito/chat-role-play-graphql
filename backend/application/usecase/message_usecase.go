package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
	"time"
)

type MessageUsecase interface {
	FindMessages(gameID uint32, query model.MessagesQuery, user *model.User) (model.Messages, error)
	FindMessagesLatestUnixTimeMilli(gameID uint32, query model.MessagesQuery, user *model.User) (uint64, error)
	FindMessage(gameID uint32, ID uint64) (*model.Message, error)
	FindMessageReplies(gameID uint32, messageID uint64, user *model.User) ([]model.Message, error)
	FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error)
	RegisterMessage(ctx context.Context, gameID uint32, user model.User, message model.Message) error
	RegisterMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.Message) (*model.Message, error)
	RegisterMessageFavorite(ctx context.Context, gameID uint32, user model.User, messageID uint64) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, user model.User, messageID uint64) error
	// participant group
	FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, user model.User, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error)
	UpdateGameParticipantGroup(ctx context.Context, user model.User, gameID uint32, group model.GameParticipantGroup) error
	// direct message
	FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error)
	FindDirectMessagesLatestUnixTimeMilli(gameID uint32, query model.DirectMessagesQuery) (uint64, error)
	FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) error
	RegisterDirectMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) (*model.DirectMessage, error)
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, user model.User, directMessageID uint64) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, user model.User, directMessageID uint64) error
}

type messageUsecase struct {
	messageService       app_service.MessageService
	gameService          app_service.GameService
	playerService        app_service.PlayerService
	messageDomainService dom_service.MessageDomainService
	transaction          Transaction
}

func NewMessageUsecase(
	messageService app_service.MessageService,
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	messageDomainService dom_service.MessageDomainService,
	tx Transaction,
) MessageUsecase {
	return &messageUsecase{
		messageService:       messageService,
		gameService:          gameService,
		playerService:        playerService,
		messageDomainService: messageDomainService,
		transaction:          tx,
	}
}

// FindMessages implements MessageService.
func (s *messageUsecase) FindMessages(gameID uint32, query model.MessagesQuery, user *model.User) (model.Messages, error) {
	mergedQuery, myself, err := s.MergeQuery(gameID, query, user)
	if err != nil {
		return model.Messages{}, err
	}
	if mergedQuery == nil {
		return model.Messages{}, nil
	}

	return s.messageService.FindMessages(gameID, *mergedQuery, myself)
}

// FindMessagesLatestUnixTimeMilli implements MessageUsecase.
func (s *messageUsecase) FindMessagesLatestUnixTimeMilli(gameID uint32, query model.MessagesQuery, user *model.User) (uint64, error) {
	mergedQuery, myself, err := s.MergeQuery(gameID, query, user)
	if err != nil {
		return 0, err
	}
	if mergedQuery == nil {
		return 0, nil
	}
	return s.messageService.FindMessagesLatestUnixTimeMilli(gameID, *mergedQuery, myself)
}

func (s *messageUsecase) MergeQuery(gameID uint32, query model.MessagesQuery, user *model.User) (*model.MessagesQuery, *model.GameParticipant, error) {
	game, err := s.gameService.FindGame(gameID)
	if err != nil {
		return nil, nil, err
	}
	var myself *model.GameParticipant = nil
	authorities := []model.PlayerAuthority{}
	if user != nil {
		myself, err = s.findMyGameParticipant(gameID, *user)
		if err != nil {
			return nil, nil, err
		}
		authorities, err = s.playerService.FindAuthorities(myself.PlayerID)
		if err != nil {
			return nil, nil, err
		}
	}
	// merge message types
	requestMessageTypes := model.MessageTypeValues()
	if query.Types != nil {
		requestMessageTypes = *query.Types
	}
	viewableMessageTypes := s.messageDomainService.GetViewableMessageTypes(*game, authorities)
	types := array.Filter(requestMessageTypes, func(t model.MessageType) bool {
		return array.Any(viewableMessageTypes, func(v model.MessageType) bool {
			return v == t
		})
	})
	if len(types) == 0 {
		query.Types = &types
	} else if len(types) != len(model.MessageTypeValues()) {
		query.Types = &types
	}
	// 独り言を取得するか
	shouldIncludeMonologue := shouldIncludeMonologue(query, requestMessageTypes, myself)
	query.IncludeMonologue = &shouldIncludeMonologue
	shouldIncludeSecret := shouldIncludeSecrt(query, requestMessageTypes, myself)
	query.IncludeSecret = &shouldIncludeSecret

	return &query, myself, nil
}

func shouldIncludeMonologue(
	query model.MessagesQuery,
	requestMessageTypes []model.MessageType,
	myself *model.GameParticipant,
) bool {
	// 既に独り言が取得対象になっていたら不要
	if query.Types == nil || array.Any(*query.Types, func(mt model.MessageType) bool {
		return mt == model.MessageTypeMonologue
	}) {
		return false
	}
	// 自分が取得対象になっていなければ不要
	if myself == nil {
		return false
	}
	if query.SenderIDs != nil && array.None(*query.SenderIDs, func(id uint32) bool {
		return id == myself.ID
	}) {
		return false
	}
	// 求めていなければ不要
	if array.None(requestMessageTypes, func(mt model.MessageType) bool {
		return mt == model.MessageTypeMonologue
	}) {
		return false
	}
	return true
}

func shouldIncludeSecrt(
	query model.MessagesQuery,
	requestMessageTypes []model.MessageType,
	myself *model.GameParticipant,
) bool {
	// 既に秘話が取得対象になっていたら不要
	if query.Types == nil || array.Any(*query.Types, func(mt model.MessageType) bool {
		return mt == model.MessageTypeSecret
	}) {
		return false
	}
	// 自分が取得対象になっていなければ不要
	if myself == nil {
		return false
	}
	if query.SenderIDs != nil && array.None(*query.SenderIDs, func(id uint32) bool {
		return id == myself.ID
	}) {
		return false
	}
	// 求めていなければ不要
	if array.None(requestMessageTypes, func(mt model.MessageType) bool {
		return mt == model.MessageTypeSecret
	}) {
		return false
	}
	return true
}

// FindMessage implements MessageService.
func (s *messageUsecase) FindMessage(gameID uint32, ID uint64) (*model.Message, error) {
	return s.messageService.FindMessage(gameID, ID)
}

// FindMessageReplies implements MessageService.
func (s *messageUsecase) FindMessageReplies(gameID uint32, messageID uint64, user *model.User) ([]model.Message, error) {
	var myself *model.GameParticipant = nil
	if user != nil {
		m, err := s.findMyGameParticipant(gameID, *user)
		if err != nil {
			return nil, err
		}
		myself = m
	}
	return s.messageService.FindMessageReplies(gameID, messageID, myself)
}

// FindMessageFavoriteGameParticipants implements MessageService.
func (s *messageUsecase) FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error) {
	return s.messageService.FindMessageFavoriteGameParticipants(gameID, messageID)
}

// RegisterMessage implements MessageService.
func (s *messageUsecase) RegisterMessage(
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.Message,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		msg, err := s.assertRegisterMessage(gameID, user, message)
		if err != nil {
			return nil, err
		}
		game, err := s.gameService.FindGame(gameID)
		if err != nil {
			return nil, err
		}
		if message.ReplyTo != nil {
			replyToMessage, err := s.messageService.FindMessage(gameID, message.ReplyTo.MessageID)
			if err != nil {
				return nil, err
			}
			if replyToMessage == nil {
				return nil, fmt.Errorf("reply to message not found")
			}
			msg.ReplyTo.GameParticipantID = replyToMessage.Sender.GameParticipantID
			msg.Receiver = &model.MessageReceiver{
				GameParticipantID:   replyToMessage.Sender.GameParticipantID,
				ReceiverName:        replyToMessage.Sender.SenderName,
				ReceiverEntryNumber: replyToMessage.Sender.SenderEntryNumber,
			}
		}
		return nil, s.messageService.RegisterMessage(ctx, *game, *msg)
	})
	return err
}

func (s *messageUsecase) RegisterMessageDryRun(
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.Message,
) (*model.Message, error) {
	msg, err := s.assertRegisterMessage(gameID, user, message)
	if err != nil {
		return nil, err
	}
	// 登録の際決定される項目は適当に埋める
	msg.Time = model.MessageTime{
		SendAt:        time.Now(),
		UnixtimeMilli: 0,
	}
	msg.Content.Number = 1
	return msg, nil
}

func (s *messageUsecase) assertRegisterMessage(
	gameID uint32,
	user model.User,
	message model.Message,
) (*model.Message, error) {
	game, err := s.gameService.FindGame(gameID)
	if err != nil {
		return nil, err
	}
	player, err := s.playerService.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	myself, err := s.findMyGameParticipant(gameID, user)
	if err != nil {
		return nil, err
	}
	latestPeriod := game.Periods[len(game.Periods)-1]
	var sender *model.MessageSender
	if !message.Type.IsSystem() {
		sender = &model.MessageSender{
			GameParticipantID: myself.ID,
			SenderIconID:      message.Sender.SenderIconID,
			SenderName:        message.Sender.SenderName,
			SenderEntryNumber: myself.EntryNumber,
		}
	}
	var receiver *model.MessageReceiver
	if message.Receiver != nil {
		receiverParticipant, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID: &gameID,
			ID:     &message.Receiver.GameParticipantID,
		})
		if err != nil {
			return nil, err
		}
		receiver = &model.MessageReceiver{
			GameParticipantID:   receiverParticipant.ID,
			ReceiverName:        receiverParticipant.Name,
			ReceiverEntryNumber: receiverParticipant.EntryNumber,
		}
	}
	msg := model.Message{
		GamePeriodID: latestPeriod.ID,
		Type:         message.Type,
		Sender:       sender,
		Receiver:     receiver,
		ReplyTo:      message.ReplyTo,
		Content:      message.Content,
	}
	err = s.messageDomainService.AssertRegisterMessage(*game, *player, msg)
	if err != nil {
		return nil, err
	}
	return &msg, nil
}

// RegisterMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	messageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		return nil, s.messageService.RegisterMessageFavorite(ctx, gameID, messageID, myself.ID)
	})
	return err
}

// DeleteMessageFavorite implements MessageUsecase.
func (s *messageUsecase) DeleteMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	messageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		return nil, s.messageService.DeleteMessageFavorite(ctx, gameID, messageID, myself.ID)
	})
	return err
}

func (s *messageUsecase) FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	return s.messageService.FindGameParticipantGroups(query)
}

func (s *messageUsecase) RegisterGameParticipantGroup(
	ctx context.Context,
	user model.User,
	gameID uint32,
	group model.GameParticipantGroup,
) (*model.GameParticipantGroup, error) {
	saved, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		// 自分自身がメンバーに含まれていない
		if array.None(group.MemberIDs, func(id uint32) bool {
			return id == myself.ID
		}) {
			return nil, errors.New("自分が含まれていません")
		}
		groups, err := s.messageService.FindGameParticipantGroups(model.GameParticipantGroupsQuery{
			GameID:                   gameID,
			MemberGroupParticipantID: &myself.ID,
		})
		if err != nil {
			return nil, err
		}
		// メンバーが完全に一致するグループが既に存在している
		if array.Any(groups, func(g model.GameParticipantGroup) bool {
			return len(g.MemberIDs) == len(group.MemberIDs) && array.All(g.MemberIDs, func(id uint32) bool {
				return array.Any(group.MemberIDs, func(memberID uint32) bool {
					return memberID == id
				})
			})
		}) {
			return nil, errors.New("already exists")
		}
		return s.messageService.RegisterGameParticipantGroup(ctx, gameID, group)
	})
	if err != nil {
		return nil, err
	}
	return saved.(*model.GameParticipantGroup), nil
}

func (s *messageUsecase) UpdateGameParticipantGroup(
	ctx context.Context,
	user model.User,
	gameID uint32,
	group model.GameParticipantGroup,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		groups, err := s.messageService.FindGameParticipantGroups(model.GameParticipantGroupsQuery{
			GameID: gameID,
			IDs:    &[]uint32{group.ID},
		})
		if err != nil {
			return nil, err
		}
		// 存在しないか、自分自身がメンバーに含まれていない
		if len(groups) <= 0 {
			return nil, errors.New("not found")
		}
		if array.None(groups[0].MemberIDs, func(id uint32) bool {
			return id == myself.ID
		}) {
			return nil, errors.New("自分が含まれていません")
		}
		return nil, s.messageService.UpdateGameParticipantGroup(ctx, gameID, group)
	})
	return err
}

// FindDirectMessages implements MessageService.
func (s *messageUsecase) FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	return s.messageService.FindDirectMessages(gameID, query)
}

// FindDirectMessagesLatestUnixTimeMilli implements MessageUsecase.
func (s *messageUsecase) FindDirectMessagesLatestUnixTimeMilli(gameID uint32, query model.DirectMessagesQuery) (uint64, error) {
	return s.messageService.FindDirectMessagesLatestUnixTimeMilli(gameID, query)
}

// FindDirectMessage implements MessageService.
func (s *messageUsecase) FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error) {
	return s.messageService.FindDirectMessage(gameID, ID)
}

// FindDirectMessageFavoriteGameParticipants implements MessageService.
func (s *messageUsecase) FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error) {
	return s.messageService.FindDirectMessageFavoriteGameParticipants(gameID, directMessageID)
}

// RegisterDirectMessage implements MessageService.
func (s *messageUsecase) RegisterDirectMessage(
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.DirectMessage,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		msg, err := s.assertRegisterDirectMessage(gameID, user, message)
		if err != nil {
			return nil, err
		}
		game, err := s.gameService.FindGame(gameID)
		return nil, s.messageService.RegisterDirectMessage(ctx, *game, *msg)
	})
	return err
}

// RegisterDirectMessageDryRun implements MessageUsecase.
func (s *messageUsecase) RegisterDirectMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) (*model.DirectMessage, error) {
	msg, err := s.assertRegisterDirectMessage(gameID, user, message)
	if err != nil {
		return nil, err
	}
	// 登録の際決定される項目は適当に埋める
	msg.Time = model.MessageTime{
		SendAt:        time.Now(),
		UnixtimeMilli: 0,
	}
	msg.Content.Number = 1
	return msg, nil
}

func (s *messageUsecase) assertRegisterDirectMessage(
	gameID uint32,
	user model.User,
	message model.DirectMessage,
) (*model.DirectMessage, error) {
	game, err := s.gameService.FindGame(gameID)
	if err != nil {
		return nil, err
	}
	player, err := s.playerService.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	myself, err := s.findMyGameParticipant(gameID, user)
	if err != nil {
		return nil, err
	}
	latestPeriod := game.Periods[len(game.Periods)-1]
	var sender *model.MessageSender
	if !message.Type.IsSystem() {
		sender = &model.MessageSender{
			GameParticipantID: myself.ID,
			SenderIconID:      message.Sender.SenderIconID,
			SenderName:        message.Sender.SenderName,
			SenderEntryNumber: myself.EntryNumber,
		}
	}
	msg := model.DirectMessage{
		GameParticipantGroupID: message.GameParticipantGroupID,
		GamePeriodID:           latestPeriod.ID,
		Type:                   message.Type,
		Sender:                 sender,
		Content:                message.Content,
	}
	err = s.messageDomainService.AssertRegisterDirectMessage(*game, *player, msg)
	if err != nil {
		return nil, err
	}

	return &msg, nil
}

// RegisterDirectMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterDirectMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	directMessageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		return nil, s.messageService.RegisterDirectMessageFavorite(ctx, gameID, directMessageID, myself.ID)
	})
	return err
}

// DeleteDirectMessageFavorite implements MessageUsecase.
func (s *messageUsecase) DeleteDirectMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	directMessageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		return nil, s.messageService.DeleteDirectMessageFavorite(ctx, gameID, directMessageID, myself.ID)
	})
	return err
}

func (m *messageUsecase) findMyGameParticipant(gameID uint32, user model.User) (*model.GameParticipant, error) {
	player, err := m.playerService.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	isEx := true
	return m.gameService.FindGameParticipant(model.GameParticipantQuery{
		GameID:        &gameID,
		PlayerID:      &(player.ID),
		IsExcludeGone: &isEx,
	})
}
