import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import { useGameValue } from '@/components/pages/games/game-hook'
import {
  GameParticipantGroup,
  UpdateGameParticipantGroup,
  UpdateParticipantGroupDocument,
  UpdateParticipantGroupMutation,
  UpdateParticipantGroupMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  close: (e: any) => void
  group: GameParticipantGroup
  refetchGroups: () => void
}

interface FormInput {
  name: string
}

export default function ParticipantGroupEdit({
  close,
  group,
  refetchGroups
}: Props) {
  const game = useGameValue()
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: group.name
    }
  })
  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const [updateGroup] = useMutation<UpdateParticipantGroupMutation>(
    UpdateParticipantGroupDocument,
    {
      onCompleted(e) {
        refetchGroups()
        close(e)
      },
      onError(error) {
        console.error(error)
      }
    }
  )

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      updateGroup({
        variables: {
          input: {
            gameId: game.id,
            id: group.id,
            name: data.name
          } as UpdateGameParticipantGroup
        } as UpdateParticipantGroupMutationVariables
      })
    },
    [updateGroup, group]
  )

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='my-4'>
          <label className='text-xs font-bold'>グループ名</label>
          <p className='notification-background my-1 rounded-sm p-2 text-xs leading-5'>
            グループに所属するメンバー全員にこの名前で表示されます。
          </p>
          <InputText
            className='w-full'
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
        <div className='flex justify-end'>
          <SubmitButton label='更新する' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
