package auth

import (
	"chat-role-play/domain/model"
	"context"
	"log"
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
)

type userKey struct{}

// CustomClaims contains custom data we want from the token.
type CustomClaims struct {
	Scope string `json:"scope"`
}

// Validate does nothing for this example, but we need
// it to satisfy validator.CustomClaims interface.
func (c CustomClaims) Validate(ctx context.Context) error {
	return nil
}

func AuthMiddleware(next http.Handler, userRepository model.UserRepository) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		rawToken := req.Context().Value(jwtmiddleware.ContextKey{})
		if rawToken == nil {
			next.ServeHTTP(w, req)
			return
		}

		token := rawToken.(*validator.ValidatedClaims)
		username := token.RegisteredClaims.Subject

		user, err := userRepository.FindByUserName(username)
		if err != nil {
			log.Println(err)
			next.ServeHTTP(w, req)
			return
		}
		if user == nil {
			user, err = userRepository.Signup(username)
			if err != nil {
				log.Println(err)
				next.ServeHTTP(w, req)
				return
			}
		}

		ctx := context.WithValue(req.Context(), userKey{}, user)
		next.ServeHTTP(w, req.WithContext(ctx))
	})
}

func GetUser(ctx context.Context) *model.User {
	switch v := ctx.Value(userKey{}).(type) {
	case *model.User:
		return v
	default:
		return nil
	}
}
