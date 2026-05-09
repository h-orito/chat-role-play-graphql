import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef
} from 'react'

type FixedBottomCanceler = (cancel: () => void) => void

const FixedBottomContext = createContext<FixedBottomCanceler | null>(null)

type Props = {
  children: ReactNode
}

export const FixedBottomProvider = ({ children }: Props) => {
  // 1つ固定したら他の固定は解除する。
  // 直前の cancel 関数だけ覚えていればよく、再レンダーは不要なので ref で持つ。
  const previousCancelRef = useRef<() => void>(() => {})

  const canceler = useCallback<FixedBottomCanceler>((cancel) => {
    previousCancelRef.current()
    previousCancelRef.current = cancel
  }, [])

  return (
    <FixedBottomContext.Provider value={canceler}>
      {children}
    </FixedBottomContext.Provider>
  )
}

export const useFixedBottom = (): FixedBottomCanceler => {
  const ctx = useContext(FixedBottomContext)
  if (!ctx) {
    throw new Error('useFixedBottom must be used within FixedBottomProvider')
  }
  return ctx
}
