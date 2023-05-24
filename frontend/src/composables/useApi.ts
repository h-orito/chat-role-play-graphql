import { Ref } from 'vue'
import { UseFetchOptions } from 'nuxt/dist/app/composables'
import { refreshAccessTokenIfNeeded } from '~/components/auth/auth0'

export const useApi = async <T, U>(
  url: string,
  options?: UseFetchOptions<T>
): Promise<U> => {
  const accessToken = await refreshAccessTokenIfNeeded()
  console.log(accessToken)
  const headers = !!accessToken
    ? {
        Authorization: `Bearer ${accessToken}`
      }
    : undefined

  const config = useRuntimeConfig()
  const { data, error } = (await useFetch(url, {
    ...options,
    headers,
    baseURL: config.apiBase,
    onResponse({ response }) {
      return response._data
    }
  })) as {
    data: Ref<U>
    error: Ref<Error | boolean>
  }

  if (error.value) {
    console.log(error.value)
    throw error
  }

  return data.value
}
