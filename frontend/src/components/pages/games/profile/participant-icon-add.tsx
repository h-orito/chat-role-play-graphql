import SubmitButton from '@/components/button/submit-button'
import InputImage from '@/components/form/input-image'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import {
  Game,
  GameParticipant,
  GameParticipantIcon,
  UploadIconDocument,
  UploadIconMutation,
  UploadIconMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  icons: Array<GameParticipantIcon>
  refetchIcons: () => void
}

interface FormInput {
  name: string
}

export default function ParticipantIconAdd({
  close,
  game,
  myself,
  icons,
  refetchIcons
}: Props) {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: ''
    }
  })
  const [images, setImages] = useState<File[]>([])
  const canSubmit: boolean =
    formState.isValid && images.length > 0 && !formState.isSubmitting
  const [uploadIcon] = useMutation<UploadIconMutation>(UploadIconDocument, {
    onCompleted(e) {
      refetchIcons()
      close(e)
    },
    onError(error) {
      console.error(error)
    }
  })

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    (data) => {
      uploadIcon({
        variables: {
          input: {
            gameId: game.id,
            name: data.name,
            iconFile: images.length > 0 ? images[0] : null,
            width: 60,
            height: 60
          }
        } as UploadIconMutationVariables
      })
    },
    [uploadIcon, images]
  )

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          label='アイコン名'
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
        <InputImage
          label='アイコン'
          name='iconImage'
          images={images}
          setImages={setImages}
        />
        <div className='flex justify-end'>
          <SubmitButton label='追加する' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
