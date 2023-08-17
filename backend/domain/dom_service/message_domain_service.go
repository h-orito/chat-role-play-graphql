package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"fmt"
)

type MessageDomainService interface {
	AssertRegisterMessage(game model.Game, player model.Player, message model.Message) error
	AssertRegisterDirectMessage(game model.Game, player model.Player, message model.DirectMessage) error
	GetViewableMessageTypes(game model.Game, authorities []model.PlayerAuthority) []model.MessageType
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

// GetViewableMessageTypes implements MessageDomainService.
func (*messageDomainService) GetViewableMessageTypes(game model.Game, authorities []model.PlayerAuthority) []model.MessageType {
	// 管理者またはエピローグを迎えていたら全部見られる
	if game.Status.ShouldSpoiler() || array.Any(authorities, func(a model.PlayerAuthority) bool {
		return a.IsAdmin()
	}) {
		return model.MessageTypeValues()
	}
	return model.MesssageTypeEveryoneViewableValues()
}

func NewMessageDomainService() MessageDomainService {
	return &messageDomainService{}
}
