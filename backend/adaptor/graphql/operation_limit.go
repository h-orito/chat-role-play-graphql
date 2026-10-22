package graphql

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
)

// LimitParticipationPerOperation は 1 回のリクエストで参加登録を 1 件までにする。
// (別名を付けて registerGameParticipant を並べると、1 回のリクエストでパスワードを何度も試せてしまうため)
func LimitParticipationPerOperation(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
	oc := graphql.GetOperationContext(ctx)
	if oc.Operation != nil {
		count := 0
		for _, f := range graphql.CollectFields(oc, oc.Operation.SelectionSet, []string{"Mutation"}) {
			if f.Name == "registerGameParticipant" {
				count++
			}
		}
		if count > 1 {
			return graphql.OneShot(graphql.ErrorResponse(ctx, "registerGameParticipant can be requested only once per operation"))
		}
	}
	return next(ctx)
}
