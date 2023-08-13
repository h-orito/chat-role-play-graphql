import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const createClient = async (
  isAuthenticated: boolean,
  getAccessTokenSilently: any,
  loginWithRedirect: any,
  getAccessToken: any
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

  const { createUploadLink } = require('apollo-upload-client')
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  })
}

let innerClient: ApolloClient<NormalizedCacheObject> | null = null
export const createInnerClient = () => {
  if (innerClient) return innerClient
  innerClient = new ApolloClient({
    ssrMode: true,
    uri: process.env.NEXT_PUBLIC_GRAPHQL_INNER_ENDPOINT,
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
