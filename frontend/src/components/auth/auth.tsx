import { Auth0Provider } from '@auth0/auth0-react'
import { useAuth0 } from '@auth0/auth0-react'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return <>{children}</>
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.href,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
      }}
    >
      {children}
    </Auth0Provider>
  )
}

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()
  return <button onClick={() => loginWithRedirect()}>Log In</button>
}

export const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.href } })
      }
    >
      Logout
    </button>
  )
}
