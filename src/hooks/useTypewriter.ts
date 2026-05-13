import { useEffect, useState } from 'react'

export function useTypewriter(fullText: string, msPerChar: number): string {
  const [displayed, setDisplayed] = useState<string>('')

  useEffect(() => {
    let intervalId: ReturnType<typeof window.setInterval> | undefined
    const frameId = requestAnimationFrame(() => {
      setDisplayed('')
      let index = 0
      intervalId = window.setInterval(() => {
        try {
          index += 1
          if (index > fullText.length) {
            if (intervalId !== undefined) {
              window.clearInterval(intervalId)
            }
            return
          }
          setDisplayed(fullText.slice(0, index))
        } catch (err) {
          console.error('useTypewriter tick failed', err)
          if (intervalId !== undefined) {
            window.clearInterval(intervalId)
          }
        }
      }, msPerChar)
    })

    return (): void => {
      cancelAnimationFrame(frameId)
      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
      }
    }
  }, [fullText, msPerChar])

  return displayed
}
