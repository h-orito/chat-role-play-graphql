import { useAuth0 } from '@auth0/auth0-react'

const useAuth = (): AuthState => {
  const { user, isLoading } = useAuth0()
  return {
    isAuthenticated: !!user,
    user: user ?? null,
    userId: user?.sub ?? null,
    userName: user?.nickname ?? null,
    myself: null
  }
}

export default useAuth
