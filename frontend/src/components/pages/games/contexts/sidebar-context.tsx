import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

type SidebarContextValue = readonly [isOpen: boolean, toggle: () => void]

const SidebarContext = createContext<SidebarContextValue | null>(null)

type Props = {
  children: ReactNode
}

export const SidebarProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const value = useMemo<SidebarContextValue>(
    () => [isOpen, toggle] as const,
    [isOpen, toggle]
  )
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export const useSidebarOpen = (): SidebarContextValue => {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebarOpen must be used within SidebarProvider')
  }
  return ctx
}
