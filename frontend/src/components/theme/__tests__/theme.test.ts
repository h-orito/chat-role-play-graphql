import { describe, expect, it } from 'vitest'
import { convertThemeToCSS, lightTheme, parseGameTheme } from '../theme'

describe('parseGameTheme', () => {
  it('未指定ならライトテーマ', () => {
    expect(parseGameTheme(null)).toEqual(lightTheme)
    expect(parseGameTheme('')).toEqual(lightTheme)
  })

  it('画面で作られたテーマはそのまま使う', () => {
    const theme = {
      ...lightTheme,
      base: { ...lightTheme.base, text: '#123456', background: '#000' }
    }
    expect(parseGameTheme(JSON.stringify(theme))).toEqual(theme)
  })

  it('JSON でなければライトテーマ', () => {
    expect(parseGameTheme('{')).toEqual(lightTheme)
    expect(parseGameTheme('null')).toEqual(lightTheme)
  })

  it('足りない項目はライトテーマの色で補う', () => {
    const theme = parseGameTheme(JSON.stringify({ base: { text: '#fff' } }))
    expect(theme.base).toEqual({ ...lightTheme.base, text: '#fff' })
    expect(theme.notification).toEqual(lightTheme.notification)
  })

  it('色でない値があればテーマ全体をライトテーマにする', () => {
    for (const value of [
      'red}body{display:none',
      'url(https://example.com)',
      1
    ]) {
      const theme = parseGameTheme(
        JSON.stringify({ base: { text: '#fff', background: value } })
      )
      expect(theme).toEqual(lightTheme)
      const css = convertThemeToCSS(theme)
      expect(css).not.toContain('display:none')
      expect(css).not.toContain('url(')
    }
  })

  it('グループがオブジェクトでなければライトテーマ', () => {
    expect(parseGameTheme(JSON.stringify({ base: '#fff' }))).toEqual(lightTheme)
    expect(parseGameTheme(JSON.stringify([1]))).toEqual(lightTheme)
  })

  it('知らない項目は無視する', () => {
    const theme = parseGameTheme(
      JSON.stringify({ base: { text: '#fff', font: 'x' }, extra: { a: 'b' } })
    )
    expect(theme.base).toEqual({ ...lightTheme.base, text: '#fff' })
    expect(theme).not.toHaveProperty('extra')
  })
})
