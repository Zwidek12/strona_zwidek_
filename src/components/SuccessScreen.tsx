import { CheckCircle2, MessageCircle } from 'lucide-react'

export function SuccessScreen(): React.ReactElement {
  return (
    <div className="success-fade-in fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6">
      <div className="max-w-lg w-full rounded-2xl border border-emerald-500/30 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" strokeWidth={1.5} />
        </div>
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Zasoby zaalokowane poprawnie!
        </h1>
        <p className="mb-2 text-lg text-emerald-100/90">
          Nawiązano połączenie z serwerem.
        </p>
        <p className="flex items-center justify-center gap-2 text-base text-slate-300">
          <MessageCircle className="h-5 w-5 shrink-0 text-emerald-400" />
          Napisz mi na discordzie, o której Ci pasuje!
        </p>
        <div className="mt-8 inline-block rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-mono text-emerald-300">
          HTTP 201 Created · Connection Established
        </div>
      </div>
    </div>
  )
}
