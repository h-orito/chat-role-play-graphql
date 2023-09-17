import {
  Game,
  UpdatePeriodMutation,
  UpdatePeriodDocument,
  UpdatePeriodMutationVariables,
  UpdateGamePeriod,
  UpdateStatusDocument,
  UpdateStatusMutation,
  UpdateGameStatus,
  UpdateStatusMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import { gameStatuses } from '@/components/graphql/convert'
import InputSelect from '@/components/form/input-select'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import InputDateTime from '@/components/form/input-datetime'

type Props = {
  game: Game
}

export default function GameStatusEdit({ game }: Props) {
  return (
    <div className='text-center'>
      <div className='my-4 flex justify-center'>
        <UpdateGameStatusForm game={game} />
      </div>
      <hr />
      <div className='my-4 flex justify-center'>
        <UpdateGamePeriodForm game={game} />
      </div>
    </div>
  )
}

const UpdateGameStatusForm = ({ game }: Props) => {
  const [gameStatus, setGameStatus] = useState(game.status)
  const gameStatusOptions = Array.from(gameStatuses.entries()).map((gs) => ({
    label: gs[1],
    value: gs[0]
  }))

  const [updateStatus] = useMutation<UpdateStatusMutation>(UpdateStatusDocument)
  const router = useRouter()
  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault()
      await updateStatus({
        variables: {
          input: {
            gameId: game.id,
            status: gameStatus
          } as UpdateGameStatus
        } as UpdateStatusMutationVariables
      })
      router.reload()
    },
    [updateStatus, gameStatus]
  )

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel label='ステータス変更'>
        ゲーム設定の日時に従ってステータスが遷移してしまうため、先にゲーム設定変更で各日時を設定することをおすすめします。
      </FormLabel>
      <div className='mb-4'>
        <InputSelect
          className='w-64 md:w-96'
          candidates={gameStatusOptions}
          selected={gameStatus}
          setSelected={setGameStatus}
        />
      </div>
      <div className='flex justify-center'>
        <SubmitButton label='更新' />
      </div>
    </form>
  )
}

interface FormInput {
  name: string
  endAt: string
}

const UpdateGamePeriodForm = ({ game }: Props) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')

  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      name: game.periods[game.periods.length - 1].name,
      endAt: dayjs(game.periods[game.periods.length - 1].endAt).format(
        'YYYY-MM-DDTHH:mm'
      )
    } as FormInput
  })

  const candidates = game.periods.map((p, index) => ({
    label: p.name,
    value: p.id
  }))
  const [targetPeriodId, setTargetPeriodId] = useState(
    candidates[candidates.length - 1].value
  )
  const handleTargetSelect = (id: string) => {
    setTargetPeriodId(id)
    setValue('name', game.periods.find((p) => p.id === id)!.name)
    setValue(
      'endAt',
      dayjs(game.periods.find((p) => p.id === id)!.endAt).format(
        'YYYY-MM-DDTHH:mm'
      )
    )
  }

  const [updatePeriod] = useMutation<UpdatePeriodMutation>(UpdatePeriodDocument)
  const router = useRouter()
  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      await updatePeriod({
        variables: {
          input: {
            gameId: game.id,
            periodId: targetPeriodId,
            name: data.name,
            startAt: dayjs(
              game.periods.find((p) => p.id === targetPeriodId)!.startAt
            )!.toDate(),
            endAt:
              targetPeriodId === game.periods[game.periods.length - 1].id
                ? dayjs(data.endAt).toDate()
                : dayjs(
                    game.periods.find((p) => p.id === targetPeriodId)!.endAt
                  ).toDate()
          } as UpdateGamePeriod
        } as UpdatePeriodMutationVariables
      })
      router.reload()
    },
    [updatePeriod, targetPeriodId]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLabel label='期間変更'>
        最新の期間のみ終了日時を変更できます。他の期間は、名前のみ変更できます。
      </FormLabel>
      <div className='my-4'>
        <InputSelect
          className='w-64 md:w-96'
          label='対象の期間'
          candidates={candidates}
          selected={targetPeriodId}
          setSelected={handleTargetSelect}
        />
      </div>
      <div className='my-4'>
        <InputText
          label='期間名'
          name='name'
          control={control}
          rules={{
            required: '必須です',
            maxLength: {
              value: 30,
              message: `30文字以内で入力してください`
            }
          }}
        />
      </div>
      {targetPeriodId === candidates[candidates.length - 1].value && (
        <div className='my-4'>
          <InputDateTime
            label='終了日時'
            name='endAt'
            control={control}
            rules={{
              required: '必須です',
              validate: {
                greaterThanStart: (value) => {
                  const startAt = dayjs(
                    game.periods.find((p) => p.id === targetPeriodId)!.startAt
                  )
                  return dayjs(value).isAfter(startAt)
                    ? undefined
                    : '開始日時より後にしてください'
                }
              }
            }}
          />
        </div>
      )}
      <div className='flex justify-center'>
        <SubmitButton label='更新' />
      </div>
    </form>
  )
}

type FormLabelProps = {
  label: string
  required?: boolean
  children?: React.ReactNode
}

const FormLabel = ({ label, required = false, children }: FormLabelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(!isModalOpen)
    }
  }
  const openModal = (e: any) => {
    e.preventDefault()
    setIsModalOpen(true)
  }
  return (
    <label className='block text-sm font-bold'>
      {required && <span className='text-red-500'>*&nbsp;</span>}
      {label}
      {children && (
        <>
          <button onClick={openModal}>
            <QuestionMarkCircleIcon className='primary-text ml-1 h-4 w-4' />
          </button>
          {isModalOpen && (
            <Modal close={toggleModal} hideFooter>
              <div>
                <p className='text-xs'>{children}</p>
              </div>
            </Modal>
          )}
        </>
      )}
    </label>
  )
}
