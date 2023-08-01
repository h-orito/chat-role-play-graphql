package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.31

import (
	graph1 "chat-role-play/middleware/graph"
	"chat-role-play/middleware/graph/gqlmodel"
	"context"
)

// Player is the resolver for the player field.
func (r *gameMasterResolver) Player(ctx context.Context, obj *gqlmodel.GameMaster) (*gqlmodel.Player, error) {
	return r.player(ctx, obj)
}

// Player is the resolver for the player field.
func (r *gameParticipantResolver) Player(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.Player, error) {
	return r.player(ctx, obj)
}

// ProfileIcon is the resolver for the profileIcon field.
func (r *gameParticipantResolver) ProfileIcon(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.GameParticipantIcon, error) {
	return r.profileIcon(ctx, obj)
}

// FollowParticipantIds is the resolver for the followParticipantIds field.
func (r *gameParticipantResolver) FollowParticipantIds(ctx context.Context, obj *gqlmodel.GameParticipant) ([]string, error) {
	return r.followParticipantIds(ctx, obj)
}

// FollowerParticipantIds is the resolver for the followerParticipantIds field.
func (r *gameParticipantResolver) FollowerParticipantIds(ctx context.Context, obj *gqlmodel.GameParticipant) ([]string, error) {
	return r.followerParticipantIds(ctx, obj)
}

// Participant is the resolver for the participant field.
func (r *gameParticipantDiaryResolver) Participant(ctx context.Context, obj *gqlmodel.GameParticipantDiary) (*gqlmodel.GameParticipant, error) {
	return r.participant(ctx, obj)
}

// Period is the resolver for the period field.
func (r *gameParticipantDiaryResolver) Period(ctx context.Context, obj *gqlmodel.GameParticipantDiary) (*gqlmodel.GamePeriod, error) {
	return r.period(ctx, obj)
}

// Participants is the resolver for the participants field.
func (r *gameParticipantGroupResolver) Participants(ctx context.Context, obj *gqlmodel.GameParticipantGroup) ([]*gqlmodel.GameParticipant, error) {
	return r.participants(ctx, obj)
}

// Icon is the resolver for the icon field.
func (r *messageSenderResolver) Icon(ctx context.Context, obj *gqlmodel.MessageSender) (*gqlmodel.GameParticipantIcon, error) {
	return r.icon(ctx, obj)
}

// RegisterDesigner is the resolver for the registerDesigner field.
func (r *mutationResolver) RegisterDesigner(ctx context.Context, input gqlmodel.NewDesigner) (*gqlmodel.RegisterDesignerPayload, error) {
	return r.registerDesigner(ctx, input)
}

// UpdateDesigner is the resolver for the updateDesigner field.
func (r *mutationResolver) UpdateDesigner(ctx context.Context, input gqlmodel.UpdateDesigner) (*gqlmodel.UpdateDesignerPayload, error) {
	return r.updateDesigner(ctx, input)
}

// RegisterCharachip is the resolver for the registerCharachip field.
func (r *mutationResolver) RegisterCharachip(ctx context.Context, input gqlmodel.NewCharachip) (*gqlmodel.RegisterCharachipPayload, error) {
	return r.registerCharachip(ctx, input)
}

// UpdateCharachip is the resolver for the updateCharachip field.
func (r *mutationResolver) UpdateCharachip(ctx context.Context, input gqlmodel.UpdateCharachip) (*gqlmodel.UpdateCharachipPayload, error) {
	return r.updateCharachip(ctx, input)
}

// RegisterCharachipChara is the resolver for the registerCharachipChara field.
func (r *mutationResolver) RegisterCharachipChara(ctx context.Context, input gqlmodel.NewChara) (*gqlmodel.RegisterCharaPayload, error) {
	return r.registerCharachipChara(ctx, input)
}

// UpdateChara is the resolver for the updateChara field.
func (r *mutationResolver) UpdateChara(ctx context.Context, input gqlmodel.UpdateChara) (*gqlmodel.UpdateCharaPayload, error) {
	return r.updateChara(ctx, input)
}

// RegisterCharaImage is the resolver for the registerCharaImage field.
func (r *mutationResolver) RegisterCharaImage(ctx context.Context, input gqlmodel.NewCharaImage) (*gqlmodel.RegisterCharaImagePayload, error) {
	return r.registerCharaImage(ctx, input)
}

// UpdateCharaImage is the resolver for the updateCharaImage field.
func (r *mutationResolver) UpdateCharaImage(ctx context.Context, input gqlmodel.UpdateCharaImage) (*gqlmodel.UpdateCharaImagePayload, error) {
	return r.updateCharaImage(ctx, input)
}

// RegisterGame is the resolver for the registerGame field.
func (r *mutationResolver) RegisterGame(ctx context.Context, input gqlmodel.NewGame) (*gqlmodel.RegisterGamePayload, error) {
	return r.registerGame(ctx, input)
}

// RegisterGameMaster is the resolver for the registerGameMaster field.
func (r *mutationResolver) RegisterGameMaster(ctx context.Context, input gqlmodel.NewGameMaster) (*gqlmodel.RegisterGameMasterPayload, error) {
	return r.registerGameMaster(ctx, input)
}

// UpdateGameMaster is the resolver for the updateGameMaster field.
func (r *mutationResolver) UpdateGameMaster(ctx context.Context, input gqlmodel.UpdateGameMaster) (*gqlmodel.UpdateGameMasterPayload, error) {
	return r.updateGameMaster(ctx, input)
}

// DeleteGameMaster is the resolver for the deleteGameMaster field.
func (r *mutationResolver) DeleteGameMaster(ctx context.Context, input gqlmodel.DeleteGameMaster) (*gqlmodel.DeleteGameMasterPayload, error) {
	return r.deleteGameMaster(ctx, input)
}

// UpdateGameStatus is the resolver for the updateGameStatus field.
func (r *mutationResolver) UpdateGameStatus(ctx context.Context, input gqlmodel.UpdateGameStatus) (*gqlmodel.UpdateGameStatusPayload, error) {
	return r.updateGameStatus(ctx, input)
}

// UpdateGameSetting is the resolver for the updateGameSetting field.
func (r *mutationResolver) UpdateGameSetting(ctx context.Context, input gqlmodel.UpdateGameSetting) (*gqlmodel.UpdateGameSettingPayload, error) {
	return r.updateGameSetting(ctx, input)
}

// UpdateGamePeriod is the resolver for the updateGamePeriod field.
func (r *mutationResolver) UpdateGamePeriod(ctx context.Context, input gqlmodel.UpdateGamePeriod) (*gqlmodel.UpdateGamePeriodPayload, error) {
	return r.updateGamePeriod(ctx, input)
}

// ChangePeriodIfNeeded is the resolver for the changePeriodIfNeeded field.
func (r *mutationResolver) ChangePeriodIfNeeded(ctx context.Context, input gqlmodel.ChangePeriod) (*gqlmodel.ChangePeriodIfNeededPayload, error) {
	return r.changePeriodIfNeeded(ctx, input)
}

// RegisterGameParticipant is the resolver for the registerGameParticipant field.
func (r *mutationResolver) RegisterGameParticipant(ctx context.Context, input gqlmodel.NewGameParticipant) (*gqlmodel.RegisterGameParticipantPayload, error) {
	return r.registerGameParticipant(ctx, input)
}

// UpdateGameParticipantProfile is the resolver for the updateGameParticipantProfile field.
func (r *mutationResolver) UpdateGameParticipantProfile(ctx context.Context, input gqlmodel.UpdateGameParticipantProfile) (*gqlmodel.UpdateGameParticipantProfilePayload, error) {
	return r.updateGameParticipantProfile(ctx, input)
}

// RegisterGameParticipantIcon is the resolver for the registerGameParticipantIcon field.
func (r *mutationResolver) RegisterGameParticipantIcon(ctx context.Context, input gqlmodel.NewGameParticipantIcon) (*gqlmodel.RegisterGameParticipantIconPayload, error) {
	return r.registerGameParticipantIcon(ctx, input)
}

// UpdateGameParticipantIcon is the resolver for the updateGameParticipantIcon field.
func (r *mutationResolver) UpdateGameParticipantIcon(ctx context.Context, input gqlmodel.UpdateGameParticipantIcon) (*gqlmodel.UpdateGameParticipantIconPayload, error) {
	return r.updateGameParticipantIcon(ctx, input)
}

// DeleteGameParticipantIcon is the resolver for the deleteGameParticipantIcon field.
func (r *mutationResolver) DeleteGameParticipantIcon(ctx context.Context, input gqlmodel.DeleteGameParticipantIcon) (*gqlmodel.DeleteGameParticipantIconPayload, error) {
	return r.deleteGameParticipantIcon(ctx, input)
}

// UpdateGameParticipantSetting is the resolver for the updateGameParticipantSetting field.
func (r *mutationResolver) UpdateGameParticipantSetting(ctx context.Context, input gqlmodel.UpdateGameParticipantSetting) (*gqlmodel.UpdateGameParticipantSettingPayload, error) {
	return r.updateGameParticipantSetting(ctx, input)
}

// DeleteGameParticipant is the resolver for the deleteGameParticipant field.
func (r *mutationResolver) DeleteGameParticipant(ctx context.Context, input gqlmodel.DeleteGameParticipant) (*gqlmodel.DeleteGameParticipantPayload, error) {
	return r.deleteGameParticipant(ctx, input)
}

// RegisterGameParticipantFollow is the resolver for the registerGameParticipantFollow field.
func (r *mutationResolver) RegisterGameParticipantFollow(ctx context.Context, input gqlmodel.NewGameParticipantFollow) (*gqlmodel.RegisterGameParticipantFollowPayload, error) {
	return r.registerGameParticipantFollow(ctx, input)
}

// DeleteGameParticipantFollow is the resolver for the deleteGameParticipantFollow field.
func (r *mutationResolver) DeleteGameParticipantFollow(ctx context.Context, input gqlmodel.DeleteGameParticipantFollow) (*gqlmodel.DeleteGameParticipantFollowPayload, error) {
	return r.deleteGameParticipantFollow(ctx, input)
}

// RegisterGameParticipantDiary is the resolver for the registerGameParticipantDiary field.
func (r *mutationResolver) RegisterGameParticipantDiary(ctx context.Context, input gqlmodel.NewGameParticipantDiary) (*gqlmodel.RegisterGameParticipantDiaryPayload, error) {
	return r.registerGameParticipantDiary(ctx, input)
}

// UpdateGameParticipantDiary is the resolver for the updateGameParticipantDiary field.
func (r *mutationResolver) UpdateGameParticipantDiary(ctx context.Context, input gqlmodel.UpdateGameParticipantDiary) (*gqlmodel.UpdateGameParticipantDiaryPayload, error) {
	return r.updateGameParticipantDiary(ctx, input)
}

// UpdatePlayerProfile is the resolver for the updatePlayerProfile field.
func (r *mutationResolver) UpdatePlayerProfile(ctx context.Context, input gqlmodel.UpdatePlayerProfile) (*gqlmodel.UpdatePlayerProfilePayload, error) {
	return r.updatePlayerProfile(ctx, input)
}

// RegisterPlayerSnsAccount is the resolver for the registerPlayerSnsAccount field.
func (r *mutationResolver) RegisterPlayerSnsAccount(ctx context.Context, input gqlmodel.NewPlayerSnsAccount) (*gqlmodel.RegisterPlayerSnsAccountPayload, error) {
	return r.registerPlayerSnsAccount(ctx, input)
}

// UpdatePlayerSnsAccount is the resolver for the updatePlayerSnsAccount field.
func (r *mutationResolver) UpdatePlayerSnsAccount(ctx context.Context, input gqlmodel.UpdatePlayerSnsAccount) (*gqlmodel.UpdatePlayerSnsAccountPayload, error) {
	return r.updatePlayerSnsAccount(ctx, input)
}

// DeletePlayerSnsAccount is the resolver for the deletePlayerSnsAccount field.
func (r *mutationResolver) DeletePlayerSnsAccount(ctx context.Context, input gqlmodel.DeletePlayerSnsAccount) (*gqlmodel.DeletePlayerSnsAccountPayload, error) {
	return r.deletePlayerSnsAccount(ctx, input)
}

// RegisterMessage is the resolver for the registerMessage field.
func (r *mutationResolver) RegisterMessage(ctx context.Context, input gqlmodel.NewMessage) (*gqlmodel.RegisterMessagePayload, error) {
	return r.registerMessage(ctx, input)
}

// RegisterMessageFavorite is the resolver for the registerMessageFavorite field.
func (r *mutationResolver) RegisterMessageFavorite(ctx context.Context, input gqlmodel.NewMessageFavorite) (*gqlmodel.RegisterMessageFavoritePayload, error) {
	return r.registerMessageFavorite(ctx, input)
}

// DeleteMessageFavorite is the resolver for the deleteMessageFavorite field.
func (r *mutationResolver) DeleteMessageFavorite(ctx context.Context, input gqlmodel.DeleteMessageFavorite) (*gqlmodel.DeleteMessageFavoritePayload, error) {
	return r.deleteMessageFavorite(ctx, input)
}

// RegisterDirectMessage is the resolver for the registerDirectMessage field.
func (r *mutationResolver) RegisterDirectMessage(ctx context.Context, input gqlmodel.NewDirectMessage) (*gqlmodel.RegisterDirectMessagePayload, error) {
	return r.registerDirectMessage(ctx, input)
}

// RegisterDirectMessageFavorite is the resolver for the registerDirectMessageFavorite field.
func (r *mutationResolver) RegisterDirectMessageFavorite(ctx context.Context, input gqlmodel.NewDirectMessageFavorite) (*gqlmodel.RegisterDirectMessageFavoritePayload, error) {
	return r.registerDirectMessageFavorite(ctx, input)
}

// DeleteDirectMessageFavorite is the resolver for the deleteDirectMessageFavorite field.
func (r *mutationResolver) DeleteDirectMessageFavorite(ctx context.Context, input gqlmodel.DeleteDirectMessageFavorite) (*gqlmodel.DeleteDirectMessageFavoritePayload, error) {
	return r.deleteDirectMessageFavorite(ctx, input)
}

// RegisterGameParticipantGroup is the resolver for the registerGameParticipantGroup field.
func (r *mutationResolver) RegisterGameParticipantGroup(ctx context.Context, input gqlmodel.NewGameParticipantGroup) (*gqlmodel.RegisterGameParticipantGroupPayload, error) {
	return r.registerGameParticipantGroup(ctx, input)
}

// UpdateGameParticipantGroup is the resolver for the updateGameParticipantGroup field.
func (r *mutationResolver) UpdateGameParticipantGroup(ctx context.Context, input gqlmodel.UpdateGameParticipantGroup) (*gqlmodel.UpdateGameParticipantGroupPayload, error) {
	return r.updateGameParticipantGroup(ctx, input)
}

// Designers is the resolver for the designers field.
func (r *queryResolver) Designers(ctx context.Context, query gqlmodel.DesignersQuery) ([]*gqlmodel.Designer, error) {
	return r.designers(ctx, query)
}

// Designer is the resolver for the designer field.
func (r *queryResolver) Designer(ctx context.Context, id string) (*gqlmodel.Designer, error) {
	return r.designer(ctx, id)
}

// Charachips is the resolver for the charachips field.
func (r *queryResolver) Charachips(ctx context.Context, query gqlmodel.CharachipsQuery) ([]*gqlmodel.Charachip, error) {
	return r.charachips(ctx, query)
}

// Charachip is the resolver for the charachip field.
func (r *queryResolver) Charachip(ctx context.Context, id string) (*gqlmodel.Charachip, error) {
	return r.charachip(ctx, id)
}

// Chara is the resolver for the chara field.
func (r *queryResolver) Chara(ctx context.Context, id string) (*gqlmodel.Chara, error) {
	return r.chara(ctx, id)
}

// Games is the resolver for the games field.
func (r *queryResolver) Games(ctx context.Context, query gqlmodel.GamesQuery) ([]*gqlmodel.SimpleGame, error) {
	return r.games(ctx, query)
}

// Game is the resolver for the game field.
func (r *queryResolver) Game(ctx context.Context, id string) (*gqlmodel.Game, error) {
	return r.game(ctx, id)
}

// MyGameParticipant is the resolver for the myGameParticipant field.
func (r *queryResolver) MyGameParticipant(ctx context.Context, gameID string) (*gqlmodel.GameParticipant, error) {
	return r.myGameParticipant(ctx, gameID)
}

// GameParticipantProfile is the resolver for the gameParticipantProfile field.
func (r *queryResolver) GameParticipantProfile(ctx context.Context, participantID string) (*gqlmodel.GameParticipantProfile, error) {
	return r.gameParticipantProfile(ctx, participantID)
}

// GameParticipantIcons is the resolver for the gameParticipantIcons field.
func (r *queryResolver) GameParticipantIcons(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipantIcon, error) {
	return r.gameParticipantIcons(ctx, participantID)
}

// GameParticipantFollows is the resolver for the gameParticipantFollows field.
func (r *queryResolver) GameParticipantFollows(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipant, error) {
	return r.gameParticipantFollows(ctx, participantID)
}

// GameParticipantFollowers is the resolver for the gameParticipantFollowers field.
func (r *queryResolver) GameParticipantFollowers(ctx context.Context, participantID string) ([]*gqlmodel.GameParticipant, error) {
	return r.gameParticipantFollowers(ctx, participantID)
}

// GameParticipantSetting is the resolver for the gameParticipantSetting field.
func (r *queryResolver) GameParticipantSetting(ctx context.Context, gameID string) (*gqlmodel.GameParticipantSetting, error) {
	return r.gameParticipantSetting(ctx, gameID)
}

// GameDiaries is the resolver for the gameDiaries field.
func (r *queryResolver) GameDiaries(ctx context.Context, query gqlmodel.GameDiariesQuery) ([]*gqlmodel.GameParticipantDiary, error) {
	return r.gameDiaries(ctx, query)
}

// GameDiary is the resolver for the gameDiary field.
func (r *queryResolver) GameDiary(ctx context.Context, diaryID string) (*gqlmodel.GameParticipantDiary, error) {
	return r.gameDiary(ctx, diaryID)
}

// Players is the resolver for the players field.
func (r *queryResolver) Players(ctx context.Context, query gqlmodel.PlayersQuery) ([]*gqlmodel.Player, error) {
	return r.players(ctx, query)
}

// Player is the resolver for the player field.
func (r *queryResolver) Player(ctx context.Context, id string) (*gqlmodel.Player, error) {
	return r.player(ctx, id)
}

// MyPlayer is the resolver for the myPlayer field.
func (r *queryResolver) MyPlayer(ctx context.Context) (*gqlmodel.Player, error) {
	return r.myPlayer(ctx)
}

// Messages is the resolver for the messages field.
func (r *queryResolver) Messages(ctx context.Context, gameID string, query gqlmodel.MessagesQuery) (*gqlmodel.Messages, error) {
	return r.messages(ctx, gameID, query)
}

// MessagesLatestUnixTimeMilli is the resolver for the messagesLatestUnixTimeMilli field.
func (r *queryResolver) MessagesLatestUnixTimeMilli(ctx context.Context, gameID string, query gqlmodel.MessagesQuery) (uint64, error) {
	return r.messagesLatestUnixTimeMilli(ctx, gameID, query)
}

// Message is the resolver for the message field.
func (r *queryResolver) Message(ctx context.Context, gameID string, messageID string) (*gqlmodel.Message, error) {
	return r.message(ctx, gameID, messageID)
}

// MessageReplies is the resolver for the messageReplies field.
func (r *queryResolver) MessageReplies(ctx context.Context, gameID string, messageID string) ([]*gqlmodel.Message, error) {
	return r.messageReplies(ctx, gameID, messageID)
}

// MessageFavoriteGameParticipants is the resolver for the messageFavoriteGameParticipants field.
func (r *queryResolver) MessageFavoriteGameParticipants(ctx context.Context, gameID string, messageID string) ([]*gqlmodel.GameParticipant, error) {
	return r.messageFavoriteGameParticipants(ctx, gameID, messageID)
}

// GameParticipantGroups is the resolver for the gameParticipantGroups field.
func (r *queryResolver) GameParticipantGroups(ctx context.Context, gameID string, query gqlmodel.GameParticipantGroupsQuery) ([]*gqlmodel.GameParticipantGroup, error) {
	return r.gameParticipantGroups(ctx, gameID, query)
}

// DirectMessages is the resolver for the directMessages field.
func (r *queryResolver) DirectMessages(ctx context.Context, gameID string, query gqlmodel.DirectMessagesQuery) (*gqlmodel.DirectMessages, error) {
	return r.directMessages(ctx, gameID, query)
}

// DirectMessagesLatestUnixTimeMilli is the resolver for the directMessagesLatestUnixTimeMilli field.
func (r *queryResolver) DirectMessagesLatestUnixTimeMilli(ctx context.Context, gameID string, query gqlmodel.DirectMessagesQuery) (uint64, error) {
	return r.directMessagesLatestUnixTimeMilli(ctx, gameID, query)
}

// DirectMessage is the resolver for the directMessage field.
func (r *queryResolver) DirectMessage(ctx context.Context, gameID string, directMessageID string) (*gqlmodel.DirectMessage, error) {
	return r.directMessage(ctx, gameID, directMessageID)
}

// DirectMessageFavoriteGameParticipants is the resolver for the directMessageFavoriteGameParticipants field.
func (r *queryResolver) DirectMessageFavoriteGameParticipants(ctx context.Context, gameID string, directMessageID string) ([]*gqlmodel.GameParticipant, error) {
	return r.directMessageFavoriteGameParticipants(ctx, gameID, directMessageID)
}

// GameMaster returns graph1.GameMasterResolver implementation.
func (r *Resolver) GameMaster() graph1.GameMasterResolver { return &gameMasterResolver{r} }

// GameParticipant returns graph1.GameParticipantResolver implementation.
func (r *Resolver) GameParticipant() graph1.GameParticipantResolver {
	return &gameParticipantResolver{r}
}

// GameParticipantDiary returns graph1.GameParticipantDiaryResolver implementation.
func (r *Resolver) GameParticipantDiary() graph1.GameParticipantDiaryResolver {
	return &gameParticipantDiaryResolver{r}
}

// GameParticipantGroup returns graph1.GameParticipantGroupResolver implementation.
func (r *Resolver) GameParticipantGroup() graph1.GameParticipantGroupResolver {
	return &gameParticipantGroupResolver{r}
}

// MessageSender returns graph1.MessageSenderResolver implementation.
func (r *Resolver) MessageSender() graph1.MessageSenderResolver { return &messageSenderResolver{r} }

// Mutation returns graph1.MutationResolver implementation.
func (r *Resolver) Mutation() graph1.MutationResolver { return &mutationResolver{r} }

// Query returns graph1.QueryResolver implementation.
func (r *Resolver) Query() graph1.QueryResolver { return &queryResolver{r} }

type gameMasterResolver struct{ *Resolver }
type gameParticipantResolver struct{ *Resolver }
type gameParticipantDiaryResolver struct{ *Resolver }
type gameParticipantGroupResolver struct{ *Resolver }
type messageSenderResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
