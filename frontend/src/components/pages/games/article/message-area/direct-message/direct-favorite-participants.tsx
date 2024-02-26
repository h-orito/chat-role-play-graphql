import {
  DirectFavoriteParticipantsDocument,
  DirectFavoriteParticipantsQuery,
  DirectFavoriteParticipantsQueryVariables,
  GameParticipant
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Participants from '../../../participant/participants'
import { useGameValue } from '@/components/pages/games/game-hook'

type Props = {
  close: (e: any) => void
  messageId: string
}

export default function DirectFavoriteParticipants({ messageId }: Props) {
  const game = useGameValue()
  const [participants, setParticipants] = useState<Array<GameParticipant>>([])
  const [fetchFavoriteParticipants] =
    useLazyQuery<DirectFavoriteParticipantsQuery>(
      DirectFavoriteParticipantsDocument
    )
  const refetchFavoriteParticipants = async () => {
    const { data } = await fetchFavoriteParticipants({
      variables: {
        gameId: game.id,
        directMessageId: messageId
      } as DirectFavoriteParticipantsQueryVariables
    })
    if (data?.directMessageFavoriteGameParticipants == null) return
    setParticipants(
      data.directMessageFavoriteGameParticipants as GameParticipant[]
    )
  }

  useEffect(() => {
    refetchFavoriteParticipants()
  }, [messageId])

  if (participants == null) return <div>Loading...</div>

  return <Participants participants={participants} />
}
