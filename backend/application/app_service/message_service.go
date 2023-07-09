package app_service

import (
	"chat-role-play/domain/model"
	"context"
)

type MessageService interface {
	FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error)
	FindMessage(gameID uint32, ID uint64) (*model.Message, error)
	FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error)
	FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error)
	RegisterMessage(ctx context.Context, gameID uint32, message model.Message) error
	RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	// participant group
	FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error)
	UpdateGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error
	// direct message
	FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error)
	FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, gameID uint32, message model.DirectMessage) error
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
}

type messageService struct {
	messageRepository model.MessageRepository
}

func NewMessageService(messageRepository model.MessageRepository) MessageService {
	return &messageService{
		messageRepository: messageRepository,
	}
}

// FindMessages implements MessageService.
func (s *messageService) FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error) {
	return s.messageRepository.FindMessages(gameID, query)
}

// FindMessage implements MessageService.
func (s *messageService) FindMessage(gameID uint32, ID uint64) (*model.Message, error) {
	return s.messageRepository.FindMessage(gameID, ID)
}

// FindMessageReplies implements MessageService.
func (s *messageService) FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error) {
	return s.messageRepository.FindMessageReplies(gameID, messageID)
}

// FindMessageFavoriteGameParticipants implements MessageService.
func (s *messageService) FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error) {
	return s.messageRepository.FindMessageFavoriteGameParticipants(gameID, messageID)
}

// RegisterMessage implements MessageService.
func (s *messageService) RegisterMessage(ctx context.Context, gameID uint32, message model.Message) error {
	return s.messageRepository.RegisterMessage(ctx, gameID, message)
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
func (s *messageService) FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	return s.messageRepository.FindGameParticipantGroups(query)
}

// RegisterGameParticipantGroup implements MessageService.
func (s *messageService) RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) (*model.GameParticipantGroup, error) {
	return s.messageRepository.RegisterGameParticipantGroup(ctx, gameID, group)
}

func (s *messageService) UpdateGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error {
	return s.messageRepository.UpdateGameParticipantGroup(ctx, gameID, group)
}

// FindDirectMessages implements MessageService.
func (s *messageService) FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	return s.messageRepository.FindDirectMessages(gameID, query)
}

// FindDirectMessage implements MessageService.
func (s *messageService) FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error) {
	return s.messageRepository.FindDirectMessage(gameID, ID)
}

// FindDirectMessageFavoriteGameParticipants implements MessageService.
func (s *messageService) FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error) {
	return s.messageRepository.FindDirectMessageFavoriteGameParticipants(gameID, directMessageID)
}

// RegisterDirectMessage implements MessageService.
func (s *messageService) RegisterDirectMessage(ctx context.Context, gameID uint32, message model.DirectMessage) error {
	return s.messageRepository.RegisterDirectMessage(ctx, gameID, message)
}

// RegisterDirectMessageFavorite implements MessageService.
func (s *messageService) RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.RegisterDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}

// DeleteDirectMessageFavorite implements MessageService.
func (s *messageService) DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageRepository.DeleteDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}
