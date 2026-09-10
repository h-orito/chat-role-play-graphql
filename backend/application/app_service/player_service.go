package app_service

import (
	"chat-role-play/domain/model"
	"context"
)

type PlayerService interface {
	FindPlayers(ctx context.Context, query model.PlayersQuery) ([]model.Player, error)
	Find(ctx context.Context, ID uint32) (player *model.Player, err error)
	FindByName(ctx context.Context, name string) (player *model.Player, err error)
	FindByUserName(ctx context.Context, name string) (player *model.Player, err error)
	Save(ctx context.Context, player model.Player) (saved *model.Player, err error)
	FindProfile(ctx context.Context, ID uint32) (profile *model.PlayerProfile, err error)
	SaveProfile(ctx context.Context, name string, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error)
	FindAuthorities(ctx context.Context, ID uint32) (authorities []model.PlayerAuthority, err error)
	RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error)
	UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error
	DeleteSnsAccount(ctx context.Context, ID uint32) error
}

type playerService struct {
	playerRepository model.PlayerRepository
	userRepository   model.UserRepository
}

func NewPlayerService(
	playerRepository model.PlayerRepository,
	userRepository model.UserRepository,
) PlayerService {
	return &playerService{
		playerRepository: playerRepository,
		userRepository:   userRepository,
	}
}

func (s *playerService) FindPlayers(ctx context.Context, query model.PlayersQuery) ([]model.Player, error) {
	return s.playerRepository.FindPlayers(ctx, query)
}

func (s *playerService) Find(ctx context.Context, ID uint32) (player *model.Player, err error) {
	return s.playerRepository.Find(ctx, ID)
}

func (s *playerService) FindByName(ctx context.Context, name string) (player *model.Player, err error) {
	return s.playerRepository.FindByName(ctx, name)
}

func (s *playerService) FindByUserName(ctx context.Context, name string) (player *model.Player, err error) {
	return s.playerRepository.FindByUserName(ctx, name)
}

func (s *playerService) Save(ctx context.Context, player model.Player) (saved *model.Player, err error) {
	return s.playerRepository.Save(ctx, &player)
}

// FindProfile implements PlayerService.
func (s *playerService) FindProfile(ctx context.Context, ID uint32) (profile *model.PlayerProfile, err error) {
	return s.playerRepository.FindProfile(ctx, ID)
}

// SaveProfile implements PlayerService.
func (s *playerService) SaveProfile(ctx context.Context, name string, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error) {
	return s.playerRepository.SaveProfile(ctx, name, profile)
}

// FindAuthorities implements PlayerService.
func (s *playerService) FindAuthorities(ctx context.Context, ID uint32) (authorities []model.PlayerAuthority, err error) {
	return s.userRepository.FindPlayerAuthorities(ctx, ID)
}

// RegisterSnsAccount implements PlayerService.
func (s *playerService) RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error) {
	return s.playerRepository.RegisterSnsAccount(ctx, playerID, account)
}

// UpdateSnsAccount implements PlayerService.
func (s *playerService) UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error {
	return s.playerRepository.UpdateSnsAccount(ctx, ID, account)
}

// DeleteSnsAccount implements PlayerService.
func (s *playerService) DeleteSnsAccount(ctx context.Context, ID uint32) error {
	return s.playerRepository.DeleteSnsAccount(ctx, ID)
}
