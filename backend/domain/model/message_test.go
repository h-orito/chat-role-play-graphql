package model_test

import (
	"chat-role-play/domain/model"
	"strings"
	"testing"
)

func TestAssertMessageText(t *testing.T) {
	cases := []struct {
		name string
		text string
		ok   bool
	}{
		{"空", "", true},
		{"上限ちょうど (全角)", strings.Repeat("あ", model.MessageTextMaxLength), true},
		{"上限ちょうど (絵文字)", strings.Repeat("🐺", model.MessageTextMaxLength), true},
		{"上限超え", strings.Repeat("a", model.MessageTextMaxLength+1), false},
	}
	for _, c := range cases {
		err := model.AssertMessageText(c.text)
		if c.ok && err != nil {
			t.Errorf("%s: unexpected error %v", c.name, err)
		}
		if !c.ok && err == nil {
			t.Errorf("%s: want error", c.name)
		}
	}
}
