import { ComputedRef } from 'vue'

export const useAuth = (): ComputedRef<AuthState> => {
  const { $auth0 } = useNuxtApp()
  const auth = computed(() => ({
    isAuthenticated: $auth0.isAuthenticated.value,
    user: $auth0.user.value ?? null,
    userId: $auth0.user.value?.sub,
    userName: $auth0.user.value?.nickname ?? null,
    myself: null
  }))
  return auth
}
