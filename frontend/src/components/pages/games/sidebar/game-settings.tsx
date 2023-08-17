import { base64ToId } from '@/components/graphql/convert'
import { iso2display } from '@/components/util/datetime/datetime'
import { Game } from '@/lib/generated/graphql'
import Link from 'next/link'
import React from 'react'

type GameSettingsProps = {
  close: (e: any) => void
  game: Game
}

type SettingItem = {
  name: string
  value: React.ReactNode
}

export default function GameSettings({ close, game }: GameSettingsProps) {
  const settings = game.settings
  const items: Array<SettingItem> = []
  items.push({
    name: 'ゲームマスター',
    value: game.gameMasters.map((gm) => gm.player.name).join('、')
  })
  items.push({
    name: '利用可能なキャラチップ',
    value:
      settings.chara.charachips.length > 0
        ? settings.chara.charachips.map((c, idx) => {
            return (
              <span key={idx}>
                {idx !== 0 && <span>、</span>}
                <Link
                  className='text-blue-500'
                  href={`/charachips/${base64ToId(c.id)}`}
                  target='_blank'
                >
                  {c.name}
                </Link>
              </span>
            )
          })
        : 'なし'
  })
  items.push({
    name: 'オリジナルキャラクターの登録',
    value: settings.chara.canOriginalCharacter ? '可能' : '不可'
  })
  items.push({
    name: '人数',
    value: `${settings.capacity.min} - ${settings.capacity.max}人`
  })

  const prefix = settings.time.periodPrefix ?? ''
  const suffix = settings.time.periodSuffix ?? ''
  const interval = settings.time.periodIntervalSeconds
  const intervalDays = Math.floor(interval / 60 / 60 / 24)
  const intervalHours = Math.floor((interval / 60 / 60) % 24)
  const intervalMinutes = (interval / 60) % 60
  const intervalDaysText = `${intervalDays == 0 ? '' : intervalDays + '日'}`
  const intervalHoursText = `${
    intervalHours == 0 ? '' : intervalHours + '時間'
  }`
  const intervalMinutesText = `${
    intervalMinutes == 0 ? '' : intervalMinutes + '分'
  }`
  const intervalText = `${intervalDaysText}${intervalHoursText}${intervalMinutesText}`

  items.push({
    name: 'ゲーム内期間',
    value: `${prefix}1${suffix}, ${prefix}2${suffix},..（${intervalText}毎更新）`
  })
  items.push({
    name: '公開',
    value: iso2display(settings.time.openAt)
  })
  items.push({
    name: '登録開始',
    value: iso2display(settings.time.startParticipateAt)
  })
  items.push({
    name: 'ゲーム開始',
    value: iso2display(settings.time.startGameAt)
  })
  items.push({
    name: 'エピローグ開始',
    value: iso2display(settings.time.epilogueGameAt)
  })
  items.push({
    name: 'ゲーム終了',
    value: iso2display(settings.time.finishGameAt)
  })
  items.push({
    name: 'ダイレクトメッセージ',
    value: settings.rule.canSendDirectMessage ? '可能' : '不可'
  })
  items.push({
    name: 'ゲーム参加パスワード',
    value: settings.password.hasPassword ? 'あり' : 'なし'
  })
  return (
    <div>
      <table className='table-auto border border-gray-300'>
        <thead>
          <tr className='bg-blue-200'>
            <th className='border border-gray-300 p-2 text-left'>項目</th>
            <th className='border border-gray-300 p-2'>設定</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: SettingItem) => {
            return (
              <tr key={item.name}>
                <td className='border border-gray-300 p-2'>{item.name}</td>
                <td className='whitespace-pre-wrap break-words border border-gray-300 p-2 text-left'>
                  {item.value}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
