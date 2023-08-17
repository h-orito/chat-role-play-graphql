import {
  Game,
  GameParticipant,
  Message,
  MessageRepliesDocument,
  MessageRepliesQuery
} from '@/lib/generated/graphql'
import Image from 'next/image'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { iso2display } from '@/components/util/datetime/datetime'
import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import FavoriteButton from './favorite-button'
import MessageComponent from './message'
import MessageText from '../message-text/message-text'

type MessageProps = {
  game: Game
  myself: GameParticipant | null
  message: Message
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  preview?: boolean
}

export default function TalkMessage({
  game,
  message,
  myself,
  openProfileModal,
  openFavoritesModal,
  preview = false
}: MessageProps) {
  const [showReplies, setShowReplies] = useState<boolean>(false)
  const [replies, setReplies] = useState<Message[]>([])

  const handleProfileClick = (e: any) => {
    e.preventDefault()
    if (preview) return
    openProfileModal(message.sender!.participantId)
  }

  const messageClass =
    message.content.type === 'TalkNormal'
      ? 'talk-normal'
      : message.content.type === 'Monologue'
      ? 'talk-monologue'
      : message.content.type === 'Description'
      ? 'description'
      : ''
  return (
    <div>
      <div className='w-full px-4 py-2'>
        {message.sender && (
          <div className='flex pb-1'>
            <button onClick={handleProfileClick}>
              <p className='text-xs hover:text-blue-500'>
                ENo.{message.sender.entryNumber}&nbsp;{message.sender.name}
              </p>
            </button>
            <p className='ml-auto self-end text-xs text-gray-500'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div>
            <Image
              className='cursor-pointer'
              src={message.sender!.icon!.url}
              width={message.sender!.icon!.width}
              height={message.sender!.icon!.height}
              alt='キャラアイコン'
              onClick={handleProfileClick}
            />
          </div>
          <div className='ml-2 flex-1 text-sm'>
            <div
              className={`message ${messageClass}`}
              style={{ minHeight: `${message.sender!.icon!.height}px` }}
            >
              <MessageText
                rawText={message.content.text}
                isConvertDisabled={message.content.isConvertDisabled}
              />
            </div>
            <div className='flex justify-end pt-1'>
              <div className='flex'>
                <ReplyButton
                  game={game}
                  message={message}
                  showReplies={showReplies}
                  setShowReplies={setShowReplies}
                  replies={replies}
                  setReplies={setReplies}
                />
              </div>
              <div className='ml-8 flex'>
                <FavoriteButton
                  game={game}
                  message={message}
                  myself={myself}
                  openFavoritesModal={openFavoritesModal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReplies && (
        <Replies
          replies={replies}
          game={game}
          myself={myself}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
        />
      )}
    </div>
  )
}

type ReplyButtonProps = {
  game: Game
  message: Message
  showReplies: boolean
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
  replies: Message[]
  setReplies: React.Dispatch<React.SetStateAction<Message[]>>
}
const ReplyButton = ({
  game,
  message,
  showReplies,
  setShowReplies,
  replies,
  setReplies
}: ReplyButtonProps) => {
  const [fetchReplies] = useLazyQuery<MessageRepliesQuery>(
    MessageRepliesDocument
  )
  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      const { data } = await fetchReplies({
        variables: {
          gameId: game.id,
          messageId: message.id
        }
      })
      if (data?.messageReplies == null) return
      setReplies(data.messageReplies as Message[])
    }
    setShowReplies(!showReplies)
  }

  return (
    <button
      className='flex hover:font-bold'
      onClick={() => toggleReplies()}
      disabled={message.reactions.replyCount === 0}
    >
      <ChatBubbleOvalLeftEllipsisIcon className='y-6 h-6 text-gray-500' />
      {message.reactions.replyCount > 0 && (
        <p className='ml-1 self-center text-gray-500'>
          {message.reactions.replyCount}
        </p>
      )}
    </button>
  )
}

type RepliesProps = {
  replies: Message[]
  game: Game
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
}

const Replies = ({
  replies,
  game,
  myself,
  openProfileModal,
  openFavoritesModal
}: RepliesProps) => {
  return (
    <div className='ml-8'>
      {replies.map((message: Message) => (
        <MessageComponent
          game={game}
          message={message}
          myself={myself}
          key={message.id}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
        />
      ))}
    </div>
  )
}
