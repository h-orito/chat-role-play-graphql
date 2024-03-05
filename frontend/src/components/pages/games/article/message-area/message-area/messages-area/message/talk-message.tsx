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
  useMyselfValue,
  useUserDisplaySettingsValue
} from '@/components/pages/games/game-hook'
import Link from 'next/link'
import { base64ToId } from '@/components/graphql/convert'
import { SenderName } from './sender-name'

type MessageProps = {
  message: Message
  handleReply: (message: Message) => void
  preview?: boolean
  shouldDisplayReplyTo?: boolean
}

export default function TalkMessage({
  message,
  handleReply,
  preview = false,
  shouldDisplayReplyTo = false
}: MessageProps) {
  const [showReplies, setShowReplies] = useState<boolean>(false)
  const [replies, setReplies] = useState<Message[]>([])
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
  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1

  return (
    <div>
      <div className='w-full px-4 py-2'>
        {shouldDisplayReplyTo && message.replyTo && (
          <ReplyToMessage message={message} />
        )}
        {message.sender && (
          <div className='flex text-xs'>
            <p className='secondary-text'>#{message.content.number}</p>
            &nbsp;
            <SenderName message={message} preview={preview} />
            <ReceiverName message={message} preview={preview} />
            <p className='secondary-text ml-auto'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div>
            <SenderIcon
              message={message}
              preview={preview}
              imageSizeRatio={imageSizeRatio}
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
                  preview={preview}
                />
              </div>
              <div className='ml-8 flex'>
                <FavoriteButton message={message} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReplies && <Replies replies={replies} handleReply={handleReply} />}
    </div>
  )
}

const ReceiverName = ({
  message,
  preview
}: {
  message: Message
  preview: boolean
}) => {
  if (!message.receiver || message.content.type !== 'Secret') return <></>

  const game = useGameValue()
  const NameComponent = () => (
    <p className='primary-hover-text'>
      ENo.{message.receiver!.entryNumber}&nbsp;
      {message.receiver!.name}
    </p>
  )
  if (preview) {
    return (
      <>
        &nbsp;→&nbsp;
        <NameComponent />
      </>
    )
  }
  return (
    <>
      &nbsp;→&nbsp;
      <Link
        href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
          message.receiver!.participantId
        )}`}
        target='_blank'
      >
        <NameComponent />
      </Link>
    </>
  )
}

const SenderIcon = ({
  message,
  preview,
  imageSizeRatio
}: {
  message: Message
  preview: boolean
  imageSizeRatio: number
}) => {
  const game = useGameValue()
  const IconComponent = () => (
    <Image
      src={message.sender!.icon!.url}
      width={message.sender!.icon!.width * imageSizeRatio}
      height={message.sender!.icon!.height * imageSizeRatio}
      alt='キャラアイコン'
    />
  )

  if (preview) {
    return <IconComponent />
  }
  return (
    <Link
      href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
        message.sender!.participantId
      )}`}
      target='_blank'
    >
      <IconComponent />
    </Link>
  )
}

type ReplyButtonProps = {
  message: Message
  showReplies: boolean
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
  replies: Message[]
  setReplies: React.Dispatch<React.SetStateAction<Message[]>>
  handleReply: (message: Message) => void
  preview: boolean
}
const ReplyButton = ({
  message,
  showReplies,
  setShowReplies,
  replies,
  setReplies,
  handleReply,
  preview
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
    preview ||
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
  handleReply: (message: Message) => void
}

const Replies = ({ replies, handleReply }: RepliesProps) => {
  return (
    <div className='ml-8'>
      {replies.map((message: Message) => (
        <MessageComponent
          message={message}
          key={message.id}
          handleReply={handleReply}
          shouldDisplayReplyTo={false}
        />
      ))}
    </div>
  )
}

const ReplyToMessage = ({ message }: { message: Message }) => {
  const game = useGameValue()
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null)
  const senderName = game.participants.find(
    (p) => p.id === message.replyTo!.participantId
  )?.name

  const [fetchMessage] = useLazyQuery<GameMessageQuery>(GameMessageDocument)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMessage({
        variables: {
          gameId: game.id,
          messageId: message.replyTo!.messageId
        }
      })
      if (data?.message == null) return
      setReplyToMessage(data.message as Message)
    }
    fetch()
  }, [])

  if (!replyToMessage) {
    return (
      <div className='flex text-xs text-gray-500'>
        <p>返信先を読み込み中...</p>
      </div>
    )
  }

  const text =
    replyToMessage.content.text.length > 20
      ? `${replyToMessage.content.text.slice(0, 20)}...`
      : replyToMessage.content.text

  return (
    <>
      <div className='flex text-xs text-gray-500'>
        <Link
          href={`/games/${base64ToId(game.id)}/thread/${base64ToId(
            message.id
          )}`}
          target='_blank'
        >
          <p>
            →&nbsp;#{replyToMessage.content.number}&nbsp;
            {replyToMessage.sender ? replyToMessage.sender.name : senderName}
            &nbsp;
            {text}
          </p>
        </Link>
      </div>
    </>
  )
}
