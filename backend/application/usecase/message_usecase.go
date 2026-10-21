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
	FindMessages(ctx context.Context, gameID uint32, query model.MessagesQuery, user *model.User) (model.Messages, error)
	FindMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.MessagesQuery, user *model.User) (uint64, error)
	FindMessage(ctx context.Context, gameID uint32, ID uint64, user *model.User) (*model.Message, error)
	FindMessageReplies(ctx context.Context, gameID uint32, messageID uint64, user *model.User) ([]model.Message, error)
	FindThreadMessages(ctx context.Context, gameID uint32, messageID uint64, user *model.User) ([]model.Message, error)
	FindMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, messageID uint64, user *model.User) (model.GameParticipants, error)
	RegisterMessage(ctx context.Context, gameID uint32, user model.User, message model.Message) error
	RegisterMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.Message) (*model.Message, error)
	RegisterMessageFavorite(ctx context.Context, gameID uint32, user model.User, messageID uint64) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, user model.User, messageID uint64) error
	// participant group
	FindGameParticipantGroups(ctx context.Context, query model.GameParticipantGroupsQuery, user *model.User) ([]model.GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, user model.User, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error)
	UpdateGameParticipantGroup(ctx context.Context, user model.User, gameID uint32, group model.GameParticipantGroup) error
	// direct message
	FindDirectMessages(ctx context.Context, gameID uint32, query model.DirectMessagesQuery, user *model.User) (model.DirectMessages, error)
	FindDirectMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.DirectMessagesQuery, user *model.User) (uint64, error)
	FindDirectMessage(ctx context.Context, gameID uint32, ID uint64, user *model.User) (*model.DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, directMessageID uint64, user *model.User) (model.GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) error
	RegisterDirectMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) (*model.DirectMessage, error)
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, user model.User, directMessageID uint64) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, user model.User, directMessageID uint64) error
}

type messageUsecase struct {
	messageService          app_service.MessageService
	gameService             app_service.GameService
	playerService           app_service.PlayerService
	messageDomainService    dom_service.MessageDomainService
	gameMasterDomainService dom_service.GameMasterDomainService
	transaction             Transaction
}

func NewMessageUsecase(
	messageService app_service.MessageService,
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	messageDomainService dom_service.MessageDomainService,
	gameMasterDomainService dom_service.GameMasterDomainService,
	tx Transaction,
) MessageUsecase {
	return &messageUsecase{
		messageService:          messageService,
		gameService:             gameService,
		playerService:           playerService,
		messageDomainService:    messageDomainService,
		gameMasterDomainService: gameMasterDomainService,
		transaction:             tx,
	}
}

// FindMessages implements MessageService.
func (s *messageUsecase) FindMessages(ctx context.Context, gameID uint32, query model.MessagesQuery, user *model.User) (model.Messages, error) {
	mergedQuery, myself, err := s.MergeQuery(ctx, gameID, query, user)
	if err != nil {
		return model.Messages{}, err
	}
	if mergedQuery == nil {
		return model.Messages{}, nil
	}

	return s.messageService.FindMessages(ctx, gameID, *mergedQuery, myself)
}

// FindMessagesLatestUnixTimeMilli implements MessageUsecase.
func (s *messageUsecase) FindMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.MessagesQuery, user *model.User) (uint64, error) {
	mergedQuery, myself, err := s.MergeQuery(ctx, gameID, query, user)
	if err != nil {
		return 0, err
	}
	if mergedQuery == nil {
		return 0, nil
	}
	return s.messageService.FindMessagesLatestUnixTimeMilli(ctx, gameID, *mergedQuery, myself)
}

func (s *messageUsecase) MergeQuery(ctx context.Context, gameID uint32, query model.MessagesQuery, user *model.User) (*model.MessagesQuery, *model.GameParticipant, error) {
	game, err := s.gameService.FindGame(ctx, gameID)
	if err != nil {
		return nil, nil, err
	}
	if game == nil {
		return nil, nil, nil
	}
	var myself *model.GameParticipant = nil
	var player *model.Player = nil
	authorities := []model.PlayerAuthority{}
	if user != nil {
		myself, err = s.findMyGameParticipant(ctx, gameID, *user)
		if err != nil {
			return nil, nil, err
		}
		player, err = s.playerService.FindByUserName(ctx, user.UserName)
		if err != nil {
			return nil, nil, err
		}
		if player != nil {
			authorities, err = s.playerService.FindAuthorities(ctx, player.ID)
			if err != nil {
				return nil, nil, err
			}
		}
	}
	// merge message types
	requestMessageTypes := model.MessageTypeValues()
	if query.Types != nil {
		requestMessageTypes = *query.Types
	}
	viewableMessageTypes := s.messageDomainService.GetViewableMessageTypes(*game, authorities)
	// GM 全発言閲覧設定が ON のゲームでは、GM は monologue / secret を含む全タイプを閲覧可能。
	// これにより以降の type フィルタが自然に全タイプを許容し、独り言/秘話の "自分宛のみ" 拡張も不要になる。
	// Admin も GM 扱いとするため gameMasterDomainService.IsGameMaster を使用する。
	if game.Settings.Rule.IsGameMasterViewAllMessages && player != nil &&
		s.gameMasterDomainService.IsGameMaster(*game, *player, authorities) {
		viewableMessageTypes = model.MessageTypeValues()
	}
	// viewable 側を基準に絞り込むことで、リクエストに同じタイプが重複していても結果は重複しない
	// (重複を残すと下の件数判定で全タイプ扱いになり、type フィルタが外れてしまう)
	types := array.Filter(viewableMessageTypes, func(v model.MessageType) bool {
		return array.Any(requestMessageTypes, func(t model.MessageType) bool {
			return v == t
		})
	})
	// 全タイプが viewable な場合は query.Types を nil にし、type フィルタ自体を無効化する。
	// （GM 全発言閲覧 ON 時はここで全タイプが残るため、後段の DB クエリで type 制約が付かない）
	// それ以外は必ず絞り込んだ結果で上書きする (クライアント指定のリストを残さない)
	if len(types) == len(model.MessageTypeValues()) {
		query.Types = nil
	} else {
		query.Types = &types
	}
	// 独り言を取得するか
	shouldIncludeMonologue := shouldIncludeMonologue(query, requestMessageTypes, myself)
	query.IncludeMonologue = &shouldIncludeMonologue
	shouldIncludeSecret := shouldIncludeSecret(query, requestMessageTypes, myself)
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

func shouldIncludeSecret(
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
// FindMessage は閲覧できない発言 (他人の独り言・秘話など) なら nil を返す
func (s *messageUsecase) FindMessage(ctx context.Context, gameID uint32, ID uint64, user *model.User) (*model.Message, error) {
	message, err := s.messageService.FindMessage(ctx, gameID, ID)
	if err != nil || message == nil {
		return nil, err
	}
	// 誰でも見られる種別なら判定を省く。判定 (MergeQuery) はゲーム全体を読み込んで重く、
	// 画面は返信先のプレビューのために返信 1 件ごとにこの API を呼ぶため
	if array.Any(model.MesssageTypeEveryoneViewableValues(), func(t model.MessageType) bool { return t == message.Type }) {
		return message, nil
	}
	isViewable, err := s.viewableMessageFilter(ctx, gameID, user)
	if err != nil {
		return nil, err
	}
	if !isViewable(*message) {
		return nil, nil
	}
	return message, nil
}

func (s *messageUsecase) FindMessageReplies(ctx context.Context, gameID uint32, messageID uint64, user *model.User) ([]model.Message, error) {
	isViewable, myself, err := s.viewableMessageFilterWithMyself(ctx, gameID, user)
	if err != nil {
		return nil, err
	}
	// 閲覧できない発言への返信一覧は返さない
	message, err := s.messageService.FindMessage(ctx, gameID, messageID)
	if err != nil {
		return nil, err
	}
	if message == nil || !isViewable(*message) {
		// スキーマ上 null にできないので空のリストを返す
		return []model.Message{}, nil
	}
	replies, err := s.messageService.FindMessageReplies(ctx, gameID, messageID, myself)
	if err != nil {
		return nil, err
	}
	return array.Filter(replies, isViewable), nil
}

func (s *messageUsecase) FindThreadMessages(ctx context.Context, gameID uint32, messageID uint64, user *model.User) ([]model.Message, error) {
	isViewable, myself, err := s.viewableMessageFilterWithMyself(ctx, gameID, user)
	if err != nil {
		return nil, err
	}
	// 閲覧できない発言のスレッドは返さない
	message, err := s.messageService.FindMessage(ctx, gameID, messageID)
	if err != nil {
		return nil, err
	}
	if message == nil || !isViewable(*message) {
		// スキーマ上 null にできないので空のリストを返す
		return []model.Message{}, nil
	}
	messages, err := s.messageService.FindThreadMessages(ctx, gameID, messageID, myself)
	if err != nil {
		return nil, err
	}
	// リプライ元・リプライ先のうち閲覧できない発言を除く
	return array.Filter(messages, isViewable), nil
}

func (s *messageUsecase) FindMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, messageID uint64, user *model.User) (model.GameParticipants, error) {
	message, err := s.FindMessage(ctx, gameID, messageID, user)
	if err != nil {
		return model.GameParticipants{}, err
	}
	if message == nil {
		return model.GameParticipants{}, fmt.Errorf("message not found")
	}
	return s.messageService.FindMessageFavoriteGameParticipants(ctx, gameID, messageID)
}

// viewableMessageFilter は発言一覧 (MergeQuery) と同じルールで、発言を 1 件ずつ閲覧できるか判定する関数を返す
func (s *messageUsecase) viewableMessageFilter(ctx context.Context, gameID uint32, user *model.User) (func(model.Message) bool, error) {
	isViewable, _, err := s.viewableMessageFilterWithMyself(ctx, gameID, user)
	return isViewable, err
}

func (s *messageUsecase) viewableMessageFilterWithMyself(
	ctx context.Context,
	gameID uint32,
	user *model.User,
) (func(model.Message) bool, *model.GameParticipant, error) {
	query, myself, err := s.MergeQuery(ctx, gameID, model.MessagesQuery{}, user)
	if err != nil {
		return nil, nil, err
	}
	if query == nil {
		return func(model.Message) bool { return false }, nil, nil
	}
	return func(m model.Message) bool {
		return isViewableMessage(m, *query, myself)
	}, myself, nil
}

// isViewableMessage は MergeQuery で組み立てた条件 (DB クエリの setMessageTypeDbQuery と同じ判定) を 1 件の発言に適用する
func isViewableMessage(m model.Message, query model.MessagesQuery, myself *model.GameParticipant) bool {
	if query.Types == nil {
		return true
	}
	if array.Any(*query.Types, func(t model.MessageType) bool { return t == m.Type }) {
		return true
	}
	if myself == nil {
		return false
	}
	isSender := m.Sender != nil && m.Sender.GameParticipantID == myself.ID
	isReceiver := m.Receiver != nil && m.Receiver.GameParticipantID == myself.ID
	if query.IncludeMonologue != nil && *query.IncludeMonologue && m.Type == model.MessageTypeMonologue && isSender {
		return true
	}
	if query.IncludeSecret != nil && *query.IncludeSecret && m.Type == model.MessageTypeSecret && (isSender || isReceiver) {
		return true
	}
	return false
}

func (s *messageUsecase) RegisterMessage(
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.Message,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		msg, err := s.assertRegisterMessage(ctx, gameID, user, message)
		if err != nil {
			return nil, err
		}
		game, err := s.gameService.FindGame(ctx, gameID)
		if err != nil {
			return nil, err
		}
		if message.ReplyTo != nil {
			// 閲覧できない発言には返信できない (返信の宛先から他人の秘話・独り言の発言者が分かってしまうため)
			replyToMessage, err := s.FindMessage(ctx, gameID, message.ReplyTo.MessageID, &user)
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
	msg, err := s.assertRegisterMessage(ctx, gameID, user, message)
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
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.Message,
) (*model.Message, error) {
	game, err := s.gameService.FindGame(ctx, gameID)
	if err != nil {
		return nil, err
	}
	player, err := s.playerService.FindByUserName(ctx, user.UserName)
	if err != nil {
		return nil, err
	}
	myself, err := s.findMyGameParticipant(ctx, gameID, user)
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
		receiverParticipant, err := s.gameService.FindGameParticipant(ctx, model.GameParticipantQuery{
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
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
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
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
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

func (s *messageUsecase) FindGameParticipantGroups(ctx context.Context, query model.GameParticipantGroupsQuery, user *model.User) ([]model.GameParticipantGroup, error) {
	// グループ名とメンバーも非公開情報なので、未ログインでは返さない
	if user == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	canViewAll, err := s.canViewAllDirectMessages(ctx, query.GameID, *user)
	if err != nil {
		return nil, err
	}
	if !canViewAll {
		// MemberGroupParticipantID 未指定は「全 DM グループ一覧」リクエスト。
		// GM 全発言閲覧設定が ON のゲームの GM / Admin のみ許可する。
		// フロント (direct-message-groups-area.tsx) は GM 全発言閲覧 ON ゲームの GM のみこの形式で呼ぶ。
		// （admin はゲーム設定によらず常に許可、というポリシーも考えられるが、
		//   IsGameMaster で admin も GM として扱う以上、設定 OFF のゲームでは admin も含めて禁止する）
		if query.MemberGroupParticipantID == nil {
			return nil, fmt.Errorf("forbidden: only game masters can list all groups when isGameMasterViewAllMessages is enabled")
		}
		// 参加者を指定した一覧は自分の分だけ。他人が入っているグループの名前・メンバーは返さない
		myself, err := s.findMyGameParticipant(ctx, query.GameID, *user)
		if err != nil {
			return nil, err
		}
		if myself == nil || myself.ID != *query.MemberGroupParticipantID {
			return nil, fmt.Errorf("forbidden: can only list your own groups")
		}
	}
	return s.messageService.FindGameParticipantGroups(ctx, query)
}

func (s *messageUsecase) RegisterGameParticipantGroup(
	ctx context.Context,
	user model.User,
	gameID uint32,
	group model.GameParticipantGroup,
) (*model.GameParticipantGroup, error) {
	saved, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
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
		groups, err := s.messageService.FindGameParticipantGroups(ctx, model.GameParticipantGroupsQuery{
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
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
		if err != nil {
			return nil, err
		}
		if myself == nil {
			return nil, errors.New("ゲームに参加していません")
		}
		groups, err := s.messageService.FindGameParticipantGroups(ctx, model.GameParticipantGroupsQuery{
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
func (s *messageUsecase) FindDirectMessages(ctx context.Context, gameID uint32, query model.DirectMessagesQuery, user *model.User) (model.DirectMessages, error) {
	if query.GameParticipantGroupID == nil {
		return model.DirectMessages{}, errors.New("participant group is required")
	}
	if err := s.assertViewableDirectMessageGroup(ctx, gameID, *query.GameParticipantGroupID, user); err != nil {
		return model.DirectMessages{}, err
	}
	return s.messageService.FindDirectMessages(ctx, gameID, query)
}

// FindDirectMessagesLatestUnixTimeMilli implements MessageUsecase.
func (s *messageUsecase) FindDirectMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.DirectMessagesQuery, user *model.User) (uint64, error) {
	if query.GameParticipantGroupID == nil {
		return 0, errors.New("participant group is required")
	}
	if err := s.assertViewableDirectMessageGroup(ctx, gameID, *query.GameParticipantGroupID, user); err != nil {
		return 0, err
	}
	return s.messageService.FindDirectMessagesLatestUnixTimeMilli(ctx, gameID, query)
}

// FindDirectMessage implements MessageService.
func (s *messageUsecase) FindDirectMessage(ctx context.Context, gameID uint32, ID uint64, user *model.User) (*model.DirectMessage, error) {
	dm, err := s.messageService.FindDirectMessage(ctx, gameID, ID)
	if err != nil || dm == nil {
		return nil, err
	}
	if err := s.assertViewableDirectMessageGroup(ctx, gameID, dm.GameParticipantGroupID, user); err != nil {
		return nil, err
	}
	return dm, nil
}

// FindDirectMessageFavoriteGameParticipants implements MessageService.
func (s *messageUsecase) FindDirectMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, directMessageID uint64, user *model.User) (model.GameParticipants, error) {
	dm, err := s.FindDirectMessage(ctx, gameID, directMessageID, user)
	if err != nil {
		return model.GameParticipants{}, err
	}
	if dm == nil {
		return model.GameParticipants{}, nil
	}
	return s.messageService.FindDirectMessageFavoriteGameParticipants(ctx, gameID, directMessageID)
}

// canViewAllDirectMessages は全 DM グループを閲覧できるか (GM 全発言閲覧設定が ON のゲームの GM / Admin か) を返す。
func (s *messageUsecase) canViewAllDirectMessages(ctx context.Context, gameID uint32, user model.User) (bool, error) {
	player, err := s.playerService.FindByUserName(ctx, user.UserName)
	if err != nil {
		return false, err
	}
	if player == nil {
		return false, errors.New("player not found")
	}
	game, err := s.gameService.FindGame(ctx, gameID)
	if err != nil {
		return false, err
	}
	if game == nil {
		return false, errors.New("game not found")
	}
	if !game.Settings.Rule.IsGameMasterViewAllMessages {
		return false, nil
	}
	authorities, err := s.playerService.FindAuthorities(ctx, player.ID)
	if err != nil {
		return false, err
	}
	return s.gameMasterDomainService.IsGameMaster(*game, *player, authorities), nil
}

// assertViewableDirectMessageGroup は DM グループの閲覧可否を判定する。
// 閲覧できるのはグループのメンバーと、GM 全発言閲覧設定が ON のゲームの GM (Admin 含む) のみ。
// (画面 direct-message-groups-area.tsx で一覧に出す範囲と揃えている)
func (s *messageUsecase) assertViewableDirectMessageGroup(ctx context.Context, gameID uint32, groupID uint32, user *model.User) error {
	if user == nil {
		return errors.New("not authenticated")
	}
	canViewAll, err := s.canViewAllDirectMessages(ctx, gameID, *user)
	if err != nil {
		return err
	}
	if canViewAll {
		return nil
	}
	myself, err := s.findMyGameParticipant(ctx, gameID, *user)
	if err != nil {
		return err
	}
	if myself == nil {
		return errors.New("forbidden: not a member of this group")
	}
	groups, err := s.messageService.FindGameParticipantGroups(ctx, model.GameParticipantGroupsQuery{
		GameID:                   gameID,
		IDs:                      &[]uint32{groupID},
		MemberGroupParticipantID: &myself.ID,
	})
	if err != nil {
		return err
	}
	if len(groups) == 0 {
		return errors.New("forbidden: not a member of this group")
	}
	return nil
}

// RegisterDirectMessage implements MessageService.
func (s *messageUsecase) RegisterDirectMessage(
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.DirectMessage,
) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		msg, err := s.assertRegisterDirectMessage(ctx, gameID, user, message)
		if err != nil {
			return nil, err
		}
		game, err := s.gameService.FindGame(ctx, gameID)
		return nil, s.messageService.RegisterDirectMessage(ctx, *game, *msg)
	})
	return err
}

// RegisterDirectMessageDryRun implements MessageUsecase.
func (s *messageUsecase) RegisterDirectMessageDryRun(ctx context.Context, gameID uint32, user model.User, message model.DirectMessage) (*model.DirectMessage, error) {
	msg, err := s.assertRegisterDirectMessage(ctx, gameID, user, message)
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
	ctx context.Context,
	gameID uint32,
	user model.User,
	message model.DirectMessage,
) (*model.DirectMessage, error) {
	game, err := s.gameService.FindGame(ctx, gameID)
	if err != nil {
		return nil, err
	}
	player, err := s.playerService.FindByUserName(ctx, user.UserName)
	if err != nil {
		return nil, err
	}
	myself, err := s.findMyGameParticipant(ctx, gameID, user)
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
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
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
		myself, err := s.findMyGameParticipant(ctx, gameID, user)
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

func (m *messageUsecase) findMyGameParticipant(ctx context.Context, gameID uint32, user model.User) (*model.GameParticipant, error) {
	player, err := m.playerService.FindByUserName(ctx, user.UserName)
	if err != nil {
		return nil, err
	}
	isEx := true
	return m.gameService.FindGameParticipant(ctx, model.GameParticipantQuery{
		GameID:        &gameID,
		PlayerID:      &(player.ID),
		IsExcludeGone: &isEx,
	})
}
