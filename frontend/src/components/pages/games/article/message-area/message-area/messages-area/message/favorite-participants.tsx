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
  close: () => void
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
    // refetchFavoriteParticipants は render ごとに新しい関数になるため意図的に依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId])

  if (participants == null) return <div>Loading...</div>

  return <Participants participants={participants} />
}
