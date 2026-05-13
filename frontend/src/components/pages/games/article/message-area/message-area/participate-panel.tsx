import Panel from '@/components/panel/panel'
import Modal from '@/components/modal/modal'
import { LoginButton } from '@/components/auth/auth'
import PrimaryButton from '@/components/button/primary-button'
import { useModal } from '@/components/hooks/use-modal'
import {
  participateInvitation,
  useGameValue,
  useMyPlayerValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import Participate from '@/components/pages/games/sidebar/participate'

const ParticipatePanel = () => {
  const game = useGameValue()
  const myPlayer = useMyPlayerValue()
  const myself = useMyselfValue()
  const invitation = participateInvitation(game, myPlayer, myself)

  if (invitation === 'hide') return null

  return (
    <div className='m-4'>
      <Panel header='参加登録'>
        {invitation === 'login-required' ? (
          <LoginRequired />
        ) : (
          <ParticipateCta />
        )}
      </Panel>
    </div>
  )
}

export default ParticipatePanel

const LoginRequired = () => (
  <div>
    <p className='mb-3 text-sm'>このゲームに参加するにはログインが必要です。</p>
    <LoginButton />
  </div>
)

const ParticipateCta = () => {
  const modal = useModal()
  return (
    <div>
      <p className='mb-3 text-sm'>
        このゲームに参加登録できます。下のボタンから登録してください。
      </p>
      <PrimaryButton click={modal.open}>参加登録する</PrimaryButton>
      {modal.isOpen && (
        <Modal header='参加登録' close={modal.close} hideFooter>
          <Participate close={modal.close} />
        </Modal>
      )}
    </div>
  )
}
