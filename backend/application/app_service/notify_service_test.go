package app_service

import "testing"

func TestEscapeDiscordMarkdown(t *testing.T) {
	cases := []struct {
		in   string
		want string
	}{
		{"アリス", "アリス"},
		{"@everyone", `\@everyone`},
		{"<@&123>", `\<\@&123\>`},
		{"[click](https://example.com)", `\[click\]\(https\://example.com\)`},
		{"**bold** __u__ ~~s~~ ||spoiler|| `code`", `\*\*bold\*\* \_\_u\_\_ \~\~s\~\~ \|\|spoiler\|\| ` + "\\`code\\`"},
		{"# 見出し", `\# 見出し`},
		{"> 引用", `\> 引用`},
		{`a\*b`, `a\\\*b`},
	}
	for _, c := range cases {
		if got := escapeDiscordMarkdown(c.in); got != c.want {
			t.Errorf("escapeDiscordMarkdown(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}
