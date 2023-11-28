package graphql

import (
	"chat-role-play/domain/model"
	"chat-role-play/middleware/graph/gqlmodel"
	"chat-role-play/util/array"
)

func MapToGame(g *model.Game) *gqlmodel.Game {
	if g == nil {
		return nil
	}
	return &gqlmodel.Game{
		ID:     intIdToBase64(g.ID, "Game"),
		Name:   g.Name,
		Status: gqlmodel.GameStatus(g.Status.String()),
		Labels: array.Map(g.Labels, func(l model.GameLabel) *gqlmodel.GameLabel {
			return MapToGameLabel(&l)
		}),
		GameMasters: array.Map(g.GameMasters, func(gm model.GameMaster) *gqlmodel.GameMaster {
			return MapToGameMaster(&gm)
		}),
		Participants: array.Map(g.Participants.List, func(gp model.GameParticipant) *gqlmodel.GameParticipant {
			return MapToGameParticipant(gp)
		}),
		Periods: array.Map(g.Periods, func(p model.GamePeriod) *gqlmodel.GamePeriod {
			return MapToGamePeriod(&p)
		}),
		Settings: &gqlmodel.GameSettings{
			Background: &gqlmodel.GameBackgroundSetting{
				Introduction:  g.Settings.Background.Introduction,
				CatchImageURL: g.Settings.Background.CatchImageURL,
			},
			Chara: &gqlmodel.GameCharaSetting{
				CharachipIDs: array.Map(g.Settings.Chara.CharachipIDs, func(id uint32) string {
					return intIdToBase64(id, "Charachip")
				}),
				CanOriginalCharacter: g.Settings.Chara.CanOriginalCharacter,
			},
			Capacity: &gqlmodel.GameCapacity{
				Min: int(g.Settings.Capacity.Min),
				Max: int(g.Settings.Capacity.Max),
			},
			Time: &gqlmodel.GameTimeSetting{
				PeriodPrefix:          g.Settings.Time.PeriodPrefix,
				PeriodSuffix:          g.Settings.Time.PeriodSuffix,
				PeriodIntervalSeconds: int(g.Settings.Time.PeriodIntervalSeconds),
				OpenAt:                g.Settings.Time.OpenAt,
				StartParticipateAt:    g.Settings.Time.StartParticipateAt,
				StartGameAt:           g.Settings.Time.StartGameAt,
				EpilogueGameAt:        g.Settings.Time.EpilogueGameAt,
				FinishGameAt:          g.Settings.Time.FinishGameAt,
			},
			Rule: &gqlmodel.GameRuleSetting{
				IsGameMasterProducer: false,
				CanShorten:           g.Settings.Rule.CanShorten,
				CanSendDirectMessage: g.Settings.Rule.CanSendDirectMessage,
				Theme:                g.Settings.Rule.Theme,
			},
			Password: &gqlmodel.GamePasswordSetting{
				HasPassword: g.Settings.Password.HasPassword,
			},
		},
	}
}

func MapToGameLabel(l *model.GameLabel) *gqlmodel.GameLabel {
	if l == nil {
		return nil
	}
	return &gqlmodel.GameLabel{
		ID:   intIdToBase64(l.ID, "GameLabel"),
		Name: l.Name,
		Type: l.Type,
	}
}

func MapToGamePeriod(p *model.GamePeriod) *gqlmodel.GamePeriod {
	if p == nil {
		return nil
	}
	return &gqlmodel.GamePeriod{
		ID:      intIdToBase64(p.ID, "GamePeriod"),
		Count:   int(p.Count),
		Name:    p.Name,
		StartAt: p.StartAt,
		EndAt:   p.EndAt,
	}
}

func MapToSimpleGame(g *model.Game) *gqlmodel.SimpleGame {
	if g == nil {
		return nil
	}
	return &gqlmodel.SimpleGame{
		ID:     intIdToBase64(g.ID, "Game"),
		Name:   g.Name,
		Status: gqlmodel.GameStatus(g.Status.String()),
		Labels: array.Map(g.Labels, func(l model.GameLabel) *gqlmodel.GameLabel {
			return MapToGameLabel(&l)
		}),
		ParticipantsCount: g.Participants.Count,
		Periods: array.Map(g.Periods, func(p model.GamePeriod) *gqlmodel.GamePeriod {
			return MapToGamePeriod(&p)
		}),
		Settings: &gqlmodel.GameSettings{
			Background: &gqlmodel.GameBackgroundSetting{
				Introduction:  g.Settings.Background.Introduction,
				CatchImageURL: g.Settings.Background.CatchImageURL,
			},
			Chara: &gqlmodel.GameCharaSetting{
				Charachips:           []*gqlmodel.Charachip{},
				CanOriginalCharacter: g.Settings.Chara.CanOriginalCharacter,
			},
			Capacity: &gqlmodel.GameCapacity{
				Min: int(g.Settings.Capacity.Min),
				Max: int(g.Settings.Capacity.Max),
			},
			Time: &gqlmodel.GameTimeSetting{
				PeriodPrefix:          g.Settings.Time.PeriodPrefix,
				PeriodSuffix:          g.Settings.Time.PeriodSuffix,
				PeriodIntervalSeconds: int(g.Settings.Time.PeriodIntervalSeconds),
				OpenAt:                g.Settings.Time.OpenAt,
				StartParticipateAt:    g.Settings.Time.StartParticipateAt,
				StartGameAt:           g.Settings.Time.StartGameAt,
				EpilogueGameAt:        g.Settings.Time.EpilogueGameAt,
				FinishGameAt:          g.Settings.Time.FinishGameAt,
			},
			Rule: &gqlmodel.GameRuleSetting{
				IsGameMasterProducer: false,
				CanShorten:           g.Settings.Rule.CanShorten,
				CanSendDirectMessage: g.Settings.Rule.CanSendDirectMessage,
				Theme:                g.Settings.Rule.Theme,
			},
			Password: &gqlmodel.GamePasswordSetting{
				HasPassword: g.Settings.Password.HasPassword,
			},
		},
	}
}

func MapToGameMaster(gm *model.GameMaster) *gqlmodel.GameMaster {
	if gm == nil {
		return nil
	}
	return &gqlmodel.GameMaster{
		ID:         intIdToBase64(gm.ID, "GameMaster"),
		PlayerID:   intIdToBase64(gm.PlayerID, "Player"),
		IsProducer: gm.IsProducer,
	}
}

func MapToGameParticipants(participants []model.GameParticipant) []*gqlmodel.GameParticipant {
	if participants == nil {
		return nil
	}
	return array.Map(participants, func(p model.GameParticipant) *gqlmodel.GameParticipant {
		return MapToGameParticipant(p)
	})
}

func MapToGameParticipant(p model.GameParticipant) *gqlmodel.GameParticipant {
	var iconID *string
	if p.ProfileIconID != nil {
		id := intIdToBase64(*p.ProfileIconID, "GameParticipantIcon")
		iconID = &id
	}
	var charaID *string
	if p.CharaID != nil {
		id := intIdToBase64(*p.CharaID, "Chara")
		charaID = &id
	}
	return &gqlmodel.GameParticipant{
		ID:             intIdToBase64(p.ID, "GameParticipant"),
		Name:           p.Name,
		EntryNumber:    int(p.EntryNumber),
		PlayerID:       intIdToBase64(p.PlayerID, "Player"),
		CharaID:        charaID,
		Memo:           p.Memo,
		ProfileIconID:  iconID,
		IsGone:         p.IsGone,
		LastAccessedAt: p.LastAccessedAt,
		CanChangeName:  p.CanChangeName,
	}
}

func MapToGameParticipantProfile(
	p model.GameParticipantProfile,
	participant model.GameParticipant,
	player model.Player,
) *gqlmodel.GameParticipantProfile {
	return &gqlmodel.GameParticipantProfile{
		ParticipantID:   intIdToBase64(p.GameParticipantID, "GameParticipant"),
		Name:            participant.Name,
		EntryNumber:     int(participant.EntryNumber),
		IsGone:          participant.IsGone,
		ProfileImageURL: p.ProfileImageURL,
		Introduction:    p.Introduction,
		FollowsCount:    p.FollowsCount,
		FollowersCount:  p.FollowersCount,
		IsPlayerOpen:    p.IsPlayerOpen,
		PlayerName:      &player.Name,
	}
}

func MapToGameParticipantIcon(p model.GameParticipantIcon) *gqlmodel.GameParticipantIcon {
	return &gqlmodel.GameParticipantIcon{
		ID:     intIdToBase64(p.ID, "GameParticipantIcon"),
		URL:    p.IconImageURL,
		Width:  int(p.Width),
		Height: int(p.Height),
	}
}

func MapToGameParticipantSetting(p model.GameParticipantNotification) *gqlmodel.GameParticipantSetting {
	return &gqlmodel.GameParticipantSetting{
		Notification: &gqlmodel.NotificationCondition{
			DiscordWebhookURL: p.DiscordWebhookUrl,
			Game: &gqlmodel.GameNotificationCondition{
				Participate: p.Game.Participate,
				Start:       p.Game.Start,
			},
			Message: &gqlmodel.MessageNotificationCondition{
				Reply:         p.Message.Reply,
				Secret:        p.Message.Secret,
				DirectMessage: p.Message.DirectMessage,
				Keywords:      p.Message.Keywords,
			},
		},
	}
}

func MapToGameParticipantDiaries(diaries []model.GameParticipantDiary) []*gqlmodel.GameParticipantDiary {
	if diaries == nil {
		return nil
	}
	return array.Map(diaries, func(d model.GameParticipantDiary) *gqlmodel.GameParticipantDiary {
		return MapToGameParticipantDiary(d)
	})
}

func MapToGameParticipantDiary(p model.GameParticipantDiary) *gqlmodel.GameParticipantDiary {
	return &gqlmodel.GameParticipantDiary{
		ID:            intIdToBase64(p.ID, "GameParticipantDiary"),
		ParticipantID: intIdToBase64(p.GameParticipantID, "GameParticipant"),
		PeriodID:      intIdToBase64(p.GamePeriodID, "GamePeriod"),
		Title:         p.Title,
		Body:          p.Body,
	}
}
