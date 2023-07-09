package graphql

import (
	"chat-role-play/application/usecase"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	charaUsecase   usecase.CharaUsecase
	gameUsecase    usecase.GameUsecase
	playerUsecase  usecase.PlayerUsecase
	messageUsecase usecase.MessageUsecase
	imageUsecase   usecase.ImageUsecase
	loaders        *Loaders
}

func NewResolver(
	charaUsecase usecase.CharaUsecase,
	gameUsecase usecase.GameUsecase,
	playerUsecase usecase.PlayerUsecase,
	messageUsecase usecase.MessageUsecase,
	imageUsecase usecase.ImageUsecase,
	loaders *Loaders,
) Resolver {
	return Resolver{
		charaUsecase:   charaUsecase,
		gameUsecase:    gameUsecase,
		playerUsecase:  playerUsecase,
		messageUsecase: messageUsecase,
		imageUsecase:   imageUsecase,
		loaders:        loaders,
	}
}

func idToUint32(id string) (uint32, error) {
	byte, err := base64.StdEncoding.DecodeString(id)
	if err != nil {
		return 0, err
	}
	parts := strings.Split(string(byte), ":")
	if len(parts) == 2 {
		number, err := strconv.ParseUint(parts[1], 10, 32)
		if err != nil {
			return 0, err
		}
		return uint32(number), nil
	} else {
		return 0, fmt.Errorf("Invalid input format")
	}
}

func idToUint64(id string) (uint64, error) {
	byte, err := base64.StdEncoding.DecodeString(id)
	if err != nil {
		return 0, err
	}
	parts := strings.Split(string(byte), ":")
	if len(parts) == 2 {
		number, err := strconv.ParseUint(parts[1], 10, 64)
		if err != nil {
			return 0, err
		}
		return number, nil
	} else {
		return 0, fmt.Errorf("Invalid input format")
	}
}
