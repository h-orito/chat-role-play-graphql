package graphql

import (
	"chat-role-play/src/application/usecase"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
)

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

func (r *Resolver) idToIntId(id string) (uint32, error) {
	byte, err := base64.StdEncoding.DecodeString(id)
	if err != nil {
		return 0, err
	}
	parts := strings.Split(string(byte), ":")
	if len(parts) == 2 {
		number, err := strconv.Atoi(parts[1])
		if err != nil {
			return 0, err
		}
		return uint32(number), nil
	} else {
		return 0, fmt.Errorf("Invalid input format")
	}
}
