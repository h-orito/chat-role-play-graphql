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
	AssertRegisterMessage(game model.Game, player model.Player, message model.Message) error
	AssertRegisterDirectMessage(game model.Game, player model.Player, message model.DirectMessage) error
	GetViewableMessageTypes(game model.Game, authorities []model.PlayerAuthority) []model.MessageType
	ReplaceRandomMessageText(game model.Game, message model.MessageContent) (model.MessageContent, error)
}

type messageDomainService struct {
}

// AssertRegisterDirectMessage implements MessageDomainService.
func (*messageDomainService) AssertRegisterDirectMessage(game model.Game, player model.Player, message model.DirectMessage) error {
	if !message.Type.IsSystem() && !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}

// AssertRegisterMessage implements MessageDomainService.
func (*messageDomainService) AssertRegisterMessage(
	game model.Game,
	player model.Player,
	message model.Message,
) error {
	if !message.Type.IsSystem() && !game.Status.IsNotFinished() {
		return fmt.Errorf("game is not in progress")
	}
	return nil
}

// GetViewableMessageTypes implements MessageDomainService.
func (*messageDomainService) GetViewableMessageTypes(game model.Game, authorities []model.PlayerAuthority) []model.MessageType {
	// 管理者またはエピローグを迎えていたら全部見られる
	if game.Status.ShouldSpoiler() || array.Any(authorities, func(a model.PlayerAuthority) bool {
		return a.IsAdmin()
	}) {
		return model.MessageTypeValues()
	}
	return model.MesssageTypeEveryoneViewableValues()
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

func NewMessageDomainService() MessageDomainService {
	return &messageDomainService{}
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
		num := rand.Int31n(int32(diceSize-1)) + 1
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
