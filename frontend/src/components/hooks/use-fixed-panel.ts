import { useCallback, useState } from 'react'
import { useFixedBottom } from '@/components/pages/games/game-hook'

export const useFixedPanel = () => {
  const [isFixed, setIsFixed] = useState(false)
  const otherFixedCanceler = useFixedBottom()

  const toggleFixed = useCallback(
    (e: React.MouseEvent) => {
      if (!isFixed) {
        otherFixedCanceler(() => setIsFixed(false))
      }
      setIsFixed((current) => !current)
      e.stopPropagation()
    },
    [isFixed, otherFixedCanceler]
  )

  return { isFixed, toggleFixed }
}
