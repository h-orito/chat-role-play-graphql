import {
  GameParticipantGroup,
  ParticipantGroupsDocument,
  ParticipantGroupsQuery,
  ParticipantGroupsQueryVariables
} from '@/lib/generated/graphql'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useModal } from '@/components/hooks/use-modal'
import { useLazyQuery } from '@apollo/client'
import PrimaryButton from '@/components/button/primary-button'
import CreateParticipantGroup from './create-participant-group'
import ArticleModal from '@/components/modal/article-modal'
import DirectMessageArea from './direct-message-area'
import Modal from '@/components/modal/modal'
import DirectFavoriteParticipants from './direct-favorite-participants'
import {
  isGameMaster,
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import { useMyPlayerValue } from '@/components/pages/games/contexts/my-player-context'

type Props = {
  className?: string
}

export default function DirectMessageGroupsArea({ className }: Props) {
  const game = useGameValue()
  const myself = useMyselfValue()!
  const myPlayer = useMyPlayerValue()
  // GM 全発言閲覧設定 ON のゲームでは、GM は自分が属していないグループの DM も一覧で見られるよう、
  // memberParticipantID フィルタを外して全グループを取得する。
  const canViewAllGroups =
    game.settings.rule.isGameMasterViewAllMessages &&
    isGameMaster(myPlayer, game)
  const [fetchParticipantGroups] = useLazyQuery<
    ParticipantGroupsQuery,
    ParticipantGroupsQueryVariables
  >(ParticipantGroupsDocument, { fetchPolicy: 'no-cache' })
  const [groups, setGroups] = useState<GameParticipantGroup[]>([])

  const createModal = useModal()

  const [directMessageGroup, setDirectMessageGroup] =
    useState<GameParticipantGroup | null>(null)
  // refetchGroups の deps に directMessageGroup を入れると、DM グループを開くたびに再取得が走ってしまう。
  // ref 経由で最新値を読むことで、deps を絞りつつ「現在開いているグループの最新データに更新」を保つ。
  const directMessageGroupRef = useRef<GameParticipantGroup | null>(null)
  directMessageGroupRef.current = directMessageGroup
  const directMessageModal = useModal()
  const openDirectMessageModal = (group: GameParticipantGroup) => {
    setDirectMessageGroup(group)
    directMessageModal.open()
  }

  const refetchGroups = useCallback(async () => {
    const { data } = await fetchParticipantGroups({
      variables: {
        gameId: game.id,
        participantId: canViewAllGroups ? null : myself?.id
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
    const current = directMessageGroupRef.current
    if (current != null) {
      const newGroup = data.gameParticipantGroups.find(
        (g) => g.id === current.id
      )
      if (newGroup != null) {
        setDirectMessageGroup(newGroup as GameParticipantGroup)
      }
    }
  }, [fetchParticipantGroups, game.id, canViewAllGroups, myself?.id])

  useEffect(() => {
    refetchGroups()
    // canViewAllGroups の確定タイミング（MyPlayerProvider の非同期ロード後）で再取得する。
    // refetchGroups は同じ deps を持つ useCallback で安定化済みのため、ここの deps はそれだけでよい。
  }, [refetchGroups])

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
