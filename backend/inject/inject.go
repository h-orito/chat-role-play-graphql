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
	gameRepository := injectGameRepository(database)
	playerRepository := injectPlayerRepository(database)
	gameService := injectGameService(gameRepository)
	playerService := injectPlayerService(playerRepository)
	gameUsecase := injectGameUsecase(gameService)
	playerUsecase := injectPlayerUsecase(playerService)
	loaders := injectLoaders(gameUsecase)
	return graphql.NewResolver(
		gameUsecase,
		playerUsecase,
		loaders,
	)
}

// loader
func injectLoaders(gameUsecase usecase.GameUsecase) *graphql.Loaders {
	return graphql.NewLoaders(gameUsecase)
}

// usecase
func injectGameUsecase(gameService app_service.GameService) usecase.GameUsecase {
	return usecase.NewGameUsecase(gameService)
}

func injectPlayerUsecase(playerService app_service.PlayerService) usecase.PlayerUsecase {
	return usecase.NewPlayerUsecase(playerService)
}

// service
func injectGameService(gameRepository model.GameRepository) app_service.GameService {
	return app_service.NewGameService(gameRepository)
}

func injectPlayerService(playerRepository model.PlayerRepository) app_service.PlayerService {
	return app_service.NewPlayerService(playerRepository)
}

// repository
func injectGameRepository(database db.DB) model.GameRepository {
	return db.NewGameRepository(&database)
}

func injectPlayerRepository(database db.DB) model.PlayerRepository {
	return db.NewPlayerRepository(&database)
}

func injectUserRepository(database db.DB) model.UserRepository {
	return db.NewUserRepository(&database)
}

// database
func injectDb() db.DB {
	return db.NewDB()
}
