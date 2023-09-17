import '@/components/layout/globals.css'
import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/auth'
import GraphqlProvider from '@/components/graphql/graphql'
import { CookiesProvider } from 'react-cookie'
import RootLayout from '@/components/layout/layout'
import { NextPage } from 'next'

export type NextPageWithTheme<P = {}, IP = P> = NextPage<P, IP> & {
  getThemeName?: () => string
}

type AppPropsWithTheme = AppProps & {
  Component: NextPageWithTheme
}

export default function App({ Component, pageProps }: AppPropsWithTheme) {
  const getThemeName = Component.getThemeName || (() => 'light')
  return (
    <AuthProvider>
      <GraphqlProvider>
        <CookiesProvider defaultSetOptions={{ path: '/chat-role-play/' }}>
          <RootLayout themeName={getThemeName()}>
            <Component {...pageProps} />
          </RootLayout>
        </CookiesProvider>
      </GraphqlProvider>
    </AuthProvider>
  )
}
