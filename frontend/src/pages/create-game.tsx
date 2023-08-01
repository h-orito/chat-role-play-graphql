import {
  RegisterGameMutation,
  RegisterGameMutationVariables,
  NewGame,
  RegisterGameDocument
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback } from 'react'
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
    finishGameAt: now.add(56, 'day').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    capacityMin: 1,
    capacityMax: 99,
    periodPrefix: '',
    periodSuffix: '日目',
    periodIntervalDays: 1,
    periodIntervalHours: 0,
    periodIntervalMinutes: 0,
    password: ''
  } as GameFormInput

  const [registerGame] = useMutation<RegisterGameMutation>(
    RegisterGameDocument,
    {
      onCompleted(e) {
        // TODO
      },
      onError(error) {
        console.error(error)
      }
    }
  )
  const router = useRouter()
  const onSubmit: SubmitHandler<GameFormInput> = useCallback(
    async (data) => {
      const { data: resData } = await registerGame({
        variables: {
          input: {
            name: data.name,
            settings: {
              chara: {
                charachipIds: [],
                canOriginalCharacter: true
              },
              capacity: {
                min: data.capacityMin,
                max: data.capacityMax
              },
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
                finishGameAt: dayjs(data.finishGameAt).toDate()
              },
              rule: {
                isGameMasterProducer: false,
                canShorten: true,
                canSendDirectMessage: true
              },
              password: {
                password: data.password.length > 0 ? data.password : null
              }
            }
          } as NewGame
        } as RegisterGameMutationVariables
      })
      const id = resData?.registerGame?.game?.id
      if (!id) {
        return
      }
      router.push(`/games/${base64ToId(id)}`)
    },
    [registerGame]
  )

  console.log(defaultValues)

  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | ゲーム作成</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='ゲーム作成' />
        <GameEdit
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          labelName='作成'
        />
      </article>
    </main>
  )
}
