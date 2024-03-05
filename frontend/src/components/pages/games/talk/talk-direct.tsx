import Image from 'next/image'
import {
  DirectMessage,
  GameParticipantGroup,
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  MessageType,
  NewDirectMessage,
  TalkDirectDocument,
  TalkDirectDryRunDocument,
  TalkDirectDryRunMutation,
  TalkDirectMutation,
  TalkDirectMutationVariables,
  TalkDocument,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import SubmitButton from '@/components/button/submit-button'
import DirectMessageComponent from '../article/message-area/direct-message/direct-message'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'
import {
  useGameValue,
  useIconsValue,
  useMyselfValue,
  useUserDisplaySettingsValue
} from '../game-hook'
import PrimaryButton from '@/components/button/primary-button'
import Portal from '@/components/modal/portal'
import { useUserPagingSettings } from '../user-settings'
import IconSelectButton from './icon-select-button'

type Props = {
  handleCompleted: () => void
  gameParticipantGroup: GameParticipantGroup
  talkAreaId: string
}

interface FormInput {
  name: string
  talkMessage: string
}

const TalkDirect = (props: Props) => {
  const game = useGameValue()
  const myself = useMyselfValue()!
  const { handleCompleted, gameParticipantGroup, talkAreaId } = props

  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      name: myself.name,
      talkMessage: ''
    }
  })

  const updateTalkMessage = (str: string) => setValue('talkMessage', str)

  // 選択中のアイコン
  const [iconId, setIconId] = useState<string>('')
  // 装飾やランダム変換しない
  const [isConvertDisabled, setIsConvertDisabled] = useState(false)
  // アイコン候補
  const icons = useIconsValue()
  useEffect(() => {
    setIconId(icons.length <= 0 ? '' : icons[0].id)
  }, [icons])

  const init = () => {
    setPreview(null)
    setValue('name', myself.name)
    setValue('talkMessage', '')
    setIconId(icons[0].id)
    setIsConvertDisabled(false)
  }

  const handleTalkCompleted = () => {
    init()
    handleCompleted()
  }

  const handlePreviewCanceled = () => {
    setPreview(null)
    setDryRunMessage(null)
    document.querySelector(`#${talkAreaId}`)!.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const canSubmit: boolean = formState.isValid && !formState.isSubmitting

  // 発言プレビュー
  const createNewDirectMessage = useCallback(
    (data: FormInput): NewDirectMessage => {
      return {
        gameId: game.id,
        gameParticipantGroupId: gameParticipantGroup.id,
        type: MessageType.TalkNormal,
        iconId: iconId,
        name: data.name,
        text: data.talkMessage,
        isConvertDisabled: isConvertDisabled
      } as NewDirectMessage
    },
    [game.id, gameParticipantGroup.id, iconId, isConvertDisabled, formState]
  )
  const [dryRunMessage, setDryRunMessage] = useState<NewDirectMessage | null>(
    null
  )
  const [preview, setPreview] = useState<DirectMessage | null>(null)
  const [talkDirectDryRun] = useMutation<TalkDirectDryRunMutation>(
    TalkDirectDryRunDocument
  )
  const onSubmitPreview: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const dm = createNewDirectMessage(data)
      const { data: previewData } = await talkDirectDryRun({
        variables: {
          input: dm
        } as TalkDirectMutationVariables
      })
      if (previewData?.registerDirectMessageDryRun == null) return
      setPreview(
        previewData.registerDirectMessageDryRun.directMessage as DirectMessage
      )
      setDryRunMessage(dm)
    },
    [createNewDirectMessage, talkDirectDryRun]
  )

  if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitPreview)}>
        <div className='mb-2'>
          <p>DM送信先: {gameParticipantGroup.name}</p>
        </div>
        <div className='my-2'>
          <p className='text-xs font-bold'>名前</p>
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
            disabled={preview != null}
          />
        </div>
        <div className='mb-1'>
          <p className='text-xs font-bold'>発言装飾</p>
          <div className='flex'>
            <TalkTextDecorators
              selector='#talkMessage'
              setMessage={updateTalkMessage}
            />
          </div>
        </div>
        <div className='flex'>
          <IconSelectButton
            icons={icons}
            iconId={iconId}
            setIconId={setIconId}
          />
          <div className='ml-2 flex-1'>
            <InputTextarea
              name='talkMessage'
              control={control}
              rules={{
                required: '必須です',
                maxLength: {
                  value: 1000,
                  message: '1000文字以内で入力してください'
                }
              }}
              minRows={5}
              maxLength={1000}
              disabled={preview != null}
            />
            <div className='-mt-5'>
              <input
                type='checkbox'
                id='convert-disabled'
                checked={isConvertDisabled}
                onChange={(e: any) => setIsConvertDisabled((prev) => !prev)}
              />
              <label htmlFor='convert-disabled' className='ml-1 text-xs'>
                装飾やランダム変換しない
              </label>
            </div>
          </div>
        </div>
        <div id='dm-preview' className='mt-4 flex justify-end'>
          <SubmitButton label='プレビュー' disabled={!canSubmit} />
        </div>
      </form>
      {preview && (
        <DirectPreview
          preview={preview}
          dryRunMessage={dryRunMessage}
          talkAreaId={props.talkAreaId}
          handleCompleted={handleTalkCompleted}
          handleCanceled={handlePreviewCanceled}
        />
      )}
    </div>
  )
}

export default TalkDirect

const DirectPreview = ({
  preview,
  dryRunMessage,
  talkAreaId,
  handleCompleted,
  handleCanceled
}: {
  preview: DirectMessage | null
  dryRunMessage: NewDirectMessage | null
  talkAreaId: string
  handleCompleted: () => void
  handleCanceled: () => void
}) => {
  const [userPagingSettings] = useUserPagingSettings()
  const previewAreaId = `${talkAreaId}-${
    userPagingSettings.isDesc ? 'top' : 'bottom'
  }-preview`
  useEffect(() => {
    if (userPagingSettings.isDesc) {
      document.querySelector(`#${talkAreaId}-top`)!.scrollIntoView({
        behavior: 'smooth'
      })
    } else {
      document.querySelector(`#${talkAreaId}-bottom`)!.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  const [talkDirect] = useMutation<TalkDirectMutation>(TalkDirectDocument, {
    onCompleted() {
      handleCompleted()
    }
  })
  const doTalk = async () => {
    talkDirect({
      variables: {
        input: dryRunMessage!
      } as TalkDirectMutationVariables
    })
  }

  return (
    <Portal target={`#${previewAreaId}`}>
      <div className='primary-border m-4 rounded-md border p-2'>
        <p className='text-xs'>
          以下の内容で発言してよろしいですか？（まだ発言されていません）
        </p>
        <div className='mt-2'>
          <DirectMessageComponent directMessage={preview!} preview={true} />
        </div>
        <div className='mt-4 flex justify-end'>
          <PrimaryButton click={doTalk}>発言する</PrimaryButton>
          <SecondaryButton className='ml-2' click={() => handleCanceled()}>
            キャンセル
          </SecondaryButton>
        </div>
      </div>
    </Portal>
  )
}
