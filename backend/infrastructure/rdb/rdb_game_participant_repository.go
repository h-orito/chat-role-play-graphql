package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

type GameParticipantRepository struct {
	db *DB
}

func NewGameParticipantRepository(db *DB) model.GameParticipantRepository {
	return &GameParticipantRepository{
		db: db,
	}
}

func (repo *GameParticipantRepository) FindGameParticipants(query model.GameParticipantsQuery) (participants model.GameParticipants, err error) {
	return findGameParticipants(repo.db.Connection, query)
}

func (repo *GameParticipantRepository) FindGameParticipant(query model.GameParticipantQuery) (participant *model.GameParticipant, err error) {
	return findGameParticipant(repo.db.Connection, query)
}

func (*GameParticipantRepository) RegisterGameParticipant(ctx context.Context, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	// game_participant
	p, err := registerGameParticipant(tx, gameID, participant)
	if err != nil {
		return nil, err
	}
	// game_participant_profile
	if err := registerGameParticipantProfile(tx, p.ID, model.GameParticipantProfile{
		GameParticipantID: p.ID,
		IsPlayerOpen:      false,
	}); err != nil {
		return nil, err
	}
	// game_participant_notification
	if err := registerGameParticipantNotification(tx, p.ID, model.GameParticipantNotification{
		GameParticipantID: p.ID,
		DiscordWebhookUrl: nil,
	}); err != nil {
		return nil, err
	}
	return p, nil
}

func (*GameParticipantRepository) UpdateGameParticipant(ctx context.Context, ID uint32, name string, memo *string, iconId *uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	tx.Model(&GameParticipant{}).Where("id = ?", ID).Updates(GameParticipant{
		GameParticipantName: name,
		Memo:                memo,
		ProfileIconID:       iconId,
	})
	return nil
}

// DeleteGameParticipant implements model.GameParticipantRepository.
func (*GameParticipantRepository) DeleteGameParticipant(ctx context.Context, ID uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	tx.Model(&GameParticipant{}).Where("id = ?", ID).Update("is_gone", true)
	return nil
}

func (repo *GameParticipantRepository) FindGameParticipantProfile(gameParticipantID uint32) (profile *model.GameParticipantProfile, err error) {
	return findGameParticipantProfile(repo.db.Connection, gameParticipantID)
}

func (*GameParticipantRepository) UpdateGameParticipantProfile(ctx context.Context, ID uint32, profile model.GameParticipantProfile) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	if err := updateGameParticipantProfile(tx, ID, profile); err != nil {
		return err
	}
	return nil
}

func (repo *GameParticipantRepository) FindGameParticipantIcons(query model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error) {
	return findGameParticipantIcons(repo.db.Connection, query)
}

func (*GameParticipantRepository) RegisterGameParticipantIcon(ctx context.Context, gameParticipantID uint32, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerGameParticipantIcon(tx, gameParticipantID, icon)
}

func (*GameParticipantRepository) UpdateGameParticipantIcon(ctx context.Context, icon model.GameParticipantIcon) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return updateGameParticipantIcon(tx, icon)
}

func (*GameParticipantRepository) DeleteGameParticipantIcon(ctx context.Context, iconID uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return deleteGameParticipantIcon(tx, iconID)
}

func (repo *GameParticipantRepository) FindGameParticipantNotificationSettings(gameParticipantIDs []uint32) (settings []model.GameParticipantNotification, err error) {
	return findGameParticipantNotifications(repo.db.Connection, gameParticipantIDs)
}

func (repo *GameParticipantRepository) FindGameParticipantNotificationSetting(gameParticipantID uint32) (setting *model.GameParticipantNotification, err error) {
	return findGameParticipantNotification(repo.db.Connection, gameParticipantID)
}

func (*GameParticipantRepository) UpdateGameParticipantNotificationSetting(ctx context.Context, ID uint32, setting model.GameParticipantNotification) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	if err := updateGameParticipantNotification(tx, ID, setting); err != nil {
		return err
	}
	return nil
}

func (repo *GameParticipantRepository) FindGameParticipantFollows(gameParticipantID uint32) (follows []model.GameParticipantFollow, err error) {
	return findGameParticipantFollows(repo.db.Connection, gameParticipantID)
}

func (repo *GameParticipantRepository) FindGameParticipantFollowers(gameParticipantID uint32) (followers []model.GameParticipantFollow, err error) {
	return findGameParticipantFollowers(repo.db.Connection, gameParticipantID)
}

func (*GameParticipantRepository) RegisterGameParticipantFollow(ctx context.Context, myGameParticipantID uint32, targetGameParticipantID uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	exists, err := findRdbGameParticipantFollows(tx, gameParticipantFollowQuery{GameParticipantID: &myGameParticipantID})
	if err != nil {
		return err
	}
	if array.Any(exists, func(follow GameParticipantFollow) bool {
		return follow.FollowGameParticipantID == targetGameParticipantID
	}) {
		return nil
	}
	rdb := GameParticipantFollow{
		GameParticipantID:       myGameParticipantID,
		FollowGameParticipantID: targetGameParticipantID,
	}
	result := tx.Create(&rdb)
	if result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func (*GameParticipantRepository) DeleteGameParticipantFollow(ctx context.Context, myGameParticipantID uint32, targetGameParticipantID uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	tx.Where("game_participant_id = ? AND follow_game_participant_id = ?", myGameParticipantID, targetGameParticipantID).Delete(&GameParticipantFollow{})
	return nil
}

func (repo *GameParticipantRepository) FindGameParticipantDiaries(query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error) {
	return findGameParticipantDiaries(repo.db.Connection, query)
}

func (repo *GameParticipantRepository) FindGameParticipantDiary(ID uint32) (diary *model.GameParticipantDiary, err error) {
	return findGameParticipantDiary(repo.db.Connection, ID)
}

func (*GameParticipantRepository) UpsertGameParticipantDiary(ctx context.Context, gameID uint32, diary model.GameParticipantDiary) (saved *model.GameParticipantDiary, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	rdb, err := findRdbGameParticipantDiary(tx, diary.ID)
	if err != nil {
		return nil, err
	}
	var result *gorm.DB
	fmt.Printf("rdb: %v", rdb)
	if rdb == nil {
		rdb = &GameParticipantDiary{
			GameID:            gameID,
			GameParticipantID: diary.GameParticipantID,
			GamePeriodID:      diary.GamePeriodID,
			DiaryTitle:        diary.Title,
			DiaryBody:         diary.Body,
		}
		result = tx.Create(rdb)
	} else {
		rdb.DiaryTitle = diary.Title
		rdb.DiaryBody = diary.Body
		result = tx.Save(rdb)
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return rdb.ToModel(), nil
}

func findGameParticipants(db *gorm.DB, query model.GameParticipantsQuery) (participants model.GameParticipants, err error) {
	rdbParticipants, err := findRdbGameParticipants(db, query)
	if err != nil {
		return model.GameParticipants{}, err
	}
	return model.GameParticipants{
		Count: len(rdbParticipants),
		List: array.Map(rdbParticipants, func(p GameParticipant) model.GameParticipant {
			return *p.ToModel()
		}),
	}, nil
}

func findGameParticipant(db *gorm.DB, query model.GameParticipantQuery) (_ *model.GameParticipant, err error) {
	rdbParticipant, err := findRdbGameParticipant(db, query)
	if err != nil {
		return nil, err
	}
	if rdbParticipant == nil {
		return nil, nil
	}
	return rdbParticipant.ToModel(), nil
}

func findRdbGameParticipants(db *gorm.DB, query model.GameParticipantsQuery) (_ []GameParticipant, err error) {
	var rdbGameParticipants []GameParticipant
	result := db.Model(&GameParticipant{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(&model.PagingQuery{
			PageSize:   1000,
			PageNumber: 1,
		}))
	}
	if query.GameIDs != nil {
		result = result.Where("game_id in (?)", *query.GameIDs)
	}
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.IsExcludeGone != nil && *query.IsExcludeGone {
		result = result.Where("is_gone = ?", false)
	}
	result = result.Find(&rdbGameParticipants)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	return rdbGameParticipants, nil
}

func findRdbGameParticipant(db *gorm.DB, query model.GameParticipantQuery) (_ *GameParticipant, err error) {
	var rdbGameParticipant GameParticipant
	result := db.Model(&GameParticipant{})
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
	}
	if query.ID != nil {
		result = result.Where("id = ?", *query.ID)
	}
	if query.PlayerID != nil {
		result = result.Where("player_id = ?", *query.PlayerID)
	}
	if query.CharaID != nil {
		result = result.Where("chara_id = ?", *query.CharaID)
	}
	if query.IsExcludeGone != nil && *query.IsExcludeGone {
		result = result.Where("is_gone = ?", false)
	}
	result = result.First(&rdbGameParticipant)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbGameParticipant, nil
}

func registerGameParticipant(db *gorm.DB, gameID uint32, participant model.GameParticipant) (saved *model.GameParticipant, err error) {
	rdb := GameParticipant{
		GameID:              gameID,
		PlayerID:            participant.PlayerID,
		CharaID:             participant.CharaID,
		GameParticipantName: participant.Name,
		Memo:                participant.Memo,
		LastAccessedAt:      time.Now(),
		IsGone:              false,
		CanChangeName:       participant.CanChangeName,
	}

	var entryNumber uint32
	entryNumber, err = selectMaxEntryNumber(db, gameID)
	if err != nil {
		return nil, err
	}
	for i := 0; i < 5; i++ {
		entryNumber += 1
		rdb.EntryNumber = entryNumber
		result := db.Create(&rdb)
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			continue
		}
		if result.Error != nil {
			return nil, fmt.Errorf("failed to create: %s \n", result.Error)
		}
		return findGameParticipant(db, model.GameParticipantQuery{GameID: &gameID, ID: &rdb.ID})
	}
	return nil, fmt.Errorf("failed to create: %s \n", "too many duplicated key")
}

func selectMaxEntryNumber(db *gorm.DB, gameID uint32) (uint32, error) {
	var max *float64
	result := db.Table("game_participants").Select("MAX(entry_number)").
		Where("game_id = ?", gameID).
		Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	if max == nil {
		return 0, nil
	}
	return uint32(*max), nil
}

func findGameParticipantProfile(db *gorm.DB, gameParticipantID uint32) (profile *model.GameParticipantProfile, err error) {
	rdb, err := findRdbGameParticipantProfile(db, gameParticipantID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	follows, err := findRdbGameParticipantFollows(db, gameParticipantFollowQuery{GameParticipantID: &gameParticipantID})
	if err != nil {
		return nil, err
	}
	followers, err := findRdbGameParticipantFollows(db, gameParticipantFollowQuery{FollowGameParticipantID: &gameParticipantID})
	if err != nil {
		return nil, err
	}
	return rdb.ToModel(len(follows), len(followers)), nil
}

func findRdbGameParticipantProfile(db *gorm.DB, gameParticipantID uint32) (profile *GameParticipantProfile, err error) {
	var rdb GameParticipantProfile
	result := db.Model(&GameParticipantProfile{}).Where("game_participant_id = ?", gameParticipantID).First(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s", result.Error)
	}
	return &rdb, nil
}

func registerGameParticipantProfile(db *gorm.DB, ID uint32, profile model.GameParticipantProfile) (err error) {
	rdb := GameParticipantProfile{
		GameParticipantID: ID,
		ProfileImageUrl:   profile.ProfileImageURL,
		Introduction:      profile.Introduction,
		IsPlayerOpen:      profile.IsPlayerOpen,
	}
	if result := db.Create(&rdb); result.Error != nil {
		return fmt.Errorf("failed to save: %s", result.Error)
	}
	return nil
}

func updateGameParticipantProfile(db *gorm.DB, ID uint32, profile model.GameParticipantProfile) (err error) {
	rdb, err := findRdbGameParticipantProfile(db, ID)
	if err != nil {
		return err
	}
	rdb.ProfileImageUrl = profile.ProfileImageURL
	rdb.Introduction = profile.Introduction
	rdb.IsPlayerOpen = profile.IsPlayerOpen
	if result := db.Save(&rdb); result.Error != nil {
		return fmt.Errorf("failed to save: %s", result.Error)
	}
	return nil
}

func findGameParticipantIcons(db *gorm.DB, query model.GameParticipantIconsQuery) (icons []model.GameParticipantIcon, err error) {
	rdbIcons, err := findRdbGameParticipantIcons(db, query)
	if err != nil {
		return nil, err
	}
	return array.Map(rdbIcons, func(rdbIcon GameParticipantIcon) model.GameParticipantIcon {
		return *rdbIcon.ToModel()
	}), nil
}

func findRdbGameParticipantIcons(db *gorm.DB, query model.GameParticipantIconsQuery) (icons []GameParticipantIcon, err error) {
	var rdb []GameParticipantIcon
	result := db.Model(&GameParticipantIcon{})
	if query.GameParticipantID != nil {
		result = result.Where("game_participant_id = ?", *query.GameParticipantID)
	}
	if query.IDs != nil {
		result = result.Where("id IN (?)", *query.IDs)
	}
	if query.IsContainDeleted == nil || !*query.IsContainDeleted {
		result = result.Where("is_deleted = ?", false)
	}
	result = result.Order("display_order").Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func registerGameParticipantIcon(tx *gorm.DB, gameParticipantID uint32, icon model.GameParticipantIcon) (saved *model.GameParticipantIcon, err error) {
	maxDisplayOrder, err := selectMaxIconsDisplayOrder(tx, gameParticipantID)
	rdb := GameParticipantIcon{
		GameParticipantID: gameParticipantID,
		IconImageUrl:      icon.IconImageURL,
		Width:             icon.Width,
		Height:            icon.Height,
		DisplayOrder:      maxDisplayOrder + 1,
		IsDeleted:         false,
	}
	if result := tx.Create(&rdb); result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return rdb.ToModel(), nil
}

func selectMaxIconsDisplayOrder(db *gorm.DB, gameParticipantID uint32) (uint32, error) {
	var max *float64
	result := db.Table("game_participant_icons").Select("MAX(display_order)").
		Where("game_participant_id = ?", gameParticipantID).
		Scan(&max)
	if result.Error != nil {
		return 0, fmt.Errorf("failed to select max: %s \n", result.Error)
	}
	if max == nil {
		return 0, nil
	}
	return uint32(*max), nil
}

func updateGameParticipantIcon(tx *gorm.DB, icon model.GameParticipantIcon) (err error) {
	tx.Model(&GameParticipantIcon{}).Where("id = ?", icon.ID).Update("display_order", icon.DisplayOrder)
	return nil
}

func deleteGameParticipantIcon(tx *gorm.DB, iconID uint32) (err error) {
	// game_participant.profile_icon_idに使われていたら先に削除
	var rdb GameParticipantIcon
	result := tx.Model(&GameParticipantIcon{}).Where("id = ?", iconID).First(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	if result.Error != nil {
		return fmt.Errorf("failed to find icon: %s \n", result.Error)
	}
	participant, err := findRdbGameParticipant(tx, model.GameParticipantQuery{
		ID: &rdb.GameParticipantID,
	})
	if err != nil {
		return err
	}
	if participant == nil {
		return fmt.Errorf("failed to find participant: %d \n", rdb.GameParticipantID)
	}
	if participant.ProfileIconID != nil && *participant.ProfileIconID == iconID {
		tx.Model(&GameParticipant{}).Where("id = ?", rdb.GameParticipantID).Update("profile_icon_id", nil)
	}
	// icon自体を論理削除
	tx.Model(&GameParticipantIcon{}).Where("id = ?", iconID).Update("is_deleted", true)
	return nil
}

func findGameParticipantNotifications(db *gorm.DB, participantIDs []uint32) ([]model.GameParticipantNotification, error) {
	rdb, err := findRdbGameParticipantNotifications(db, participantIDs)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	return array.Map(rdb, func(n GameParticipantNotification) model.GameParticipantNotification {
		return *n.ToModel()
	}), nil
}

func findGameParticipantNotification(db *gorm.DB, participantID uint32) (_ *model.GameParticipantNotification, err error) {
	rdb, err := findRdbGameParticipantNotification(db, participantID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	return rdb.ToModel(), nil
}

func findRdbGameParticipantNotifications(db *gorm.DB, participantIDs []uint32) ([]GameParticipantNotification, error) {
	if len(participantIDs) == 0 {
		return nil, nil
	}

	var rdb []GameParticipantNotification
	result := db.Model(&GameParticipantNotification{}).Where("game_participant_id in (?)", participantIDs).Find(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdb, nil
}

func findRdbGameParticipantNotification(db *gorm.DB, participantID uint32) (_ *GameParticipantNotification, err error) {
	var rdb GameParticipantNotification
	result := db.Model(&GameParticipantNotification{}).Where("game_participant_id = ?", participantID).First(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdb, nil
}

func registerGameParticipantNotification(db *gorm.DB, ID uint32, setting model.GameParticipantNotification) (err error) {
	rdb := GameParticipantNotification{
		GameParticipantID: ID,
		DiscordWebhookUrl: setting.DiscordWebhookUrl,
		GameParticipate:   setting.Game.Participate,
		GameStart:         setting.Game.Start,
		MessageReply:      setting.Message.Reply,
		SecretMessage:     setting.Message.Secret,
		DirectMessage:     setting.Message.DirectMessage,
		Keywords:          strings.Join(setting.Message.Keywords, ","),
	}
	if result := db.Create(&rdb); result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func updateGameParticipantNotification(db *gorm.DB, ID uint32, setting model.GameParticipantNotification) (err error) {
	rdb, err := findRdbGameParticipantNotification(db, ID)
	if err != nil {
		return err
	}
	rdb.DiscordWebhookUrl = setting.DiscordWebhookUrl
	rdb.GameParticipate = setting.Game.Participate
	rdb.GameStart = setting.Game.Start
	rdb.MessageReply = setting.Message.Reply
	rdb.SecretMessage = setting.Message.Secret
	rdb.DirectMessage = setting.Message.DirectMessage
	rdb.Keywords = strings.Join(setting.Message.Keywords, ",")
	if result := db.Save(&rdb); result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func findGameParticipantFollows(db *gorm.DB, participantID uint32) (_ []model.GameParticipantFollow, err error) {
	rdb, err := findRdbGameParticipantFollows(db, gameParticipantFollowQuery{GameParticipantID: &participantID})
	if err != nil {
		return nil, err
	}
	return array.Map(rdb, func(f GameParticipantFollow) model.GameParticipantFollow {
		return *f.ToModel()
	}), nil
}

func findGameParticipantFollowers(db *gorm.DB, participantID uint32) (_ []model.GameParticipantFollow, err error) {
	rdb, err := findRdbGameParticipantFollows(db, gameParticipantFollowQuery{FollowGameParticipantID: &participantID})
	if err != nil {
		return nil, err
	}
	return array.Map(rdb, func(f GameParticipantFollow) model.GameParticipantFollow {
		return *f.ToModel()
	}), nil
}

func findRdbGameParticipantFollows(db *gorm.DB, query gameParticipantFollowQuery) (_ []GameParticipantFollow, err error) {
	var rdbs []GameParticipantFollow
	result := db.Model(&GameParticipantFollow{})
	if query.GameParticipantID != nil {
		result = result.Where("game_participant_id = ?", *query.GameParticipantID)
	}
	if query.FollowGameParticipantID != nil {
		result = result.Where("follow_game_participant_id = ?", *query.FollowGameParticipantID)
	}
	result = result.Find(&rdbs)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbs, nil
}

type gameParticipantFollowQuery struct {
	GameParticipantID       *uint32
	FollowGameParticipantID *uint32
}

func findGameParticipantDiaries(db *gorm.DB, query model.GameParticipantDiariesQuery) (diaries []model.GameParticipantDiary, err error) {
	rdb, err := findRdbGameParticipantDiaries(db, query)
	if err != nil {
		return nil, err
	}
	return array.Map(rdb, func(f GameParticipantDiary) model.GameParticipantDiary {
		return *f.ToModel()
	}), nil
}

func findRdbGameParticipantDiaries(db *gorm.DB, query model.GameParticipantDiariesQuery) (diaries []GameParticipantDiary, err error) {
	var rdbs []GameParticipantDiary
	result := db.Model(&GameParticipantDiary{})
	if query.GameParticipantID != nil {
		result = result.Where("game_participant_id = ?", *query.GameParticipantID)
	}
	if query.GamePeriodID != nil {
		result = result.Where("game_period_id = ?", *query.GamePeriodID)
	}
	result = result.Find(&rdbs)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbs, nil
}

func findGameParticipantDiary(db *gorm.DB, ID uint32) (diary *model.GameParticipantDiary, err error) {
	rdb, err := findRdbGameParticipantDiary(db, ID)
	if err != nil {
		return nil, err
	}
	if rdb == nil {
		return nil, nil
	}
	return rdb.ToModel(), nil
}

func findRdbGameParticipantDiary(db *gorm.DB, ID uint32) (diary *GameParticipantDiary, err error) {
	var rdb GameParticipantDiary
	result := db.Model(&GameParticipantDiary{}).Where("id = ?", ID).First(&rdb)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdb, nil
}
