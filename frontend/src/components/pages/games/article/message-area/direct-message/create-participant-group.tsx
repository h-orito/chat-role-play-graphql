import PrimaryButton from '@/components/button/primary-button'
import {
  GameParticipant,
  GameParticipantGroup,
  NewGameParticipantGroup,
  RegisterParticipantGroupDocument,
  RegisterParticipantGroupMutation,
  RegisterParticipantGroupMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import ParticipantsCheckbox from '../../../participant/participants-checkbox'
import {
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'

type Props = {
  close: (e: any) => void
  groups: GameParticipantGroup[]
  refetchGroups: () => void
}

export default function CreateParticipantGroup({
  close,
  groups,
  refetchGroups
}: Props) {
  const game = useGameValue()
  const myself = useMyselfValue()!
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
        {alreadyExists ? (
          <p className='danger-text'>
            既にこのメンバーのグループは作成済みです
          </p>
        ) : (
          <p>グループに含めるメンバーを選択してください</p>
        )}
        <ParticipantsCheckbox
          participants={game.participants.filter((p) => p.id !== myself.id)}
          selects={participants}
          setSelects={setParticipants}
        />
      </div>
      <div className='flex justify-end'>
        <PrimaryButton disabled={!canSubmit} click={() => handleRegister()}>
          作成
        </PrimaryButton>
      </div>
    </div>
  )
}
