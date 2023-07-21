import Image from 'next/image'
import { createInnerClient } from '@/components/graphql/client'
import {
  SimpleGame,
  IndexGamesDocument,
  IndexGamesQueryVariables,
  IndexGamesQuery,
  GameStatus
} from '@/lib/generated/graphql'
import UserInfo from '@/components/pages/index/user-info'
import Games from '@/components/pages/index/games'
import PrimaryButton from '@/components/button/primary-button'
import Link from 'next/link'
import { useState } from 'react'
import Modal from '@/components/modal/modal'
import Term from '@/components/pages/index/term'
import Policy from '@/components/pages/index/policy'
import Tip from '@/components/pages/index/tip'

export const getServerSideProps = async () => {
  const client = createInnerClient()
  const { data, error } = await client.query<IndexGamesQuery>({
    query: IndexGamesDocument,
    variables: {
      pageSize: 10,
      pageNumber: 1,
      statuses: [
        GameStatus.Opening,
        GameStatus.Recruiting,
        GameStatus.Progress,
        GameStatus.Finished
      ]
    } as IndexGamesQueryVariables
  })
  if (error) {
    console.log(error)
    return {
      props: {
        games: []
      }
    }
  }
  return {
    props: {
      games: data.games
    }
  }
}

type Props = {
  games: SimpleGame[]
}

export default function Index({ games }: Props) {
  const [isOpenTermModal, setIsOpenTermModal] = useState(false)
  const toggleTermModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTermModal(!isOpenTermModal)
    }
  }
  const [isOpenPolicyModal, setIsOpenPolicyModal] = useState(false)
  const togglePolicyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenPolicyModal(!isOpenPolicyModal)
    }
  }
  const [isOpenTipModal, setIsOpenTipModal] = useState(false)
  const toggleTipModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTipModal(!isOpenTipModal)
    }
  }

  return (
    <main className='w-full lg:flex lg:justify-center'>
      <article className='w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <div>
          <Image
            src={'https://placehold.jp/cccccc/999/960x540.png?text=top%20image'}
            width={960}
            height={540}
            alt='トップ画像'
          />
        </div>
        <div className='p-2 lg:p-4'>
          <Introduction />
          <UserInfo />
          <div className='my-6'>
            <h2 className='mb-2 text-lg font-bold'>開催中</h2>
            {games.length > 0 ? (
              <Games games={games} />
            ) : (
              <p className='text-xs'>開催中のゲームはありません。</p>
            )}
            <div className='mt-2 flex justify-center gap-2'>
              <div className='flex flex-1 justify-end'>
                <Link href='/create-game'>
                  <PrimaryButton>ゲーム作成</PrimaryButton>
                </Link>
              </div>
              <div className='flex flex-1 justify-start'>
                <Link href='/games'>
                  <PrimaryButton>ゲーム一覧</PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <footer className='flex justify-center border-t border-gray-300 px-4 py-2 text-xs'>
          <Link className='hover:text-blue-500' href='/release-note'>
            更新履歴
          </Link>
          <a
            className='ml-2 cursor-pointer hover:text-blue-500'
            onClick={() => setIsOpenTermModal(true)}
          >
            利用規約
          </a>
          <a
            className='ml-2 cursor-pointer hover:text-blue-500'
            onClick={() => setIsOpenPolicyModal(true)}
          >
            プライバシーポリシー
          </a>
          <a
            className='ml-2 cursor-pointer hover:text-blue-500'
            onClick={() => setIsOpenTipModal(true)}
          >
            投げ銭
          </a>
        </footer>
        {isOpenTermModal && (
          <Modal header='利用規約' close={toggleTermModal} hideFooter>
            <Term />
          </Modal>
        )}
        {isOpenPolicyModal && (
          <Modal
            header='プライバシーポリシー'
            close={togglePolicyModal}
            hideFooter
          >
            <Policy />
          </Modal>
        )}
        {isOpenTipModal && (
          <Modal header='投げ銭' close={toggleTipModal} hideFooter>
            <Tip />
          </Modal>
        )}
      </article>
    </main>
  )
}

const Introduction = () => {
  return (
    <div className='my-6'>
      <p className='text-xs leading-6'>ロールをプレイ！</p>
    </div>
  )
}
