package db

import (
	"chat-role-play/domain/model"
	"time"
)

type Message struct {
	ID                       uint64
	GameID                   uint32
	GamePeriodID             uint32
	SenderGameParticipantID  *uint32
	SenderCharaImageID       *uint32
	SenderCharaName          *string
	ReplyToMessageID         *uint64
	ReplyToGameParticipantID *uint32
	MessageTypeCode          string
	MessageNumber            uint32
	MessageContent           string
	SendAt                   time.Time
	SendUnixtimeMilli        uint64
	IsConvertDisabled        bool
	ReplyCount               uint32
	FavoriteCount            uint32
	CreatedAt                time.Time
	UpdatedAt                time.Time
}

func (m Message) ToModel() *model.Message {
	var sender *model.MessageSender
	if m.SenderGameParticipantID != nil {
		sender = &model.MessageSender{
			GameParticipantID: *m.SenderGameParticipantID,
			CharaImageID:      *m.SenderCharaImageID,
			CharaName:         *m.SenderCharaName,
		}
	}
	var replyTo *model.MessageReplyTo
	if m.ReplyToMessageID != nil {
		replyTo = &model.MessageReplyTo{
			MessageID:         *m.ReplyToMessageID,
			GameParticipantID: *m.ReplyToGameParticipantID,
		}
	}
	return &model.Message{
		ID:           m.ID,
		GamePeriodID: m.GamePeriodID,
		Type:         *model.MessageTypeValueOf(m.MessageTypeCode),
		Sender:       sender,
		ReplyTo:      replyTo,
		Content: model.MessageContent{
			Number:            m.MessageNumber,
			Text:              m.MessageContent,
			IsConvertDisabled: m.IsConvertDisabled,
		},
		Time: model.MessageTime{
			SendAt:        m.SendAt,
			UnixtimeMilli: m.SendUnixtimeMilli,
		},
		Reactions: model.MessageReactions{
			ReplyCount:    m.ReplyCount,
			FavoriteCount: m.FavoriteCount,
		},
	}
}

type MessageReply struct {
	ID             uint64
	GameID         uint32
	MessageID      uint64
	ReplyMessageID uint64
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (MessageReply) TableName() string {
	return "message_replies"
}

type MessageFavorite struct {
	ID                uint64
	GameID            uint32
	MessageID         uint64
	GameParticipantID uint32
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type DirectMessage struct {
	ID                      uint64
	GameID                  uint32
	GameParticipantGroupID  uint32
	GamePeriodID            uint32
	SenderGameParticipantID *uint32
	SenderCharaImageID      *uint32
	SenderCharaName         *string
	MessageTypeCode         string
	MessageNumber           uint32
	MessageContent          string
	SendAt                  time.Time
	SendUnixtimeMilli       uint64
	IsConvertDisabled       bool
	FavoriteCount           uint32
	CreatedAt               time.Time
	UpdatedAt               time.Time
}

func (m DirectMessage) ToModel() *model.DirectMessage {
	var sender *model.MessageSender
	if m.SenderGameParticipantID != nil {
		sender = &model.MessageSender{
			GameParticipantID: *m.SenderGameParticipantID,
			CharaImageID:      *m.SenderCharaImageID,
			CharaName:         *m.SenderCharaName,
		}
	}
	return &model.DirectMessage{
		ID:           m.ID,
		GamePeriodID: m.GamePeriodID,
		Type:         *model.MessageTypeValueOf(m.MessageTypeCode),
		Sender:       sender,
		Content: model.MessageContent{
			Number:            m.MessageNumber,
			Text:              m.MessageContent,
			IsConvertDisabled: m.IsConvertDisabled,
		},
		Time: model.MessageTime{
			SendAt:        m.SendAt,
			UnixtimeMilli: m.SendUnixtimeMilli,
		},
		Reactions: model.DirectMessageReactions{
			FavoriteCount: m.FavoriteCount,
		},
	}
}

type DirectMessageFavorite struct {
	ID                uint64
	GameID            uint32
	DirectMessageID   uint64
	GameParticipantID uint32
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type GameParticipantGroup struct {
	ID                       uint32
	GameID                   uint32
	GameParticipantGroupName string
	CreatedAt                time.Time
	UpdatedAt                time.Time
}

func (g GameParticipantGroup) ToModel(
	gameParticipantIDs []uint32,
) *model.GameParticipantGroup {
	return &model.GameParticipantGroup{
		ID:        g.ID,
		Name:      g.GameParticipantGroupName,
		MemberIDs: gameParticipantIDs,
	}
}

type GameParticipantGroupMember struct {
	ID                     uint32
	GameParticipantGroupID uint32
	GameParticipantID      uint32
	CreatedAt              time.Time
	UpdatedAt              time.Time
}
