import {
  FavoriteParticipantsDocument,
  FavoriteParticipantsQuery,
  Game,
  GameParticipant
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  messageId: string
  openProfileModal: (participantId: string) => void
}

export default function FavoriteParticipants({
  game,
  messageId,
  openProfileModal
}: Props) {
  const [participants, setParticipants] = useState<
    Array<{
      id: string
      name: string
      entryNumber: number
    }>
  >([])
  const [fetchFavoriteParticipants] = useLazyQuery<FavoriteParticipantsQuery>(
    FavoriteParticipantsDocument
  )
  const refetchFavoriteParticipants = async () => {
    const { data } = await fetchFavoriteParticipants({
      variables: {
        gameId: game.id,
        messageId: messageId
      }
    })
    if (data?.messageFavoriteGameParticipants == null) return
    setParticipants(data.messageFavoriteGameParticipants)
  }

  useEffect(() => {
    refetchFavoriteParticipants()
  }, [messageId])

  if (participants == null) return <div>Loading...</div>

  return (
    <div>
      {participants.map((participant) => (
        <div key={participant.id} className=''>
          <button onClick={() => openProfileModal(participant.id)}>
            <p>{participant.name}</p>
          </button>
        </div>
      ))}
    </div>
  )
}
