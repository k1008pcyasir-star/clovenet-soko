import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Store,
  Trash2,
  UserCog,
  X,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"
import { formatDate } from "../../../utils/formatters"

function getActionLabel(action) {
  const labels = {
    ADMIN_LOGIN: "Admin Login",
    VERIFY_VENDOR: "Vendor Verified",
    SUSPEND_VENDOR: "Vendor Suspended",
    RETURN_VENDOR_PENDING: "Vendor Pending",
    DELETE_PRODUCT: "Product Deleted",
    CREATE_ADMIN: "Admin Created",
    ENABLE_ADMIN: "Admin Enabled",
    DISABLE_ADMIN: "Admin Disabled",
  }

  return labels[action] || action
}

function getActionIcon(action) {
  if (action === "ADMIN_LOGIN") return ShieldCheck
  if (action === "DELETE_PRODUCT") return Trash2
  if (action === "CREATE_ADMIN") return UserCog
  if (action === "ENABLE_ADMIN") return CheckCircle2
  if (action === "DISABLE_ADMIN") return X
  if (
    action === "VERIFY_VENDOR" ||
    action === "SUSPEND_VENDOR" ||
    action === "RETURN_VENDOR_PENDING"
  ) {
    return Store
  }

  return Activity
}

function getActionTone(action) {
  if (action === "ADMIN_LOGIN") {
    return "bg-blue-50 text-blue-700"
  }

  if (action === "VERIFY_VENDOR" || action === "ENABLE_ADMIN") {
    return "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
  }

  if (action === "SUSPEND_VENDOR" || action === "DELETE_PRODUCT" || action === "DISABLE_ADMIN") {
    return "bg-red-50 text-red-600"
  }

  if (action === "RETURN_VENDOR_PENDING") {
    return "bg-amber-50 text-amber-700"
  }

  if (action === "CREATE_ADMIN") {
    return "bg-purple-50 text-purple-700"
  }

  return "bg-gray-100 text-gray-700"
}

function AdminLogsPage() {
  const [logs, setLogs] = useState([])
  const [query, setQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const currentAdmin = useMemo(() => {
    return AdminApiService.getCurrentAdmin()
  }, [])

  const isSuperAdmin = currentAdmin?.role === "super_admin"

  useEffect(() => {
    if (isSuperAdmin) {
      loadLogs()
    } else {
      setIsLoading(false)
    }
  }, [isSuperAdmin])

  async function loadLogs() {
    try {
      setIsLoading(true)
      setError("")

      const data = await AdminApiService.getAdminLogs()
      setLogs(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupata admin logs.")
    } finally {
      setIsLoading(false)
    }
  }

  const actionOptions = useMemo(() => {
    const uniqueActions = [...new Set(logs.map((log) => log.action).filter(Boolean))]

    return [
      { label: "All", value: "all" },
      ...uniqueActions.map((action) => ({
        label: getActionLabel(action),
        value: action,
      })),
    ]
  }, [logs])

  const filteredLogs = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "all" || log.action === actionFilter

      const matchesSearch =
        !searchText ||
        log.adminUsername?.toLowerCase().includes(searchText) ||
        log.adminRole?.toLowerCase().includes(searchText) ||
        log.action?.toLowerCase().includes(searchText) ||
        log.targetType?.toLowerCase().includes(searchText) ||
        log.targetName?.toLowerCase().includes(searchText) ||
        log.description?.toLowerCase().includes(searchText)

      return matchesAction && matchesSearch
    })
  }, [logs, query, actionFilter])

  const stats = useMemo(() => {
    const total = logs.length
    const logins = logs.filter((log) => log.action === "ADMIN_LOGIN").length
    const vendorActions = logs.filter((log) => log.targetType === "vendor").length
    const adminActions = logs.filter((log) => log.targetType === "admin").length

    return { total, logins, vendorActions, adminActions }
  }, [logs])

  function clearFilters() {
    setQuery("")
    setActionFilter("all")
  }

  if (!isSuperAdmin) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-red-50 text-red-600">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Super admin pekee
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Audit logs zinaonekana kwa admin mkuu pekee.
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
              Admin Logs
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia kumbukumbu za login na shughuli muhimu zilizofanywa na
              admins kwenye CloveNet Soko.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLogs}
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

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <FileText size={21} strokeWidth={2.6} />
            </div>
            <p className="text-2xl font-black text-gray-950">{stats.total}</p>
            <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
              Logs zote
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <ShieldCheck size={21} strokeWidth={2.6} />
            </div>
            <p className="text-2xl font-black text-gray-950">{stats.logins}</p>
            <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
              Login
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <Store size={21} strokeWidth={2.6} />
            </div>
            <p className="text-2xl font-black text-gray-950">
              {stats.vendorActions}
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
              Vendor actions
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <UserCog size={21} strokeWidth={2.6} />
            </div>
            <p className="text-2xl font-black text-gray-950">
              {stats.adminActions}
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
              Admin actions
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
              <Search
                size={17}
                strokeWidth={2.5}
                className="shrink-0 text-gray-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tafuta admin, action, target au description..."
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

            <div className="flex gap-2 overflow-x-auto">
              {actionOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActionFilter(item.value)}
                  className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    actionFilter === item.value
                      ? "bg-[var(--color-navy)] text-white"
                      : "border border-[var(--color-border)] bg-[var(--color-bg)] text-gray-700 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {(query || actionFilter !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600"
                >
                  Futa Filter
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Activity size={19} strokeWidth={2.6} />
              </div>

              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Activity Timeline
                </h2>

                <p className="mt-0.5 text-xs font-semibold text-[var(--color-muted)]">
                  Inaonyesha logs {filteredLogs.length} kati ya {logs.length}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia admin logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Activity size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                Hakuna logs zilizopatikana
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Badilisha search/filter au subiri admin afanye activity mpya.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredLogs.map((log) => {
                const Icon = getActionIcon(log.action)
                const tone = getActionTone(log.action)

                return (
                  <article key={log.id} className="p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}
                        >
                          <Icon size={20} strokeWidth={2.6} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-black text-gray-950">
                              {getActionLabel(log.action)}
                            </h3>

                            <span className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-[10px] font-black text-gray-600">
                              {log.targetType || "system"}
                            </span>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                              {log.adminRole || "admin"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                            {log.description || "Activity recorded."}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                            <span>
                              Admin:{" "}
                              <strong className="text-gray-950">
                                {log.adminUsername || "unknown"}
                              </strong>
                            </span>

                            {log.targetName && (
                              <span>
                                Target:{" "}
                                <strong className="text-gray-950">
                                  {log.targetName}
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[var(--color-bg)] px-4 py-3 text-xs font-bold text-[var(--color-muted)] lg:text-right">
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminLogsPage