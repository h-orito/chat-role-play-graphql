import {
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  IconsQueryVariables
} from '@/lib/generated/graphql'
import { useQuery } from '@apollo/client'
import { ReactNode, createContext, useContext } from 'react'
import { useMyselfValue } from './myself-context'

const IconsContext = createContext<Array<GameParticipantIcon> | null>(null)

type Props = {
  children: ReactNode
}

export const IconsProvider = ({ children }: Props) => {
  const myself = useMyselfValue()
  const { data } = useQuery<IconsQuery, IconsQueryVariables>(IconsDocument, {
    variables: { participantId: myself?.id ?? '' },
    skip: !myself
  })
  const icons = data?.gameParticipantIcons ?? []
  return <IconsContext.Provider value={icons}>{children}</IconsContext.Provider>
}

export const useIconsValue = (): Array<GameParticipantIcon> => {
  const icons = useContext(IconsContext)
  return icons ?? []
}
