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
import Head from 'next/head'
import { useAuth0 } from '@auth0/auth0-react'

export const getServerSideProps = async () => {
  const client = createInnerClient()
  const { data, error } = await client.query<IndexGamesQuery>({
    query: IndexGamesDocument,
    variables: {
      pageSize: 100000,
      pageNumber: 1,
      statuses: [
        GameStatus.Opening,
        GameStatus.Recruiting,
        GameStatus.Progress,
        GameStatus.Epilogue
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
  const { isAuthenticated } = useAuth0()
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
    <main className='min-h-screen w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！</title>
      </Head>
      <article className='flex w-full flex-col text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <div>
          <Image
            src={`/chat-role-play/images/top.jpg`}
            width={960}
            height={540}
            alt='トップ画像'
          />
        </div>
        <div className='flex-1 p-2 lg:p-4'>
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
              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <div className='flex flex-1 justify-center'>
                  <Link href='/games'>
                    <PrimaryButton>ゲーム一覧</PrimaryButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className='my-6'>
            <h2 className='mb-2 text-lg font-bold'>キャラチップ</h2>
            <div className='flex justify-center'>
              <Link href='/charachips'>
                <PrimaryButton>キャラチップ一覧</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
        <footer className='border-t border-gray-300 px-4 py-2 text-xs'>
          <div className='flex justify-center'>
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
            <a
              href='https://twitter.com/ort_dev'
              target='_blank'
              className='ml-2 cursor-pointer hover:text-blue-500'
            >
              問い合わせ
            </a>
          </div>
          <div className='flex justify-center'>
            © 2023- ort (
            <a
              href='https://github.com/h-orito/chat-role-play-graphql'
              target='_blank'
              className='cursor-pointer hover:text-blue-500'
            >
              GitHub
            </a>
            )
          </div>
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
      <h1 className='mb-2 text-lg font-bold'>ロールをプレイ！</h1>
      <p className='text-xs leading-6'>
        ロールをプレイ！
        は、ゆるーくテキストでロールプレイを楽しめるサイトです。
      </p>
      <div className='mt-2 flex gap-2'>
        <div className='flex flex-1 justify-end'>
          <Link href={'/instructions'}>
            <PrimaryButton>説明書</PrimaryButton>
          </Link>
        </div>
        <div className='flex flex-1 justify-start'>
          <Link href={'/rules'}>
            <PrimaryButton>ルール</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
