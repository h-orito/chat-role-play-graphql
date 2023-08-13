import { Auth0Provider } from '@auth0/auth0-react'
import { useAuth0 } from '@auth0/auth0-react'
import PrimaryButton from '../button/primary-button'
import DangerButton from '../button/danger-button'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return <>{children}</>
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: location.href,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
      }}
      cacheLocation='localstorage'
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  )
}

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <PrimaryButton click={() => loginWithRedirect()}>ログイン</PrimaryButton>
  )
}

type LogoutButtonProps = {
  className?: string
}
export const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { logout } = useAuth0()
  const doLogout = (e: any) => {
    logout({
      logoutParams: { returnTo: window.location.origin + '/chat-role-play' }
    })
  }

  return (
    <DangerButton className={`${className}`} click={doLogout}>
      ログアウト
    </DangerButton>
  )
}
