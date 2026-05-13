export interface SubmitProposalInput {
  dateLocal: string
  note: string
}

export interface SubmitProposalResult {
  ok: boolean
  error?: string
}

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

function accessKey(): string {
  const k = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  return typeof k === 'string' ? k.trim() : ''
}

function replyEmail(): string | undefined {
  const e = import.meta.env.VITE_WEB3FORMS_REPLY_EMAIL
  if (typeof e !== 'string' || e.trim().length === 0) {
    return undefined
  }
  return e.trim()
}

export async function submitProposal(input: SubmitProposalInput): Promise<SubmitProposalResult> {
  const key = accessKey()
  if (key.length === 0) {
    return {
      ok: false,
      error:
        'Brak klucza Web3Forms. W Cloudflare Pages dodaj zmienną VITE_WEB3FORMS_ACCESS_KEY (Build) i przebuduj stronę.',
    }
  }

  const subject = `Propozycja terminu: ${input.dateLocal}`
  const message = `Data (lokalna): ${input.dateLocal}\n\n${input.note.trim().length > 0 ? input.note.trim() : '(brak wiadomości)'}`

  const body: Record<string, string> = {
    access_key: key,
    name: 'Strona Olivia — kalendarz',
    subject,
    message,
  }

  const reply = replyEmail()
  if (reply !== undefined) {
    body.email = reply
  }

  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })

    let data: { success?: boolean; message?: string } = {}
    try {
      data = (await res.json()) as { success?: boolean; message?: string }
    } catch {
      void 0
    }

    if (!res.ok) {
      return {
        ok: false,
        error:
          typeof data.message === 'string' && data.message.length > 0
            ? data.message
            : `Błąd wysyłki (${String(res.status)}).`,
      }
    }

    if (data.success !== true) {
      return {
        ok: false,
        error:
          typeof data.message === 'string' && data.message.length > 0
            ? data.message
            : 'Formularz nie został zaakceptowany.',
      }
    }

    return { ok: true }
  } catch (err) {
    console.error('submitProposal', err)
    return {
      ok: false,
      error: 'Brak połączenia (sprawdź internet).',
    }
  }
}

export function dateToLocalKey(d: Date): string {
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${String(y)}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
