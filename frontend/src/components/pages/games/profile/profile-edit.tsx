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
import TalkTextDecorators from '../talk/talk-text-decorators'

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
  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
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

  const updateIntroduction = (str: string) => setValue('introduction', str)

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
          <label className='text-xs font-bold'>自己紹介</label>
          <div className='mb-1 flex'>
            <TalkTextDecorators
              selector='#introduction'
              setMessage={updateIntroduction}
            />
          </div>
          <InputTextarea
            name='introduction'
            control={control}
            rules={{}}
            minRows={5}
          />
        </div>
        <div className='my-4'>
          <label className='text-xs font-bold'>プロフィール画像</label>
          <p className='my-1 rounded-sm bg-gray-200 p-2 text-xs leading-5'>
            jpeg, jpg, png形式かつ1MB以下の画像を選択してください。
            <br />
            横400pxで表示されます。
          </p>
          <InputImage
            name='profileImage'
            images={images}
            setImages={setImages}
            defaultImageUrl={profile.profileImageUrl}
          />
        </div>
        <div>
          <label className='text-xs font-bold'>プロフィールアイコン</label>
          <p className='my-1 rounded-sm bg-gray-200 p-2 text-xs'>
            登録済みのアイコンから選択してください。
          </p>
          {icons.length <= 0 && (
            <Image
              src={
                'https://placehold.jp/cccccc/999/120x120.png?text=no%20image'
              }
              width={60}
              height={60}
              alt='アイコン'
            />
          )}
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
                      : 'https://placehold.jp/cccccc/999/120x120.png?text=no%20image'
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
