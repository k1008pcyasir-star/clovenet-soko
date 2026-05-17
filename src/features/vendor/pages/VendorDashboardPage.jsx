import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Eye,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { formatDate } from "../../../utils/formatters"

function VendorDashboardPage() {
  const navigate = useNavigate()

  const vendor = useMemo(() => {
    const vendorId = StorageService.getCurrentVendorId()
    const vendors = StorageService.getVendors()

    return vendors.find((item) => item.id === vendorId) || null
  }, [])

  const products = useMemo(() => {
    if (!vendor) return []

    return StorageService.getProducts().filter(
      (product) => product.vendorId === vendor.id
    )
  }, [vendor])

  const orders = useMemo(() => {
    if (!vendor) return []

    return StorageService.getOrders().filter(
      (order) => order.vendorId === vendor.id
    )
  }, [vendor])

  if (!vendor) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <LockKeyhole size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Tafadhali ingia kwanza
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Hatujapata taarifa za duka lako. Ingia kwa kutumia namba ya simu
              na neno la siri ulilosajili.
            </p>

            <button
              type="button"
              onClick={() => navigate("/vendor/login")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Ingia Dukani
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  const productLimit = Number(vendor.productLimit || 15)
  const remainingProducts = Math.max(productLimit - products.length, 0)
  const productUsagePercent = Math.min(
    Math.round((products.length / productLimit) * 100),
    100
  )
  const isVerified = vendor.status === "verified" || vendor.isVerified
  const totalViews = products.reduce(
    (sum, product) => sum + Number(product.views || 0),
    0
  )
  const featuredProducts = products.filter((product) => product.featured).length

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-navy)] p-6 text-white shadow-sm md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--color-green)]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-[var(--color-green)]/10 blur-3xl" />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10">
                    <Store size={13} strokeWidth={2.7} />
                    Vendor Dashboard
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${
                      isVerified
                        ? "bg-[var(--color-green)] text-[var(--color-navy)]"
                        : "bg-white/10 text-slate-200 ring-1 ring-white/10"
                    }`}
                  >
                    <ShieldCheck size={13} strokeWidth={2.7} />
                    {isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                  Karibu, {vendor.storeName}
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
                  Simamia bidhaa zako, badilisha bei, angalia activity ya duka,
                  na endelea kupokea order kupitia WhatsApp.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/vendor/products")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                  >
                    <Plus size={17} strokeWidth={2.8} />
                    Simamia Bidhaa
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/soko")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    <ShoppingBag size={17} strokeWidth={2.7} />
                    Angalia Soko
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <DashboardStat
                icon={<Package size={18} strokeWidth={2.6} />}
                value={products.length}
                label="Bidhaa"
              />

              <DashboardStat
                icon={<Plus size={18} strokeWidth={2.6} />}
                value={remainingProducts}
                label="Nafasi Baki"
              />

              <DashboardStat
                icon={<MessageCircle size={18} strokeWidth={2.6} />}
                value={orders.length}
                label="WhatsApp clicks"
              />

              <DashboardStat
                icon={<Eye size={18} strokeWidth={2.6} />}
                value={totalViews}
                label="Product views"
              />
            </div>

            <div className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Quick Actions
                  </p>

                  <h2 className="mt-1 text-lg font-black text-gray-950">
                    Chagua unachotaka kufanya
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/products")}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                    <Package size={21} strokeWidth={2.6} />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-gray-950">
                    Bidhaa Zangu
                  </h3>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Ongeza, edit, futa au badilisha bei za bidhaa zako.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/vendor/profile")}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                    <Store size={21} strokeWidth={2.6} />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-gray-950">
                    Profile ya Duka
                  </h3>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Angalia taarifa za duka, location na maelezo yako.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/soko")}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                    <ShoppingBag size={21} strokeWidth={2.6} />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-gray-950">
                    Angalia Marketplace
                  </h3>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Ona bidhaa zako zinavyoonekana kwa wateja.
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Store Performance
                  </p>

                  <h2 className="mt-1 text-lg font-black text-gray-950">
                    Muhtasari wa duka
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck
                      size={17}
                      strokeWidth={2.6}
                      className="text-[var(--color-green-dark)]"
                    />

                    <p className="text-sm font-black text-gray-950">
                      Featured products
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black text-[var(--color-navy)]">
                    {featuredProducts}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    Bidhaa zilizowekwa kama featured.
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={17}
                      strokeWidth={2.6}
                      className="text-[var(--color-green-dark)]"
                    />

                    <p className="text-sm font-black text-gray-950">
                      Verification
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-black text-[var(--color-navy)]">
                    {isVerified ? "Verified" : "Pending"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    Verification hubadilishwa na admin pekee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Duka
              </p>

              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white">
                  <Store size={23} strokeWidth={2.6} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-gray-950">
                    {vendor.storeName}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    {vendor.category || "Vendor Store"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                {vendor.description || "Duka hili bado halijaweka maelezo."}
              </p>

              <div className="mt-4 space-y-3 text-xs font-semibold text-gray-600">
                <p className="flex items-center gap-2">
                  <UserRound
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--color-green-dark)]"
                  />
                  <span>
                    <span className="font-black text-gray-950">Owner:</span>{" "}
                    {vendor.ownerName || "Haijawekwa"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <MessageCircle
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--color-green-dark)]"
                  />
                  <span>
                    <span className="font-black text-gray-950">WhatsApp:</span>{" "}
                    {vendor.whatsapp
                      ? "WhatsApp ipo tayari"
                      : "Haijawekwa"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--color-green-dark)]"
                  />
                  <span>
                    <span className="font-black text-gray-950">Location:</span>{" "}
                    {vendor.location || "Haijawekwa"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <BarChart3
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--color-green-dark)]"
                  />
                  <span>
                    <span className="font-black text-gray-950">Joined:</span>{" "}
                    {formatDate(vendor.createdAt)}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Product Capacity
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-950">
                {products.length} / {productLimit} bidhaa
              </h2>

              <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                Unaweza kuongeza bidhaa ndani ya nafasi yako ya sasa. Hata
                ukifikia limit, bado unaweza ku-edit bidhaa zilizopo.
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--color-bg)]">
                <div
                  className="h-full rounded-full bg-[var(--color-green)] transition-all"
                  style={{ width: `${productUsagePercent}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-black">
                <span className="text-[var(--color-muted)]">
                  Imetumika {productUsagePercent}%
                </span>

                <span className="text-[var(--color-green-dark)]">
                  {remainingProducts} nafasi baki
                </span>
              </div>

              {remainingProducts === 0 && (
                <div className="mt-4 rounded-2xl bg-[var(--color-bg)] p-4">
                  <p className="text-sm font-black text-gray-950">
                    Umefikia limit ya bidhaa
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Kwa sasa huwezi kuongeza bidhaa mpya, lakini unaweza
                    kuendelea ku-edit bidhaa zako zilizopo.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function DashboardStat({ icon, value, label }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        {icon}
      </div>

      <p className="mt-3 text-2xl font-black text-gray-950">{value}</p>

      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  )
}

export default VendorDashboardPage