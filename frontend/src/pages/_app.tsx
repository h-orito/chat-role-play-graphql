import '@/components/layout/globals.css'
import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/auth'
import GraphqlProvider from '@/components/graphql/graphql'
import { CookiesProvider } from 'react-cookie'
import RootLayout from '@/components/layout/layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GraphqlProvider>
        <CookiesProvider defaultSetOptions={{ path: '/chat-role-play/' }}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </CookiesProvider>
      </GraphqlProvider>
    </AuthProvider>
  )
}
