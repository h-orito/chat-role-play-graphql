import '@/components/layout/globals.css'
import React, { ReactElement, ReactNode } from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/auth'
import GraphqlProvider from '@/components/graphql/graphql'
import { CookiesProvider } from 'react-cookie'
import RootLayout from '@/components/layout/layout'
import { NextPage } from 'next'
import { Provider as JotaiProvider } from 'jotai'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <AuthProvider>
      <GraphqlProvider>
        <CookiesProvider defaultSetOptions={{ path: '/chat-role-play/' }}>
          <JotaiProvider>
            {getLayout(
              <RootLayout>
                <Component {...pageProps} />
              </RootLayout>
            )}
          </JotaiProvider>
        </CookiesProvider>
      </GraphqlProvider>
    </AuthProvider>
  )
}
