import {
  MyPlayerDocument,
  MyPlayerQuery,
  MyPlayerQueryVariables,
  Player
} from '@/lib/generated/graphql'
import { useQuery } from '@apollo/client'
import { ReactNode, createContext, useContext } from 'react'

const MyPlayerContext = createContext<Player | null | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const MyPlayerProvider = ({ children }: Props) => {
  const { data } = useQuery<MyPlayerQuery, MyPlayerQueryVariables>(
    MyPlayerDocument
  )
  const myPlayer = (data?.myPlayer as Player | null | undefined) ?? null
  return (
    <MyPlayerContext.Provider value={myPlayer}>
      {children}
    </MyPlayerContext.Provider>
  )
}

export const useMyPlayerValue = (): Player | null => {
  const value = useContext(MyPlayerContext)
  if (value === undefined) {
    throw new Error('useMyPlayerValue must be used within MyPlayerProvider')
  }
  return value
}
