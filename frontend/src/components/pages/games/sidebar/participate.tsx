import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import {
  Game,
  NewGameParticipant,
  RegisterGameParticipantDocument,
  RegisterGameParticipantMutation,
  RegisterGameParticipantMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'

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
  const [checkedTerm, setCheckedTerm] = useState(false)
  const [checkedPolicy, setCheckedPolicy] = useState(false)
  const canSubmit: boolean =
    formState.isValid && !formState.isSubmitting && checkedTerm && checkedPolicy
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
      <div className='my-4'>
        <div className='my-1'>
          <input
            type='checkbox'
            id='term-check'
            checked={checkedTerm}
            onChange={(e: any) => setCheckedTerm((prev) => !prev)}
          />
          <label htmlFor='term-check' className='ml-2 text-xs'>
            <Link target='_blank' href='/rules' className='text-blue-500'>
              ルール
            </Link>
            を確認し、守るべき事項について理解しました。
          </label>
        </div>
        <div>
          <input
            type='checkbox'
            id='policy-check'
            checked={checkedPolicy}
            onChange={(e: any) => setCheckedPolicy((prev) => !prev)}
          />
          <label htmlFor='policy-check' className='ml-2 text-xs'>
            他者への礼節を欠いたり、正常な運営を妨げるような行為を行なった場合、管理人の裁量により処罰される可能性があることについて理解しました。
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className='text-xs font-bold'>キャラクター名</label>
        <div className='my-1 rounded-sm border border-gray-200 bg-gray-200 p-2'>
          <ul className='list-inside list-disc text-xs'>
            <li>後で変更可能です。</li>
            <li>プロフィール等は参加登録後に編集可能になります。</li>
          </ul>
        </div>
        <InputText
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
