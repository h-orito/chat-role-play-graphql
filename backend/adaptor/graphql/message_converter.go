package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
)

func MapToMessages(ms model.Messages) gqlmodel.Messages {
	list := array.Map(ms.List, func(m model.Message) *gqlmodel.Message {
		return MapToMessage(&m)
	})

	var currentPageNumber *int
	if ms.CurrentPageNumber != nil {
		n := int(*ms.CurrentPageNumber)
		currentPageNumber = &n
	}
	return gqlmodel.Messages{
		List:                list,
		AllPageCount:        int(ms.AllPageCount),
		HasPrePage:          ms.HasPrePage,
		HasNextPage:         ms.HasNextPage,
		CurrentPageNumber:   currentPageNumber,
		IsDesc:              ms.IsDesc,
		IsLatest:            ms.IsLatest,
		LatestUnixTimeMilli: ms.LatestUnixTimeMilli,
	}

}
func MapToMessage(m *model.Message) *gqlmodel.Message {
	if m == nil {
		return nil
	}
	var sender *gqlmodel.MessageSender
	if m.Sender != nil {
		var iconID *string
		if m.Sender.SenderIconID != nil {
			icID := intIdToBase64(*m.Sender.SenderIconID, "GameParticipantIcon")
			iconID = &icID
		}
		sender = &gqlmodel.MessageSender{
			ParticipantID: intIdToBase64(m.Sender.GameParticipantID, "GameParticipant"),
			Name:          m.Sender.SenderName,
			EntryNumber:   int(m.Sender.SenderEntryNumber),
			IconID:        iconID,
		}
	}
	var receiver *gqlmodel.MessageReceiver
	if m.Receiver != nil {
		receiver = &gqlmodel.MessageReceiver{
			ParticipantID: intIdToBase64(m.Receiver.GameParticipantID, "GameParticipant"),
			Name:          m.Receiver.ReceiverName,
			EntryNumber:   int(m.Receiver.ReceiverEntryNumber),
		}
	}
	var replyTo *gqlmodel.MessageRecipient
	if m.ReplyTo != nil {
		replyTo = &gqlmodel.MessageRecipient{
			MessageID:     int64IdToBase64(m.ReplyTo.MessageID, "Message"),
			ParticipantID: intIdToBase64(m.ReplyTo.GameParticipantID, "GameParticipant"),
		}
	}
	return &gqlmodel.Message{
		ID: int64IdToBase64(m.ID, "Message"),
		Content: &gqlmodel.MessageContent{
			Type:              gqlmodel.MessageType(m.Type.String()),
			Number:            int(m.Content.Number),
			Text:              m.Content.Text,
			IsConvertDisabled: m.Content.IsConvertDisabled,
		},
		Time: &gqlmodel.MessageTime{
			SendAt:            m.Time.SendAt,
			SendUnixTimeMilli: m.Time.UnixtimeMilli,
		},
		Sender:   sender,
		Receiver: receiver,
		ReplyTo:  replyTo,
		Reactions: &gqlmodel.MessageReactions{
			ReplyCount:    int(m.Reactions.ReplyCount),
			FavoriteCount: int(m.Reactions.FavoriteCount),
			FavoriteParticipantIds: array.Map(m.Reactions.FavoriteParticipantIDs, func(id uint32) string {
				return intIdToBase64(id, "GameParticipant")
			}),
		},
	}
}

func MapToGameParticipantGroup(g *model.GameParticipantGroup) *gqlmodel.GameParticipantGroup {
	if g == nil {
		return nil
	}
	return &gqlmodel.GameParticipantGroup{
		ID:   intIdToBase64(g.ID, "GameParticipantGroup"),
		Name: g.Name,
		ParticipantIDs: array.Map(g.MemberIDs, func(id uint32) string {
			return intIdToBase64(id, "GameParticipant")
		}),
		LatestUnixTimeMilli: g.LatestUnixTimeMilli,
	}
}

func MapToDirectMessages(ms model.DirectMessages) gqlmodel.DirectMessages {
	list := array.Map(ms.List, func(m model.DirectMessage) *gqlmodel.DirectMessage {
		return MapToDirectMessage(&m)
	})

	var currentPageNumber *int
	if ms.CurrentPageNumber != nil {
		n := int(*ms.CurrentPageNumber)
		currentPageNumber = &n
	}
	return gqlmodel.DirectMessages{
		List:                list,
		AllPageCount:        int(ms.AllPageCount),
		HasPrePage:          ms.HasPrePage,
		HasNextPage:         ms.HasNextPage,
		CurrentPageNumber:   currentPageNumber,
		IsDesc:              ms.IsDesc,
		IsLatest:            ms.IsLatest,
		LatestUnixTimeMilli: ms.LatestUnixTimeMilli,
	}

}
func MapToDirectMessage(m *model.DirectMessage) *gqlmodel.DirectMessage {
	if m == nil {
		return nil
	}
	var sender *gqlmodel.MessageSender
	if m.Sender != nil {
		var iconID *string
		if m.Sender.SenderIconID != nil {
			icID := intIdToBase64(*m.Sender.SenderIconID, "GameParticipantIcon")
			iconID = &icID
		}
		sender = &gqlmodel.MessageSender{
			ParticipantID: intIdToBase64(m.Sender.GameParticipantID, "GameParticipant"),
			Name:          m.Sender.SenderName,
			EntryNumber:   int(m.Sender.SenderEntryNumber),
			IconID:        iconID,
		}
	}
	return &gqlmodel.DirectMessage{
		ID: int64IdToBase64(m.ID, "DirectMessage"),
		Content: &gqlmodel.MessageContent{
			Type:              gqlmodel.MessageType(m.Type.String()),
			Number:            int(m.Content.Number),
			Text:              m.Content.Text,
			IsConvertDisabled: m.Content.IsConvertDisabled,
		},
		Time: &gqlmodel.MessageTime{
			SendAt:            m.Time.SendAt,
			SendUnixTimeMilli: m.Time.UnixtimeMilli,
		},
		Sender: sender,
		Reactions: &gqlmodel.DirectMessageReactions{
			FavoriteCounts: int(m.Reactions.FavoriteCount),
			FavoriteParticipantIds: array.Map(m.Reactions.FavoriteParticipantIDs, func(id uint32) string {
				return intIdToBase64(id, "GameParticipant")
			}),
		},
	}
}
