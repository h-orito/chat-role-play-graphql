import { iso2display } from '@/components/util/datetime/datetime'
import { Game } from '@/lib/generated/graphql'

type GameSettingsProps = {
  close: (e: any) => void
  game: Game
}

type SettingItem = {
  name: string
  value: string
}

export default function GameSettings({ close, game }: GameSettingsProps) {
  const settings = game.settings
  const items: Array<SettingItem> = []
  items.push({
    name: '利用可能なキャラチップ',
    value:
      settings.chara.charachips.length > 0
        ? settings.chara.charachips.map((c) => c.name).join('、')
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
  items.push({
    name: 'ゲーム内期間',
    value: `${settings.time.periodPrefix ?? ''}1${
      settings.time.periodSuffix ?? ''
    }, ${settings.time.periodPrefix ?? ''}2${
      settings.time.periodSuffix ?? ''
    },..`
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
