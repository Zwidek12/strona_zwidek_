import type { ReactElement } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { dateToLocalKey, submitProposal } from '../api/submitProposal'

interface PixelCalendarProps {
  onClose: () => void
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

interface GridCell {
  key: string
  date: Date
  label: string
  isCurrentMonth: boolean
  isToday: boolean
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function buildMonthGrid(year: number, monthIndex: number): GridCell[] {
  const first = new Date(year, monthIndex, 1)
  const startWeekday = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const prevMonthDays = new Date(year, monthIndex, 0).getDate()

  const cells: GridCell[] = []
  const today = new Date()
  const isToday = (d: Date): boolean => sameCalendarDay(d, today)

  for (let i = 0; i < startWeekday; i += 1) {
    const day = prevMonthDays - startWeekday + i + 1
    const d = new Date(year, monthIndex - 1, day)
    cells.push({
      key: `p-${year}-${monthIndex}-${i}`,
      date: d,
      label: String(day),
      isCurrentMonth: false,
      isToday: isToday(d),
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(year, monthIndex, day)
    cells.push({
      key: `c-${year}-${monthIndex}-${day}`,
      date: d,
      label: String(day),
      isCurrentMonth: true,
      isToday: isToday(d),
    })
  }

  const minCells = Math.max(42, Math.ceil(cells.length / 7) * 7)
  let nextDay = 1
  while (cells.length < minCells) {
    const d = new Date(year, monthIndex + 1, nextDay)
    cells.push({
      key: `n-${year}-${monthIndex}-${nextDay}`,
      date: d,
      label: String(nextDay),
      isCurrentMonth: false,
      isToday: isToday(d),
    })
    nextDay += 1
  }

  return cells
}

const WEEK_LABELS: readonly string[] = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']

export function PixelCalendar({ onClose }: PixelCalendarProps): ReactElement {
  const initial = useMemo(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  }, [])

  const [view, setView] = useState<{ y: number; m: number }>(initial)
  const [selected, setSelected] = useState<Date | null>(null)
  const [note, setNote] = useState<string>('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string>('')

  const title = useMemo((): string => {
    return new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(
      new Date(view.y, view.m, 1),
    )
  }, [view.m, view.y])

  const grid = useMemo((): GridCell[] => buildMonthGrid(view.y, view.m), [view.m, view.y])

  const selectedLabel = useMemo((): string | null => {
    if (!selected) {
      return null
    }
    try {
      return new Intl.DateTimeFormat('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(selected)
    } catch (err) {
      console.error('PixelCalendar: format selected date failed', err)
      return selected.toDateString()
    }
  }, [selected])

  const shiftMonth = useCallback((delta: number): void => {
    setView((prev) => {
      const d = new Date(prev.y, prev.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }, [])

  const pickDay = useCallback((d: Date): void => {
    setSelected(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    setSubmitStatus('idle')
    setSubmitError('')
  }, [])

  const handleSendProposal = useCallback(async (): Promise<void> => {
    if (!selected) {
      return
    }
    setSubmitStatus('loading')
    setSubmitError('')
    const dateLocal = dateToLocalKey(selected)
    try {
      const result = await submitProposal({ dateLocal, note: note.trim() })
      if (result.ok) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
        setSubmitError(result.error ?? 'Nie udało się wysłać.')
      }
    } catch (err) {
      console.error('handleSendProposal', err)
      setSubmitStatus('error')
      setSubmitError('Nieoczekiwany błąd.')
    }
  }, [note, selected])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-title"
    >
      <div className="flex max-h-[min(92dvh,92svh)] w-full max-w-sm flex-col overflow-hidden border-4 border-[#5c3a21] bg-[#f5e6c8] text-[#3c2a1e] shadow-[8px_8px_0_#2a1a0f]">
        <div className="min-h-0 overflow-y-auto overscroll-y-contain p-4 [-webkit-overflow-scrolling:touch]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            className="touch-manipulation flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center border-4 border-[#5c3a21] bg-[#e8cfa6] px-2 py-2 text-[16px] leading-none text-[#3c2a1e] shadow-[inset_1px_1px_0_#fff6dc]"
            onClick={() => {
              shiftMonth(-1)
            }}
            aria-label="Poprzedni miesiąc"
          >
            {'<'}
          </button>
          <h2
            id="calendar-title"
            className="min-w-0 flex-1 text-center text-[14px] uppercase leading-tight tracking-normal sm:text-[15px]"
          >
            {title}
          </h2>
          <button
            type="button"
            className="touch-manipulation flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center border-4 border-[#5c3a21] bg-[#e8cfa6] px-2 py-2 text-[16px] leading-none text-[#3c2a1e] shadow-[inset_1px_1px_0_#fff6dc]"
            onClick={() => {
              shiftMonth(1)
            }}
            aria-label="Następny miesiąc"
          >
            {'>'}
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[13px] text-[#5c3a21] sm:text-[14px]">
          {WEEK_LABELS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-[14px] sm:text-[15px]">
          {grid.map((cell) => {
            const isSelected = selected !== null && sameCalendarDay(cell.date, selected)
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => {
                  pickDay(cell.date)
                }}
                aria-label={`Wybierz ${cell.date.toLocaleDateString('pl-PL')}`}
                aria-pressed={isSelected}
                className={[
                  'touch-manipulation flex aspect-square min-h-[2.75rem] min-w-0 cursor-pointer items-center justify-center border-2 border-[#c49a6c] bg-[#fff3d6] leading-none transition-colors hover:bg-[#ffe8b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#5c3a21] active:bg-[#ffe0a0]',
                  cell.isCurrentMonth ? 'text-[#3c2a1e]' : 'text-[#a08066]',
                  cell.isToday ? 'ring-2 ring-[#d95763] ring-offset-1 ring-offset-[#f5e6c8]' : '',
                  isSelected ? 'bg-[#c8e6a0] ring-2 ring-[#5c8c2a] ring-offset-1 ring-offset-[#f5e6c8]' : '',
                ].join(' ')}
              >
                {cell.label}
              </button>
            )
          })}
        </div>

        <p className="mt-3 min-h-[2.75rem] text-center text-[14px] leading-snug text-[#3c2a1e] sm:text-[15px]">
          {selectedLabel !== null ? (
            <>
              <span className="text-[#5c3a21]">Wybrano:</span> {selectedLabel}
            </>
          ) : (
            <span className="text-[#7a634e]">Kliknij dzień w kalendarzu</span>
          )}
        </p>

        <label className="mt-2 block text-[13px] text-[#5c3a21] sm:text-[14px]" htmlFor="proposal-note">
          Opcjonalna wiadomość
        </label>
        <textarea
          id="proposal-note"
          className="mt-1 w-full resize-y border-4 border-[#c49a6c] bg-[#fff3d6] p-2 text-[16px] text-[#3c2a1e] placeholder:text-[#a08066] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5c3a21] sm:text-[14px]"
          rows={3}
          maxLength={2000}
          value={note}
          placeholder="Np. preferowana godzina…"
          onChange={(e) => {
            setNote(e.target.value)
          }}
          disabled={submitStatus === 'loading'}
        />

        {submitStatus === 'success' ? (
          <p className="mt-2 text-center text-[14px] text-[#2d6b3a] sm:text-[15px]">
            Wysłano — sprawdź skrzynkę (także spam).
          </p>
        ) : null}
        {submitStatus === 'error' && submitError.length > 0 ? (
          <p className="mt-2 text-center text-[14px] text-[#a62c2c] sm:text-[15px]" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="touch-manipulation min-h-11 cursor-pointer border-4 border-[#5c3a21] bg-[#c8e6a0] px-3 py-2.5 text-[14px] text-[#1e3d0f] shadow-[inset_2px_2px_0_#e8ffd0,inset_-2px_-2px_0_#7aab55] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]"
            disabled={selected === null || submitStatus === 'loading' || submitStatus === 'success'}
            onClick={() => {
              void handleSendProposal()
            }}
          >
            {submitStatus === 'loading' ? 'Wysyłanie…' : 'Wyślij propozycję na maila'}
          </button>
          <button
            type="button"
            className="touch-manipulation min-h-11 cursor-pointer border-4 border-[#5c3a21] bg-[#e8cfa6] px-3 py-2.5 text-[14px] text-[#3c2a1e] shadow-[inset_2px_2px_0_#fff6dc,inset_-2px_-2px_0_#caa574] sm:text-[15px]"
            onClick={onClose}
          >
            Zamknij
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
