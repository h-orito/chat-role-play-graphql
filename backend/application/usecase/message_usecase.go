package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/model"
	"context"
)

type MessageUsecase interface {
	FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error)
	FindMessage(gameID uint32, ID uint64) (*model.Message, error)
	FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error)
	FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error)
	RegisterMessage(ctx context.Context, gameID uint32, message model.Message) error
	RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error
	// participant group
	FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error)
	RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error
	// direct message
	FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error)
	FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error)
	FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error)
	RegisterDirectMessage(ctx context.Context, gameID uint32, message model.DirectMessage) error
	RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
	DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error
}

type messageUsecase struct {
	messageService app_service.MessageService
}

func NewMessageUsecase(messageService app_service.MessageService) MessageUsecase {
	return &messageUsecase{
		messageService: messageService,
	}
}

// FindMessages implements MessageService.
func (s *messageUsecase) FindMessages(gameID uint32, query model.MessagesQuery) (model.Messages, error) {
	return s.messageService.FindMessages(gameID, query)
}

// FindMessage implements MessageService.
func (s *messageUsecase) FindMessage(gameID uint32, ID uint64) (*model.Message, error) {
	return s.messageService.FindMessage(gameID, ID)
}

// FindMessageReplies implements MessageService.
func (s *messageUsecase) FindMessageReplies(gameID uint32, messageID uint64) ([]model.Message, error) {
	return s.messageService.FindMessageReplies(gameID, messageID)
}

// FindMessageFavoriteGameParticipants implements MessageService.
func (s *messageUsecase) FindMessageFavoriteGameParticipants(gameID uint32, messageID uint64) (model.GameParticipants, error) {
	return s.messageService.FindMessageFavoriteGameParticipants(gameID, messageID)
}

// RegisterMessage implements MessageService.
func (s *messageUsecase) RegisterMessage(ctx context.Context, gameID uint32, message model.Message) error {
	return s.messageService.RegisterMessage(ctx, gameID, message)
}

// RegisterMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	return s.messageService.RegisterMessageFavorite(ctx, gameID, messageID, gameParticipantID)
}

// DeleteMessageFavorite implements MessageUsecase.
func (s *messageUsecase) DeleteMessageFavorite(ctx context.Context, gameID uint32, messageID uint64, gameParticipantID uint32) error {
	return s.messageService.DeleteMessageFavorite(ctx, gameID, messageID, gameParticipantID)
}

// FindGameParticipantGroups implements MessageService.
func (s *messageUsecase) FindGameParticipantGroups(query model.GameParticipantGroupsQuery) ([]model.GameParticipantGroup, error) {
	return s.messageService.FindGameParticipantGroups(query)
}

// RegisterGameParticipantGroup implements MessageService.
func (s *messageUsecase) RegisterGameParticipantGroup(ctx context.Context, gameID uint32, group model.GameParticipantGroup) error {
	return s.messageService.RegisterGameParticipantGroup(ctx, gameID, group)
}

// FindDirectMessages implements MessageService.
func (s *messageUsecase) FindDirectMessages(gameID uint32, query model.DirectMessagesQuery) (model.DirectMessages, error) {
	return s.messageService.FindDirectMessages(gameID, query)
}

// FindDirectMessage implements MessageService.
func (s *messageUsecase) FindDirectMessage(gameID uint32, ID uint64) (*model.DirectMessage, error) {
	return s.messageService.FindDirectMessage(gameID, ID)
}

// FindDirectMessageFavoriteGameParticipants implements MessageService.
func (s *messageUsecase) FindDirectMessageFavoriteGameParticipants(gameID uint32, directMessageID uint64) (model.GameParticipants, error) {
	return s.messageService.FindDirectMessageFavoriteGameParticipants(gameID, directMessageID)
}

// RegisterDirectMessage implements MessageService.
func (s *messageUsecase) RegisterDirectMessage(ctx context.Context, gameID uint32, message model.DirectMessage) error {
	return s.messageService.RegisterDirectMessage(ctx, gameID, message)
}

// RegisterDirectMessageFavorite implements MessageService.
func (s *messageUsecase) RegisterDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageService.RegisterDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}

// DeleteDirectMessageFavorite implements MessageUsecase.
func (s *messageUsecase) DeleteDirectMessageFavorite(ctx context.Context, gameID uint32, directMessageID uint64, gameParticipantID uint32) error {
	return s.messageService.DeleteDirectMessageFavorite(ctx, gameID, directMessageID, gameParticipantID)
}
