import { Lock, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AuthorizeModalProps {
  isOpen: boolean
  currentToken: string
  onClose: () => void
  onAuthorize: (token: string) => void
  onLogout: () => void
}

export function AuthorizeModal({
  isOpen,
  currentToken,
  onClose,
  onAuthorize,
  onLogout,
}: AuthorizeModalProps): React.ReactElement | null {
  const [tokenInput, setTokenInput] = useState(currentToken)

  useEffect(() => {
    if (isOpen) {
      setTokenInput(currentToken)
    }
  }, [isOpen, currentToken])

  if (!isOpen) {
    return null
  }

  const handleAuthorize = (): void => {
    onAuthorize(tokenInput.trim())
    onClose()
  }

  const handleLogout = (): void => {
    onLogout()
    setTokenInput('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="authorize-title"
    >
      <div className="w-full max-w-md rounded border border-[#d8dde7] bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-[#d8dde7] bg-[#f7f7f7] px-4 py-3">
          <h2
            id="authorize-title"
            className="flex items-center gap-2 text-base font-semibold text-[#3b4151]"
          >
            <Lock className="h-4 w-4" />
            Available authorizations
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#6b6b6b] hover:bg-[#e8e8e8]"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-1 text-sm font-semibold text-[#3b4151]">
            Bearer (apiKey)
          </p>
          <p className="mb-3 text-xs text-[#6b6b6b]">
            Wklej token JWT uzyskany z endpointu Login.
          </p>
          <label className="mb-1 block text-xs font-semibold text-[#3b4151]">
            Value:
          </label>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            className="mb-4 w-full rounded border border-[#d8dde7] px-3 py-2 font-mono text-sm text-[#3b4151] outline-none focus:border-[#89bf04] focus:ring-1 focus:ring-[#89bf04]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAuthorize}
              className="rounded bg-[#4990e2] px-4 py-2 text-sm font-bold text-white hover:bg-[#3d7bc8]"
            >
              Authorize
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-[#d8dde7] bg-white px-4 py-2 text-sm font-semibold text-[#3b4151] hover:bg-[#f7f7f7]"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded border border-[#d8dde7] bg-white px-4 py-2 text-sm text-[#6b6b6b] hover:bg-[#f7f7f7]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
