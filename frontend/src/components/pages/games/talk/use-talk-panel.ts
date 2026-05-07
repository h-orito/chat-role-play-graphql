import { Message } from '@/lib/generated/graphql'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

const talkPanelOpenAtom = atom(false)
const replyTargetAtom = atom<Message | null>(null)

export function useTalkPanel() {
  const [isOpen, setIsOpen] = useAtom(talkPanelOpenAtom)
  const [replyTarget, setReplyTarget] = useAtom(replyTargetAtom)

  const reply = useCallback(
    (message: Message) => {
      setReplyTarget(message)
      setIsOpen(true)
    },
    [setReplyTarget, setIsOpen]
  )

  const cancelReply = useCallback(() => {
    setReplyTarget(null)
  }, [setReplyTarget])

  return { isOpen, setIsOpen, replyTarget, reply, cancelReply }
}
