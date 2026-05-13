interface ProposeEnv {
  RESEND_API_KEY: string
  NOTIFY_TO_EMAIL: string
  FROM_EMAIL: string
}

interface PagesFnContext {
  request: Request
  env: ProposeEnv
}

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const DATE_LOCAL_RE = /^\d{4}-\d{2}-\d{2}$/

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface ProposeBody {
  dateLocal?: string
  note?: string
}

async function sendResendEmail(
  env: ProposeEnv,
  dateLocal: string,
  note: string,
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const safeDate = escapeHtml(dateLocal)
  const safeNote = note.length > 0 ? escapeHtml(note) : '(brak)'

  const html = `
    <p><strong>Nowa propozycja terminu (strona)</strong></p>
    <p><strong>Data (lokalna):</strong> ${safeDate}</p>
    <p><strong>Wiadomość:</strong><br/>${safeNote.replace(/\n/g, '<br/>')}</p>
  `.trim()

  const text = `Propozycja terminu\nData: ${dateLocal}\nWiadomość:\n${note || '(brak)'}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.NOTIFY_TO_EMAIL],
      subject: `Propozycja terminu: ${dateLocal}`,
      html,
      text,
    }),
  })

  const raw = await res.text()
  let message = raw
  try {
    const j = JSON.parse(raw) as { message?: string }
    if (typeof j.message === 'string') {
      message = j.message
    }
  } catch {
    void 0
  }

  if (!res.ok) {
    return { ok: false, status: res.status, message }
  }

  return { ok: true }
}

async function handlePost(context: PagesFnContext): Promise<Response> {
  const { env } = context

  if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.FROM_EMAIL) {
    return new Response(JSON.stringify({ ok: false, error: 'Brak konfiguracji serwera (Resend).' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }

  let body: ProposeBody
  try {
    body = (await context.request.json()) as ProposeBody
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Niepoprawny JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }

  const dateLocal = typeof body.dateLocal === 'string' ? body.dateLocal.trim() : ''
  if (!DATE_LOCAL_RE.test(dateLocal)) {
    return new Response(JSON.stringify({ ok: false, error: 'Niepoprawna data.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }

  const noteRaw = typeof body.note === 'string' ? body.note : ''
  const note = noteRaw.trim().slice(0, 2000)

  try {
    const sent = await sendResendEmail(env, dateLocal, note)
    if (!sent.ok) {
      console.error('Resend error', sent.status, sent.message)
      return new Response(JSON.stringify({ ok: false, error: 'Nie udało się wysłać wiadomości.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }
  } catch (err) {
    console.error('sendResendEmail threw', err)
    return new Response(JSON.stringify({ ok: false, error: 'Błąd wysyłki.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export async function onRequest(context: PagesFnContext): Promise<Response> {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }
  if (context.request.method === 'POST') {
    return handlePost(context)
  }
  return new Response(JSON.stringify({ ok: false, error: 'Metoda niedozwolona.' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}
