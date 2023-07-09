import SubmitButton from '@/components/button/submit-button'
import InputImage from '@/components/form/input-image'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import {
  Game,
  GameParticipant,
  GameParticipantProfile,
  UpdateGameParticipantProfileDocument,
  UpdateGameParticipantProfileMutation,
  UpdateGameParticipantProfileMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  refetchMyself: () => void
  profile: GameParticipantProfile
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
  refetchProfile
}: Props) {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: profile.name,
      introduction: profile.introduction ?? ''
    }
  })
  const [images, setImages] = useState<File[]>([])
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
            introduction: data.introduction,
            memo: null // TODO: 消えてしまうかも
          }
        } as UpdateGameParticipantProfileMutationVariables
      })
    },
    [updateProfile, images]
  )

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
        <p>なまえ: {profile.name}</p>
        <p>紹介文: {profile.introduction}</p>
        <p>アイコン: {profile.profileImageUrl}</p>
        <p>フォロー: {profile.followsCount}</p>
        <p>フォロワー: {profile.followersCount}</p>
        <div className='flex justify-end'>
          <SubmitButton label='更新する' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
