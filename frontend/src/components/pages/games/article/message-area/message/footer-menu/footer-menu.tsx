import { Game, GameParticipant, MessagesQuery } from '@/lib/generated/graphql'
import { MutableRefObject } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import TalkButton, { TalkButtonRefHandle } from './talk-button'
import DescriptionButton from './description-button'
import { MessagesAreaRefHandle } from '../messages-area'

type Props = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
  canTalk: boolean
  talkButtonRef: MutableRefObject<TalkButtonRefHandle>
  messagesAreaRef: MutableRefObject<MessagesAreaRefHandle>
}

const FooterMenu = (props: Props) => {
  const { game, myself, search, canTalk, talkButtonRef, messagesAreaRef } =
    props

  return (
    <div className='base-border flex w-full border-t text-sm'>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={messagesAreaRef.current.scrollToTop}
        >
          <ArrowUpIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最上部へ</span>
        </button>
      </div>
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={messagesAreaRef.current.scrollToBottom}
        >
          <ArrowDownIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>最下部へ</span>
        </button>
      </div>
      {canTalk && (
        <>
          <DescriptionButton game={game} myself={myself!} search={search} />
          <TalkButton
            game={game}
            myself={myself!}
            search={search}
            ref={talkButtonRef}
          />
        </>
      )}
    </div>
  )
}

export default FooterMenu
