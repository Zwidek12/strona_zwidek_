import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface EscapeNoButtonProps {
  label: string
}

const SAFE_DISTANCE_PX = 96
const PROXIMITY_PAD_PX = 16

export function EscapeNoButton({ label }: EscapeNoButtonProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 16, y: 16 })

  const relocateAway = useCallback((clientX: number, clientY: number): void => {
    const container = containerRef.current
    const button = buttonRef.current
    if (!container || !button) {
      return
    }

    const c = container.getBoundingClientRect()
    const pad = 8
    const bw = button.offsetWidth
    const bh = button.offsetHeight
    const maxX = Math.max(pad, c.width - bw - pad)
    const maxY = Math.max(pad, c.height - bh - pad)

    for (let attempt = 0; attempt < 48; attempt += 1) {
      const x = pad + Math.random() * Math.max(0, maxX - pad)
      const y = pad + Math.random() * Math.max(0, maxY - pad)
      const centerX = c.left + x + bw / 2
      const centerY = c.top + y + bh / 2
      if (Math.hypot(clientX - centerX, clientY - centerY) >= SAFE_DISTANCE_PX) {
        setOffset({ x, y })
        return
      }
    }

    const corners: Array<{ x: number; y: number }> = [
      { x: pad, y: pad },
      { x: maxX, y: pad },
      { x: pad, y: maxY },
      { x: maxX, y: maxY },
    ]

    let best = corners[0]
    let bestDist = -1
    for (const corner of corners) {
      const cx = c.left + corner.x + bw / 2
      const cy = c.top + corner.y + bh / 2
      const d = Math.hypot(clientX - cx, clientY - cy)
      if (d > bestDist) {
        bestDist = d
        best = corner
      }
    }
    setOffset(best)
  }, [])

  useEffect(() => {
    const checkNear = (clientX: number, clientY: number): void => {
      const button = buttonRef.current
      if (!button) {
        return
      }
      const r = button.getBoundingClientRect()
      const near =
        clientX >= r.left - PROXIMITY_PAD_PX &&
        clientX <= r.right + PROXIMITY_PAD_PX &&
        clientY >= r.top - PROXIMITY_PAD_PX &&
        clientY <= r.bottom + PROXIMITY_PAD_PX
      if (near) {
        relocateAway(clientX, clientY)
      }
    }

    const onMove = (e: MouseEvent): void => {
      checkNear(e.clientX, e.clientY)
    }

    const onTouchMove = (e: TouchEvent): void => {
      if (e.touches.length === 0) {
        return
      }
      const t = e.touches[0]
      checkNear(t.clientX, t.clientY)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return (): void => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [relocateAway])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[min(8.5rem,28svh)] min-w-0 flex-1 sm:min-h-[104px]"
      aria-label="Strefa przycisku odmowy"
    >
      <button
        ref={buttonRef}
        type="button"
        style={{ left: offset.x, top: offset.y }}
        className="touch-manipulation absolute max-w-[min(100%,220px)] min-h-11 min-w-[4.5rem] cursor-default select-none border-4 border-[#5c3a21] bg-[#e8cfa6] px-3 py-2 text-left text-[14px] leading-snug text-[#3c2a1e] shadow-[inset_2px_2px_0_#fff6dc,inset_-2px_-2px_0_#caa574] sm:text-[15px]"
        onPointerEnter={(e) => {
          relocateAway(e.clientX, e.clientY)
        }}
        onPointerDown={(e) => {
          e.preventDefault()
          relocateAway(e.clientX, e.clientY)
        }}
        onClick={(e) => {
          e.preventDefault()
          relocateAway(e.clientX, e.clientY)
        }}
      >
        {label}
      </button>
    </div>
  )
}
