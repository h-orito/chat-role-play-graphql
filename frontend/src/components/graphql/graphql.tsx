import { ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { createClient } from './client'
import { getAccessToken } from '../auth/auth0'

const defaultClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
})

const GraphqlProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    loginWithRedirect
  } = useAuth0()
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    const generateClient = async () => {
      if (isLoading) return
      const generatedClient = await createClient(
        isAuthenticated,
        getAccessTokenSilently,
        loginWithRedirect,
        getAccessToken
      )
      setClient(generatedClient)
    }
    generateClient()
  }, [isLoading])
  if (isLoading || !client) return <>Loading...</>

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default GraphqlProvider
