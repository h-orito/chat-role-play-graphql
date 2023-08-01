import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import {
  Game,
  NewGameParticipant,
  RegisterGameParticipantDocument,
  RegisterGameParticipantMutation,
  RegisterGameParticipantMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  close: (e: any) => void
  game: Game
}

interface FormInput {
  participantName: string
}

export default function Participate({ close, game }: Props) {
  const router = useRouter()
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      participantName: ''
    }
  })
  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const [participate] = useMutation<RegisterGameParticipantMutation>(
    RegisterGameParticipantDocument,
    {
      onCompleted(_) {
        router.reload()
      },
      onError(error) {
        console.error(error)
      }
    }
  )
  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      participate({
        variables: {
          input: {
            gameId: game.id,
            name: data.participantName
          } as NewGameParticipant
        } as RegisterGameParticipantMutationVariables
      })
    },
    [participate]
  )

  return (
    <div>
      <p className='mb-4'>TODO: 規約</p>
      <div className='my-4 rounded-sm border border-gray-200 bg-gray-200 px-2 py-4'>
        <ul className='list-inside list-disc text-sm'>
          <li>キャラクター名は後で変更可能です。</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          label='キャラクター名'
          name='participantName'
          control={control}
          rules={{
            required: '必須です',
            maxLength: {
              value: 50,
              message: `50文字以内で入力してください`
            }
          }}
        />
        <div className='flex justify-end'>
          <SubmitButton label='参加登録' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
