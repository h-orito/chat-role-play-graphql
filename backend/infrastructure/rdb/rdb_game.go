package db

import (
	model "chat-role-play/domain/model"
	"chat-role-play/util/array"
	"strconv"
	"strings"
	"time"
)

type Game struct {
	ID             uint32
	GameName       string
	GameStatusCode string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (g Game) ToModel(
	gameMasters []model.GameMaster,
	participants model.GameParticipants,
	periods []model.GamePeriod,
	settings model.GameSettings,
) *model.Game {
	return &model.Game{
		ID:           g.ID,
		Name:         g.GameName,
		Status:       *model.GameStatusValueOf(g.GameStatusCode),
		GameMasters:  gameMasters,
		Participants: participants,
		Periods:      periods,
		Settings:     settings,
	}
}

func (g Game) ToSimpleModel(
	ptsCount int,
	periods []model.GamePeriod,
	settings model.GameSettings,
) *model.Game {
	return &model.Game{
		ID:          g.ID,
		Name:        g.GameName,
		Status:      *model.GameStatusValueOf(g.GameStatusCode),
		GameMasters: []model.GameMaster{},
		Participants: model.GameParticipants{
			Count: ptsCount,
			List:  nil,
		},
		Periods:  periods,
		Settings: settings,
	}
}

type GameMasterPlayer struct {
	ID         uint32
	GameID     uint32
	PlayerID   uint32
	IsProducer bool
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func (g GameMasterPlayer) ToModel() *model.GameMaster {
	return &model.GameMaster{
		ID:         g.ID,
		PlayerID:   g.PlayerID,
		IsProducer: g.IsProducer,
	}
}

type GameParticipant struct {
	ID                  uint32
	GameID              uint32
	PlayerID            uint32
	CharaID             uint32
	GameParticipantName string
	EntryNumber         uint32
	IsGone              bool
	LastAccessedAt      time.Time
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

func (p GameParticipant) ToModel() *model.GameParticipant {
	return &model.GameParticipant{
		ID:             p.ID,
		Name:           p.GameParticipantName,
		EntryNumber:    p.EntryNumber,
		PlayerID:       p.PlayerID,
		CharaID:        p.CharaID,
		IsGone:         p.IsGone,
		LastAccessedAt: p.LastAccessedAt,
	}
}

type GameParticipantProfile struct {
	GameParticipantID uint32 `gorm:"primaryKey"`
	IconUrl           *string
	Introduction      *string
	Memo              *string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

func (p GameParticipantProfile) ToModel(
	followsCount int,
	followersCount int,
) *model.GameParticipantProfile {
	return &model.GameParticipantProfile{
		GameParticipantID: p.GameParticipantID,
		IconURL:           p.IconUrl,
		Introduction:      p.Introduction,
		Memo:              p.Memo,
		FollowsCount:      followsCount,
		FollowersCount:    followersCount,
	}
}

type GameParticipantNotification struct {
	GameParticipantID uint32 `gorm:"primaryKey"`
	DiscordWebhookUrl *string
	GameParticipate   bool
	GameStart         bool
	MessageReply      bool
	DirectMessage     bool
	Keywords          string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

func (n GameParticipantNotification) ToModel() *model.GameParticipantNotification {
	return &model.GameParticipantNotification{
		GameParticipantID: n.GameParticipantID,
		DiscordWebhookUrl: n.DiscordWebhookUrl,
		Game: model.GameNotificationSetting{
			Participate: n.GameParticipate,
			Start:       n.GameStart,
		},
		Message: model.MessageNotificationSetting{
			Reply:         n.MessageReply,
			DirectMessage: n.DirectMessage,
			Keywords:      strings.Split(n.Keywords, ","),
		},
	}
}

type GameParticipantFollow struct {
	ID                      uint32
	GameParticipantID       uint32
	FollowGameParticipantID uint32
	CreatedAt               time.Time
	UpdatedAt               time.Time
}

func (f GameParticipantFollow) ToModel() *model.GameParticipantFollow {
	return &model.GameParticipantFollow{
		ID:                      f.ID,
		GameParticipantID:       f.GameParticipantID,
		FollowGameParticipantID: f.FollowGameParticipantID,
	}
}

type GamePeriod struct {
	ID             uint32
	GameID         uint32
	Count          uint32
	GamePeriodName string
	StartAt        time.Time
	EndAt          time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (p GamePeriod) ToModel() *model.GamePeriod {
	return &model.GamePeriod{
		ID:      p.ID,
		Count:   p.Count,
		Name:    p.GamePeriodName,
		StartAt: p.StartAt,
		EndAt:   p.EndAt,
	}
}

type GameParticipantDiary struct {
	ID                uint32
	GameID            uint32
	GameParticipantID uint32
	GamePeriodID      uint32
	DiaryTitle        string
	DiaryBody         string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

func (GameParticipantDiary) TableName() string {
	return "game_participant_diaries"
}

func (d GameParticipantDiary) ToModel() *model.GameParticipantDiary {
	return &model.GameParticipantDiary{
		ID:                d.ID,
		GameParticipantID: d.GameParticipantID,
		GamePeriodID:      d.GamePeriodID,
		Title:             d.DiaryTitle,
		Body:              d.DiaryBody,
	}
}

type GameSetting struct {
	ID               uint32
	GameID           uint32
	GameSettingKey   string
	GameSettingValue string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type GameSettingKey int

const (
	GameSettingKeyCanOriginalCharacter GameSettingKey = iota
	GameSettingKeyCapacityMin
	GameSettingKeyCapacityMax
	GameSettingKeyPeriodPrefix
	GameSettingKeyPeriodSuffix
	GameSettingKeyPeriodIntervalSeconds
	GameSettingKeyOpenAt
	GameSettingKeyStartParticipateAt
	GameSettingKeyStartGameAt
	GameSettingKeyCanShorten
	GameSettingKeyCanSendDirectMessage
	GameSettingKeyPassword
)

func (pa GameSettingKey) String() string {
	switch pa {
	case GameSettingKeyCanOriginalCharacter:
		return "CanOriginalCharacter"
	case GameSettingKeyCapacityMin:
		return "CapacityMin"
	case GameSettingKeyCapacityMax:
		return "CapacityMax"
	case GameSettingKeyPeriodPrefix:
		return "PeriodPrefix"
	case GameSettingKeyPeriodSuffix:
		return "PeriodSuffix"
	case GameSettingKeyPeriodIntervalSeconds:
		return "PeriodIntervalSeconds"
	case GameSettingKeyOpenAt:
		return "OpenAt"
	case GameSettingKeyStartParticipateAt:
		return "StartParticipateAt"
	case GameSettingKeyStartGameAt:
		return "StartGameAt"
	case GameSettingKeyCanShorten:
		return "CanShorten"
	case GameSettingKeyCanSendDirectMessage:
		return "CanSendDirectMessage"
	case GameSettingKeyPassword:
		return "Password"
	default:
		return ""
	}
}

func GameSettingKeyValues() []GameSettingKey {
	return []GameSettingKey{
		GameSettingKeyCanOriginalCharacter,
		GameSettingKeyCapacityMin,
		GameSettingKeyCapacityMax,
		GameSettingKeyPeriodPrefix,
		GameSettingKeyPeriodSuffix,
		GameSettingKeyPeriodIntervalSeconds,
		GameSettingKeyOpenAt,
		GameSettingKeyStartParticipateAt,
		GameSettingKeyStartGameAt,
		GameSettingKeyCanShorten,
		GameSettingKeyCanSendDirectMessage,
		GameSettingKeyPassword,
	}
}

func GameSettingKeyValueOf(s string) *GameSettingKey {
	return array.Find(GameSettingKeyValues(), func(gs GameSettingKey) bool {
		return gs.String() == s
	})
}

func ToGameSettingsModel(
	settings []GameSetting,
	charachipIds []uint32,
) *model.GameSettings {
	return &model.GameSettings{
		Chara: model.GameCharaSettings{
			CharachipIDs:         charachipIds,
			CanOriginalCharacter: gameSettingsToBool(settings, GameSettingKeyCanOriginalCharacter, false),
		},
		Capacity: model.GameCapacitySettings{
			Min: gameSettingsToUint32(settings, GameSettingKeyCapacityMin, 0),
			Max: gameSettingsToUint32(settings, GameSettingKeyCapacityMax, 0),
		},
		Time: model.GameTimeSettings{
			PeriodPrefix:          gameSettingsToString(settings, GameSettingKeyPeriodPrefix, nil),
			PeriodSuffix:          gameSettingsToString(settings, GameSettingKeyPeriodSuffix, nil),
			PeriodIntervalSeconds: gameSettingsToUint32(settings, GameSettingKeyPeriodIntervalSeconds, 0),
			OpenAt:                gameSettingsToTime(settings, GameSettingKeyOpenAt, time.Now()),
			StartParticipateAt:    gameSettingsToTime(settings, GameSettingKeyStartParticipateAt, time.Now()),
			StartGameAt:           gameSettingsToTime(settings, GameSettingKeyStartGameAt, time.Now()),
		},
		Rule: model.GameRuleSettings{
			CanShorten:           gameSettingsToBool(settings, GameSettingKeyCanShorten, false),
			CanSendDirectMessage: gameSettingsToBool(settings, GameSettingKeyCanSendDirectMessage, false),
		},
		Password: model.GamePasswordSettings{
			HasPassword: gameSettingsToString(settings, GameSettingKeyPassword, nil) != nil,
			Password:    gameSettingsToString(settings, GameSettingKeyPassword, nil),
		},
	}
}

func gameSettingsToBool(settings []GameSetting, Key GameSettingKey, _default bool) bool {
	for _, s := range settings {
		if s.GameSettingKey == Key.String() {
			return s.GameSettingValue == "true"
		}
	}
	return _default
}

func gameSettingsToUint32(settings []GameSetting, Key GameSettingKey, _default uint32) uint32 {
	for _, s := range settings {
		if s.GameSettingKey == Key.String() {
			i, err := strconv.Atoi(s.GameSettingValue)
			if err != nil {
				return _default
			}
			return uint32(i)
		}
	}
	return _default
}

func gameSettingsToString(settings []GameSetting, Key GameSettingKey, _default *string) *string {
	for _, s := range settings {
		if s.GameSettingKey == Key.String() {
			return &s.GameSettingValue
		}
	}
	return _default
}

func gameSettingsToTime(settings []GameSetting, Key GameSettingKey, _default time.Time) time.Time {
	for _, s := range settings {
		if s.GameSettingKey == Key.String() {
			t, err := time.Parse(time.RFC3339, s.GameSettingValue)
			if err != nil {
				return _default
			}
			return t
		}
	}
	return _default
}

type GameCharachip struct {
	ID          uint32
	GameID      uint32
	CharachipID uint32
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
