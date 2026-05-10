import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import DangerButton from '../button/danger-button'
import PrimaryButton from '../button/primary-button'

interface Props {
  label?: string
  name: string
  setImages: Dispatch<SetStateAction<File[]>>
  // 現在の画像 URL（既存登録 URL / アップロード直後の blob URL / 削除後の null）。
  // 親が単一ソースを管理することで「削除→更新で URL が消えない」バグを防ぐ。
  // blob URL は InputImage 内部で createObjectURL/revokeObjectURL を行うので
  // 呼び出し側は revoke を意識する必要なし。
  previewImageUrl: string | null
  setPreviewImageUrl: (url: string | null) => void
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

export default function InputImage({
  label,
  name,
  setImages,
  previewImageUrl,
  setPreviewImageUrl,
  maxFileKByte = 1024,
  disabled = false
}: Props) {
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null!)
  // この InputImage が createObjectURL で作った blob URL のみを追跡する。
  // 親由来の既存 URL（http(s)://...）は revoke 対象外。
  const ownedBlobUrlRef = useRef<string | null>(null)

  const replaceOwnedBlobUrl = (next: string | null) => {
    if (ownedBlobUrlRef.current !== null) {
      URL.revokeObjectURL(ownedBlobUrlRef.current)
    }
    ownedBlobUrlRef.current = next
  }

  // アンマウント時にも blob URL をリークさせない
  useEffect(() => {
    return () => {
      if (ownedBlobUrlRef.current !== null) {
        URL.revokeObjectURL(ownedBlobUrlRef.current)
        ownedBlobUrlRef.current = null
      }
    }
  }, [])

  const onProfileButtonClick = () => {
    inputRef.current.click()
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return
    }
    const file = event.target.files[0]
    // 初期化することで同じファイルを連続で選択してもonChagngeが発動するように設定し、画像をキャンセルしてすぐに同じ画像を選ぶ動作に対応
    event.target.value = ''
    setErrorMessage('')

    if (!allowImageTypes.includes(file.type)) {
      setErrorMessage('jpeg, jpg, png, gif, webpのファイルを選択してください')
      return
    }

    if (file.size > maxFileKByte * 1024) {
      setErrorMessage(`${maxFileKByte}kByte以下のファイルを選択してください`)
      return
    }

    const nextBlobUrl = URL.createObjectURL(file)
    replaceOwnedBlobUrl(nextBlobUrl)
    setImages([file])
    setPreviewImageUrl(nextBlobUrl)
  }

  const handleCancel = () => {
    setErrorMessage('')
    // ref が null の場合（親由来の既存 URL）は内部で no-op になる
    replaceOwnedBlobUrl(null)
    setImages([])
    setPreviewImageUrl(null)
  }

  return (
    <div>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      {previewImageUrl && (
        <img
          className='mb-2 w-32'
          src={previewImageUrl}
          alt={label ? label : '画像'}
        />
      )}

      <input
        type='file'
        name={name}
        id={name}
        ref={inputRef}
        accept='image/*'
        onChange={handleFile}
        hidden
      />
      <PrimaryButton click={onProfileButtonClick} disabled={disabled}>
        画像を選択
      </PrimaryButton>
      {previewImageUrl != null && (
        <DangerButton className='ml-2' click={() => handleCancel()}>
          削除
        </DangerButton>
      )}
      {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
    </div>
  )
}
