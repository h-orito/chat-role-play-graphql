package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"

	"github.com/graph-gophers/dataloader"
)

func (r *mutationResolver) registerDesigner(ctx context.Context, input gqlmodel.NewDesigner) (*gqlmodel.RegisterDesignerPayload, error) {
	saved, err := r.charaUsecase.RegisterDesigner(ctx, model.Designer{
		Name: input.Name,
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterDesignerPayload{
		Designer: gqlmodel.MapToDesigner(saved),
	}, nil
}

func (r *mutationResolver) updateDesigner(ctx context.Context, input gqlmodel.UpdateDesigner) (*gqlmodel.UpdateDesignerPayload, error) {
	id, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if _, err := r.charaUsecase.UpdateDesigner(ctx, model.Designer{ID: id, Name: input.Name}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateDesignerPayload{Ok: true}, nil
}

func (r *mutationResolver) registerCharachip(ctx context.Context, input gqlmodel.NewCharachip) (*gqlmodel.RegisterCharachipPayload, error) {
	designerID, err := idToUint32(input.DesignerID)
	if err != nil {
		return nil, err
	}
	saved, err := r.charaUsecase.RegisterCharachip(ctx, model.Charachip{
		Name:     input.Name,
		Designer: model.Designer{ID: designerID},
	})
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterCharachipPayload{
		Charachip: gqlmodel.MapToCharachip(saved),
	}, nil
}

func (r *mutationResolver) updateCharachip(ctx context.Context, input gqlmodel.UpdateCharachip) (*gqlmodel.UpdateCharachipPayload, error) {
	id, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if err != nil {
		return nil, err
	}
	if _, err := r.charaUsecase.UpdateCharachip(ctx, model.Charachip{
		ID:   id,
		Name: input.Name,
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateCharachipPayload{Ok: true}, nil
}

func (r *mutationResolver) registerCharachipChara(ctx context.Context, input gqlmodel.NewChara) (*gqlmodel.RegisterCharaPayload, error) {
	charachipID, err := idToUint32(input.CharachipID)
	if err != nil {
		return nil, err
	}
	c := model.Chara{
		Name: input.Name,
	}
	saved, err := r.charaUsecase.RegisterChara(ctx, c, &charachipID, nil)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterCharaPayload{
		Chara: gqlmodel.MapToChara(saved),
	}, nil
}

func (r *mutationResolver) updateChara(ctx context.Context, input gqlmodel.UpdateChara) (*gqlmodel.UpdateCharaPayload, error) {
	id, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if _, err := r.charaUsecase.UpdateChara(ctx, model.Chara{
		ID:   id,
		Name: input.Name,
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateCharaPayload{Ok: true}, nil
}

func (r *mutationResolver) registerCharaImage(ctx context.Context, input gqlmodel.NewCharaImage) (*gqlmodel.RegisterCharaImagePayload, error) {
	charaId, err := idToUint32(input.CharaID)
	if err != nil {
		return nil, err
	}
	ci := model.CharaImage{
		Type: input.Type,
		Size: model.CharaSize{
			Width:  uint32(input.Width),
			Height: uint32(input.Height),
		},
		URL: input.URL,
	}
	saved, err := r.charaUsecase.RegisterCharaImage(ctx, ci, charaId)
	if err != nil {
		return nil, err
	}
	return &gqlmodel.RegisterCharaImagePayload{
		CharaImage: gqlmodel.MapToCharaImage(saved),
	}, nil
}

func (r *mutationResolver) updateCharaImage(ctx context.Context, input gqlmodel.UpdateCharaImage) (*gqlmodel.UpdateCharaImagePayload, error) {
	charaImageId, err := idToUint32(input.ID)
	if err != nil {
		return nil, err
	}
	if _, err := r.charaUsecase.UpdateCharaImage(ctx, model.CharaImage{
		ID:   charaImageId,
		Type: input.Type,
		Size: model.CharaSize{
			Width:  uint32(input.Width),
			Height: uint32(input.Height),
		},
		URL: input.URL,
	}); err != nil {
		return nil, err
	}
	return &gqlmodel.UpdateCharaImagePayload{Ok: true}, nil
}

// --------------------

func (r *queryResolver) designers(ctx context.Context, query gqlmodel.DesignersQuery) ([]*gqlmodel.Designer, error) {
	var err error
	var ids *[]uint32
	if query.Ids != nil {
		uint32ids := array.Map(query.Ids, func(id string) uint32 {
			i, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return i
		})
		if err != nil {
			return nil, err
		}
		ids = &uint32ids
	}
	var pq *model.PagingQuery
	if query.Paging != nil {
		pq = &model.PagingQuery{
			PageSize:   query.Paging.PageSize,
			PageNumber: query.Paging.PageNumber,
			Desc:       query.Paging.IsDesc,
		}
	}
	designers, err := r.charaUsecase.FindDesigners(model.DesignerQuery{
		IDs:    ids,
		Name:   query.Name,
		Paging: pq,
	})
	if err != nil {
		return nil, err
	}
	return array.Map(designers, func(d model.Designer) *gqlmodel.Designer {
		return gqlmodel.MapToDesigner(&d)
	}), nil
}

func (r *queryResolver) designer(ctx context.Context, id string) (*gqlmodel.Designer, error) {
	uint32id, err := idToUint32(id)
	if err != nil {
		return nil, err
	}
	d, err := r.charaUsecase.FindDesigner(uint32id)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToDesigner(d), nil
}

func (r *queryResolver) charachips(ctx context.Context, query gqlmodel.CharachipsQuery) ([]*gqlmodel.Charachip, error) {
	var err error
	var ids *[]uint32
	if query.Ids != nil {
		uint32ids := array.Map(query.Ids, func(id string) uint32 {
			i, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return i
		})
		if err != nil {
			return nil, err
		}
		ids = &uint32ids
	}
	var pq *model.PagingQuery
	if query.Paging != nil {
		pq = &model.PagingQuery{
			PageSize:   query.Paging.PageSize,
			PageNumber: query.Paging.PageNumber,
			Desc:       query.Paging.IsDesc,
		}
	}
	charachips, err := r.charaUsecase.FindCharachips(model.CharachipQuery{
		IDs:    ids,
		Name:   query.Name,
		Paging: pq,
	})
	if err != nil {
		return nil, err
	}
	return array.Map(charachips, func(charachip model.Charachip) *gqlmodel.Charachip {
		return gqlmodel.MapToCharachip(&charachip)
	}), nil
}

func (r *queryResolver) charachip(ctx context.Context, id string) (*gqlmodel.Charachip, error) {
	intid, err := idToUint32(id)
	if err != nil {
		return nil, err
	}
	charachip, err := r.charaUsecase.FindCharachip(intid)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToCharachip(charachip), nil
}

func (r *queryResolver) chara(ctx context.Context, id string) (*gqlmodel.Chara, error) {
	intid, err := idToUint32(id)
	if err != nil {
		return nil, err
	}
	chara, err := r.charaUsecase.FindChara(intid)
	if err != nil {
		return nil, err
	}
	return gqlmodel.MapToChara(chara), nil
}

func (r *gameParticipantResolver) chara(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.Chara, error) {
	thunk := r.loaders.CharaLoader.Load(ctx, dataloader.StringKey(obj.CharaID))
	c, err := thunk()
	if err != nil {
		return nil, err
	}
	chara := c.(*model.Chara)
	return gqlmodel.MapToChara(chara), nil
}

func (r *messageSenderResolver) charaImage(ctx context.Context, obj *gqlmodel.MessageSender) (*gqlmodel.CharaImage, error) {
	thunk := r.loaders.CharaLoader.Load(ctx, dataloader.StringKey(obj.CharaImageID))
	c, err := thunk()
	if err != nil {
		return nil, err
	}
	charaImage := c.(*model.CharaImage)
	return gqlmodel.MapToCharaImage(charaImage), nil
}
