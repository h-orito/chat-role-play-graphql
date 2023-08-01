package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"time"
)

type MessageUsecase interface {
	FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error)
	FindMessagesLatestUnixTimeMilli(gameID uint32, query model.MessagesQuery) (uint64, error)
	FindMessage(gameID uint32, ID uint64) (*model.Message, error)
	FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error)
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
	messageService app_service.MessageService
	gameService    app_service.GameService
	playerService  app_service.PlayerService
	transaction    Transaction
}

func NewMessageUsecase(
	messageService app_service.MessageService,
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	tx Transaction,
) MessageUsecase {
	return &messageUsecase{
		messageService: messageService,
		gameService:    gameService,
		playerService:  playerService,
		transaction:    tx,
	}
}

// FindMessages implements MessageService.
func (s *messageUsecase) FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error) {
	return s.messageService.FindMessages(gameID, query)
}

// FindMessagesLatestUnixTimeMilli implements MessageUsecase.
func (s *messageUsecase) FindMessagesLatestUnixTimeMilli(gameID uint32, query model.MessagesQuery) (uint64, error) {
	return s.messageService.FindMessagesLatestUnixTimeMilli(gameID, query)
}

// FindMessage implements MessageService.
func (s *messageUsecase) FindMessage(gameID uint32, ID uint64) (*model.Message, error) {
	return s.messageService.FindMessage(gameID, ID)
}

// FindMessageReplies implements MessageService.
func (s *messageUsecase) FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error) {
	return s.messageService.FindMessageReplies(gameID, messageID)
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
		return nil, s.messageService.RegisterMessage(ctx, gameID, *msg)
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
	myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
		GameID:   &gameID,
		PlayerID: &player.ID,
	})
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
		}
	}
	return &model.Message{
		GamePeriodID: latestPeriod.ID,
		Type:         message.Type,
		Sender:       sender,
		ReplyTo:      message.ReplyTo,
		Content:      message.Content,
	}, nil
}

// RegisterMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	messageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
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
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
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
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
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
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
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
		return nil, s.messageService.RegisterDirectMessage(ctx, gameID, *msg)
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
	myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
		GameID:   &gameID,
		PlayerID: &player.ID,
	})
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
		}
	}
	return &model.DirectMessage{
		GameParticipantGroupID: message.GameParticipantGroupID,
		GamePeriodID:           latestPeriod.ID,
		Type:                   message.Type,
		Sender:                 sender,
		Content:                message.Content,
	}, nil
}

// RegisterDirectMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterDirectMessageFavorite(
	ctx context.Context,
	gameID uint32,
	user model.User,
	directMessageID uint64,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
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
		player, err := s.playerService.FindByUserName(user.UserName)
		if err != nil {
			return nil, err
		}
		myself, err := s.gameService.FindGameParticipant(model.GameParticipantQuery{
			GameID:   &gameID,
			PlayerID: &player.ID,
		})
		if err != nil {
			return nil, err
		}
		return nil, s.messageService.DeleteDirectMessageFavorite(ctx, gameID, directMessageID, myself.ID)
	})
	return err
}
