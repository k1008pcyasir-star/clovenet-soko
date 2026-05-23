import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Home,
  SearchX,
  ShoppingBag,
} from "lucide-react"

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
            <SearchX size={38} strokeWidth={2.4} />
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-[var(--color-green-dark)]">
            404
          </p>

          <h1 className="mt-2 text-3xl font-black leading-tight text-gray-950 md:text-5xl">
            Ukurasa haujapatikana
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
            Ukurasa unaoutafuta haupo, umehamishwa, au link uliyofungua si sahihi.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)]"
            >
              <Home size={17} strokeWidth={2.7} />
              Rudi Mwanzo
            </button>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              <ShoppingBag size={17} strokeWidth={2.7} />
              Nenda Sokoni
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={16} strokeWidth={2.7} />
            Rudi Nyuma
          </button>
        </div>
      </main>
    </section>
  )
}

export default NotFoundPage