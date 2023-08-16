package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
	"context"

	"github.com/graph-gophers/dataloader"
)

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
		return MapToDesigner(&d)
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
	return MapToDesigner(d), nil
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
		return MapToCharachip(&charachip)
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
	return MapToCharachip(charachip), nil
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
	return MapToChara(chara), nil
}

func (r *gameParticipantResolver) chara(ctx context.Context, obj *gqlmodel.GameParticipant) (*gqlmodel.Chara, error) {
	if obj.CharaID == nil {
		return nil, nil
	}
	thunk := r.loaders.CharaLoader.Load(ctx, dataloader.StringKey(*obj.CharaID))
	i, err := thunk()
	if err != nil {
		return nil, err
	}
	c := i.(*model.Chara)
	return MapToChara(c), nil
}

// Charachips is the resolver for the charachips field.
func (r *gameCharaSettingResolver) charachips(ctx context.Context, obj *gqlmodel.GameCharaSetting) ([]*gqlmodel.Charachip, error) {
	if obj.CharachipIDs == nil || len(obj.CharachipIDs) == 0 {
		return nil, nil
	}
	thunk := r.loaders.CharachipLoader.LoadMany(ctx, dataloader.NewKeysFromStrings(obj.CharachipIDs))
	c, errs := thunk()
	if errs != nil || len(errs) > 0 {
		return nil, errs[0]
	}
	return array.Map(c, func(c interface{}) *gqlmodel.Charachip {
		charachip := c.(*model.Charachip)
		return MapToCharachip(charachip)
	}), nil
}
