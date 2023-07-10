import Image from 'next/image'
import SubmitButton from '@/components/button/submit-button'
import InputImage from '@/components/form/input-image'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import {
  Game,
  GameParticipant,
  GameParticipantIcon,
  GameParticipantProfile,
  UpdateGameParticipantProfile,
  UpdateGameParticipantProfileDocument,
  UpdateGameParticipantProfileMutation,
  UpdateGameParticipantProfileMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Modal from '@/components/modal/modal'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  refetchMyself: () => void
  profile: GameParticipantProfile
  icons: GameParticipantIcon[]
  refetchProfile: () => void
}

interface FormInput {
  name: string
  introduction: string | null
}

export default function ProfileEdit({
  close,
  game,
  myself,
  refetchMyself,
  profile,
  icons,
  refetchProfile
}: Props) {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: profile.name,
      introduction: profile.introduction ?? ''
    }
  })
  const [images, setImages] = useState<File[]>([])
  const [iconId, setIconId] = useState<string | null>(
    myself?.profileIcon?.id ?? null
  )
  const [isOpenIconSelectModal, setIsOpenIconSelectModal] = useState(false)
  const toggleIconSelectModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconSelectModal(!isOpenIconSelectModal)
    }
  }

  const canSubmit: boolean = formState.isValid && !formState.isSubmitting
  const [updateProfile] = useMutation<UpdateGameParticipantProfileMutation>(
    UpdateGameParticipantProfileDocument,
    {
      onCompleted(e) {
        refetchMyself()
        refetchProfile()
        close(e)
      },
      onError(error) {
        console.error(error)
      }
    }
  )

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      updateProfile({
        variables: {
          input: {
            gameId: game.id,
            name: data.name,
            profileImageFile: images.length > 0 ? images[0] : null,
            profileImageUrl: images.length > 0 ? null : profile.profileImageUrl,
            profileIconId: iconId,
            introduction: data.introduction,
            memo: null // TODO: 消えてしまうかも
          } as UpdateGameParticipantProfile
        } as UpdateGameParticipantProfileMutationVariables
      })
    },
    [updateProfile, images, iconId]
  )

  const selectedIcon = icons.find((icon) => icon.id === iconId)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='my-4'>
          <InputText
            label='キャラクター名'
            name='name'
            control={control}
            rules={{
              required: '必須です',
              maxLength: {
                value: 50,
                message: `50文字以内で入力してください`
              }
            }}
          />
        </div>
        <div className='my-4'>
          <InputTextarea
            label='自己紹介'
            name='introduction'
            control={control}
            rules={{}}
            minRows={5}
          />
        </div>
        <InputImage
          label='プロフィール画像'
          name='profileImage'
          images={images}
          setImages={setImages}
          defaultImageUrl={profile.profileImageUrl}
        />
        <div>
          <label>プロフィールアイコン</label>
          {icons.length > 0 && (
            <div>
              <button
                onClick={(e: any) => {
                  e.preventDefault()
                  setIsOpenIconSelectModal(true)
                }}
                disabled={icons.length <= 0}
              >
                <Image
                  src={
                    selectedIcon
                      ? selectedIcon.url
                      : 'https://placehold.jp/120x120.png'
                  }
                  width={selectedIcon ? selectedIcon.width : 60}
                  height={selectedIcon ? selectedIcon.height : 60}
                  alt='キャラアイコン'
                />
              </button>
            </div>
          )}
        </div>
        <div className='flex justify-end'>
          <SubmitButton label='更新する' disabled={!canSubmit} />
        </div>
        {isOpenIconSelectModal && (
          <Modal close={toggleIconSelectModal} hideFooter>
            <IconSelect
              icons={icons}
              setIconId={setIconId}
              toggle={() => setIsOpenIconSelectModal(false)}
            />
          </Modal>
        )}
      </form>
    </div>
  )
}

type IconSelectProps = {
  icons: Array<GameParticipantIcon>
  setIconId: (iconId: string) => void
  toggle: () => void
}
const IconSelect = ({ icons, setIconId, toggle }: IconSelectProps) => {
  const handleSelect = (e: any, iconId: string) => {
    e.preventDefault()
    setIconId(iconId)
    toggle()
  }

  return (
    <div>
      {icons.map((icon) => (
        <button onClick={(e: any) => handleSelect(e, icon.id)} key={icon.id}>
          <Image
            src={icon.url}
            width={icon.width}
            height={icon.height}
            alt='キャラアイコン'
          />
        </button>
      ))}
    </div>
  )
}
