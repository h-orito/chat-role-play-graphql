import {
  DirectMessagesQuery,
  Game,
  GameParticipant,
  GameParticipantGroup
} from '@/lib/generated/graphql'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import TalkDirect from '@/components/pages/games/talk/talk-direct'

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
  const directTalkAreaRef = useRef({} as DirectTalkAreaRefHandle)
  const toggleDirectTalk = () => directTalkAreaRef.current.toggleDirectTalk()

  return (
    <>
      {props.myself && <DirectTalkArea {...props} ref={directTalkAreaRef} />}
      <FooterMenu {...props} toggleDirectTalk={toggleDirectTalk} />
    </>
  )
}

export default DirectFooterMenu

interface DirectTalkAreaRefHandle {
  toggleDirectTalk: () => void
}

const DirectTalkArea = forwardRef<DirectTalkAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const { game, myself, group, search } = props

    useImperativeHandle(ref, () => ({
      toggleDirectTalk() {
        toggleOpen()
      }
    }))
    const toggleOpen = () => {
      setIsShow((current) => !current)
    }
    const [isShow, setIsShow] = useState(false)
    const handleCompleted = () => {
      setIsShow(false)
      props.search()
    }

    return (
      <div className='base-border w-full border-t text-sm'>
        <div className={isShow ? '' : 'hidden'}>
          <TalkDirect
            game={game}
            myself={myself!}
            gameParticipantGroup={group!}
            handleCompleted={handleCompleted}
          />
        </div>
      </div>
    )
  }
)

const FooterMenu = (props: Props & { toggleDirectTalk: () => void }) => {
  const { canTalk, scrollToTop, scrollToBottom, toggleDirectTalk } = props

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
      {canTalk && !!props.myself && (
        <div className='flex flex-1 text-center'>
          <button
            className='sidebar-background flex w-full justify-center px-4 py-2'
            onClick={toggleDirectTalk}
          >
            <EnvelopeIcon className='h-5 w-5' />
            <span className='my-auto ml-1 hidden text-xs md:block'>発言</span>
          </button>
        </div>
      )}
    </div>
  )
}
