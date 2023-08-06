package dom_service

import (
	"chat-role-play/domain/model"
	"fmt"
)

type MessageDomainService interface {
	AssertRegisterMessage(game model.Game, player model.Player, message model.Message) error
	AssertRegisterDirectMessage(game model.Game, player model.Player, message model.DirectMessage) error
}

type messageDomainService struct {
}

// AssertRegisterDirectMessage implements MessageDomainService.
func (*messageDomainService) AssertRegisterDirectMessage(game model.Game, player model.Player, message model.DirectMessage) error {
	if !message.Type.IsSystem() && !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}

// AssertRegisterMessage implements MessageDomainService.
func (*messageDomainService) AssertRegisterMessage(
	game model.Game,
	player model.Player,
	message model.Message,
) error {
	if !message.Type.IsSystem() && !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}

func NewMessageDomainService() MessageDomainService {
	return &messageDomainService{}
}
