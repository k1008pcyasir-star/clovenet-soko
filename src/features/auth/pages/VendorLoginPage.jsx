import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react"

import BrandLogo from "../../../components/brand/BrandLogo"
import { StorageService } from "../../../services/storageService"
import { normalizePhone } from "../../../utils/formatters"

const initialForm = {
  whatsapp: "",
  password: "",
}

function VendorLoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [pendingVendor, setPendingVendor] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setPendingVendor(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const phone = normalizePhone(form.whatsapp)
    const vendors = StorageService.getVendors()

    const vendor = vendors.find((item) => {
      return normalizePhone(item.whatsapp || "") === phone
    })

    if (!vendor || vendor.password !== form.password) {
      setError("Namba ya simu au neno la siri si sahihi.")
      return
    }

    if (vendor.status !== "verified" && !vendor.isVerified) {
      setPendingVendor(vendor)
      return
    }

    StorageService.setCurrentVendorId(vendor.id)
    navigate("/vendor/dashboard")
  }

  if (pendingVendor) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="flex justify-center">
              <BrandLogo
                title="CloveNet Soko"
                subtitle="Vendor Login"
                showSubtitle
                iconSize="lg"
                textSize="lg"
              />
            </div>

            <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Duka linasubiri verification
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Duka la{" "}
              <strong className="text-gray-950">
                {pendingVendor.storeName}
              </strong>{" "}
              limepokelewa kwenye CloveNet Soko. Akaunti hii itaweza kuingia
              baada ya verification kukamilika.
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-[var(--color-bg)] p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  <ShieldCheck size={18} strokeWidth={2.6} />
                </div>

                <div>
                  <p className="text-sm font-black text-gray-950">
                    Status: Pending Verification
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Tafadhali subiri approval kabla ya kuingia kwenye dashboard.
                    Kama unaona imechelewa, unaweza kuwasiliana na support.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setPendingVendor(null)
                  setForm(initialForm)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Jaribu Akaunti Nyingine
                <ArrowRight size={16} strokeWidth={2.7} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/support")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-black text-gray-700 transition hover:bg-[var(--color-bg)]"
              >
                <HelpCircle size={16} strokeWidth={2.7} />
                Wasiliana Support
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
              >
                <ArrowLeft size={16} strokeWidth={2.7} />
                Rudi Mwanzo
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center">
        <div className="w-full">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
          >
            <ArrowLeft size={15} strokeWidth={2.7} />
            Rudi Mwanzo
          </button>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-7"
          >
            <div className="text-center">
              <div className="flex justify-center">
                <BrandLogo
                  title="CloveNet Soko"
                  subtitle="Vendor Login"
                  showSubtitle
                  iconSize="lg"
                  textSize="lg"
                />
              </div>

              <h1 className="mt-7 text-2xl font-black leading-tight text-gray-950">
                Ingia kwenye duka lako
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Tumia namba ya WhatsApp na neno la siri ulilotumia wakati wa
                kusajili duka.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--color-green-soft)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-green-dark)]">
                  <ShieldCheck size={18} strokeWidth={2.6} />
                </div>

                <div>
                  <p className="text-sm font-black text-[var(--color-green-dark)]">
                    Vendor dashboard
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-green-dark)]">
                    Akaunti iliyohakikiwa itaingia moja kwa moja kwenye dashboard
                    ya kusimamia bidhaa na taarifa za duka.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-bold leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="whatsapp"
                  className="text-xs font-black text-gray-700"
                >
                  Namba ya simu / WhatsApp
                </label>

                <div
                  className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[var(--color-bg)] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 ${
                    error
                      ? "border-red-300"
                      : "border-[var(--color-border)] focus-within:border-[var(--color-green)]"
                  }`}
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="whatsapp"
                    required
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+255700000000"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-black text-gray-700"
                >
                  Neno la siri
                </label>

                <div
                  className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[var(--color-bg)] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 ${
                    error
                      ? "border-red-300"
                      : "border-[var(--color-border)] focus-within:border-[var(--color-green)]"
                  }`}
                >
                  <Lock
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Weka neno la siri"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="shrink-0 text-gray-500 transition hover:text-[var(--color-navy)]"
                    aria-label={
                      showPassword
                        ? "Ficha neno la siri"
                        : "Onyesha neno la siri"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2.5} />
                    ) : (
                      <Eye size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Forgot password bado haijawezeshwa. Tafadhali wasiliana na support ya CloveNet Soko."
                      )
                    }
                    className="text-xs font-black text-[var(--color-green-dark)] hover:underline"
                  >
                    Umesahau neno la siri?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Ingia Dukani
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg)] p-4">
              <p className="text-xs font-semibold text-[var(--color-muted)]">
                Bado huna duka?
              </p>

              <button
                type="button"
                onClick={() => navigate("/vendor/register")}
                className="shrink-0 text-sm font-black text-[var(--color-green-dark)] hover:underline"
              >
                Fungua duka
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] font-semibold leading-5 text-[var(--color-muted)]">
              Unahitaji msaada?{" "}
              <Link
                to="/support"
                className="font-black text-[var(--color-green-dark)] hover:underline"
              >
                Wasiliana na Support
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default VendorLoginPage