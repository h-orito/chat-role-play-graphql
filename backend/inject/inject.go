package inject

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/adaptor/graphql"
	"chat-role-play/application/app_service"
	"chat-role-play/application/usecase"
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"chat-role-play/middleware/auth0"
	"chat-role-play/middleware/graph"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
)

func InjectServer() http.Handler {
	database := injectDb()
	resolver := injectResolver(database)
	srv := handler.NewDefaultServer(
		graph.NewExecutableSchema(
			graph.Config{
				Resolvers:  &resolver,
				Directives: graphql.Directive,
			},
		),
	)
	userRepository := injectUserRepository(database)
	handler := auth.AuthMiddleware(srv, userRepository)
	return auth0.JwtMiddleware()(handler)
}

// resolver
func injectResolver(database db.DB) graphql.Resolver {
	tx := db.NewTransaction(database.Connection)
	charaRepository := injectCharaRepository(database)
	gameRepository := injectGameRepository(database)
	gameParticipantRepository := injectGameParticipantRepository(database)
	playerRepository := injectPlayerRepository(database)
	messageRepository := injectMessageRepository(database)
	charaService := injectCharaService(charaRepository)
	gameService := injectGameService(gameRepository, gameParticipantRepository)
	playerService := injectPlayerService(playerRepository)
	messageService := injectMessageService(messageRepository)
	charaUsecase := injectCharaUsecase(charaService, tx)
	gameUsecase := injectGameUsecase(gameService, tx)
	playerUsecase := injectPlayerUsecase(playerService)
	messageUsecase := injectMessageUsecase(messageService)
	loaders := injectLoaders(playerUsecase, gameUsecase, charaUsecase)
	return graphql.NewResolver(
		charaUsecase,
		gameUsecase,
		playerUsecase,
		messageUsecase,
		loaders,
	)
}

// loader
func injectLoaders(
	playerUsecase usecase.PlayerUsecase,
	gameUsecase usecase.GameUsecase,
	charaUsecase usecase.CharaUsecase,
) *graphql.Loaders {
	return graphql.NewLoaders(playerUsecase, gameUsecase, charaUsecase)
}

// usecase
func injectCharaUsecase(charaService app_service.CharaService, tx usecase.Transaction) usecase.CharaUsecase {
	return usecase.NewCharaUsecase(charaService, tx)
}

func injectGameUsecase(gameService app_service.GameService, tx usecase.Transaction) usecase.GameUsecase {
	return usecase.NewGameUsecase(gameService, tx)
}

func injectPlayerUsecase(playerService app_service.PlayerService) usecase.PlayerUsecase {
	return usecase.NewPlayerUsecase(playerService)
}

func injectMessageUsecase(messageService app_service.MessageService) usecase.MessageUsecase {
	return usecase.NewMessageUsecase(messageService)
}

// service
func injectCharaService(charaRepository model.CharaRepository) app_service.CharaService {
	return app_service.NewCharaService(charaRepository)
}

func injectGameService(
	gameRepository model.GameRepository,
	gameParticipantRepository model.GameParticipantRepository,
) app_service.GameService {
	return app_service.NewGameService(gameRepository, gameParticipantRepository)
}

func injectPlayerService(playerRepository model.PlayerRepository) app_service.PlayerService {
	return app_service.NewPlayerService(playerRepository)
}

func injectMessageService(messageRepository model.MessageRepository) app_service.MessageService {
	return app_service.NewMessageService(messageRepository)
}

// repository
func injectCharaRepository(database db.DB) model.CharaRepository {
	return db.NewCharaRepository(&database)
}

func injectGameRepository(database db.DB) model.GameRepository {
	return db.NewGameRepository(&database)
}

func injectGameParticipantRepository(database db.DB) model.GameParticipantRepository {
	return db.NewGameParticipantRepository(&database)
}

func injectPlayerRepository(database db.DB) model.PlayerRepository {
	return db.NewPlayerRepository(&database)
}

func injectUserRepository(database db.DB) model.UserRepository {
	return db.NewUserRepository(&database)
}

func injectMessageRepository(database db.DB) model.MessageRepository {
	return db.NewMessageRepository(&database)
}

// database
func injectDb() db.DB {
	return db.NewDB()
}
