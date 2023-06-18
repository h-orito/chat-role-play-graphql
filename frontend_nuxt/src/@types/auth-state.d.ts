type AuthState = {
  isAuthenticated: boolean
  user: import('@auth0/auth0-vue').User | null
  userId: string | undefined
  userName: string | undefined | null
  myself: User | null
}
