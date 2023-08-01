import Image from 'next/image'
import RadioGroup from '@/components/form/radio-group'
import {
  DirectMessage,
  Game,
  GameParticipant,
  GameParticipantGroup,
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  Message,
  MessageType,
  NewDirectMessage,
  TalkDirectDocument,
  TalkDirectMutation,
  TalkDirectMutationVariables,
  TalkDocument,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import SubmitButton from '@/components/button/submit-button'
import TalkMessage from '../article/message-area/message/talk-message'
import DirectMessage from '../article/message-area/direct-message/direct-message'
import DirectMessageComponent from '../article/message-area/direct-message/direct-message'

type Props = {
  game: Game
  myself: GameParticipant
  close: (e: any) => void
  gameParticipantGroup?: GameParticipantGroup | null
}

const candidates = [
  {
    label: '通常',
    value: MessageType.TalkNormal
  },
  {
    label: '独り言',
    value: MessageType.Monologue
  }
]

interface FormInput {
  name: string
  talkMessage: string
}

export default function Talk({
  game,
  myself,
  close,
  gameParticipantGroup
}: Props) {
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>([])
  const [fetchIcons] = useLazyQuery<IconsQuery>(IconsDocument)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchIcons({
        variables: { participantId: myself.id }
      })
      if (data?.gameParticipantIcons == null) return
      setIcons(data.gameParticipantIcons)
      if (data.gameParticipantIcons.length <= 0) return
      setIconId(data.gameParticipantIcons[0].id)
    }
    fetch()
  }, [])

  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: myself.name,
      talkMessage: ''
    }
  })
  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const [talkType, setTalkType] = useState(MessageType.TalkNormal)
  const [iconId, setIconId] = useState<string>(
    icons.length > 0 ? icons[0].id : ''
  )
  const [isOpenIconSelectModal, setIsOpenIconSelectModal] = useState(false)
  const toggleIconSelectModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconSelectModal(!isOpenIconSelectModal)
    }
  }

  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted(e) {
      close(e)
    },
    onError(error) {
      console.error(error)
    }
  })
  const [talkDirect] = useMutation<TalkDirectMutation>(TalkDirectDocument, {
    onCompleted(e) {
      close(e)
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      if (gameParticipantGroup != null) {
        talkDirect({
          variables: {
            input: {
              gameId: game.id,
              gameParticipantGroupId: gameParticipantGroup.id,
              type: talkType,
              iconId: iconId,
              name: data.name,
              text: data.talkMessage,
              isConvertDisabled: false // TODO
            } as NewDirectMessage
          } as TalkDirectMutationVariables
        })
      } else {
        talk({
          variables: {
            input: {
              gameId: game.id,
              type: talkType,
              iconId: iconId,
              name: data.name,
              replyToMessageId: null, // TODO
              text: data.talkMessage,
              isConvertDisabled: false // TODO
            }
          } as TalkMutationVariables
        })
      }
    },
    [talk, talkType, iconId, formState]
  )

  if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>

  const selectedIcon = icons.find((icon) => icon.id === iconId)

  return (
    <div className='py-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {gameParticipantGroup != null && (
          <div className='mb-2'>
            <p>DM送信先: {gameParticipantGroup.name}</p>
          </div>
        )}
        <div className='mb-2'>
          <RadioGroup
            name='talk-type'
            candidates={candidates}
            selected={talkType}
            setSelected={setTalkType}
          />
        </div>
        <div className='my-2'>
          <InputText
            name='name'
            control={control}
            rules={{
              required: '必須です',
              maxLength: {
                value: 50,
                message: `50文字以内で入力してください`
              }
            }}
          />
        </div>
        <div className='flex'>
          <div>
            <button
              onClick={(e: any) => {
                e.preventDefault()
                setIsOpenIconSelectModal(true)
              }}
              disabled={icons.length <= 0}
            >
              <Image
                src={
                  selectedIcon
                    ? selectedIcon.url
                    : 'https://placehold.jp/120x120.png'
                }
                width={selectedIcon ? selectedIcon.width : 60}
                height={selectedIcon ? selectedIcon.height : 60}
                alt='キャラアイコン'
              />
            </button>
          </div>
          <div className='ml-2 flex-1'>
            <InputTextarea
              name='talkMessage'
              control={control}
              rules={{
                required: '必須です',
                maxLength: {
                  value: 1000,
                  message: '1000文字以内で入力してください'
                }
              }}
              minRows={5}
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <SubmitButton label='送信' disabled={!canSubmit} />
        </div>
      </form>
      <div className='mt-4'>
        <p className='font-bold'>プレビュー</p>
        {/* <PreviewMessage /> */}
      </div>
      {isOpenIconSelectModal && (
        <Modal close={toggleIconSelectModal} hideFooter>
          <IconSelect
            icons={icons}
            setIconId={setIconId}
            toggle={() => setIsOpenIconSelectModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

type IconSelectProps = {
  icons: Array<GameParticipantIcon>
  setIconId: (iconId: string) => void
  toggle: () => void
}
const IconSelect = ({ icons, setIconId, toggle }: IconSelectProps) => {
  const handleSelect = (e: any, iconId: string) => {
    e.preventDefault()
    setIconId(iconId)
    toggle()
  }

  return (
    <div>
      {icons.map((icon) => (
        <button onClick={(e: any) => handleSelect(e, icon.id)} key={icon.id}>
          <Image
            src={icon.url}
            width={icon.width}
            height={icon.height}
            alt='キャラアイコン'
          />
        </button>
      ))}
    </div>
  )
}

type PreviewMessageProps = {
  game: Game
  name: string
  talkMessage: string
  icons: Array<GameParticipantIcon>
  iconId: string
  talkType: MessageType
  myself: GameParticipant
  directMessage?: boolean
}

const PreviewMessage = ({
  game,
  name,
  talkMessage,
  icons,
  iconId,
  talkType,
  myself,
  directMessage
}: PreviewMessageProps) => {
  const message = directMessage
    ? null
    : ({
        id: 'dummy',
        content: {
          type: talkType,
          number: 1,
          text: talkMessage,
          isConvertDisabled: false // TODO
        },
        time: {
          sendAt: new Date(),
          sendUnixTimeMilli: 0
        },
        sender: {
          participantId: myself.id,
          name: name,
          icon: icons.find((i) => i.id === iconId)
        }
      } as Message)
  const dm = !directMessage
    ? null
    : ({
        id: 'dummy',
        content: {
          type: talkType,
          number: 1,
          text: talkMessage,
          isConvertDisabled: false // TODO
        },
        time: {
          sendAt: new Date(),
          sendUnixTimeMilli: 0
        },
        sender: {
          participantId: myself.id,
          name: name,
          icon: icons.find((i) => i.id === iconId)
        }
      } as DirectMessage)

  return (
    <>
      {directMessage ? (
        <DirectMessageComponent
          directMessage={dm!}
          myself={myself}
          game={game}
          openProfileModal={() => {}}
          openFavoritesModal={() => {}}
        />
      ) : (
        <TalkMessage
          message={message!}
          game={game}
          myself={myself}
          openProfileModal={() => {}}
          openFavoritesModal={() => {}}
        />
      )}
    </>
  )
}
