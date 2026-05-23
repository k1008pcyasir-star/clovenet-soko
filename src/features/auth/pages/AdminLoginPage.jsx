import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import BrandLogo from "../../../components/brand/BrandLogo"
import { AdminApiService } from "../../../services/adminApiService"

const initialForm = {
  username: "",
  password: "",
}

function AdminLoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.username.trim()) {
      setError("Weka username ya admin.")
      return
    }

    if (!form.password) {
      setError("Weka neno la siri.")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")

      await AdminApiService.loginAdmin({
        username: form.username.trim(),
        password: form.password,
      })

      localStorage.setItem("clovenet_soko_admin_logged_in", "true")

      navigate("/admin/dashboard")
    } catch (loginError) {
      setError(loginError.message || "Imeshindikana kuingia admin.")
    } finally {
      setIsSubmitting(false)
    }
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
                  showSubtitle={false}
                  iconSize="lg"
                  textSize="lg"
                />
              </div>

              <h1 className="mt-7 text-2xl font-black leading-tight text-gray-950">
                Admin Login
              </h1>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={18}
                    strokeWidth={2.6}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm font-bold leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="text-xs font-black text-gray-700"
                >
                  Username
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                  <UserRound
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="username"
                    required
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Weka username"
                    autoComplete="username"
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

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
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
                    autoComplete="current-password"
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
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={17} strokeWidth={2.7} />
              {isSubmitting ? "Inaingia..." : "Ingia"}
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AdminLoginPage