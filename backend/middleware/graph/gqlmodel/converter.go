package gqlmodel

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
	"time"
)

func (g NewGame) MapToGame() model.Game {
	periodPrefix := ""
	if g.Settings.Time.PeriodPrefix != nil {
		periodPrefix = *g.Settings.Time.PeriodPrefix
	}
	periodSuffix := ""
	if g.Settings.Time.PeriodSuffix != nil {
		periodSuffix = *g.Settings.Time.PeriodSuffix
	}
	return model.Game{
		Name:         g.Name,
		Status:       model.GameStatusClosed,
		GameMasters:  []model.GameMaster{},
		Participants: model.GameParticipants{},
		Periods: []model.GamePeriod{
			{
				Count:   0,
				Name:    strings.Join([]string{periodPrefix, "0", periodSuffix}, ""),
				StartAt: time.Now(),
				EndAt:   g.Settings.Time.OpenAt,
			},
		},
		Settings: model.GameSettings{
			Chara: model.GameCharaSettings{
				CharachipIDs: array.Map(g.Settings.Chara.CharachipIds, func(charachipId int) uint32 {
					return uint32(charachipId)
				}),
				CanOriginalCharacter: g.Settings.Chara.CanOriginalCharacter,
			},
			Capacity: model.GameCapacitySettings{
				Min: uint32(g.Settings.Capacity.Min),
				Max: uint32(g.Settings.Capacity.Max),
			},
			Time: model.GameTimeSettings{
				PeriodPrefix:          g.Settings.Time.PeriodPrefix,
				PeriodSuffix:          g.Settings.Time.PeriodSuffix,
				PeriodIntervalSeconds: uint32(g.Settings.Time.PeriodIntervalSeconds),
				OpenAt:                g.Settings.Time.OpenAt,
				StartParticipateAt:    g.Settings.Time.StartParticipateAt,
				StartGameAt:           g.Settings.Time.StartGameAt,
			},
			Rule: model.GameRuleSettings{
				CanShorten:           g.Settings.Rule.CanShorten,
				CanSendDirectMessage: g.Settings.Rule.CanSendDirectMessage,
			},
			Password: model.GamePasswordSettings{
				HasPassword: g.Settings.Password.Password != nil,
				Password:    g.Settings.Password.Password,
			},
		},
	}
}

func (g UpdateGameSetting) MapToGameSetting() model.GameSettings {
	return model.GameSettings{
		Chara: model.GameCharaSettings{
			CharachipIDs: array.Map(g.Settings.Chara.CharachipIds, func(charachipId int) uint32 {
				return uint32(charachipId)
			}),
			CanOriginalCharacter: g.Settings.Chara.CanOriginalCharacter,
		},
		Capacity: model.GameCapacitySettings{
			Min: uint32(g.Settings.Capacity.Min),
			Max: uint32(g.Settings.Capacity.Max),
		},
		Time: model.GameTimeSettings{
			PeriodPrefix:          g.Settings.Time.PeriodPrefix,
			PeriodSuffix:          g.Settings.Time.PeriodSuffix,
			PeriodIntervalSeconds: uint32(g.Settings.Time.PeriodIntervalSeconds),
			OpenAt:                g.Settings.Time.OpenAt,
			StartParticipateAt:    g.Settings.Time.StartParticipateAt,
			StartGameAt:           g.Settings.Time.StartGameAt,
		},
		Rule: model.GameRuleSettings{
			CanShorten:           g.Settings.Rule.CanShorten,
			CanSendDirectMessage: g.Settings.Rule.CanSendDirectMessage,
		},
		Password: model.GamePasswordSettings{
			HasPassword: g.Settings.Password.Password != nil,
			Password:    g.Settings.Password.Password,
		},
	}
}

func (q GamesQuery) MapToGamesQuery() (*model.GamesQuery, error) {
	var intids *[]uint32
	var err error
	if q.Ids != nil {
		ids := array.Map(q.Ids, func(id string) uint32 {
			intid, e := idToUint32(id)
			if e != nil {
				err = e
			}
			return intid
		})
		if err != nil {
			return nil, err
		}
		intids = &ids
	}
	var statuses *[]model.GameStatus
	if q.Statuses != nil {
		ses := array.Map(q.Statuses, func(status GameStatus) model.GameStatus {
			return *model.GameStatusValueOf(status.String())
		})
		statuses = &ses
	}
	var paging *model.PagingQuery
	if q.Paging != nil {
		paging = &model.PagingQuery{
			PageSize:   q.Paging.PageSize,
			PageNumber: q.Paging.PageNumber,
			Desc:       q.Paging.IsDesc,
		}
	}
	return &model.GamesQuery{
		IDs:      intids,
		Name:     q.Name,
		Statuses: statuses,
		Paging:   paging,
	}, nil
}

func idToUint32(id string) (uint32, error) {
	byte, err := base64.StdEncoding.DecodeString(id)
	if err != nil {
		return 0, err
	}
	parts := strings.Split(string(byte), ":")
	if len(parts) == 2 {
		number, err := strconv.ParseUint(parts[1], 10, 32)
		if err != nil {
			return 0, err
		}
		return uint32(number), nil
	} else {
		return 0, fmt.Errorf("Invalid input format")
	}
}

func idToUint64(id string) (uint64, error) {
	byte, err := base64.StdEncoding.DecodeString(id)
	if err != nil {
		return 0, err
	}
	parts := strings.Split(string(byte), ":")
	if len(parts) == 2 {
		number, err := strconv.ParseUint(parts[1], 10, 64)
		if err != nil {
			return 0, err
		}
		return number, nil
	} else {
		return 0, fmt.Errorf("Invalid input format")
	}
}
