import { useCallback, useEffect, useState } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import InputSelect from '@/components/form/input-select'
import {
  UserDisplaySettings,
  UserPagingSettings,
  useUserDisplaySettings,
  useUserPagingSettings
} from '../user-settings'
import PrimaryButton from '@/components/button/primary-button'
import RadioGroup from '@/components/form/radio-group'
import { useRouter } from 'next/router'
import {
  GameParticipantSetting,
  GameParticipantSettingDocument,
  GameParticipantSettingQuery,
  GameParticipantSettingQueryVariables,
  UpdateGameParticipantSetting,
  UpdateGameParticipantSettingDocument,
  UpdateGameParticipantSettingMutation,
  UpdateGameParticipantSettingMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import InputText from '@/components/form/input-text'
import { SubmitHandler, useForm } from 'react-hook-form'
import SubmitButton from '@/components/button/submit-button'
import { themeOptions } from '@/components/theme/theme'
import { useGameValue, useMyselfValue } from '../game-hook'

export default function UserSettingsComponent({
  close
}: {
  close: (e: any) => void
}) {
  const myself = useMyselfValue()
  return (
    <div className='text-center'>
      <div className='my-4 flex justify-center'>
        <PagingSettings />
      </div>
      <hr />
      <div className='my-4 flex justify-center'>
        <DisplaySettings />
      </div>
      {myself && (
        <>
          <hr />
          <div className='my-4 flex justify-center'>
            <NotificationSettings />
          </div>
        </>
      )}
    </div>
  )
}

const PagingSettings = () => {
  const [userPagingSettings, setUserPagingSettings] = useUserPagingSettings()
  const pageSizeCandidates = [10, 20, 50, 100, 200, 500, 1000]
  const orderCandidates = [
    {
      label: '昇順',
      value: 'asc'
    },
    {
      label: '降順',
      value: 'desc'
    }
  ]
  const [pageSize, setPageSize] = useState(userPagingSettings.pageSize)
  const [order, setOrder] = useState(userPagingSettings.isDesc ? 'desc' : 'asc')
  const router = useRouter()
  const save = () => {
    setUserPagingSettings({
      pageSize: pageSize,
      isDesc: order === 'desc'
    } as UserPagingSettings)
    router.reload()
  }
  return (
    <div>
      <div className='mb-4'>
        <FormLabel label='ページング' />
      </div>
      <FormLabel label='1ページあたりの表示数' />
      <div className='mb-4'>
        <InputSelect
          className='w-64 md:w-96'
          candidates={pageSizeCandidates.map((n) => ({
            label: `${n}件`,
            value: n
          }))}
          selected={userPagingSettings.pageSize}
          setSelected={(value: number) => setPageSize(value)}
        />
      </div>
      <FormLabel label='表示順' />
      <div className='mb-4 mt-1 flex justify-center'>
        <RadioGroup
          name='paging-order'
          candidates={orderCandidates}
          selected={order}
          setSelected={setOrder}
        />
      </div>
      <div className='flex justify-center'>
        <PrimaryButton click={() => save()}>保存</PrimaryButton>
      </div>
    </div>
  )
}

const DisplaySettings = () => {
  const [userDisplaySettings, setUserDisplaySettings] = useUserDisplaySettings()
  const [themeName, setThemeName] = useState(userDisplaySettings.themeName)
  const [iconSizeRatio, setIconSizeRatio] = useState(
    userDisplaySettings.iconSizeRatio ?? 1
  )
  const router = useRouter()
  const save = () => {
    setUserDisplaySettings({
      themeName: themeName,
      iconSizeRatio: iconSizeRatio
    } as UserDisplaySettings)
    router.reload()
  }
  const candidates = [
    ...themeOptions,
    { label: 'ゲームオリジナル', value: 'original' }
  ]
  return (
    <div>
      <div className='mb-4'>
        <FormLabel label='表示設定' />
      </div>
      <FormLabel label='テーマ'>
        ゲームオリジナルを選択していて、ゲームオリジナルテーマが存在しない場合、「light」で表示されます。
      </FormLabel>
      <div className='mb-4'>
        <InputSelect
          className='w-64 md:w-96'
          candidates={candidates}
          selected={userDisplaySettings.themeName}
          setSelected={(value: string) => setThemeName(value)}
        />
      </div>
      <FormLabel label='アイコン表示サイズ'>
        アイコンを通常よりも大きく表示することができます。
      </FormLabel>
      <div className='mb-4'>
        <InputSelect
          className='w-64 md:w-96'
          candidates={[
            {
              label: '通常',
              value: 1
            },
            {
              label: '1.5倍',
              value: 1.5
            },
            {
              label: '2倍',
              value: 2
            }
          ]}
          selected={userDisplaySettings.iconSizeRatio ?? 1}
          setSelected={(value: number) => setIconSizeRatio(value)}
        />
      </div>
      <div className='flex justify-center'>
        <PrimaryButton click={() => save()}>保存</PrimaryButton>
      </div>
    </div>
  )
}

interface NotificationFormInput {
  webhookUrl: string
  shouldNotifyGameStart: boolean
  shouldNotifyReply: boolean
  shouldNotifySecret: boolean
  shouldNotifyDirectMessage: boolean
  keyword: string
}

const NotificationSettings = () => {
  const game = useGameValue()
  const { register, control, formState, handleSubmit, setValue, watch } =
    useForm<NotificationFormInput>({
      defaultValues: {
        webhookUrl: '',
        shouldNotifyGameStart: false,
        shouldNotifyReply: false,
        shouldNotifySecret: false,
        shouldNotifyDirectMessage: false,
        keyword: ''
      }
    })
  const [fetchSetting] = useLazyQuery<GameParticipantSettingQuery>(
    GameParticipantSettingDocument
  )
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchSetting({
        variables: {
          gameId: game.id
        } as GameParticipantSettingQueryVariables
      })
      if (data?.gameParticipantSetting) {
        const setting = data.gameParticipantSetting as GameParticipantSetting
        setValue('webhookUrl', setting.notification?.discordWebhookUrl || '')
        setValue(
          'shouldNotifyGameStart',
          setting.notification?.game?.start || false
        )
        setValue(
          'shouldNotifyReply',
          setting.notification?.message?.reply || false
        )
        setValue(
          'shouldNotifySecret',
          setting.notification?.message?.secret || false
        )
        setValue(
          'shouldNotifyDirectMessage',
          setting.notification?.message?.directMessage || false
        )
        setValue(
          'keyword',
          setting.notification?.message?.keywords?.join(' ') || ''
        )
      }
    }
    fetch()
  }, [])

  const [update] = useMutation<UpdateGameParticipantSettingMutation>(
    UpdateGameParticipantSettingDocument
  )
  const router = useRouter()
  const onSubmit: SubmitHandler<NotificationFormInput> = useCallback(
    async (data) => {
      await update({
        variables: {
          input: {
            gameId: game.id,
            notification: {
              discordWebhookUrl: data.webhookUrl,
              game: {
                participate: false,
                start: data.shouldNotifyGameStart
              },
              message: {
                reply: data.shouldNotifyReply,
                secret: data.shouldNotifySecret,
                directMessage: data.shouldNotifyDirectMessage,
                keywords: data.keyword
                  .replace(/[ 　]/g, ' ')
                  .split(' ')
                  .filter((k) => k !== '')
              }
            }
          } as UpdateGameParticipantSetting
        } as UpdateGameParticipantSettingMutationVariables
      })
      router.reload()
    },
    [update]
  )

  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const currentWebhookUrl = watch('webhookUrl')
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-4'>
        <FormLabel label='通知' />
      </div>
      <FormLabel label='Discord Webhook URL' />
      <InputText name='webhookUrl' control={control} />
      <div className='my-2'>
        <input
          type='checkbox'
          id='notification-game-start'
          {...register('shouldNotifyGameStart')}
          disabled={currentWebhookUrl === ''}
        />
        <label htmlFor='notification-game-start' className='ml-2 text-xs'>
          ゲーム開始通知
        </label>
      </div>
      <div className='my-2'>
        <input
          type='checkbox'
          id='notification-reply'
          {...register('shouldNotifyReply')}
          disabled={currentWebhookUrl === ''}
        />
        <label htmlFor='notification-reply' className='ml-2 text-xs'>
          リプライ通知
        </label>
      </div>
      <div className='my-2'>
        <input
          type='checkbox'
          id='notification-secret'
          {...register('shouldNotifySecret')}
          disabled={currentWebhookUrl === ''}
        />
        <label htmlFor='notification-secret' className='ml-2 text-xs'>
          秘話通知
        </label>
      </div>
      <div className='my-2'>
        <input
          type='checkbox'
          id='notification-direct-message'
          {...register('shouldNotifyDirectMessage')}
          disabled={currentWebhookUrl === ''}
        />
        <label htmlFor='notification-direct-message' className='ml-2 text-xs'>
          ダイレクトメッセージ通知
        </label>
      </div>
      <FormLabel label='通知キーワード' />
      <InputText
        name='keyword'
        control={control}
        disabled={currentWebhookUrl === ''}
        placeholder='スペース区切り'
      />
      <div className='mt-4 flex justify-center'>
        <SubmitButton label='保存' disabled={!canSubmit} />
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
            <QuestionMarkCircleIcon className='ml-1 h-4 w-4 text-blue-500' />
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
