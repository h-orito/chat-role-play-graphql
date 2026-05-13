import {
  ChangePeriodDocument,
  ChangePeriodMutation,
  ChangePeriodMutationVariables,
  Game,
  GameParticipant,
  Player
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { useGameValue } from './contexts/game-context'
import { defaultDisplaySettings, useUserDisplaySettings } from './user-settings'

export { GameProvider, useGameValue } from './contexts/game-context'
export {
  MyselfProvider,
  useMyself,
  useMyselfValue
} from './contexts/myself-context'
export { IconsProvider, useIconsValue } from './contexts/icons-context'
export {
  MyPlayerProvider,
  useMyPlayerValue
} from './contexts/my-player-context'
export { SidebarProvider, useSidebarOpen } from './contexts/sidebar-context'
export {
  FixedBottomProvider,
  useFixedBottom
} from './contexts/fixed-bottom-context'

// 発言可能なゲームステータス
export const talkableGameStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
export const isGameMaster = (myPlayer: Player | null, game: Game) => {
  return (
    isAdmin(myPlayer) ||
    game.gameMasters.some((gm) => gm.player.id === myPlayer?.id)
  )
}
// プレイヤーとして参加可能なゲームステータス
const playerParticipatableGameStatuses = ['Recruiting', 'Progress']
// GMが参加可能なゲームステータス
const gameMasterParticipatableGameStatuses = ['Closed', 'Opening']
// ゲーム設定変更可能なゲームステータス
const gameSettingModifiableGameStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
// 参加可能か
export const canParticipate = (
  game: Game,
  player: Player | null,
  myself: GameParticipant | null,
  isGameMaster: boolean
) => {
  if (!player || !!myself) return false
  return (
    (isGameMaster &&
      gameMasterParticipatableGameStatuses.includes(game.status)) ||
    playerParticipatableGameStatuses.includes(game.status)
  )
}
export type ParticipateInvitation = 'hide' | 'login-required' | 'participate'
// 参加登録パネルの表示状態
// - 参加済み → 'hide'
// - ログイン済み: canParticipate に従う
// - 未ログイン: プレイヤー参加可能ステータスのみ案内（GM 判定はログイン後）
export const participateInvitation = (
  game: Game,
  player: Player | null,
  myself: GameParticipant | null,
  isGameMasterValue: boolean
): ParticipateInvitation => {
  if (myself) return 'hide'
  if (player) {
    return canParticipate(game, player, myself, isGameMasterValue)
      ? 'participate'
      : 'hide'
  }
  return playerParticipatableGameStatuses.includes(game.status)
    ? 'login-required'
    : 'hide'
}
// ゲーム設定変更可能か
export const canModifyGameSetting = (game: Game, myPlayer: Player | null) => {
  return (
    isGameMaster(myPlayer, game) &&
    gameSettingModifiableGameStatuses.includes(game.status)
  )
}

const isAdmin = (myPlayer: Player | null) => {
  return myPlayer && myPlayer.authorityCodes.includes('AuthorityAdmin')
}

// ゲーム更新チェック
const periodChangeStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
export const usePollingPeriod = () => {
  const game = useGameValue()
  const [changePeriod] = useMutation<
    ChangePeriodMutation,
    ChangePeriodMutationVariables
  >(ChangePeriodDocument)

  const callback = useCallback(async () => {
    if (!periodChangeStatuses.includes(game.status)) return

    await changePeriod({
      variables: {
        input: {
          gameId: game.id
        }
      }
    })
  }, [game.status, game.id, changePeriod])

  const ref = useRef<() => void>(callback)
  useEffect(() => {
    ref.current = callback
  }, [callback])

  useEffect(() => {
    const mutation = () => {
      ref.current()
    }
    mutation() // 初回だけ即時実行
    const timer = setInterval(mutation, 60000)
    return () => clearInterval(timer)
  }, [])
}

// display settings
const displaySettingsAtom = atom(defaultDisplaySettings)
export const useUserDisplaySettingsAtom = () => {
  const [displaySettings, setDisplaySettings] = useUserDisplaySettings()
  const setAtom = useSetAtom(displaySettingsAtom)
  useEffect(() => {
    setAtom(displaySettings)
  }, [displaySettings, setAtom])
}
export const useUserDisplaySettingsValue = () =>
  useAtomValue(displaySettingsAtom)
