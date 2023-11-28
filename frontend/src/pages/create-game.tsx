import {
  RegisterGameMutation,
  RegisterGameMutationVariables,
  NewGame,
  RegisterGameDocument,
  NewGameCapacity,
  NewGameCharaSetting,
  NewGamePasswordSetting,
  NewGameRuleSetting,
  NewGameSettings,
  NewGameTimeSetting,
  GameLabel
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import { base64ToId } from '@/components/graphql/convert'
import GameEdit, {
  GameFormInput
} from '@/components/pages/create-game/game-edit'
import PageHeader from '@/components/pages/page-header'
import Head from 'next/head'

export default function CreateGame() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  const now = dayjs()

  const defaultValues = {
    name: '',
    openAt: now.add(7, 'day').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    startParticipateAt: now
      .add(14, 'day')
      .startOf('hour')
      .format('YYYY-MM-DDTHH:mm'),
    startGameAt: now.add(28, 'day').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    epilogueGameAt: now
      .add(42, 'day')
      .startOf('hour')
      .format('YYYY-MM-DDTHH:mm'),
    finishGameAt: now.add(56, 'day').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    capacityMin: 1,
    capacityMax: 99,
    periodPrefix: '',
    periodSuffix: '日目',
    periodIntervalDays: 1,
    periodIntervalHours: 0,
    periodIntervalMinutes: 0,
    password: '',
    introduction: ''
  } as GameFormInput

  const [target, setTarget] = useState('誰歓')
  const [rating, setRating] = useState('全年齢')
  const [charachipIds, setCharachipIds] = useState<string[]>([])
  const [catchImageFiles, setCatchImageFiles] = useState<File[]>([])

  const [registerGame] = useMutation<RegisterGameMutation>(
    RegisterGameDocument,
    {
      onError(error) {
        console.error(error)
      }
    }
  )

  const router = useRouter()
  const onSubmit: SubmitHandler<GameFormInput> = useCallback(
    async (data) => {
      const labels: Array<GameLabel> = []
      if (target !== '') {
        labels.push({
          name: target,
          type: 'success'
        } as GameLabel)
      }
      if (rating !== '全年齢') {
        labels.push({
          name: rating,
          type: 'danger'
        } as GameLabel)
      }

      const { data: resData } = await registerGame({
        variables: {
          input: {
            name: data.name,
            labels: labels,
            settings: {
              background: {
                introduction:
                  data.introduction.length > 0 ? data.introduction : null,
                catchImageFile:
                  catchImageFiles.length > 0 ? catchImageFiles[0] : null
              },
              chara: {
                charachipIds: charachipIds,
                canOriginalCharacter: true
              } as NewGameCharaSetting,
              capacity: {
                min: data.capacityMin,
                max: data.capacityMax
              } as NewGameCapacity,
              time: {
                periodPrefix:
                  data.periodPrefix.length > 0 ? data.periodPrefix : null,
                periodSuffix:
                  data.periodSuffix.length > 0 ? data.periodSuffix : null,
                periodIntervalSeconds:
                  data.periodIntervalDays * 24 * 60 * 60 +
                  data.periodIntervalHours * 60 * 60 +
                  data.periodIntervalMinutes * 60,
                openAt: dayjs(data.openAt).toDate(),
                startParticipateAt: dayjs(data.startParticipateAt).toDate(),
                startGameAt: dayjs(data.startGameAt).toDate(),
                epilogueGameAt: dayjs(data.epilogueGameAt).toDate(),
                finishGameAt: dayjs(data.finishGameAt).toDate()
              } as NewGameTimeSetting,
              rule: {
                isGameMasterProducer: false,
                canShorten: true,
                canSendDirectMessage: true,
                theme: null
              } as NewGameRuleSetting,
              password: {
                password: data.password.length > 0 ? data.password : null
              } as NewGamePasswordSetting
            } as NewGameSettings
          } as NewGame
        } as RegisterGameMutationVariables
      })
      const id = resData?.registerGame?.game?.id
      if (!id) {
        return
      }
      router.push(`/games/${base64ToId(id)}`)
    },
    [registerGame, charachipIds, target, rating, catchImageFiles]
  )

  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | ゲーム作成</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='ゲーム作成' />
        <GameEdit
          defaultValues={defaultValues}
          target={target}
          setTarget={setTarget}
          rating={rating}
          setRating={setRating}
          onSubmit={onSubmit}
          labelName='作成'
          charachipIds={charachipIds}
          setCharachipIds={setCharachipIds}
          canModifyTheme={false}
          catchImageUrl={null}
          catchImages={catchImageFiles}
          setCatchImages={setCatchImageFiles}
        />
      </article>
    </main>
  )
}
