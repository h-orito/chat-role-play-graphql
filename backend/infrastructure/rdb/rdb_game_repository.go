package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"gorm.io/gorm"
)

type GameRepository struct {
	db *DB
}

func NewGameRepository(db *DB) model.GameRepository {
	return &GameRepository{
		db: db,
	}
}

func (repo *GameRepository) FindGames(query model.GamesQuery) (games []model.Game, err error) {
	return findGames(repo.db.Connection, query)
}

func (repo *GameRepository) FindGame(ID uint32) (_ *model.Game, err error) {
	return findGame(repo.db.Connection, ID)
}

func (repo *GameRepository) FindGamePeriods(IDs []uint32) (periods []model.GamePeriod, err error) {
	return findGamePeriods(repo.db.Connection, IDs)
}

func (repo *GameRepository) RegisterGame(ctx context.Context, game model.Game) (saved *model.Game, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	// game
	g, err := registerGame(tx, game)
	if err != nil {
		return nil, err
	}
	// game_master_player
	array.ForEach(game.GameMasters, func(gm model.GameMaster) {
		if _, e := registerGameMaster(tx, g.ID, gm); e != nil {
			err = e
		}
	})
	if err != nil {
		return nil, err
	}
	// game_label
	if err := upsertGameLabels(tx, g.ID, game.Labels); err != nil {
		return nil, err
	}
	// game_period
	array.ForEach(game.Periods, func(period model.GamePeriod) {
		if e := registerGamePeriod(tx, g.ID, period); e != nil {
			err = e
		}
	})
	if err != nil {
		return nil, err
	}
	// game_settings
	if err := registerGameSettings(tx, g.ID, game.Settings); err != nil {
		return nil, err
	}
	return findGame(tx, g.ID)
}

func (*GameRepository) RegisterGameMaster(ctx context.Context, gameID uint32, master model.GameMaster) (saved *model.GameMaster, err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return nil, fmt.Errorf("failed to get tx from context")
	}
	return registerGameMaster(tx, gameID, master)
}

func (*GameRepository) UpdateGameMaster(ctx context.Context, master model.GameMaster) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return updateGameMaster(tx, master)
}

func (*GameRepository) DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return deleteGameMaster(tx, gameMasterID)
}

func (repo *GameRepository) UpdateGameStatus(ctx context.Context, ID uint32, status model.GameStatus) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	if err := updateGameStatus(tx, ID, status); err != nil {
		return err
	}
	return nil
}

func (repo *GameRepository) RegisterGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	return registerGamePeriod(tx, gameID, period)
}

func (repo *GameRepository) UpdateGamePeriod(ctx context.Context, gameID uint32, period model.GamePeriod) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	game, err := findGame(tx, gameID)
	if err != nil {
		return err
	}
	if game == nil {
		return errors.New("game not found")
	}
	// 既存の期間を取得
	existing := array.Find(game.Periods, func(p model.GamePeriod) bool {
		return p.ID == period.ID
	})
	if existing == nil {
		return errors.New("game period not found")
	}
	// 既存の期間を更新
	result := tx.Model(&GamePeriod{}).Where("id = ?", period.ID).Update("game_period_name", period.Name)
	if result.Error != nil {
		return result.Error
	}
	// 最新の期間の場合は終了も更新
	if existing.ID == game.Periods[len(game.Periods)-1].ID {
		result = tx.Model(&GamePeriod{}).Where("id = ?", period.ID).Update("end_at", period.EndAt)
		if result.Error != nil {
			return result.Error
		}
	}
	return nil
}

func (repo *GameRepository) DeleteGamePeriod(
	ctx context.Context,
	gameID uint32,
	targetPeriodID uint32,
	destPeriodID uint32,
) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	// 日記やメッセージを移動先の期間に変更し、削除対象の期間を削除
	err = deleteGamePeriod(tx, targetPeriodID, destPeriodID)
	if err != nil {
		return err
	}
	return nil
}

func (repo *GameRepository) UpdateGameSettings(
	ctx context.Context,
	ID uint32,
	gameName string,
	labels []model.GameLabel,
	settings model.GameSettings,
) (err error) {
	tx, ok := GetTx(ctx)
	if !ok {
		return fmt.Errorf("failed to get tx from context")
	}
	if err := tx.Model(&Game{}).Where("id = ?", ID).Update("game_name", gameName).Error; err != nil {
		return err
	}
	if err := upsertGameLabels(tx, ID, labels); err != nil {
		return err
	}
	if err := updateGameSettings(tx, ID, settings); err != nil {
		return err
	}
	return nil
}

func findGames(db *gorm.DB, query model.GamesQuery) (games []model.Game, err error) {
	rdbGames, err := findRdbGames(db, query)
	if err != nil {
		return nil, err
	}
	if rdbGames == nil {
		return nil, nil
	}
	ids := array.Map(rdbGames, func(g Game) uint32 {
		return g.ID
	})
	var pts []GameParticipant
	var periods []GamePeriod
	var labels []GameLabel
	var settings []GameSetting
	var charachips []GameCharachip
	if len(ids) != 0 {
		pts, err = findRdbGameParticipants(db, model.GameParticipantsQuery{
			GameIDs: &ids,
		})
		if err != nil {
			return nil, err
		}
		periods, err = findRdbGamePeriods(db, gamePeriodsQuery{GameIDs: &ids})
		if err != nil {
			return nil, err
		}
		labels, err = findRdbGameLabels(db, gameLabelsQuery{GameIDs: &ids})
		if err != nil {
			return nil, err
		}
		settings, err = findRdbGameSettings(db, gameSettingsQuery{GameIDs: &ids})
		if err != nil {
			return nil, err
		}
		charachips, err = findRdbGameCharachips(db, gameCharachipsQuery{GameIDs: &ids})
		if err != nil {
			return nil, err
		}
	}

	return array.Map(rdbGames, func(g Game) model.Game {
		ptsCount := array.Count(pts, func(p GameParticipant) bool {
			return p.GameID == g.ID && !p.IsGone
		})
		gamePeriods := array.Filter(periods, func(p GamePeriod) bool {
			return p.GameID == g.ID
		})
		gameLabels := array.Filter(labels, func(l GameLabel) bool {
			return l.GameID == g.ID
		})
		gameSettings := array.Filter(settings, func(s GameSetting) bool {
			return s.GameID == g.ID
		})
		gameCharachips := array.Filter(charachips, func(c GameCharachip) bool {
			return c.GameID == g.ID
		})
		return *g.ToSimpleModel(
			ptsCount,
			array.Map(gamePeriods, func(p GamePeriod) model.GamePeriod {
				return *p.ToModel()
			}),
			array.Map(gameLabels, func(l GameLabel) model.GameLabel {
				return *l.ToModel()
			}),
			*ToGameSettingsModel(
				gameSettings,
				array.Map(gameCharachips, func(c GameCharachip) uint32 {
					return c.CharachipID
				}),
			),
		)
	}), nil
}

func findGame(db *gorm.DB, ID uint32) (_ *model.Game, err error) {
	rdbGame, err := findRdbGame(db, ID)
	if err != nil {
		return nil, err
	}
	gameMasters, err := findGameMasterPlayers(db, ID)
	if err != nil {
		return nil, err
	}
	rdbLabels, err := findRdbGameLabels(db, gameLabelsQuery{GameID: &ID})
	if err != nil {
		return nil, err
	}
	participants, err := findGameParticipants(db, model.GameParticipantsQuery{GameID: &ID})
	if err != nil {
		return nil, err
	}
	rdbPeriods, err := findRdbGamePeriods(db, gamePeriodsQuery{GameID: &ID})
	if err != nil {
		return nil, err
	}
	rdbSettings, err := findRdbGameSettings(db, gameSettingsQuery{GameID: &ID})
	if err != nil {
		return nil, err
	}
	charachips, err := findRdbGameCharachips(db, gameCharachipsQuery{GameID: &ID})
	if err != nil {
		return nil, err
	}
	return rdbGame.ToModel(
		gameMasters,
		participants,
		array.Map(rdbPeriods, func(p GamePeriod) model.GamePeriod {
			return *p.ToModel()
		}),
		array.Map(rdbLabels, func(l GameLabel) model.GameLabel {
			return *l.ToModel()
		}),
		*ToGameSettingsModel(
			rdbSettings,
			array.Map(charachips, func(c GameCharachip) uint32 {
				return c.CharachipID
			}),
		),
	), nil
}

func findRdbGames(db *gorm.DB, query model.GamesQuery) (games []Game, err error) {
	var rdbGames []Game
	result := db.Model(&Game{})
	if query.Paging != nil {
		result = result.Scopes(Paginate(query.Paging))
	} else {
		result = result.Scopes(Paginate(&model.PagingQuery{
			PageSize:   10000,
			PageNumber: 1,
			Desc:       false,
		}))
	}
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.Name != nil {
		result = result.Where("game_name like ?", fmt.Sprintf("%%%s%%", *query.Name))
	}
	if query.Statuses != nil {
		statuses := array.Map(*query.Statuses, func(s model.GameStatus) string {
			return s.String()
		})
		result = result.Where("game_status_code in (?)", statuses)
	}
	result = result.Find(&rdbGames)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}

	return rdbGames, nil
}

func findRdbGame(db *gorm.DB, ID uint32) (_ *Game, err error) {
	var rdbGame Game
	result := db.Model(&Game{}).First(&rdbGame, ID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return &rdbGame, nil
}

func findGamePeriods(db *gorm.DB, IDs []uint32) (_ []model.GamePeriod, err error) {
	rdbPeriods, err := findRdbGamePeriods(db, gamePeriodsQuery{IDs: &IDs})
	if err != nil {
		return nil, err
	}
	return array.Map(rdbPeriods, func(p GamePeriod) model.GamePeriod {
		return *p.ToModel()
	}), nil
}

func registerGame(db *gorm.DB, game model.Game) (_ *Game, err error) {
	g := Game{
		GameName:       game.Name,
		GameStatusCode: game.Status.String(),
	}
	if result := db.Create(&g); result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return &g, nil
}

func registerGameMaster(db *gorm.DB, gameID uint32, master model.GameMaster) (saved *model.GameMaster, err error) {
	gm := GameMasterPlayer{
		GameID:     gameID,
		PlayerID:   master.PlayerID,
		IsProducer: master.IsProducer,
	}
	if result := db.Create(&gm); result.Error != nil {
		return nil, fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return gm.ToModel(), nil
}

func updateGameMaster(db *gorm.DB, master model.GameMaster) (err error) {
	if err := db.Model(&GameMasterPlayer{}).Where("id = ?", master.ID).Update("is_producer", master.IsProducer).Error; err != nil {
		return err
	}
	return nil
}

func deleteGameMaster(db *gorm.DB, id uint32) (err error) {
	db.Where("id = ?", id).Delete(&GameMasterPlayer{})
	return nil
}

func updateGameStatus(db *gorm.DB, ID uint32, status model.GameStatus) (err error) {
	if err := db.Model(&Game{}).Where("id = ?", ID).Update("game_status_code", status.String()).Error; err != nil {
		return err
	}
	return nil
}

func findGameMasterPlayers(db *gorm.DB, GameID uint32) (_ []model.GameMaster, err error) {
	rdbGameMasterPlayers, err := findRdbGameMasterPlayers(db, GameID)
	if err != nil {
		return nil, err
	}
	return array.Map(rdbGameMasterPlayers, func(gmp GameMasterPlayer) model.GameMaster {
		return *gmp.ToModel()
	}), nil
}

func findRdbGameMasterPlayers(db *gorm.DB, GameID uint32) (_ []GameMasterPlayer, err error) {
	var rdbGameMasterPlayers []GameMasterPlayer
	result := db.Model(&GameMasterPlayer{}).Where("game_id = ?", GameID).Find(&rdbGameMasterPlayers)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbGameMasterPlayers, nil
}

func findRdbGamePeriods(db *gorm.DB, query gamePeriodsQuery) (_ []GamePeriod, err error) {
	var rdbs []GamePeriod
	result := db.Model(&GamePeriod{})
	if query.IDs != nil {
		result = result.Where("id in (?)", *query.IDs)
	}
	if query.GameIDs != nil {
		result = result.Where("game_id in (?)", *query.GameIDs)
	}
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
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

type gamePeriodsQuery struct {
	IDs     *[]uint32
	GameIDs *[]uint32
	GameID  *uint32
}

func registerGamePeriod(db *gorm.DB, gameID uint32, gm model.GamePeriod) (err error) {
	gp := GamePeriod{
		GameID:         gameID,
		Count:          gm.Count,
		GamePeriodName: gm.Name,
		StartAt:        gm.StartAt,
		EndAt:          gm.EndAt,
	}
	if result := db.Create(&gp); result.Error != nil {
		return fmt.Errorf("failed to save: %s \n", result.Error)
	}
	return nil
}

func deleteGamePeriod(db *gorm.DB, targetGamePeriodID uint32, destGamePeriodID uint32) (err error) {
	// 日記とメッセージを移動
	if err := db.Model(&Message{}).
		Where("game_period_id = ?", targetGamePeriodID).
		Update("game_period_id", destGamePeriodID).Error; err != nil {
		return err
	}
	if err := db.Model(&DirectMessage{}).
		Where("game_period_id = ?", targetGamePeriodID).
		Update("game_period_id", destGamePeriodID).Error; err != nil {
		return err
	}
	if err := db.Model(&GameParticipantDiary{}).
		Where("game_period_id = ?", targetGamePeriodID).
		Update("game_period_id", destGamePeriodID).Error; err != nil {
		return err
	}
	// 削除対象の期間を削除
	if err := db.Where("id = ?", targetGamePeriodID).Delete(&GamePeriod{}).Error; err != nil {
		return err
	}
	return nil
}

func findRdbGameSettings(db *gorm.DB, query gameSettingsQuery) (_ []GameSetting, err error) {
	var rdbGameSettings []GameSetting
	result := db.Model(&GameSetting{})
	if query.GameIDs != nil {
		result = result.Where("game_id in (?)", *query.GameIDs)
	}
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
	}
	result = result.Find(&rdbGameSettings)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbGameSettings, nil
}

type gameSettingsQuery struct {
	GameIDs *[]uint32
	GameID  *uint32
}

func registerGameSettings(db *gorm.DB, ID uint32, settings model.GameSettings) (err error) {
	var er error = nil
	array.ForEach(settings.Chara.CharachipIDs, func(charachipID uint32) {
		if e := registerGameCharachip(db, ID, charachipID); e != nil {
			er = fmt.Errorf("failed to register game charachip: %s \n", err)
		}
	})
	if er != nil {
		return er
	}

	if err := registerGameSetting(db, ID, GameSettingKeyBackgroundIntroduction, orEmpty(settings.Background.Introduction)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyBackgroundCatchImageUrl, orEmpty(settings.Background.CatchImageURL)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyCanOriginalCharacter, boolToString(settings.Chara.CanOriginalCharacter)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyCapacityMin, uint32ToString(settings.Capacity.Min)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyCapacityMax, uint32ToString(settings.Capacity.Max)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyPeriodPrefix, orEmpty(settings.Time.PeriodPrefix)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyPeriodSuffix, orEmpty(settings.Time.PeriodSuffix)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyPeriodIntervalSeconds, uint32ToString(settings.Time.PeriodIntervalSeconds)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyOpenAt, timeToString(settings.Time.OpenAt)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyStartParticipateAt, timeToString(settings.Time.StartParticipateAt)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyStartGameAt, timeToString(settings.Time.StartGameAt)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyEpilogueGameAt, timeToString(settings.Time.EpilogueGameAt)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyFinishGameAt, timeToString(settings.Time.FinishGameAt)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyCanShorten, boolToString(settings.Rule.CanShorten)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyCanSendDirectMessage, boolToString(settings.Rule.CanSendDirectMessage)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyTheme, orEmpty(settings.Rule.Theme)); err != nil {
		return err
	}
	if err := registerGameSetting(db, ID, GameSettingKeyPassword, orEmpty(settings.Password.Password)); err != nil {
		return err
	}
	return nil
}

func updateGameSettings(db *gorm.DB, gameID uint32, settings model.GameSettings) (err error) {
	if err := updateGameSetting(db, gameID, GameSettingKeyBackgroundIntroduction, orEmpty(settings.Background.Introduction)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyBackgroundCatchImageUrl, orEmpty(settings.Background.CatchImageURL)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyCanOriginalCharacter, boolToString(settings.Chara.CanOriginalCharacter)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyCapacityMin, uint32ToString(settings.Capacity.Min)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyCapacityMax, uint32ToString(settings.Capacity.Max)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyPeriodPrefix, orEmpty(settings.Time.PeriodPrefix)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyPeriodSuffix, orEmpty(settings.Time.PeriodSuffix)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyPeriodIntervalSeconds, uint32ToString(settings.Time.PeriodIntervalSeconds)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyOpenAt, timeToString(settings.Time.OpenAt)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyStartParticipateAt, timeToString(settings.Time.StartParticipateAt)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyStartGameAt, timeToString(settings.Time.StartGameAt)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyEpilogueGameAt, timeToString(settings.Time.EpilogueGameAt)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyFinishGameAt, timeToString(settings.Time.FinishGameAt)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyCanShorten, boolToString(settings.Rule.CanShorten)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyCanSendDirectMessage, boolToString(settings.Rule.CanSendDirectMessage)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyTheme, orEmpty(settings.Rule.Theme)); err != nil {
		return err
	}
	if err := updateGameSetting(db, gameID, GameSettingKeyPassword, orEmpty(settings.Password.Password)); err != nil {
		return err
	}
	return nil
}

func registerGameSetting(db *gorm.DB, gameID uint32, key GameSettingKey, value string) (err error) {
	if err := db.Create(&GameSetting{
		GameID:           gameID,
		GameSettingKey:   key.String(),
		GameSettingValue: value,
	}).Error; err != nil {
		return err
	}
	return nil
}

func updateGameSetting(db *gorm.DB, gameID uint32, key GameSettingKey, value string) (err error) {
	if err := db.Model(&GameSetting{}).
		Where("game_id = ? and game_setting_key = ?", gameID, key.String()).
		Update("game_setting_value", value).Error; err != nil {
		return err
	}
	return nil
}

func boolToString(b bool) string {
	if b {
		return "true"
	}
	return "false"
}

func uint32ToString(u uint32) string {
	return strconv.FormatUint(uint64(u), 10)
}

func timeToString(t time.Time) string {
	return t.Format(time.RFC3339)
}

func orEmpty(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func findRdbGameCharachips(db *gorm.DB, query gameCharachipsQuery) (_ []GameCharachip, err error) {
	var rdbGameCharachips []GameCharachip
	result := db.Model(&GameCharachip{})
	if query.GameIDs != nil {
		result = result.Where("game_id in (?)", *query.GameIDs)
	}
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
	}
	result = result.Find(&rdbGameCharachips)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbGameCharachips, nil
}

type gameCharachipsQuery struct {
	GameIDs *[]uint32
	GameID  *uint32
}

func registerGameCharachip(db *gorm.DB, gameID uint32, charachipID uint32) (err error) {
	if err := db.Create(&GameCharachip{
		GameID:      gameID,
		CharachipID: charachipID,
	}).Error; err != nil {
		return err
	}
	return nil
}

type gameLabelsQuery struct {
	GameIDs *[]uint32
	GameID  *uint32
}

func findRdbGameLabels(db *gorm.DB, query gameLabelsQuery) (_ []GameLabel, err error) {
	var rdbGameLabels []GameLabel
	result := db.Model(&GameLabel{})
	if query.GameIDs != nil {
		result = result.Where("game_id in (?)", *query.GameIDs)
	}
	if query.GameID != nil {
		result = result.Where("game_id = ?", *query.GameID)
	}
	result = result.Find(&rdbGameLabels)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, fmt.Errorf("failed to find: %s \n", result.Error)
	}
	return rdbGameLabels, nil
}

func upsertGameLabels(tx *gorm.DB, gameID uint32, labels []model.GameLabel) error {
	// 既存のラベルを削除
	if err := tx.Where("game_id = ?", gameID).Delete(&GameLabel{}).Error; err != nil {
		return err
	}
	// 新しいラベルを登録
	for _, label := range labels {
		if err := tx.Create(&GameLabel{
			GameID:    gameID,
			LabelName: label.Name,
			LabelType: label.Type,
		}).Error; err != nil {
			return err
		}
	}
	return nil
}
