import {
  Game,
  GameParticipant,
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
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import SubmitButton from '@/components/button/submit-button'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'
import DescriptionMessage from '../article/message-area/message/description-message'
import InputText from '@/components/form/input-text'

type Props = {
  game: Game
  myself: GameParticipant
  closeWithoutWarning: () => void
  search: () => void
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
    const { game, myself, closeWithoutWarning, search } = props
    const { control, formState, handleSubmit, setValue, watch } =
      useForm<FormInput>({
        defaultValues: {
          name: myself.name,
          talkMessage: ''
        }
      })
    const canSubmit: boolean = formState.isValid && !formState.isSubmitting

    const [talkDryRun] = useMutation<TalkDryRunMutation>(TalkDryRunDocument, {
      onError(error) {
        console.error(error)
      }
    })
    const [talk] = useMutation<TalkMutation>(TalkDocument, {
      onCompleted() {
        closeWithoutWarning()
        search()
      },
      onError(error) {
        console.error(error)
      }
    })

    const [preview, setPreview] = useState<Message | null>(null)
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

    return (
      <div className='px-4 py-2'>
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
          <div className='mt-4 flex justify-end'>
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
            <div className='my-4 border-t border-gray-300 pt-2'>
              <p className='font-bold'>プレビュー</p>
              <div>
                <DescriptionMessage
                  message={preview!}
                  game={game}
                  myself={myself}
                  openProfileModal={() => {}}
                  openFavoritesModal={() => {}}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    )
  }
)

export default TalkDescription
