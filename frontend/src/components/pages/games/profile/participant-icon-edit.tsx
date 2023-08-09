import Image from 'next/image'
import SubmitButton from '@/components/button/submit-button'
import InputImage from '@/components/form/input-image'
import {
  DeleteParticipantIconDocument,
  DeleteParticipantIconMutation,
  DeleteParticipantIconMutationVariables,
  Game,
  GameParticipant,
  GameParticipantIcon,
  UpdateGameParticipantIcon,
  UpdateIconDocument,
  UpdateIconMutation,
  UpdateIconMutationVariables,
  UploadIconDocument,
  UploadIconMutation,
  UploadIconMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import {
  CSSProperties,
  HTMLAttributes,
  forwardRef,
  useCallback,
  useState
} from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import PrimaryButton from '@/components/button/primary-button'

type Props = {
  close: (e: any) => void
  game: Game
  myself: GameParticipant | null
  icons: Array<GameParticipantIcon>
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
}

export default function ParticipantIconEdit({
  close,
  game,
  myself,
  icons: defaultIcons,
  refetchIcons
}: Props) {
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>(defaultIcons)

  // sort icon -----------------------------------------------
  // see https://iwaking.com/blog/sort-images-with-dnd-kit-react-typescript
  const [activeIcon, setActiveIcon] = useState<GameParticipantIcon>()
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveIcon(icons.find((icon) => icon.id === active.id))
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const activeItem = icons.find((icon) => icon.id === active.id)
    const overItem = icons.find((icon) => icon.id === over.id)
    if (!activeItem || !overItem) return
    const activeIndex = icons.findIndex((icons) => icons.id === active.id)
    const overIndex = icons.findIndex((icons) => icons.id === over.id)
    if (activeIndex !== overIndex) {
      setIcons((prev) =>
        arrayMove<GameParticipantIcon>(prev, activeIndex, overIndex)
      )
    }
    setActiveIcon(undefined)
  }
  const handleDragCancel = () => setActiveIcon(undefined)
  const [updateIcon] = useMutation<UpdateIconMutation>(UpdateIconDocument, {
    onCompleted(e) {
      setSubmitting(false)
    },
    onError(error) {
      setSubmitting(false)
      console.error(error)
    }
  })
  const handleSaveSort = async () => {
    setSubmitting(true)
    const changed = []
    // 変更のあったアイコンのみ更新
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i]
      const prev = defaultIcons[i]
      if (icon.id != prev.id) changed.push(icon)
    }
    // アイコンを更新後再取得
    const results = []
    for (let i = 0; i < changed.length; i++) {
      const icon = changed[i]
      results.push(
        updateIcon({
          variables: {
            input: {
              gameId: game.id,
              id: icon.id,
              displayOrder: i + 1
            } as UpdateGameParticipantIcon
          } as UpdateIconMutationVariables
        })
      )
    }
    await Promise.all(results)
    const newIcons = await refetchIcons()
    setIcons(newIcons)
  }

  // upload new icon --------------------------------------
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState<boolean>(false)
  const canSubmit: boolean = images.length > 0 && !submitting
  const [uploadIcon] = useMutation<UploadIconMutation>(UploadIconDocument, {
    onCompleted(e) {
      setSubmitting(false)
      setImages([])
      refetchIcons().then((icons) => {
        setIcons(icons)
      })
    },
    onError(error) {
      setSubmitting(false)
      console.error(error)
    }
  })

  const onSubmit = useCallback(
    (e: any) => {
      e.preventDefault()
      setSubmitting(true)
      uploadIcon({
        variables: {
          input: {
            gameId: game.id,
            iconFile: images.length > 0 ? images[0] : null,
            width: 60,
            height: 60
          }
        } as UploadIconMutationVariables
      })
    },
    [uploadIcon, images]
  )

  // delete icon --------------------------------------
  const [deleteIcon] = useMutation<DeleteParticipantIconMutation>(
    DeleteParticipantIconDocument,
    {
      onCompleted(e) {
        refetchIcons().then((icons) => {
          setIcons(icons)
        })
      },
      onError(error) {
        console.error(error)
      }
    }
  )

  const handleDelete = useCallback(
    (e: any, iconId: string) => {
      e.preventDefault()
      if (window.confirm('アイコンを削除しますか？') === false) return
      deleteIcon({
        variables: {
          input: {
            gameId: game.id,
            iconId: iconId
          }
        } as DeleteParticipantIconMutationVariables
      })
    },
    [deleteIcon]
  )

  return (
    <div>
      <div className='mb-1'>
        <label className='text-xs font-bold'>並び替え</label>
        <p className='my-1 rounded-sm bg-gray-200 p-2 text-xs leading-5'>
          ドラッグアンドドロップで並び替えて「反映」ボタンを押してください。
        </p>
        {icons.length === 0 && <p>アイコンが登録されていません。</p>}
        {icons.length > 0 && (
          <>
            <div className='flex'>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={icons} strategy={rectSortingStrategy}>
                  {icons.map((icon) => (
                    <SortableItem key={icon.id} icon={icon} />
                  ))}
                </SortableContext>
                <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
                  {activeIcon ? <Icon icon={activeIcon} isDragging /> : null}
                </DragOverlay>
              </DndContext>
            </div>
            <div className='flex justify-end'>
              <PrimaryButton
                disabled={submitting}
                click={() => handleSaveSort()}
              >
                反映
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <div className='my-4'>
          <label className='text-xs font-bold'>追加</label>
          <p className='my-1 rounded-sm bg-gray-200 p-2 text-xs leading-5'>
            jpeg, jpg,
            png形式かつ300kByte以下の画像を選択し、「追加」ボタンを押してください。
            <br />
            縦横ともに60pxで表示されます。
          </p>
          <InputImage
            name='iconImage'
            setImages={setImages}
            maxFileKByte={300}
          />
        </div>
        <div className='flex justify-end'>
          <SubmitButton label='追加' disabled={!canSubmit} />
        </div>
      </form>
      {icons.length > 0 && (
        <div className='mb-1'>
          <label className='text-xs font-bold'>削除</label>
          <p className='my-1 rounded-sm bg-gray-200 p-2 text-xs leading-5'>
            ゴミ箱アイコンから確認を経て削除することができます。
            <br />
            削除すると元に戻せません。アイコンを削除すると、プロフィールのアイコン一覧と、発言時のアイコン候補から削除されます。
            <br />
            発言済みのメッセージのアイコンは削除されません。
          </p>
          <div className='flex'>
            {icons.map((icon) => (
              <div className='relative flex' key={icon.id}>
                <Image
                  className='block w-full'
                  src={icon.url}
                  width={60}
                  height={60}
                  alt='プロフィール画像'
                />
                <button
                  className='absolute right-0 top-0'
                  onClick={(e: any) => handleDelete(e, icon.id)}
                >
                  <TrashIcon className='h-4 w-4 bg-red-500 text-white' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type SortableItemProps = {
  icon: GameParticipantIcon
} & HTMLAttributes<HTMLDivElement>

const SortableItem = ({ icon, ...props }: SortableItemProps) => {
  const { attributes, isDragging, listeners, setNodeRef } = useSortable({
    id: icon.id
  })

  return (
    <Icon
      icon={icon}
      ref={setNodeRef}
      isOpacityEnabled={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}

type IconProps = {
  icon: GameParticipantIcon
  isOpacityEnabled?: boolean
  isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>

const Icon = forwardRef<HTMLDivElement, IconProps>(
  ({ icon, isOpacityEnabled, isDragging, style, ...props }, ref) => {
    const styles: CSSProperties = {
      opacity: isOpacityEnabled ? '0.4' : '1',
      cursor: isDragging ? 'grabbing' : 'grab',
      lineHeight: '0.5',
      transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      ...style
    }

    return (
      <div className='relative flex' ref={ref} style={styles} {...props}>
        <Image
          className='block w-full'
          src={icon.url}
          width={60}
          height={60}
          alt='プロフィール画像'
          style={{
            boxShadow: isDragging
              ? 'none'
              : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
            maxWidth: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    )
  }
)
