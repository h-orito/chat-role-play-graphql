import {
  FavoriteParticipantsDocument,
  FavoriteParticipantsQuery,
  GameParticipant
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Participants from '../../../../../participant/participants'
import { useGameValue } from '@/components/pages/games/game-hook'

type Props = {
  close: (e: any) => void
  messageId: string
}

export default function FavoriteParticipants({ messageId }: Props) {
  const game = useGameValue()
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

  return <Participants participants={participants} />
}
