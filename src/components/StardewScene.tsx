import type { ReactElement } from 'react'
import { useState } from 'react'
import { EscapeNoButton } from './EscapeNoButton'
import { PixelCalendar } from './PixelCalendar'
import { useTypewriter } from '../hooks/useTypewriter'

const DIALOG_TEXT =
  "Cześć Olivia! Wiem, że eksploracja kopalni jest męcząca... ale ja mam dla Ciebie idealny 'prezent'. Czy dasz się zaprosić na kawę, żeby pogadać o czymś więcej niż tylko rudach?"

const PORTRAIT_SRC = '/portret.jfif'

function CenterPortrait(): ReactElement {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
      <div
        className="relative p-[10px] sm:p-[12px]"
        style={{
          background:
            'linear-gradient(145deg, #6b4423 0%, #4a2c14 40%, #5c3a21 55%, #3d2412 100%)',
          boxShadow:
            '0 0 0 2px #8b6239, 0 0 0 6px #3d2412, 8px 10px 0 #1a0f0a, inset 0 1px 0 #a07048',
        }}
      >
        <div
          className="absolute left-1 top-1 h-2 w-2 rounded-[1px] bg-[#c49a6c] opacity-90 sm:left-1.5 sm:top-1.5"
          aria-hidden
        />
        <div
          className="absolute right-1 top-1 h-2 w-2 rounded-[1px] bg-[#c49a6c] opacity-90 sm:right-1.5 sm:top-1.5"
          aria-hidden
        />
        <div
          className="absolute bottom-1 left-1 h-2 w-2 rounded-[1px] bg-[#c49a6c] opacity-90 sm:bottom-1.5 sm:left-1.5"
          aria-hidden
        />
        <div
          className="absolute bottom-1 right-1 h-2 w-2 rounded-[1px] bg-[#c49a6c] opacity-90 sm:bottom-1.5 sm:right-1.5"
          aria-hidden
        />
        <div className="border-4 border-[#2a1810] bg-[#1a120c] p-1 shadow-[inset_0_0_0_2px_#5c4030,inset_0_2px_8px_rgba(0,0,0,0.45)]">
          <img
            src={PORTRAIT_SRC}
            alt="Portret postaci w stylu Stardew Valley"
            className="mx-auto block h-auto max-h-[min(52vh,520px)] w-auto max-w-[min(88vw,340px)] object-contain [image-rendering:pixelated]"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}

function PastoralBackdrop(): ReactElement {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 scale-105 blur-sm">
        <div
          className="absolute inset-0 bg-[length:120%_120%]"
          style={{
            backgroundImage: [
              'linear-gradient(180deg, #87ceeb 0%, #b8e8ff 42%, #9fd38a 42%, #7cbd5c 58%, #5a9e3f 72%, #3d7a2f 100%)',
              'radial-gradient(ellipse 80% 40% at 18% 88%, rgba(60,120,60,0.55), transparent 60%)',
              'radial-gradient(ellipse 70% 35% at 78% 90%, rgba(50,110,50,0.5), transparent 55%)',
              'radial-gradient(circle at 22% 28%, rgba(255,255,255,0.75), transparent 35%)',
              'radial-gradient(circle at 70% 18%, rgba(255,255,255,0.45), transparent 28%)',
            ].join(', '),
          }}
        />
        <div className="absolute bottom-[18%] left-[8%] h-16 w-24 -rotate-6 rounded-sm bg-[#2d6b3a] opacity-80 shadow-[4px_4px_0_#1a4022]" />
        <div className="absolute bottom-[20%] right-[12%] h-20 w-28 rotate-3 rounded-sm bg-[#2f5f35] opacity-75 shadow-[4px_4px_0_#1a3a20]" />
        <div className="absolute bottom-[22%] left-1/2 h-14 w-20 -translate-x-1/2 rounded-sm bg-[#356b3c] opacity-70 shadow-[3px_3px_0_#1e4224]" />
      </div>
    </div>
  )
}

export function StardewScene(): ReactElement {
  const typed = useTypewriter(DIALOG_TEXT, 22)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#2a1810] font-pixel-pl text-[#3c2a1e]">
      <PastoralBackdrop />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <CenterPortrait />

        <div className="p-4 pb-6 sm:p-6">
          <div className="mx-auto max-w-3xl border-4 border-[#5c3a21] bg-[#f5e6c8] p-4 shadow-[8px_8px_0_#2a1a0f] sm:p-5">
            <div className="min-h-[14rem] border-4 border-[#c49a6c] bg-[#fff3d6] p-3 sm:min-h-[15rem] sm:p-4">
              <p className="text-left text-[15px] leading-snug tracking-normal sm:text-[16px]">
                {typed}
                {typed.length < DIALOG_TEXT.length ? (
                  <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-0.5 bg-[#3c2a1e]" />
                ) : null}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <button
                type="button"
                className="shrink-0 border-4 border-[#5c3a21] bg-[#e8cfa6] px-4 py-3 text-left text-[14px] leading-snug text-[#3c2a1e] shadow-[inset_2px_2px_0_#fff6dc,inset_-2px_-2px_0_#caa574] sm:max-w-[58%] sm:text-[15px]"
                onClick={() => {
                  setCalendarOpen(true)
                }}
              >
                Tak (Zaproponuj termin)
              </button>
              <EscapeNoButton label="Nie" />
            </div>
          </div>
        </div>
      </div>

      {calendarOpen ? (
        <PixelCalendar
          onClose={() => {
            setCalendarOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
