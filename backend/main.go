package main

import (
	"chat-role-play/inject"
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"
)

const defaultPort = "8080"

// requestTimeout はリクエスト 1 件の処理時間上限。DB のプール待ちやクエリはこの ctx を引き継ぐため、
// 万一待ちが発生しても永久化せず、この時間でエラーとして返る (#47)。
const requestTimeout = 30 * time.Second

// withTimeout はリクエストの context に timeout を設定するミドルウェア。
func withTimeout(next http.Handler, d time.Duration) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		ctx, cancel := context.WithTimeout(req.Context(), d)
		defer cancel()
		next.ServeHTTP(w, req.WithContext(ctx))
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := inject.InjectServer()

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
	}).Handler(srv)
	http.Handle("/crp-server/", playground.Handler("GraphQL playground", "/crp-server/query"))
	http.Handle("/crp-server/query", withTimeout(handler, requestTimeout))
	log.Printf("connect to http://localhost:%s/crp-server/ for GraphQL playground", port)
	server := &http.Server{
		Addr:              ":" + port,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       requestTimeout,
		WriteTimeout:      requestTimeout * 2,
		IdleTimeout:       120 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}
