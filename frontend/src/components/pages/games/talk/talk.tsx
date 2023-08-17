import Image from 'next/image'
import RadioGroup from '@/components/form/radio-group'
import {
  Game,
  GameParticipant,
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  Message,
  MessageType,
  NewMessage,
  TalkDocument,
  TalkDryRunDocument,
  TalkDryRunMutation,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import SubmitButton from '@/components/button/submit-button'
import TalkMessage from '../article/message-area/message/talk-message'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'

type Props = {
  game: Game
  myself: GameParticipant
  closeWithoutWarning: () => void
  search: () => void
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

export interface TalkRefHandle {
  shouldWarnClose(): boolean
}

const Talk = forwardRef<TalkRefHandle, Props>((props: Props, ref: any) => {
  const { game, myself, closeWithoutWarning, search } = props
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

  const { control, formState, handleSubmit, setValue, watch } =
    useForm<FormInput>({
      defaultValues: {
        name: myself.name,
        talkMessage: ''
      }
    })

  const updateTalkMessage = (str: string) => setValue('talkMessage', str)
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

  const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument, {
    onError(error) {
      console.error(error)
    }
  })
  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted() {
      closeWithoutWarning()
      search()
    },
    onError(error) {
      console.error(error)
    }
  })

  const [preview, setPreview] = useState<Message | null>(null)
  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const mes = {
        gameId: game.id,
        type: talkType,
        iconId: iconId,
        name: data.name,
        replyToMessageId: null, // TODO
        text: data.talkMessage.trim(),
        isConvertDisabled: false // TODO
      } as NewMessage

      if (preview != null) {
        talk({
          variables: {
            input: mes
          } as TalkMutationVariables
        })
      } else {
        const { data } = await talkDryRun({
          variables: {
            input: mes
          } as TalkMutationVariables
        })
        if (data?.registerMessageDryRun == null) return
        setPreview(data.registerMessageDryRun.message as Message)
      }
    },
    [talk, talkType, iconId, formState]
  )

  const talkMessage = watch('talkMessage')
  useImperativeHandle(ref, () => ({
    shouldWarnClose() {
      return 0 < talkMessage.length
    }
  }))

  if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>
  const selectedIcon = icons.find((icon) => icon.id === iconId)

  const messageClass =
    talkType === MessageType.TalkNormal
      ? 'talk-normal'
      : talkType === MessageType.Monologue
      ? 'talk-monologue'
      : ''
  const talkTypeDescription =
    talkType === MessageType.TalkNormal
      ? '全員が参照できる発言種別です。'
      : talkType === MessageType.Monologue
      ? 'エピローグを迎えるまでは自分しか参照できません。'
      : ''

  return (
    <div className='py-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-2'>
          <p className='mb-1 text-xs font-bold'>種別</p>
          <RadioGroup
            className='text-xs'
            name='talk-type'
            candidates={candidates}
            selected={talkType}
            setSelected={setTalkType}
            disabled={preview != null}
          />
          <div className='mt-2 rounded-sm bg-gray-200 p-2 text-xs'>
            <p>{talkTypeDescription}</p>
          </div>
        </div>
        <div className='my-2'>
          <p className='text-xs font-bold'>名前</p>
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
            disabled={preview != null}
          />
        </div>
        <div className='mb-1'>
          <p className='text-xs font-bold'>発言装飾</p>
          <div className='flex'>
            <TalkTextDecorators
              selector='#talkMessage'
              setMessage={updateTalkMessage}
            />
          </div>
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
                    : '/chat-role-play/images/no-image-icon.png'
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
              textareaclassname={messageClass}
              control={control}
              rules={{
                required: '必須です',
                maxLength: {
                  value: 1000,
                  message: '1000文字以内で入力してください'
                }
              }}
              minRows={5}
              maxLength={1000}
              disabled={preview != null}
            />
          </div>
        </div>
        <div className='mt-4 flex justify-end'>
          <SubmitButton
            label={preview ? 'プレビュー内容で送信' : 'プレビュー'}
            disabled={!canSubmit}
          />
          {preview && (
            <SecondaryButton className='ml-2' click={() => setPreview(null)}>
              キャンセル
            </SecondaryButton>
          )}
        </div>
      </form>
      {preview && (
        <div className='my-4 border-t border-gray-300 pt-2'>
          <p className='font-bold'>プレビュー</p>
          <div className=''>
            <TalkMessage
              message={preview!}
              game={game}
              myself={myself}
              openProfileModal={() => {}}
              openFavoritesModal={() => {}}
            />
          </div>
        </div>
      )}
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
})

export default Talk

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
