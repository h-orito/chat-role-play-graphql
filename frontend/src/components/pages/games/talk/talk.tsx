import RadioGroup from '@/components/form/radio-group'
import {
  GameParticipant,
  Message,
  MessageType,
  NewMessage,
  TalkDocument,
  TalkDryRunDocument,
  TalkDryRunMutation,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
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
import { useUserPagingSettings } from '../user-settings'
import { useGameValue, useIconsValue, useMyselfValue } from '../game-hook'
import Portal from '@/components/modal/portal'
import IconSelectButton from './icon-select-button'

type Props = {
  handleCompleted: () => void
  talkAreaId: string
}

interface FormInput {
  name: string
  talkMessage: string
}

export interface TalkRefHandle {
  replyTo(message: Message): void
}

const Talk = forwardRef<TalkRefHandle, Props>((props: Props, ref: any) => {
  const game = useGameValue()
  const myself = useMyselfValue()!

  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      name: myself.name,
      talkMessage: ''
    }
  })
  const updateTalkMessage = (str: string) => setValue('talkMessage', str)

  // 発言種別
  const [talkType, setTalkType] = useState(MessageType.TalkNormal)
  // 返信先メッセージ
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  // 送信相手
  const [receiver, setReceiver] = useState<GameParticipant | null>(null)
  // 選択中のアイコン
  const [iconId, setIconId] = useState<string>('')
  // 装飾やランダム変換しない
  const [isConvertDisabled, setIsConvertDisabled] = useState(false)

  // アイコン候補
  const icons = useIconsValue()
  useEffect(() => {
    setIconId(icons.length <= 0 ? '' : icons[0].id)
  }, [icons])

  const init = () => {
    setTalkType(MessageType.TalkNormal)
    setPreview(null)
    setDryRunMessage(null)
    setReplyTarget(null)
    setReceiver(null)
    setValue('name', myself.name)
    setValue('talkMessage', '')
    setIconId(icons[0].id)
    setIsConvertDisabled(false)
  }

  const handleTalkCompleted = () => {
    init()
    props.handleCompleted()
  }

  const handlePreviewCanceled = () => {
    setPreview(null)
    setDryRunMessage(null)
    document.querySelector(`#${props.talkAreaId}`)!.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const canSubmit: boolean =
    formState.isValid &&
    !formState.isSubmitting &&
    (talkType !== MessageType.Secret ||
      (receiver != null && receiver.id !== myself.id))

  const createNewMessage = useCallback(
    (data: FormInput): NewMessage => {
      // 返信元またはこの発言が秘話の場合は返信扱いにしない
      const replyToMessageId =
        talkType === MessageType.Secret ||
        replyTarget?.content.type === MessageType.Secret
          ? null
          : replyTarget?.id
      return {
        gameId: game.id,
        type: talkType,
        iconId: iconId,
        name: data.name,
        receiverParticipantId: receiver?.id,
        replyToMessageId: replyToMessageId,
        text: data.talkMessage.trim(),
        isConvertDisabled: isConvertDisabled
      } as NewMessage
    },
    [
      game.id,
      replyTarget,
      talkType,
      receiver,
      iconId,
      isConvertDisabled,
      formState
    ]
  )

  // 発言プレビュー
  const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument)
  const [dryRunMessage, setDryRunMessage] = useState<NewMessage | null>(null)
  const [preview, setPreview] = useState<Message | null>(null)
  const onSubmitPreview: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const mes = createNewMessage(data)
      const { data: previewData } = await talkDryRun({
        variables: {
          input: mes
        } as TalkMutationVariables
      })
      if (previewData?.registerMessageDryRun == null) return
      setPreview(previewData.registerMessageDryRun.message as Message)
      setDryRunMessage(mes)
    },
    [createNewMessage, talkDryRun]
  )

  useImperativeHandle(ref, () => ({
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

  const cancelReply = (e: any) => {
    setReplyTarget(null)
    if (talkType !== MessageType.Secret) {
      setReceiver(null)
    }
  }

  const talkMessageId = `${props.talkAreaId}-talk-message`

  if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitPreview)}>
        <TalkType
          talkType={talkType}
          setTalkType={setTalkType}
          preview={preview}
          replyTarget={replyTarget}
        />
        <Receiver
          talkType={talkType}
          receiver={receiver}
          setReceiver={setReceiver}
        />
        <SenderName control={control} disabled={preview != null} />
        <div className='mb-1'>
          <p className='text-xs font-bold'>発言装飾</p>
          <div className='flex'>
            <TalkTextDecorators
              selector={`#${talkMessageId}`}
              setMessage={updateTalkMessage}
            />
          </div>
        </div>
        <div className='flex'>
          <IconSelectButton
            icons={icons}
            iconId={iconId}
            setIconId={setIconId}
          />
          <MessageContent
            id={talkMessageId}
            talkType={talkType}
            control={control}
            disabled={preview != null}
            isConvertDisabled={isConvertDisabled}
            setIsConvertDisabled={setIsConvertDisabled}
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <SubmitButton label='プレビュー' disabled={!canSubmit} />
        </div>
        {preview && (
          <TalkPreview
            preview={preview}
            dryRunMessage={dryRunMessage}
            talkAreaId={props.talkAreaId}
            handleCompleted={handleTalkCompleted}
            handleCanceled={handlePreviewCanceled}
          />
        )}
      </form>
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
              <TalkMessage message={replyTarget!} handleReply={() => {}} />
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

type MessageContentProps = {
  id: string
  talkType: MessageType
  control: Control<FormInput, any>
  disabled: boolean
  isConvertDisabled: boolean
  setIsConvertDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageContent = ({
  id,
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
        id={id}
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
          id={`${id}_convert-disabled`}
          checked={isConvertDisabled}
          onChange={(e: any) => setIsConvertDisabled((prev) => !prev)}
        />
        <label htmlFor={`${id}_convert-disabled`} className='ml-1 text-xs'>
          装飾やランダム変換しない
        </label>
      </div>
    </div>
  )
}

const TalkPreview = ({
  preview,
  dryRunMessage,
  talkAreaId,
  handleCompleted,
  handleCanceled
}: {
  preview: Message | null
  dryRunMessage: NewMessage | null
  talkAreaId: string
  handleCompleted: () => void
  handleCanceled: () => void
}) => {
  const [userPagingSettings] = useUserPagingSettings()
  const previewAreaId = `${talkAreaId}-${
    userPagingSettings.isDesc ? 'top' : 'bottom'
  }-preview`
  useEffect(() => {
    if (userPagingSettings.isDesc) {
      document.querySelector(`#${talkAreaId}-top`)!.scrollIntoView({
        behavior: 'smooth'
      })
    } else {
      document.querySelector(`#${talkAreaId}-bottom`)!.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted() {
      handleCompleted()
    }
  })
  const doTalk = async () => {
    talk({
      variables: {
        input: dryRunMessage!
      } as TalkMutationVariables
    })
  }

  return (
    <Portal target={`#${previewAreaId}`}>
      <div className='primary-border m-4 rounded-md border p-2'>
        <p className='text-xs'>
          以下の内容で発言してよろしいですか？（まだ発言されていません）
        </p>
        <div className='mt-2'>
          <TalkMessage
            message={preview!}
            handleReply={() => {}}
            preview={true}
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <PrimaryButton click={doTalk}>発言する</PrimaryButton>
          <SecondaryButton className='ml-2' click={() => handleCanceled()}>
            キャンセル
          </SecondaryButton>
        </div>
      </div>
    </Portal>
  )
}
