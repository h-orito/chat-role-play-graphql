import SubmitButton from '@/components/button/submit-button'
import InputDateTime from '@/components/form/input-datetime'
import InputNumber from '@/components/form/input-number'
import InputText from '@/components/form/input-text'
import PageHeader from '@/components/pages/page-header'
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
import { useForm, SubmitHandler } from 'react-hook-form'
import { base64ToId } from '@/components/graphql/convert'

interface FormInput {
  name: string
  capacityMin: number
  capacityMax: number
  openAt: string
  startParticipateAt: string
  startGameAt: string
  periodPrefix: string
  periodSuffix: string
  periodIntervalDays: number
  periodIntervalHours: number
  periodIntervalMinutes: number
  password: string
}

export default function CreateGame() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  const now = dayjs()

  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: '',
      openAt: now.add(7, 'day').startOf('hour').format('YYYY-MM-DDTHH:mm'),
      startParticipateAt: now
        .add(14, 'day')
        .startOf('hour')
        .format('YYYY-MM-DDTHH:mm'),
      startGameAt: now
        .add(28, 'day')
        .startOf('hour')
        .format('YYYY-MM-DDTHH:mm'),
      capacityMin: 1,
      capacityMax: 99,
      periodPrefix: '',
      periodSuffix: '日目',
      periodIntervalDays: 1,
      periodIntervalHours: 0,
      periodIntervalMinutes: 0,
      password: ''
    }
  })

  const canSubmit: boolean = !formState.isSubmitting
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
  const onSubmit: SubmitHandler<FormInput> = useCallback(
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
                startGameAt: dayjs(data.startGameAt).toDate()
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

  return (
    <main className='w-full lg:flex lg:justify-center'>
      <article className='w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='ゲーム作成' />
        <div className='p-4'>
          <p className='my-2 bg-gray-100 p-4 text-xs'>
            <span className='text-red-500'>*&nbsp;</span>
            がついている項目は必須です。
            <br />
            また、全ての項目は後から変更することができます。
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='my-4'>
              <FormLabel label='ゲーム名' required />
              <InputText
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
            <hr />
            <div className='my-4'>
              <FormLabel label='人数' required />
              <p className='my-2 bg-gray-100 p-4 text-xs'>
                下限人数よりも少ない人数でゲーム開始日時を迎えた場合、ゲームは開始されません。
              </p>
              <div className='flex justify-center'>
                <InputNumber
                  name='capacityMin'
                  className='w-16'
                  control={control}
                  rules={{
                    required: '必須です',
                    min: {
                      value: 1,
                      message: `1人以上で入力してください`
                    }
                  }}
                />
                &nbsp;～&nbsp;
                <InputNumber
                  name='capacityMax'
                  className='w-16'
                  control={control}
                  rules={{
                    required: '必須です',
                    min: {
                      value: 1,
                      message: `1人以上で入力してください`
                    },
                    validate: {
                      greaterThanMin: (value, values) =>
                        values.capacityMin < value
                          ? undefined
                          : '最少人数より多くしてください'
                    }
                  }}
                />
                人
              </div>
            </div>
            <hr />
            <div className='my-4'>
              <FormLabel label='公開開始日時' required />
              <p className='my-2 bg-gray-100 p-4 text-xs'>
                この日時を迎えるまで、トップページやゲーム一覧にこのゲームは表示されません（直URLアクセスは可能です）。
              </p>
              <InputDateTime
                name='openAt'
                control={control}
                rules={{
                  required: '必須です'
                }}
              />
            </div>
            <div className='my-4'>
              <FormLabel label='参加開始日時' required />
              <InputDateTime
                name='startParticipateAt'
                control={control}
                rules={{
                  required: '必須です',
                  validate: {
                    greaterThanOpenAt: (value: string, values: any) => {
                      const openAt = dayjs(values.openAt)
                      return dayjs(value).isAfter(openAt)
                        ? undefined
                        : '公開開始日時より後にしてください'
                    }
                  }
                }}
              />
            </div>
            <div className='my-4'>
              <FormLabel label='ゲーム開始日時' required />
              <InputDateTime
                name='startGameAt'
                control={control}
                rules={{
                  required: '必須です',
                  validate: {
                    greaterThanStartParticipateAt: (
                      value: string,
                      values: any
                    ) => {
                      const startParticipateAt = dayjs(
                        values.startParticipateAt
                      )
                      return dayjs(value).isAfter(startParticipateAt)
                        ? undefined
                        : '参加開始日時より後にしてください'
                    }
                  }
                }}
              />
            </div>
            <hr />
            <div className='my-4'>
              <FormLabel label='期間' />
              <p className='my-2 bg-gray-100 p-4 text-xs'>
                一定時間経過するごとに[接頭辞]1[接尾辞], [接頭辞]2[接尾辞],
                ..のように期間を区切ることができます。
                <br />
                例. 1日目, 2日目, ..
                <br />
                ゲーム開始直後に1つ目の期間が始まります。
              </p>
              <div className='flex justify-center'>
                <InputText
                  label='期間名接頭辞'
                  name='periodPrefix'
                  className='w-24'
                  control={control}
                  rules={{
                    maxLength: {
                      value: 10,
                      message: `10文字以内で入力してください`
                    }
                  }}
                />
                <InputText
                  label='期間名接尾辞'
                  name='periodSuffix'
                  className='w-24'
                  control={control}
                  rules={{
                    maxLength: {
                      value: 10,
                      message: `10文字以内で入力してください`
                    }
                  }}
                />
              </div>
            </div>
            <div className='my-4'>
              <FormLabel label='期間ごとの長さ' required />
              <div className='flex justify-center'>
                <InputNumber
                  name='periodIntervalDays'
                  className='w-16'
                  control={control}
                  rules={{
                    max: {
                      value: 365,
                      message: `365日以内で入力してください`
                    }
                  }}
                />
                <p className='self-center'>日</p>
                <InputNumber
                  name='periodIntervalHours'
                  className='w-16'
                  control={control}
                  rules={{
                    max: {
                      value: 23,
                      message: `23時間以内で入力してください`
                    }
                  }}
                />
                <p className='self-center'>時間</p>
                <InputNumber
                  name='periodIntervalMinutes'
                  className='w-16'
                  control={control}
                  rules={{
                    maxLength: {
                      value: 59,
                      message: `59分以内で入力してください`
                    }
                  }}
                />
                <p className='self-center'>分</p>
              </div>
            </div>
            <hr />
            <div className='my-4'>
              <FormLabel label='参加パスワード' />
              <InputText
                name='password'
                control={control}
                rules={{
                  maxLength: {
                    value: 50,
                    message: `50文字以内で入力してください`
                  }
                }}
              />
            </div>
            <hr />
            <div className='my-4 flex justify-center'>
              <SubmitButton label='作成' disabled={!canSubmit} />
            </div>
          </form>
        </div>
      </article>
    </main>
  )
}

type FormLabelProps = {
  label: string
  required?: boolean
}

const FormLabel = ({ label, required = false }: FormLabelProps) => {
  return (
    <label className='block text-sm font-bold'>
      {required && <span className='text-red-500'>*&nbsp;</span>}
      {label}
    </label>
  )
}
