import {
  FollowsDocument,
  FollowsQuery,
  FollowsQueryVariables,
  GameParticipant
} from '@/lib/generated/graphql'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import Participants from '../participant/participants'

type Props = {
  participantId: string
}

export default function Follows({ participantId }: Props) {
  const [follows, setFollows] = useState<Array<GameParticipant>>([])
  const [fetchFollows] = useLazyQuery<FollowsQuery>(FollowsDocument)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchFollows({
        variables: {
          participantId: participantId
        } as FollowsQueryVariables
      })
      if (data?.gameParticipantFollows == null) return
      setFollows(data.gameParticipantFollows as Array<GameParticipant>)
    }
    fetch()
  }, [fetchFollows, participantId])

  return (
    <div className='p-4'>
      <Participants participants={follows} />
    </div>
  )
}
