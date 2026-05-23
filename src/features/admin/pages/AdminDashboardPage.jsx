import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Store,
  UsersRound,
  XCircle,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"
import { formatMoney } from "../../../utils/formatters"

function getVendorStatus(vendor) {
  if (vendor.status === "verified" || vendor.isVerified) {
    return "verified"
  }

  if (vendor.status === "suspended") {
    return "suspended"
  }

  return "pending_verification"
}

function AdminDashboardPage() {
  const navigate = useNavigate()

  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setIsLoading(true)
      setError("")

      const [vendorsData, productsData] = await Promise.all([
        AdminApiService.getVendors(),
        AdminApiService.getProducts(),
      ])

      setVendors(vendorsData)
      setProducts(productsData)
    } catch (loadError) {
      setError(loadError.message || "Imeshindikana kupata dashboard data.")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(() => {
    const pendingVendors = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "pending_verification"
    )

    const verifiedVendors = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "verified"
    )

    const suspendedVendors = vendors.filter(
      (vendor) => getVendorStatus(vendor) === "suspended"
    )

    const totalProductValue = products.reduce(
      (sum, product) => sum + Number(product.price || 0),
      0
    )

    const totalViews = products.reduce(
      (sum, product) => sum + Number(product.views || 0),
      0
    )

    const totalOrderClicks = products.reduce(
      (sum, product) => sum + Number(product.orderClicks || 0),
      0
    )

    return {
      vendors,
      products,
      pendingVendors,
      verifiedVendors,
      suspendedVendors,
      totalProductValue,
      totalViews,
      totalOrderClicks,
    }
  }, [vendors, products])

  const cards = [
    {
      label: "Vendors wote",
      value: stats.vendors.length,
      icon: UsersRound,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending",
      value: stats.pendingVendors.length,
      icon: Clock,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Verified",
      value: stats.verifiedVendors.length,
      icon: CheckCircle2,
      tone: "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]",
    },
    {
      label: "Suspended",
      value: stats.suspendedVendors.length,
      icon: XCircle,
      tone: "bg-red-50 text-red-600",
    },
    {
      label: "Products",
      value: stats.products.length,
      icon: Package,
      tone: "bg-purple-50 text-purple-700",
    },
    {
      label: "WhatsApp clicks",
      value: stats.totalOrderClicks,
      icon: MessageCircle,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ]

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Muhtasari wa CloveNet Soko
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia vendors, bidhaa na activity ya marketplace kutoka backend.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/vendors")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              <UsersRound size={17} strokeWidth={2.7} />
              Manage Vendors
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
            >
              <Package size={17} strokeWidth={2.7} />
              Manage Products
            </button>
          </div>
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

        {isLoading ? (
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
            <div className="flex items-center justify-center gap-3 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia dashboard data kutoka backend...
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {cards.map((card) => {
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

            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.4fr]">
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Vendor Applications
                    </p>

                    <h2 className="mt-1 text-lg font-black text-gray-950">
                      Pending verification
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/vendors")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-xs font-black text-gray-700 transition hover:bg-white"
                  >
                    View All
                    <ArrowRight size={14} strokeWidth={2.7} />
                  </button>
                </div>

                {stats.pendingVendors.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-[var(--color-bg)] p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                      <CheckCircle2 size={34} strokeWidth={2.4} />
                    </div>

                    <h3 className="mt-4 text-lg font-black text-gray-950">
                      Hakuna vendor anayesubiri
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                      Vendor mpya akijisajili ataonekana hapa kwa verification.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {stats.pendingVendors.slice(0, 5).map((vendor) => (
                      <article
                        key={vendor.id}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                                <Store size={19} strokeWidth={2.6} />
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-black text-gray-950">
                                  {vendor.storeName || vendor.store_name}
                                </h3>

                                <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                                  {vendor.ownerName || vendor.owner_name} ·{" "}
                                  {vendor.whatsapp}
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
                                  <MapPin size={13} strokeWidth={2.5} />
                                  {vendor.location || "Location haijawekwa"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate("/admin/vendors")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                          >
                            Review
                            <ArrowRight size={14} strokeWidth={2.7} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-5">
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Marketplace Value
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-[var(--color-navy)]">
                    {formatMoney(stats.totalProductValue)}
                  </h2>

                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                    Jumla ya thamani ya bidhaa zote sokoni.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Activity
                  </p>

                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl bg-[var(--color-bg)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                          <Eye size={18} strokeWidth={2.6} />
                        </div>

                        <p className="text-sm font-black text-gray-950">
                          Views
                        </p>
                      </div>

                      <p className="text-sm font-black text-[var(--color-navy)]">
                        {stats.totalViews}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[var(--color-bg)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                          <MessageCircle size={18} strokeWidth={2.6} />
                        </div>

                        <p className="text-sm font-black text-gray-950">
                          WhatsApp clicks
                        </p>
                      </div>

                      <p className="text-sm font-black text-[var(--color-navy)]">
                        {stats.totalOrderClicks}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Quick Actions
                  </p>

                  <div className="mt-4 grid gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/vendors")}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                        <UsersRound size={21} strokeWidth={2.6} />
                      </div>

                      <h3 className="mt-2 text-sm font-black text-gray-950">
                        Vendors
                      </h3>

                      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                        Verify, suspend au review vendors.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/admin/products")}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                        <Package size={21} strokeWidth={2.6} />
                      </div>

                      <h3 className="mt-2 text-sm font-black text-gray-950">
                        Products
                      </h3>

                      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                        Angalia bidhaa zote za vendors.
                      </p>
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default AdminDashboardPage