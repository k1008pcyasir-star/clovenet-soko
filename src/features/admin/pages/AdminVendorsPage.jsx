import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"
import { formatDate } from "../../../utils/formatters"

const PLAN_OPTIONS = [
  {
    value: "free",
    label: "Free",
    productLimit: 15,
    featuredLimit: 1,
  },
  {
    value: "basic",
    label: "Basic",
    productLimit: 30,
    featuredLimit: 3,
  },
  {
    value: "pro",
    label: "Pro",
    productLimit: 60,
    featuredLimit: 5,
  },
  {
    value: "business",
    label: "Business",
    productLimit: 100,
    featuredLimit: 10,
  },
]

function getVendorStatus(vendor) {
  if (vendor.status === "verified" || vendor.isVerified) {
    return "verified"
  }

  if (vendor.status === "suspended") {
    return "suspended"
  }

  return "pending_verification"
}

function getPlanInfo(plan) {
  return PLAN_OPTIONS.find((item) => item.value === plan) || PLAN_OPTIONS[0]
}

function AdminVendorsPage() {
  const [vendors, setVendors] = useState([])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [lastNotification, setLastNotification] = useState(null)
  const [updatingVendorId, setUpdatingVendorId] = useState("")
  const [updatingPlanVendorId, setUpdatingPlanVendorId] = useState("")

  useEffect(() => {
    loadVendors()
  }, [])

  async function loadVendors() {
    try {
      setIsLoading(true)
      setError("")

      const vendorsData = await AdminApiService.getVendors()
      setVendors(vendorsData)
    } catch (loadError) {
      setError(loadError.message || "Imeshindikana kupata vendors.")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = vendors.length

    const pending = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "pending_verification"
    ).length

    const verified = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "verified"
    ).length

    const suspended = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "suspended"
    ).length

    return { total, pending, verified, suspended }
  }, [vendors])

  const statCards = [
    {
      label: "Jumla",
      value: stats.total,
      icon: UsersRound,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: CheckCircle2,
      tone: "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]",
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: XCircle,
      tone: "bg-red-50 text-red-600",
    },
  ]

  const filteredVendors = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return vendors.filter((vendor) => {
      const status = getVendorStatus(vendor)

      const matchesStatus = statusFilter === "all" || statusFilter === status

      const matchesSearch =
        !searchText ||
        vendor.storeName?.toLowerCase().includes(searchText) ||
        vendor.ownerName?.toLowerCase().includes(searchText) ||
        vendor.category?.toLowerCase().includes(searchText) ||
        vendor.location?.toLowerCase().includes(searchText) ||
        vendor.plan?.toLowerCase().includes(searchText)

      return matchesStatus && matchesSearch
    })
  }, [vendors, query, statusFilter])

  async function updateVendorStatus(vendorId, status) {
    if (status === "suspended") {
      const confirmSuspend = window.confirm(
        "Una uhakika unataka kususpend vendor huyu?"
      )

      if (!confirmSuspend) return
    }

    try {
      setUpdatingVendorId(vendorId)
      setError("")
      setSuccess("")
      setLastNotification(null)

      const data = await AdminApiService.updateVendorStatus(vendorId, status)
      const updatedVendor = data.vendor

      setVendors((currentVendors) =>
        currentVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, ...updatedVendor } : vendor
        )
      )

      if (status === "verified" && data.notification?.whatsappUrl) {
        setLastNotification({
          vendor: updatedVendor,
          message: data.notification.notificationMessage,
          whatsappUrl: data.notification.whatsappUrl,
        })

        setSuccess(
          "Vendor amehakikiwa kikamilifu. Sasa unaweza kumtumia taarifa kupitia WhatsApp."
        )
      } else {
        setSuccess("Status ya vendor imebadilishwa kikamilifu.")
      }
    } catch (updateError) {
      setError(updateError.message || "Imeshindikana kubadilisha status.")
    } finally {
      setUpdatingVendorId("")
    }
  }

  async function updateVendorPlan(vendorId, plan) {
    try {
      setUpdatingPlanVendorId(vendorId)
      setError("")
      setSuccess("")
      setLastNotification(null)

      const data = await AdminApiService.updateVendorPlan(vendorId, plan)
      const updatedVendor = data.vendor

      setVendors((currentVendors) =>
        currentVendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, ...updatedVendor } : vendor
        )
      )

      const planInfo = data.planInfo || getPlanInfo(plan)

      setSuccess(
        `Plan ya vendor imebadilishwa kuwa ${planInfo.plan || plan}. Product limit: ${planInfo.productLimit}. Featured limit: ${planInfo.featuredLimit}.`
      )
    } catch (updateError) {
      setError(updateError.message || "Imeshindikana kubadilisha plan.")
    } finally {
      setUpdatingPlanVendorId("")
    }
  }

  function openWhatsAppNotification() {
    if (!lastNotification?.whatsappUrl) return

    window.open(lastNotification.whatsappUrl, "_blank", "noopener,noreferrer")
  }

  function clearFilters() {
    setQuery("")
    setStatusFilter("all")
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            Admin
          </p>

          <h1 className="mt-1 text-2xl font-black text-gray-950">Vendors</h1>

          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
            Angalia vendors waliojisajili, hakiki taarifa zao, badilisha
            verification status na manage subscription plan kutoka backend.
          </p>
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
                <CheckCircle2
                  size={18}
                  strokeWidth={2.6}
                  className="mt-0.5 shrink-0 text-green-700"
                />
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-bold leading-5 ${
                    error ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {error || success}
                </p>

                {lastNotification?.whatsappUrl && !error && (
                  <div className="mt-3 rounded-2xl bg-white p-3">
                    <p className="text-xs font-semibold leading-5 text-gray-600">
                      Vendor:{" "}
                      <span className="font-black text-gray-950">
                        {lastNotification.vendor?.storeName ||
                          lastNotification.vendor?.store_name ||
                          "Vendor"}
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={openWhatsAppNotification}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                    >
                      <MessageCircle size={15} strokeWidth={2.7} />
                      Mtumie Vendor WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.label}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}
                >
                  <Icon size={21} strokeWidth={2.6} />
                </div>

                <p className="text-2xl font-black text-gray-950">
                  {card.value}
                </p>

                <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
                  {card.label}
                </p>
              </div>
            )
          })}
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
                placeholder="Tafuta duka, owner, category, location au plan..."
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
              {[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending_verification" },
                { label: "Verified", value: "verified" },
                { label: "Suspended", value: "suspended" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatusFilter(item.value)}
                  className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    statusFilter === item.value
                      ? "bg-[var(--color-navy)] text-white"
                      : "border border-[var(--color-border)] bg-[var(--color-bg)] text-gray-700 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {(query || statusFilter !== "all") && (
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
                <Store size={19} strokeWidth={2.6} />
              </div>

              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Vendor Applications
                </h2>

                <p className="mt-0.5 text-xs font-semibold text-[var(--color-muted)]">
                  Inaonyesha vendors {filteredVendors.length} kati ya{" "}
                  {vendors.length}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia vendors kutoka backend...
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Store size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                Hakuna vendor aliyepatikana
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Badilisha search/filter au subiri vendor ajisajili kupitia
                public form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredVendors.map((vendor) => {
                const status = getVendorStatus(vendor)
                const isVerified = status === "verified"
                const isSuspended = status === "suspended"
                const productCount = Number(vendor.productCount || 0)
                const productLimit = Number(vendor.productLimit || 15)
                const currentPlan = vendor.plan || "free"
                const currentPlanInfo = getPlanInfo(currentPlan)
                const isUpdating = updatingVendorId === vendor.id
                const isUpdatingPlan = updatingPlanVendorId === vendor.id

                return (
                  <article key={vendor.id} className="p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                              <Store size={20} strokeWidth={2.6} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-base font-black text-gray-950">
                                {vendor.storeName || "Duka bila jina"}
                              </h3>

                              <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                                {vendor.category || "Category haijawekwa"} •{" "}
                                {productCount}/{productLimit} bidhaa
                              </p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black ${
                              isVerified
                                ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                                : isSuspended
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isVerified ? (
                              <CheckCircle2 size={12} strokeWidth={2.8} />
                            ) : isSuspended ? (
                              <XCircle size={12} strokeWidth={2.8} />
                            ) : (
                              <Clock size={12} strokeWidth={2.8} />
                            )}

                            {isVerified
                              ? "Verified"
                              : isSuspended
                                ? "Suspended"
                                : "Pending Verification"}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-700">
                            <CreditCard size={12} strokeWidth={2.8} />
                            {currentPlanInfo.label} Plan
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                          {vendor.description || "Maelezo ya duka hayajawekwa."}
                        </p>

                        <div className="mt-4 grid gap-2 text-xs font-semibold text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                          <p className="flex items-center gap-2">
                            <UserRound
                              size={14}
                              strokeWidth={2.5}
                              className="shrink-0 text-[var(--color-green-dark)]"
                            />

                            <span className="min-w-0 truncate">
                              <span className="font-black text-gray-950">
                                Owner:
                              </span>{" "}
                              {vendor.ownerName || "Haijawekwa"}
                            </span>
                          </p>

                          <p className="flex items-center gap-2">
                            <MessageCircle
                              size={14}
                              strokeWidth={2.5}
                              className="shrink-0 text-[var(--color-green-dark)]"
                            />

                            <span className="min-w-0 truncate">
                              <span className="font-black text-gray-950">
                                WhatsApp:
                              </span>{" "}
                              {vendor.whatsapp
                                ? "WhatsApp ipo tayari"
                                : "Haijawekwa"}
                            </span>
                          </p>

                          <p className="flex items-center gap-2">
                            <MapPin
                              size={14}
                              strokeWidth={2.5}
                              className="shrink-0 text-[var(--color-green-dark)]"
                            />

                            <span className="min-w-0 truncate">
                              <span className="font-black text-gray-950">
                                Location:
                              </span>{" "}
                              {vendor.location || "Haijawekwa"}
                            </span>
                          </p>

                          <p className="flex items-center gap-2">
                            <ShieldCheck
                              size={14}
                              strokeWidth={2.5}
                              className="shrink-0 text-[var(--color-green-dark)]"
                            />

                            <span className="min-w-0 truncate">
                              <span className="font-black text-gray-950">
                                Joined:
                              </span>{" "}
                              {formatDate(vendor.createdAt)}
                            </span>
                          </p>
                        </div>

                        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
                          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                              <p className="flex items-center gap-2 text-xs font-black text-gray-950">
                                <CreditCard
                                  size={15}
                                  strokeWidth={2.7}
                                  className="text-[var(--color-green-dark)]"
                                />
                                Subscription Plan
                              </p>

                              <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                                Product limit: {productLimit} • Featured limit:{" "}
                                {currentPlanInfo.featuredLimit}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isUpdatingPlan && (
                                <Loader2
                                  size={16}
                                  strokeWidth={2.7}
                                  className="animate-spin text-[var(--color-green-dark)]"
                                />
                              )}

                              <select
                                value={currentPlan}
                                disabled={isUpdatingPlan}
                                onChange={(event) =>
                                  updateVendorPlan(vendor.id, event.target.value)
                                }
                                className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-black text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {PLAN_OPTIONS.map((plan) => (
                                  <option key={plan.value} value={plan.value}>
                                    {plan.label} - {plan.productLimit} products
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3 lg:w-96">
                        <button
                          type="button"
                          onClick={() =>
                            updateVendorStatus(vendor.id, "verified")
                          }
                          disabled={isVerified || isUpdating}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={14}
                              strokeWidth={2.8}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2 size={14} strokeWidth={2.8} />
                          )}
                          Verify
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateVendorStatus(
                              vendor.id,
                              "pending_verification"
                            )
                          }
                          disabled={
                            status === "pending_verification" || isUpdating
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Clock size={14} strokeWidth={2.8} />
                          Pending
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateVendorStatus(vendor.id, "suspended")
                          }
                          disabled={isSuspended || isUpdating}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={14} strokeWidth={2.8} />
                          Suspend
                        </button>
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

export default AdminVendorsPage