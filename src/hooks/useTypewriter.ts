import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text: string, speed = 4, enabled = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    if (!text) {
      setDone(true)
      return
    }

    intervalRef.current = setInterval(() => {
      indexRef.current = Math.min(indexRef.current + 3, text.length)
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!)
        setDone(true)
      }
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed, enabled])

  return { displayed, done }
}
