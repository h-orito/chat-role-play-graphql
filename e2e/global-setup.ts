import { chromium } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { FRONTEND_PORT } from './config'

dotenv.config({ path: path.resolve(__dirname, '.env.e2e') })

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!
// useRefreshTokens: true のとき auth0-spa-js が offline_access を自動付加するため合わせる
const SCOPE = 'openid profile email offline_access'

const USER_A_EMAIL = process.env.E2E_USER_A_EMAIL!
const USER_A_PASSWORD = process.env.E2E_USER_A_PASSWORD!
const USER_B_EMAIL = process.env.E2E_USER_B_EMAIL!
const USER_B_PASSWORD = process.env.E2E_USER_B_PASSWORD!

const BASE_URL = `http://localhost:${FRONTEND_PORT}/chat-role-play`

type RopgResponse = {
  access_token: string
  id_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

async function fetchToken(email: string, password: string): Promise<RopgResponse> {
  const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      username: email,
      password,
      client_id: AUTH0_CLIENT_ID,
      audience: AUTH0_AUDIENCE,
      scope: SCOPE
    })
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ROPG failed for ${email}: ${body}`)
  }
  return res.json()
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
}

type Auth0CacheEntries = {
  mainKey: string
  mainValue: string
  idTokenKey: string
  idTokenValue: string
}

function buildAuth0CacheEntry(tokenResponse: RopgResponse): Auth0CacheEntries {
  const idTokenPayload = decodeJwtPayload(tokenResponse.id_token)
  const mainKey = `@@auth0spajs@@::${AUTH0_CLIENT_ID}::${AUTH0_AUDIENCE}::${SCOPE}`
  const decodedToken = {
    user: {
      sub: idTokenPayload.sub,
      nickname: idTokenPayload.nickname,
      name: idTokenPayload.name,
      picture: idTokenPayload.picture,
      email: idTokenPayload.email,
      email_verified: idTokenPayload.email_verified,
      updated_at: idTokenPayload.updated_at
    }
  }
  const mainValue = JSON.stringify({
    body: {
      access_token: tokenResponse.access_token,
      id_token: tokenResponse.id_token,
      refresh_token: tokenResponse.refresh_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in,
      scope: tokenResponse.scope,
      decodedToken
    },
    expiresAt: Math.floor(Date.now() / 1000) + (tokenResponse.expires_in as number)
  })
  // auth0-spa-js stores the id_token separately under this key
  // getIdToken() checks this key first via getIdTokenCacheKey(clientId)
  const idTokenKey = `@@auth0spajs@@::${AUTH0_CLIENT_ID}::@@user@@`
  const idTokenValue = JSON.stringify({
    id_token: tokenResponse.id_token,
    decodedToken
  })
  return { mainKey, mainValue, idTokenKey, idTokenValue }
}

async function saveStorageState(
  cacheEntries: Auth0CacheEntries,
  outputPath: string
): Promise<void> {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // LocalStorageを操作するためにoriginへ一度アクセスする
  await page.goto(BASE_URL)
  await page.evaluate(
    ({ mainKey, mainValue, idTokenKey, idTokenValue }) => {
      localStorage.setItem(mainKey, mainValue)
      // auth0-spa-js が getIdToken() で最初に探す専用キー
      localStorage.setItem(idTokenKey, idTokenValue)
    },
    cacheEntries
  )
  // auth0-spa-js の checkSession() がこの cookie の有無を確認する
  await context.addCookies([
    {
      name: `auth0.${AUTH0_CLIENT_ID}.is.authenticated`,
      value: 'true',
      domain: 'localhost',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 86400,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    }
  ])
  await context.storageState({ path: outputPath })
  await browser.close()
}

async function warmupRoutes(): Promise<void> {
  // next dev は初回アクセス時にルートを lazy compile するため、
  // E2E で使う主要ルートを先に踏んでおいてテスト本体の cold compile タイムアウトを避ける
  const routes = ['/chat-role-play', '/chat-role-play/create-game']
  for (const route of routes) {
    const url = `http://localhost:${FRONTEND_PORT}${route}`
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.warn(`warmup got ${res.status} for ${route}`)
      }
    } catch (e) {
      console.warn(`warmup failed for ${route}:`, e)
    }
  }
}

export default async function globalSetup() {
  console.log('Fetching Auth0 tokens via ROPG...')

  const [tokenA, tokenB] = await Promise.all([
    fetchToken(USER_A_EMAIL, USER_A_PASSWORD),
    fetchToken(USER_B_EMAIL, USER_B_PASSWORD)
  ])

  const cacheA = buildAuth0CacheEntry(tokenA)
  const cacheB = buildAuth0CacheEntry(tokenB)

  await saveStorageState(cacheA, path.resolve(__dirname, '.auth/user-a.json'))
  await saveStorageState(cacheB, path.resolve(__dirname, '.auth/user-b.json'))

  console.log('Auth state saved: .auth/user-a.json, .auth/user-b.json')

  console.log('Warming up Next.js dev server routes...')
  await warmupRoutes()
}
