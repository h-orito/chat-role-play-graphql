import Modal from '@/components/modal/modal'
import Policy from '@/components/pages/index/policy'
import Term from '@/components/pages/index/term'
import PageHeader from '@/components/pages/page-header'
import Head from 'next/head'
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
          <div className='my-4 bg-gray-200 px-4 py-2 leading-5'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム参加ルール</p>
            </div>
            <ul className='list-inside list-disc py-1 text-left text-xs leading-5'>
              <li>
                オリジナルキャラクターで参加する場合
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>オリジナルキャラクターを登録してください。</li>
                  <li>
                    アニメ、ゲーム、漫画など他人の著作物からキャラクター名をそのまま引用しないでください。
                  </li>
                  <li>
                    あなた自身が作成した、もしくは、あなたが依頼し、あなたのために作成された画像を使用してください。
                    <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
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
                </ul>
              </li>
              <li>
                提供されたキャラチップで参加する場合
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    キャラチップは、それぞれ作者様より提供いただいたものを一時的に使用させていただくものとなります。
                    <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        キャラクターひとりひとりに思い入れがあります。作者様に敬意を払い、失礼のないように心がけてください。
                      </li>
                      <li>
                        ロールプレイ内容や利用方法に制限があることがあります（例えば、R-18の内容はNGなど）。各キャラチップの素材元サイトに利用規約が記載されている場合があるため、確認をお願いします（キャラチップ詳細ページにリンクがあります）。
                      </li>
                    </ul>
                  </li>
                  <li>
                    著作権は作者様にあります。
                    <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        スクリーンショットのSNSアップロードやキャラ画像をSNSアイコンに使用する等の行為については、著作権者である各作者様の意向に従ってください（スクリーンショットNGのものもあります）。
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                法令や公序良俗に違反したり、運営を妨げるような内容を登録・発言しないでください。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    全員が閲覧できる場所では全年齢向けの表現としてください。
                  </li>
                  <li>
                    閲覧制限があり、ゲームマスター（以下GM）および参加者がその表現をすることを前提としているゲームにおいては、暴力的表現や性的表現をしても問題ありません。
                  </li>
                </ul>
              </li>
              <li>
                他参加者の画面の向こうには人間がいます。他者を思いやり、迷惑をかけないロールプレイを心がけるようお願いします。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    基本的にGM裁量ですが、例えば確定ロールなど、ロールプレイをするにあたり迷惑となりえる事項については参加前に把握しておいてください。
                  </li>
                </ul>
              </li>
              <li>トラブルは当事者間で解決してください。</li>
              <li>
                GMの方は、ゲーム内でこれらのルールが守られているか確認してください。
              </li>
              <li>
                問題のある内容が登録・発言されている場合、GMや管理者に連絡してください。
                <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>削除等の対応を行うことがあります。</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム作成ルール</p>
            </div>
            <ul className='list-inside list-disc py-1 text-left text-xs leading-5'>
              <li>
                他定期ゲームのアフター等で利用するのもOKですが、そのゲームのGMの方に許可を取ってください。
              </li>
              <li>版権ものはNGです。</li>
              <li>
                ゲームを作成して放置していると管理人が判断した場合、作成者に利用制限をかけることがあります。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    テストプレイで作成するのも問題ありませんが、その旨を明示し、中止や終了まで責任を持って進めてください。
                  </li>
                  <li>
                    基本的に、作成した方がGMとなります。トラブルは当事者間で解決するのが基本ですが、ゲームを適切に運営する責任があるため、管理をお願いします。
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
