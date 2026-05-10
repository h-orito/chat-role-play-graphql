import { Message } from '@/lib/generated/graphql'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

type TalkPanelContextValue = {
  isOpen: boolean
  toggle: () => void
  replyTarget: Message | null
  reply: (message: Message) => void
  cancelReply: () => void
}

const TalkPanelContext = createContext<TalkPanelContextValue | null>(null)

type Props = {
  children: ReactNode
}

export const TalkPanelProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  const reply = useCallback((message: Message) => {
    setReplyTarget(message)
    setIsOpen(true)
  }, [])

  const cancelReply = useCallback(() => {
    setReplyTarget(null)
  }, [])

  const value = useMemo<TalkPanelContextValue>(
    () => ({ isOpen, toggle, replyTarget, reply, cancelReply }),
    [isOpen, toggle, replyTarget, reply, cancelReply]
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
