import Image from 'next/image'
import SubmitButton from '@/components/button/submit-button'
import {
  DeleteParticipantIconDocument,
  DeleteParticipantIconMutation,
  DeleteParticipantIconMutationVariables,
  GameParticipantIcon,
  UpdateGameParticipantIcon,
  UpdateIconDocument,
  UpdateIconMutation,
  UpdateIconMutationVariables,
  UploadIconsDocument,
  UploadIconsMutation,
  UploadIconsMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import {
  CSSProperties,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
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
import InputImages from '@/components/form/input-images'
import { useGameValue } from '../game-hook'

type Props = {
  close: (e: any) => void
  icons: Array<GameParticipantIcon>
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
}

export default function ParticipantIconEdit({
  close,
  icons: defaultIcons,
  refetchIcons
}: Props) {
  const [icons, setIcons] = useState<Array<GameParticipantIcon>>(defaultIcons)
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <div>
      <IconSortArea
        icons={icons}
        setIcons={setIcons}
        refetchIcons={refetchIcons}
        submitting={submitting}
        setSubmitting={setSubmitting}
      />
      <IconUploadArea
        refetchIcons={refetchIcons}
        setIcons={setIcons}
        submitting={submitting}
        setSubmitting={setSubmitting}
      />
      {icons.length > 0 && (
        <IconDeleteArea
          icons={icons}
          setIcons={setIcons}
          refetchIcons={refetchIcons}
        />
      )}
    </div>
  )
}

const IconSortArea = ({
  icons,
  setIcons,
  refetchIcons,
  submitting,
  setSubmitting
}: {
  icons: Array<GameParticipantIcon>
  setIcons: Dispatch<SetStateAction<GameParticipantIcon[]>>
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
  submitting: boolean
  setSubmitting: Dispatch<SetStateAction<boolean>>
}) => {
  const game = useGameValue()
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
  const [updateIcon] = useMutation<UpdateIconMutation>(UpdateIconDocument)
  const handleSaveSort = async () => {
    setSubmitting(true)
    // 並び順に変更のあったアイコンのみ更新
    const results = []
    for (let i = 0; i < icons.length; i++) {
      const newDisplayOrder = i + 1
      const icon = icons[i]
      if (icon.displayOrder !== newDisplayOrder) {
        results.push(
          updateIcon({
            variables: {
              input: {
                gameId: game.id,
                id: icon.id,
                displayOrder: newDisplayOrder
              } as UpdateGameParticipantIcon
            } as UpdateIconMutationVariables
          })
        )
      }
    }
    await Promise.all(results)
    const newIcons = await refetchIcons()
    setIcons(newIcons)
    setSubmitting(false)
  }

  return (
    <div className='mb-1'>
      <label className='text-xs font-bold'>並び替え</label>
      {icons.length === 0 && <p>アイコンが登録されていません。</p>}
      {icons.length > 0 && (
        <>
          <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
            ドラッグアンドドロップで並び替えて「反映」ボタンを押してください。
          </p>
          <div className='flex flex-wrap'>
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
            <PrimaryButton disabled={submitting} click={() => handleSaveSort()}>
              反映
            </PrimaryButton>
          </div>
        </>
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

const IconUploadArea = ({
  refetchIcons,
  setIcons,
  submitting,
  setSubmitting
}: {
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
  setIcons: Dispatch<SetStateAction<GameParticipantIcon[]>>
  submitting: boolean
  setSubmitting: Dispatch<SetStateAction<boolean>>
}) => {
  const game = useGameValue()
  // upload new icon --------------------------------------
  const [images, setImages] = useState<File[]>([])
  const canSubmit: boolean = images.length > 0 && !submitting
  const [uploadIcons] = useMutation<UploadIconsMutation>(UploadIconsDocument, {
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
      uploadIcons({
        variables: {
          input: {
            gameId: game.id,
            iconFiles: images,
            width: 60,
            height: 60
          }
        } as UploadIconsMutationVariables
      })
    },
    [uploadIcons, images]
  )

  return (
    <form onSubmit={onSubmit}>
      <div className='my-4'>
        <label className='text-xs font-bold'>追加</label>
        <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
          jpeg, jpg,
          png形式かつ300kByte以下の画像を選択し、「追加」ボタンを押してください。
          <br />
          縦横ともに60pxで表示されます。
        </p>
        {images.length > 0 && (
          <div>
            {images
              .map((file: File) => URL.createObjectURL(file))
              .map((url: string) => (
                <img
                  key={url}
                  className='mb-2 inline-block w-32'
                  src={url}
                  alt='画像'
                />
              ))}
          </div>
        )}
        <InputImages
          name='iconImages'
          images={images}
          setImages={setImages}
          maxFileKByte={300}
        />
      </div>
      <div className='flex justify-end'>
        <SubmitButton label='追加' disabled={!canSubmit} />
      </div>
    </form>
  )
}

const IconDeleteArea = ({
  icons,
  setIcons,
  refetchIcons
}: {
  icons: Array<GameParticipantIcon>
  setIcons: Dispatch<SetStateAction<GameParticipantIcon[]>>
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
}) => {
  const game = useGameValue()
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
    <div className='mb-1'>
      <label className='text-xs font-bold'>削除</label>
      <p className='notification-background notification-text my-1 rounded-sm p-2 text-xs leading-5'>
        ゴミ箱アイコンから確認を経て削除することができます。
        <br />
        削除すると元に戻せません。アイコンを削除すると、プロフィールのアイコン一覧と、発言時のアイコン候補から削除されます。
        <br />
        発言済みのメッセージのアイコンは削除されません。
      </p>
      {icons.map((icon) => (
        <div className='relative inline-block' key={icon.id}>
          <Image
            className=''
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
  )
}
