import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import Modal from '@/components/modal/modal'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useGameValue } from './game-hook'

const RatingWarningModal = () => {
  const game = useGameValue()
  const [getCookie, setCookie] = useCookies()
  const rating = game.labels.find((l) =>
    ['R15', 'R18', 'R18G'].includes(l.name)
  )
  const ratingCookie: RatingCookie = getCookie['rating'] || {}
  const alreadyConfiemed = !!ratingCookie && ratingCookie[game.id] === true
  const shouldShowRatingWarning = !!rating && !alreadyConfiemed
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()
  const handleShow = () => {
    ratingCookie[game.id] = true
    setCookie('rating', ratingCookie, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
    setShowModal(false)
  }

  if (!shouldShowRatingWarning) return <></>

  return (
    <>
      {showModal && (
        <Modal
          header='年齢制限確認'
          close={() => setShowModal(false)}
          hideFooter={true}
          hideOnClickOutside={false}
        >
          <div>
            <p>
              この村は年齢制限が{' '}
              <span className='danger-text text-lg'>
                <strong>{rating.name}</strong>
              </span>{' '}
              に設定されており、
              <br />
              暴力表現や性描写などが含まれる可能性があります。
            </p>
            <div className='flex justify-end'>
              <SecondaryButton className='mr-2' click={() => router.push('/')}>
                表示せず戻る
              </SecondaryButton>
              <PrimaryButton click={() => handleShow()}>表示する</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default RatingWarningModal

type RatingCookie = {
  [gameId: string]: boolean
}
