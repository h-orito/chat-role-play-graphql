import Portal from '@/components/modal/portal'
import Panel, { PanelRefHandle } from '@/components/panel/panel'
import { Message, MessagesQuery } from '@/lib/generated/graphql'
import { memo, forwardRef, useRef, useImperativeHandle, useState } from 'react'
import {
  useFixedBottom,
  useGameValue,
  useMyPlayerValue
} from '../../../game-hook'
import Talk, { TalkRefHandle } from '../../../talk/talk'
import TalkDescription from '../../../talk/talk-description'
import TalkSystem from '../../../talk/talk-system'

type TalkAreaProps = {
  canTalk: boolean
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

export interface TalkAreaRefHandle {
  reply: (message: Message) => void
}

const TalkArea = memo(
  forwardRef<TalkAreaRefHandle, TalkAreaProps>(
    (props: TalkAreaProps, ref: any) => {
      const { canTalk, search, talkAreaId } = props
      const talkPanelRef = useRef({} as TalkAreaRefHandle)

      useImperativeHandle(ref, () => ({
        reply(message: Message) {
          talkPanelRef.current.reply(message)
        }
      }))

      if (!canTalk) return <></>

      return (
        <div id={talkAreaId} className='base-border w-full border-t text-sm'>
          <TalkPanel
            search={search}
            talkAreaId={talkAreaId}
            ref={talkPanelRef}
          />
          <DescriptionPanel talkAreaId={talkAreaId} search={search} />
          <SystemMessagePanel talkAreaId={talkAreaId} search={search} />
        </div>
      )
    }
  )
)

export default TalkArea

type TalkPanelProps = {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

const TalkPanel = forwardRef<TalkAreaRefHandle, TalkPanelProps>(
  (props: TalkPanelProps, ref: any) => {
    const { search, talkAreaId } = props
    const talkRef = useRef({} as TalkRefHandle)
    const panelRef = useRef({} as PanelRefHandle)
    const panelWrapperRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      reply(message: Message) {
        panelRef.current.open()
        talkRef.current.replyTo(message)
        panelWrapperRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }))

    const handleTalkCompleted = () => {
      search()
    }

    const [isFixed, setIsFixed] = useState(false)
    const otherFixedCanceler = useFixedBottom()
    const toggleFixed = (e: any) => {
      if (!isFixed) {
        otherFixedCanceler(() => setIsFixed(false))
      }
      setIsFixed((current) => !current)
      e.stopPropagation()
    }

    const PanelComponent = () => (
      <div ref={panelWrapperRef}>
        <Panel
          header='発言'
          ref={panelRef}
          toggleFixed={toggleFixed}
          isFixed={isFixed}
        >
          <Talk
            handleCompleted={handleTalkCompleted}
            talkAreaId={talkAreaId}
            ref={talkRef}
          />
        </Panel>
      </div>
    )

    if (!isFixed) {
      return (
        <div className='m-4'>
          <PanelComponent />
        </div>
      )
    } else {
      return (
        <Portal target={`#${talkAreaId}-fixed`}>
          <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
            <PanelComponent />
          </div>
        </Portal>
      )
    }
  }
)

const DescriptionPanel = ({
  search,
  talkAreaId
}: {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}) => {
  const handleDescriptionCompleted = () => {
    search()
  }

  const [isFixed, setIsFixed] = useState(false)
  const otherFixedCanceler = useFixedBottom()
  const toggleFixed = (e: any) => {
    if (!isFixed) {
      otherFixedCanceler(() => setIsFixed(false))
    }
    setIsFixed((current) => !current)
    e.stopPropagation()
  }

  const PanelComponent = () => (
    <Panel header='ト書き' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkDescription
        handleCompleted={handleDescriptionCompleted}
        talkAreaId={talkAreaId}
      />
    </Panel>
  )

  if (!isFixed) {
    return (
      <div className='m-4'>
        <PanelComponent />
      </div>
    )
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          <PanelComponent />
        </div>
      </Portal>
    )
  }
}

const SystemMessagePanel = ({
  search,
  talkAreaId
}: {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}) => {
  const game = useGameValue()
  const myPlayer = useMyPlayerValue()

  const isGameMaster =
    myPlayer?.authorityCodes.includes('AuthorityAdmin') ||
    game.gameMasters.some((gm) => gm.player.id === myPlayer?.id)

  const canModify = [
    'Closed',
    'Opening',
    'Recruiting',
    'Progress',
    'Epilogue'
  ].includes(game.status)

  const handleCompleted = () => {
    search()
  }

  const [isFixed, setIsFixed] = useState(false)
  const otherFixedCanceler = useFixedBottom()
  const toggleFixed = (e: any) => {
    if (!isFixed) {
      otherFixedCanceler(() => setIsFixed(false))
    }
    setIsFixed((current) => !current)
    e.stopPropagation()
  }

  if (!isGameMaster || !canModify) return <></>

  const PanelComponent = () => (
    <Panel header='GM発言' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkSystem handleCompleted={handleCompleted} talkAreaId={talkAreaId} />
    </Panel>
  )

  if (!isFixed) {
    return (
      <div className='m-4'>
        <PanelComponent />
      </div>
    )
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          <PanelComponent />
        </div>
      </Portal>
    )
  }
}
