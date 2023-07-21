import { LoginButton, LogoutButton } from '@/components/auth/auth'
import useAuth from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import { useEffect, useState } from 'react'
import UserEdit from './user-edit'
import { useLazyQuery } from '@apollo/client'
import {
  MyPlayerQuery,
  MyPlayerDocument,
  Player
} from '@/lib/generated/graphql'

export default function UserInfo() {
  const authState: AuthState = useAuth()

  const [isOpenUserMofifyModal, setIsOpenUserMofifyModal] = useState(false)
  const toggleUserMofifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenUserMofifyModal(!isOpenUserMofifyModal)
    }
  }

  const [myPlayer, setMyPlayer] = useState<Player | null>(null)
  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery>(MyPlayerDocument)
  const refetchMyPlayer = async () => {
    const { data } = await fetchMyPlayer()
    if (data?.myPlayer == null) return
    setMyPlayer(data.myPlayer as Player)
  }
  useEffect(() => {
    refetchMyPlayer()
  }, [authState.isAuthenticated])

  return (
    <div className='my-6'>
      {authState.isAuthenticated ? (
        <>
          <h2 className='mb-2 text-lg font-bold'>ようこそ</h2>
          <p>{myPlayer?.name} さん</p>
          <div className='flex justify-center gap-2'>
            <div className='flex flex-1 justify-end'>
              <PrimaryButton click={() => setIsOpenUserMofifyModal(true)}>
                ユーザー編集
              </PrimaryButton>
            </div>
            <div className='flex flex-1 justify-start'>
              <LogoutButton />
            </div>
          </div>
          {isOpenUserMofifyModal && (
            <Modal
              header='ユーザー編集'
              close={toggleUserMofifyModal}
              hideFooter
            >
              <UserEdit
                close={toggleUserMofifyModal}
                myPlayer={myPlayer}
                refetchMyPlayer={refetchMyPlayer}
              />
            </Modal>
          )}
        </>
      ) : (
        <>
          <h2 className='mb-2 text-lg font-bold'>Register / Login</h2>
          <p className='mb-2 text-xs leading-6'>
            ゲーム参加・作成にはログインが必要です。
            <br />
            閲覧はログインしなくても行えます。
          </p>
          <LoginButton />
        </>
      )}
    </div>
  )
}
