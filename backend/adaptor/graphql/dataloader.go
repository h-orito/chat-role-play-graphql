package graphql

import (
	"chat-role-play/application/usecase"
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"context"

	"github.com/graph-gophers/dataloader"
)

type Loaders struct {
	PlayerLoader     *dataloader.Loader
	CharaLoader      *dataloader.Loader
	CharaImageLoader *dataloader.Loader
}

func NewLoaders(
	playerUsecase usecase.PlayerUsecase,
	gameUsecase usecase.GameUsecase,
	charaUsecase usecase.CharaUsecase,
) *Loaders {
	playerBatcher := &playerBatcher{playerUsecase: playerUsecase}
	charaBatcher := &charaBatcher{charaUsecase: charaUsecase}
	return &Loaders{
		PlayerLoader:     dataloader.NewBatchedLoader(playerBatcher.batchLoadPlayer),
		CharaLoader:      dataloader.NewBatchedLoader(charaBatcher.batchLoadChara),
		CharaImageLoader: dataloader.NewBatchedLoader(charaBatcher.batchLoadCharaImage),
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

func (p *playerBatcher) batchLoadPlayer(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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
	players, err := p.playerUsecase.FindPlayers(intids)
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

func (p *charaBatcher) batchLoadChara(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
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
	charas, err := p.charaUsecase.FindCharas(intids)
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
	charaImages, err := p.charaUsecase.FindCharaImages(model.CharaImageQuery{
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
