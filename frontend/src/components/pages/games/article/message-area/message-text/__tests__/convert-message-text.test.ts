import { describe, expect, it } from 'vitest'
import { convertMessageText } from '../convert-message-text'

// 書き換え前の正規表現による変換 (結果が変わっていないことの確認用)
const legacyTargets: Array<[RegExp, string]> = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#039;'],
  [/\[b\]([\s\S]*?)\[\/b\]/g, `<strong>$1</strong>`],
  [
    /\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]([\s\S]*?)\[\/#\]/g,
    `<span style="color: #$1;">$2</span>`
  ],
  [/\[i\]([\s\S]*?)\[\/i\]/g, `<em>$1</em>`],
  [/\[u\]([\s\S]*?)\[\/u\]/g, `<u>$1</u>`],
  [/\[s\]([\s\S]*?)\[\/s\]/g, `<s>$1</s>`],
  [/\[sup\]([\s\S]*?)\[\/sup\]/g, `<sup>$1</sup>`],
  [/\[sub\]([\s\S]*?)\[\/sub\]/g, `<sub>$1</sub>`],
  [/\[small\]([\s\S]*?)\[\/small\]/g, `<small>$1</small>`],
  [
    /\[large\]([\s\S]*?)\[\/large\]/g,
    `<span style="font-size: 150%;">$1</span>`
  ],
  [/\[huge\]([\s\S]*?)\[\/huge\]/g, `<span style="font-size: 200%;">$1</span>`],
  [
    /\[kusodeka\]([\s\S]*?)\[\/kusodeka\]/g,
    `<span style="font-size: 250%;">$1</span>`
  ],
  [
    /\[ruby\]([\s\S]*?)\[rt\]([\s\S]*?)\[\/rt\]\[\/ruby\]/g,
    `<ruby>$1<rt>$2</rt></ruby>`
  ],
  [/(\[\dd\d{1,5}\])/g, `<strong><small>$1</small></strong>`],
  [/(\[.*or.*\])/g, `<strong><small>$1</small></strong>`],
  [/(\[who])/g, `<strong><small>$1</small></strong>`]
]
const legacyConvert = (text: string) =>
  legacyTargets.reduce((t, [regex, replace]) => t.replace(regex, replace), text)

const tokens = [
  '[b]',
  '[/b]',
  '[i]',
  '[/i]',
  '[u]',
  '[/u]',
  '[s]',
  '[/s]',
  '[sup]',
  '[/sup]',
  '[sub]',
  '[/sub]',
  '[small]',
  '[/small]',
  '[large]',
  '[/large]',
  '[huge]',
  '[/huge]',
  '[kusodeka]',
  '[/kusodeka]',
  '[#f00]',
  '[#00ff00]',
  '[#12]',
  '[/#]',
  '[ruby]',
  '[rt]',
  '[/rt]',
  '[/ruby]',
  '[/rt][/ruby]',
  '[2d6]',
  '7(3,4)[2d6]',
  '[who]',
  'or',
  '[AorB]',
  '[',
  ']',
  '#',
  '/',
  'a',
  'あ',
  ' ',
  '\n',
  '\r\n',
  '\u2028',
  '<',
  '>',
  '&',
  '"',
  "'",
  '$1',
  '$&',
  'color'
]

// 乱数の種を固定した簡易な疑似乱数 (再現性のため)
const random = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

describe('convertMessageText', () => {
  it('書き換え前の正規表現と同じ結果になる (ランダムな入力)', () => {
    const rand = random(42)
    for (let i = 0; i < 30000; i++) {
      const length = Math.floor(rand() * 20)
      let text = ''
      for (let j = 0; j < length; j++) {
        text += tokens[Math.floor(rand() * tokens.length)]
      }
      expect(convertMessageText(text), JSON.stringify(text)).toBe(
        legacyConvert(text)
      )
    }
  })

  it.each([
    ['[b]太字[/b]と[i]斜体[/i]'],
    ['[#f00]赤[/#][#00ff00]緑[/#]'],
    ['[ruby]漢字[rt]かんじ[/rt][/ruby]'],
    ['[ruby][b]漢字[/b][rt]かんじ[/rt][/ruby]'],
    ['7(3,4)[2d6] 99[fortune] AAA[AAAorBBBorCCC] 太郎[who]'],
    ['[b]閉じない[b]二重[/b]'],
    ['<script>alert("x")</script>']
  ])('書き換え前の正規表現と同じ結果になる: %s', (text) => {
    expect(convertMessageText(text)).toBe(legacyConvert(text))
  })

  it.each([
    ['[ の後に or と ] が無いもの', '[aor'.repeat(5000)],
    ['[ と or だけ', '[or'.repeat(10000)],
    ['閉じない [b]', '[b]'.repeat(10000)],
    ['閉じない [ruby] と [rt]', '[ruby][rt]'.repeat(5000)],
    ['閉じない色', '[#fff]'.repeat(5000)]
  ])('長い本文でもすぐ終わる: %s', (_, text) => {
    const start = performance.now()
    convertMessageText(text)
    expect(performance.now() - start).toBeLessThan(500)
  })
})
