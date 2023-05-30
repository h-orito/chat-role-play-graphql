package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
)

type PlayerUsecase interface {
	FindPlayers(IDs []uint32) ([]model.Player, error)
	Find(ID uint32) (player *model.Player, err error)
	FindByName(name string) (player *model.Player, err error)
	FindByUserName(username string) (player *model.Player, err error)
	FindProfile(ID uint32) (profile *model.PlayerProfile, err error)
	SaveProfile(ctx context.Context, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error)
	RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error)
	UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error
	DeleteSnsAccount(ctx context.Context, ID uint32) error
}

type playerUsecase struct {
	playerService app_service.PlayerService
}

func NewPlayerUsecase(playerService app_service.PlayerService) PlayerUsecase {
	return &playerUsecase{
		playerService: playerService,
	}
}

func (s *playerUsecase) FindPlayers(IDs []uint32) ([]model.Player, error) {
	return s.playerService.FindPlayers(IDs)
}

func (s *playerUsecase) Find(ID uint32) (player *model.Player, err error) {
	return s.playerService.Find(ID)
}

func (s *playerUsecase) FindByName(name string) (player *model.Player, err error) {
	return s.playerService.FindByName(name)
}

func (s *playerUsecase) FindByUserName(username string) (player *model.Player, err error) {
	return s.playerService.FindByUserName(username)
}

// FindProfile implements PlayerUsecase.
func (s *playerUsecase) FindProfile(ID uint32) (profile *model.PlayerProfile, err error) {
	return s.playerService.FindProfile(ID)
}

// SaveProfile implements PlayerUsecase.
func (s *playerUsecase) SaveProfile(ctx context.Context, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error) {
	return s.playerService.SaveProfile(ctx, profile)
}

// RegisterSnsAccount implements PlayerUsecase.
func (s *playerUsecase) RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error) {
	return s.playerService.RegisterSnsAccount(ctx, playerID, account)
}

// UpdateSnsAccount implements PlayerUsecase.
func (s *playerUsecase) UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error {
	return s.playerService.UpdateSnsAccount(ctx, ID, account)
}

// DeleteSnsAccount implements PlayerUsecase.
func (s *playerUsecase) DeleteSnsAccount(ctx context.Context, ID uint32) error {
	return s.playerService.DeleteSnsAccount(ctx, ID)
}
