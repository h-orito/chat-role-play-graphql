package graphql

import (
	"chat-role-play/application/usecase"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"
	"time"

	"github.com/graph-gophers/dataloader"
)

type Loaders struct {
	PeriodLoader          *dataloader.Loader
	ParticipantLoader     *dataloader.Loader
	ParticipantIconLoader *dataloader.Loader
	PlayerLoader          *dataloader.Loader
	CharachipLoader       *dataloader.Loader
	CharaLoader           *dataloader.Loader
	CharaImageLoader      *dataloader.Loader
}

// batchTimeout はバッチ 1 回の DB 読み取りの上限。main.go の requestTimeout と同じ値
const batchTimeout = 30 * time.Second

// batchContext はバッチ関数用の ctx を返す。
// ローダーはプロセス全体で共有されるため、バッチ関数に渡る ctx は同じバッチ窓で最初に Load したリクエストのもの。
// そのリクエストが既にキャンセル済み (クライアント切断や timeout) でも同じバッチに乗った他リクエスト分の
// 読み取りを失敗させないよう、キャンセルを切り離してバッチ独自の timeout を付ける。
func batchContext(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.WithoutCancel(ctx), batchTimeout)
}

func NewLoaders(
	playerUsecase usecase.PlayerUsecase,
	gameUsecase usecase.GameUsecase,
	charaUsecase usecase.CharaUsecase,
) *Loaders {
	gameBatcher := &gameBatcher{gameUsecase: gameUsecase}
	playerBatcher := &playerBatcher{playerUsecase: playerUsecase}
	charaBatcher := &charaBatcher{charaUsecase: charaUsecase}
	return &Loaders{
		PeriodLoader:          dataloader.NewBatchedLoader(gameBatcher.batchLoadPeriod),
		ParticipantLoader:     dataloader.NewBatchedLoader(gameBatcher.batchLoadParticipant),
		ParticipantIconLoader: dataloader.NewBatchedLoader(gameBatcher.batchLoadParticipantIcon),
		PlayerLoader:          dataloader.NewBatchedLoader(playerBatcher.batchLoadPlayer),
		CharachipLoader:       dataloader.NewBatchedLoader(charaBatcher.batchLoadCharachip),
		CharaLoader:           dataloader.NewBatchedLoader(charaBatcher.batchLoadChara),
		CharaImageLoader:      dataloader.NewBatchedLoader(charaBatcher.batchLoadCharaImage),
	}
}

type gameBatcher struct {
	gameUsecase usecase.GameUsecase
}

func NewGameBatcher(gameUsecase usecase.GameUsecase) *gameBatcher {
	return &gameBatcher{
		gameUsecase: gameUsecase,
	}
}

type playerBatcher struct {
	playerUsecase usecase.PlayerUsecase
}

func NewPlayerBatcher(playerUsecase usecase.PlayerUsecase) *playerBatcher {
	return &playerBatcher{
		playerUsecase: playerUsecase,
	}
}

type charaBatcher struct {
	charaUsecase usecase.CharaUsecase
}

func NewCharaBatcher(charaUsecase usecase.CharaUsecase) *charaBatcher {
	return &charaBatcher{
		charaUsecase: charaUsecase,
	}
}

func (g *gameBatcher) batchLoadPeriod(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	periods, err := g.gameUsecase.FindGamePeriods(ctx, intids)
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		ps := array.Find(periods, func(p model.GamePeriod) bool {
			return p.ID == id
		})
		return &dataloader.Result{
			Data:  ps,
			Error: nil,
		}
	})
}

func (g *gameBatcher) batchLoadParticipant(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	participants, err := g.gameUsecase.FindGameParticipants(ctx, model.GameParticipantsQuery{IDs: &intids})
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		ps := array.Find(participants.List, func(p model.GameParticipant) bool {
			return p.ID == id
		})
		return &dataloader.Result{
			Data:  ps,
			Error: nil,
		}
	})
}

func (g *gameBatcher) batchLoadParticipantIcon(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	isContainDeleted := true
	icons, err := g.gameUsecase.FindGameParticipantIcons(ctx, model.GameParticipantIconsQuery{
		IDs:              &intids,
		IsContainDeleted: &isContainDeleted,
	})
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		ps := array.Find(icons, func(p model.GameParticipantIcon) bool {
			return p.ID == id
		})
		return &dataloader.Result{
			Data:  ps,
			Error: nil,
		}
	})
}

func (p *playerBatcher) batchLoadPlayer(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	players, err := p.playerUsecase.FindPlayers(ctx, model.PlayersQuery{
		IDs: &intids,
	})
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		ps := array.Find(players, func(p model.Player) bool {
			return p.ID == id
		})
		return &dataloader.Result{
			Data:  ps,
			Error: nil,
		}
	})
}

func (p *charaBatcher) batchLoadCharachip(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	charachips, err := p.charaUsecase.FindCharachips(ctx, model.CharachipQuery{
		IDs: &intids,
	})
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		charachip := array.Find(charachips, func(c model.Charachip) bool {
			return c.ID == id
		})
		return &dataloader.Result{
			Data:  charachip,
			Error: nil,
		}
	})
}

func (p *charaBatcher) batchLoadChara(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	charas, err := p.charaUsecase.FindCharas(ctx, intids)
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		chara := array.Find(charas, func(c model.Chara) bool {
			return c.ID == id
		})
		return &dataloader.Result{
			Data:  chara,
			Error: nil,
		}
	})
}

func (p *charaBatcher) batchLoadCharaImage(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ctx, cancel := batchContext(ctx) // 最初に Load したリクエストのキャンセルに引きずられないようにする
	defer cancel()
	var err error
	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
		intid, e := idToUint32(ID.String())
		if e != nil {
			err = e
		}
		return intid
	})
	if err != nil {
		return nil
	}
	charaImages, err := p.charaUsecase.FindCharaImages(ctx, model.CharaImageQuery{
		IDs: &intids,
	})
	if err != nil {
		return nil
	}
	return array.Map(intids, func(id uint32) *dataloader.Result {
		charaImage := array.Find(charaImages, func(c model.CharaImage) bool {
			return c.ID == id
		})
		return &dataloader.Result{
			Data:  charaImage,
			Error: nil,
		}
	})
}
