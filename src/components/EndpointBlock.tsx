import { ChevronDown, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'
import { ACTIVITY_TYPES } from '../constants'
import type { ActivityType, ApiResponse, HttpMethod } from '../types'

interface EndpointBlockProps {
  id: string
  method: HttpMethod
  path: string
  summary: string
  description?: string
  requiresAuth: boolean
  isAuthorized: boolean
  defaultBody?: string
  showDuoForm?: boolean
  onExecute: (body?: string, duoForm?: DuoFormState) => ApiResponse
}

export interface DuoFormState {
  activityType: ActivityType
  preferredDay: string
  isPlayerTwoReady: boolean
}

const METHOD_COLORS: Record<HttpMethod, { badge: string; border: string; bg: string }> = {
  GET: {
    badge: 'bg-[#61affe]',
    border: 'border-[#61affe]',
    bg: 'bg-[#61affe]/5',
  },
  POST: {
    badge: 'bg-[#49cc90]',
    border: 'border-[#49cc90]',
    bg: 'bg-[#49cc90]/5',
  },
}

export function EndpointBlock({
  id: endpointId,
  method,
  path,
  summary,
  description,
  requiresAuth,
  isAuthorized,
  defaultBody = '{\n  "role": ""\n}',
  showDuoForm = false,
  onExecute,
}: EndpointBlockProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false)
  const [tryItOut, setTryItOut] = useState(false)
  const [requestBody, setRequestBody] = useState(defaultBody)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [duoForm, setDuoForm] = useState<DuoFormState>({
    activityType: 'Kawa',
    preferredDay: '',
    isPlayerTwoReady: true,
  })

  const colors = METHOD_COLORS[method]
  const locked = requiresAuth && !isAuthorized

  const handleExecute = (): void => {
    if (locked) {
      setResponse({
        status: 401,
        statusText: 'Unauthorized',
        body: {
          error: 'Unauthorized',
          message: 'Bearer token required.',
        },
      })
      return
    }

    const result = showDuoForm
      ? onExecute(undefined, duoForm)
      : onExecute(requestBody)
    if (result) {
      setResponse(result)
    }
  }

  const handleTryItOut = (): void => {
    if (!tryItOut) {
      setTryItOut(true)
      setResponse(null)
    } else {
      setTryItOut(false)
      setResponse(null)
    }
  }

  return (
    <div
      id={endpointId}
      className={`mb-3 overflow-hidden rounded border ${colors.border} ${expanded ? colors.bg : 'bg-white'}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${expanded ? colors.bg : 'bg-[#fafafa] hover:bg-[#f0f0f0]'}`}
      >
        <span
          className={`min-w-[70px] rounded px-2 py-1 text-center text-sm font-bold uppercase text-white ${colors.badge}`}
        >
          {method}
        </span>
        <span className="flex-1 font-mono text-base font-semibold text-[#3b4151]">
          {path}
        </span>
        <span className="hidden flex-1 text-sm text-[#6b6b6b] sm:inline">
          {summary}
        </span>
        {requiresAuth ? (
          locked ? (
            <Lock className="h-4 w-4 shrink-0 text-[#fca130]" aria-label="Zablokowany" />
          ) : (
            <Unlock className="h-4 w-4 shrink-0 text-[#49cc90]" aria-label="Odblokowany" />
          )
        ) : null}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#6b6b6b] transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded ? (
        <div className="border-t border-[#d8dde7]/60 bg-white px-4 py-4">
          {description ? (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#3b4151]">Description</p>
              <p className="mt-1 text-sm text-[#6b6b6b]">{description}</p>
            </div>
          ) : null}

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={handleTryItOut}
              className={`rounded border px-4 py-1.5 text-sm font-bold ${
                tryItOut
                  ? 'border-[#d8dde7] bg-[#f7f7f7] text-[#6b6b6b]'
                  : 'border-[#4990e2] bg-[#4990e2] text-white hover:bg-[#3d7bc8]'
              }`}
            >
              {tryItOut ? 'Cancel' : 'Try it out'}
            </button>
          </div>

          {tryItOut ? (
            <>
              {showDuoForm ? (
                <DuoRequestForm duoForm={duoForm} onChange={setDuoForm} />
              ) : method === 'POST' ? (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-[#3b4151]">
                    Request body
                  </p>
                  <p className="mb-1 text-xs text-[#6b6b6b]">
                    application/json
                  </p>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={6}
                    spellCheck={false}
                    className="w-full rounded border border-[#d8dde7] bg-[#41444e] p-3 font-mono text-sm text-[#a9b7c6] outline-none focus:border-[#89bf04]"
                  />
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleExecute}
                className="mb-4 rounded bg-[#4990e2] px-6 py-2 text-sm font-bold text-white hover:bg-[#3d7bc8]"
              >
                Execute
              </button>

              {response ? <ResponsePanel response={response} /> : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function DuoRequestForm({
  duoForm,
  onChange,
}: {
  duoForm: DuoFormState
  onChange: (state: DuoFormState) => void
}): React.ReactElement {
  return (
    <div className="mb-4 rounded border border-[#d8dde7] bg-[#fafafa] p-4">
      <p className="mb-3 text-sm font-semibold text-[#3b4151]">Request body</p>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#3b4151]">
            activityType <span className="font-normal text-[#6b6b6b]">enum</span>
          </label>
          <select
            value={duoForm.activityType}
            onChange={(e) =>
              onChange({
                ...duoForm,
                activityType: e.target.value as ActivityType,
              })
            }
            className="w-full rounded border border-[#d8dde7] bg-white px-3 py-2 text-sm text-[#3b4151]"
          >
            {ACTIVITY_TYPES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#3b4151]">
            preferredDay <span className="font-normal text-[#6b6b6b]">string (DD-MM-YYYY)</span>
          </label>
          <input
            type="text"
            value={duoForm.preferredDay}
            onChange={(e) =>
              onChange({ ...duoForm, preferredDay: e.target.value })
            }
            placeholder="17-05-2026"
            className="w-full rounded border border-[#d8dde7] bg-white px-3 py-2 font-mono text-sm text-[#3b4151]"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="player-two-ready"
            type="checkbox"
            checked={duoForm.isPlayerTwoReady}
            onChange={(e) =>
              onChange({ ...duoForm, isPlayerTwoReady: e.target.checked })
            }
            className="h-4 w-4 accent-[#49cc90]"
          />
          <label
            htmlFor="player-two-ready"
            className="text-xs font-semibold text-[#3b4151]"
          >
            isPlayerTwoReady
          </label>
        </div>
      </div>
    </div>
  )
}

function ResponsePanel({ response }: { response: ApiResponse }): React.ReactElement {
  const statusColor =
    response.status >= 200 && response.status < 300
      ? 'text-[#49cc90]'
      : response.status >= 400
        ? 'text-[#f93e3e]'
        : 'text-[#fca130]'

  return (
    <div className="rounded border border-[#d8dde7]">
      <div className="border-b border-[#d8dde7] bg-[#f7f7f7] px-4 py-2">
        <p className="text-sm font-semibold text-[#3b4151]">Responses</p>
      </div>
      <div className="p-4">
        <p className="mb-2 text-sm">
          <span className="font-semibold text-[#3b4151]">Code: </span>
          <span className={`font-bold ${statusColor}`}>
            {response.status}
          </span>
          <span className="ml-2 text-[#6b6b6b]">{response.statusText}</span>
        </p>
        <p className="mb-1 text-xs font-semibold text-[#6b6b6b]">
          Response body
        </p>
        <pre className="swagger-scrollbar max-h-64 overflow-auto rounded bg-[#41444e] p-3 font-mono text-sm text-[#a9b7c6]">
          {JSON.stringify(response.body, null, 2)}
        </pre>
      </div>
    </div>
  )
}
