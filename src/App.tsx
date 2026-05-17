import confetti from 'canvas-confetti'
import { useCallback, useState } from 'react'
import { AuthorizeModal } from './components/AuthorizeModal'
import {
  EndpointBlock,
  type DuoFormState,
} from './components/EndpointBlock'
import { SuccessScreen } from './components/SuccessScreen'
import { SwaggerHeader } from './components/SwaggerHeader'
import {
  handleDuoInitialize,
  handleFactorioStatus,
  handleHobbies,
  handleLogin,
  parseJsonBody,
  unauthorizedResponse,
} from './lib/apiHandlers'
import type { ApiResponse, DuoRequestBody, LoginRequestBody } from './types'

function fireConfetti(): void {
  const duration = 3000
  const end = Date.now() + duration

  const frame = (): void => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#49cc90', '#61affe', '#89bf04', '#fca130'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#49cc90', '#61affe', '#89bf04', '#fca130'],
    })
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#49cc90', '#61affe', '#89bf04'],
  })
}

export default function App(): React.ReactElement {
  const [authToken, setAuthToken] = useState('')
  const [issuedToken, setIssuedToken] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const isAuthorized =
    authToken.length > 0 && authToken === issuedToken && issuedToken.length > 0

  const handleAuthorize = useCallback((token: string): void => {
    if (token === issuedToken && issuedToken.length > 0) {
      setAuthToken(token)
    } else {
      setAuthToken('')
    }
  }, [issuedToken])

  const handleLogout = useCallback((): void => {
    setAuthToken('')
  }, [])

  const triggerSuccess = useCallback((): void => {
    fireConfetti()
    setFadeOut(true)
    window.setTimeout(() => setShowSuccess(true), 700)
  }, [])

  const executeLogin = useCallback(
    (body?: string): ApiResponse => {
      const parsed = body ? parseJsonBody<LoginRequestBody>(body) : null
      if (!parsed || typeof parsed.role !== 'string') {
        return {
          status: 400,
          statusText: 'Bad Request',
          body: { error: 'Invalid JSON', message: 'Expected { "role": "string" }' },
        }
      }
      const response = handleLogin(parsed)
      if (response.status === 200 && typeof response.body.token === 'string') {
        setIssuedToken(response.body.token)
      }
      return response
    },
    [],
  )

  const executeProtectedGet = useCallback(
    (handler: () => ApiResponse) =>
      (): ApiResponse => {
        if (!isAuthorized) {
          return unauthorizedResponse()
        }
        return handler()
      },
    [isAuthorized],
  )

  const executeDuo = useCallback(
    (_body?: string, duoForm?: DuoFormState): ApiResponse => {
      if (!isAuthorized) {
        return unauthorizedResponse()
      }
      if (!duoForm) {
        return {
          status: 400,
          statusText: 'Bad Request',
          body: { error: 'Missing request body' },
        }
      }
      const payload: DuoRequestBody = {
        activityType: duoForm.activityType,
        preferredDay: duoForm.preferredDay,
        isPlayerTwoReady: duoForm.isPlayerTwoReady,
      }
      const response = handleDuoInitialize(payload)
      if (response.status === 201) {
        triggerSuccess()
      }
      return response
    },
    [isAuthorized, triggerSuccess],
  )

  if (showSuccess) {
    return <SuccessScreen />
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className={fadeOut ? 'swagger-fade-out' : ''}>
        <SwaggerHeader
          isAuthorized={isAuthorized}
          onAuthorizeClick={() => setModalOpen(true)}
        />

        <main className="mx-auto max-w-[1460px] px-4 py-6 sm:px-6">
          <section className="mb-6">
            <h2 className="mb-4 border-b border-[#d8dde7] pb-2 text-xl font-normal text-[#3b4151]">
              Auth
            </h2>
            <EndpointBlock
              id="login"
              method="POST"
              path="/api/v1/Auth/Login"
              summary="Authenticate and obtain JWT"
              description="System locked. Elevation required. Podpowiedź: w infrastrukturze najważniejsza rola to..."
              requiresAuth={false}
              isAuthorized={isAuthorized}
              defaultBody={`{\n  "role": ""\n}`}
              onExecute={(body) => executeLogin(body)}
            />
          </section>

          <section className="mb-6">
            <h2 className="mb-4 border-b border-[#d8dde7] pb-2 text-xl font-normal text-[#3b4151]">
              Factorio
            </h2>
            <EndpointBlock
              id="factorio"
              method="GET"
              path="/api/v1/Factorio/Logistics/Status"
              summary="Get logistics pipeline status"
              requiresAuth
              isAuthorized={isAuthorized}
              onExecute={() => executeProtectedGet(handleFactorioStatus)()}
            />
          </section>

          <section className="mb-6">
            <h2 className="mb-4 border-b border-[#d8dde7] pb-2 text-xl font-normal text-[#3b4151]">
              Lifestyle
            </h2>
            <EndpointBlock
              id="hobbies"
              method="GET"
              path="/api/v1/Lifestyle/Hobbies"
              summary="Retrieve hobbies and match potential"
              requiresAuth
              isAuthorized={isAuthorized}
              onExecute={() => executeProtectedGet(handleHobbies)()}
            />
          </section>

          <section className="mb-6">
            <h2 className="mb-4 border-b border-[#d8dde7] pb-2 text-xl font-normal text-[#3b4151]">
              Duo
            </h2>
            <EndpointBlock
              id="duo"
              method="POST"
              path="/api/v1/Duo/Initialize"
              summary="Initialize real-world P2P connection"
              description="Rozpoczyna proces nawiązywania połączenia P2P w świecie rzeczywistym."
              requiresAuth
              isAuthorized={isAuthorized}
              showDuoForm
              onExecute={executeDuo}
            />
          </section>
        </main>
      </div>

      <AuthorizeModal
        isOpen={modalOpen}
        currentToken={authToken || issuedToken}
        onClose={() => setModalOpen(false)}
        onAuthorize={handleAuthorize}
        onLogout={handleLogout}
      />
    </div>
  )
}
