package inject

import (
	"chat-role-play/adaptor/auth"
	"chat-role-play/adaptor/graphql"
	"chat-role-play/application/app_service"
	"chat-role-play/application/usecase"
	"chat-role-play/domain/dom_service"
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
	// repository
	charaRepository := injectCharaRepository(database)
	gameRepository := injectGameRepository(database)
	gameParticipantRepository := injectGameParticipantRepository(database)
	playerRepository := injectPlayerRepository(database)
	messageRepository := injectMessageRepository(database)
	// domain service
	gameMasterDomainService := injectGameMasterDomainService()
	participateDomainService := injectParticipateDomainService(gameMasterDomainService)
	// application service
	charaService := injectCharaService(charaRepository)
	gameService := injectGameService(gameRepository, gameParticipantRepository)
	playerService := injectPlayerService(playerRepository)
	messageService := injectMessageService(messageRepository)
	// usecase
	charaUsecase := injectCharaUsecase(charaService, tx)
	gameUsecase := injectGameUsecase(gameService, playerService, charaService, gameMasterDomainService, participateDomainService, tx)
	playerUsecase := injectPlayerUsecase(playerService, tx)
	messageUsecase := injectMessageUsecase(messageService, gameService, playerService, tx)
	imageUsecase := injectImageUsecase()
	loaders := injectLoaders(playerUsecase, gameUsecase, charaUsecase)
	return graphql.NewResolver(
		charaUsecase,
		gameUsecase,
		playerUsecase,
		messageUsecase,
		imageUsecase,
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

func injectGameUsecase(
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	charaService app_service.CharaService,
	gameMasterDomainService dom_service.GameMasterDomainService,
	participateDomainService dom_service.ParticipateDomainService,
	tx usecase.Transaction,
) usecase.GameUsecase {
	return usecase.NewGameUsecase(
		gameService,
		playerService,
		charaService,
		gameMasterDomainService,
		participateDomainService,
		tx,
	)
}

func injectPlayerUsecase(playerService app_service.PlayerService,
	tx usecase.Transaction,
) usecase.PlayerUsecase {
	return usecase.NewPlayerUsecase(playerService, tx)
}

func injectMessageUsecase(
	messageService app_service.MessageService,
	gameService app_service.GameService,
	playerService app_service.PlayerService,
	tx usecase.Transaction,
) usecase.MessageUsecase {
	return usecase.NewMessageUsecase(messageService, gameService, playerService, tx)
}

func injectImageUsecase() usecase.ImageUsecase {
	return usecase.NewImageUsecase()
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

// domain service
func injectGameMasterDomainService() dom_service.GameMasterDomainService {
	return dom_service.NewGameMasterDomainService()
}

func injectParticipateDomainService(
	gmDomainService dom_service.GameMasterDomainService,
) dom_service.ParticipateDomainService {
	return dom_service.NewParticipateDomainService(gmDomainService)
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
