import {
  Message,
  NewMessage,
  TalkDocument,
  TalkMutation,
  TalkMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import TalkMessage from '@/components/pages/games/article/message-area/message-area/messages-area/message/talk-message'
import SecondaryButton from '@/components/button/secondary-button'
import PrimaryButton from '@/components/button/primary-button'
import Portal from '@/components/modal/portal'
import { useUserPagingSettings } from '../user-settings'

type Props = {
  preview: Message | null
  dryRunMessage: NewMessage | null
  talkAreaId: string
  handleCompleted: () => void
  handleCanceled: () => void
}

export default function TalkPreview({
  preview,
  dryRunMessage,
  talkAreaId,
  handleCompleted,
  handleCanceled
}: Props) {
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
    // mount 時のみスクロール（isDesc / talkAreaId の変化には追従しない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [talk] = useMutation<TalkMutation, TalkMutationVariables>(
    TalkDocument,
    {
      onCompleted() {
        handleCompleted()
      }
    }
  )
  const doTalk = async () => {
    talk({
      variables: {
        input: dryRunMessage!
      }
    })
  }

  return (
    <Portal target={`#${previewAreaId}`}>
      <div className='primary-border m-4 rounded-md border p-2'>
        <p className='text-xs'>
          以下の内容で発言してよろしいですか？（まだ発言されていません）
        </p>
        <div className='mt-2'>
          <TalkMessage
            message={preview!}
            handleReply={() => {}}
            preview={true}
          />
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
