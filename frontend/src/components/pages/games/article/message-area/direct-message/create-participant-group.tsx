import PrimaryButton from '@/components/button/primary-button'
import {
  Game,
  GameParticipant,
  GameParticipantGroup,
  NewGameParticipantGroup,
  RegisterParticipantGroupDocument,
  RegisterParticipantGroupMutation,
  RegisterParticipantGroupMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant
  groups: GameParticipantGroup[]
  refetchGroups: () => void
}

export default function CreateParticipantGroup({
  close,
  game,
  myself,
  groups,
  refetchGroups
}: Props) {
  const [register] = useMutation<RegisterParticipantGroupMutation>(
    RegisterParticipantGroupDocument,
    {
      onCompleted(e) {
        refetchGroups()
        close(e)
      },
      onError(error) {
        console.error(error)
      }
    }
  )
  const [participants, setParticipants] = useState<Array<GameParticipant>>([])
  const [submitting, setSubmitting] = useState(false)
  const handleRegister = useCallback(() => {
    setSubmitting(true)
    const pts = [myself, ...participants]
    const name = pts.map((p) => p.name).join('、')
    register({
      variables: {
        input: {
          gameId: game.id,
          name: name.length > 30 ? name.substring(0, 30) + '…' : name,
          gameParticipantIds: pts.map((p) => p.id)
        } as NewGameParticipantGroup
      } as RegisterParticipantGroupMutationVariables
    }).then((res) => {
      setSubmitting(false)
    })
  }, [register, participants])

  const alreadyExists = groups.some((g) => {
    const pts = [...participants, myself]
    return (
      g.participants.length === pts.length &&
      g.participants.every((gp) => pts.some((p) => p.id === gp.id))
    )
  })

  const canSubmit = participants.length > 0 && !alreadyExists && !submitting

  return (
    <div className='max-h-full w-full p-4'>
      <div className='mb-4'>
        {alreadyExists && (
          <p className='text-red-500'>
            既にこのメンバーのグループは作成済みです
          </p>
        )}
        {game.participants
          .filter((gp) => gp.id !== myself.id)
          .map((gp) => (
            <div key={gp.id} className='flex items-center'>
              <input
                id={`register-group-participant-${gp.id}`}
                type='checkbox'
                className='mr-2'
                checked={participants.includes(gp)}
                onChange={() => {
                  if (participants.includes(gp)) {
                    setParticipants(participants.filter((s) => s.id !== gp.id))
                  } else {
                    setParticipants([...participants, gp])
                  }
                }}
              />
              <label htmlFor={`register-group-participant-${gp.id}`}>
                {gp.name}
              </label>
            </div>
          ))}
      </div>
      <div className='flex justify-end'>
        <PrimaryButton disabled={!canSubmit} click={() => handleRegister()}>
          作成
        </PrimaryButton>
      </div>
    </div>
  )
}
