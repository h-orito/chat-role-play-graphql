import { MessagesQuery } from '@/lib/generated/graphql'
import { ReactNode, createContext, useContext } from 'react'

const MessagesQueryContext = createContext<MessagesQuery | null>(null)

type Props = {
  initialMessagesQuery: MessagesQuery
  children: ReactNode
}

export const MessagesQueryProvider = ({
  initialMessagesQuery,
  children
}: Props) => (
  <MessagesQueryContext.Provider value={initialMessagesQuery}>
    {children}
  </MessagesQueryContext.Provider>
)

export const useInitialMessagesQuery = (): MessagesQuery => {
  const value = useContext(MessagesQueryContext)
  if (value === null) {
    throw new Error(
      'useInitialMessagesQuery must be used within MessagesQueryProvider'
    )
  }
  return value
}
