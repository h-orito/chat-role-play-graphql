import Portal from '@/components/modal/portal'
import Panel from '@/components/panel/panel'
import { MessagesQuery } from '@/lib/generated/graphql'
import { memo, useEffect, useRef } from 'react'
import { useFixedPanel } from '@/components/hooks/use-fixed-panel'
import { useGameValue, useMyPlayerValue } from '../../../game-hook'
import Talk from '../../../talk/talk'
import TalkDescription from '../../../talk/talk-description'
import TalkSystem from '../../../talk/talk-system'
import { useTalkPanel } from '../../../talk/use-talk-panel'

type TalkAreaProps = {
  canTalk: boolean
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

const TalkArea = memo((props: TalkAreaProps) => {
  const { canTalk, search, talkAreaId } = props

  if (!canTalk) return <></>

  return (
    <div id={talkAreaId} className='base-border w-full border-t text-sm'>
      <TalkPanel search={search} talkAreaId={talkAreaId} />
      <DescriptionPanel talkAreaId={talkAreaId} search={search} />
      <SystemMessagePanel talkAreaId={talkAreaId} search={search} />
    </div>
  )
})
TalkArea.displayName = 'TalkArea'

export default TalkArea

type TalkPanelProps = {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}

const TalkPanel = ({ search, talkAreaId }: TalkPanelProps) => {
  const { isOpen, toggle, replyTarget } = useTalkPanel()
  const panelWrapperRef = useRef<HTMLDivElement>(null)
  const { isFixed, toggleFixed } = useFixedPanel()

  // リプライ時にスクロール
  useEffect(() => {
    if (replyTarget) {
      panelWrapperRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [replyTarget])

  const handleTalkCompleted = () => {
    search()
  }

  const panel = (
    <div ref={panelWrapperRef}>
      <Panel
        header='発言'
        isOpen={isOpen}
        onToggle={toggle}
        toggleFixed={toggleFixed}
        isFixed={isFixed}
      >
        <Talk handleCompleted={handleTalkCompleted} talkAreaId={talkAreaId} />
      </Panel>
    </div>
  )

  if (!isFixed) {
    return <div className='m-4'>{panel}</div>
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          {panel}
        </div>
      </Portal>
    )
  }
}

const DescriptionPanel = ({
  search,
  talkAreaId
}: {
  search: (query?: MessagesQuery) => void
  talkAreaId: string
}) => {
  const { isFixed, toggleFixed } = useFixedPanel()

  const handleDescriptionCompleted = () => {
    search()
  }

  const panel = (
    <Panel header='ト書き' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkDescription
        handleCompleted={handleDescriptionCompleted}
        talkAreaId={talkAreaId}
      />
    </Panel>
  )

  if (!isFixed) {
    return <div className='m-4'>{panel}</div>
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          {panel}
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
  const { isFixed, toggleFixed } = useFixedPanel()

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

  if (!isGameMaster || !canModify) return <></>

  const panel = (
    <Panel header='GM発言' toggleFixed={toggleFixed} isFixed={isFixed}>
      <TalkSystem handleCompleted={handleCompleted} talkAreaId={talkAreaId} />
    </Panel>
  )

  if (!isFixed) {
    return <div className='m-4'>{panel}</div>
  } else {
    return (
      <Portal target={`#${talkAreaId}-fixed`}>
        <div className='max-h-[40vh] overflow-y-scroll md:max-h-full md:overflow-y-hidden'>
          {panel}
        </div>
      </Portal>
    )
  }
}
