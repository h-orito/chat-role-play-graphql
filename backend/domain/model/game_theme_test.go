package model_test

import (
	"chat-role-play/domain/model"
	"testing"
)

func TestAssertGameTheme(t *testing.T) {
	// 画面のテーマ編集で作られる形 (lightTheme を JSON にしたもの)
	light := `{"base":{"text":"#374151","link":"#3b82f6","background":"#fff","border":"#d1d5db"},` +
		`"sidebar":{"text":"#374151","background":"#fff","hover":"#e2e8f0"},` +
		`"primary":{"text":"#374151","border":"#3b82f6","background":"#dbeafe","active":"#93c5fd"},` +
		`"secondary":{"text":"#6b7280","border":"#6b7280","background":"#f3f4f6","active":"#d1d5db"},` +
		`"warning":{"text":"#000","border":"#eab308","background":"#fef9c3","active":"#fde047"},` +
		`"danger":{"text":"#000","border":"#ef4444","background":"#fee2e2","active":"#fca5a5"},` +
		`"notification":{"text":"#000","border":"#f3f3f6","background":"#f3f3f6","active":"#eee"}}`
	str := func(s string) *string { return &s }
	cases := []struct {
		name  string
		theme *string
		ok    bool
	}{
		{"未指定", nil, true},
		{"空文字", str(""), true},
		{"画面で作られるテーマ", str(light), true},
		{"一部の項目だけ", str(`{"base":{"text":"#FFFFFF"}}`), true},
		{"透明度つき", str(`{"base":{"text":"#ffffff80","link":"#fff8"}}`), true},
		{"JSON でない", str(`red`), false},
		{"色以外の値", str(`{"base":{"text":"red"}}`), false},
		{"CSS を閉じる値", str(`{"base":{"text":"red}body{display:none"}}`), false},
		{"末尾に余計な文字", str(`{"base":{"text":"#fff;"}}`), false},
		{"知らない項目", str(`{"base":{"font":"#fff"}}`), false},
		{"知らないグループ", str(`{"header":{"text":"#fff"}}`), false},
		{"値が文字列でない", str(`{"base":{"text":1}}`), false},
		{"グループがオブジェクトでない", str(`{"base":"#fff"}`), false},
	}
	for _, c := range cases {
		err := model.AssertGameTheme(c.theme)
		if c.ok && err != nil {
			t.Errorf("%s: unexpected error %v", c.name, err)
		}
		if !c.ok && err == nil {
			t.Errorf("%s: want error", c.name)
		}
	}
}
