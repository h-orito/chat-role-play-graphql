package graphql

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/config"
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"context"
	"errors"
	"strconv"
)

func isLocal() bool {
	cfg, err := config.Load()
	if err != nil {
		return false
	}
	return cfg.Env == "local"
}

// RegisterDebugMessages is the resolver for the registerDebugMessages field.
func (r *mutationResolver) registerDebugMessages(ctx context.Context, input gqlmodel.RegisterDebugMessages) (*gqlmodel.RegisterDebugMessagesPayload, error) {
	if !isLocal() {
		return nil, errors.New("this is not local environment")
	}
	gameID, err := idToUint32(input.GameID)
	if err != nil {
		return nil, err
	}
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, nil
	}
	for i := 0; i < 100; i++ {
		m := &model.Message{
			Type: model.MessageTypeSystemPublic,
			Content: model.MessageContent{
				Text: "テストメッセージ" + strconv.Itoa(i),
			},
		}
		if err := r.messageUsecase.RegisterMessage(ctx, gameID, *user, *m); err != nil {
			return nil, err
		}
	}
	return &gqlmodel.RegisterDebugMessagesPayload{
		Ok: true,
	}, nil
}
