import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import {
  Player,
  UpdatePlayerProfileDocument,
  UpdatePlayerProfileMutation,
  UpdatePlayerProfileMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  close: (e: any) => void
  myPlayer: Player | null
  refetchMyPlayer: () => void
}

interface FormInput {
  name: string
  introduction: string | null
}

export default function UserEdit({ close, myPlayer, refetchMyPlayer }: Props) {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: myPlayer?.name ?? '',
      introduction: myPlayer?.profile?.introduction ?? ''
    }
  })

  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const [updateProfile] = useMutation<UpdatePlayerProfileMutation>(
    UpdatePlayerProfileDocument,
    {
      onCompleted(e) {
        refetchMyPlayer()
        close(e)
      },
      onError(error) {
        console.error(error)
      }
    }
  )
  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      updateProfile({
        variables: {
          name: data.name,
          introduction: data.introduction
        } as UpdatePlayerProfileMutationVariables
      })
    },
    [updateProfile]
  )

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='my-4'>
          <InputText
            label='ユーザー名'
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
        <div className='my-4'>
          <InputTextarea
            label='自己紹介'
            name='introduction'
            control={control}
            rules={{}}
            minRows={5}
          />
        </div>
        <div className='flex justify-end'>
          <SubmitButton label='更新する' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
