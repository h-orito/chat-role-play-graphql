import { Game } from '@/lib/generated/graphql'

type SidebarProps = {
  game: Game
}

export default function Sidebar({ game }: SidebarProps) {
  return (
    <nav className=''>
      <h1 className='text-xl font-bold'>{game.name}</h1>
      <div>参加者</div>
      <div>ゲーム設定</div>
    </nav>
  )
}
