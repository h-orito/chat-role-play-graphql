import SubmitButton from '@/components/button/submit-button'
import InputDateTime from '@/components/form/input-datetime'
import InputNumber from '@/components/form/input-number'
import InputText from '@/components/form/input-text'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import {
  Charachip,
  CharachipsQuery,
  QCharachipsDocument,
  QCharachipsQuery,
  QCharachipsQueryVariables
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import InputMultiSelect from '@/components/form/input-multi-select'
import RadioGroup from '@/components/form/radio-group'
import ThemeEdit from './theme-edit'
import InputSelect from '@/components/form/input-select'
import { themeMap, themeOptions } from '@/components/theme/theme'
import PrimaryButton from '@/components/button/primary-button'
import TalkTextDecorators from '../games/talk/talk-text-decorators'
import InputTextarea from '@/components/form/input-textarea'
import InputImage from '@/components/form/input-image'

type Props = {
  defaultValues: GameFormInput
  target: string
  setTarget: Dispatch<SetStateAction<string>>
  rating: string
  setRating: Dispatch<SetStateAction<string>>
  charachipIds: string[]
  setCharachipIds: Dispatch<SetStateAction<string[]>>
  onSubmit: SubmitHandler<GameFormInput>
  labelName: string
  canModifyCharachips?: boolean
  canModifyTheme?: boolean
  theme?: string | null
  setTheme?: Dispatch<SetStateAction<string | null>>
  catchImageUrl: string | null
  catchImages: File[]
  setCatchImages: Dispatch<SetStateAction<File[]>>
}

export interface GameFormInput {
  name: string
  capacityMin: number
  capacityMax: number
  openAt: string
  startParticipateAt: string
  startGameAt: string
  epilogueGameAt: string
  finishGameAt: string
  charachipIds: string[]
  periodPrefix: string
  periodSuffix: string
  periodIntervalDays: number
  periodIntervalHours: number
  periodIntervalMinutes: number
  password: string
  introduction: string
}

export default function GameEdit(props: Props) {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')

  const [charachips, setCharachips] = useState<Charachip[]>([])
  const [fetchCharachips] = useLazyQuery<QCharachipsQuery>(QCharachipsDocument)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchCharachips({
        variables: {
          query: {} as CharachipsQuery
        } as QCharachipsQueryVariables
      })
      if (data?.charachips) {
        setCharachips(data.charachips as Charachip[])
      }
    }
    fetch()
  }, [])

  const { control, formState, handleSubmit, setValue } = useForm<GameFormInput>(
    {
      defaultValues: props.defaultValues
    }
  )
  const updateIntroduction = (str: string) => setValue('introduction', str)

  const canSubmit: boolean = !formState.isSubmitting

  return (
    <div>
      <div className='p-4'>
        <div className='flex justify-center'>
          <p className='notification-background notification-text my-2 p-4 text-xs'>
            <span className='text-red-500'>*&nbsp;</span>
            がついている項目は必須です。
            <br />
            また、キャラチップ設定以外は作成後に変更することができます。
          </p>
        </div>
        <form onSubmit={handleSubmit(props.onSubmit)}>
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
            <FormLabel label='募集範囲' required />
            <div className='mt-1 flex justify-center'>
              <RadioGroup
                name='target'
                candidates={[
                  { label: '誰歓', value: '誰歓' },
                  { label: '身内', value: '身内' },
                  { label: 'その他', value: '' }
                ]}
                selected={props.target}
                setSelected={props.setTarget}
              />
            </div>
          </div>
          <hr />
          <div className='my-4'>
            <FormLabel label='レーティング' required>
              R15,R18表現が禁止されている場合があるため、キャラチップの利用規約を確認お願いします。
            </FormLabel>
            <div className='mt-1 flex justify-center'>
              <RadioGroup
                name='rating'
                candidates={[
                  { label: '全年齢', value: '全年齢' },
                  { label: 'R15', value: 'R15' },
                  { label: 'R18', value: 'R18' },
                  { label: 'R18G', value: 'R18G' }
                ]}
                selected={props.rating}
                setSelected={props.setRating}
              />
            </div>
          </div>
          <hr />
          <div className='my-4'>
            <FormLabel label='人数' required>
              下限人数よりも少ない人数でゲーム開始日時を迎えた場合、ゲームは開始されません。
            </FormLabel>
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
                      values.capacityMin <= value
                        ? undefined
                        : '最少人数以上にしてください'
                  }
                }}
              />
              人
            </div>
          </div>
          <hr />
          <div className='my-4'>
            <FormLabel label='公開開始日時' required>
              この日時を迎えるまで、トップページやゲーム一覧にこのゲームは表示されません（直URLアクセスは可能です）。
            </FormLabel>
            <InputDateTime
              name='openAt'
              control={control}
              rules={{
                required: '必須です'
              }}
            />
          </div>
          <div className='my-4'>
            <FormLabel label='参加開始日時' required>
              公開されていても、この日時を迎えるまでは参加登録することができません。
              <br />
              公開開始日時よりも後にする必要があります。
            </FormLabel>
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
            <FormLabel label='ゲーム開始日時' required>
              この日時にゲームが開始されます。
              <br />
              ゲームマスターが手動で開始することもできます。
            </FormLabel>
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
                    const startParticipateAt = dayjs(values.startParticipateAt)
                    return dayjs(value).isAfter(startParticipateAt)
                      ? undefined
                      : '参加開始日時より後にしてください'
                  }
                }
              }}
            />
          </div>
          <div className='my-4'>
            <FormLabel label='エピローグ開始日時' required>
              この日時にエピローグを迎え、秘匿情報が公開されます。
              <br />
              ゲームマスターが手動でエピローグ状態にすることもできます。
            </FormLabel>
            <InputDateTime
              name='epilogueGameAt'
              control={control}
              rules={{
                required: '必須です',
                validate: {
                  greaterThanStartGameAt: (value: string, values: any) => {
                    const startGameAt = dayjs(values.startGameAt)
                    return dayjs(value).isAfter(startGameAt)
                      ? undefined
                      : 'ゲーム開始日時より後にしてください'
                  }
                }
              }}
            />
          </div>
          <div className='my-4'>
            <FormLabel label='ゲーム終了日時' required>
              この日時にゲームが終了になります。
              <br />
              ゲームマスターが手動で終了することもできます。
            </FormLabel>
            <InputDateTime
              name='finishGameAt'
              control={control}
              rules={{
                required: '必須です',
                validate: {
                  greaterThanEpilogueGameAt: (value: string, values: any) => {
                    const epilogueGameAt = dayjs(values.epilogueGameAt)
                    return dayjs(value).isAfter(epilogueGameAt)
                      ? undefined
                      : 'エピローグ開始日時より後にしてください'
                  }
                }
              }}
            />
          </div>
          <hr />
          <div className='my-4'>
            <FormLabel label='キャラチップ'>
              オリジナルキャラクターに加え、選択したキャラチップのキャラクターを使用することができます。
            </FormLabel>
            {props.canModifyCharachips != false ? (
              <>
                <div className='flex justify-center'>
                  <p className='notification-background notification-text my-2 p-4 text-xs'>
                    選択すると、オリジナルキャラクターに加え、選択したキャラチップのキャラクターを利用して参加することができます。
                    <br />
                    複数選択することも可能です。
                    <br />
                    <span className='text-red-500'>
                      この項目は後から変更することができません。
                    </span>
                  </p>
                </div>
                <InputMultiSelect
                  candidates={charachips.map((c) => ({
                    label: `${c.name}（${c.designer.name}様）`,
                    value: c.id
                  }))}
                  selected={props.charachipIds}
                  setSelected={props.setCharachipIds}
                />
              </>
            ) : (
              <div className='flex justify-center'>
                <p className='my-2 text-xs'>
                  {props.charachipIds.length > 0
                    ? props.charachipIds
                        .map((id) => charachips.find((c) => c.id === id)?.name)
                        .join('、')
                    : 'なし'}
                </p>
              </div>
            )}
          </div>
          <hr />
          <div className='my-4'>
            <FormLabel label='期間' />
            <div className='flex justify-center'>
              <p className='notification-background notification-text my-2 p-4 text-xs'>
                一定時間経過するごとに[接頭辞]1[接尾辞], [接頭辞]2[接尾辞],
                ..のように期間を区切ることができます。
                <br />
                例. 1日目, 2日目, ..
                <br />
                ゲーム開始までは「プロローグ」固定で、ゲーム開始直後に1つ目の期間が始まります。
              </p>
            </div>
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
            <FormLabel label='参加パスワード'>
              設定されている場合、このパスワードを入力しないと参加登録することができません。
              <br />
              閲覧はパスワードを知らなくても可能です。
            </FormLabel>
            <div className='flex justify-center'>
              <p className='notification-background notification-text my-2 p-4 text-xs'>
                設定更新の際、毎回空欄となります。ご注意ください。
              </p>
            </div>
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
          <div className='my-4'>
            <FormLabel label='ゲーム紹介' />
            <label className='text-xs font-bold'>ゲーム紹介文</label>
            <div className='mb-1 flex justify-center'>
              <TalkTextDecorators
                selector='#introduction'
                setMessage={updateIntroduction}
              />
            </div>
            <InputTextarea
              name='introduction'
              control={control}
              rules={{}}
              minRows={5}
            />
            <label className='mt-4 text-xs font-bold'>キャッチ画像</label>
            <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
              jpeg, jpg, png形式かつ1MByte以下の画像を選択してください。
              <br />
              トップページでは概ね453x240pxで比率を維持して中央部分が表示されます。
            </p>

            <InputImage
              name='profileImage'
              setImages={props.setCatchImages}
              defaultImageUrl={props.catchImageUrl}
            />
          </div>
          {props.canModifyTheme == true && (
            <>
              <hr />
              <ThemeForm theme={props.theme!} setTheme={props.setTheme!} />
            </>
          )}
          <hr />
          <div className='my-4 flex justify-center'>
            <SubmitButton label={props.labelName} disabled={!canSubmit} />
          </div>
        </form>
      </div>
    </div>
  )
}

const ThemeForm = ({
  theme,
  setTheme
}: {
  theme: string | null
  setTheme: Dispatch<SetStateAction<string | null>>
}) => {
  const [isUseTheme, setIsUseTheme] = useState(theme ? 'use' : 'none')
  const handleChangeUseTheme = (value: string) => {
    if (value === 'none') {
      if (
        window.confirm('設定中のテーマ内容が破棄されますが、よろしいですか？')
      ) {
        setTheme(null)
        setIsUseTheme(value)
      }
    } else {
      if (theme === null) {
        setTheme(JSON.stringify(themeMap.get('light')))
      }
      setIsUseTheme(value)
    }
  }
  const [templateTheme, setTemplateTheme] = useState(themeOptions[0].value)
  const handlePaste = (e: any) => {
    e.preventDefault()
    if (!window.confirm('現在のテーマ内容が破棄されますが、よろしいですか？')) {
      return
    }
    const newTheme = themeMap.get(templateTheme)!
    setTheme(JSON.stringify(newTheme))
  }
  return (
    <div className='my-4'>
      <FormLabel label='オリジナルテーマ'>
        設定されている場合、各ユーザーがこのテーマを使用することができるようになります。
      </FormLabel>
      <div className='mt-2 flex justify-center'>
        <RadioGroup
          name='use-theme'
          candidates={[
            { label: '設定しない', value: 'none' },
            { label: '設定する', value: 'use' }
          ]}
          selected={isUseTheme}
          setSelected={handleChangeUseTheme}
        />
      </div>
      {isUseTheme === 'use' && (
        <>
          <div className='base-border my-4 border-b'>
            <strong>既存テーマ流用</strong>
            <div className='mb-4 flex justify-center gap-2'>
              <InputSelect
                className='w-24 md:w-36'
                candidates={themeOptions}
                selected={templateTheme}
                setSelected={(value: string) => setTemplateTheme(value)}
              />
              <PrimaryButton click={handlePaste}>反映</PrimaryButton>
            </div>
          </div>
          <ThemeEdit theme={theme} setTheme={setTheme} />
        </>
      )}
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
              <div className='text-xs'>{children}</div>
            </Modal>
          )}
        </>
      )}
    </label>
  )
}
