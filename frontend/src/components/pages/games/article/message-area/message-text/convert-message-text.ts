// 発言本文の装飾 ([b]〜[/b] など) を HTML に変換する。
// 正規表現の後戻りで長い本文の処理が極端に遅くならないよう、開始タグ・終了タグを前から順に探して置換する。

type Converter = (text: string) => string

const escapeTargets: Array<[RegExp, string]> = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#039;']
]

const escapeHtml: Converter = (text) =>
  escapeTargets.reduce(
    (converted, [regex, replace]) => converted.replace(regex, replace),
    text
  )

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

// open から、その後ろで最も近い close までを render の結果に置き換える。
// /open([\s\S]*?)close/g で置換するのと同じ結果になる。
const decorate =
  (
    open: string | RegExp,
    close: string,
    render: (inner: string, openMatch: RegExpExecArray) => string
  ): Converter =>
  (text) => {
    const openRegex = new RegExp(
      typeof open === 'string' ? escapeRegExp(open) : open.source,
      'g'
    )
    let result = ''
    let from = 0
    for (;;) {
      openRegex.lastIndex = from
      const openMatch = openRegex.exec(text)
      if (openMatch == null) break
      const innerStart = openMatch.index + openMatch[0].length
      const end = text.indexOf(close, innerStart)
      // ここより後ろに close が無ければ、以降の open にも対応する close は無い
      if (end < 0) break
      result +=
        text.slice(from, openMatch.index) +
        render(text.slice(innerStart, end), openMatch)
      from = end + close.length
    }
    return result + text.slice(from)
  }

const decorateTag = (tag: string, render: (inner: string) => string) =>
  decorate(`[${tag}]`, `[/${tag}]`, render)

// [ruby]本文[rt]ルビ[/rt][/ruby]
// /\[ruby\]([\s\S]*?)\[rt\]([\s\S]*?)\[\/rt\]\[\/ruby\]/g で置換するのと同じ結果になる。
const decorateRuby: Converter = (text) => {
  const open = '[ruby]'
  const separator = '[rt]'
  const close = '[/rt][/ruby]'
  let result = ''
  let from = 0
  for (;;) {
    const start = text.indexOf(open, from)
    if (start < 0) break
    const middle = text.indexOf(separator, start + open.length)
    if (middle < 0) break
    const end = text.indexOf(close, middle + separator.length)
    // ここより後ろに [rt]〜[/rt][/ruby] が無ければ、以降の [ruby] も対応しない
    if (end < 0) break
    result +=
      text.slice(from, start) +
      `<ruby>${text.slice(start + open.length, middle)}<rt>${text.slice(
        middle + separator.length,
        end
      )}</rt></ruby>`
    from = end + close.length
  }
  return result + text.slice(from)
}

// [AorB]
// /(\[.*or.*\])/g で置換するのと同じ結果になる
// (行ごとに、最初の "[" から最後の "]" までを強調する。その間に "or" が必要)。
const decorateOr: Converter = (text) =>
  text.replace(/[^\n\r\u2028\u2029]+/g, (line) => {
    const end = line.lastIndexOf(']')
    if (end < 0) return line
    const or = line.lastIndexOf('or', end - 2)
    if (or < 0) return line
    const start = line.indexOf('[')
    if (start < 0 || start >= or) return line
    return (
      line.slice(0, start) +
      `<strong><small>${line.slice(start, end + 1)}</small></strong>` +
      line.slice(end + 1)
    )
  })

const converters: Array<Converter> = [
  escapeHtml,
  // 文字列装飾
  decorateTag('b', (inner) => `<strong>${inner}</strong>`),
  decorate(
    /\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/,
    '[/#]',
    (inner, openMatch) =>
      `<span style="color: #${openMatch[1]};">${inner}</span>`
  ),
  decorateTag('i', (inner) => `<em>${inner}</em>`),
  decorateTag('u', (inner) => `<u>${inner}</u>`),
  decorateTag('s', (inner) => `<s>${inner}</s>`),
  decorateTag('sup', (inner) => `<sup>${inner}</sup>`),
  decorateTag('sub', (inner) => `<sub>${inner}</sub>`),
  decorateTag('small', (inner) => `<small>${inner}</small>`),
  decorateTag(
    'large',
    (inner) => `<span style="font-size: 150%;">${inner}</span>`
  ),
  decorateTag(
    'huge',
    (inner) => `<span style="font-size: 200%;">${inner}</span>`
  ),
  decorateTag(
    'kusodeka',
    (inner) => `<span style="font-size: 250%;">${inner}</span>`
  ),
  decorateRuby,
  // ランダム変換の結果
  (text) =>
    text.replace(/(\[\dd\d{1,5}\])/g, `<strong><small>$1</small></strong>`),
  decorateOr,
  (text) => text.replace(/(\[who])/g, `<strong><small>$1</small></strong>`)
]

export const convertMessageText = (rawText: string): string =>
  converters.reduce((converted, convert) => convert(converted), rawText)
