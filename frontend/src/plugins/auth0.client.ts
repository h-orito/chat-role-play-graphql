import { defineNuxtPlugin } from '#app'
import { Auth0Plugin, createAuth0 } from '@auth0/auth0-vue'

declare module '#app' {
  interface NuxtApp {
    $auth0: Auth0Plugin
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: config.public.auth0Audience
    }
  })
  nuxtApp.vueApp.use(auth0)
  nuxtApp.provide('auth0', auth0)
})
