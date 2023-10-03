// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package gqlmodel

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type Pageable interface {
	IsPageable()
	GetAllPageCount() int
	GetHasPrePage() bool
	GetHasNextPage() bool
	GetCurrentPageNumber() *int
	GetIsDesc() bool
}

type ChangePeriod struct {
	GameID string `json:"gameId"`
}

type ChangePeriodIfNeededPayload struct {
	Ok bool `json:"ok"`
}

type Chara struct {
	ID     string        `json:"id"`
	Name   string        `json:"name"`
	Size   *CharaSize    `json:"size"`
	Images []*CharaImage `json:"images"`
}

type CharaImage struct {
	ID   string `json:"id"`
	Type string `json:"type"`
	URL  string `json:"url"`
}

type CharaSize struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type Charachip struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	Designer       *Designer `json:"designer"`
	DescriptionURL string    `json:"descriptionUrl"`
	CanChangeName  bool      `json:"canChangeName"`
	Charas         []*Chara  `json:"charas"`
}

type CharachipsQuery struct {
	Ids    []string       `json:"ids,omitempty"`
	Name   *string        `json:"name,omitempty"`
	Paging *PageableQuery `json:"paging,omitempty"`
}

type DeleteDirectMessageFavorite struct {
	GameID          string `json:"gameId"`
	DirectMessageID string `json:"directMessageId"`
}

type DeleteDirectMessageFavoritePayload struct {
	Ok bool `json:"ok"`
}

type DeleteGameMaster struct {
	GameID string `json:"gameId"`
	ID     string `json:"id"`
}

type DeleteGameMasterPayload struct {
	Ok bool `json:"ok"`
}

type DeleteGameParticipant struct {
	GameID string `json:"gameId"`
}

type DeleteGameParticipantFollow struct {
	GameID                  string `json:"gameId"`
	TargetGameParticipantID string `json:"targetGameParticipantId"`
}

type DeleteGameParticipantFollowPayload struct {
	Ok bool `json:"ok"`
}

type DeleteGameParticipantIcon struct {
	GameID string `json:"gameId"`
	IconID string `json:"iconId"`
}

type DeleteGameParticipantIconPayload struct {
	Ok bool `json:"ok"`
}

type DeleteGameParticipantPayload struct {
	Ok bool `json:"ok"`
}

type DeleteGamePeriod struct {
	GameID         string `json:"gameId"`
	TargetPeriodID string `json:"targetPeriodId"`
	DestPeriodID   string `json:"destPeriodId"`
}

type DeleteGamePeriodPayload struct {
	Ok bool `json:"ok"`
}

type DeleteMessageFavorite struct {
	GameID    string `json:"gameId"`
	MessageID string `json:"messageId"`
}

type DeleteMessageFavoritePayload struct {
	Ok bool `json:"ok"`
}

type DeletePlayerSnsAccount struct {
	ID string `json:"id"`
}

type DeletePlayerSnsAccountPayload struct {
	Ok bool `json:"ok"`
}

type Designer struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DesignersQuery struct {
	Ids    []string       `json:"ids,omitempty"`
	Name   *string        `json:"Name,omitempty"`
	Paging *PageableQuery `json:"paging,omitempty"`
}

type DirectMessage struct {
	ID                 string                  `json:"id"`
	ParticipantGroupID string                  `json:"participantGroupId"`
	Content            *MessageContent         `json:"content"`
	Time               *MessageTime            `json:"time"`
	Sender             *MessageSender          `json:"sender"`
	Reactions          *DirectMessageReactions `json:"reactions"`
}

type DirectMessageReactions struct {
	FavoriteCounts         int      `json:"favoriteCounts"`
	FavoriteParticipantIds []string `json:"favoriteParticipantIds"`
}

type DirectMessages struct {
	List                []*DirectMessage `json:"list"`
	AllPageCount        int              `json:"allPageCount"`
	HasPrePage          bool             `json:"hasPrePage"`
	HasNextPage         bool             `json:"hasNextPage"`
	CurrentPageNumber   *int             `json:"currentPageNumber,omitempty"`
	IsDesc              bool             `json:"isDesc"`
	IsLatest            bool             `json:"isLatest"`
	LatestUnixTimeMilli uint64           `json:"latestUnixTimeMilli"`
}

func (DirectMessages) IsPageable()                     {}
func (this DirectMessages) GetAllPageCount() int       { return this.AllPageCount }
func (this DirectMessages) GetHasPrePage() bool        { return this.HasPrePage }
func (this DirectMessages) GetHasNextPage() bool       { return this.HasNextPage }
func (this DirectMessages) GetCurrentPageNumber() *int { return this.CurrentPageNumber }
func (this DirectMessages) GetIsDesc() bool            { return this.IsDesc }

type DirectMessagesQuery struct {
	Ids                 []string       `json:"ids,omitempty"`
	ParticipantGroupID  string         `json:"participantGroupId"`
	PeriodID            *string        `json:"periodId,omitempty"`
	Types               []MessageType  `json:"types,omitempty"`
	SenderIds           []string       `json:"senderIds,omitempty"`
	Keywords            []string       `json:"keywords,omitempty"`
	SinceAt             *time.Time     `json:"sinceAt,omitempty"`
	UntilAt             *time.Time     `json:"untilAt,omitempty"`
	OffsetUnixTimeMilli *uint64        `json:"offsetUnixTimeMilli,omitempty"`
	Paging              *PageableQuery `json:"paging,omitempty"`
}

type Game struct {
	ID           string             `json:"id"`
	Name         string             `json:"name"`
	Status       GameStatus         `json:"status"`
	Labels       []*GameLabel       `json:"labels"`
	GameMasters  []*GameMaster      `json:"gameMasters"`
	Participants []*GameParticipant `json:"participants"`
	Periods      []*GamePeriod      `json:"periods"`
	Settings     *GameSettings      `json:"settings"`
}

type GameCapacity struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type GameDiariesQuery struct {
	ParticipantID *string `json:"participantId,omitempty"`
	PeriodID      *string `json:"periodId,omitempty"`
}

type GameLabel struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
}

type GameNotificationCondition struct {
	Participate bool `json:"participate"`
	Start       bool `json:"start"`
}

type GameParticipantGroupsQuery struct {
	MemberParticipantID *string `json:"memberParticipantId,omitempty"`
}

type GameParticipantIcon struct {
	ID           string `json:"id"`
	URL          string `json:"url"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	DisplayOrder int    `json:"displayOrder"`
}

type GameParticipantProfile struct {
	ParticipantID   string  `json:"participantId"`
	Name            string  `json:"name"`
	EntryNumber     int     `json:"entryNumber"`
	IsGone          bool    `json:"isGone"`
	ProfileImageURL *string `json:"profileImageUrl,omitempty"`
	Introduction    *string `json:"introduction,omitempty"`
	FollowsCount    int     `json:"followsCount"`
	FollowersCount  int     `json:"followersCount"`
	IsPlayerOpen    bool    `json:"isPlayerOpen"`
	PlayerName      *string `json:"playerName,omitempty"`
}

type GameParticipantSetting struct {
	Notification *NotificationCondition `json:"notification"`
}

type GamePasswordSetting struct {
	HasPassword bool `json:"hasPassword"`
}

type GamePeriod struct {
	ID      string    `json:"id"`
	Count   int       `json:"count"`
	Name    string    `json:"name"`
	StartAt time.Time `json:"startAt"`
	EndAt   time.Time `json:"endAt"`
}

type GameRuleSetting struct {
	IsGameMasterProducer bool    `json:"isGameMasterProducer"`
	CanShorten           bool    `json:"canShorten"`
	CanSendDirectMessage bool    `json:"canSendDirectMessage"`
	Theme                *string `json:"theme,omitempty"`
}

type GameSettings struct {
	Chara    *GameCharaSetting    `json:"chara"`
	Capacity *GameCapacity        `json:"capacity"`
	Time     *GameTimeSetting     `json:"time"`
	Rule     *GameRuleSetting     `json:"rule"`
	Password *GamePasswordSetting `json:"password"`
}

type GameTimeSetting struct {
	PeriodPrefix          *string   `json:"periodPrefix,omitempty"`
	PeriodSuffix          *string   `json:"periodSuffix,omitempty"`
	PeriodIntervalSeconds int       `json:"periodIntervalSeconds"`
	OpenAt                time.Time `json:"openAt"`
	StartParticipateAt    time.Time `json:"startParticipateAt"`
	StartGameAt           time.Time `json:"startGameAt"`
	EpilogueGameAt        time.Time `json:"epilogueGameAt"`
	FinishGameAt          time.Time `json:"finishGameAt"`
}

type GamesQuery struct {
	Ids      []string       `json:"ids,omitempty"`
	Name     *string        `json:"name,omitempty"`
	Statuses []GameStatus   `json:"statuses,omitempty"`
	Paging   *PageableQuery `json:"paging,omitempty"`
}

type Message struct {
	ID        string            `json:"id"`
	Content   *MessageContent   `json:"content"`
	Time      *MessageTime      `json:"time"`
	Sender    *MessageSender    `json:"sender,omitempty"`
	ReplyTo   *MessageRecipient `json:"replyTo,omitempty"`
	Reactions *MessageReactions `json:"reactions"`
}

type MessageContent struct {
	Type              MessageType `json:"type"`
	Number            int         `json:"number"`
	Text              string      `json:"text"`
	IsConvertDisabled bool        `json:"isConvertDisabled"`
}

type MessageNotificationCondition struct {
	Reply         bool     `json:"reply"`
	DirectMessage bool     `json:"directMessage"`
	Keywords      []string `json:"keywords"`
}

type MessageReactions struct {
	ReplyCount             int      `json:"replyCount"`
	FavoriteCount          int      `json:"favoriteCount"`
	FavoriteParticipantIds []string `json:"favoriteParticipantIds"`
}

type MessageRecipient struct {
	MessageID     string `json:"messageId"`
	ParticipantID string `json:"participantId"`
}

type MessageTime struct {
	SendAt            time.Time `json:"sendAt"`
	SendUnixTimeMilli uint64    `json:"sendUnixTimeMilli"`
}

type Messages struct {
	List                []*Message `json:"list"`
	AllPageCount        int        `json:"allPageCount"`
	HasPrePage          bool       `json:"hasPrePage"`
	HasNextPage         bool       `json:"hasNextPage"`
	CurrentPageNumber   *int       `json:"currentPageNumber,omitempty"`
	IsDesc              bool       `json:"isDesc"`
	IsLatest            bool       `json:"isLatest"`
	LatestUnixTimeMilli uint64     `json:"latestUnixTimeMilli"`
}

func (Messages) IsPageable()                     {}
func (this Messages) GetAllPageCount() int       { return this.AllPageCount }
func (this Messages) GetHasPrePage() bool        { return this.HasPrePage }
func (this Messages) GetHasNextPage() bool       { return this.HasNextPage }
func (this Messages) GetCurrentPageNumber() *int { return this.CurrentPageNumber }
func (this Messages) GetIsDesc() bool            { return this.IsDesc }

type MessagesQuery struct {
	Ids                 []string       `json:"ids,omitempty"`
	PeriodID            *string        `json:"periodId,omitempty"`
	Types               []MessageType  `json:"types,omitempty"`
	SenderIds           []string       `json:"senderIds,omitempty"`
	ReplyToMessageID    *string        `json:"replyToMessageId,omitempty"`
	Keywords            []string       `json:"keywords,omitempty"`
	SinceAt             *time.Time     `json:"sinceAt,omitempty"`
	UntilAt             *time.Time     `json:"untilAt,omitempty"`
	OffsetUnixTimeMilli *uint64        `json:"offsetUnixTimeMilli,omitempty"`
	Paging              *PageableQuery `json:"paging,omitempty"`
}

type NewDirectMessage struct {
	GameID                 string      `json:"gameId"`
	GameParticipantGroupID string      `json:"gameParticipantGroupId"`
	Type                   MessageType `json:"type"`
	IconID                 string      `json:"iconId"`
	Name                   string      `json:"name"`
	Text                   string      `json:"text"`
	IsConvertDisabled      bool        `json:"isConvertDisabled"`
}

type NewDirectMessageFavorite struct {
	GameID          string `json:"gameId"`
	DirectMessageID string `json:"directMessageId"`
}

type NewGame struct {
	Name     string           `json:"name"`
	Labels   []*NewGameLabel  `json:"labels"`
	Settings *NewGameSettings `json:"settings"`
}

type NewGameCapacity struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type NewGameCharaSetting struct {
	CharachipIds         []string `json:"charachipIds"`
	CanOriginalCharacter bool     `json:"canOriginalCharacter"`
}

type NewGameLabel struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type NewGameMaster struct {
	GameID     string `json:"gameId"`
	PlayerID   string `json:"playerId"`
	IsProducer bool   `json:"isProducer"`
}

type NewGameParticipant struct {
	GameID   string  `json:"gameId"`
	Name     string  `json:"name"`
	CharaID  *string `json:"charaId,omitempty"`
	Password *string `json:"password,omitempty"`
}

type NewGameParticipantDiary struct {
	GameID   string `json:"gameId"`
	PeriodID string `json:"periodId"`
	Title    string `json:"title"`
	Body     string `json:"body"`
}

type NewGameParticipantFollow struct {
	GameID                  string `json:"gameId"`
	TargetGameParticipantID string `json:"targetGameParticipantId"`
}

type NewGameParticipantGroup struct {
	GameID             string   `json:"gameId"`
	Name               string   `json:"name"`
	GameParticipantIds []string `json:"gameParticipantIds"`
}

type NewGameParticipantIcon struct {
	GameID   string         `json:"gameId"`
	IconFile graphql.Upload `json:"iconFile"`
	Width    int            `json:"width"`
	Height   int            `json:"height"`
}

type NewGamePasswordSetting struct {
	Password *string `json:"password,omitempty"`
}

type NewGameRuleSetting struct {
	IsGameMasterProducer bool    `json:"isGameMasterProducer"`
	CanShorten           bool    `json:"canShorten"`
	CanSendDirectMessage bool    `json:"canSendDirectMessage"`
	Theme                *string `json:"theme,omitempty"`
}

type NewGameSettings struct {
	Chara    *NewGameCharaSetting    `json:"chara"`
	Capacity *NewGameCapacity        `json:"capacity"`
	Time     *NewGameTimeSetting     `json:"time"`
	Rule     *NewGameRuleSetting     `json:"rule"`
	Password *NewGamePasswordSetting `json:"password"`
}

type NewGameTimeSetting struct {
	PeriodPrefix          *string   `json:"periodPrefix,omitempty"`
	PeriodSuffix          *string   `json:"periodSuffix,omitempty"`
	PeriodIntervalSeconds int       `json:"periodIntervalSeconds"`
	OpenAt                time.Time `json:"openAt"`
	StartParticipateAt    time.Time `json:"startParticipateAt"`
	StartGameAt           time.Time `json:"startGameAt"`
	EpilogueGameAt        time.Time `json:"epilogueGameAt"`
	FinishGameAt          time.Time `json:"finishGameAt"`
}

type NewMessage struct {
	GameID            string      `json:"gameId"`
	Type              MessageType `json:"type"`
	IconID            *string     `json:"iconId,omitempty"`
	Name              *string     `json:"name,omitempty"`
	ReplyToMessageID  *string     `json:"replyToMessageId,omitempty"`
	Text              string      `json:"text"`
	IsConvertDisabled bool        `json:"isConvertDisabled"`
}

type NewMessageFavorite struct {
	GameID    string `json:"gameId"`
	MessageID string `json:"messageId"`
}

type NewPlayerProfile struct {
	Name             string          `json:"name"`
	ProfileImageFile *graphql.Upload `json:"profileImageFile,omitempty"`
	Introduction     *string         `json:"introduction,omitempty"`
}

type NewPlayerSnsAccount struct {
	Type        SnsType `json:"type"`
	AccountName string  `json:"accountName"`
	AccountURL  string  `json:"accountUrl"`
}

type NotificationCondition struct {
	DiscordWebhookURL *string                       `json:"discordWebhookUrl,omitempty"`
	Game              *GameNotificationCondition    `json:"game"`
	Message           *MessageNotificationCondition `json:"message"`
}

type PageableQuery struct {
	PageSize   int  `json:"pageSize"`
	PageNumber int  `json:"pageNumber"`
	IsDesc     bool `json:"isDesc"`
	IsLatest   bool `json:"isLatest"`
}

type ParticipantsQuery struct {
	Ids       []string       `json:"ids,omitempty"`
	PlayerIds []string       `json:"playerIds,omitempty"`
	Paging    *PageableQuery `json:"paging,omitempty"`
}

type Player struct {
	ID             string         `json:"id"`
	Name           string         `json:"name"`
	Profile        *PlayerProfile `json:"profile,omitempty"`
	Designer       *Designer      `json:"designer,omitempty"`
	AuthorityCodes []string       `json:"authorityCodes"`
}

type PlayerProfile struct {
	ProfileImageURL *string             `json:"profileImageUrl,omitempty"`
	Introduction    *string             `json:"introduction,omitempty"`
	SnsAccounts     []*PlayerSnsAccount `json:"snsAccounts"`
}

type PlayerSnsAccount struct {
	ID   string  `json:"id"`
	Type SnsType `json:"type"`
	Name *string `json:"name,omitempty"`
	URL  string  `json:"url"`
}

type PlayersQuery struct {
	Ids    []string       `json:"ids,omitempty"`
	Name   *string        `json:"name,omitempty"`
	Paging *PageableQuery `json:"paging,omitempty"`
}

type RegisterDebugMessages struct {
	GameID string `json:"gameId"`
}

type RegisterDebugMessagesPayload struct {
	Ok bool `json:"ok"`
}

type RegisterDirectMessageDryRunPayload struct {
	DirectMessage *DirectMessage `json:"directMessage"`
}

type RegisterDirectMessageFavoritePayload struct {
	Ok bool `json:"ok"`
}

type RegisterDirectMessagePayload struct {
	Ok bool `json:"ok"`
}

type RegisterGameMasterPayload struct {
	GameMaster *GameMaster `json:"gameMaster"`
}

type RegisterGameParticipantDiaryPayload struct {
	GameParticipantDiary *GameParticipantDiary `json:"gameParticipantDiary"`
}

type RegisterGameParticipantFollowPayload struct {
	Ok bool `json:"ok"`
}

type RegisterGameParticipantGroupPayload struct {
	GameParticipantGroup *GameParticipantGroup `json:"gameParticipantGroup"`
}

type RegisterGameParticipantIconPayload struct {
	GameParticipantIcon *GameParticipantIcon `json:"gameParticipantIcon"`
}

type RegisterGameParticipantPayload struct {
	GameParticipant *GameParticipant `json:"gameParticipant"`
}

type RegisterGamePayload struct {
	Game *Game `json:"game"`
}

type RegisterMessageDryRunPayload struct {
	Message *Message `json:"message"`
}

type RegisterMessageFavoritePayload struct {
	Ok bool `json:"ok"`
}

type RegisterMessagePayload struct {
	Ok bool `json:"ok"`
}

type RegisterPlayerProfilePayload struct {
	PlayerProfile *PlayerProfile `json:"playerProfile"`
}

type RegisterPlayerSnsAccountPayload struct {
	PlayerSnsAccount *PlayerSnsAccount `json:"playerSnsAccount"`
}

type SimpleGame struct {
	ID                string        `json:"id"`
	Name              string        `json:"name"`
	Status            GameStatus    `json:"status"`
	Labels            []*GameLabel  `json:"labels"`
	ParticipantsCount int           `json:"participantsCount"`
	Periods           []*GamePeriod `json:"periods"`
	Settings          *GameSettings `json:"settings"`
}

type UpdateCharaSetting struct {
	CharachipIds         []string `json:"charachipIds"`
	CanOriginalCharacter bool     `json:"canOriginalCharacter"`
}

type UpdateGameCapacity struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type UpdateGameLabel struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

type UpdateGameMaster struct {
	GameID     string `json:"gameId"`
	ID         string `json:"id"`
	IsProducer bool   `json:"isProducer"`
}

type UpdateGameMasterPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameNotificationCondition struct {
	Participate bool `json:"participate"`
	Start       bool `json:"start"`
}

type UpdateGameParticipantDiary struct {
	GameID string `json:"gameId"`
	ID     string `json:"id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}

type UpdateGameParticipantDiaryPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameParticipantGroup struct {
	GameID string `json:"gameId"`
	ID     string `json:"id"`
	Name   string `json:"name"`
}

type UpdateGameParticipantGroupPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameParticipantIcon struct {
	GameID       string `json:"gameId"`
	ID           string `json:"id"`
	DisplayOrder int    `json:"displayOrder"`
}

type UpdateGameParticipantIconPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameParticipantProfile struct {
	GameID           string          `json:"gameId"`
	Name             string          `json:"name"`
	ProfileImageFile *graphql.Upload `json:"profileImageFile,omitempty"`
	ProfileImageURL  *string         `json:"profileImageUrl,omitempty"`
	ProfileIconID    *string         `json:"profileIconId,omitempty"`
	Introduction     *string         `json:"introduction,omitempty"`
	Memo             *string         `json:"memo,omitempty"`
	IsPlayerOpen     bool            `json:"isPlayerOpen"`
}

type UpdateGameParticipantProfilePayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameParticipantSetting struct {
	GameID       string                       `json:"gameId"`
	Notification *UpdateNotificationCondition `json:"notification,omitempty"`
}

type UpdateGameParticipantSettingPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGamePasswordSetting struct {
	Password *string `json:"password,omitempty"`
}

type UpdateGamePeriod struct {
	GameID   string    `json:"gameId"`
	PeriodID string    `json:"periodId"`
	Name     string    `json:"name"`
	StartAt  time.Time `json:"startAt"`
	EndAt    time.Time `json:"endAt"`
}

type UpdateGamePeriodPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameRuleSetting struct {
	IsGameMasterProducer bool    `json:"isGameMasterProducer"`
	CanShorten           bool    `json:"canShorten"`
	CanSendDirectMessage bool    `json:"canSendDirectMessage"`
	Theme                *string `json:"theme,omitempty"`
}

type UpdateGameSetting struct {
	GameID   string              `json:"gameId"`
	Name     string              `json:"name"`
	Labels   []*UpdateGameLabel  `json:"labels"`
	Settings *UpdateGameSettings `json:"settings"`
}

type UpdateGameSettingPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameSettings struct {
	Chara    *UpdateCharaSetting        `json:"chara"`
	Capacity *UpdateGameCapacity        `json:"capacity"`
	Time     *UpdateGameTimeSetting     `json:"time"`
	Rule     *UpdateGameRuleSetting     `json:"rule"`
	Password *UpdateGamePasswordSetting `json:"password"`
}

type UpdateGameStatus struct {
	GameID string     `json:"gameId"`
	Status GameStatus `json:"status"`
}

type UpdateGameStatusPayload struct {
	Ok bool `json:"ok"`
}

type UpdateGameTimeSetting struct {
	PeriodPrefix          *string   `json:"periodPrefix,omitempty"`
	PeriodSuffix          *string   `json:"periodSuffix,omitempty"`
	PeriodIntervalSeconds int       `json:"periodIntervalSeconds"`
	OpenAt                time.Time `json:"openAt"`
	StartParticipateAt    time.Time `json:"startParticipateAt"`
	StartGameAt           time.Time `json:"startGameAt"`
	EpilogueGameAt        time.Time `json:"epilogueGameAt"`
	FinishGameAt          time.Time `json:"finishGameAt"`
}

type UpdateMessageNotificationCondition struct {
	Reply         bool     `json:"reply"`
	DirectMessage bool     `json:"directMessage"`
	Keywords      []string `json:"keywords"`
}

type UpdateNotificationCondition struct {
	DiscordWebhookURL *string                             `json:"discordWebhookUrl,omitempty"`
	Game              *UpdateGameNotificationCondition    `json:"game"`
	Message           *UpdateMessageNotificationCondition `json:"message"`
}

type UpdatePlayerProfile struct {
	Name             string          `json:"name"`
	ProfileImageFile *graphql.Upload `json:"profileImageFile,omitempty"`
	ProfileImageURL  *string         `json:"profileImageUrl,omitempty"`
	Introduction     *string         `json:"introduction,omitempty"`
}

type UpdatePlayerProfilePayload struct {
	Ok bool `json:"ok"`
}

type UpdatePlayerSnsAccount struct {
	ID          string  `json:"id"`
	Type        SnsType `json:"type"`
	AccountName string  `json:"accountName"`
	AccountURL  string  `json:"accountUrl"`
}

type UpdatePlayerSnsAccountPayload struct {
	Ok bool `json:"ok"`
}

type GameStatus string

const (
	GameStatusClosed     GameStatus = "Closed"
	GameStatusOpening    GameStatus = "Opening"
	GameStatusRecruiting GameStatus = "Recruiting"
	GameStatusProgress   GameStatus = "Progress"
	GameStatusEpilogue   GameStatus = "Epilogue"
	GameStatusFinished   GameStatus = "Finished"
	GameStatusCancelled  GameStatus = "Cancelled"
)

var AllGameStatus = []GameStatus{
	GameStatusClosed,
	GameStatusOpening,
	GameStatusRecruiting,
	GameStatusProgress,
	GameStatusEpilogue,
	GameStatusFinished,
	GameStatusCancelled,
}

func (e GameStatus) IsValid() bool {
	switch e {
	case GameStatusClosed, GameStatusOpening, GameStatusRecruiting, GameStatusProgress, GameStatusEpilogue, GameStatusFinished, GameStatusCancelled:
		return true
	}
	return false
}

func (e GameStatus) String() string {
	return string(e)
}

func (e *GameStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = GameStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid GameStatus", str)
	}
	return nil
}

func (e GameStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type MessageType string

const (
	MessageTypeTalkNormal    MessageType = "TalkNormal"
	MessageTypeMonologue     MessageType = "Monologue"
	MessageTypeDescription   MessageType = "Description"
	MessageTypeSystemPublic  MessageType = "SystemPublic"
	MessageTypeSystemPrivate MessageType = "SystemPrivate"
)

var AllMessageType = []MessageType{
	MessageTypeTalkNormal,
	MessageTypeMonologue,
	MessageTypeDescription,
	MessageTypeSystemPublic,
	MessageTypeSystemPrivate,
}

func (e MessageType) IsValid() bool {
	switch e {
	case MessageTypeTalkNormal, MessageTypeMonologue, MessageTypeDescription, MessageTypeSystemPublic, MessageTypeSystemPrivate:
		return true
	}
	return false
}

func (e MessageType) String() string {
	return string(e)
}

func (e *MessageType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = MessageType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid MessageType", str)
	}
	return nil
}

func (e MessageType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type SnsType string

const (
	SnsTypeTwitter  SnsType = "Twitter"
	SnsTypeMastodon SnsType = "Mastodon"
	SnsTypeMisskey  SnsType = "Misskey"
	SnsTypeDiscord  SnsType = "Discord"
	SnsTypeGithub   SnsType = "Github"
	SnsTypeWebSite  SnsType = "WebSite"
	SnsTypePixiv    SnsType = "Pixiv"
)

var AllSnsType = []SnsType{
	SnsTypeTwitter,
	SnsTypeMastodon,
	SnsTypeMisskey,
	SnsTypeDiscord,
	SnsTypeGithub,
	SnsTypeWebSite,
	SnsTypePixiv,
}

func (e SnsType) IsValid() bool {
	switch e {
	case SnsTypeTwitter, SnsTypeMastodon, SnsTypeMisskey, SnsTypeDiscord, SnsTypeGithub, SnsTypeWebSite, SnsTypePixiv:
		return true
	}
	return false
}

func (e SnsType) String() string {
	return string(e)
}

func (e *SnsType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = SnsType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid SnsType", str)
	}
	return nil
}

func (e SnsType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
