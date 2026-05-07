import { Dispatch, SetStateAction, useState } from 'react'
import { UsersIcon } from '@heroicons/react/24/outline'
import { useCookies } from 'react-cookie'
import Image from 'next/image'
import Modal from '@/components/modal/modal'
import MessageText from '@/components/pages/games/article/message-area/message-text/message-text'
import { useGameValue } from '../game-hook'

type IntroCookie = {
  [gameId: string]: boolean
}

export const GameIntroButton = () => {
  const game = useGameValue()
  const [getCookie, setCookie] = useCookies()
  const introCookie: IntroCookie = getCookie['intro'] || {}
  const alreadyConfiemed = !!introCookie && introCookie[game.id] === true
  const background = game.settings.background
  const hasIntro =
    (background.introduction != null && background.introduction !== '') ||
    (background.catchImageUrl != null && background.catchImageUrl !== '')
  const shouldShowModal = hasIntro && !alreadyConfiemed
  const [showModal, setShowModal] = useState(shouldShowModal)

  if (!hasIntro) return <></>

  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={() => setShowModal(true)}
        >
          <UsersIcon className='mr-1 size-5' />
          <p className='flex-1 self-center text-left'>ゲーム紹介</p>
        </button>
      </div>
      {showModal && (
        <GameIntroModal
          setCookie={setCookie}
          introCookie={introCookie}
          setShowModal={setShowModal}
        />
      )}
    </>
  )
}

const GameIntroModal = ({
  introCookie,
  setCookie,
  setShowModal
}: {
  introCookie: IntroCookie
  setCookie: (
    name: string,
    value: unknown,
    options?: { path?: string; maxAge?: number }
  ) => void
  setShowModal: Dispatch<SetStateAction<boolean>>
}) => {
  const game = useGameValue()
  const handleClose = () => {
    introCookie[game.id] = true
    setCookie('intro', introCookie, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
    setShowModal(false)
  }

  const background = game.settings.background
  const hasIntro =
    background.introduction != null && background.introduction !== ''
  const hasImage =
    background.catchImageUrl != null && background.catchImageUrl !== ''

  return (
    <Modal
      header={game.name}
      close={() => handleClose()}
      hideOnClickOutside={true}
    >
      <div className='text-center'>
        {hasImage && (
          <div
            className='relative flex h-96 justify-center'
            style={{ maxWidth: '80vw' }}
          >
            <Image
              src={background.catchImageUrl!}
              fill
              style={{ objectFit: 'contain' }}
              alt='ゲーム紹介画像'
            />
          </div>
        )}
        {hasIntro && (
          <p className='my-2 whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-xs text-gray-700'>
            <MessageText rawText={background.introduction!} />
          </p>
        )}
      </div>
    </Modal>
  )
}
