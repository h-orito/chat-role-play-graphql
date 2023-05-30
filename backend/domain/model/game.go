package model

import (
	"chat-role-play/util/array"
	"context"
	"time"
)

type Game struct {
	ID           uint32
	Name         string
	Status       GameStatus
	GameMasters  []GameMaster
	Participants GameParticipants
	Periods      []GamePeriod
	Settings     GameSettings
}

type GameStatus int

const (
	GameStatusClosed GameStatus = iota
	GameStatusOpening
	GameStatusRecruiting
	GameStatusProgress
	GameStatusFinished
	GameStatusCancelled
)

func (gs GameStatus) String() string {
	switch gs {
	case GameStatusClosed:
		return "Closed"
	case GameStatusOpening:
		return "Opening"
	case GameStatusRecruiting:
		return "Recruiting"
	case GameStatusProgress:
		return "Progress"
	case GameStatusFinished:
		return "Finished"
	case GameStatusCancelled:
		return "Cancelled"
	default:
		return ""
	}
}

func GameStatusValues() []GameStatus {
	return []GameStatus{
		GameStatusClosed,
		GameStatusOpening,
		GameStatusRecruiting,
		GameStatusProgress,
		GameStatusFinished,
		GameStatusCancelled,
	}
}

func GameStatusValueOf(s string) *GameStatus {
	return array.Find(GameStatusValues(), func(gs GameStatus) bool {
		return gs.String() == s
	})
}

type GamesQuery struct {
	IDs    *[]uint32
	Name   *string
	Paging *PagingQuery
}

type GameMaster struct {
	ID         uint32
	PlayerID   uint32
	IsProducer bool
}

type GameParticipants struct {
	Count int
	List  []GameParticipant
}

type GameParticipantsQuery struct {
	GameIDs *[]uint32
	GameID  *uint32
	IDs     *[]uint32
	Paging  *PagingQuery
}

type GameParticipant struct {
	ID             uint32
	Name           string
	EntryNumber    uint32
	PlayerID       uint32
	CharaID        uint32
	IsGone         bool
	LastAccessedAt time.Time
}

type GameParticipantQuery struct {
	GameID   uint32
	ID       *uint32
	PlayerID *uint32
	CharaID  *uint32
}

type GameParticipantProfile struct {
	GameParticipantID uint32
	IconURL           *string
	Introduction      *string
	Memo              *string
	FollowsCount      int
	FollowersCount    int
}

type GameParticipantNotification struct {
	GameParticipantID uint32
	DiscordWebhookUrl *string
	Game              GameNotificationSetting
	Message           MessageNotificationSetting
}

type GameNotificationSetting struct {
	Participate bool
	Start       bool
}

type MessageNotificationSetting struct {
	Reply         bool
	DirectMessage bool
	Keywords      []string
}

type GameParticipantFollow struct {
	ID                      uint32
	GameParticipantID       uint32
	FollowGameParticipantID uint32
}

type GamePeriod struct {
	ID      uint32
	Count   uint32
	Name    string
	StartAt time.Time
	EndAt   time.Time
}

type GameParticipantDiary struct {
	ID                uint32
	GameParticipantID uint32
	GamePeriodID      uint32
	Title             string
	Body              string
}

type GameParticipantDiariesQuery struct {
	GameParticipantID *uint32
	GamePeriodID      *uint32
}

type GameSettings struct {
	Chara    GameCharaSettings
	Capacity GameCapacitySettings
	Time     GameTimeSettings
	Rule     GameRuleSettings
	Password GamePasswordSettings
}

type GameCharaSettings struct {
	CharachipIDs         []uint32
	CanOriginalCharacter bool
}

type GameCapacitySettings struct {
	Min uint32
	Max uint32
}

type GameTimeSettings struct {
	PeriodPrefix          *string
	PeriodSuffix          *string
	PeriodIntervalSeconds uint32
	OpenAt                time.Time
	StartParticipateAt    time.Time
	StartGameAt           time.Time
}

type GameRuleSettings struct {
	CanShorten           bool
	CanSendDirectMessage bool
}

type GamePasswordSettings struct {
	HasPassword bool
	Password    *string
}

type GameRepository interface {
	// game
	FindGames(query GamesQuery) (games []Game, err error)
	FindGame(ID uint32) (game *Game, err error)
	RegisterGame(ctx context.Context, game Game) (saved *Game, err error)
	RegisterGameMaster(ctx context.Context, gameID uint32, master GameMaster) (saved *GameMaster, err error)
	UpdateGameMaster(ctx context.Context, master GameMaster) (err error)
	DeleteGameMaster(ctx context.Context, gameMasterID uint32) (err error)
	UpdateGameStatus(ctx context.Context, gameID uint32, status GameStatus) (err error)
	UpdateGamePeriod(ctx context.Context, gameID uint32, period GamePeriod) (err error)
	UpdateGameSettings(ctx context.Context, gameID uint32, settings GameSettings) (err error)
	UpdatePeriodChange(ctx context.Context, current Game, changed Game) (err error)
}

type GameParticipantRepository interface {
	// participant
	FindGameParticipants(query GameParticipantsQuery) (participants GameParticipants, err error)
	FindGameParticipant(query GameParticipantQuery) (participant *GameParticipant, err error)
	RegisterGameParticipant(ctx context.Context, gameID uint32, participant GameParticipant) (saved *GameParticipant, err error)
	UpdateGameParticipantName(ctx context.Context, ID uint32, name string) (err error)
	// participant profile
	FindGameParticipantProfile(gameParticipantID uint32) (profile *GameParticipantProfile, err error)
	UpdateGameParticipantProfile(ctx context.Context, ID uint32, profile GameParticipantProfile) (err error)
	// participant notification
	FindGameParticipantNotificationSetting(gameParticipantID uint32) (notification *GameParticipantNotification, err error)
	UpdateGameParticipantNotificationSetting(ctx context.Context, ID uint32, setting GameParticipantNotification) (err error)
	// participant follow
	FindGameParticipantFollows(gameParticipantID uint32) (follows []GameParticipantFollow, err error)
	FindGameParticipantFollowers(gameParticipantID uint32) (followers []GameParticipantFollow, err error)
	RegisterGameParticipantFollow(ctx context.Context, myGameParticipantID uint32, targetGameParticipantID uint32) (err error)
	DeleteGameParticipantFollow(ctx context.Context, myGameParticipantID uint32, targetGameParticipantID uint32) (err error)
	// participant diary
	FindGameParticipantDiaries(query GameParticipantDiariesQuery) (diaries []GameParticipantDiary, err error)
	FindGameParticipantDiary(ID uint32) (diary *GameParticipantDiary, err error)
	UpsertGameParticipantDiary(ctx context.Context, gameID uint32, diary GameParticipantDiary) (saved *GameParticipantDiary, err error)
}
