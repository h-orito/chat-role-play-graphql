import {
  Game,
  UpdatePeriodMutation,
  UpdatePeriodDocument,
  UpdatePeriodMutationVariables,
  UpdateGamePeriod,
  UpdateStatusDocument,
  UpdateStatusMutation,
  UpdateGameStatus,
  UpdateStatusMutationVariables,
  DeletePeriodDocument,
  DeletePeriodMutation,
  DeleteGamePeriod,
  DeletePeriodMutationVariables
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
import DangerButton from '@/components/button/danger-button'
import { useGameValue } from '../game-hook'

export default function GameStatusEdit() {
  const game = useGameValue()
  return (
    <div className='text-center'>
      <div className='my-4 flex justify-center'>
        <UpdateGameStatusForm />
      </div>
      <hr />
      <div className='my-4 flex justify-center'>
        <UpdateGamePeriodForm />
      </div>
      {game.periods.length > 1 && (
        <>
          <hr />
          <div className='my-4 flex justify-center'>
            <DeleteGamePeriodForm />
          </div>
        </>
      )}
    </div>
  )
}

const UpdateGameStatusForm = () => {
  const game = useGameValue()
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

interface UpdatePeriodFormInput {
  name: string
  endAt: string
}

const UpdateGamePeriodForm = () => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')

  const game = useGameValue()
  const { control, handleSubmit, setValue } = useForm<UpdatePeriodFormInput>({
    defaultValues: {
      name: game.periods[game.periods.length - 1].name,
      endAt: dayjs(game.periods[game.periods.length - 1].endAt).format(
        'YYYY-MM-DDTHH:mm'
      )
    } as UpdatePeriodFormInput
  })

  const candidates = game.periods.map((p) => ({
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
  const onSubmit: SubmitHandler<UpdatePeriodFormInput> = useCallback(
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

const DeleteGamePeriodForm = () => {
  const game = useGameValue()
  const candidates = game.periods.map((p) => ({
    label: p.name,
    value: p.id
  }))
  const [targetPeriodId, setTargetPeriodId] = useState(
    candidates[candidates.length - 1].value
  )
  const targetIndex = game.periods.findIndex((p) => p.id === targetPeriodId)!
  const destCandidatePeriods = []
  if (targetIndex - 1 >= 0)
    destCandidatePeriods.push(game.periods[targetIndex - 1])
  if (targetIndex + 1 < game.periods.length) {
    destCandidatePeriods.push(game.periods[targetIndex + 1])
  }
  const destCandidates = destCandidatePeriods.map((p) => ({
    label: p.name,
    value: p.id
  }))
  const [destPeriodId, setDestPeriodId] = useState(destCandidates[0].value)

  const handleTargetSelect = (id: string) => {
    setTargetPeriodId(id)
  }

  const [deletePeriod] = useMutation<DeletePeriodMutation>(DeletePeriodDocument)
  const router = useRouter()
  const onSubmit = useCallback(async () => {
    if (!destCandidates.some((c) => c.value === destPeriodId)) {
      window.alert('削除対象の直前か直後の期間を選択してください')
      return
    }
    if (
      !window.confirm(
        'この操作は元に戻せません。本当に期間を削除してよろしいですか？'
      )
    )
      return
    await deletePeriod({
      variables: {
        input: {
          gameId: game.id,
          targetPeriodId: targetPeriodId,
          destPeriodId: destPeriodId
        } as DeleteGamePeriod
      } as DeletePeriodMutationVariables
    })
    router.reload()
  }, [deletePeriod, targetPeriodId, destPeriodId, destCandidates])

  return (
    <div>
      <FormLabel label='期間削除'>
        期間を削除できます。該当期間の発言内容やト書きは、移行先の期間に変更されます。
        <br />
        移行先の期間は、削除対象の直前または直後の期間から選択してください。
      </FormLabel>
      <div className='my-4'>
        <InputSelect
          className='w-64 md:w-96'
          label='削除対象の期間'
          candidates={candidates}
          selected={targetPeriodId}
          setSelected={handleTargetSelect}
        />
      </div>
      <div className='my-4'>
        <InputSelect
          className='w-64 md:w-96'
          label='メッセージの移行先の期間'
          candidates={destCandidates}
          selected={destPeriodId}
          setSelected={(id: string) => setDestPeriodId(id)}
        />
      </div>
      <div className='flex justify-center'>
        <DangerButton click={onSubmit}>削除</DangerButton>
      </div>
    </div>
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
            <QuestionMarkCircleIcon className='base-link ml-1 h-4 w-4' />
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
