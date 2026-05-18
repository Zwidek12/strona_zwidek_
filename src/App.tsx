import confetti from 'canvas-confetti'
import {
  AlertTriangle,
  FileSearch,
  Lock,
  Send,
  Shield,
  Terminal,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type AppView = 'login' | 'dashboard' | 'warrant'

type EndpointId =
  | 'textiles'
  | 'psychology'
  | 'wsb-logs'
  | 'warrant-issue'

type HttpMethod = 'GET' | 'POST'

type ResponseTab = 'body' | 'headers'

interface EndpointConfig {
  id: EndpointId
  method: HttpMethod
  path: string
  label: string
  hint?: string
}

interface ApiResult {
  status: number
  statusText: string
  body: Record<string, unknown>
  headers: Record<string, string>
}

interface ArrestQuery {
  csStackSize: number
  targetMain: 'Lulu' | 'Jinx'
}

const LOGIN_PASSWORD = "admin' OR 1=1 --"

const EASTER_EGG_SEQUENCE = 'zwidek'

const TERMINAL_MESSAGES = [
  '> System status: Overloaded (User nie wie w co ręce włożyć)',
  '> Fetching Tokyo Ghoul manga chapters... 100%',
  '> Alert: Wykładowca Dziurewicz zlokalizowany w sektorze 4. Sara stress level +99.',
  '> Compiling low-code banking module... FAILED. (Cuda dla banków error)',
  '> Smoke break initiated. Czekanie na fajkę...',
  '> Verifying Marvel Cinematic Universe phase 3... Error: Knowledge fragmentary.',
] as const

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'textiles',
    method: 'GET',
    path: '/api/v1/suspect/textiles',
    label: 'Biologia i Tekstylia',
  },
  {
    id: 'psychology',
    method: 'GET',
    path: '/api/v1/suspect/psychology',
    label: 'Profil Psychologiczny',
  },
  {
    id: 'wsb-logs',
    method: 'GET',
    path: '/api/v1/work/wsb-logs',
    label: 'Środowisko Pracy',
  },
  {
    id: 'warrant-issue',
    method: 'POST',
    path: '/api/v1/warrant/issue',
    label: 'Wydanie nakazu (Puzzle)',
    hint: 'interface ArrestQuery { csStackSize: number; targetMain: "Lulu" | "Jinx"; }',
  },
]

const DEFAULT_POST_BODY = `{
  "csStackSize": 5,
  "targetMain": "Lulu"
}`

function fireConfetti(): void {
  const duration = 3000
  const end = Date.now() + duration

  const frame = (): void => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#22d3ee', '#4ade80', '#f43f5e', '#fbbf24'],
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#22d3ee', '#4ade80', '#f43f5e', '#fbbf24'],
    })
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.55 },
    colors: ['#22d3ee', '#4ade80', '#a78bfa'],
  })
}

function getEndpointResponse(id: EndpointId): ApiResult | null {
  switch (id) {
    case 'textiles':
      return {
        status: 200,
        statusText: 'OK',
        body: {
          item: 'Misiek antystresowy',
          status: 'Produkcja seryjna',
          labNotes:
            'Podejrzana tworzy pluszowe misie antystresowe w wielu kolorach. Trening FBW utrzymuje jej parametry fizyczne w normie.',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    case 'psychology':
      return {
        status: 200,
        statusText: 'OK',
        body: {
          manga: 'Tokyo Ghoul (Przeczytana cała seria)',
          tvSeries: 'Sherlock BBC',
          mindPalace: 'Aktywny',
          addictions: 'Wykryto podwyższone stężenie dymu (kurde fajka).',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    case 'wsb-logs':
      return {
        status: 200,
        statusText: 'OK',
        body: {
          currentTask: 'Aplikacje low-code dla banków',
          mentalState:
            'Krytyczny - AI czasami dopierdala psychicznie i daje gówno',
          wsbIncident: 'Wykładowca Dziurewicz ponownie wkurzył Sarę.',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    default:
      return null
  }
}

function parseArrestQuery(raw: string): ArrestQuery | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }
    const obj = parsed as Record<string, unknown>
    if (
      typeof obj.csStackSize !== 'number' ||
      (obj.targetMain !== 'Lulu' && obj.targetMain !== 'Jinx')
    ) {
      return null
    }
    return {
      csStackSize: obj.csStackSize,
      targetMain: obj.targetMain,
    }
  } catch {
    return null
  }
}

function handleWarrantIssue(raw: string): ApiResult {
  const query = parseArrestQuery(raw)
  if (!query) {
    return {
      status: 400,
      statusText: 'Bad Request',
      body: {
        error: 'Nieprawidłowy JSON',
        message: 'Oczekiwano ArrestQuery z csStackSize i targetMain.',
      },
      headers: { 'Content-Type': 'application/json' },
    }
  }

  if (query.csStackSize !== 5) {
    return {
      status: 400,
      statusText: 'Bad Request',
      body: {
        error: 'Błąd walidacji.',
        message:
          'Wykryto randomów w teamie. Ustaw pełny 5-stack, żeby żadnego ukra nie było.',
      },
      headers: { 'Content-Type': 'application/json' },
    }
  }

  if (query.targetMain !== 'Lulu') {
    return {
      status: 400,
      statusText: 'Bad Request',
      body: {
        error: 'Błąd walidacji.',
        message: 'targetMain musi być "Lulu" dla tego nakazu.',
      },
      headers: { 'Content-Type': 'application/json' },
    }
  }

  return {
    status: 200,
    statusText: 'OK',
    body: {
      matchFound: true,
      suspect: 'Maksymilian Frankowski',
      action: 'Generowanie nakazu aresztowania.',
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Warrant-Status': 'GENERATING',
    },
  }
}

function randomTerminalDelay(): number {
  return 3000 + Math.floor(Math.random() * 2001)
}

export default function App(): React.ReactElement {
  const [view, setView] = useState<AppView>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [selectedId, setSelectedId] = useState<EndpointId>('textiles')
  const [responseTab, setResponseTab] = useState<ResponseTab>('body')
  const [requestBody, setRequestBody] = useState(DEFAULT_POST_BODY)
  const [response, setResponse] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [location, setLocation] = useState('')
  const [warrantConfirmed, setWarrantConfirmed] = useState(false)

  const [terminalLines, setTerminalLines] = useState<string[]>([
    TERMINAL_MESSAGES[0],
  ])
  const [easterEggToast, setEasterEggToast] = useState(false)

  const keyBufferRef = useRef('')
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const terminalIndexRef = useRef(1)

  const selected = ENDPOINTS.find((e) => e.id === selectedId) ?? ENDPOINTS[0]

  const handleLogin = (event: React.FormEvent): void => {
    event.preventDefault()
    if (password === LOGIN_PASSWORD) {
      setLoginError('')
      setView('dashboard')
      return
    }
    setLoginError('Access Denied. Zadzwoń do Sary o pomoc.')
  }

  const transitionToWarrant = useCallback((): void => {
    window.setTimeout(() => {
      setView('warrant')
    }, 2500)
  }, [])

  const sendRequest = useCallback((): void => {
    setLoading(true)
    setResponse(null)

    window.setTimeout(() => {
      if (selectedId === 'warrant-issue') {
        const result = handleWarrantIssue(requestBody)
        setResponse(result)
        setLoading(false)
        if (result.status === 200) {
          transitionToWarrant()
        }
        return
      }

      const result = getEndpointResponse(selectedId)
      setResponse(result)
      setLoading(false)
    }, 450)
  }, [requestBody, selectedId, transitionToWarrant])

  useEffect(() => {
    if (view !== 'dashboard') {
      return
    }

    const scheduleNext = (): number =>
      window.setTimeout(() => {
        const idx = terminalIndexRef.current % TERMINAL_MESSAGES.length
        terminalIndexRef.current += 1
        setTerminalLines((prev) => [...prev, TERMINAL_MESSAGES[idx]])
        timerId = scheduleNext()
      }, randomTerminalDelay())

    let timerId = scheduleNext()
    return () => window.clearTimeout(timerId)
  }, [view])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLines])

  useEffect(() => {
    if (view === 'warrant') {
      fireConfetti()
    }
  }, [view])

  useEffect(() => {
    setResponse(null)
    setResponseTab('body')
  }, [selectedId])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : ''
      if (!key) {
        return
      }
      keyBufferRef.current = (keyBufferRef.current + key).slice(
        -EASTER_EGG_SEQUENCE.length,
      )
      if (keyBufferRef.current === EASTER_EGG_SEQUENCE) {
        setEasterEggToast(true)
        keyBufferRef.current = ''
        window.setTimeout(() => setEasterEggToast(false), 4500)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (view === 'login') {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0a0e14] p-4 font-mono"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Lock className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
            <h1 className="text-lg font-bold tracking-wide text-cyan-300 sm:text-xl">
              KWP GDYNIA - WĘZEŁ ŚLEDCZY
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Secure Access Portal · Classified
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-lg border border-slate-700 bg-[#161b22] p-6 shadow-xl shadow-black/40"
          >
            <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 w-full rounded border border-slate-600 bg-[#0d1117] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              autoComplete="username"
            />
            <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded border border-slate-600 bg-[#0d1117] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              autoComplete="current-password"
            />
            {loginError ? (
              <p className="mb-4 rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded bg-cyan-600 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              Login
            </button>
          </form>

          <div
            className="mt-6 rotate-[-1.5deg] rounded-sm border border-amber-300/60 bg-amber-200 px-4 py-3 shadow-lg"
            style={{
              fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
              boxShadow: '4px 4px 12px rgba(0,0,0,0.35)',
            }}
          >
            <p className="text-sm leading-relaxed text-amber-950">
              <span className="font-bold">Podpowiedź z WSB:</span> System jest
              dziurawy. Dziurewicz zapomniał załatać logowania. Wpisz jako hasło:{' '}
              <code className="rounded bg-amber-300/50 px-1 font-mono text-xs">
                admin&apos; OR 1=1 --
              </code>{' '}
              aby wejść.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'warrant') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-200 p-4 font-serif sm:p-8">
        <div className="warrant-in w-full max-w-2xl border-4 border-slate-900 bg-white p-8 shadow-2xl sm:p-12">
          {warrantConfirmed ? (
            <div className="py-8 text-center">
              <Shield className="mx-auto mb-6 h-16 w-16 text-emerald-700" />
              <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Nakaz zapisany w bazie KWP!
              </h1>
              <p className="mt-6 text-lg text-slate-700 sm:text-xl">
                Zrób screena i wyślij mi na discordzie.
              </p>
              {location ? (
                <p className="mt-4 text-sm text-slate-500">
                  Lokalizacja:{' '}
                  <span className="font-semibold text-slate-800">{location}</span>
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="mb-6 border-b-2 border-slate-900 pb-4 text-center">
                <p className="text-xs font-bold tracking-[0.25em] text-slate-600">
                  POLICJA · DOKUMENT URZĘDOWY
                </p>
                <h1 className="mt-2 text-xl font-bold uppercase leading-tight text-slate-900 sm:text-2xl">
                  OFICJALNY NAKAZ PRZESŁUCHANIA
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  (Kryptonim: Międzyuczelniany Błąd IT)
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-800 sm:text-base">
                <p>
                  <span className="font-bold">Organ Wzywający:</span> Wydział
                  Śledczy (IT WSB GDYNIA)
                </p>
                <p>
                  <span className="font-bold">Podejrzany:</span> Maksymilian
                  Frankowski
                </p>
                <p>
                  <span className="font-bold">Zarzut:</span> Próba zaproszenia
                  Głównego Inspektora (Lulu Main) na randkę na mapie Wejherowo.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    Termin
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Termin: 19 maja (Wtorek) 19:00 - ZABLOKOWANE SYSTEMOWO"
                    className="w-full cursor-not-allowed rounded border-2 border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-600">
                    Lokalizacja
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Wpisz dokładną lokalizację w Wejherowie (np. Kawa, Spacer, Zrzut na B):"
                    className="w-full rounded border-2 border-slate-800 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWarrantConfirmed(true)}
                className="mt-8 w-full rounded border-2 border-slate-900 bg-slate-900 px-4 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 sm:text-base"
              >
                [ ZATWIERDŹ NAKAZ (WYMAGA PODPISU LULU MAIN) ]
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const statusColor =
    response && response.status >= 200 && response.status < 300
      ? 'text-emerald-400'
      : response
        ? 'text-rose-400'
        : 'text-slate-500'

  return (
    <div
      className="flex min-h-screen flex-col bg-[#0d1117] font-mono text-slate-200"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {easterEggToast ? (
        <div
          className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-2 rounded border border-cyan-500/50 bg-[#0a0f14] px-4 py-3 text-sm text-cyan-300 shadow-lg shadow-cyan-500/10"
        >
          <Terminal className="h-4 w-4 shrink-0" />
          [SYSTEM OVERRIDE] Protokół awaryjny aktywny.
        </div>
      ) : null}

      <header className="shrink-0 border-b border-slate-800 bg-[#161b22] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileSearch className="h-6 w-6 text-cyan-400" />
            <h1 className="text-sm font-bold text-cyan-300 sm:text-base">
              [KWP Gdynia API]
            </h1>
          </div>
          <p className="blink-error max-w-md text-right text-xs font-semibold text-rose-500">
            [ERROR] AI Output Status: GARBAGE MODE ACTIVE (Source: jak mi gówno
            daje jakieś)
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-800 bg-[#0a0e14] lg:w-64 lg:border-b-0 lg:border-r xl:w-72">
          <p className="border-b border-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            Endpoints
          </p>
          <nav className="max-h-48 overflow-y-auto p-2 lg:max-h-none">
            {ENDPOINTS.map((ep) => {
              const active = ep.id === selectedId
              const methodColor =
                ep.method === 'GET' ? 'text-cyan-400' : 'text-emerald-400'
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => setSelectedId(ep.id)}
                  className={`mb-1 w-full rounded px-3 py-2 text-left text-xs transition ${
                    active
                      ? 'bg-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`font-bold ${methodColor}`}>{ep.method}</span>
                  <p className="mt-0.5 truncate text-slate-400">{ep.path}</p>
                  <p className="text-slate-500">{ep.label}</p>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-5">
          <div className="mb-3 shrink-0 rounded-lg border border-slate-700 bg-[#161b22] p-3 sm:p-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-bold ${
                  selected.method === 'GET'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {selected.method}
              </span>
              <code className="text-xs text-slate-300 sm:text-sm">
                {selected.path}
              </code>
            </div>
            {selected.hint ? (
              <p className="text-xs text-amber-400/90">
                <AlertTriangle className="mr-1 inline h-3 w-3" />
                Hint: <code>{selected.hint}</code>
              </p>
            ) : null}
          </div>

          {selected.method === 'POST' ? (
            <div className="mb-3 shrink-0">
              <p className="mb-1.5 text-xs font-bold uppercase text-slate-500">
                Request Body (JSON)
              </p>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full rounded-lg border border-slate-700 bg-[#0a0e14] p-3 text-xs text-emerald-300 outline-none focus:border-cyan-500/50 sm:text-sm"
              />
            </div>
          ) : (
            <p className="mb-3 shrink-0 text-xs text-slate-500">
              Endpoint tylko do odczytu — wyślij żądanie GET.
            </p>
          )}

          <button
            type="button"
            onClick={sendRequest}
            disabled={loading}
            className="mb-3 flex w-fit shrink-0 items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send Request'}
          </button>

          <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-slate-700 bg-[#161b22]">
            <div className="flex shrink-0 border-b border-slate-700">
              <button
                type="button"
                onClick={() => setResponseTab('body')}
                className={`px-4 py-2 text-xs font-bold uppercase ${
                  responseTab === 'body'
                    ? 'border-b-2 border-cyan-400 text-cyan-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Body
              </button>
              <button
                type="button"
                onClick={() => setResponseTab('headers')}
                className={`px-4 py-2 text-xs font-bold uppercase ${
                  responseTab === 'headers'
                    ? 'border-b-2 border-cyan-400 text-cyan-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Headers
              </button>
              {response ? (
                <span
                  className={`ml-auto self-center px-4 text-xs font-bold ${statusColor}`}
                >
                  {response.status} {response.statusText}
                </span>
              ) : null}
            </div>
            <pre className="min-h-0 flex-1 overflow-auto p-3 text-xs leading-relaxed text-slate-300 sm:p-4 sm:text-sm">
              {response
                ? responseTab === 'body'
                  ? JSON.stringify(response.body, null, 2)
                  : JSON.stringify(response.headers, null, 2)
                : '// Oczekiwanie na żądanie...'}
            </pre>
          </div>
        </main>
      </div>

      <footer className="shrink-0 border-t border-slate-800 bg-black p-3">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600">
          <Terminal className="h-3.5 w-3.5" />
          Live Terminal Logs
        </p>
        <div className="h-[150px] overflow-y-auto rounded border border-emerald-900/50 bg-black p-2">
          {terminalLines.map((line, index) => (
            <p key={`${index}-${line}`} className="text-xs leading-5 text-emerald-400">
              {line}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </footer>
    </div>
  )
}
