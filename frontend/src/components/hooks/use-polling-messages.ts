import { useEffect, useRef } from 'react'

export const usePollingMessages = (
  callback: () => void,
  intervalMs = 60000
) => {
  const ref = useRef<() => void>(callback)
  useEffect(() => {
    ref.current = callback
  }, [callback])

  useEffect(() => {
    const timer = setInterval(() => ref.current(), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
}
