package db

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"gorm.io/gorm"
)

type MessageRepository struct {
	db *DB
}

func NewMessageRepository(db *DB) *MessageRepository {
	return &MessageRepository{db: db}
}

func (repo *MessageRepository) FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error) {
	return findMessages(repo.db.Connection, gameID, query)
}

func (repo *MessageRepository) FindMessagesLatestUnixTimeMilli(gameID uint32, query model.MessagesQuery) (uint64, error) {
	return selectMaxMessageSendUnixTimeMilli(repo.db.Connection, gameID, query)
}

func (repo *MessageRepository) FindMessage(gameID uint32, ID uint64) (*model.Message, error) {
	return findMessage(repo.db.Connection, gameID, ID)
}

func (repo *MessageRepository) FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error) {
	messages, err := findMessages(repo.db.Connection, gameID, model.MessagesQuery{
		ReplyToMessageID: &messageID,
	})
	if err != nil {
		return nil, err
	}
	return messages.List, nil
}

func (repo *MessageRepository) FindMessageFavoriteGameParticipants(
	gameID uint32,
	messageID uint64,
) (model.GameParticipants, error) {
	return findMessageFavoriteGameParticipants(repo.db.Connection, gameID, messageID)
}

func (repo *MessageRepository) RegisterMessage(ctx context.Context, gameID uint32, message model.Message) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return registerMessage(tx, gameID, message)
}

func (repo *MessageRepository) RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return registerMessageFavorite(tx, gameID, messageID, gameParticipantID)
}

func (repo *MessageRepository) DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return deleteMessageFavorite(tx, gameID, messageID, gameParticipantID)
}

func (repo *MessageRepository) FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	return findGameParticipantGroups(repo.db.Connection, query)
}

func (repo *MessageRepository) RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerGameParticipantGroup(tx, gameID, group)
}

func (repo *MessageRepository) UpdateGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return updateGameParticipantGroup(tx, gameID, group)
}

func (repo *MessageRepository) FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	return findDirectMessages(repo.db.Connection, gameID, query)
}

func (repo *MessageRepository) FindDirectMessagesLatestUnixTimeMilli(gameID uint32, query model.DirectMessagesQuery) (uint64, error) {
	return selectMaxDirectMessageSendUnixTimeMilli(repo.db.Connection, gameID, query)
}

func (repo *MessageRepository) FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error) {
	return findDirectMessage(repo.db.Connection, gameID, ID)
}

func (repo *MessageRepository) FindDirectMessageFavoriteGameParticipants(
	gameID uint32,
	directMessageID uint64,
) (model.GameParticipants, error) {
	return findDirectMessageFavoriteGameParticipants(repo.db.Connection, gameID, directMessageID)
}

func (repo *MessageRepository) RegisterDirectMessage(ctx context.Context, gameID uint32, message model.DirectMessage) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return registerDirectMessage(tx, gameID, message)
}

func (repo *MessageRepository) RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return registerDirectMessageFavorite(tx, gameID, directMessageID, gameParticipantID)
}

func (repo *MessageRepository) DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return deleteDirectMessageFavorite(tx, gameID, directMessageID, gameParticipantID)
}

func findMessages(db *gorm.DB, gameID uint32, query model.MessagesQuery) (model.Messages, error) {
	rdb, allCount, err := findRdbMessages(db, gameID, query)
	if err != nil {
		return model.Messages{}, err
	}
	favs, err := findRdbMessageFavoritesByMessageIDs(db, gameID, array.Map(rdb, func(m Message) uint64 {
		return m.ID
	}))
	if err != nil {
		return model.Messages{}, err
	}
	list := array.Map(rdb, func(m Message) model.Message {
		pIDs := array.Map(array.Filter(favs, func(fav MessageFavorite) bool {
			return fav.MessageID == m.ID
		}), func(fav MessageFavorite) uint32 {
			return fav.GameParticipantID
		})

		return *m.ToModel(pIDs)
	})
	latestUnixTimeMilli, err := selectMaxMessageSendUnixTimeMilli(db, gameID, query)
	if err != nil {
		return model.Messages{}, err
	}
	ms := model.Messages{
		List:                list,
		AllPageCount:        1,
		HasPrePage:          false,
		HasNextPage:         false,
		CurrentPageNumber:   nil,
		IsDesc:              false,
		LatestUnixTimeMilli: latestUnixTimeMilli,
	}
	if query.Paging != nil {
		allPageCount := uint32(math.Ceil(float64(allCount) / float64(query.Paging.PageSize)))
		ms.AllPageCount = allPageCount
		ms.HasPrePage = query.Paging.PageNumber != 1
		ms.HasNextPage = uint32(query.Paging.PageNumber) < allPageCount
		pn := uint32(query.Paging.PageNumber)
		ms.CurrentPageNumber = &pn
		ms.IsDesc = query.Paging.Desc
	}
	return ms, nil
}

// TODO: 独り言のことは後で考える
func findRdbMessages(
	db *gorm.DB,
	gameID uint32,
	query model.MessagesQuery,
) (
	list []Message,
	allCount int64,
	err error,
) {
	var rdb []Message
	result := db.Model(&Message{}).Where("game_id = ?", gameID)
	// paging以外のwhere句をセット
	setMessageDbQuery(result, query)

	var count int64
	if query.Paging != nil {
		// ページングする前に全件数を取得する
		countResult := result.Count(&count)
		if errors.Is(countResult.Error, gorm.ErrRecordNotFound) {
			return nil, 0, nil
		}
		if countResult.Error != nil {
			return nil, 0, fmt.Errorf("failed to find: %s \n", result.Error)
		}
		result = result.Scopes(Paginate(query.Paging))
	}

	result = result.Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, 0, nil
	}
	if result.Error != nil {
		return nil, 0, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	return rdb, count, nil
}

// paging以外のwhere句を追加
func setMessageDbQuery(db *gorm.DB, query model.MessagesQuery) {
	if query.IDs != nil {
		db = db.Where("id IN (?)", *query.IDs)
	}
	if query.GamePeriodID != nil {
		db = db.Where("game_period_id = ?", *query.GamePeriodID)
	}
	if query.Types != nil {
		typeCodes := array.Map(*query.Types, func(t model.MessageType) string {
			return t.String()
		})
		db = db.Where("message_type_code IN (?)", typeCodes)
	}
	if query.SenderIDs != nil {
		db = db.Where("sender_game_participant_id IN (?)", *query.SenderIDs)
	}
	if query.ReplyToMessageID != nil {
		db = db.Where("reply_to_message_id = ?", *query.ReplyToMessageID)
	}
	if query.Keywords != nil {
		db = db.Scopes(Like("message_content", *query.Keywords))
	}
	if query.SinceAt != nil {
		db = db.Where("send_at >= ?", *query.SinceAt)
	}
	if query.UntilAt != nil {
		db = db.Where("send_at <= ?", *query.UntilAt)
	}
	if query.OffsetUnixtimeMilli != nil {
		db = db.Where("send_unixtime_milli > ?", *query.OffsetUnixtimeMilli)
	}
}

func selectMaxMessageSendUnixTimeMilli(db *gorm.DB, gameID uint32, query model.MessagesQuery) (uint64, error) {
	var max *float64
	result := db.Table("messages").Select("MAX(send_unixtime_milli)").Where("game_id = ?", gameID)
	setMessageDbQuery(result, query)
	result = result.Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	if max == nil {
		if query.OffsetUnixtimeMilli != nil {
			return *query.OffsetUnixtimeMilli, nil
		} else {
			return 0, nil
		}
	}
	return uint64(*max), nil
}

func findMessage(db *gorm.DB, gameID uint32, ID uint64) (*model.Message, error) {
	rdb, err := findRdbMessage(db, gameID, ID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	favs, err := findRdbMessageFavorites(db, gameID, ID)
	if err != nil {
		return nil, err
	}
	favPIDs := array.Map(favs, func(fav MessageFavorite) uint32 {
		return fav.GameParticipantID
	})
	return rdb.ToModel(favPIDs), nil
}

func findRdbMessage(db *gorm.DB, gameID uint32, ID uint64) (*Message, error) {
	var rdb Message
	result := db.Model(&Message{}).Where("game_id = ?", gameID).Where("id = ?", ID).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdb, nil
}

func findMessageFavoriteGameParticipants(db *gorm.DB, gameID uint32, messageID uint64) (model.GameParticipants, error) {
	rdbFavorites, err := findRdbMessageFavorites(db, gameID, messageID)
	if err != nil {
		return model.GameParticipants{}, err
	}
	if len(rdbFavorites) == 0 {
		return model.GameParticipants{}, nil
	}
	gameParticipantIDs := array.Map(rdbFavorites, func(f MessageFavorite) uint32 {
		return f.GameParticipantID
	})
	return findGameParticipants(db, model.GameParticipantsQuery{
		IDs: &gameParticipantIDs,
	})

}

func registerMessage(tx *gorm.DB, gameID uint32, message model.Message) error {
	rdb := Message{
		GameID:            gameID,
		GamePeriodID:      message.GamePeriodID,
		MessageTypeCode:   message.Type.String(),
		MessageContent:    message.Content.Text,
		IsConvertDisabled: message.Content.IsConvertDisabled,
		ReplyCount:        0,
		FavoriteCount:     0,
	}
	if message.Sender != nil {
		rdb.SenderGameParticipantID = &message.Sender.GameParticipantID
		rdb.SenderIconID = &message.Sender.SenderIconID
		rdb.SenderName = &message.Sender.SenderName
	}
	if message.ReplyTo != nil {
		rdb.ReplyToMessageID = &message.ReplyTo.MessageID
		rdb.ReplyToGameParticipantID = &message.ReplyTo.GameParticipantID
	}
	now := time.Now()
	rdb.SendAt = now
	rdb.SendUnixtimeMilli = uint64(now.UnixMilli())

	var messageNumber uint32
	messageNumber, err := selectMaxMessageNumber(tx, gameID, message)
	if err != nil {
		return err
	}
	for i := 0; i < 5; i++ {
		messageNumber += 1
		rdb.MessageNumber = messageNumber
		result := tx.Create(&rdb)
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			continue
		}
		if result.Error != nil {
			return fmt.Errorf("failed to create: %s \n", result.Error)
		}
		if message.ReplyTo != nil {
			updateReplyCount(tx, message.ReplyTo.MessageID)
		}
		return nil
	}
	return fmt.Errorf("failed to create: duplicated key \n")
}

func selectMaxMessageNumber(db *gorm.DB, gameID uint32, message model.Message) (uint32, error) {
	var max *float64
	result := db.Table("messages").Select("MAX(message_number)").
		Where("game_id = ?", gameID).
		Where("message_type_code = ?", message.Type.String()).
		Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	if max == nil {
		return 0, nil
	}
	return uint32(*max), nil
}

func updateReplyCount(tx *gorm.DB, messageID uint64) error {
	var count int64
	result := tx.Model(&Message{}).Where("reply_to_message_id = ?", messageID).Count(&count)
	if result.Error != nil {
		return fmt.Errorf("failed to find: %s \n", result.Error)
	}
	result = tx.Model(&Message{}).Where("id = ?", messageID).Update("reply_count", count)
	if result.Error != nil {
		return fmt.Errorf("failed to update: %s \n", result.Error)
	}
	return nil
}

func findRdbMessageFavoritesByMessageIDs(db *gorm.DB, gameID uint32, messageIDs []uint64) ([]MessageFavorite, error) {
	var rdb []MessageFavorite
	result := db.Model(&MessageFavorite{}).Where("game_id = ?", gameID).Where("message_id in (?)", messageIDs).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func findRdbMessageFavorites(db *gorm.DB, gameID uint32, messageID uint64) ([]MessageFavorite, error) {
	var rdb []MessageFavorite
	result := db.Model(&MessageFavorite{}).Where("game_id = ?", gameID).Where("message_id = ?", messageID).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func registerMessageFavorite(tx *gorm.DB, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	exists, err := findRdbMessageFavorites(tx, gameID, messageID)
	if err != nil {
		return err
	}
	if array.Any(exists, func(f MessageFavorite) bool {
		return f.GameParticipantID == gameParticipantID
	}) {
		// すでに登録済み
		return nil
	}
	rdb := MessageFavorite{
		GameID:            gameID,
		MessageID:         messageID,
		GameParticipantID: gameParticipantID,
	}
	result := tx.Create(&rdb)
	if result.Error != nil {
		return fmt.Errorf("failed to create: %s \n", result.Error)
	}
	// update favorite count
	result = tx.Model(&Message{}).Where("id = ?", messageID).Update("favorite_count", len(exists)+1)
	if result.Error != nil {
		return fmt.Errorf("failed to update: %s \n", result.Error)
	}
	return nil
}

func deleteMessageFavorite(tx *gorm.DB, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	exists, err := findRdbMessageFavorites(tx, gameID, messageID)
	if err != nil {
		return err
	}
	if array.None(exists, func(f MessageFavorite) bool {
		return f.GameParticipantID == gameParticipantID
	}) {
		// すでに削除済み
		return nil
	}
	tx.Where("game_id = ? AND message_id = ? AND game_participant_id = ?", gameID, messageID, gameParticipantID).Delete(&MessageFavorite{})
	// update favorite count
	result := tx.Model(&Message{}).Where("id = ?", messageID).Update("favorite_count", len(exists)-1)
	if result.Error != nil {
		return fmt.Errorf("failed to update: %s \n", result.Error)
	}
	return nil
}

func findGameParticipantGroups(db *gorm.DB, query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	rdbs, err := findRdbGameParticipantGroups(db, query)
	if err != nil {
		return nil, err
	}
	ids := array.Map(rdbs, func(rdb GameParticipantGroup) uint32 {
		return rdb.ID
	})
	members, err := findRdbGameParticipantGroupMembers(db, GameParticipantGroupMembersQuery{IDs: &ids})
	if err != nil {
		return nil, err
	}
	return array.Map(rdbs, func(rdb GameParticipantGroup) model.GameParticipantGroup {
		m := array.Map(array.Filter(members, func(m GameParticipantGroupMember) bool {
			return m.GameParticipantGroupID == rdb.ID
		}), func(m GameParticipantGroupMember) uint32 {
			return m.GameParticipantID
		})
		return *rdb.ToModel(m)
	}), nil
}

func findRdbGameParticipantGroups(db *gorm.DB, query model.GameParticipantGroupsQuery) ([]GameParticipantGroup, error) {
	var rdb []GameParticipantGroup
	result := db.Model(&GameParticipantGroup{}).Where("game_id = ?", query.GameID)
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.MemberGroupParticipantID != nil {
		result = result.
			Joins("inner join game_participant_group_members on game_participant_group_members.game_participant_group_id = game_participant_groups.id").
			Where("game_participant_id = ?", *query.MemberGroupParticipantID)
	}
	result = result.Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func findRdbGameParticipantGroupMembers(db *gorm.DB, query GameParticipantGroupMembersQuery) ([]GameParticipantGroupMember, error) {
	var rdb []GameParticipantGroupMember
	result := db.Model(&GameParticipantGroupMember{})
	if query.ID != nil {
		result = result.Where("game_participant_group_id = ?", *query.ID)
	}
	if query.IDs != nil {
		result = result.Where("game_participant_group_id IN (?)", *query.IDs)
	}
	result = result.Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

type GameParticipantGroupMembersQuery struct {
	ID  *uint32
	IDs *[]uint32
}

func registerGameParticipantGroup(tx *gorm.DB, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error) {
	rdb := GameParticipantGroup{
		GameID:                   gameID,
		GameParticipantGroupName: group.Name,
	}
	result := tx.Create(&rdb)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to create: %s \n", result.Error)
	}
	var err error
	array.ForEach(group.MemberIDs, func(id uint32) {
		rdbMember := GameParticipantGroupMember{
			GameParticipantGroupID: rdb.ID,
			GameParticipantID:      id,
		}
		memberResult := tx.Create(&rdbMember)
		if memberResult.Error != nil {
			err = fmt.Errorf("failed to create member: %s \n", memberResult.Error)
		}
	})
	if err != nil {
		return nil, err
	}
	return rdb.ToModel(group.MemberIDs), nil
}

func updateGameParticipantGroup(tx *gorm.DB, gameID uint32, group model.GameParticipantGroup) error {
	if err := tx.Model(&GameParticipantGroup{}).
		Where("id = ? and game_id = ?", group.ID, gameID).
		Update("game_participant_group_name", group.Name).
		Error; err != nil {
		return err
	}
	return nil
}

func findDirectMessages(db *gorm.DB, gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	rdb, allCount, err := findRdbDirectMessages(db, gameID, query)
	if err != nil {
		return model.DirectMessages{}, err
	}
	favs, err := findRdbDirectMessageFavoritesByMessageIDs(db, gameID, array.Map(rdb, func(m DirectMessage) uint64 {
		return m.ID
	}))
	if err != nil {
		return model.DirectMessages{}, err
	}
	list := array.Map(rdb, func(m DirectMessage) model.DirectMessage {
		favPIDs := array.Map(array.Filter(favs, func(f DirectMessageFavorite) bool {
			return f.DirectMessageID == m.ID
		}), func(f DirectMessageFavorite) uint32 {
			return f.GameParticipantID
		})
		return *m.ToModel(favPIDs)
	})
	latest, err := selectMaxDirectMessageSendUnixTimeMilli(db, gameID, query)
	if err != nil {
		return model.DirectMessages{}, err
	}
	ms := model.DirectMessages{
		List:                list,
		AllPageCount:        1,
		HasPrePage:          false,
		HasNextPage:         false,
		CurrentPageNumber:   nil,
		IsDesc:              false,
		LatestUnixTimeMilli: latest,
	}
	if query.Paging != nil {
		allPageCount := uint32(math.Ceil(float64(allCount) / float64(query.Paging.PageSize)))
		ms.AllPageCount = allPageCount
		ms.HasPrePage = query.Paging.PageNumber != 1
		ms.HasNextPage = uint32(query.Paging.PageNumber) < allPageCount
		pn := uint32(query.Paging.PageNumber)
		ms.CurrentPageNumber = &pn
		ms.IsDesc = query.Paging.Desc
	}
	return ms, nil
}

func findRdbDirectMessages(db *gorm.DB, gameID uint32, query model.DirectMessagesQuery) ([]DirectMessage, int64, error) {
	var rdb []DirectMessage
	result := db.Model(&DirectMessage{}).Where("game_id = ?", gameID)
	// paging以外のwhere句セット
	setDirectMessageDbQuery(result, query)

	var count int64
	if query.Paging != nil {
		// ページングする前に全件数を取得する
		countResult := result.Count(&count)
		if errors.Is(countResult.Error, gorm.ErrRecordNotFound) {
			return nil, 0, nil
		}
		if countResult.Error != nil {
			return nil, 0, fmt.Errorf("failed to find: %s \n", result.Error)
		}
		result = result.Scopes(Paginate(query.Paging))
	}

	result = result.Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, 0, nil
	}
	if result.Error != nil {
		return nil, 0, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, count, nil
}

func setDirectMessageDbQuery(db *gorm.DB, query model.DirectMessagesQuery) {
	if query.IDs != nil {
		db = db.Where("id IN (?)", *query.IDs)
	}
	if query.GameParticipantGroupID != nil {
		db = db.Where("game_participant_group_id = ?", *query.GameParticipantGroupID)
	}
	if query.GamePeriodID != nil {
		db = db.Where("game_period_id = ?", *query.GamePeriodID)
	}
	if query.Types != nil {
		typeCodes := array.Map(*query.Types, func(t model.MessageType) string {
			return t.String()
		})
		db = db.Where("message_type_code IN (?)", typeCodes)
	}
	if query.SenderIDs != nil {
		db = db.Where("sender_game_participant_id IN (?)", *query.SenderIDs)
	}
	if query.Keywords != nil {
		db = db.Scopes(Like("message_content", *query.Keywords))
	}
	if query.SinceAt != nil {
		db = db.Where("send_at >= ?", *query.SinceAt)
	}
	if query.UntilAt != nil {
		db = db.Where("send_at <= ?", *query.UntilAt)
	}
	if query.OffsetUnixtimeMilli != nil {
		db = db.Where("send_unixtime_milli > ?", *query.OffsetUnixtimeMilli)
	}
}

func selectMaxDirectMessageSendUnixTimeMilli(db *gorm.DB, gameID uint32, query model.DirectMessagesQuery) (uint64, error) {
	var max *float64
	result := db.Table("direct_messages").Select("MAX(send_unixtime_milli)").Where("game_id = ?", gameID)
	setDirectMessageDbQuery(result, query)
	result = result.Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	if max == nil {
		if query.OffsetUnixtimeMilli != nil {
			return *query.OffsetUnixtimeMilli, nil
		} else {
			return 0, nil
		}
	}
	return uint64(*max), nil
}

func findDirectMessage(db *gorm.DB, gameID uint32, ID uint64) (*model.DirectMessage, error) {
	rdb, err := findRdbDirectMessage(db, gameID, ID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	favs, err := findRdbDirectMessageFavorites(db, gameID, ID)
	if err != nil {
		return nil, err
	}
	pIDs := array.Map(favs, func(f DirectMessageFavorite) uint32 {
		return f.GameParticipantID
	})
	return rdb.ToModel(pIDs), nil
}

func findRdbDirectMessage(db *gorm.DB, gameID uint32, ID uint64) (*DirectMessage, error) {
	var rdb DirectMessage
	result := db.Model(&DirectMessage{}).Where("game_id = ?", gameID).Where("id = ?", ID).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdb, nil
}

func findDirectMessageFavoriteGameParticipants(db *gorm.DB, gameID uint32, directMessageID uint64) (model.GameParticipants, error) {
	rdbFavorites, err := findRdbDirectMessageFavorites(db, gameID, directMessageID)
	if err != nil {
		return model.GameParticipants{}, err
	}
	if len(rdbFavorites) == 0 {
		return model.GameParticipants{}, nil
	}
	gameParticipantIDs := array.Map(rdbFavorites, func(f DirectMessageFavorite) uint32 {
		return f.GameParticipantID
	})
	return findGameParticipants(db, model.GameParticipantsQuery{
		IDs: &gameParticipantIDs,
	})

}

func findRdbDirectMessageFavoritesByMessageIDs(db *gorm.DB, gameID uint32, directMessageIDs []uint64) ([]DirectMessageFavorite, error) {
	var rdb []DirectMessageFavorite
	result := db.Model(&DirectMessageFavorite{}).Where("game_id = ?", gameID).Where("direct_message_id in (?)", directMessageIDs).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func findRdbDirectMessageFavorites(db *gorm.DB, gameID uint32, directMessageID uint64) ([]DirectMessageFavorite, error) {
	var rdb []DirectMessageFavorite
	result := db.Model(&DirectMessageFavorite{}).Where("game_id = ?", gameID).Where("direct_message_id = ?", directMessageID).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func registerDirectMessage(tx *gorm.DB, gameID uint32, message model.DirectMessage) error {
	rdb := DirectMessage{
		GameID:                 gameID,
		GameParticipantGroupID: message.GameParticipantGroupID,
		GamePeriodID:           message.GamePeriodID,
		MessageTypeCode:        message.Type.String(),
		MessageContent:         message.Content.Text,
		IsConvertDisabled:      message.Content.IsConvertDisabled,
		FavoriteCount:          0,
	}
	if message.Sender != nil {
		rdb.SenderGameParticipantID = &message.Sender.GameParticipantID
		rdb.SenderIconID = &message.Sender.SenderIconID
		rdb.SenderName = &message.Sender.SenderName
	}
	now := time.Now()
	rdb.SendAt = now
	rdb.SendUnixtimeMilli = uint64(now.UnixMilli())

	for i := 0; i < 5; i++ {
		maxMessageNumber, err := selectMaxDirectMessageNumber(tx, gameID, message)
		if err != nil {
			return err
		}
		rdb.MessageNumber = maxMessageNumber + 1
		result := tx.Create(&rdb)
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			continue
		}
		if result.Error != nil {
			return fmt.Errorf("failed to create: %s \n", result.Error)
		}
		break
	}
	return nil
}

func selectMaxDirectMessageNumber(db *gorm.DB, gameID uint32, message model.DirectMessage) (uint32, error) {
	var max float64
	result := db.Table("direct_messages").Select("MAX(message_number)").
		Where("game_id = ?", gameID).
		Where("message_type_code = ?", message.Type.String()).
		Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	return uint32(max), nil
}

func registerDirectMessageFavorite(tx *gorm.DB, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	exists, err := findRdbDirectMessageFavorites(tx, gameID, directMessageID)
	if err != nil {
		return err
	}
	if array.Any(exists, func(f DirectMessageFavorite) bool {
		return f.GameParticipantID == gameParticipantID
	}) {
		// すでに登録済み
		return nil
	}
	rdb := DirectMessageFavorite{
		GameID:            gameID,
		DirectMessageID:   directMessageID,
		GameParticipantID: gameParticipantID,
	}
	result := tx.Create(&rdb)
	if result.Error != nil {
		return fmt.Errorf("failed to create: %s \n", result.Error)
	}
	// update favorite count
	result = tx.Model(&DirectMessage{}).Where("id = ?", directMessageID).Update("favorite_count", len(exists)+1)
	if result.Error != nil {
		return fmt.Errorf("failed to update: %s \n", result.Error)
	}
	return nil
}

func deleteDirectMessageFavorite(tx *gorm.DB, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	exists, err := findRdbDirectMessageFavorites(tx, gameID, directMessageID)
	if err != nil {
		return err
	}
	if array.None(exists, func(f DirectMessageFavorite) bool {
		return f.GameParticipantID == gameParticipantID
	}) {
		// すでに削除済み
		return nil
	}
	tx.Where("game_id = ? AND direct_message_id = ? AND game_participant_id = ?", gameID, directMessageID, gameParticipantID).Delete(&DirectMessageFavorite{})
	// update favorite count
	result := tx.Model(&DirectMessage{}).Where("id = ?", directMessageID).Update("favorite_count", len(exists)-1)
	if result.Error != nil {
		return fmt.Errorf("failed to update: %s \n", result.Error)
	}
	return nil
}
