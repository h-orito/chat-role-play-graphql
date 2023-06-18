import { ApolloProvider } from '@apollo/client'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { createClient } from './client'

// export const createClient = async (
//   isAuthenticated: boolean,
//   getAccessTokenSilently: any
// ) => {
//   const authLink = setContext(async (_, { headers }) => {
//     const accessToken = isAuthenticated ? await getAccessTokenSilently() : null
//     return {
//       headers: {
//         ...headers,
//         authorization: accessToken ? `Bearer ${accessToken}` : ''
//       }
//     }
//   })

//   const httpLink = createHttpLink({
//     uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
//   })
//   return new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache()
//   })
// }

const defaultClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
})

const GraphqlProvider = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const [client, setClient] = useState<any>(defaultClient)

  useEffect(() => {
    const generateClient = async () => {
      const generatedClient = await createClient(
        isAuthenticated,
        getAccessTokenSilently
      )
      setClient(generatedClient)
    }
    generateClient()
  }, [isAuthenticated, getAccessTokenSilently])
  if (isLoading) return <>isLoading...</>

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default GraphqlProvider
