import { useNavigate } from "react-router-dom"
import { ArrowLeft, Construction } from "lucide-react"

function ComingSoonPage({ title = "Page inaandaliwa" }) {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
            <Construction size={34} strokeWidth={2.4} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-950">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-[var(--color-muted)]">
            Sehemu hii bado inaandaliwa. Itaongezwa hatua kwa hatua kadri
            project inavyoendelea.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
          >
            <ArrowLeft size={16} strokeWidth={2.7} />
            Rudi Mwanzo
          </button>
        </div>
      </div>
    </section>
  )
}

export default ComingSoonPage