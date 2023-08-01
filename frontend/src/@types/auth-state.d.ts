type AuthState = {
  isAuthenticated: boolean
  user: import('@auth0/nextjs-auth0/client').UserProfile | null
  userId: string | null
  userName: string | null
  myself: User | null
}
