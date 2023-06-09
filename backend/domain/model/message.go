package model

import (
	"chat-role-play/util/array"
	"context"
	"time"
)

type Messages struct {
	List              []Message
	AllPageCount      uint32
	HasPrePage        bool
	HasNextPage       bool
	CurrentPageNumber *uint32
	IsDesc            bool
}

type Message struct {
	ID           uint64
	GamePeriodID uint32
	Type         MessageType
	Sender       *MessageSender
	ReplyTo      *MessageReplyTo
	Content      MessageContent
	Time         MessageTime
	Reactions    MessageReactions
}

type MessageType int

const (
	MessageTypeTalkNormal MessageType = iota
	MessageTypeMonologue
	MessageTypeDescription
	MessageTypeSystemPublic
	MessageTypeSystemPrivate
)

func (mt MessageType) String() string {
	switch mt {
	case MessageTypeTalkNormal:
		return "TalkNormal"
	case MessageTypeMonologue:
		return "Monologue"
	case MessageTypeDescription:
		return "Description"
	case MessageTypeSystemPublic:
		return "SystemPublic"
	case MessageTypeSystemPrivate:
		return "SystemPrivate"
	default:
		return ""
	}
}

func (mt MessageType) IsSystem() bool {
	switch mt {
	case MessageTypeTalkNormal:
		return false
	case MessageTypeMonologue:
		return false
	case MessageTypeDescription:
		return false
	case MessageTypeSystemPublic:
		return true
	case MessageTypeSystemPrivate:
		return true
	default:
		return false
	}
}

func MessageTypeValues() []MessageType {
	return []MessageType{
		MessageTypeTalkNormal,
		MessageTypeMonologue,
		MessageTypeDescription,
		MessageTypeSystemPublic,
		MessageTypeSystemPrivate,
	}
}

func MessageTypeValueOf(s string) *MessageType {
	return array.Find(MessageTypeValues(), func(mt MessageType) bool {
		return mt.String() == s
	})
}

type MessageSender struct {
	GameParticipantID uint32
	CharaImageID      uint32
	CharaName         string
}

type MessageReplyTo struct {
	MessageID         uint64
	GameParticipantID uint32
}

type MessageContent struct {
	Number            uint32
	Text              string
	IsConvertDisabled bool
}

type MessageTime struct {
	SendAt        time.Time
	UnixtimeMilli uint64
}

type MessageReactions struct {
	ReplyCount    uint32
	FavoriteCount uint32
}

type MessagesQuery struct {
	IDs                 *[]uint64
	GamePeriodID        *uint32
	Types               *[]MessageType
	SenderIDs           *[]uint32
	ReplyToMessageID    *uint64
	Keywords            *[]string
	SinceAt             *time.Time
	UntilAt             *time.Time
	OffsetUnixtimeMilli *uint64
	Paging              *PagingQuery
}

type DirectMessages struct {
	List              []DirectMessage
	AllPageCount      uint32
	HasPrePage        bool
	HasNextPage       bool
	CurrentPageNumber *uint32
	IsDesc            bool
}

type DirectMessage struct {
	ID                     uint64
	GameParticipantGroupID uint32
	GamePeriodID           uint32
	Type                   MessageType
	Sender                 *MessageSender
	Content                MessageContent
	Time                   MessageTime
	Reactions              DirectMessageReactions
}

type GameParticipantGroup struct {
	ID        uint32
	Name      string
	MemberIDs []uint32
}

type GameParticipantGroupsQuery struct {
	GameID                   uint32
	MemberGroupParticipantID *uint32
}

type DirectMessageReactions struct {
	FavoriteCount uint32
}

type DirectMessagesQuery struct {
	IDs                    *[]uint64
	GameParticipantGroupID *uint32
	GamePeriodID           *uint32
	Types                  *[]MessageType
	SenderIDs              *[]uint32
	Keywords               *[]string
	SinceAt                *time.Time
	UntilAt                *time.Time
	OffsetUnixtimeMilli    *uint64
	Paging                 *PagingQuery
}

type MessageRepository interface {
	// message
	FindMessages(gameID uint32, query MessagesQuery) (Messages, error)
	FindMessage(gameID uint32, ID uint64) (*Message, error)
	FindMessageReplies(gameID uint32, messageID uint64) ([]Message, error)
	FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (GameParticipants, error)
	RegisterMessage(ctx context.Context, gameID uint32, message Message) error
	RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	// participant group
	FindGameParticipantGroups(query GameParticipantGroupsQuery) ([]GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group GameParticipantGroup) error
	// direct message
	FindDirectMessages(gameID uint32, query DirectMessagesQuery) (DirectMessages, error)
	FindDirectMessage(gameID uint32, ID uint64) (*DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, gameID uint32, message DirectMessage) error
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
}
