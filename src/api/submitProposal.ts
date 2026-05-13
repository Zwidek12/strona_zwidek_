export interface SubmitProposalInput {
  dateLocal: string
  note: string
}

export interface SubmitProposalResult {
  ok: boolean
  error?: string
}

export async function submitProposal(input: SubmitProposalInput): Promise<SubmitProposalResult> {
  try {
    const res = await fetch('/api/propose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateLocal: input.dateLocal,
        note: input.note,
      }),
    })

    let data: { ok?: boolean; error?: string } = {}
    try {
      data = (await res.json()) as { ok?: boolean; error?: string }
    } catch {
      void 0
    }

    if (!res.ok) {
      return {
        ok: false,
        error: typeof data.error === 'string' ? data.error : `Błąd serwera (${String(res.status)})`,
      }
    }

    if (data.ok !== true) {
      return { ok: false, error: 'Nieoczekiwana odpowiedź serwera.' }
    }

    return { ok: true }
  } catch (err) {
    console.error('submitProposal', err)
    return {
      ok: false,
      error: 'Brak połączenia ze stroną.',
    }
  }
}

export function dateToLocalKey(d: Date): string {
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${String(y)}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
