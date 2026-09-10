package app_service

import (
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
)

type MessageService interface {
	FindMessages(ctx context.Context, gameID uint32, query model.MessagesQuery, myself *model.GameParticipant) (model.Messages, error)
	FindMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.MessagesQuery, myself *model.GameParticipant) (uint64, error)
	FindMessage(ctx context.Context, gameID uint32, ID uint64) (*model.Message, error)
	FindMessageReplies(ctx context.Context, gameID uint32, messageID uint64, myself *model.GameParticipant) ([]model.Message, error)
	FindThreadMessages(ctx context.Context, gameID uint32, messageID uint64, myself *model.GameParticipant) ([]model.Message, error)
	FindMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, messageID uint64) (model.GameParticipants, error)
	RegisterMessage(ctx context.Context, game model.Game, message model.Message) error
	RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	// participant group
	FindGameParticipantGroups(ctx context.Context, query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error)
	UpdateGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error
	// direct message
	FindDirectMessages(ctx context.Context, gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error)
	FindDirectMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.DirectMessagesQuery) (uint64, error)
	FindDirectMessage(ctx context.Context, gameID uint32, ID uint64) (*model.DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, directMessageID uint64) (model.GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, game model.Game, message model.DirectMessage) error
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
}

type messageService struct {
	messageRepository    model.MessageRepository
	messageDomainService dom_service.MessageDomainService
	notifyService        NotifyService
}

func NewMessageService(
	messageRepository model.MessageRepository,
	messageDomainService dom_service.MessageDomainService,
	notifyService NotifyService,
) MessageService {
	return &messageService{
		messageRepository:    messageRepository,
		messageDomainService: messageDomainService,
		notifyService:        notifyService,
	}
}

// FindMessages implements MessageService.
func (s *messageService) FindMessages(ctx context.Context, gameID uint32, query model.MessagesQuery, myself *model.GameParticipant) (model.Messages, error) {
	return s.messageRepository.FindMessages(ctx, gameID, query, myself)
}

// FindMessagesLatestUnixTimeMilli implements MessageService.
func (s *messageService) FindMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.MessagesQuery, myself *model.GameParticipant) (uint64, error) {
	return s.messageRepository.FindMessagesLatestUnixTimeMilli(ctx, gameID, query, myself)
}

// FindMessage implements MessageService.
func (s *messageService) FindMessage(ctx context.Context, gameID uint32, ID uint64) (*model.Message, error) {
	return s.messageRepository.FindMessage(ctx, gameID, ID)
}

// FindMessageReplies implements MessageService.
func (s *messageService) FindMessageReplies(ctx context.Context, gameID uint32, messageID uint64, myself *model.GameParticipant) ([]model.Message, error) {
	return s.messageRepository.FindMessageReplies(ctx, gameID, messageID, myself)
}

// FindThreadMessages implements MessageService.
func (s *messageService) FindThreadMessages(ctx context.Context, gameID uint32, messageID uint64, myself *model.GameParticipant) ([]model.Message, error) {
	return s.messageRepository.FindThreadMessages(ctx, gameID, messageID, myself)
}

// FindMessageFavoriteGameParticipants implements MessageService.
func (s *messageService) FindMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, messageID uint64) (model.GameParticipants, error) {
	return s.messageRepository.FindMessageFavoriteGameParticipants(ctx, gameID, messageID)
}

// RegisterMessage implements MessageService.
func (s *messageService) RegisterMessage(ctx context.Context, game model.Game, message model.Message) error {
	replacedMessageContent, err := s.messageDomainService.ReplaceRandomMessageText(game, message.Content)
	if err != nil {
		return err
	}
	message.Content = replacedMessageContent
	err = s.messageRepository.RegisterMessage(ctx, game.ID, message)
	if err != nil {
		return err
	}
	return s.notifyService.NotifyMessage(ctx, game, message)
}

// RegisterMessageFavorite implements MessageService.
func (s *messageService) RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.RegisterMessageFavorite(ctx, gameID, messageID, gameParticipantID)
}

// DeleteMessageFavorite implements MessageService.
func (s *messageService) DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.DeleteMessageFavorite(ctx, gameID, messageID, gameParticipantID)
}

// FindGameParticipantGroups implements MessageService.
func (s *messageService) FindGameParticipantGroups(ctx context.Context, query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	return s.messageRepository.FindGameParticipantGroups(ctx, query)
}

// RegisterGameParticipantGroup implements MessageService.
func (s *messageService) RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error) {
	return s.messageRepository.RegisterGameParticipantGroup(ctx, gameID, group)
}

func (s *messageService) UpdateGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error {
	return s.messageRepository.UpdateGameParticipantGroup(ctx, gameID, group)
}

// FindDirectMessages implements MessageService.
func (s *messageService) FindDirectMessages(ctx context.Context, gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	return s.messageRepository.FindDirectMessages(ctx, gameID, query)
}

// FindDirectMessagesLatestUnixTimeMilli implements MessageService.
func (s *messageService) FindDirectMessagesLatestUnixTimeMilli(ctx context.Context, gameID uint32, query model.DirectMessagesQuery) (uint64, error) {
	return s.messageRepository.FindDirectMessagesLatestUnixTimeMilli(ctx, gameID, query)
}

// FindDirectMessage implements MessageService.
func (s *messageService) FindDirectMessage(ctx context.Context, gameID uint32, ID uint64) (*model.DirectMessage, error) {
	return s.messageRepository.FindDirectMessage(ctx, gameID, ID)
}

// FindDirectMessageFavoriteGameParticipants implements MessageService.
func (s *messageService) FindDirectMessageFavoriteGameParticipants(ctx context.Context, gameID uint32, directMessageID uint64) (model.GameParticipants, error) {
	return s.messageRepository.FindDirectMessageFavoriteGameParticipants(ctx, gameID, directMessageID)
}

// RegisterDirectMessage implements MessageService.
func (s *messageService) RegisterDirectMessage(ctx context.Context, game model.Game, message model.DirectMessage) error {
	replacedMessageContent, err := s.messageDomainService.ReplaceRandomMessageText(game, message.Content)
	if err != nil {
		return err
	}
	message.Content = replacedMessageContent
	err = s.messageRepository.RegisterDirectMessage(ctx, game.ID, message)
	if err != nil {
		return err
	}
	return s.notifyService.NotifyDirectMessage(ctx, game, message)
}

// RegisterDirectMessageFavorite implements MessageService.
func (s *messageService) RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.RegisterDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}

// DeleteDirectMessageFavorite implements MessageService.
func (s *messageService) DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.DeleteDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}
