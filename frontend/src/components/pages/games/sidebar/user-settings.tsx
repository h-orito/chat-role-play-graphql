import { useState } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/modal/modal'
import InputSelect from '@/components/form/input-select'
import { UserPagingSettings, useUserPagingSettings } from '../user-settings'
import PrimaryButton from '@/components/button/primary-button'
import RadioGroup from '@/components/form/radio-group'
import { useRouter } from 'next/router'

export default function UserSettingsComponent({
  close
}: {
  close: (e: any) => void
}) {
  return (
    <div className='text-center'>
      <div className='my-4 flex justify-center'>
        <PagingSettings />
      </div>
      <hr />
    </div>
  )
}

const PagingSettings = () => {
  const [userPagingSettings, setUserPagingSettings] = useUserPagingSettings()
  const pageSizeCandidates = [10, 20, 50, 100, 200, 500, 1000]
  const orderCandidates = [
    {
      label: '昇順',
      value: 'asc'
    },
    {
      label: '降順',
      value: 'desc'
    }
  ]
  const [pageSize, setPageSize] = useState(userPagingSettings.pageSize)
  const [order, setOrder] = useState(userPagingSettings.isDesc ? 'desc' : 'asc')
  const router = useRouter()
  const save = () => {
    setUserPagingSettings({
      pageSize: pageSize,
      isDesc: order === 'desc'
    } as UserPagingSettings)
    router.reload()
  }
  return (
    <div>
      <div className='mb-4'>
        <FormLabel label='ページング' />
      </div>
      <FormLabel label='1ページあたりの表示数' />
      <div className='mb-4'>
        <InputSelect
          className='w-64 md:w-96'
          candidates={pageSizeCandidates.map((n) => ({
            label: `${n}件`,
            value: n
          }))}
          selected={userPagingSettings.pageSize}
          setSelected={(value: number) => setPageSize(value)}
        />
      </div>
      <FormLabel label='表示順' />
      <div className='mb-4 mt-1 flex justify-center'>
        <RadioGroup
          name='paging-order'
          candidates={orderCandidates}
          selected={order}
          setSelected={setOrder}
        />
      </div>
      <div className='flex justify-center'>
        <PrimaryButton click={() => save()}>保存</PrimaryButton>
      </div>
    </div>
  )
}

type FormLabelProps = {
  label: string
  required?: boolean
  children?: React.ReactNode
}

const FormLabel = ({ label, required = false, children }: FormLabelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(!isModalOpen)
    }
  }
  const openModal = (e: any) => {
    e.preventDefault()
    setIsModalOpen(true)
  }
  return (
    <label className='block text-sm font-bold'>
      {required && <span className='text-red-500'>*&nbsp;</span>}
      {label}
      {children && (
        <>
          <button onClick={openModal}>
            <QuestionMarkCircleIcon className='ml-1 h-4 w-4 text-blue-500' />
          </button>
          {isModalOpen && (
            <Modal close={toggleModal} hideFooter>
              <div>
                <p className='text-xs'>{children}</p>
              </div>
            </Modal>
          )}
        </>
      )}
    </label>
  )
}
