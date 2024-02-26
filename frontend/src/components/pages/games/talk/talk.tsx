import Image from 'next/image'
import RadioGroup from '@/components/form/radio-group'
import {
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
import { Control, SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import SubmitButton from '@/components/button/submit-button'
import TalkMessage from '@/components/pages/games/article/message-area/message-area/messages-area/message/talk-message'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'
import PrimaryButton from '@/components/button/primary-button'
import ParticipantSelect from '../participant/participant-select'
import { useUserDisplaySettings } from '../user-settings'
import { useGameValue, useMyselfValue } from '../game-hook'

type Props = {
  handleCompleted: () => void
}

interface FormInput {
  name: string
  talkMessage: string
}

export interface TalkRefHandle {
  shouldWarnClose(): boolean
  replyTo(message: Message): void
}

const Talk = forwardRef<TalkRefHandle, Props>((props: Props, ref: any) => {
  const { handleCompleted } = props
  const game = useGameValue()
  const myself = useMyselfValue()!

  const { control, formState, handleSubmit, setValue, watch } =
    useForm<FormInput>({
      defaultValues: {
        name: myself.name,
        talkMessage: ''
      }
    })
  const talkMessage = watch('talkMessage')
  const updateTalkMessage = (str: string) => setValue('talkMessage', str)

  // 発言種別
  const [talkType, setTalkType] = useState(MessageType.TalkNormal)
  // 返信先メッセージ
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  // 送信相手
  const [receiver, setReceiver] = useState<GameParticipant | null>(null)
  // アイコン候補
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>([])
  // 選択中のアイコン
  const [iconId, setIconId] = useState<string>('')
  // 装飾やランダム変換しない
  const [isConvertDisabled, setIsConvertDisabled] = useState(false)

  const [fetchIcons] = useLazyQuery<IconsQuery>(IconsDocument)
  const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument)
  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted() {
      init()
      handleCompleted()
    }
  })

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

  const init = () => {
    setTalkType(MessageType.TalkNormal)
    setPreview(null)
    setReplyTarget(null)
    setReceiver(null)
    setValue('name', myself.name)
    setValue('talkMessage', '')
    setIconId(icons[0].id)
    setIsConvertDisabled(false)
  }

  const canSubmit: boolean =
    formState.isValid &&
    !formState.isSubmitting &&
    (talkType !== MessageType.Secret ||
      (receiver != null && receiver.id !== myself.id))

  const [preview, setPreview] = useState<Message | null>(null)
  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      // 返信元またはこの発言が秘話の場合は返信扱いにしない
      const replyToMessageId =
        talkType === MessageType.Secret ||
        replyTarget?.content.type === MessageType.Secret
          ? null
          : replyTarget?.id
      const mes = {
        gameId: game.id,
        type: talkType,
        iconId: iconId,
        name: data.name,
        receiverParticipantId: receiver?.id,
        replyToMessageId: replyToMessageId,
        text: data.talkMessage.trim(),
        isConvertDisabled: isConvertDisabled
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
    [talk, replyTarget, talkType, receiver, iconId, formState]
  )

  useImperativeHandle(ref, () => ({
    shouldWarnClose() {
      return 0 < talkMessage.length
    },
    replyTo(message: Message) {
      setReplyTarget(message)
      setReceiver(
        game.participants.find((p) => p.id === message!.sender!.participantId)!
      )
      if (message.content.type === MessageType.Secret) {
        setTalkType(MessageType.Secret)
      }
    }
  }))

  const scrollToPreview = () => {
    document.querySelector('#talk-preview')!.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const cancelReply = (e: any) => {
    setReplyTarget(null)
    if (talkType !== MessageType.Secret) {
      setReceiver(null)
    }
  }

  const [userDisplaySettings] = useUserDisplaySettings()

  if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TalkType
          {...props}
          talkType={talkType}
          setTalkType={setTalkType}
          preview={preview}
          replyTarget={replyTarget}
        />
        <Receiver
          {...props}
          talkType={talkType}
          receiver={receiver}
          setReceiver={setReceiver}
        />
        <SenderName control={control} disabled={preview != null} />
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
          <IconButton icons={icons} iconId={iconId} setIconId={setIconId} />
          <MessageContent
            talkType={talkType}
            control={control}
            disabled={preview != null}
            isConvertDisabled={isConvertDisabled}
            setIsConvertDisabled={setIsConvertDisabled}
          />
        </div>
        <div id='talk-preview' className='mt-4 flex justify-end'>
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
        <TalkPreview
          preview={preview}
          scrollToPreview={scrollToPreview}
          imageSizeRatio={userDisplaySettings.iconSizeRatio ?? 1}
        />
      )}
      {replyTarget && (
        <div className='mb-4'>
          <div className='flex'>
            <p className='text-xs font-bold'>返信先</p>
            <button className='ml-2 text-xs' onClick={() => cancelReply(null)}>
              返信解除
            </button>
          </div>
          <div className='base-border border pt-2'>
            <div>
              <TalkMessage
                message={replyTarget!}
                openFavoritesModal={() => {}}
                handleReply={() => {}}
                imageSizeRatio={userDisplaySettings.iconSizeRatio ?? 1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default Talk

type TalkTypeProps = {
  talkType: MessageType
  setTalkType: (talkType: MessageType) => void
  preview?: Message | null
  replyTarget: Message | null
}

const TalkType = ({
  talkType,
  setTalkType,
  preview,
  replyTarget
}: TalkTypeProps) => {
  const game = useGameValue()
  const talkTypeCandidates = [
    {
      label: '通常',
      value: MessageType.TalkNormal
    },
    {
      label: '独り言',
      value: MessageType.Monologue
    }
  ]
  if (game.participants.length > 1) {
    talkTypeCandidates.push({
      label: '秘話',
      value: MessageType.Secret
    })
  }

  const talkTypeDescription =
    talkType === MessageType.TalkNormal
      ? '全員が参照できる発言種別です。'
      : talkType === MessageType.Monologue
      ? 'エピローグを迎えるまでは自分しか参照できません。'
      : talkType === MessageType.Secret
      ? 'エピローグを迎えるまでは自分と相手しか参照できません。'
      : ''

  const shouldMonologueReplyWarning =
    game.status !== 'Epilogue' &&
    talkType !== MessageType.Monologue &&
    replyTarget != null

  return (
    <div className='mb-2'>
      <p className='mb-1 text-xs font-bold'>種別</p>
      <RadioGroup
        className='text-xs'
        name='talk-type'
        candidates={talkTypeCandidates}
        selected={talkType}
        setSelected={setTalkType}
        disabled={preview != null}
      />
      <div className='notification-background notification-text mt-2 rounded-sm p-2 text-xs'>
        <p>{talkTypeDescription}</p>
        {shouldMonologueReplyWarning && (
          <p className='danger-text'>
            独り言に独り言以外で返信すると、他の人も返信元の独り言を参照することができるためご注意ください。
          </p>
        )}
      </div>
    </div>
  )
}

type ReceiverProps = {
  talkType: MessageType
  receiver: GameParticipant | null
  setReceiver: (receiver: GameParticipant | null) => void
}

const Receiver = ({ talkType, receiver, setReceiver }: ReceiverProps) => {
  const game = useGameValue()
  const myself = useMyselfValue()!
  const [isOpenReceiverModal, setIsOpenReceiverModal] = useState(false)
  const toggleReceiverModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenReceiverModal(!isOpenReceiverModal)
    }
  }
  const handleSelectReceiver = (id: string) => {
    const receiver = game.participants.find((p) => p.id === id)
    if (receiver == null) return
    setReceiver(receiver)
    setIsOpenReceiverModal(false)
  }

  if (talkType !== MessageType.Secret) return <></>
  return (
    <div className='mb-2'>
      <p className='mb-1 text-xs font-bold'>秘話送信先</p>
      <p className='text-xs'>{receiver == null ? '未選択' : receiver.name}</p>
      <PrimaryButton
        className='text-xs'
        click={(e: any) => {
          e.preventDefault()
          setIsOpenReceiverModal(true)
        }}
      >
        選択
      </PrimaryButton>
      {talkType === MessageType.Secret && myself.id === receiver?.id && (
        <p className='danger-text text-xs'>
          自分に対して秘話を送信することはできません。
        </p>
      )}
      {isOpenReceiverModal && (
        <Modal close={toggleReceiverModal}>
          <ParticipantSelect
            participants={game.participants.filter((p) => p.id !== myself.id)}
            handleSelect={handleSelectReceiver}
          />
        </Modal>
      )}
    </div>
  )
}

type SenderNameProps = {
  control: Control<FormInput, any>
  disabled: boolean
}

const SenderName = ({ control, disabled }: SenderNameProps) => {
  return (
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
        disabled={disabled}
      />
    </div>
  )
}

type IconButtonProps = {
  icons: Array<GameParticipantIcon>
  iconId: string
  setIconId: (iconId: string) => void
}

const IconButton = ({ icons, iconId, setIconId }: IconButtonProps) => {
  const [isOpenIconSelectModal, setIsOpenIconSelectModal] = useState(false)
  const toggleIconSelectModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconSelectModal(!isOpenIconSelectModal)
    }
  }

  if (icons.length <= 0) return <></>
  const selectedIcon = icons.find((icon) => icon.id === iconId)

  return (
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

type MessageContentProps = {
  talkType: MessageType
  control: Control<FormInput, any>
  disabled: boolean
  isConvertDisabled: boolean
  setIsConvertDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageContent = ({
  talkType,
  control,
  disabled,
  isConvertDisabled,
  setIsConvertDisabled
}: MessageContentProps) => {
  const messageClass =
    talkType === MessageType.TalkNormal
      ? 'talk-normal'
      : talkType === MessageType.Monologue
      ? 'talk-monologue'
      : talkType === MessageType.Secret
      ? 'talk-secret'
      : ''

  return (
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
        disabled={disabled}
      />
      <div className='-mt-5'>
        <input
          type='checkbox'
          id='convert-disabled'
          checked={isConvertDisabled}
          onChange={(e: any) => setIsConvertDisabled((prev) => !prev)}
        />
        <label htmlFor='convert-disabled' className='ml-1 text-xs'>
          装飾やランダム変換しない
        </label>
      </div>
    </div>
  )
}

const TalkPreview = ({
  preview,
  scrollToPreview,
  imageSizeRatio
}: {
  preview: Message | null
  scrollToPreview: () => void
  imageSizeRatio: number
}) => {
  useEffect(() => {
    scrollToPreview()
  }, [])

  return (
    <div className='my-4'>
      <p className='text-xs font-bold'>プレビュー</p>
      <div className='base-border border pt-2'>
        <div>
          <TalkMessage
            message={preview!}
            openFavoritesModal={() => {}}
            handleReply={() => {}}
            imageSizeRatio={imageSizeRatio}
            preview={true}
          />
        </div>
      </div>
    </div>
  )
}
