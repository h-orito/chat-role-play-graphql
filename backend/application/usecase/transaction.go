package usecase

import "context"

// see https://qiita.com/miya-masa/items/316256924a1f0d7374bb
type Transaction interface {
	DoInTx(context.Context, func(context.Context) (interface{}, error)) (interface{}, error)
}
