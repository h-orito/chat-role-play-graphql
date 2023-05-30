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

func MapToDesigner(d *model.Designer) *Designer {
	if d == nil {
		return nil
	}
	return &Designer{
		ID:   intIdToBase64(d.ID, "Designer"),
		Name: d.Name,
	}
}

func MapToCharachip(c *model.Charachip) *Charachip {
	if c == nil {
		return nil
	}
	return &Charachip{
		ID:       intIdToBase64(c.ID, "Charachip"),
		Name:     c.Name,
		Designer: MapToDesigner(&c.Designer),
		Charas: array.Map(c.Charas, func(c model.Chara) *Chara {
			return MapToChara(&c)
		}),
	}
}

func MapToChara(c *model.Chara) *Chara {
	if c == nil {
		return nil
	}
	return &Chara{
		ID:   intIdToBase64(c.ID, "Chara"),
		Name: c.Name,
		Images: array.Map(c.Images, func(i model.CharaImage) *CharaImage {
			return MapToCharaImage(&i)
		}),
	}
}

func MapToCharaImage(ci *model.CharaImage) *CharaImage {
	if ci == nil {
		return nil
	}
	return &CharaImage{
		ID:   intIdToBase64(ci.ID, "CharaImage"),
		Type: ci.Type,
		Size: &CharaSize{
			Width:  int(ci.Size.Width),
			Height: int(ci.Size.Height),
		},
		URL: ci.URL,
	}
}

func MapToGame(g *model.Game) *Game {
	if g == nil {
		return nil
	}
	return &Game{
		ID:          intIdToBase64(g.ID, "Game"),
		Name:        g.Name,
		Status:      GameStatus(g.Status.String()),
		GameMasters: []*GameMaster{},
		Participants: array.Map(g.Participants.List, func(gp model.GameParticipant) *GameParticipant {
			return MapToGameParticipant(gp)
		}),
		Periods: array.Map(g.Periods, func(p model.GamePeriod) *GamePeriod {
			return MapToGamePeriod(&p)
		}),
		Settings: &GameSettings{},
	}
}

func MapToGamePeriod(p *model.GamePeriod) *GamePeriod {
	if p == nil {
		return nil
	}
	return &GamePeriod{
		ID:      intIdToBase64(p.ID, "GamePeriod"),
		Count:   int(p.Count),
		Name:    p.Name,
		StartAt: p.StartAt,
		EndAt:   p.EndAt,
	}
}

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

func MapToSimpleGame(g *model.Game) *SimpleGame {
	if g == nil {
		return nil
	}
	return &SimpleGame{
		ID:                intIdToBase64(g.ID, "Game"),
		Name:              g.Name,
		ParticipantsCount: g.Participants.Count,
	}
}

func MapToGameMaster(gm *model.GameMaster, player *model.Player) *GameMaster {
	if gm == nil {
		return nil
	}
	return &GameMaster{
		ID:         intIdToBase64(gm.ID, "GameMaster"),
		Player:     MapToPlayer(player),
		IsProducer: gm.IsProducer,
	}
}

func MapToGameParticipants(
	participants []model.GameParticipant,
) []*GameParticipant {
	if participants == nil {
		return nil
	}
	return array.Map(participants, func(p model.GameParticipant) *GameParticipant {
		return MapToGameParticipant(p)
	})
}

func MapToGameParticipant(
	p model.GameParticipant,
) *GameParticipant {
	return &GameParticipant{
		ID:             intIdToBase64(p.ID, "GameParticipant"),
		Name:           p.Name,
		EntryNumber:    int(p.EntryNumber),
		PlayerID:       intIdToBase64(p.PlayerID, "Player"),
		CharaID:        intIdToBase64(p.CharaID, "Chara"),
		IsGone:         p.IsGone,
		LastAccessedAt: p.LastAccessedAt,
	}
}

func MapToGameParticipantProfile(p model.GameParticipantProfile) *GameParticipantProfile {
	return &GameParticipantProfile{
		IconURL:        p.IconURL,
		Introduction:   p.Introduction,
		Memo:           p.Memo,
		FollowsCount:   p.FollowsCount,
		FollowersCount: p.FollowersCount,
	}
}

func MapToGameParticipantSetting(p model.GameParticipantNotification) *GameParticipantSetting {
	return &GameParticipantSetting{
		Notification: &NotificationCondition{
			DiscordWebhookURL: p.DiscordWebhookUrl,
			Game: &GameNotificationCondition{
				Participate: p.Game.Participate,
				Start:       p.Game.Start,
			},
			Message: &MessageNotificationCondition{
				Reply:         p.Message.Reply,
				DirectMessage: p.Message.DirectMessage,
				Keywords:      p.Message.Keywords,
			},
		},
	}
}

func MapToGameParticipantDiaries(
	diaries []model.GameParticipantDiary,
	participants []model.GameParticipant,
	periods []model.GamePeriod,
) []*GameParticipantDiary {
	if diaries == nil {
		return nil
	}
	return array.Map(diaries, func(d model.GameParticipantDiary) *GameParticipantDiary {
		participant := array.Find(participants, func(p model.GameParticipant) bool {
			return p.ID == d.GameParticipantID
		})
		period := array.Find(periods, func(period model.GamePeriod) bool {
			return period.ID == d.GamePeriodID
		})
		return MapToGameParticipantDiary(d, participant, period)
	})
}

func MapToGameParticipantDiary(
	p model.GameParticipantDiary,
	participant *model.GameParticipant,
	period *model.GamePeriod,
) *GameParticipantDiary {
	return &GameParticipantDiary{
		ID:          intIdToBase64(p.ID, "GameParticipantDiary"),
		Participant: MapToGameParticipant(*participant),
		Period:      MapToGamePeriod(period),
		Title:       p.Title,
		Body:        p.Body,
	}
}

func MapToPlayer(p *model.Player) *Player {
	if p == nil {
		return nil
	}
	return &Player{
		ID:   intIdToBase64(p.ID, "Player"),
		Name: p.Name,
	}
}

func MapToPlayerProfile(p *model.PlayerProfile) *PlayerProfile {
	if p == nil {
		return nil
	}
	return &PlayerProfile{
		IconURL:      p.IconURL,
		Introduction: p.Introduction,
		SnsAccounts: array.Map(p.SnsAccounts, func(s model.PlayerSnsAccount) *PlayerSnsAccount {
			return MapToPlayerSnsAccount(s)
		}),
	}
}

func MapToPlayerSnsAccount(s model.PlayerSnsAccount) *PlayerSnsAccount {
	return &PlayerSnsAccount{
		ID:   intIdToBase64(s.ID, "PlayerSnsAccount"),
		Type: SnsType(s.SnsType.String()),
		Name: &s.AccountName,
		URL:  s.AccountURL,
	}
}

func MapToMessages(ms model.Messages) Messages {
	list := array.Map(ms.List, func(m model.Message) *Message {
		return MapToMessage(&m)
	})

	var currentPageNumber *int
	if ms.CurrentPageNumber != nil {
		n := int(*ms.CurrentPageNumber)
		currentPageNumber = &n
	}
	return Messages{
		List:              list,
		AllPageCount:      int(ms.AllPageCount),
		HasPrePage:        ms.HasNextPage,
		HasNextPage:       ms.HasNextPage,
		CurrentPageNumber: currentPageNumber,
		IsDesc:            ms.IsDesc,
	}

}
func MapToMessage(m *model.Message) *Message {
	if m == nil {
		return nil
	}
	var sender *MessageSender
	if m.Sender != nil {
		sender = &MessageSender{
			ParticipantID: intIdToBase64(m.Sender.GameParticipantID, "GameParticipant"),
			CharaName:     m.Sender.CharaName,
			CharaImageID:  intIdToBase64(m.Sender.CharaImageID, "CharaImage"),
		}
	}
	var replyTo *MessageRecipient
	if m.ReplyTo != nil {
		replyTo = &MessageRecipient{
			MessageID:     int64IdToBase64(m.ReplyTo.MessageID, "Message"),
			ParticipantID: intIdToBase64(m.ReplyTo.GameParticipantID, "GameParticipant"),
		}
	}
	return &Message{
		ID: int64IdToBase64(m.ID, "Message"),
		Content: &MessageContent{
			Type:              MessageType(m.Type.String()),
			Number:            int(m.Content.Number),
			Text:              m.Content.Text,
			IsConvertDisabled: m.Content.IsConvertDisabled,
		},
		Time: &MessageTime{
			SendAt:            m.Time.SendAt,
			SendUnixTimeMilli: strconv.FormatUint(m.Time.UnixtimeMilli, 10),
		},
		Sender:  sender,
		ReplyTo: replyTo,
		Reactions: &MessageReactions{
			ReplyCount:    int(m.Reactions.ReplyCount),
			FavoriteCount: int(m.Reactions.FavoriteCount),
		},
	}
}

func MapToGameParticipantGroup(g *model.GameParticipantGroup, participants []*GameParticipant) *GameParticipantGroup {
	if g == nil {
		return nil
	}
	return &GameParticipantGroup{
		ID:   intIdToBase64(g.ID, "GameParticipantGroup"),
		Name: g.Name,
		Participants: array.Map(g.MemberIDs, func(id uint32) *GameParticipant {
			strid := intIdToBase64(id, "GameParticipant")
			p := array.Find(participants, func(p *GameParticipant) bool {
				return p.ID == strid
			})
			return *p
		}),
	}
}

func MapToDirectMessages(ms model.DirectMessages) DirectMessages {
	list := array.Map(ms.List, func(m model.DirectMessage) *DirectMessage {
		return MapToDirectMessage(&m)
	})

	var currentPageNumber *int
	if ms.CurrentPageNumber != nil {
		n := int(*ms.CurrentPageNumber)
		currentPageNumber = &n
	}
	return DirectMessages{
		List:              list,
		AllPageCount:      int(ms.AllPageCount),
		HasPrePage:        ms.HasNextPage,
		HasNextPage:       ms.HasNextPage,
		CurrentPageNumber: currentPageNumber,
		IsDesc:            ms.IsDesc,
	}

}
func MapToDirectMessage(m *model.DirectMessage) *DirectMessage {
	if m == nil {
		return nil
	}
	var sender *MessageSender
	if m.Sender != nil {
		sender = &MessageSender{
			ParticipantID: intIdToBase64(m.Sender.GameParticipantID, "GameParticipant"),
			CharaName:     m.Sender.CharaName,
			CharaImageID:  intIdToBase64(m.Sender.CharaImageID, "CharaImage"),
		}
	}
	return &DirectMessage{
		ID: int64IdToBase64(m.ID, "DirectMessage"),
		Content: &MessageContent{
			Type:              MessageType(m.Type.String()),
			Number:            int(m.Content.Number),
			Text:              m.Content.Text,
			IsConvertDisabled: m.Content.IsConvertDisabled,
		},
		Time: &MessageTime{
			SendAt:            m.Time.SendAt,
			SendUnixTimeMilli: strconv.FormatUint(m.Time.UnixtimeMilli, 10),
		},
		Sender: sender,
		Reactions: &DirectMessageReactions{
			FavoriteCounts: int(m.Reactions.FavoriteCount),
		},
	}
}

func intIdToBase64(id uint32, prefix string) string {
	str := fmt.Sprintf("%s:%d", prefix, id)
	return base64.StdEncoding.EncodeToString([]byte(str))
}

func int64IdToBase64(id uint64, prefix string) string {
	str := fmt.Sprintf("%s:%d", prefix, id)
	return base64.StdEncoding.EncodeToString([]byte(str))
}
