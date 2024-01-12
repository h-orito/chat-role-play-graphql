import { Dispatch, SetStateAction, useRef, useState } from 'react'
import DangerButton from '../button/danger-button'
import PrimaryButton from '../button/primary-button'

interface Props {
  label?: string
  name: string
  images: File[]
  setImages: Dispatch<SetStateAction<File[]>>
  maxFileKByte?: number
  disabled?: boolean
}

const allowImageTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp'
]

export default function InputImages({
  label,
  name,
  images,
  setImages,
  maxFileKByte = 1024,
  disabled = false
}: Props) {
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null!)

  const onProfileButtonClick = (e: any) => {
    e.preventDefault()
    inputRef.current.click()
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return
    }
    const files = Array.from(event.target.files)
    // 初期化することで同じファイルを連続で選択してもonChagngeが発動するように設定し、画像をキャンセルしてすぐに同じ画像を選ぶ動作に対応
    event.target.value = ''
    setErrorMessage('')

    if (files.some((file: File) => !allowImageTypes.includes(file.type))) {
      setErrorMessage('jpeg, jpg, png, gif, webpのファイルを選択してください')
      return
    }

    if (files.some((file: File) => file.size > maxFileKByte * 1024)) {
      const sizeOverFiles = files.filter(
        (file: File) => file.size > maxFileKByte * 1024
      )
      setErrorMessage(
        `${maxFileKByte}kByteを超えたファイルを選択しています。 ${sizeOverFiles
          .map((file: File) => file.name)
          .join(', ')}}`
      )
      return
    }

    setImages(files)
  }

  const handleCancel = (e: any) => {
    e.preventDefault()
    setErrorMessage('')
    setImages([])
  }

  return (
    <div>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <input
        type='file'
        name={name}
        id={name}
        ref={inputRef}
        accept='image/*'
        onChange={handleFile}
        hidden
        multiple
      />
      <PrimaryButton click={onProfileButtonClick} disabled={disabled}>
        画像を選択
      </PrimaryButton>
      {images.length > 0 && (
        <DangerButton className='ml-2' click={(e: any) => handleCancel(e)}>
          削除
        </DangerButton>
      )}
      {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
    </div>
  )
}
