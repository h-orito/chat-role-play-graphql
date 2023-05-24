import { ComputedRef } from 'vue'

export const useLoading = (): ComputedRef<boolean> => {
  const { $auth0 } = useNuxtApp()
  return computed(() => $auth0.isLoading.value)
}
