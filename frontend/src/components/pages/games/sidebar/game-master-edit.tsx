import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import {
  DeleteGameMaster,
  DeleteGameMasterDocument,
  DeleteGameMasterMutation,
  DeleteGameMasterMutationVariables,
  NewGameMaster,
  Player,
  QPlayersDocument,
  QPlayersQuery,
  RegisterGameMasterDocument,
  RegisterGameMasterMutation,
  RegisterGameMasterMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGameValue } from '../game-hook'

type Props = {
  close: (e: any) => void
}

export default function GameMasterEdit({ close }: Props) {
  const game = useGameValue()
  const router = useRouter()
  const [deleteGameMaster] = useMutation<DeleteGameMasterMutation>(
    DeleteGameMasterDocument
  )
  const [registerGameMaster] = useMutation<RegisterGameMasterMutation>(
    RegisterGameMasterDocument
  )

  const handleRegister = async (id: string) => {
    if (!window.confirm('本当にゲームマスターを追加してよろしいですか？'))
      return

    await registerGameMaster({
      variables: {
        input: {
          gameId: game.id,
          playerId: id,
          isProducer: false
        } as NewGameMaster
      } as RegisterGameMasterMutationVariables
    })
    router.reload()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('本当にゲームマスターを削除してよろしいですか？'))
      return

    await deleteGameMaster({
      variables: {
        input: {
          gameId: game.id,
          id
        } as DeleteGameMaster
      } as DeleteGameMasterMutationVariables
    })
    router.reload()
  }

  const [players, setPlayers] = useState([] as Player[])
  const [playerName, setPlayerName] = useState('')
  const [fetchPlayers] = useLazyQuery<QPlayersQuery>(QPlayersDocument)
  const refetchPlayers = async () => {
    if (playerName.length <= 1) return
    const { data } = await fetchPlayers({
      variables: {
        query: {
          name: playerName
        }
      }
    })
    if (data?.players == null) return
    setPlayers(data.players as Player[])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    refetchPlayers()
  }

  return (
    <div className='py-4'>
      <div className='mb-4'>
        <p className='font-bold'>ゲームマスター</p>
        {game.gameMasters.map((gameMaster) => (
          <div className='base-border flex border p-2' key={gameMaster.id}>
            <p className='my-auto'>{gameMaster.player.name}</p>
            <DangerButton
              className='ml-auto'
              click={() => handleDelete(gameMaster.id)}
              disabled={game.gameMasters.length <= 1}
            >
              削除
            </DangerButton>
          </div>
        ))}
      </div>
      <div className='my-4'>
        <p className='font-bold'>ゲームマスター追加</p>
        <div className='mb-2 flex'>
          <input
            className='base-border flex-1 rounded border px-2 py-1 text-xs text-gray-700'
            value={playerName}
            placeholder='プレイヤー名'
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <PrimaryButton
            className='ml-2'
            click={refetchPlayers}
            disabled={playerName.length <= 1}
          >
            検索
          </PrimaryButton>
        </div>
        {players.map((player) => (
          <div className='base-border flex border p-2' key={player.id}>
            <p className='my-auto'>{player.name}</p>
            <PrimaryButton
              className='ml-auto'
              click={() => handleRegister(player.id)}
              disabled={game.gameMasters.some(
                (gm) => gm.player.id === player.id
              )}
            >
              追加
            </PrimaryButton>
          </div>
        ))}
      </div>
    </div>
  )
}
