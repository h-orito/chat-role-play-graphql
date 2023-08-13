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
        await loginWithRedirect()
        return
      default:
        throw error
    }
  }
}
