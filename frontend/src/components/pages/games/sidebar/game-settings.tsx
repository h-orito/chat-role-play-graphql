import { Game } from '@/lib/generated/graphql'

type GameSettingsProps = {
  close: (e: any) => void
  game: Game
}

export default function GameSettings({ close, game }: GameSettingsProps) {
  const submit = (e: any) => {
    e.preventDefault()
    // いろいろな処理
    close(e)
  }
  return (
    <div>
      <p>ゲーム設定をここに表示</p>
      <button onClick={close}>とじる</button>
    </div>
  )
}
