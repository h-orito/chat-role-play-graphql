import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const createClient = async (
  isAuthenticated: boolean,
  getAccessTokenSilently: any
) => {
  const authLink = setContext(async (_, { headers }) => {
    const accessToken = isAuthenticated ? await getAccessTokenSilently() : null
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    }
  })

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })
}

let innerClient: ApolloClient<NormalizedCacheObject> | null = null
export const createInnerClient = () => {
  console.log(process.env.NEXT_PUBLIC_GRAPHQL_INNER_ENDPOINT)
  if (innerClient) return innerClient
  innerClient = new ApolloClient({
    ssrMode: true,
    uri: process.env.NEXT_PUBLIC_GRAPHQL_INNER_ENDPOINT,
    cache: new InMemoryCache()
  })
  return innerClient
}
