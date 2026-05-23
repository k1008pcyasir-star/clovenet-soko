import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Clock,
  Copy,
  KeyRound,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  Store,
  X,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"

function formatDateTime(value) {
  if (!value) return "Haijawekwa"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Haijawekwa"
  }

  return new Intl.DateTimeFormat("sw-TZ", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function getTimeRemaining(expiresAt) {
  const expiryTime = new Date(expiresAt).getTime()
  const now = Date.now()
  const remainingMs = expiryTime - now

  if (remainingMs <= 0) return "Expired"

  const totalMinutes = Math.ceil(remainingMs / 60000)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

function normalizeWhatsAppPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "")

  if (!digits) return ""

  if (digits.startsWith("255")) return digits
  if (digits.startsWith("0")) return `255${digits.slice(1)}`
  if (digits.length === 9) return `255${digits}`

  return digits
}

function AdminOtpsPage() {
  const [otps, setOtps] = useState([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const currentAdmin = useMemo(() => {
    return AdminApiService.getCurrentAdmin()
  }, [])

  const isSuperAdmin = currentAdmin?.role === "super_admin"

  useEffect(() => {
    if (isSuperAdmin) {
      loadOtps()
    } else {
      setIsLoading(false)
    }
  }, [isSuperAdmin])

  async function loadOtps() {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const data = await AdminApiService.getActiveOtps()
      setOtps(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupata OTP active.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOtps = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return otps.filter((otp) => {
      return (
        !searchText ||
        otp.phone?.toLowerCase().includes(searchText) ||
        otp.otpCode?.toLowerCase().includes(searchText) ||
        otp.vendor?.storeName?.toLowerCase().includes(searchText) ||
        otp.vendor?.ownerName?.toLowerCase().includes(searchText) ||
        otp.vendor?.whatsapp?.toLowerCase().includes(searchText)
      )
    })
  }, [otps, query])

  async function copyOtp(otpCode) {
    try {
      await navigator.clipboard.writeText(otpCode)
      setSuccess("OTP ime-copyiwa.")
      setError("")
    } catch {
      setError("Imeshindikana ku-copy OTP.")
      setSuccess("")
    }
  }

  function buildWhatsAppUrl(otp) {
    const phoneDigits = normalizeWhatsAppPhone(otp.phone)
    const message = `Habari ${
      otp.vendor?.ownerName || "Vendor"
    }, OTP yako ya kubadilisha neno la siri la CloveNet Soko ni ${
      otp.otpCode
    }. OTP hii ita-expire ndani ya muda mfupi. Usimpe mtu mwingine OTP hii isipokuwa umeomba kubadilisha neno la siri.`

    if (!phoneDigits) return ""

    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
  }

  function openWhatsApp(otp) {
    const url = buildWhatsAppUrl(otp)

    if (!url) {
      setError("Namba ya WhatsApp haipo sahihi.")
      setSuccess("")
      return
    }

    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (!isSuperAdmin) {
    return (
      <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-red-50 text-red-600">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Super admin pekee
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
              OTP za password reset zinaonekana kwa admin mkuu pekee.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-3 py-4 pb-28 text-[var(--color-text)] md:px-6 md:py-8 md:pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Super Admin
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950 md:text-3xl">
              Active OTPs
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia OTP za vendors zilizo active tu. OTP zilizotumika au
              zilizo-expire hazitaonekana hapa.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOtps}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={15} strokeWidth={2.7} className="animate-spin" />
            ) : (
              <Clock size={15} strokeWidth={2.7} />
            )}
            Refresh
          </button>
        </div>

        {(error || success) && (
          <div
            className={`mb-5 rounded-2xl border p-4 ${
              error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={18}
                strokeWidth={2.6}
                className={`mt-0.5 shrink-0 ${
                  error ? "text-red-600" : "text-green-700"
                }`}
              />

              <p
                className={`text-sm font-bold leading-5 ${
                  error ? "text-red-700" : "text-green-700"
                }`}
              >
                {error || success}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <KeyRound size={21} strokeWidth={2.6} />
            </div>

            <p className="text-2xl font-black text-gray-950">{otps.length}</p>

            <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
              OTP active
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm md:col-span-2">
            <div className="flex h-full items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
              <Search
                size={17}
                strokeWidth={2.5}
                className="shrink-0 text-gray-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tafuta kwa namba, OTP, jina la duka au mmiliki..."
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 transition hover:text-gray-900"
                  aria-label="Futa search"
                >
                  <X size={14} strokeWidth={2.7} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-white shadow-sm md:rounded-[2rem]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <KeyRound size={19} strokeWidth={2.6} />
              </div>

              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Password Reset OTPs
                </h2>

                <p className="mt-0.5 text-xs font-semibold text-[var(--color-muted)]">
                  Inaonyesha OTP {filteredOtps.length} kati ya {otps.length}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia OTP active...
            </div>
          ) : filteredOtps.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <KeyRound size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                Hakuna OTP active
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                OTP zilizotumika au zilizo-expire hazionekani hapa.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredOtps.map((otp) => (
                <article key={otp.id} className="p-4 md:p-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                          <Store size={20} strokeWidth={2.6} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-gray-950">
                            {otp.vendor?.storeName || "Duka halijapatikana"}
                          </h3>

                          <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                            {otp.vendor?.ownerName || "Owner haijawekwa"} ·{" "}
                            {otp.phone}
                          </p>
                        </div>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-700">
                          Expires in {getTimeRemaining(otp.expiresAt)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                            OTP Code
                          </p>

                          <p className="mt-2 font-mono text-2xl font-black tracking-[0.25em] text-gray-950">
                            {otp.otpCode}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                            Created
                          </p>

                          <p className="mt-2 text-sm font-black text-gray-950">
                            {formatDateTime(otp.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                            Expires
                          </p>

                          <p className="mt-2 text-sm font-black text-gray-950">
                            {formatDateTime(otp.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-72">
                      <button
                        type="button"
                        onClick={() => copyOtp(otp.otpCode)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-white"
                      >
                        <Copy size={14} strokeWidth={2.7} />
                        Copy OTP
                      </button>

                      <button
                        type="button"
                        onClick={() => openWhatsApp(otp)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                      >
                        <MessageCircle size={14} strokeWidth={2.7} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminOtpsPage