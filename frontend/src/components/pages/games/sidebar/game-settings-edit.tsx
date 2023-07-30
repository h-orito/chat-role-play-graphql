import {
  RegisterGameMutationVariables,
  NewGame,
  Game,
  UpdateGameSettingsMutation,
  UpdateGameSettingsDocument,
  UpdateGameSetting,
  UpdateGameSettingsMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import GameEdit, {
  GameFormInput
} from '@/components/pages/create-game/game-edit'

type Props = {
  game: Game
}

export default function GameSettingsEdit({ game }: Props) {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')

  const defaultValues = {
    name: game.name,
    openAt: dayjs(game.settings.time.openAt).format('YYYY-MM-DDTHH:mm'),
    startParticipateAt: dayjs(game.settings.time.startParticipateAt).format(
      'YYYY-MM-DDTHH:mm'
    ),
    startGameAt: dayjs(game.settings.time.startGameAt).format(
      'YYYY-MM-DDTHH:mm'
    ),
    finishGameAt: dayjs(game.settings.time.finishGameAt).format(
      'YYYY-MM-DDTHH:mm'
    ),
    capacityMin: game.settings.capacity.min,
    capacityMax: game.settings.capacity.max,
    periodPrefix: game.settings.time.periodPrefix || '',
    periodSuffix: game.settings.time.periodSuffix || '',
    periodIntervalDays: Math.floor(
      game.settings.time.periodIntervalSeconds / 60 / 60 / 24
    ),
    periodIntervalHours:
      (game.settings.time.periodIntervalSeconds / 60 / 60) % 24,
    periodIntervalMinutes: (game.settings.time.periodIntervalSeconds / 60) % 60,
    password: ''
  } as GameFormInput

  const [updateGameSettings] = useMutation<UpdateGameSettingsMutation>(
    UpdateGameSettingsDocument,
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
      await updateGameSettings({
        variables: {
          input: {
            gameId: game.id,
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
          } as UpdateGameSetting
        } as UpdateGameSettingsMutationVariables
      })
      router.reload()
    },
    [updateGameSettings]
  )

  return (
    <div className='flex justify-center text-center'>
      <GameEdit
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        labelName='更新'
      />
    </div>
  )
}
