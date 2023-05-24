package graphql

import "chat-role-play/src/application/usecase"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	gameUsecase   usecase.GameUsecase
	playerUsecase usecase.PlayerUsecase
	loaders       *Loaders
}

func NewResolver(
	gameUsecase usecase.GameUsecase,
	playerUsecase usecase.PlayerUsecase,
	loaders *Loaders,
) Resolver {
	return Resolver{
		gameUsecase:   gameUsecase,
		playerUsecase: playerUsecase,
		loaders:       loaders,
	}
}
