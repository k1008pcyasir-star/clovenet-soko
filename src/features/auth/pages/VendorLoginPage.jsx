import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react"

import BrandLogo from "../../../components/brand/BrandLogo"
import { vendorApiService } from "../../../services/vendorApiService"

const initialForm = {
  whatsapp: "",
  password: "",
}

const initialResetForm = {
  whatsapp: "",
  otpCode: "",
  newPassword: "",
  confirmPassword: "",
}

function VendorLoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [resetForm, setResetForm] = useState(initialResetForm)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingVendor, setPendingVendor] = useState(null)

  const [mode, setMode] = useState("login")
  const [resetStep, setResetStep] = useState("request")

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetSubmitting, setIsResetSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setSuccess("")
    setPendingVendor(null)
  }

  function handleResetChange(event) {
    const { name, value } = event.target

    setResetForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  function switchToLogin() {
    setMode("login")
    setResetStep("request")
    setResetForm(initialResetForm)
    setError("")
    setSuccess("")
  }

  function switchToForgotPassword() {
    setMode("forgot")
    setResetStep("request")
    setResetForm((current) => ({
      ...current,
      whatsapp: form.whatsapp || current.whatsapp,
    }))
    setError("")
    setSuccess("")
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setSuccess("")
    setPendingVendor(null)
    setIsSubmitting(true)

    try {
      const response = await vendorApiService.loginVendor({
        whatsapp: form.whatsapp,
        password: form.password,
      })

      const vendor = response?.vendor || response?.data?.vendor
      const token = response?.token || response?.data?.token

      if (!vendor || !token) {
        setError("Login imefanikiwa lakini taarifa za akaunti hazijakamilika.")
        return
      }

      if (vendor.status !== "verified") {
        setPendingVendor(vendor)
        return
      }

      navigate("/vendor/dashboard")
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Namba ya simu au neno la siri si sahihi."

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRequestOtp(event) {
    event.preventDefault()

    if (!resetForm.whatsapp.trim()) {
      setError("Weka namba ya WhatsApp kwanza.")
      return
    }

    try {
      setIsResetSubmitting(true)
      setError("")
      setSuccess("")

      await vendorApiService.requestPasswordReset({
        whatsapp: resetForm.whatsapp,
      })

      setSuccess(
        "OTP imetengenezwa. Kama hujaipokea automatic, wasiliana na support au super admin."
      )
      setResetStep("reset")
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Imeshindikana kutengeneza OTP."

      setError(message)
    } finally {
      setIsResetSubmitting(false)
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault()

    if (!resetForm.otpCode.trim()) {
      setError("Weka OTP uliyopewa.")
      return
    }

    if (!resetForm.newPassword) {
      setError("Weka neno jipya la siri.")
      return
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError("Password mpya na uthibitisho wake hazifanani.")
      return
    }

    try {
      setIsResetSubmitting(true)
      setError("")
      setSuccess("")

      await vendorApiService.resetPassword({
        whatsapp: resetForm.whatsapp,
        otpCode: resetForm.otpCode,
        newPassword: resetForm.newPassword,
      })

      setSuccess("Neno la siri limebadilishwa. Sasa unaweza ku-login.")
      setForm({
        whatsapp: resetForm.whatsapp,
        password: "",
      })
      setResetForm(initialResetForm)
      setResetStep("request")
      setMode("login")
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Imeshindikana kubadilisha neno la siri."

      setError(message)
    } finally {
      setIsResetSubmitting(false)
    }
  }

  if (pendingVendor) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="flex justify-center">
              <BrandLogo
                title="CloveNet Soko"
                showSubtitle={false}
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
                {pendingVendor.storeName || pendingVendor.store_name || "vendor"}
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

          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-7">
            <div className="text-center">
              <div className="flex justify-center">
                <BrandLogo
                  title="CloveNet Soko"
                  showSubtitle={false}
                  iconSize="lg"
                  textSize="lg"
                />
              </div>

              <h1 className="mt-7 text-2xl font-black leading-tight text-gray-950">
                {mode === "login"
                  ? "Ingia kwenye duka lako"
                  : resetStep === "request"
                    ? "Rejesha neno la siri"
                    : "Weka OTP na password mpya"}
              </h1>

              {mode === "forgot" && (
                <p className="mx-auto mt-2 max-w-sm text-xs font-semibold leading-5 text-[var(--color-muted)]">
                  OTP itaonekana kwa super admin/support kama automatic delivery
                  haijafanya kazi.
                </p>
              )}
            </div>

            {(error || success) && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  error
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <p
                  className={`text-sm font-bold leading-5 ${
                    error ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {error || success}
                </p>
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleSubmit}>
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
                        onClick={switchToForgotPassword}
                        className="text-xs font-black text-[var(--color-green-dark)] hover:underline"
                      >
                        Umesahau neno la siri?
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2
                      size={17}
                      strokeWidth={2.7}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      Ingia Dukani
                      <ArrowRight size={16} strokeWidth={2.7} />
                    </>
                  )}
                </button>
              </form>
            ) : resetStep === "request" ? (
              <form onSubmit={handleRequestOtp}>
                <div className="mt-6">
                  <label
                    htmlFor="resetWhatsapp"
                    className="text-xs font-black text-gray-700"
                  >
                    Namba ya simu / WhatsApp
                  </label>

                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                    <MessageCircle
                      size={18}
                      strokeWidth={2.5}
                      className="shrink-0 text-[var(--color-green-dark)]"
                    />

                    <input
                      id="resetWhatsapp"
                      required
                      type="tel"
                      name="whatsapp"
                      value={resetForm.whatsapp}
                      onChange={handleResetChange}
                      placeholder="+255700000000"
                      className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isResetSubmitting ? (
                    <Loader2
                      size={17}
                      strokeWidth={2.7}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      Tengeneza OTP
                      <KeyRound size={16} strokeWidth={2.7} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={switchToLogin}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
                >
                  <ArrowLeft size={16} strokeWidth={2.7} />
                  Rudi Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="otpCode"
                      className="text-xs font-black text-gray-700"
                    >
                      OTP Code
                    </label>

                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                      <KeyRound
                        size={18}
                        strokeWidth={2.5}
                        className="shrink-0 text-[var(--color-green-dark)]"
                      />

                      <input
                        id="otpCode"
                        required
                        name="otpCode"
                        value={resetForm.otpCode}
                        onChange={handleResetChange}
                        placeholder="Weka OTP"
                        className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="text-xs font-black text-gray-700"
                    >
                      Password mpya
                    </label>

                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                      <Lock
                        size={18}
                        strokeWidth={2.5}
                        className="shrink-0 text-[var(--color-green-dark)]"
                      />

                      <input
                        id="newPassword"
                        required
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={resetForm.newPassword}
                        onChange={handleResetChange}
                        placeholder="Mfano: NewVendor@123"
                        className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword((current) => !current)}
                        className="shrink-0 text-gray-500 transition hover:text-[var(--color-navy)]"
                        aria-label={
                          showNewPassword
                            ? "Ficha password mpya"
                            : "Onyesha password mpya"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} strokeWidth={2.5} />
                        ) : (
                          <Eye size={18} strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-black text-gray-700"
                    >
                      Thibitisha password mpya
                    </label>

                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                      <Lock
                        size={18}
                        strokeWidth={2.5}
                        className="shrink-0 text-[var(--color-green-dark)]"
                      />

                      <input
                        id="confirmPassword"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={resetForm.confirmPassword}
                        onChange={handleResetChange}
                        placeholder="Rudia password mpya"
                        className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        className="shrink-0 text-gray-500 transition hover:text-[var(--color-navy)]"
                        aria-label={
                          showConfirmPassword
                            ? "Ficha uthibitisho wa password"
                            : "Onyesha uthibitisho wa password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} strokeWidth={2.5} />
                        ) : (
                          <Eye size={18} strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isResetSubmitting ? (
                    <Loader2
                      size={17}
                      strokeWidth={2.7}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      Badilisha Password
                      <ArrowRight size={16} strokeWidth={2.7} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResetStep("request")}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
                >
                  <ArrowLeft size={16} strokeWidth={2.7} />
                  Rudi Kuomba OTP
                </button>
              </form>
            )}

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
          </div>
        </div>
      </div>
    </section>
  )
}

export default VendorLoginPage