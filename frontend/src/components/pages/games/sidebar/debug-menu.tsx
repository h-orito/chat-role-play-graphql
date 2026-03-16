import {
  DebugMessagesDocument,
  DebugMessagesMutation
} from '@/lib/generated/graphql'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useGameValue } from '../game-hook'

export const DebugMenu = () => {
  const game = useGameValue()
  const [registerMessage] = useMutation<DebugMessagesMutation>(
    DebugMessagesDocument
  )
  const router = useRouter()
  const registerDebugMessages = async () => {
    await registerMessage({
      variables: {
        input: {
          gameId: game.id
        }
      }
    })
    router.reload()
  }

  if (process.env.NEXT_PUBLIC_ENV !== 'local') return <></>
  return (
    <div className='base-border border-t py-2'>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => registerDebugMessages()}
      >
        <UserPlusIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>100回発言</p>
      </button>
    </div>
  )
}
