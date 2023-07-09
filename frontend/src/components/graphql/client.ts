import {
  ApolloClient,
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

  const { createUploadLink } = require('apollo-upload-client')
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache'
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
        fetchPolicy: 'no-cache'
      }
    }
  })
  return innerClient
}
