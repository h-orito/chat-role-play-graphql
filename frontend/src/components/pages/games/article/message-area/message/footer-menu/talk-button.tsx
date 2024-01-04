import {
  Game,
  GameParticipant,
  Message,
  MessagesQuery
} from '@/lib/generated/graphql'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from '@/components/modal/modal'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Talk, { TalkRefHandle } from '../../../../talk/talk'

type Props = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
}

export interface TalkButtonRefHandle {
  reply: (message: Message) => void
}

const TalkButton = forwardRef<TalkButtonRefHandle, Props>(
  (props: Props, ref: any) => {
    const { game, myself, search } = props
    const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
    const talkRef = useRef({} as TalkRefHandle)
    const toggleTalkModal = (e: any) => {
      if (e.target === e.currentTarget) {
        const shouldWarning =
          talkRef.current && talkRef.current.shouldWarnClose()
        if (
          shouldWarning &&
          !window.confirm('発言内容が失われますが、閉じてよろしいですか？')
        )
          return
        closeModal()
      }
    }
    const closeModal = () => {
      setIsOpenTalkModal(false)
      setReplyTarget(null)
    }
    const [replyTarget, setReplyTarget] = useState<Message | null>(null)
    useImperativeHandle(ref, () => ({
      reply(message: Message) {
        setReplyTarget(message)
        setIsOpenTalkModal(true)
      }
    }))
    return (
      <div className='flex flex-1 text-center'>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={() => setIsOpenTalkModal(true)}
        >
          <PencilSquareIcon className='h-5 w-5' />
          <span className='my-auto ml-1 hidden text-xs md:block'>発言</span>
        </button>
        {isOpenTalkModal && (
          <Modal close={toggleTalkModal} hideFooter>
            <Talk
              game={game}
              myself={myself!}
              closeWithoutWarning={() => closeModal()}
              search={search}
              replyTarget={replyTarget}
              ref={talkRef}
            />
          </Modal>
        )}
      </div>
    )
  }
)

export default TalkButton
