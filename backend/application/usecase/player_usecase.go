package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
)

type PlayerUsecase interface {
	FindPlayers(ctx context.Context, query model.PlayersQuery) ([]model.Player, error)
	Find(ctx context.Context, ID uint32) (player *model.Player, err error)
	FindByName(ctx context.Context, name string) (player *model.Player, err error)
	FindByUserName(ctx context.Context, username string) (player *model.Player, err error)
	FindProfile(ctx context.Context, ID uint32) (profile *model.PlayerProfile, err error)
	SaveProfile(ctx context.Context, name string, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error)
	FindAuthorities(ctx context.Context, ID uint32) (authorities []model.PlayerAuthority, err error)
	RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error)
	UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error
	DeleteSnsAccount(ctx context.Context, ID uint32) error
}

type playerUsecase struct {
	playerService app_service.PlayerService
	transaction   Transaction
}

func NewPlayerUsecase(playerService app_service.PlayerService,
	tx Transaction) PlayerUsecase {
	return &playerUsecase{
		playerService: playerService,
		transaction:   tx,
	}
}

func (s *playerUsecase) FindPlayers(ctx context.Context, query model.PlayersQuery) ([]model.Player, error) {
	return s.playerService.FindPlayers(ctx, query)
}

func (s *playerUsecase) Find(ctx context.Context, ID uint32) (player *model.Player, err error) {
	return s.playerService.Find(ctx, ID)
}

func (s *playerUsecase) FindByName(ctx context.Context, name string) (player *model.Player, err error) {
	return s.playerService.FindByName(ctx, name)
}

func (s *playerUsecase) FindByUserName(ctx context.Context, username string) (player *model.Player, err error) {
	return s.playerService.FindByUserName(ctx, username)
}

// FindProfile implements PlayerUsecase.
func (s *playerUsecase) FindProfile(ctx context.Context, ID uint32) (profile *model.PlayerProfile, err error) {
	return s.playerService.FindProfile(ctx, ID)
}

// SaveProfile implements PlayerUsecase.
func (s *playerUsecase) SaveProfile(ctx context.Context, name string, profile *model.PlayerProfile) (saved *model.PlayerProfile, err error) {
	pp, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return s.playerService.SaveProfile(ctx, name, profile)
	})
	if err != nil {
		return nil, err
	}
	return pp.(*model.PlayerProfile), nil
}

// FindAuthorities implements PlayerUsecase.
func (s *playerUsecase) FindAuthorities(ctx context.Context, ID uint32) (authorities []model.PlayerAuthority, err error) {
	return s.playerService.FindAuthorities(ctx, ID)
}

// RegisterSnsAccount implements PlayerUsecase.
func (s *playerUsecase) RegisterSnsAccount(ctx context.Context, playerID uint32, account *model.PlayerSnsAccount) (saved *model.PlayerSnsAccount, err error) {
	ps, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return s.playerService.RegisterSnsAccount(ctx, playerID, account)
	})
	if err != nil {
		return nil, err
	}
	return ps.(*model.PlayerSnsAccount), nil
}

// UpdateSnsAccount implements PlayerUsecase.
func (s *playerUsecase) UpdateSnsAccount(ctx context.Context, ID uint32, account *model.PlayerSnsAccount) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return nil, s.playerService.UpdateSnsAccount(ctx, ID, account)
	})
	return err
}

// DeleteSnsAccount implements PlayerUsecase.
func (s *playerUsecase) DeleteSnsAccount(ctx context.Context, ID uint32) error {
	_, err := s.transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		return nil, s.playerService.DeleteSnsAccount(ctx, ID)
	})
	return err
}
