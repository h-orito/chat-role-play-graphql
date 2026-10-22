package model

import (
	"chat-role-play/util/array"
	"encoding/json"
	"regexp"
)

// gameThemeKeys はゲームのテーマ (配色) に指定できる項目。画面の Theme 型 (frontend/src/components/theme/theme.ts) と同じ。
var gameThemeKeys = map[string][]string{
	"base":         {"text", "link", "background", "border"},
	"sidebar":      {"text", "background", "hover"},
	"primary":      {"text", "border", "background", "active"},
	"secondary":    {"text", "border", "background", "active"},
	"warning":      {"text", "border", "background", "active"},
	"danger":       {"text", "border", "background", "active"},
	"notification": {"text", "border", "background", "active"},
}

var themeColorRegex = regexp.MustCompile(`^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$`)

// AssertGameTheme はゲームのテーマが、決まった項目に色 (#rgb / #rrggbb など) だけを指定した JSON か確認する。
// 未指定 (nil・空文字) は既定のテーマを使うので問題ない。
func AssertGameTheme(theme *string) error {
	if theme == nil || *theme == "" {
		return nil
	}
	invalid := NewErrBusiness("テーマの指定が正しくありません")
	var groups map[string]map[string]string
	if err := json.Unmarshal([]byte(*theme), &groups); err != nil {
		return invalid
	}
	for groupName, colors := range groups {
		keys, ok := gameThemeKeys[groupName]
		if !ok {
			return invalid
		}
		for key, color := range colors {
			isKnownKey := array.Any(keys, func(k string) bool { return k == key })
			if !isKnownKey || !themeColorRegex.MatchString(color) {
				return invalid
			}
		}
	}
	return nil
}
