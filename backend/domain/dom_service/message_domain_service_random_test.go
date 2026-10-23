package dom_service

import (
	"chat-role-play/domain/model"
	"strings"
	"testing"
	"time"
)

func TestReplaceRandomKeywordsKeepsText(t *testing.T) {
	game := model.Game{}
	cases := []struct {
		in   string
		want string
	}{
		{"変換なし", "変換なし"},
		{"対応しない]括弧", "対応しない]括弧"},
		{"]]]", "]]]"},
		{"[[[", "[[["},
		{"[ただの括弧]", "[ただの括弧]"},
		{"[[入れ子]の括弧]", "[[入れ子]の括弧]"},
		{"[開いたまま[閉じる]", "[開いたまま[閉じる]"},
	}
	for _, c := range cases {
		if got := replaceRandomKeywords(game, c.in); got != c.want {
			t.Errorf("replaceRandomKeywords(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestReplaceRandomKeywordsReplacesKeywords(t *testing.T) {
	game := model.Game{}
	game.Participants.List = []model.GameParticipant{{Name: "アリス"}}
	got := replaceRandomKeywords(game, "[who]は[AorA]で[1d1]")
	if got != "アリス[who]はA[AorA]で1[1d1]" {
		t.Errorf("got %q", got)
	}
	// 内側から置換される
	got = replaceRandomKeywords(game, "[[1d1]or[1d1]]")
	if got != "1[1d1][1[1d1]or1[1d1]]" {
		t.Errorf("got %q", got)
	}
}

// 本文の上限 (1000 文字) の入力で、処理が一瞬で終わり、結果も伸びすぎないこと
func TestReplaceRandomKeywordsWorstCase(t *testing.T) {
	game := model.Game{}
	inputs := map[string]string{
		"閉じ括弧だけ":    strings.Repeat("]", model.MessageTextMaxLength),
		"開き括弧と閉じ括弧": strings.Repeat("[", 500) + strings.Repeat("]", 500),
		"or の入れ子":   strings.Repeat("[", 200) + "AorB" + strings.Repeat("or]", 198) + "or]]",
		"交互":        strings.Repeat("[]", 500),
	}
	for name, in := range inputs {
		start := time.Now()
		got := replaceRandomKeywords(game, in)
		elapsed := time.Since(start)
		if elapsed > time.Second {
			t.Errorf("%s: took %s", name, elapsed)
		}
		if n := len([]rune(got)); n > maxReplacedTextLength+len([]rune(in)) {
			t.Errorf("%s: result too long (%d)", name, n)
		}
	}
}
