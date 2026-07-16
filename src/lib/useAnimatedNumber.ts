import { useEffect, useRef, useState } from 'react'

/** Ease-out animated number for live figure ticks. */
export function useAnimatedNumber(
  target: number,
  opts?: { durationMs?: number; decimals?: number },
): number {
  const durationMs = opts?.durationMs ?? 420
  const decimals = opts?.decimals ?? 0
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - t) ** 3
      const value = from + (target - from) * eased
      setDisplay(value)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
        setDisplay(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, durationMs])

  const factor = 10 ** decimals
  return Math.round(display * factor) / factor
}
