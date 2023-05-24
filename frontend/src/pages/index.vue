<template>
  <div v-if="isLoading">Loading...</div>
  <div else>
    <Title>サイト名何にしようかな</Title>
    <p v-if="isLoading">Now Loading!!!!</p>
    <div>
      <input type="button" value="Login" @click="login" />
      <input type="button" value="Logout" @click="logout" />
      <input type="button" value="お試しpublic" @click="sandbox" />
      <input type="button" value="お試しprivate" @click="sandboxPrivate" />
    </div>
    <p>{{ authState }}</p>
  </div>
</template>

<script setup lang="ts">
import {
  login as doLogin,
  logout as doLogout,
  updateAuth0LoginState
} from '~/components/auth/auth0'

const authState = await useAuth()
const isAuthenticated = computed(() => authState.value.isAuthenticated)
watch(isAuthenticated, async (_new, _old) => {
  await updateAuth0LoginState()
})

const login = () => doLogin()
const logout = () => doLogout()
const sandbox = async () => {
  // useApi('api/v1/public')
  await useAsyncQuery(gameQuery, gameValiable)
}
const sandboxPrivate = async () => {
  // useApi('api/v1/private')
  await useAsyncQuery(gamesQuery, gamesValiable)
}
const isLoading = useLoading()

const gamesQuery = gql`
  query games($pageSize: Int!, $pageNumber: Int!) {
    games(query: { paging: { pageSize: $pageSize, pageNumber: $pageNumber } }) {
      id
      name
      participantsCount
    }
  }
`
const gamesValiable = {
  pageSize: 10,
  pageNumber: 1
}

const gameQuery = gql`
  query game($id: ID!) {
    game(id: $id) {
      id
      name
      participants(paging: { pageSize: 10, pageNumber: 1 }) {
        id
      }
    }
  }
`
const gameValiable = {
  id: 'R2FtZTox'
}
</script>
