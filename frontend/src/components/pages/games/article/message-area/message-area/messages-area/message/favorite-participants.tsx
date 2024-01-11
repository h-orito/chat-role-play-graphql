import {
  FavoriteParticipantsDocument,
  FavoriteParticipantsQuery,
  Game,
  GameParticipant
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Participants from '../../../../../participant/participants'

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
  const [participants, setParticipants] = useState<GameParticipant[]>([])
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
    setParticipants(data.messageFavoriteGameParticipants as GameParticipant[])
  }

  useEffect(() => {
    refetchFavoriteParticipants()
  }, [messageId])

  if (participants == null) return <div>Loading...</div>

  return (
    <Participants
      participants={participants}
      openProfileModal={openProfileModal}
    />
  )
}
