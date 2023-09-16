package app_service

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"fmt"
	"strings"
)

type NotifyService interface {
	NotifyGameStart(game model.Game) error
	NotifyMessage(game model.Game, message model.Message) error
	NotifyDirectMessage(game model.Game, message model.DirectMessage) error
}

type notifyService struct {
	notificationRepository    model.NotificationRepository
	gameParticipantRepository model.GameParticipantRepository
	messageRepository         model.MessageRepository
	messageDomainService      dom_service.MessageDomainService
}

func NewNotifyService(
	notificationRepository model.NotificationRepository,
	gameParticipantRepository model.GameParticipantRepository,
	messageRepository model.MessageRepository,
	messageDomainService dom_service.MessageDomainService,
) NotifyService {
	return &notifyService{
		notificationRepository:    notificationRepository,
		gameParticipantRepository: gameParticipantRepository,
		messageRepository:         messageRepository,
		messageDomainService:      messageDomainService,
	}
}

func (s *notifyService) NotifyGameStart(game model.Game) error {
	participantIDs := array.Map(array.Filter(game.Participants.List, func(p model.GameParticipant) bool {
		return !p.IsGone
	}), func(p model.GameParticipant) uint32 {
		return p.ID
	})
	notificationSettings, err := s.gameParticipantRepository.FindGameParticipantNotificationSettings(participantIDs)
	if err != nil {
		return err
	}
	array.ForEach(array.Filter(notificationSettings, func(ns model.GameParticipantNotification) bool {
		return ns.DiscordWebhookUrl != nil && ns.Game.Start
	}), func(ns model.GameParticipantNotification) {
		s.notificationRepository.Notify(
			*ns.DiscordWebhookUrl,
			game.ID,
			"ゲームが開始されました",
			true,
		)
	})

	return nil
}

func (s *notifyService) NotifyMessage(game model.Game, message model.Message) error {
	// 見られない場合は通知しない
	viewableTypes := s.messageDomainService.GetViewableMessageTypes(game, []model.PlayerAuthority{})
	if array.None(viewableTypes, func(t model.MessageType) bool {
		return t == message.Type
	}) {
		return nil
	}

	// keyword
	pIDs, err := s.notifyMessageKeyword(game, message)
	if err != nil {
		return err
	}
	// reply
	return s.notifyReply(game, message, pIDs)
}

func (s *notifyService) NotifyDirectMessage(game model.Game, message model.DirectMessage) error {
	groups, err := s.messageRepository.FindGameParticipantGroups(model.GameParticipantGroupsQuery{
		GameID: game.ID,
		IDs:    &[]uint32{message.GameParticipantGroupID},
	})
	if err != nil {
		return err
	}
	if len(groups) == 0 {
		return nil
	}
	group := groups[0]

	// keyword
	pIDs, err := s.notifyDirectMessageKeyword(game, message, group)
	if err != nil {
		return err
	}
	// direct message
	return s.notifyDirectMessage(game, message, group, pIDs)
}

// ---

func (s *notifyService) notifyMessageKeyword(
	game model.Game,
	message model.Message,
) ([]uint32, error) {
	participantIDs := array.Map(array.Filter(game.Participants.List, func(p model.GameParticipant) bool {
		return !p.IsGone && (message.Sender == nil || p.ID != message.Sender.GameParticipantID)
	}), func(p model.GameParticipant) uint32 {
		return p.ID
	})

	notificationSettings, err := s.gameParticipantRepository.FindGameParticipantNotificationSettings(participantIDs)
	if err != nil {
		return []uint32{}, err
	}
	return array.Map(array.Filter(notificationSettings, func(ns model.GameParticipantNotification) bool {
		return ns.DiscordWebhookUrl != nil && s.includeAnyKeyword(message.Content.Text, ns.Message.Keywords)
	}), func(ns model.GameParticipantNotification) uint32 {
		var text = "発言に指定キーワードが含まれています。"
		if message.Sender != nil {
			text = fmt.Sprintf("%sの%s", message.Sender.SenderName, text)
		}
		s.notificationRepository.Notify(
			*ns.DiscordWebhookUrl,
			game.ID,
			text,
			false,
		)
		return ns.GameParticipantID
	}), nil
}

func (s *notifyService) notifyDirectMessageKeyword(
	game model.Game,
	message model.DirectMessage,
	group model.GameParticipantGroup,
) ([]uint32, error) {
	targetParticipantIDs := array.Filter(group.MemberIDs, func(id uint32) bool {
		participant := array.Find(game.Participants.List, func(p model.GameParticipant) bool {
			return p.ID == id
		})
		// 退出済みでない、送信者ではない
		return participant != nil &&
			!participant.IsGone &&
			(message.Sender == nil || id != message.Sender.GameParticipantID)
	})

	notificationSettings, err := s.gameParticipantRepository.FindGameParticipantNotificationSettings(targetParticipantIDs)
	if err != nil {
		return []uint32{}, err
	}
	return array.Map(array.Filter(notificationSettings, func(ns model.GameParticipantNotification) bool {
		return ns.DiscordWebhookUrl != nil && s.includeAnyKeyword(message.Content.Text, ns.Message.Keywords)
	}), func(ns model.GameParticipantNotification) uint32 {
		text := fmt.Sprintf("%sのDMグループ[%s]へのDMに指定キーワードが含まれています。",
			message.Sender.SenderName,
			group.Name,
		)
		s.notificationRepository.Notify(
			*ns.DiscordWebhookUrl,
			game.ID,
			text,
			false,
		)
		return ns.GameParticipantID
	}), nil
}

func (s *notifyService) notifyReply(
	game model.Game,
	message model.Message,
	alreadyNotifiedPIDs []uint32,
) error {
	if message.ReplyTo == nil || message.Sender == nil || message.Sender.GameParticipantID == message.ReplyTo.GameParticipantID {
		return nil
	}
	if array.Any(alreadyNotifiedPIDs, func(id uint32) bool {
		return id == message.ReplyTo.GameParticipantID
	}) {
		return nil
	}
	participant := array.Find(game.Participants.List, func(p model.GameParticipant) bool {
		return p.ID == message.ReplyTo.GameParticipantID
	})
	if participant == nil || participant.IsGone {
		return nil
	}
	settings, err := s.gameParticipantRepository.FindGameParticipantNotificationSetting(message.ReplyTo.GameParticipantID)
	if err != nil {
		return err
	}
	if settings.DiscordWebhookUrl == nil || !settings.Message.Reply {
		return nil
	}
	s.notificationRepository.Notify(
		*settings.DiscordWebhookUrl,
		game.ID,
		fmt.Sprintf("%sがあなたの発言に返信しました。", message.Sender.SenderName),
		false,
	)
	return nil
}

func (s *notifyService) notifyDirectMessage(
	game model.Game,
	message model.DirectMessage,
	group model.GameParticipantGroup,
	alreadyNotifiedPIDs []uint32,
) error {
	targetParticipantIDs := array.Filter(group.MemberIDs, func(id uint32) bool {
		participant := array.Find(game.Participants.List, func(p model.GameParticipant) bool {
			return p.ID == id
		})
		// 退出済みでない、送信者ではない、すでに通知済みでない
		return participant != nil &&
			!participant.IsGone && id != message.Sender.GameParticipantID &&
			array.None(alreadyNotifiedPIDs, func(pid uint32) bool {
				return pid == id
			})
	})
	settings, err := s.gameParticipantRepository.FindGameParticipantNotificationSettings(targetParticipantIDs)
	if err != nil {
		return err
	}
	array.ForEach(array.Filter(settings, func(ns model.GameParticipantNotification) bool {
		return ns.DiscordWebhookUrl != nil && ns.Message.DirectMessage
	}), func(ns model.GameParticipantNotification) {
		s.notificationRepository.Notify(
			*ns.DiscordWebhookUrl,
			game.ID,
			fmt.Sprintf("%sがDMグループ[%s]にDMを送信しました。",
				message.Sender.SenderName, group.Name),
			false,
		)
	})

	return nil
}

func (s *notifyService) includeAnyKeyword(text string, keywords []string) bool {
	return array.Any(keywords, func(keyword string) bool {
		return len(keyword) > 0 && strings.Contains(text, keyword)
	})
}
