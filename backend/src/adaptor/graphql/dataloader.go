package graphql

import (
	"chat-role-play/src/application/usecase"
)

type Loaders struct {
	// ParticipantLoader *dataloader.Loader
}

func NewLoaders(
	gameUsecase usecase.GameUsecase,
) *Loaders {
	// participantBatcher := &participantBatcher{gameUsecase: gameUsecase}
	return &Loaders{
		// ParticipantLoader: dataloader.NewBatchedLoader(participantBatcher.batchLoadParticipant),
	}
}

// type participantBatcher struct {
// 	gameUsecase usecase.GameUsecase
// }

// func NewParticipantBatcher(gameUsecase usecase.GameUsecase) *participantBatcher {
// 	return &participantBatcher{
// 		gameUsecase: gameUsecase,
// 	}
// }

// func (u *participantBatcher) batchLoadParticipant(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
// 	intids := array.Map(keys, func(ID dataloader.Key) uint32 {
// 		intid, err := idToIntId(ID.String())
// 		if err != nil {
// 			return 0
// 		}
// 		return intid
// 	})
// 	participants, err := u.gameUsecase.FindGameParticipantsByGameIDs(intids)
// 	if err != nil {
// 		return nil
// 	}
// 	return array.Map(intids, func(id uint32) *dataloader.Result {
// 		ps := array.Filter(participants.List, func(p model.GameParticipant) bool {
// 			return p.GameID == id
// 		})
// 		return &dataloader.Result{
// 			Data:  &ps,
// 			Error: nil,
// 		}
// 	})
// }
