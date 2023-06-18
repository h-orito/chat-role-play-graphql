import '@/components/layout/globals.css'
import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/auth'
import GraphqlProvider from '@/components/graphql/graphql'
import RootLayout from '@/components/layout/layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GraphqlProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </GraphqlProvider>
    </AuthProvider>
  )
}
