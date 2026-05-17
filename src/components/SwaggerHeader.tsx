import { Lock } from 'lucide-react'

interface SwaggerHeaderProps {
  isAuthorized: boolean
  onAuthorizeClick: () => void
}

export function SwaggerHeader({
  isAuthorized,
  onAuthorizeClick,
}: SwaggerHeaderProps): React.ReactElement {
  return (
  <header>
    <div className="bg-[#1b1b1b] px-4 py-3">
      <div className="mx-auto flex max-w-[1460px] flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#89bf04]">
            <span className="text-lg font-bold text-white">{'{ }'}</span>
          </div>
          <span className="text-lg font-semibold text-white">Swagger</span>
        </div>
        <form className="flex flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            readOnly
            value="/swagger/v1/swagger.json"
            className="w-full rounded-l border-0 bg-[#2b2b2b] px-3 py-1.5 text-sm text-[#b0b0b0] outline-none"
          />
          <button
            type="button"
            className="rounded-r bg-[#62a03f] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#558f36]"
          >
            Explore
          </button>
        </form>
      </div>
    </div>
    <div className="border-b border-[#d8dde7] bg-white">
      <div className="mx-auto flex max-w-[1460px] flex-wrap items-start justify-between gap-4 px-6 py-6">
        <div>
          <h1 className="text-3xl font-normal text-[#3b4151]">
            Maksymilian API - Matchmaking Service
          </h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            <span className="rounded border border-[#49cc90] bg-[#49cc90]/10 px-2 py-0.5 text-xs font-bold text-[#49cc90]">
              v1.0
            </span>
            <span className="ml-2">[ Base URL: /api/v1 ]</span>
          </p>
          <p className="mt-2 max-w-2xl text-sm text-[#6b6b6b]">
            Osobisty serwis matchmakingowy. Wymagana autoryzacja Bearer dla
            chronionych zasobów.
          </p>
        </div>
        <button
          type="button"
          onClick={onAuthorizeClick}
          className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-bold ${
            isAuthorized
              ? 'border border-[#49cc90] bg-[#49cc90]/10 text-[#49cc90]'
              : 'border border-[#fca130] bg-transparent text-[#fca130] hover:bg-[#fca130]/5'
          }`}
        >
          <Lock className="h-4 w-4" />
          {isAuthorized ? 'Authorized' : 'Authorize'}
        </button>
      </div>
    </div>
  </header>
  )
}
