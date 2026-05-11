import {
  GameParticipant,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables
} from '@/lib/generated/graphql'
import { useQuery } from '@apollo/client'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo
} from 'react'

type MyselfContextValue = {
  myself: GameParticipant | null
  refetch: () => Promise<unknown>
}

const MyselfContext = createContext<MyselfContextValue | null>(null)

type Props = {
  gameId: string
  children: ReactNode
}

export const MyselfProvider = ({ gameId, children }: Props) => {
  const { data, refetch } = useQuery<
    MyGameParticipantQuery,
    MyGameParticipantQueryVariables
  >(MyGameParticipantDocument, {
    variables: { gameId },
    fetchPolicy: 'no-cache'
  })
  const myself = (data?.myGameParticipant as GameParticipant | null) ?? null
  const refetchCallback = useCallback(async () => {
    await refetch()
  }, [refetch])
  const value = useMemo<MyselfContextValue>(
    () => ({ myself, refetch: refetchCallback }),
    [myself, refetchCallback]
  )
  return (
    <MyselfContext.Provider value={value}>{children}</MyselfContext.Provider>
  )
}

export const useMyselfValue = (): GameParticipant | null => {
  const ctx = useContext(MyselfContext)
  if (!ctx) {
    throw new Error('useMyselfValue must be used within MyselfProvider')
  }
  return ctx.myself
}

export const useMyself = (): [
  GameParticipant | null,
  () => Promise<unknown>
] => {
  const ctx = useContext(MyselfContext)
  if (!ctx) {
    throw new Error('useMyself must be used within MyselfProvider')
  }
  return [ctx.myself, ctx.refetch]
}
