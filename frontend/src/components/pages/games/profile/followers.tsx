import {
  FollowersDocument,
  FollowersQuery,
  FollowersQueryVariables,
  GameParticipant
} from '@/lib/generated/graphql'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import Participants from '../participant/participants'

type Props = {
  participantId: string
  openProfileModal: (participantId: string) => void
}

export default function Followers({ participantId, openProfileModal }: Props) {
  const [followers, setFollowers] = useState<Array<GameParticipant>>([])
  const [fetchFollowers] = useLazyQuery<FollowersQuery>(FollowersDocument)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchFollowers({
        variables: {
          participantId: participantId
        } as FollowersQueryVariables
      })
      if (data?.gameParticipantFollowers == null) return
      setFollowers(data.gameParticipantFollowers as Array<GameParticipant>)
    }
    fetch()
  }, [fetchFollowers, participantId])

  return (
    <div className='p-4'>
      <Participants
        participants={followers}
        openProfileModal={openProfileModal}
      />
    </div>
  )
}
