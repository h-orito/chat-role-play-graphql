import Image from 'next/image'
import SubmitButton from '@/components/button/submit-button'
import InputImage from '@/components/form/input-image'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import {
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
import { useGameValue, useMyself } from '../game-hook'

type Props = {
  close: (e: any) => void
  profile: GameParticipantProfile
  icons: GameParticipantIcon[]
  refetchProfile: () => void
}

interface FormInput {
  name: string
  introduction: string | null
  isPlayerOpen: boolean
}

export default function ProfileEdit({
  close,
  profile,
  icons,
  refetchProfile
}: Props) {
  const game = useGameValue()
  const [myself, refetchMyself] = useMyself(game.id)
  const { register, control, formState, handleSubmit, setValue } =
    useForm<FormInput>({
      defaultValues: {
        name: profile.name,
        introduction: profile.introduction ?? '',
        isPlayerOpen: profile.isPlayerOpen
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
            memo: null, // TODO: 消えてしまうかも
            isPlayerOpen: data.isPlayerOpen
          } as UpdateGameParticipantProfile
        } as UpdateGameParticipantProfileMutationVariables
      })
    },
    [updateProfile, images, iconId]
  )

  const selectedIcon = icons.find((icon) => icon.id === iconId)
  const updateIntroduction = (str: string) => setValue('introduction', str)

  const canChangeName = myself != null && myself.canChangeName
  const canChangeProfileImage = myself != null && myself.chara == null

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='my-4'>
          <label className='text-xs font-bold'>キャラクター名</label>
          {!canChangeName && (
            <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
              名称変更不可キャラチップのため、変更できません。
            </p>
          )}
          <InputText
            name='name'
            control={control}
            rules={{
              required: '必須です',
              maxLength: {
                value: 50,
                message: `50文字以内で入力してください`
              }
            }}
            disabled={!canChangeName}
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
          {canChangeProfileImage ? (
            <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
              jpeg, jpg, png形式かつ1MByte以下の画像を選択してください。
              <br />
              横400pxで表示されます。
            </p>
          ) : (
            <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
              キャラチップ利用のため、登録できません。
            </p>
          )}

          <InputImage
            name='profileImage'
            setImages={setImages}
            defaultImageUrl={profile.profileImageUrl}
            disabled={!canChangeProfileImage}
          />
        </div>
        <div>
          <label className='text-xs font-bold'>プロフィールアイコン</label>
          <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs'>
            登録済みのアイコンから選択してください。
          </p>
          {icons.length <= 0 && (
            <Image
              src={'/chat-role-play/images/no-image-icon.png'}
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
                      : '/chat-role-play/images/no-image-icon.png'
                  }
                  width={selectedIcon ? selectedIcon.width : 60}
                  height={selectedIcon ? selectedIcon.height : 60}
                  alt='キャラアイコン'
                />
              </button>
            </div>
          )}
        </div>
        <div className='my-4'>
          <label className='text-xs font-bold'>プレイヤー情報</label>
          <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
            チェックを入れると、プロフィールにプレイヤー名が表示されます。
            <br />
            エピローグを迎えると、チェックを入れていなくても公開されます。
          </p>
          <input
            type='checkbox'
            id='open-player'
            {...register('isPlayerOpen')}
          />
          <label htmlFor='open-player' className='ml-2 text-xs'>
            プレイヤー情報を公開する
          </label>
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
