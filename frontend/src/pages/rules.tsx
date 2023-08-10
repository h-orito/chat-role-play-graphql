import Modal from '@/components/modal/modal'
import Policy from '@/components/pages/index/policy'
import Term from '@/components/pages/index/term'
import PageHeader from '@/components/pages/page-header'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Rules() {
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

  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | ルール</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='ルール' />
        <div className='p-4'>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>利用規約、プライバシーポリシー</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                <a
                  className='cursor-pointer text-blue-500'
                  onClick={() => setIsOpenTermModal(true)}
                >
                  利用規約
                </a>
              </li>
              <li>
                <a
                  className='cursor-pointer text-blue-500'
                  onClick={() => setIsOpenPolicyModal(true)}
                >
                  プライバシーポリシー
                </a>
              </li>
            </ul>
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
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム参加ルール</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                オリジナルキャラクターを登録してください。
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>
                    アニメ、ゲーム、漫画など他人の著作物からキャラクター名をそのまま引用しないでください。
                  </li>
                  <li>
                    あなた自身が作成した、もしくは、あなたが依頼し、あなたのために作成された画像を使用してください。
                    <ul className='ml-8 list-inside list-disc py-2 text-left text-xs'>
                      <li>
                        一般公開されている著作権フリー画像や、それを加工したものはNGとします。
                      </li>
                      <li>
                        論理的に著作権の問題がないことを説明できるもののみ許可します。
                      </li>
                    </ul>
                  </li>
                  <li>
                    アップロードされた画像は、当サイトの管理者またはGMが、サイトの紹介や宣伝目的で利用することがあることを許諾ください。
                  </li>
                  <li>
                    ゲームマスター（以下GM）の方は、ゲーム内でこれらのルールが守られているか確認してください。
                  </li>
                </ul>
              </li>
              <li>
                法令や公序良俗に違反したり、運営を妨げるような内容を登録・発言しないでください。
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>
                    全員が閲覧できる場所では全年齢向けの表現としてください。
                  </li>
                  <li>
                    閲覧制限があり、GMおよび参加者がその表現をすることを前提としているゲームにおいては、暴力的表現や性的表現をしても問題ありません。
                  </li>
                </ul>
              </li>
              <li>
                他参加者の画面の向こうには人間がいます。他者を思いやり、迷惑をかけないロールプレイを心がけるようお願いします。
              </li>
              <li>トラブルは当事者間で解決してください。</li>
              <li>
                問題のある内容が登録・発言されている場合、GMや管理者に連絡してください。
                <ul className='ml-8 list-inside list-disc py-2 text-left text-xs'>
                  <li>削除等の対応を行うことがあります。</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
