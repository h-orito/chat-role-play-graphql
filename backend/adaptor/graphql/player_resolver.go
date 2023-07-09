package graphql

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
)

func (r *gameMasterResolver) player(ctx context.Context, obj *gqlmodel.GameMaster) (*gqlmodel.Player, error) {
	thunk := r.loaders.PlayerLoader.Load(ctx, dataloader.StringKey(obj.PlayerID))
	p, err := thunk()
	if err != nil {
		return nil, err
	}
	player := p.(*model.Player)
	return MapToPlayer(player), nil
}

func (r *gameParticipantResolver) player(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.Player, error) {
	thunk := r.loaders.PlayerLoader.Load(ctx, dataloader.StringKey(obj.PlayerID))
	p, err := thunk()
	if err != nil {
		return nil, err
	}
	player := p.(*model.Player)
	return MapToPlayer(player), nil
}

func (r *queryResolver) player(ctx context.Context, id string) (*gqlmodel.Player, error) {
	playerID, err := idToUint32(id)
	if err != nil {
		return nil, err
	}
	p, err := r.playerUsecase.Find(playerID)
	if err != nil {
		return nil, err
	}
	return MapToPlayer(p), nil
}

func (r *mutationResolver) registerPlayerProfile(ctx context.Context, input gqlmodel.NewPlayerProfile) (*gqlmodel.RegisterPlayerProfilePayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	var imageUrl *string
	if input.ProfileImageFile != nil {
		url, err := r.imageUsecase.Upload(input.ProfileImageFile.File)
		if err != nil {
			return nil, err
		}
		imageUrl = url
	}
	saved, err := r.playerUsecase.SaveProfile(ctx, &model.PlayerProfile{
		PlayerID:        player.ID,
		ProfileImageURL: imageUrl,
		Introduction:    input.Introduction,
		SnsAccounts:     []model.PlayerSnsAccount{},
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterPlayerProfilePayload{
		PlayerProfile: MapToPlayerProfile(saved),
	}, nil
}

func (r *mutationResolver) updatePlayerProfile(ctx context.Context, input gqlmodel.UpdatePlayerProfile) (*gqlmodel.UpdatePlayerProfilePayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	var imageUrl *string
	if input.ProfileImageURL != nil {
		imageUrl = input.ProfileImageURL
	} else if input.ProfileImageFile != nil {
		url, err := r.imageUsecase.Upload(input.ProfileImageFile.File)
		if err != nil {
			return nil, err
		}
		imageUrl = url
	}
	if _, err := r.playerUsecase.SaveProfile(ctx, &model.PlayerProfile{
		PlayerID:        player.ID,
		ProfileImageURL: imageUrl,
		Introduction:    input.Introduction,
		SnsAccounts:     []model.PlayerSnsAccount{},
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdatePlayerProfilePayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) registerPlayerSnsAccount(ctx context.Context, input gqlmodel.NewPlayerSnsAccount) (*gqlmodel.RegisterPlayerSnsAccountPayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	saved, err := r.playerUsecase.RegisterSnsAccount(ctx, player.ID, &model.PlayerSnsAccount{
		SnsType:     *model.SnsTypeValueOf(input.Type.String()),
		AccountName: input.AccountName,
		AccountURL:  input.AccountURL,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterPlayerSnsAccountPayload{
		PlayerSnsAccount: MapToPlayerSnsAccount(*saved),
	}, nil
}

func (r *mutationResolver) updatePlayerSnsAccount(ctx context.Context, input gqlmodel.UpdatePlayerSnsAccount) (*gqlmodel.UpdatePlayerSnsAccountPayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	profile, err := r.playerUsecase.FindProfile(player.ID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, fmt.Errorf("profile not found")
	}
	saID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if array.None(profile.SnsAccounts, func(sa model.PlayerSnsAccount) bool {
		return sa.ID == saID
	}) {
		return nil, fmt.Errorf("sns account not found")
	}
	if err := r.playerUsecase.UpdateSnsAccount(ctx, saID, &model.PlayerSnsAccount{
		SnsType:     *model.SnsTypeValueOf(input.Type.String()),
		AccountName: input.AccountName,
		AccountURL:  input.AccountURL,
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdatePlayerSnsAccountPayload{
		Ok: true,
	}, nil
}

func (r *mutationResolver) deletePlayerSnsAccount(ctx context.Context, input gqlmodel.DeletePlayerSnsAccount) (*gqlmodel.DeletePlayerSnsAccountPayload, error) {
	user := auth.GetUser(ctx)
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}
	player, err := r.playerUsecase.FindByUserName(user.UserName)
	if err != nil {
		return nil, err
	}
	profile, err := r.playerUsecase.FindProfile(player.ID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, fmt.Errorf("profile not found")
	}
	saID, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if array.None(profile.SnsAccounts, func(sa model.PlayerSnsAccount) bool {
		return sa.ID == saID
	}) {
		return nil, fmt.Errorf("sns account not found")
	}
	if err := r.playerUsecase.DeleteSnsAccount(ctx, saID); err != nil {
		return nil, err
	}
	return &gqlmodel.DeletePlayerSnsAccountPayload{
		Ok: true,
	}, nil
}
