import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Check,
  LockKeyhole,
  Plus,
  ShieldCheck,
  UserCog,
  UsersRound,
  XCircle,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"

const initialForm = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  role: "admin",
}

function AdminUsersPage() {
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const currentAdmin = useMemo(() => {
    return AdminApiService.getCurrentAdmin()
  }, [])

  const isSuperAdmin = currentAdmin?.role === "super_admin"

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins()
    } else {
      setIsLoading(false)
    }
  }, [isSuperAdmin])

  async function loadAdmins() {
    try {
      setIsLoading(true)
      setError("")

      const data = await AdminApiService.getAdmins()
      setAdmins(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupata admins.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  function validateForm() {
    if (!form.fullName.trim()) {
      setError("Weka jina la admin.")
      return false
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Weka email sahihi.")
      return false
    }

    if (!form.username.trim() || form.username.trim().length < 3) {
      setError("Username iwe na angalau herufi 3.")
      return false
    }

    if (!form.password) {
      setError("Weka password ya admin.")
      return false
    }

    return true
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) return

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      await AdminApiService.createAdmin({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      })

      setForm(initialForm)
      setSuccess("Admin mpya ameongezwa kikamilifu.")
      await loadAdmins()
    } catch (saveError) {
      setError(saveError?.message || "Imeshindikana kuongeza admin.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleStatus(admin) {
    if (admin.id === currentAdmin?.id) {
      setError("Huwezi kuzima akaunti yako mwenyewe.")
      return
    }

    const nextStatus = !admin.isActive

    const confirmText = nextStatus
      ? `Unataka kuwezesha admin ${admin.username}?`
      : `Unataka kuzima admin ${admin.username}?`

    if (!window.confirm(confirmText)) return

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      await AdminApiService.updateAdminStatus(admin.id, nextStatus)

      setSuccess(
        nextStatus
          ? "Admin amewezeshwa kikamilifu."
          : "Admin amezimwa kikamilifu."
      )

      await loadAdmins()
    } catch (statusError) {
      setError(statusError?.message || "Imeshindikana kubadilisha status.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isSuperAdmin) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-red-50 text-red-600">
              <LockKeyhole size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Super admin pekee
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Ukurasa huu ni kwa admin mkuu pekee. Assistant admin hawezi
              kusimamia admins wengine.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Super Admin
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Admin Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Ongeza assistant admins na dhibiti access zao kwenye CloveNet
              Soko.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <UsersRound size={18} strokeWidth={2.6} />
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--color-muted)]">
                  Admins
                </p>

                <p className="text-sm font-black text-gray-950">
                  {admins.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`mb-5 rounded-2xl border p-4 ${
              error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
            }`}
          >
            <div className="flex items-start gap-2">
              {error ? (
                <AlertCircle
                  size={18}
                  strokeWidth={2.6}
                  className="mt-0.5 shrink-0 text-red-600"
                />
              ) : (
                <Check
                  size={18}
                  strokeWidth={3}
                  className="mt-0.5 shrink-0 text-green-700"
                />
              )}

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

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Plus size={21} strokeWidth={2.8} />
              </div>

              <div>
                <h2 className="text-lg font-black text-gray-950">
                  Ongeza Admin
                </h2>

                <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                  Super admin anaweza kuongeza wasaidizi wa kusimamia vendors na
                  products.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-black text-gray-700">
                  Jina kamili
                </label>

                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Mfano: Assistant Admin"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Email
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="assistant@clovenetsoko.local"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Username
                </label>

                <input
                  required
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="assistant"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Password
                </label>

                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Mfano: Assistant@123"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="admin">Assistant Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserCog size={16} strokeWidth={2.7} />
              {isSaving ? "Inaongeza..." : "Ongeza Admin"}
            </button>
          </form>

          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6">
            <div>
              <h2 className="text-lg font-black text-gray-950">
                Admin List
              </h2>

              <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
                Admins waliopo kwenye mfumo.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-5 rounded-2xl bg-[var(--color-bg)] p-5 text-sm font-bold text-[var(--color-muted)]">
                Inapakia admins...
              </div>
            ) : admins.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-[var(--color-bg)] p-6 text-center">
                <UsersRound
                  size={34}
                  strokeWidth={2.5}
                  className="mx-auto text-[var(--color-muted)]"
                />

                <p className="mt-3 text-sm font-black text-gray-950">
                  Hakuna admins waliopatikana.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {admins.map((admin) => (
                  <article
                    key={admin.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                          <ShieldCheck size={22} strokeWidth={2.6} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-black text-gray-950">
                              {admin.fullName}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                                admin.role === "super_admin"
                                  ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {admin.role === "super_admin"
                                ? "Super Admin"
                                : "Admin"}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                                admin.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {admin.isActive ? "Active" : "Disabled"}
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                            @{admin.username} · {admin.email}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(admin)}
                        disabled={isSaving || admin.id === currentAdmin?.id}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          admin.isActive
                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {admin.isActive ? (
                          <>
                            <XCircle size={14} strokeWidth={2.7} />
                            Disable
                          </>
                        ) : (
                          <>
                            <Check size={14} strokeWidth={3} />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminUsersPage