export const getAccessToken = async (
  isAuthenticated: boolean,
  getAccessTokenSilently: () => Promise<string>,
  loginWithRedirect: () => Promise<void>
) => {
  if (!isAuthenticated) return null

  try {
    return await getAccessTokenSilently()
  } catch (error: unknown) {
    const authError = error as { error?: string }
    switch (authError.error) {
      case 'login_required':
      case 'missing_refresh_token':
      case 'invalid_grant':
        await loginWithRedirect()
        return
      default:
        throw error
    }
  }
}
