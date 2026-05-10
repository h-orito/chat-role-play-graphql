import { GameParticipant, Message, MessageType } from '@/lib/generated/graphql'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useGameValue } from './game-context'

type TalkPanelContextValue = {
  isOpen: boolean
  toggle: () => void
  replyTarget: Message | null
  reply: (message: Message) => void
  cancelReply: () => void
  talkType: MessageType
  setTalkType: (type: MessageType) => void
  receiver: GameParticipant | null
  setReceiver: (receiver: GameParticipant | null) => void
  resetForm: () => void
}

const TalkPanelContext = createContext<TalkPanelContextValue | null>(null)

type Props = {
  children: ReactNode
}

export const TalkPanelProvider = ({ children }: Props) => {
  const game = useGameValue()
  // game.participants は polling で頻繁に更新されるため、reply() の identity を
  // 安定させる目的で ref 経由で参照する（消費側の不要な再レンダーを避けるため）
  const participantsRef = useRef(game.participants)
  useEffect(() => {
    participantsRef.current = game.participants
  }, [game.participants])

  const [isOpen, setIsOpen] = useState(true)
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  const [talkType, setTalkType] = useState<MessageType>(MessageType.TalkNormal)
  const [receiver, setReceiver] = useState<GameParticipant | null>(null)
  // cancelReply の挙動が talkType に依存するため、ref で最新値を参照する
  const talkTypeRef = useRef(talkType)
  useEffect(() => {
    talkTypeRef.current = talkType
  }, [talkType])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  const reply = useCallback((message: Message) => {
    setReplyTarget(message)
    setIsOpen(true)
    const senderId = message.sender?.participantId
    const sender = senderId
      ? participantsRef.current.find((p) => p.id === senderId) ?? null
      : null
    setReceiver(sender)
    if (message.content.type === MessageType.Secret) {
      setTalkType(MessageType.Secret)
    }
  }, [])

  const cancelReply = useCallback(() => {
    setReplyTarget(null)
    // 秘話を継続入力中であれば、返信解除しても receiver は保持する
    if (talkTypeRef.current !== MessageType.Secret) {
      setReceiver(null)
    }
  }, [])

  const resetForm = useCallback(() => {
    setReplyTarget(null)
    setReceiver(null)
    setTalkType(MessageType.TalkNormal)
  }, [])

  const value = useMemo<TalkPanelContextValue>(
    () => ({
      isOpen,
      toggle,
      replyTarget,
      reply,
      cancelReply,
      talkType,
      setTalkType,
      receiver,
      setReceiver,
      resetForm
    }),
    [
      isOpen,
      toggle,
      replyTarget,
      reply,
      cancelReply,
      talkType,
      setTalkType,
      receiver,
      setReceiver,
      resetForm
    ]
  )

  return (
    <TalkPanelContext.Provider value={value}>
      {children}
    </TalkPanelContext.Provider>
  )
}

export const useTalkPanel = (): TalkPanelContextValue => {
  const ctx = useContext(TalkPanelContext)
  if (!ctx) {
    throw new Error('useTalkPanel must be used within TalkPanelProvider')
  }
  return ctx
}
