package graphql

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"

	"github.com/graph-gophers/dataloader"
)

func (r *mutationResolver) registerMessageDryRun(ctx context.Context, input gqlmodel.NewMessage) (*gqlmodel.RegisterMessageDryRunPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	msg, err := MapNewMessageToMessage(input)
	if err != nil {
		return nil, err
	}
	m, err := r.messageUsecase.RegisterMessageDryRun(ctx, gameID, *user, *msg)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterMessageDryRunPayload{
		Message: MapToMessage(m),
	}, nil
}

func (r *mutationResolver) registerMessage(ctx context.Context, input gqlmodel.NewMessage) (*gqlmodel.RegisterMessagePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	msg, err := MapNewMessageToMessage(input)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.RegisterMessage(ctx, gameID, *user, *msg); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterMessagePayload{
		Ok: true,
	}, nil
}

func MapNewMessageToMessage(input gqlmodel.NewMessage) (*model.Message, error) {
	messageType := model.MessageTypeValueOf(input.Type.String())
	var sender *model.MessageSender
	if !messageType.IsSystem() {
		iconID, err := idToUint32(*input.IconID)
		if err != nil {
			return nil, err
		}
		sender = &model.MessageSender{
			SenderIconID: iconID,
			SenderName:   *input.Name,
		}
	}
	var replyTo *model.MessageReplyTo
	if input.ReplyToMessageID != nil {
		rtID, err := idToUint64(*input.ReplyToMessageID)
		if err != nil {
			return nil, err
		}
		replyTo = &model.MessageReplyTo{
			MessageID: rtID,
		}
	}
	return &model.Message{
		Type:    *messageType,
		Sender:  sender,
		ReplyTo: replyTo,
		Content: model.MessageContent{
			Text:              input.Text,
			IsConvertDisabled: input.IsConvertDisabled,
		},
	}, nil
}

func (r *mutationResolver) registerMessageFavorite(ctx context.Context, input gqlmodel.NewMessageFavorite) (*gqlmodel.RegisterMessageFavoritePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	messageID, err := idToUint64(input.MessageID)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.RegisterMessageFavorite(ctx, gameID, *user, messageID); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterMessageFavoritePayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) deleteMessageFavorite(ctx context.Context, input gqlmodel.DeleteMessageFavorite) (*gqlmodel.DeleteMessageFavoritePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	messageID, err := idToUint64(input.MessageID)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.DeleteMessageFavorite(ctx, gameID, *user, messageID); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteMessageFavoritePayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) registerDirectMessageDryRun(ctx context.Context, input gqlmodel.NewDirectMessage) (*gqlmodel.RegisterDirectMessageDryRunPayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	msg, err := MapNewDirectMessageToDirectMessage(input)
	if err != nil {
		return nil, err
	}
	m, err := r.messageUsecase.RegisterDirectMessageDryRun(ctx, gameID, *user, *msg)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterDirectMessageDryRunPayload{
		DirectMessage: MapToDirectMessage(m),
	}, nil
}

func (r *mutationResolver) registerDirectMessage(ctx context.Context, input gqlmodel.NewDirectMessage) (*gqlmodel.RegisterDirectMessagePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	msg, err := MapNewDirectMessageToDirectMessage(input)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.RegisterDirectMessage(ctx, gameID, *user, *msg); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterDirectMessagePayload{
		Ok: true,
	}, nil
}

func MapNewDirectMessageToDirectMessage(input gqlmodel.NewDirectMessage) (*model.DirectMessage, error) {
	gameParticipantGroupID, err := idToUint32(input.GameParticipantGroupID)
	if err != nil {
		return nil, err
	}
	messageType := model.MessageTypeValueOf(input.Type.String())
	var sender *model.MessageSender
	if !messageType.IsSystem() {
		iconID, err := idToUint32(input.IconID)
		if err != nil {
			return nil, err
		}
		sender = &model.MessageSender{
			SenderIconID: iconID,
			SenderName:   input.Name,
		}
	}
	return &model.DirectMessage{
		GameParticipantGroupID: gameParticipantGroupID,
		Type:                   *messageType,
		Sender:                 sender,
		Content: model.MessageContent{
			Text:              input.Text,
			IsConvertDisabled: input.IsConvertDisabled,
		},
	}, nil
}

func (r *mutationResolver) registerDirectMessageFavorite(ctx context.Context, input gqlmodel.NewDirectMessageFavorite) (*gqlmodel.RegisterDirectMessageFavoritePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	directMessageID, err := idToUint64(input.DirectMessageID)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.RegisterDirectMessageFavorite(ctx, gameID, *user, directMessageID); err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterDirectMessageFavoritePayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) deleteDirectMessageFavorite(ctx context.Context, input gqlmodel.DeleteDirectMessageFavorite) (*gqlmodel.DeleteDirectMessageFavoritePayload, error) {
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	directMessageID, err := idToUint64(input.DirectMessageID)
	if err != nil {
		return nil, err
	}
	if err := r.messageUsecase.DeleteDirectMessageFavorite(ctx, gameID, *user, directMessageID); err != nil {
		return nil, err
	}
	return &gqlmodel.DeleteDirectMessageFavoritePayload{
		Ok: true,
	}, nil
}

func (r *queryResolver) messages(ctx context.Context, gameID string, query gqlmodel.MessagesQuery) (*gqlmodel.Messages, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	q, err := r.MapToMessagesQuery(query)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	messages, err := r.messageUsecase.FindMessages(gID, *q, user)
	if err != nil {
		return nil, err
	}
	ms := MapToMessages(messages)
	return &ms, nil
}

func (r *queryResolver) messagesLatestUnixTimeMilli(ctx context.Context, gameID string, query gqlmodel.MessagesQuery) (uint64, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return 0, err
	}
	q, err := r.MapToMessagesQuery(query)
	if err != nil {
		return 0, err
	}
	user := auth.GetUser(ctx)
	latest, err := r.messageUsecase.FindMessagesLatestUnixTimeMilli(gID, *q, user)
	if err != nil {
		return 0, err
	}
	return latest, nil
}

func (r *queryResolver) MapToMessagesQuery(query gqlmodel.MessagesQuery) (*model.MessagesQuery, error) {
	var err error
	var IDs *[]uint64
	if query.Ids != nil {
		ids := array.Map(query.Ids, func(id string) uint64 {
			i, e := idToUint64(id)
			if e != nil {
				err = e
			}
			return i
		})
		IDs = &ids
	}
	if err != nil {
		return nil, err
	}
	var periodID *uint32
	if query.PeriodID != nil {
		id, e := idToUint32(*query.PeriodID)
		if err != nil {
			err = e
		}
		periodID = &id
	}
	if err != nil {
		return nil, err
	}
	var types *[]model.MessageType
	if query.Types != nil {
		ts := array.Map(query.Types, func(t gqlmodel.MessageType) model.MessageType {
			return *model.MessageTypeValueOf(t.String())
		})
		types = &ts
	}
	var senderIDs *[]uint32
	if query.SenderIds != nil {
		ids := array.Map(query.SenderIds, func(id string) uint32 {
			i, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return i
		})
		senderIDs = &ids
	}
	if err != nil {
		return nil, err
	}
	var replyToMessageID *uint64
	if query.ReplyToMessageID != nil {
		id, e := idToUint64(*query.ReplyToMessageID)
		if e != nil {
			err = e
		}
		replyToMessageID = &id
	}
	if err != nil {
		return nil, err
	}
	var paging *model.PagingQuery
	if query.Paging != nil {
		paging = &model.PagingQuery{
			PageSize:   query.Paging.PageSize,
			PageNumber: query.Paging.PageNumber,
			Desc:       query.Paging.IsDesc,
		}
	}

	return &model.MessagesQuery{
		IDs:                 IDs,
		GamePeriodID:        periodID,
		Types:               types,
		SenderIDs:           senderIDs,
		ReplyToMessageID:    replyToMessageID,
		Keywords:            &query.Keywords,
		SinceAt:             query.SinceAt,
		UntilAt:             query.UntilAt,
		OffsetUnixtimeMilli: query.OffsetUnixTimeMilli,
		Paging:              paging,
	}, nil
}

func (r *queryResolver) message(ctx context.Context, gameID string, messageID string) (*gqlmodel.Message, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	mID, err := idToUint64(messageID)
	if err != nil {
		return nil, err
	}
	message, err := r.messageUsecase.FindMessage(gID, mID)
	if err != nil {
		return nil, err
	}
	return MapToMessage(message), nil
}

func (r *queryResolver) messageReplies(ctx context.Context, gameID string, messageID string) ([]*gqlmodel.Message, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	mID, err := idToUint64(messageID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	messages, err := r.messageUsecase.FindMessageReplies(gID, mID, user)
	if err != nil {
		return nil, err
	}
	return array.Map(messages, func(m model.Message) *gqlmodel.Message {
		return MapToMessage(&m)
	}), nil
}

func (r *queryResolver) messageFavoriteGameParticipants(ctx context.Context, gameID string, messageID string) ([]*gqlmodel.GameParticipant, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	mID, err := idToUint64(messageID)
	if err != nil {
		return nil, err
	}
	pts, err := r.messageUsecase.FindMessageFavoriteGameParticipants(gID, mID)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipants(pts.List), nil
}

func (r *queryResolver) directMessages(ctx context.Context, gameID string, query gqlmodel.DirectMessagesQuery) (*gqlmodel.DirectMessages, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	q, err := r.MapToDirectMessagesQuery(query)
	if err != nil {
		return nil, err
	}
	messages, err := r.messageUsecase.FindDirectMessages(gID, *q)
	if err != nil {
		return nil, err
	}
	ms := MapToDirectMessages(messages)
	return &ms, nil
}

func (r *queryResolver) directMessagesLatestUnixTimeMilli(ctx context.Context, gameID string, query gqlmodel.DirectMessagesQuery) (uint64, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return 0, err
	}
	q, err := r.MapToDirectMessagesQuery(query)
	if err != nil {
		return 0, err
	}
	latest, err := r.messageUsecase.FindDirectMessagesLatestUnixTimeMilli(gID, *q)
	if err != nil {
		return 0, err
	}
	return latest, nil
}

func (r *queryResolver) MapToDirectMessagesQuery(query gqlmodel.DirectMessagesQuery) (*model.DirectMessagesQuery, error) {
	var err error
	var IDs *[]uint64
	if query.Ids != nil {
		ids := array.Map(query.Ids, func(id string) uint64 {
			i, e := idToUint64(id)
			if e != nil {
				err = e
			}
			return i
		})
		IDs = &ids
	}
	if err != nil {
		return nil, err
	}
	groupID, err := idToUint32(query.ParticipantGroupID)
	if err != nil {
		return nil, err
	}
	var periodID *uint32
	if query.PeriodID != nil {
		id, e := idToUint32(*query.PeriodID)
		if err != nil {
			err = e
		}
		periodID = &id
	}
	if err != nil {
		return nil, err
	}
	var types *[]model.MessageType
	if query.Types != nil {
		ts := array.Map(query.Types, func(t gqlmodel.MessageType) model.MessageType {
			return *model.MessageTypeValueOf(t.String())
		})
		types = &ts
	}
	var senderIDs *[]uint32
	if query.SenderIds != nil {
		ids := array.Map(query.SenderIds, func(id string) uint32 {
			i, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return i
		})
		senderIDs = &ids
	}
	if err != nil {
		return nil, err
	}
	var paging *model.PagingQuery
	if query.Paging != nil {
		paging = &model.PagingQuery{
			PageSize:   query.Paging.PageSize,
			PageNumber: query.Paging.PageNumber,
			Desc:       query.Paging.IsDesc,
		}
	}

	return &model.DirectMessagesQuery{
		IDs:                    IDs,
		GameParticipantGroupID: &groupID,
		GamePeriodID:           periodID,
		Types:                  types,
		SenderIDs:              senderIDs,
		Keywords:               &query.Keywords,
		SinceAt:                query.SinceAt,
		UntilAt:                query.UntilAt,
		OffsetUnixtimeMilli:    query.OffsetUnixTimeMilli,
		Paging:                 paging,
	}, nil
}

func (r *queryResolver) directMessage(ctx context.Context, gameID string, directMessageID string) (*gqlmodel.DirectMessage, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	mID, err := idToUint64(directMessageID)
	if err != nil {
		return nil, err
	}
	message, err := r.messageUsecase.FindDirectMessage(gID, mID)
	if err != nil {
		return nil, err
	}
	return MapToDirectMessage(message), nil
}

func (r *queryResolver) directMessageFavoriteGameParticipants(ctx context.Context, gameID string, directMessageID string) ([]*gqlmodel.GameParticipant, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	mID, err := idToUint64(directMessageID)
	if err != nil {
		return nil, err
	}
	pts, err := r.messageUsecase.FindDirectMessageFavoriteGameParticipants(gID, mID)
	if err != nil {
		return nil, err
	}
	return MapToGameParticipants(pts.List), nil
}

func (r *queryResolver) gameParticipantGroups(ctx context.Context, gameID string, query gqlmodel.GameParticipantGroupsQuery) ([]*gqlmodel.GameParticipantGroup, error) {
	gID, err := idToUint32(gameID)
	if err != nil {
		return nil, err
	}
	var memberID *uint32
	if query.MemberParticipantID != nil {
		id, err := idToUint32(*query.MemberParticipantID)
		if err != nil {
			return nil, err
		}
		memberID = &id
	}
	groups, err := r.messageUsecase.FindGameParticipantGroups(model.GameParticipantGroupsQuery{
		GameID:                   gID,
		MemberGroupParticipantID: memberID,
	})
	if err != nil {
		return nil, err
	}
	return array.Map(groups, func(g model.GameParticipantGroup) *gqlmodel.GameParticipantGroup {
		return MapToGameParticipantGroup(&g)
	}), nil
}

func (r *mutationResolver) registerGameParticipantGroup(ctx context.Context, input gqlmodel.NewGameParticipantGroup) (*gqlmodel.RegisterGameParticipantGroupPayload, error) {
	gID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	memberIDs := array.Map(input.GameParticipantIds, func(id string) uint32 {
		i, e := idToUint32(id)
		if e != nil {
			err = e
		}
		return i
	})
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	saved, err := r.messageUsecase.RegisterGameParticipantGroup(ctx, *user, gID, model.GameParticipantGroup{
		Name:      input.Name,
		MemberIDs: memberIDs,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterGameParticipantGroupPayload{
		GameParticipantGroup: MapToGameParticipantGroup(saved),
	}, nil
}

func (r *mutationResolver) updateGameParticipantGroup(ctx context.Context, input gqlmodel.UpdateGameParticipantGroup) (*gqlmodel.UpdateGameParticipantGroupPayload, error) {
	gID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	groupID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	err = r.messageUsecase.UpdateGameParticipantGroup(ctx, *user, gID, model.GameParticipantGroup{
		ID:   groupID,
		Name: input.Name,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateGameParticipantGroupPayload{
		Ok: true,
	}, nil
}

func (r *gameParticipantGroupResolver) participants(ctx context.Context, obj *gqlmodel.GameParticipantGroup) ([]*gqlmodel.GameParticipant, error) {
	thunk := r.loaders.ParticipantLoader.LoadMany(ctx, dataloader.NewKeysFromStrings(obj.ParticipantIDs))
	p, errs := thunk()
	if errs != nil || len(errs) > 0 {
		return nil, errs[0]
	}
	return array.Map(p, func(p interface{}) *gqlmodel.GameParticipant {
		participant := p.(*model.GameParticipant)
		return MapToGameParticipant(*participant)
	}), nil
}
