import {
  GameParticipantGroup,
  ParticipantGroupsDocument,
  ParticipantGroupsQuery,
  ParticipantGroupsQueryVariables
} from '@/lib/generated/graphql'
import { useEffect, useState } from 'react'
import { useModal } from '@/components/hooks/use-modal'
import { useLazyQuery } from '@apollo/client'
import PrimaryButton from '@/components/button/primary-button'
import CreateParticipantGroup from './create-participant-group'
import ArticleModal from '@/components/modal/article-modal'
import DirectMessageArea from './direct-message-area'
import Modal from '@/components/modal/modal'
import DirectFavoriteParticipants from './direct-favorite-participants'
import {
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'

type Props = {
  className?: string
}

export default function DirectMessageGroupsArea({ className }: Props) {
  const game = useGameValue()
  const myself = useMyselfValue()!
  const [fetchParticipantGroups] = useLazyQuery<
    ParticipantGroupsQuery,
    ParticipantGroupsQueryVariables
  >(ParticipantGroupsDocument, { fetchPolicy: 'no-cache' })
  const [groups, setGroups] = useState<GameParticipantGroup[]>([])

  const createModal = useModal()

  const [directMessageGroup, setDirectMessageGroup] =
    useState<GameParticipantGroup | null>(null)
  const directMessageModal = useModal()
  const openDirectMessageModal = (group: GameParticipantGroup) => {
    setDirectMessageGroup(group)
    directMessageModal.open()
  }

  const refetchGroups = async () => {
    const { data } = await fetchParticipantGroups({
      variables: {
        gameId: game.id,
        participantId: myself?.id
      }
    })
    if (data?.gameParticipantGroups == null) return
    const newGroups = (
      data.gameParticipantGroups as GameParticipantGroup[]
    ).sort((g1, g2) => {
      // 最終発言が新しい順
      return g2.latestUnixTimeMilli - g1.latestUnixTimeMilli
    })
    setGroups(newGroups)
    if (directMessageGroup != null) {
      const newGroup = data.gameParticipantGroups.find(
        (g) => g.id === directMessageGroup.id
      )
      if (newGroup != null) {
        setDirectMessageGroup(newGroup as GameParticipantGroup)
      }
    }
  }

  useEffect(() => {
    refetchGroups()
    // mount 時のみグループ一覧を初期取得
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canCreate =
    !!myself &&
    ['Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(game.status)

  return (
    <div id='direct-message-area' className={`${className} relative size-full`}>
      {canCreate && (
        <div className='flex p-4'>
          <PrimaryButton click={createModal.open}>グループ作成</PrimaryButton>
        </div>
      )}
      {groups.map((group: GameParticipantGroup) => (
        <div key={group.id} className='base-border border-t p-4 last:border-b'>
          <button onClick={() => openDirectMessageModal(group)}>
            <p className='primary-hover-text'>{group.name}</p>
          </button>
        </div>
      ))}
      {createModal.isOpen && (
        <ArticleModal
          header='新規ダイレクトメッセージグループ'
          close={createModal.close}
          hideFooter
        >
          <CreateParticipantGroup
            groups={groups}
            refetchGroups={refetchGroups}
            close={createModal.close}
          />
        </ArticleModal>
      )}
      {directMessageModal.isOpen && (
        <DirectMessageArea
          group={directMessageGroup!}
          close={directMessageModal.close}
          refetchGroups={refetchGroups}
        />
      )}
    </div>
  )
}
