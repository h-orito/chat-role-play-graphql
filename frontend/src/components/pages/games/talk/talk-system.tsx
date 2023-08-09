import {
  Game,
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
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import SubmitButton from '@/components/button/submit-button'
import SecondaryButton from '@/components/button/scondary-button'
import SystemMessage from '../article/message-area/message/system-message'
import TalkTextDecorators from './talk-text-decorators'

type Props = {
  game: Game
  close: (e: any) => void
}

interface FormInput {
  name: string
  talkMessage: string
}

export default function TalkSystem({ game, close }: Props) {
  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      talkMessage: ''
    }
  })
  const canSubmit: boolean = formState.isValid && !formState.isSubmitting

  const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument, {
    onError(error) {
      console.error(error)
    }
  })
  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted(e) {
      close(e)
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
        type: MessageType.SystemPublic,
        iconId: null,
        name: null,
        replyToMessageId: null,
        text: data.talkMessage,
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
    [talk, formState]
  )

  const updateTalkMessage = (str: string) => setValue('talkMessage', str)

  return (
    <div className='px-4 py-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <p className='text-xs font-bold'>発言装飾</p>
          <div className='flex'>
            <TalkTextDecorators
              selector='#talkMessage'
              setMessage={updateTalkMessage}
            />
          </div>
        </div>
        <div>
          <p className='text-xs font-bold'>システムメッセージ</p>
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
            maxLength={1000}
          />
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
        {preview && (
          <div className='my-4 border-t border-gray-300 pt-2'>
            <p className='font-bold'>プレビュー</p>
            <div>
              <SystemMessage message={preview!} />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}