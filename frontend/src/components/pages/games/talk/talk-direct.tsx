import Image from 'next/image'
import RadioGroup from '@/components/form/radio-group'
import {
  DirectMessage,
  Game,
  GameParticipant,
  GameParticipantGroup,
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  MessageType,
  NewDirectMessage,
  TalkDirectDocument,
  TalkDirectDryRunDocument,
  TalkDirectDryRunMutation,
  TalkDirectMutation,
  TalkDirectMutationVariables
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputTextarea from '@/components/form/input-textarea'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import SubmitButton from '@/components/button/submit-button'
import DirectMessageComponent from '../article/message-area/direct-message/direct-message'
import SecondaryButton from '@/components/button/scondary-button'
import TalkTextDecorators from './talk-text-decorators'

type Props = {
  game: Game
  myself: GameParticipant
  close: (e: any) => void
  search: () => void
  gameParticipantGroup: GameParticipantGroup
}

// const candidates = [
//   {
//     label: '通常',
//     value: MessageType.TalkNormal
//   },
//   {
//     label: '独り言',
//     value: MessageType.Monologue
//   }
// ]

interface FormInput {
  name: string
  talkMessage: string
}

export interface TalkDirectRefHandle {
  isTalkMessageEmpty(): boolean
}

const TalkDirect = forwardRef<TalkDirectRefHandle, Props>(
  (props: Props, ref: any) => {
    const { game, myself, close, search, gameParticipantGroup } = props
    const [icons, setIcons] = useState<Array<GameParticipantIcon>>([])
    const [fetchIcons] = useLazyQuery<IconsQuery>(IconsDocument)

    useEffect(() => {
      const fetch = async () => {
        const { data } = await fetchIcons({
          variables: { participantId: myself.id }
        })
        if (data?.gameParticipantIcons == null) return
        setIcons(data.gameParticipantIcons)
        if (data.gameParticipantIcons.length <= 0) return
        setIconId(data.gameParticipantIcons[0].id)
      }
      fetch()
    }, [])

    const { control, formState, handleSubmit, setValue, watch } =
      useForm<FormInput>({
        defaultValues: {
          name: myself.name,
          talkMessage: ''
        }
      })
    const canSubmit: boolean = formState.isValid && !formState.isSubmitting
    const [talkType, setTalkType] = useState(MessageType.TalkNormal)
    const [iconId, setIconId] = useState<string>(
      icons.length > 0 ? icons[0].id : ''
    )
    const [isOpenIconSelectModal, setIsOpenIconSelectModal] = useState(false)
    const toggleIconSelectModal = (e: any) => {
      if (e.target === e.currentTarget) {
        setIsOpenIconSelectModal(!isOpenIconSelectModal)
      }
    }

    const [talkDirectDryRun] = useMutation<TalkDirectDryRunMutation>(
      TalkDirectDryRunDocument,
      {
        onError(error) {
          console.error(error)
        }
      }
    )
    const [talkDirect] = useMutation<TalkDirectMutation>(TalkDirectDocument, {
      onCompleted(e) {
        close(e)
        search()
      },
      onError(error) {
        console.error(error)
      }
    })

    const [preview, setPreview] = useState<DirectMessage | null>(null)
    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const dm = {
          gameId: game.id,
          gameParticipantGroupId: gameParticipantGroup.id,
          type: talkType,
          iconId: iconId,
          name: data.name,
          text: data.talkMessage,
          isConvertDisabled: false // TODO
        } as NewDirectMessage

        if (preview != null) {
          talkDirect({
            variables: {
              input: dm
            } as TalkDirectMutationVariables
          })
        } else {
          const { data } = await talkDirectDryRun({
            variables: {
              input: dm
            } as TalkDirectMutationVariables
          })
          if (data?.registerDirectMessageDryRun == null) return
          setPreview(
            data.registerDirectMessageDryRun.directMessage as DirectMessage
          )
        }
      },
      [talkDirect, talkType, iconId, formState]
    )

    const talkMessage = watch('talkMessage')
    useImperativeHandle(ref, () => ({
      isTalkMessageEmpty() {
        return talkMessage.length <= 0
      }
    }))
    const updateTalkMessage = (str: string) => setValue('talkMessage', str)

    if (icons.length <= 0) return <div>まずはアイコンを登録してください。</div>
    const selectedIcon = icons.find((icon) => icon.id === iconId)

    return (
      <div className='py-2'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <p>DM送信先: {gameParticipantGroup.name}</p>
          </div>
          {/* <div className='mb-2'>
          <p className='mb-1 text-xs font-bold'>種別</p>
          <RadioGroup
            name='talk-type'
            candidates={candidates}
            selected={talkType}
            setSelected={setTalkType}
            disabled={preview != null}
          />
        </div> */}
          <div className='my-2'>
            <p className='text-xs font-bold'>名前</p>
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
              disabled={preview != null}
            />
          </div>
          <div className='mb-1'>
            <p className='text-xs font-bold'>発言装飾</p>
            <div className='flex'>
              <TalkTextDecorators
                selector='#talkMessage'
                setMessage={updateTalkMessage}
              />
            </div>
          </div>
          <div className='flex'>
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
            <div className='ml-2 flex-1'>
              <InputTextarea
                name='talkMessage'
                control={control}
                rules={{
                  required: '必須です',
                  maxLength: {
                    value: 1000,
                    message: '1000文字以内で入力してください'
                  }
                }}
                minRows={5}
                maxLength={1000}
                disabled={preview != null}
              />
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <SubmitButton
              label={preview ? 'プレビュー内容で送信' : 'プレビュー'}
              disabled={!canSubmit}
            />
            {preview && (
              <SecondaryButton className='ml-2' click={() => setPreview(null)}>
                キャンセル
              </SecondaryButton>
            )}
          </div>
        </form>
        {preview && (
          <div className='my-4 border-t border-gray-300 pt-2'>
            <p className='font-bold'>プレビュー</p>
            <div>
              <DirectMessageComponent
                directMessage={preview!}
                myself={myself}
                game={game}
                openProfileModal={() => {}}
                openFavoritesModal={() => {}}
              />
            </div>
          </div>
        )}
        {isOpenIconSelectModal && (
          <Modal close={toggleIconSelectModal} hideFooter>
            <IconSelect
              icons={icons}
              setIconId={setIconId}
              toggle={() => setIsOpenIconSelectModal(false)}
            />
          </Modal>
        )}
      </div>
    )
  }
)

export default TalkDirect

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
