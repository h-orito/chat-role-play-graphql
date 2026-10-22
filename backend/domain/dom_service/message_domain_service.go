package dom_service

import (
	"chat-role-play/domain/model"
	"chat-role-play/util/array"
	"fmt"
	"math/rand"
	"regexp"
	"strconv"
	"strings"
)

type MessageDomainService interface {
	AssertRegisterMessage(
		game model.Game,
		player model.Player,
		authorities []model.PlayerAuthority,
		myself *model.GameParticipant,
		message model.Message,
	) error
	AssertRegisterDirectMessage(
		game model.Game,
		player model.Player,
		authorities []model.PlayerAuthority,
		myself *model.GameParticipant,
		group *model.GameParticipantGroup,
		message model.DirectMessage,
	) error
	GetViewableMessageTypes(game model.Game, player *model.Player, authorities []model.PlayerAuthority) []model.MessageType
	CanViewMessage(
		game model.Game,
		message model.Message,
		myself *model.GameParticipant,
		player *model.Player,
		authorities []model.PlayerAuthority,
	) bool
	RestrictMessagesQuery(
		game model.Game,
		query model.MessagesQuery,
		myself *model.GameParticipant,
		player *model.Player,
		authorities []model.PlayerAuthority,
	) model.MessagesQuery
	ReplaceRandomMessageText(game model.Game, message model.MessageContent) (model.MessageContent, error)
}

type messageDomainService struct {
	gameMasterDomainService GameMasterDomainService
}

// AssertRegisterDirectMessage は秘話グループへの発言を登録できるか判定する。
// システム発言は GM (Admin 含む) だけ、それ以外は進行中のゲームでグループのメンバーだけが発言できる。
// group は対象ゲームから探したもの (見つからなければ nil) を渡す。
func (s *messageDomainService) AssertRegisterDirectMessage(
	game model.Game,
	player model.Player,
	authorities []model.PlayerAuthority,
	myself *model.GameParticipant,
	group *model.GameParticipantGroup,
	message model.DirectMessage,
) error {
	if group == nil {
		return fmt.Errorf("group not found")
	}
	if message.Type.IsSystem() {
		if !s.gameMasterDomainService.IsGameMaster(game, player, authorities) {
			return fmt.Errorf("only game masters can send system messages")
		}
		return nil
	}
	if !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	if myself == nil {
		return fmt.Errorf("not participating in this game")
	}
	if array.None(group.MemberIDs, func(id uint32) bool {
		return id == myself.ID
	}) {
		return fmt.Errorf("not a member of this group")
	}
	return nil
}

// AssertRegisterMessage は発言を登録できるか判定する。
// システム発言は GM (Admin 含む) だけ、それ以外は進行中のゲームの参加者だけが発言できる。
func (s *messageDomainService) AssertRegisterMessage(
	game model.Game,
	player model.Player,
	authorities []model.PlayerAuthority,
	myself *model.GameParticipant,
	message model.Message,
) error {
	if message.Type.IsSystem() {
		if !s.gameMasterDomainService.IsGameMaster(game, player, authorities) {
			return fmt.Errorf("only game masters can send system messages")
		}
		return nil
	}
	if !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	if myself == nil {
		return fmt.Errorf("not participating in this game")
	}
	return nil
}

// GetViewableMessageTypes は種別だけで見られる発言種別を返す (誰の発言か・誰宛てかは問わない)。
// player が nil なら、ログインしていない人 (誰でも) が見られる種別を返す。
func (s *messageDomainService) GetViewableMessageTypes(
	game model.Game,
	player *model.Player,
	authorities []model.PlayerAuthority,
) []model.MessageType {
	// 管理者またはエピローグを迎えていたら全部見られる
	if game.Status.ShouldSpoiler() || array.Any(authorities, func(a model.PlayerAuthority) bool {
		return a.IsAdmin()
	}) {
		return model.MessageTypeValues()
	}
	// GM 全発言閲覧設定が ON のゲームでは、GM は独り言・秘話を含む全種別を見られる
	if game.Settings.Rule.IsGameMasterViewAllMessages && player != nil &&
		s.gameMasterDomainService.IsGameMaster(game, *player, authorities) {
		return model.MessageTypeValues()
	}
	return model.MesssageTypeEveryoneViewableValues()
}

// RestrictMessagesQuery は発言一覧の検索条件を、閲覧者が見られる範囲に制限する。
// 判定のルールは CanViewMessage と同じ (見られる種別 + 自分の独り言・自分が送った/受け取った秘話) で、
// それを検索条件 (Types / IncludeMonologue / IncludeSecret) の形にしたもの。
func (s *messageDomainService) RestrictMessagesQuery(
	game model.Game,
	query model.MessagesQuery,
	myself *model.GameParticipant,
	player *model.Player,
	authorities []model.PlayerAuthority,
) model.MessagesQuery {
	// リクエストされた種別 (指定がなければ全種別)
	requestMessageTypes := model.MessageTypeValues()
	if query.Types != nil {
		requestMessageTypes = *query.Types
	}
	// 種別で見られる発言種別はドメインのルールで決まる (GM 全発言閲覧 ON の GM は全種別。この場合 type フィルタ自体が外れる)
	viewableMessageTypes := s.GetViewableMessageTypes(game, player, authorities)
	// viewable 側を基準に絞り込むことで、リクエストに同じタイプが重複していても結果は重複しない
	// (重複を残すと下の件数判定で全タイプ扱いになり、type フィルタが外れてしまう)
	types := array.Filter(viewableMessageTypes, func(v model.MessageType) bool {
		return array.Any(requestMessageTypes, func(t model.MessageType) bool {
			return v == t
		})
	})
	// 全タイプが viewable な場合は query.Types を nil にし、type フィルタ自体を無効化する。
	// （GM 全発言閲覧 ON 時はここで全タイプが残るため、後段の DB クエリで type 制約が付かない）
	// それ以外は必ず絞り込んだ結果で上書きする (クライアント指定のリストを残さない)
	if len(types) == len(model.MessageTypeValues()) {
		query.Types = nil
	} else {
		query.Types = &types
	}
	// 独り言を取得するか
	shouldIncludeMonologue := shouldIncludeMonologue(query, requestMessageTypes, myself)
	query.IncludeMonologue = &shouldIncludeMonologue
	shouldIncludeSecret := shouldIncludeSecret(query, requestMessageTypes, myself)
	query.IncludeSecret = &shouldIncludeSecret

	return query
}

// CanViewMessage は発言 1 件を見られるか判定する。
// 種別で見られなくても、自分の独り言と、自分が送った・受け取った秘話は見られる。
func (s *messageDomainService) CanViewMessage(
	game model.Game,
	message model.Message,
	myself *model.GameParticipant,
	player *model.Player,
	authorities []model.PlayerAuthority,
) bool {
	if array.Any(s.GetViewableMessageTypes(game, player, authorities), func(t model.MessageType) bool {
		return t == message.Type
	}) {
		return true
	}
	if myself == nil {
		return false
	}
	isSender := message.Sender != nil && message.Sender.GameParticipantID == myself.ID
	isReceiver := message.Receiver != nil && message.Receiver.GameParticipantID == myself.ID
	switch message.Type {
	case model.MessageTypeMonologue:
		return isSender
	case model.MessageTypeSecret:
		return isSender || isReceiver
	default:
		return false
	}
}

// ReplaceRandomMessageText implements MessageDomainService.
func (*messageDomainService) ReplaceRandomMessageText(
	game model.Game,
	message model.MessageContent,
) (model.MessageContent, error) {
	if message.IsConvertDisabled {
		return message, nil
	}
	text := message.Text
	replaced := replaceRandomKeywords(game, text)

	message.Text = replaced
	return message, nil
}

func NewMessageDomainService(gameMasterDomainService GameMasterDomainService) MessageDomainService {
	return &messageDomainService{gameMasterDomainService: gameMasterDomainService}
}

// -------

func replaceRandomKeywords(game model.Game, input string) string {
	stack := []rune{}

	for _, char := range input {
		if char == ']' {
			// スタックから "[" までの部分を取得
			// ネストしている場合があるので、戻る最中に"]"が出てきたらさらに前まで戻る
			lastCount := 1
			startCount := 0
			inner := "]"
			shouldReplace := false
			for len(stack) > 0 {
				last := stack[len(stack)-1]
				if last == '[' {
					startCount++
					inner = string(last) + inner
					if lastCount == startCount {
						stack = stack[:len(stack)-1]
						shouldReplace = true
						break
					}
				} else {
					if last == ']' {
						lastCount++
					}
					inner = string(last) + inner
				}
				stack = stack[:len(stack)-1]
			}

			// "[" と "]" で囲まれた部分を解析して結果に追加
			if shouldReplace {
				inner = replaceRandomKeyword(game, inner)
				stack = append(stack, []rune(inner)...)
			} else {
				stack = append(stack, []rune(inner+"]")...)
			}
		} else {
			// 通常の文字はスタックに追加
			stack = append(stack, char)
		}
	}

	return string(stack)
}

const (
	diceRegex    = `^\[(\d)d(\d{1,5})\]$`
	fortuneRegex = `^\[fortune\]$`
	orRegex      = `^\[(.*or.*)\]$`
	whoRegex     = `^\[who\]$`
)

func replaceRandomKeyword(game model.Game, input string) string {
	replaced := replaceDice(input)
	replaced = replaceFortune(replaced)
	replaced = replaceWho(game, replaced)
	replaced = replaceOr(replaced)
	return replaced
}

// [2d6]を5(1,4)[2d6]に置換する
func replaceDice(s string) string {
	rep := regexp.MustCompile(diceRegex)
	result := rep.FindStringSubmatch(s)
	if len(result) != 3 {
		return s
	}
	diceNum, err := strconv.Atoi(result[1])
	if err != nil || diceNum <= 0 {
		return s
	}
	diceSize, err := strconv.Atoi(result[2])
	if err != nil || diceSize <= 0 {
		return s
	}
	var sum int
	var diceResults []string
	for i := 0; i < diceNum; i++ {
		num := rand.Int31n(int32(diceSize)) + 1
		sum += int(num)
		diceResults = append(diceResults, strconv.Itoa(int(num)))
	}
	if diceNum == 1 {
		return fmt.Sprintf("%d%s",
			sum,
			result[0],
		)
	} else {
		return fmt.Sprintf("%d(%s)%s",
			sum,
			strings.Join(diceResults, ","),
			result[0],
		)
	}
}

// [fortune]を99[fortune]に置換する（1~100）
func replaceFortune(s string) string {
	rep := regexp.MustCompile(fortuneRegex)
	result := rep.FindStringSubmatch(s)
	if len(result) <= 0 {
		return s
	}
	num := rand.Int31n(int32(99)) + 1
	return fmt.Sprintf("%s%s",
		strconv.Itoa(int(num)),
		result[0],
	)
}

func replaceOr(s string) string {
	// fortuneを分割したくないので、いったんfortuneを使われなさそうな文字列に変換する
	input := strings.ReplaceAll(s, "fortune", "fOrTuNe")
	rep := regexp.MustCompile(orRegex)
	result := rep.FindStringSubmatch(input)
	if len(result) < 2 {
		return s
	}
	candidates := strings.Split(result[1], "or")
	selected := candidates[rand.Intn(len(candidates))]
	// fortuneを元に戻す
	selected = strings.ReplaceAll(selected, "fOrTuNe", "fortune")
	return fmt.Sprintf("%s%s", selected, s)
}

// [who]をなまえ[who]に置換する
func replaceWho(game model.Game, s string) string {
	rep := regexp.MustCompile(whoRegex)
	result := rep.FindStringSubmatch(s)
	if len(result) <= 0 {
		return s
	}
	if len(game.Participants.List) <= 0 {
		return s
	}
	candidates := array.Map(game.Participants.List, func(p model.GameParticipant) string {
		return p.Name
	})

	idx := rand.Int31n(int32(len(candidates)))
	name := candidates[idx]
	return fmt.Sprintf("%s%s",
		name,
		result[0],
	)
}

func shouldIncludeMonologue(
	query model.MessagesQuery,
	requestMessageTypes []model.MessageType,
	myself *model.GameParticipant,
) bool {
	// 既に独り言が取得対象になっていたら不要
	if query.Types == nil || array.Any(*query.Types, func(mt model.MessageType) bool {
		return mt == model.MessageTypeMonologue
	}) {
		return false
	}
	// 自分が取得対象になっていなければ不要
	if myself == nil {
		return false
	}
	if query.SenderIDs != nil && array.None(*query.SenderIDs, func(id uint32) bool {
		return id == myself.ID
	}) {
		return false
	}
	// 求めていなければ不要
	if array.None(requestMessageTypes, func(mt model.MessageType) bool {
		return mt == model.MessageTypeMonologue
	}) {
		return false
	}
	return true
}

func shouldIncludeSecret(
	query model.MessagesQuery,
	requestMessageTypes []model.MessageType,
	myself *model.GameParticipant,
) bool {
	// 既に秘話が取得対象になっていたら不要
	if query.Types == nil || array.Any(*query.Types, func(mt model.MessageType) bool {
		return mt == model.MessageTypeSecret
	}) {
		return false
	}
	// 自分が取得対象になっていなければ不要
	if myself == nil {
		return false
	}
	if query.SenderIDs != nil && array.None(*query.SenderIDs, func(id uint32) bool {
		return id == myself.ID
	}) {
		return false
	}
	// 求めていなければ不要
	if array.None(requestMessageTypes, func(mt model.MessageType) bool {
		return mt == model.MessageTypeSecret
	}) {
		return false
	}
	return true
}
