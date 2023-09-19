import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Modal from '@/components/modal/modal'
import { ChromePicker } from 'react-color'
import {
  BaseTheme,
  SidebarTheme,
  Theme,
  TypeTheme,
  lightTheme
} from '@/components/theme/theme'

type Props = {
  theme: string | null
  setTheme: Dispatch<SetStateAction<string | null>>
}

export default function ThemeEdit({ theme, setTheme }: Props) {
  const currentTheme =
    theme != null && theme.length > 0
      ? (JSON.parse(theme) as Theme)
      : lightTheme

  const setThemeJson = (json: Theme) => setTheme(JSON.stringify(json))
  const setPrimary = (typeTheme: TypeTheme) => {
    setThemeJson({
      ...currentTheme,
      primary: typeTheme
    })
  }
  const setSecondary = (typeTheme: TypeTheme) => {
    setThemeJson({
      ...currentTheme,
      secondary: typeTheme
    })
  }
  const setWarning = (typeTheme: TypeTheme) => {
    setThemeJson({
      ...currentTheme,
      warning: typeTheme
    })
  }
  const setDanger = (typeTheme: TypeTheme) => {
    setThemeJson({
      ...currentTheme,
      danger: typeTheme
    })
  }

  return (
    <div className='my-4'>
      <BaseColor theme={currentTheme} setTheme={setThemeJson} />
      <SidebarColor theme={currentTheme} setTheme={setThemeJson} />
      <TypeThemeColor
        typeName='決定系'
        theme={currentTheme}
        typeTheme={currentTheme.primary}
        setTypeTheme={setPrimary}
      />
      <TypeThemeColor
        typeName='キャンセル系'
        theme={currentTheme}
        typeTheme={currentTheme.secondary}
        setTypeTheme={setSecondary}
      />
      <TypeThemeColor
        typeName='警告系'
        theme={currentTheme}
        typeTheme={currentTheme.warning}
        setTypeTheme={setWarning}
      />
      <TypeThemeColor
        typeName='破壊系'
        theme={currentTheme}
        typeTheme={currentTheme.danger}
        setTypeTheme={setDanger}
      />
      <NotificationColor
        typeName='説明系'
        theme={currentTheme}
        setTheme={setThemeJson}
      />
    </div>
  )
}

const BaseColor = ({
  theme,
  setTheme
}: {
  theme: Theme
  setTheme: (t: Theme) => void
}) => {
  const setBase = (typeTheme: BaseTheme) => {
    setTheme({
      ...theme,
      base: typeTheme
    })
  }
  const setText = (c: string) => setBase({ ...theme.base, text: c })
  const setLink = (c: string) => setBase({ ...theme.base, link: c })
  const setBackground = (c: string) => setBase({ ...theme.base, background: c })
  const setBorder = (c: string) => setBase({ ...theme.base, border: c })

  return (
    <div className='base-border my-4 border-b'>
      <strong>通常</strong>
      <div className='mt-1 flex justify-center gap-4'>
        <div className=''>
          文字:&nbsp;
          <ColorPicker color={theme.base.text} setColor={setText} />
        </div>
        <div className=''>
          リンク:&nbsp;
          <ColorPicker color={theme.base.link} setColor={setLink} />
        </div>
        <div className=''>
          背景:&nbsp;
          <ColorPicker color={theme.base.background} setColor={setBackground} />
        </div>
        <div className=''>
          枠線:&nbsp;
          <ColorPicker color={theme.base.border} setColor={setBorder} />
        </div>
      </div>
      <div className='mb-4 mt-2 flex justify-center'>
        <div
          style={{
            color: theme.base.text,
            backgroundColor: theme.base.background
          }}
          className='p-2'
        >
          通常部分の背景や文字色のサンプルです。
          <hr style={{ borderColor: theme.base.border }} />
          ↑は枠線色のサンプルです。
          <span className='base-link cursor-pointer'>リンク</span>
          はこの文字色で表示されます。
        </div>
      </div>
    </div>
  )
}

const SidebarColor = ({
  theme,
  setTheme
}: {
  theme: Theme
  setTheme: (t: Theme) => void
}) => {
  const setSidebar = (sidebarTheme: SidebarTheme) => {
    setTheme({
      ...theme,
      sidebar: sidebarTheme
    })
  }
  const setText = (c: string) => setSidebar({ ...theme.sidebar, text: c })
  const setBackground = (c: string) =>
    setSidebar({ ...theme.sidebar, background: c })
  const setHover = (c: string) => setSidebar({ ...theme.sidebar, hover: c })

  return (
    <div className='base-border my-4 border-b'>
      <strong>メニュー</strong>
      <div className='mt-1 flex justify-center gap-4'>
        <div className=''>
          文字:&nbsp;
          <ColorPicker color={theme.sidebar.text} setColor={setText} />
        </div>
        <div className=''>
          背景:&nbsp;
          <ColorPicker
            color={theme.sidebar.background}
            setColor={setBackground}
          />
        </div>
        <div className=''>
          ホバー時:&nbsp;
          <ColorPicker color={theme.sidebar.hover} setColor={setHover} />
        </div>
      </div>
      <div className='mb-4 mt-2 flex justify-center'>
        <div className='sidebar-sample cursor-pointer p-2'>
          サイドバー、メニューの背景や文字色のサンプルです。
        </div>
        <style jsx>
          {`
            .sidebar-sample {
              color: ${theme.sidebar.text};
              background-color: ${theme.sidebar.background};
              &:hover {
                background-color: ${theme.sidebar.hover};
              }
            }
          `}
        </style>
      </div>
    </div>
  )
}

const TypeThemeColor = ({
  typeName,
  theme,
  typeTheme,
  setTypeTheme
}: {
  typeName: string
  theme: Theme
  typeTheme: TypeTheme
  setTypeTheme: (typeTheme: TypeTheme) => void
}) => {
  const setText = (c: string) => setTypeTheme({ ...typeTheme, text: c })
  const setBackground = (c: string) =>
    setTypeTheme({ ...typeTheme, background: c })
  const setBorder = (c: string) => setTypeTheme({ ...typeTheme, border: c })
  const setActive = (c: string) => setTypeTheme({ ...typeTheme, active: c })

  return (
    <div className='base-border my-4 border-b'>
      <strong>{typeName}</strong>
      <div className='mt-1 flex justify-center gap-4'>
        <div>
          文字:&nbsp;
          <ColorPicker color={typeTheme.text} setColor={setText} />
        </div>
        <div>
          背景:&nbsp;
          <ColorPicker color={typeTheme.background} setColor={setBackground} />
        </div>
        <div>
          枠線:&nbsp;
          <ColorPicker color={typeTheme.border} setColor={setBorder} />
        </div>
        <div>
          アクティブ:&nbsp;
          <ColorPicker color={typeTheme.active} setColor={setActive} />
        </div>
      </div>
      <div className='mb-4 mt-2 flex justify-center'>
        <div
          className='p-2'
          style={{
            color: theme.base.text,
            backgroundColor: theme.base.background
          }}
        >
          {typeName}ボタンの文字色や背景色に使用されます。
          <div>
            <>
              <button
                className={`sample-button rounded-sm border px-4 py-1`}
                onClick={(e: any) => e.preventDefault()}
              >
                {typeName}ボタン
              </button>
              <style jsx>{`
                .sample-button {
                  color: ${typeTheme.text};
                  background-color: ${typeTheme.background};
                  border-color: ${typeTheme.border};
                  &:hover {
                    background-color: ${typeTheme.active};
                  }
                }
              `}</style>
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

const NotificationColor = ({
  typeName,
  theme,
  setTheme
}: {
  typeName: string
  theme: Theme
  setTheme: (theme: Theme) => void
}) => {
  const setNotification = (typeTheme: TypeTheme) => {
    setTheme({
      ...theme,
      notification: typeTheme
    })
  }
  const setText = (c: string) =>
    setNotification({ ...theme.notification, text: c })
  const setBackground = (c: string) =>
    setNotification({ ...theme.notification, background: c })
  const setBorder = (c: string) =>
    setNotification({ ...theme.notification, border: c })
  const setActive = (c: string) =>
    setNotification({ ...theme.notification, active: c })

  return (
    <div className='my-4'>
      <strong>{typeName}</strong>
      <div className='mt-1 flex justify-center gap-4'>
        <div>
          文字:&nbsp;
          <ColorPicker color={theme.notification.text} setColor={setText} />
        </div>
        <div>
          背景:&nbsp;
          <ColorPicker
            color={theme.notification.background}
            setColor={setBackground}
          />
        </div>
        <div>
          枠線:&nbsp;
          <ColorPicker color={theme.notification.border} setColor={setBorder} />
        </div>
        <div>
          アクティブ:&nbsp;
          <ColorPicker color={theme.notification.active} setColor={setActive} />
        </div>
      </div>
      <div className='mb-4 mt-2 flex justify-center'>
        <div
          className='p-2'
          style={{
            color: theme.notification.text,
            backgroundColor: theme.notification.background,
            borderColor: theme.notification.border
          }}
        >
          お知らせや説明の文字色や背景色に使用されます。
        </div>
      </div>
    </div>
  )
}

const ColorPicker = ({
  color,
  setColor
}: {
  color: string
  setColor: (c: string) => void
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const handleOpen = (e: any) => {
    e.preventDefault()
    setIsPickerOpen(true)
  }
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsPickerOpen(!isPickerOpen)
    }
  }
  return (
    <>
      <button
        className='base-border border bg-white p-0.5'
        onClick={handleOpen}
      >
        <p className='h-3 w-6' style={{ backgroundColor: color }}></p>
      </button>
      {isPickerOpen && (
        <Modal close={toggleModal} hideFooter>
          <PickerArea
            color={color}
            handleChange={(c: any) => setColor(c.hex)}
          />
        </Modal>
      )}
    </>
  )
}

const PickerArea = ({
  color,
  handleChange
}: {
  color: string
  handleChange: (c: any) => void
}) => {
  return (
    <div className='flex justify-center'>
      <ChromePicker color={color} onChange={handleChange} />
    </div>
  )
}
