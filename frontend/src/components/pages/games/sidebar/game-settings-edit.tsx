import {
  UpdateGameSettingsMutation,
  UpdateGameSettingsDocument,
  UpdateGameSetting,
  UpdateGameSettingsMutationVariables,
  GameLabel
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'
import GameEdit, {
  GameFormInput
} from '@/components/pages/create-game/game-edit'
import { useGameValue } from '../game-hook'

export default function GameSettingsEdit() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')

  const game = useGameValue()

  const defaultValues = {
    name: game.name,
    openAt: dayjs(game.settings.time.openAt).format('YYYY-MM-DDTHH:mm'),
    startParticipateAt: dayjs(game.settings.time.startParticipateAt).format(
      'YYYY-MM-DDTHH:mm'
    ),
    startGameAt: dayjs(game.settings.time.startGameAt).format(
      'YYYY-MM-DDTHH:mm'
    ),
    epilogueGameAt: dayjs(game.settings.time.epilogueGameAt).format(
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
    periodIntervalHours: Math.floor(
      (game.settings.time.periodIntervalSeconds / 60 / 60) % 24
    ),
    periodIntervalMinutes: (game.settings.time.periodIntervalSeconds / 60) % 60,
    introduction: game.settings.background.introduction || '',
    password: ''
  } as GameFormInput

  const [target, setTarget] = useState(
    game.labels.find((l) => ['誰歓', '身内'].includes(l.name))?.name ?? ''
  )
  const [rating, setRating] = useState(
    game.labels.find((l) => ['R15', 'R18', 'R18G'].includes(l.name))?.name ??
      '全年齢'
  )
  const [charachipIds, setCharachipIds] = useState<string[]>(
    game.settings.chara.charachips.map((c) => c.id)
  )
  const [theme, setTheme] = useState<string | null>(
    game.settings.rule.theme ?? null
  )
  const [catchImageFiles, setCatchImageFiles] = useState<File[]>([])

  const [updateGameSettings] = useMutation<UpdateGameSettingsMutation>(
    UpdateGameSettingsDocument,
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

      await updateGameSettings({
        variables: {
          input: {
            gameId: game.id,
            name: data.name,
            labels: labels,
            settings: {
              background: {
                introduction:
                  data.introduction.length > 0 ? data.introduction : null,
                catchImageFile:
                  catchImageFiles.length > 0 ? catchImageFiles[0] : null,
                catchImageUrl:
                  catchImageFiles.length > 0
                    ? null
                    : game.settings.background.catchImageUrl
              },
              chara: {
                charachipIds: charachipIds,
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
                epilogueGameAt: dayjs(data.epilogueGameAt).toDate(),
                finishGameAt: dayjs(data.finishGameAt).toDate()
              },
              rule: {
                isGameMasterProducer: false,
                canShorten: true,
                canSendDirectMessage: true,
                theme: theme
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
    [updateGameSettings, target, rating, theme, catchImageFiles]
  )

  return (
    <div className='flex justify-center text-center'>
      <GameEdit
        defaultValues={defaultValues}
        target={target}
        setTarget={setTarget}
        rating={rating}
        setRating={setRating}
        onSubmit={onSubmit}
        labelName='更新'
        charachipIds={charachipIds}
        setCharachipIds={setCharachipIds}
        canModifyCharachips={false}
        canModifyTheme={true}
        theme={theme}
        setTheme={setTheme}
        catchImageUrl={game.settings.background.catchImageUrl ?? null}
        catchImages={catchImageFiles}
        setCatchImages={setCatchImageFiles}
      />
    </div>
  )
}
