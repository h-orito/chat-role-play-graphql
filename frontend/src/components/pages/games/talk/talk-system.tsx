import {
  Game,
  MessageType,
  TalkDocument,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import SubmitButton from '@/components/button/submit-button'

type Props = {
  game: Game
  close: (e: any) => void
}

interface FormInput {
  name: string
  talkMessage: string
}

export default function TalkSystem({ game, close }: Props) {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      talkMessage: ''
    }
  })
  const canSubmit: boolean = formState.isValid && !formState.isSubmitting

  const [talk] = useMutation<TalkMutation>(TalkDocument, {
    onCompleted(e) {
      close(e)
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      talk({
        variables: {
          input: {
            gameId: game.id,
            type: MessageType.SystemPublic,
            iconId: null,
            name: null,
            replyToMessageId: null,
            text: data.talkMessage,
            isConvertDisabled: false // TODO
          }
        } as TalkMutationVariables
      })
    },
    [talk, formState]
  )

  return (
    <div className='px-4 py-2'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
        <div className='flex justify-end'>
          <SubmitButton label='送信' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
