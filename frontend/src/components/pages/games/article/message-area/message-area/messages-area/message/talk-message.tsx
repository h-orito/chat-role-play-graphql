import {
  GameMessageDocument,
  GameMessageQuery,
  Message,
  MessageRecipient,
  MessageRepliesDocument,
  MessageRepliesQuery,
  MessageType
} from '@/lib/generated/graphql'
import Image from 'next/image'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { iso2display } from '@/components/util/datetime/datetime'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import FavoriteButton from './favorite-button'
import MessageComponent from './message'
import MessageText from '../../../message-text/message-text'
import {
  useGameValue,
  useMyselfValue
} from '@/components/pages/games_new/game-hook'

type MessageProps = {
  message: Message
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  handleReply: (message: Message) => void
  preview?: boolean
  shouldDisplayReplyTo?: boolean
  imageSizeRatio: number
}

export default function TalkMessage({
  message,
  openProfileModal,
  openFavoritesModal,
  handleReply,
  preview = false,
  shouldDisplayReplyTo = false,
  imageSizeRatio
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
      : message.content.type === 'Secret'
      ? 'talk-secret'
      : ''
  return (
    <div>
      <div className='w-full px-4 py-2'>
        {shouldDisplayReplyTo && message.replyTo && (
          <ReplyToMessage
            replyTo={message.replyTo}
            imageSizeRatio={imageSizeRatio}
          />
        )}
        {message.sender && (
          <div className='flex text-xs'>
            <p className='secondary-text'>#{message.content.number}</p>
            &nbsp;
            <button onClick={handleProfileClick}>
              <p className='primary-hover-text'>
                ENo.{message.sender.entryNumber}&nbsp;
                {message.sender.name}
              </p>
            </button>
            {message.receiver && (
              <>
                &nbsp;→&nbsp;
                <p className='primary-hover-text'>
                  ENo.{message.receiver.entryNumber}&nbsp;
                  {message.receiver.name}
                </p>
              </>
            )}
            <p className='secondary-text ml-auto'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div>
            <Image
              className='cursor-pointer'
              src={message.sender!.icon!.url}
              width={message.sender!.icon!.width * imageSizeRatio}
              height={message.sender!.icon!.height * imageSizeRatio}
              alt='キャラアイコン'
              onClick={handleProfileClick}
            />
          </div>
          <div className='ml-2 flex-1 text-sm'>
            <div
              className={`message ${messageClass}`}
              style={{
                minHeight: `${message.sender!.icon!.height * imageSizeRatio}px`
              }}
            >
              <MessageText
                rawText={message.content.text}
                isConvertDisabled={message.content.isConvertDisabled}
              />
            </div>
            <div className='flex justify-end pt-1'>
              <div className='flex'>
                <ReplyButton
                  message={message}
                  showReplies={showReplies}
                  setShowReplies={setShowReplies}
                  replies={replies}
                  setReplies={setReplies}
                  handleReply={handleReply}
                />
              </div>
              <div className='ml-8 flex'>
                <FavoriteButton
                  message={message}
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
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
          handleReply={handleReply}
          imageSizeRatio={imageSizeRatio}
        />
      )}
    </div>
  )
}

type ReplyButtonProps = {
  message: Message
  showReplies: boolean
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
  replies: Message[]
  setReplies: React.Dispatch<React.SetStateAction<Message[]>>
  handleReply: (message: Message) => void
}
const ReplyButton = ({
  message,
  showReplies,
  setShowReplies,
  replies,
  setReplies,
  handleReply
}: ReplyButtonProps) => {
  const game = useGameValue()
  const myself = useMyselfValue()
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

  const isDisabled =
    myself == null ||
    (message.content.type === MessageType.Secret &&
      message.sender?.participantId === myself.id)

  return (
    <>
      <button
        className='hover:font-bold'
        onClick={() => handleReply(message)}
        disabled={isDisabled}
      >
        <ChatBubbleOvalLeftEllipsisIcon className='y-4 secondary-text h-4' />
      </button>
      {message.reactions.replyCount > 0 && (
        <button
          className='pr-2 hover:font-bold'
          onClick={() => toggleReplies()}
        >
          <p className='secondary-text ml-1 self-center'>
            {message.reactions.replyCount}
          </p>
        </button>
      )}
    </>
  )
}

type RepliesProps = {
  replies: Message[]
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  handleReply: (message: Message) => void
  imageSizeRatio: number
}

const Replies = ({
  replies,
  openProfileModal,
  openFavoritesModal,
  handleReply,
  imageSizeRatio
}: RepliesProps) => {
  return (
    <div className='ml-8'>
      {replies.map((message: Message) => (
        <MessageComponent
          message={message}
          key={message.id}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
          handleReply={handleReply}
          shouldDisplayReplyTo={false}
          imageSizeRatio={imageSizeRatio}
        />
      ))}
    </div>
  )
}

const ReplyToMessage = ({
  replyTo,
  imageSizeRatio
}: {
  replyTo: MessageRecipient
  imageSizeRatio: number
}) => {
  const game = useGameValue()
  const [message, setMessage] = useState<Message | null>(null)
  const senderName = game.participants.find(
    (p) => p.id === replyTo.participantId
  )?.name

  const [fetchMessage] = useLazyQuery<GameMessageQuery>(GameMessageDocument)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMessage({
        variables: {
          gameId: game.id,
          messageId: replyTo.messageId
        }
      })
      if (data?.message == null) return
      setMessage(data.message as Message)
    }
    fetch()
  }, [])

  const [showReplyToMessage, setShowReplyToMessage] = useState(false)
  const toggleShow = () => setShowReplyToMessage(!showReplyToMessage)

  if (!message) {
    return (
      <div className='flex text-xs text-gray-500'>
        <p>返信先を読み込み中...</p>
      </div>
    )
  }

  const text =
    message.content.text.length > 20
      ? `${message.content.text.slice(0, 20)}...`
      : message.content.text

  return (
    <>
      <div className='flex text-xs text-gray-500'>
        <button onClick={() => toggleShow()}>
          <p>
            →&nbsp;#{message.content.number}&nbsp;
            {message.sender ? message.sender.name : senderName}&nbsp;
            {text}
          </p>
        </button>
      </div>
      {showReplyToMessage && (
        <div className='-mx-4'>
          <TalkMessage
            message={message!}
            openProfileModal={() => {}}
            openFavoritesModal={() => {}}
            handleReply={() => {}}
            imageSizeRatio={imageSizeRatio}
          />
        </div>
      )}
    </>
  )
}
