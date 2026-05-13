import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

type GetAccessTokenFn = (
  isAuthenticated: boolean,
  getAccessTokenSilently: () => Promise<string>,
  loginWithRedirect: () => Promise<void>
) => Promise<string | null | undefined>

export const createClient = async (
  isAuthenticated: boolean,
  getAccessTokenSilently: () => Promise<string>,
  loginWithRedirect: () => Promise<void>,
  getAccessToken: GetAccessTokenFn
) => {
  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessToken(
      isAuthenticated,
      getAccessTokenSilently,
      loginWithRedirect
    )
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    }
  })

  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  })
}

let innerClient: ApolloClient<NormalizedCacheObject> | null = null
export const createInnerClient = () => {
  if (innerClient) return innerClient
  const uri = process.env.GRAPHQL_INNER_ENDPOINT
  if (!uri) {
    throw new Error('GRAPHQL_INNER_ENDPOINT is not set')
  }
  innerClient = new ApolloClient({
    ssrMode: true,
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  })
  return innerClient
}
