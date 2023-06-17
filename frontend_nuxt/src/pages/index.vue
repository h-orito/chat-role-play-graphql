<template>
  <div v-if="isLoading">Loading...</div>
  <div else>
    <Title>サイト名何にしようかな</Title>
    <p v-if="isLoading">Now Loading!!!!</p>
    <div>
      <input type="button" value="Login" @click="login" />
      <input type="button" value="Logout" @click="logout" />
      <input type="button" value="お試しpublic" @click="sandbox" />
      <input type="button" value="お試しprivate" @click="findGames" />
      <input v-model="gameName" type="text" />
      <input type="button" value="ゲーム作成" @click="registerGame" />
    </div>
    <p>{{ authState }}</p>
    <p>{{ games }}</p>
  </div>
</template>

<script setup lang="ts">
import {
  login as doLogin,
  logout as doLogout,
  updateAuth0LoginState
} from '~/components/auth/auth0'
import {
  GameDocument,
  GamesDocument,
  RegisterGameDocument,
  Game,
  SimpleGame,
  GameQueryVariables,
  GamesQueryVariables,
  RegisterGameMutationVariables
} from '~/lib/generated/graphql'

const authState = await useAuth()
const isAuthenticated = computed(() => authState.value.isAuthenticated)
watch(isAuthenticated, async (_new, _old) => {
  await updateAuth0LoginState()
})

const login = () => doLogin()
const logout = () => doLogout()
const sandbox = async () => {
  const { data } = await useAsyncQuery<Game>(GameDocument, {
    id: 'R2FtZTox'
  } as GameQueryVariables)
  console.log(data.value)
}
const games = ref<Array<SimpleGame>>([])
const findGames = async () => {
  const { data } = await useAsyncQuery<Array<SimpleGame>>(GamesDocument, {
    pageSize: 10,
    pageNumber: 1
  } as GamesQueryVariables)
  games.value = data.value || []
}

onMounted(async () => {
  if (isAuthenticated.value) await findGames()
})

const gameName = ref('')
const registerGame = async () => {
  await useAsyncQuery<Game>(RegisterGameDocument, {
    input: {
      name: gameName.value
    }
  } as RegisterGameMutationVariables)
  gameName.value = ''
  await findGames()
}

const isLoading = useLoading()
</script>
