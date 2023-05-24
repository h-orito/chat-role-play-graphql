import { LocationQuery } from 'vue-router'

export const login = async (): Promise<void> => {
  if (process.server) return
  const { $auth0 } = useNuxtApp()
  const { loginWithRedirect } = $auth0
  await loginWithRedirect()
}

export const logout = async (): Promise<void> => {
  if (process.server) return
  const { $auth0 } = useNuxtApp()
  const { logout: doLogout } = $auth0
  const { onLogout } = useApollo()
  await onLogout('default', false) // apollo logout
  await doLogout({ logoutParams: { returnTo: window.location.origin } })
}

export const updateAuth0LoginState = async (): Promise<void> => {
  const { $auth0 } = useNuxtApp()
  const { isAuthenticated } = $auth0
  const { onLogin, onLogout } = useApollo()
  if (isAuthenticated.value) {
    const token = await refreshAccessTokenIfNeeded()
    if (!token) return
    await onLogin(token) // apollo login
  } else {
    await onLogout('default', false) // apollo logout
  }
}

export const refreshAccessTokenIfNeeded = async (): Promise<string | null> => {
  const { $auth0 } = useNuxtApp()
  const { isAuthenticated, getAccessTokenSilently } = $auth0
  if (!isAuthenticated.value) return null
  return await getAccessTokenSilently()
}
