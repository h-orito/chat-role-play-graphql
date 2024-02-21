export const getAccessToken = async (
  isAuthenticated: boolean,
  getAccessTokenSilently: any,
  loginWithRedirect: any
) => {
  if (!isAuthenticated) return null

  try {
    return await getAccessTokenSilently()
  } catch (error: any) {
    switch (error.error) {
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
