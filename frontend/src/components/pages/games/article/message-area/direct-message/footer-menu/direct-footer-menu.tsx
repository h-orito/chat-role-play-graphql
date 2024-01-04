import {
  DirectMessagesQuery,
  Game,
  GameParticipant,
  GameParticipantGroup
} from '@/lib/generated/graphql'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import DirectTalkButton from './direct-talk-button'

type Props = {
  game: Game
  myself: GameParticipant | null
  group: GameParticipantGroup
  search: (query?: DirectMessagesQuery) => Promise<void>
  canTalk: boolean
  scrollToTop: () => void
  scrollToBottom: () => void
}

const DirectFooterMenu = (props: Props) => {
  const { game, myself, group, search, canTalk, scrollToTop, scrollToBottom } =
    props

  return (
    <div className='base-border flex w-full border-t text-sm'>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToTop}
        >
          <ArrowUpIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最上部へ</span>
        </button>
      </div>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={scrollToBottom}
        >
          <ArrowDownIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最下部へ</span>
        </button>
      </div>
      {canTalk && (
        <DirectTalkButton
          game={game}
          myself={myself!}
          search={search}
          group={group}
        />
      )}
    </div>
  )
}

export default DirectFooterMenu
