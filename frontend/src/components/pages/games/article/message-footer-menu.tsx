import { Message, MessagesQuery } from '@/lib/generated/graphql'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import Talk, { TalkRefHandle } from '@/components/pages/games/talk/talk'
import TalkDescription, {
  TalkDescriptionRefHandle
} from '../talk/talk-description'
import { useGameValue, useMyselfValue } from '../../games_new/game-hook'

type Props = {
  className?: string
  search: (query?: MessagesQuery) => void
  scrollToTop: () => void
  scrollToBottom: () => void
}

export interface MessageFooterMenuRefHandle {
  reply: (message: Message) => void
}

const MessageFooterMenu = forwardRef<MessageFooterMenuRefHandle, Props>(
  (props: Props, ref: any) => {
    const game = useGameValue()
    const myself = useMyselfValue()
    const talkAreaRef = useRef({} as TalkAreaRefHandle)

    useImperativeHandle(ref, () => ({
      reply(message: Message) {
        talkAreaRef.current.reply(message)
      }
    }))

    const toggleNormalTalk = () => talkAreaRef.current.toggleNormalTalk()
    const toggleDescriptionTalk = () =>
      talkAreaRef.current.toggleDescriptionTalk()

    const canTalk =
      !!myself &&
      ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
        game.status
      )

    return (
      <div className={props.className}>
        <TalkArea {...props} ref={talkAreaRef} canTalk={canTalk} />
        <FooterMenu
          {...props}
          canTalk={canTalk}
          toggleNormalTalk={toggleNormalTalk}
          toggleDescriptionTalk={toggleDescriptionTalk}
        />
      </div>
    )
  }
)

export default MessageFooterMenu

interface TalkAreaRefHandle {
  toggleNormalTalk: () => void
  toggleDescriptionTalk: () => void
  reply: (message: Message) => void
}

const TalkArea = forwardRef<TalkAreaRefHandle, Props & { canTalk: boolean }>(
  (props: Props & { canTalk: boolean }, ref: any) => {
    const { search } = props

    const [isShowNormalTalk, setIsShowNormalTalk] = useState(false)
    const [isShowDescriptionTalk, setIsShowDescriptionTalk] = useState(false)

    const talkRef = useRef({} as TalkRefHandle)
    const descriptionTalkRef = useRef({} as TalkDescriptionRefHandle)

    useImperativeHandle(ref, () => ({
      toggleNormalTalk() {
        toggleTalkArea()
      },
      toggleDescriptionTalk() {
        toggleDescriptionTalkArea()
      },
      reply(message: Message) {
        setIsShowNormalTalk(true)
        talkRef.current.replyTo(message)
      }
    }))

    const toggleTalkArea = () => {
      setIsShowDescriptionTalk(false)
      setIsShowNormalTalk((current) => !current)
    }

    const toggleDescriptionTalkArea = () => {
      setIsShowNormalTalk(false)
      setIsShowDescriptionTalk((current) => !current)
    }

    const handleTalkCompleted = () => {
      setIsShowNormalTalk(false)
      search()
    }
    const handleDescriptionCompleted = () => {
      setIsShowDescriptionTalk(false)
      search()
    }

    if (!props.canTalk) return <></>

    return (
      <div className='base-border w-full border-t text-sm'>
        <div className={isShowNormalTalk ? '' : 'hidden'}>
          <Talk
            {...props}
            handleCompleted={handleTalkCompleted}
            ref={talkRef}
          />
        </div>
        <div className={isShowDescriptionTalk ? '' : 'hidden'}>
          <TalkDescription
            handleCompleted={handleDescriptionCompleted}
            ref={descriptionTalkRef}
          />
        </div>
      </div>
    )
  }
)

const FooterMenu = (
  props: Props & {
    canTalk: boolean
    toggleNormalTalk: () => void
    toggleDescriptionTalk: () => void
  }
) => {
  const {
    canTalk,
    scrollToTop,
    scrollToBottom,
    toggleNormalTalk,
    toggleDescriptionTalk
  } = props

  const handleTalkClick = () => {
    toggleNormalTalk()
  }

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
        <>
          <div className='flex flex-1 text-center'>
            <button
              className='sidebar-background flex w-full justify-center px-4 py-2'
              onClick={toggleDescriptionTalk}
            >
              <DocumentTextIcon className='h-5 w-5' />
              <span className='my-auto ml-1 hidden text-xs md:block'>
                ト書き
              </span>
            </button>
          </div>
          <div className='flex flex-1 text-center'>
            <button
              className='sidebar-background flex w-full justify-center px-4 py-2'
              onClick={handleTalkClick}
            >
              <PencilSquareIcon className='h-5 w-5' />
              <span className='my-auto ml-1 hidden text-xs md:block'>発言</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
