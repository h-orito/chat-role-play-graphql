import {
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
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import SubmitButton from '@/components/button/submit-button'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'
import DescriptionMessage from '@/components/pages/games/article/message-area/message-area/messages-area/message/description-message'
import InputText from '@/components/form/input-text'
import { useGameValue, useMyselfValue } from '../game-hook'
import Portal from '@/components/modal/portal'
import { useUserPagingSettings } from '../user-settings'
import PrimaryButton from '@/components/button/primary-button'

type Props = {
  handleCompleted: () => void
  talkAreaId: string
}

interface FormInput {
  name: string
  talkMessage: string
}

const TalkDescription = (props: Props) => {
  const { handleCompleted } = props
  const game = useGameValue()
  const myself = useMyselfValue()!
  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      name: myself.name,
      talkMessage: ''
    }
  })
  const updateTalkMessage = (str: string) => setValue('talkMessage', str)

  const init = () => {
    setPreview(null)
    setDryRunMessage(null)
    setValue('name', myself.name)
    setValue('talkMessage', '')
  }

  const handleTalkCompleted = () => {
    init()
    handleCompleted()
  }

  const handlePreviewCanceled = () => {
    setPreview(null)
    setDryRunMessage(null)
    document.querySelector(`#${props.talkAreaId}`)!.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const canSubmit: boolean = formState.isValid && !formState.isSubmitting

  const createNewMessage = useCallback(
    (data: FormInput): NewMessage => {
      return {
        gameId: game.id,
        type: MessageType.Description,
        iconId: null,
        name: data.name,
        replyToMessageId: null,
        text: data.talkMessage,
        isConvertDisabled: false // TODO
      } as NewMessage
    },
    [game.id, formState]
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

  const talkMessageId = `${props.talkAreaId}-description-message`

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitPreview)}>
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
        <div className='mb-2'>
          <p className='text-xs font-bold'>発言装飾</p>
          <div className='flex'>
            <TalkTextDecorators
              selector={`#${talkMessageId}`}
              setMessage={updateTalkMessage}
            />
          </div>
        </div>
        <div>
          <p className='text-xs font-bold'>ト書き</p>
          <InputTextarea
            id={talkMessageId}
            name='talkMessage'
            textareaclassname='description'
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
        <div id='description-preview' className='mt-4 flex justify-end'>
          <SubmitButton label='プレビュー' disabled={!canSubmit} />
        </div>
        {preview && (
          <DescriptionPreview
            preview={preview}
            dryRunMessage={dryRunMessage}
            talkAreaId={props.talkAreaId}
            handleCompleted={handleTalkCompleted}
            handleCanceled={handlePreviewCanceled}
          />
        )}
      </form>
    </div>
  )
}

export default TalkDescription

type PreviewProps = {
  preview: Message | null
  dryRunMessage: NewMessage | null
  talkAreaId: string
  handleCompleted: () => void
  handleCanceled: () => void
}

const DescriptionPreview = (props: PreviewProps) => {
  const { talkAreaId } = props
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
      props.handleCompleted()
    }
  })
  const doTalk = async () => {
    talk({
      variables: {
        input: props.dryRunMessage!
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
          <DescriptionMessage message={props.preview!} />
        </div>
        <div className='mt-4 flex justify-end'>
          <PrimaryButton click={doTalk}>発言する</PrimaryButton>
          <SecondaryButton
            className='ml-2'
            click={() => props.handleCanceled()}
          >
            キャンセル
          </SecondaryButton>
        </div>
      </div>
    </Portal>
  )
}
