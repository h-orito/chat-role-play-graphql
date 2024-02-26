import {
  Message,
  MessageType,
  NewMessage,
  TalkDocument,
  TalkDryRunDocument,
  TalkDryRunMutation,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import SubmitButton from '@/components/button/submit-button'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'
import DescriptionMessage from '@/components/pages/games/article/message-area/message-area/messages-area/message/description-message'
import InputText from '@/components/form/input-text'
import { useGameValue, useMyselfValue } from '../game-hook'

type Props = {
  handleCompleted: () => void
}

interface FormInput {
  name: string
  talkMessage: string
}

export interface TalkDescriptionRefHandle {
  shouldWarnClose(): boolean
}

const TalkDescription = forwardRef<TalkDescriptionRefHandle, Props>(
  (props: Props, ref: any) => {
    const { handleCompleted } = props
    const game = useGameValue()
    const myself = useMyselfValue()!
    const { control, formState, handleSubmit, setValue, watch } =
      useForm<FormInput>({
        defaultValues: {
          name: myself.name,
          talkMessage: ''
        }
      })
    const canSubmit: boolean = formState.isValid && !formState.isSubmitting

    const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument)
    const [talk] = useMutation<TalkMutation>(TalkDocument, {
      onCompleted() {
        init()
        handleCompleted()
      }
    })

    const [preview, setPreview] = useState<Message | null>(null)

    const init = () => {
      setPreview(null)
      setValue('name', myself.name)
      setValue('talkMessage', '')
    }

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const mes = {
          gameId: game.id,
          type: MessageType.Description,
          iconId: null,
          name: data.name,
          replyToMessageId: null,
          text: data.talkMessage,
          isConvertDisabled: false // TODO
        } as NewMessage
        if (preview != null) {
          talk({
            variables: {
              input: mes
            } as TalkMutationVariables
          })
        } else {
          const { data } = await talkDryRun({
            variables: {
              input: mes
            } as TalkMutationVariables
          })
          if (data?.registerMessageDryRun == null) return
          setPreview(data.registerMessageDryRun.message as Message)
          const selector = document.querySelector('#talk-description')!
          selector.scroll({
            top: selector.scrollHeight,
            behavior: 'smooth'
          })
        }
      },
      [talk, formState]
    )

    const talkMessage = watch('talkMessage')
    useImperativeHandle(ref, () => ({
      shouldWarnClose() {
        return 0 < talkMessage.length
      }
    }))
    const updateTalkMessage = (str: string) => setValue('talkMessage', str)

    const scrollToPreview = () => {
      document.querySelector('#description-preview')!.scrollIntoView({
        behavior: 'smooth'
      })
    }

    return (
      <div id='talk-description'>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className='mb-2'>
            <p className='text-xs font-bold'>発言装飾</p>
            <div className='flex'>
              <TalkTextDecorators
                selector='#talkMessage'
                setMessage={updateTalkMessage}
              />
            </div>
          </div>
          <div>
            <p className='text-xs font-bold'>ト書き</p>
            <InputTextarea
              name='talkMessage'
              textareaclassname='description'
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
          </div>
          <div id='description-preview' className='mt-4 flex justify-end'>
            <SubmitButton
              label={preview ? 'プレビュー内容で送信' : 'プレビュー'}
              disabled={!canSubmit}
            />
            {preview && (
              <SecondaryButton className='ml-2' click={() => setPreview(null)}>
                キャンセル
              </SecondaryButton>
            )}
          </div>
          {preview && (
            <DescriptionPreview
              preview={preview}
              scrollToPreview={scrollToPreview}
            />
          )}
        </form>
      </div>
    )
  }
)

export default TalkDescription

const DescriptionPreview = ({
  preview,
  scrollToPreview
}: {
  preview: Message | null
  scrollToPreview: () => void
}) => {
  useEffect(() => {
    scrollToPreview()
  }, [])

  return (
    <div className='my-4 border-t border-gray-300 pt-2'>
      <p className='font-bold'>プレビュー</p>
      <div>
        <DescriptionMessage message={preview!} openFavoritesModal={() => {}} />
      </div>
    </div>
  )
}
