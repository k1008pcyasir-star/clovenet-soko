import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  Link,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
  XCircle,
} from "lucide-react"

import { vendorApiService } from "../../../services/vendorApiService"
import { formatDate } from "../../../utils/formatters"

const PLAN_CONFIG = {
  free: {
    label: "Free",
    productLimit: 15,
    featuredLimit: 1,
  },
  basic: {
    label: "Basic",
    productLimit: 30,
    featuredLimit: 3,
  },
  pro: {
    label: "Pro",
    productLimit: 60,
    featuredLimit: 5,
  },
  business: {
    label: "Business",
    productLimit: 100,
    featuredLimit: 10,
  },
}

function getProductViews(product) {
  return Number(product?.views || product?.view_count || 0)
}

function getProductOrderClicks(product) {
  return Number(product?.orderClicks || product?.order_clicks || 0)
}

function getPlanInfo(plan) {
  return PLAN_CONFIG[plan] || PLAN_CONFIG.free
}

function getOrderStatus(order) {
  return String(order?.status || order?.orderStatus || "pending").toLowerCase()
}

function getOrderCustomerName(order) {
  return (
    order?.customerName ||
    order?.customer_name ||
    order?.customer?.name ||
    "Mteja"
  )
}

function getOrderPhone(order) {
  return (
    order?.customerPhone ||
    order?.customer_phone ||
    order?.customer?.phone ||
    "Haijawekwa"
  )
}

function getOrderItemsCount(order) {
  if (Array.isArray(order?.items)) {
    return order.items.reduce(
      (sum, item) => sum + Number(item?.quantity || 1),
      0
    )
  }

  return Number(order?.itemsCount || order?.items_count || 1)
}

function getOrderDate(order) {
  return order?.createdAt || order?.created_at || order?.orderDate || ""
}

function getStatusLabel(status) {
  if (status === "completed" || status === "done") return "Completed"
  if (status === "cancelled" || status === "canceled") return "Cancelled"
  if (status === "confirmed") return "Confirmed"
  if (status === "processing") return "Processing"
  return "Pending"
}

function getStatusClass(status) {
  if (status === "completed" || status === "done") {
    return "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
  }

  if (status === "cancelled" || status === "canceled") {
    return "bg-red-50 text-red-700"
  }

  if (status === "confirmed" || status === "processing") {
    return "bg-blue-50 text-blue-700"
  }

  return "bg-amber-50 text-amber-700"
}

function VendorDashboardPage() {
  const navigate = useNavigate()

  const [vendor, setVendor] = useState(() => vendorApiService.getCurrentVendor())
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedStoreLink, setCopiedStoreLink] = useState(false)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true)
        setError("")

        const [freshVendor, productsData, ordersData] = await Promise.all([
          vendorApiService.getVendorProfile(),
          vendorApiService.getVendorProducts(),
          typeof vendorApiService.getVendorOrders === "function"
            ? vendorApiService.getVendorOrders()
            : Promise.resolve([]),
        ])

        if (freshVendor) {
          setVendor(freshVendor)
        }

        setProducts(Array.isArray(productsData) ? productsData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (loadError) {
        setError(
          loadError?.message || "Imeshindikana kupakia taarifa za dashboard."
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (vendorApiService.getCurrentVendor()) {
      loadDashboardData()
    } else {
      setIsLoading(false)
    }
  }, [])

  const dashboardData = useMemo(() => {
    const currentVendor = vendor || {}

    const plan = currentVendor.plan || "free"
    const planInfo = getPlanInfo(plan)

    const productLimit = Number(
      currentVendor.productLimit ||
        currentVendor.product_limit ||
        planInfo.productLimit
    )

    const featuredLimit = planInfo.featuredLimit
    const featuredProducts = products.filter((product) => product.featured).length

    const remainingProducts = Math.max(productLimit - products.length, 0)
    const remainingFeatured = Math.max(featuredLimit - featuredProducts, 0)

    const productUsagePercent =
      productLimit > 0
        ? Math.min(Math.round((products.length / productLimit) * 100), 100)
        : 0

    const featuredUsagePercent =
      featuredLimit > 0
        ? Math.min(Math.round((featuredProducts / featuredLimit) * 100), 100)
        : 0

    const totalViews = products.reduce(
      (sum, product) => sum + getProductViews(product),
      0
    )

    const totalOrderClicks = products.reduce(
      (sum, product) => sum + getProductOrderClicks(product),
      0
    )

    const pendingOrders = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "pending" || status === "new"
    }).length

    const completedOrders = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "completed" || status === "done"
    }).length

    const cancelledOrders = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "cancelled" || status === "canceled"
    }).length

    const recentOrders = [...orders]
      .sort((a, b) => {
        const dateA = new Date(getOrderDate(a)).getTime() || 0
        const dateB = new Date(getOrderDate(b)).getTime() || 0
        return dateB - dateA
      })
      .slice(0, 5)

    return {
      plan,
      planInfo,
      productLimit,
      featuredLimit,
      featuredProducts,
      remainingProducts,
      remainingFeatured,
      productUsagePercent,
      featuredUsagePercent,
      totalViews,
      totalOrderClicks,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
    }
  }, [vendor, products, orders])

  function getVendorStoreLink() {
    const vendorId = vendor?.id || vendor?._id

    if (!vendorId) return ""

    return `${window.location.origin}/store/${vendorId}`
  }

  async function copyVendorStoreLink() {
    const link = getVendorStoreLink()

    if (!link) {
      setError("Link ya duka haijapatikana.")
      return
    }

    try {
      await navigator.clipboard.writeText(link)
      setCopiedStoreLink(true)
      setError("")

      window.setTimeout(() => {
        setCopiedStoreLink(false)
      }, 1800)
    } catch {
      setError("Imeshindikana ku-copy link ya duka.")
    }
  }

  function openVendorStoreLink() {
    const link = getVendorStoreLink()

    if (!link) {
      setError("Link ya duka haijapatikana.")
      return
    }

    window.open(link, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return null
  }

  if (!vendor) {
    return (
      <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
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

  const storeName = vendor.storeName || vendor.store_name || "Duka lako"
  const ownerName = vendor.ownerName || vendor.owner_name || "Haijawekwa"
  const isVerified = vendor.status === "verified" || vendor.isVerified
  const vendorStoreLink = getVendorStoreLink()

  return (
    <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-3 py-4 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_0.36fr]">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[1.7rem] bg-[var(--color-navy)] p-4 text-white shadow-sm md:rounded-[2rem] md:p-8">
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
                <div className="flex max-w-full flex-wrap items-center gap-2">
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

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-100 ring-1 ring-white/10">
                    <CreditCard size={13} strokeWidth={2.7} />
                    {dashboardData.planInfo.label} Plan
                  </span>
                </div>

                <h1 className="mt-5 break-words text-3xl font-black leading-tight md:text-5xl">
                  Karibu, {storeName}
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
                  Simamia bidhaa zako, angalia orders, badilisha bei, na endelea
                  kupokea order kupitia WhatsApp.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
                    onClick={() => navigate("/vendor/orders")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    <ClipboardList size={17} strokeWidth={2.7} />
                    Orders
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

            <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                      <Share2 size={21} strokeWidth={2.6} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Link ya Duka
                      </p>

                      <h2 className="mt-0.5 text-base font-black text-gray-950 md:text-lg">
                        Share link yako kwa wateja
                      </h2>
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                    Copy link hii na iweke WhatsApp status, Instagram bio au
                    uitume moja kwa moja kwa mteja. Kwa pilot, feature hii ipo
                    bure kwa vendors wote.
                  </p>

                  <div className="mt-3 flex min-w-0 items-center gap-2 rounded-2xl bg-[var(--color-bg)] px-4 py-3">
                    <Link
                      size={15}
                      strokeWidth={2.6}
                      className="shrink-0 text-[var(--color-green-dark)]"
                    />

                    <p className="min-w-0 break-all text-xs font-black text-[var(--color-navy)]">
                      {vendorStoreLink || "Link haijapatikana"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:w-72 md:grid-cols-1">
                  <button
                    type="button"
                    onClick={copyVendorStoreLink}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                  >
                    <Copy size={16} strokeWidth={2.7} />
                    {copiedStoreLink ? "Ime-copyiwa" : "Copy Link"}
                  </button>

                  <button
                    type="button"
                    onClick={openVendorStoreLink}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
                  >
                    <ExternalLink size={16} strokeWidth={2.7} />
                    Fungua Link
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
                value={dashboardData.remainingProducts}
                label="Nafasi Baki"
              />

              <DashboardStat
                icon={<MessageCircle size={18} strokeWidth={2.6} />}
                value={dashboardData.totalOrderClicks}
                label="WhatsApp clicks"
              />

              <DashboardStat
                icon={<Eye size={18} strokeWidth={2.6} />}
                value={dashboardData.totalViews}
                label="Product views"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <DashboardStat
                icon={<ClipboardList size={18} strokeWidth={2.6} />}
                value={dashboardData.totalOrders}
                label="Orders zote"
              />

              <DashboardStat
                icon={<Clock3 size={18} strokeWidth={2.6} />}
                value={dashboardData.pendingOrders}
                label="Pending"
              />

              <DashboardStat
                icon={<CheckCircle2 size={18} strokeWidth={2.6} />}
                value={dashboardData.completedOrders}
                label="Completed"
              />

              <DashboardStat
                icon={<XCircle size={18} strokeWidth={2.6} />}
                value={dashboardData.cancelledOrders}
                label="Cancelled"
              />
            </div>

            <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Recent Orders
                  </p>

                  <h2 className="mt-1 text-lg font-black text-gray-950">
                    Orders za hivi karibuni
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/vendor/orders")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green-soft)] px-4 py-2.5 text-xs font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green)] hover:text-[var(--color-navy)]"
                >
                  Angalia zote
                  <ArrowRight size={15} strokeWidth={2.7} />
                </button>
              </div>

              {dashboardData.recentOrders.length > 0 ? (
                <div className="mt-5 grid gap-3">
                  {dashboardData.recentOrders.map((order, index) => {
                    const status = getOrderStatus(order)

                    return (
                      <button
                        key={order.id || order._id || index}
                        type="button"
                        onClick={() => navigate("/vendor/orders")}
                        className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                            <ShoppingBag size={20} strokeWidth={2.6} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-gray-950">
                              {getOrderCustomerName(order)}
                            </p>

                            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                              {getOrderPhone(order)} ·{" "}
                              {getOrderItemsCount(order)} item
                            </p>

                            <p className="mt-0.5 truncate text-[11px] font-semibold text-gray-400">
                              {formatDate(getOrderDate(order))}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${getStatusClass(
                            status
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                    <ClipboardList size={24} strokeWidth={2.5} />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-gray-950">
                    Bado hakuna order
                  </h3>

                  <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Mteja akiagiza kupitia WhatsApp au cart, order itaonekana hapa.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Subscription
                  </p>

                  <h2 className="mt-1 text-lg font-black text-gray-950">
                    Mpango wa duka lako
                  </h2>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                  <CreditCard size={14} strokeWidth={2.7} />
                  {dashboardData.planInfo.label} Plan
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-gray-950">
                        Product Limit
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                        Bidhaa ulizoruhusiwa kuongeza.
                      </p>
                    </div>

                    <p className="text-2xl font-black text-[var(--color-navy)]">
                      {products.length}/{dashboardData.productLimit}
                    </p>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[var(--color-green)] transition-all"
                      style={{ width: `${dashboardData.productUsagePercent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-black text-[var(--color-green-dark)]">
                    {dashboardData.remainingProducts} nafasi za bidhaa zimebaki
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-gray-950">
                        Featured Limit
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                        Bidhaa zinazoweza kupewa nafasi ya featured.
                      </p>
                    </div>

                    <p className="text-2xl font-black text-[var(--color-navy)]">
                      {dashboardData.featuredProducts}/
                      {dashboardData.featuredLimit}
                    </p>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[var(--color-green)] transition-all"
                      style={{ width: `${dashboardData.featuredUsagePercent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-black text-[var(--color-green-dark)]">
                    {dashboardData.remainingFeatured} nafasi za featured zimebaki
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Quick Actions
                </p>

                <h2 className="mt-1 text-lg font-black text-gray-950">
                  Chagua unachotaka kufanya
                </h2>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <QuickActionCard
                  icon={<Package size={21} strokeWidth={2.6} />}
                  title="Bidhaa Zangu"
                  description="Ongeza, edit, futa au badilisha bei za bidhaa zako."
                  onClick={() => navigate("/vendor/products")}
                />

                <QuickActionCard
                  icon={<ClipboardList size={21} strokeWidth={2.6} />}
                  title="Orders"
                  description="Angalia orders mpya, zilizokamilika na zilizofutwa."
                  onClick={() => navigate("/vendor/orders")}
                />

                <QuickActionCard
                  icon={<Store size={21} strokeWidth={2.6} />}
                  title="Profile ya Duka"
                  description="Angalia taarifa za duka, location na maelezo yako."
                  onClick={() => navigate("/vendor/profile")}
                />
              </div>
            </div>

            <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Store Performance
                </p>

                <h2 className="mt-1 text-lg font-black text-gray-950">
                  Muhtasari wa duka
                </h2>
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
                    {dashboardData.featuredProducts}
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
            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Duka
              </p>

              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white">
                  <Store size={23} strokeWidth={2.6} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black text-gray-950">
                    {storeName}
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
                <p className="flex min-w-0 items-center gap-2">
                  <UserRound
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  <span className="truncate">
                    <span className="font-black text-gray-950">Owner:</span>{" "}
                    {ownerName}
                  </span>
                </p>

                <p className="flex min-w-0 items-center gap-2">
                  <MessageCircle
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  <span className="truncate">
                    <span className="font-black text-gray-950">WhatsApp:</span>{" "}
                    {vendor.whatsapp ? "WhatsApp ipo tayari" : "Haijawekwa"}
                  </span>
                </p>

                <p className="flex min-w-0 items-center gap-2">
                  <MapPin
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  <span className="truncate">
                    <span className="font-black text-gray-950">Location:</span>{" "}
                    {vendor.location || "Haijawekwa"}
                  </span>
                </p>

                <p className="flex min-w-0 items-center gap-2">
                  <BarChart3
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  <span className="truncate">
                    <span className="font-black text-gray-950">Joined:</span>{" "}
                    {formatDate(vendor.createdAt || vendor.created_at)}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Plan
              </p>

              <h2 className="mt-2 flex items-center gap-2 text-xl font-black text-gray-950">
                <CreditCard
                  size={20}
                  strokeWidth={2.7}
                  className="text-[var(--color-green-dark)]"
                />
                {dashboardData.planInfo.label}
              </h2>

              <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                Huu ndiyo mpango wa sasa wa duka lako kwenye CloveNet Soko.
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <p className="text-xs font-black text-gray-950">
                    Product Capacity
                  </p>

                  <h3 className="mt-2 text-lg font-black text-[var(--color-navy)]">
                    {products.length} / {dashboardData.productLimit} bidhaa
                  </h3>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[var(--color-green)] transition-all"
                      style={{ width: `${dashboardData.productUsagePercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-black">
                    <span className="text-[var(--color-muted)]">
                      Imetumika {dashboardData.productUsagePercent}%
                    </span>

                    <span className="text-[var(--color-green-dark)]">
                      {dashboardData.remainingProducts} baki
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                  <p className="text-xs font-black text-gray-950">
                    Featured Capacity
                  </p>

                  <h3 className="mt-2 text-lg font-black text-[var(--color-navy)]">
                    {dashboardData.featuredProducts} /{" "}
                    {dashboardData.featuredLimit} featured
                  </h3>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[var(--color-green)] transition-all"
                      style={{ width: `${dashboardData.featuredUsagePercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-black">
                    <span className="text-[var(--color-muted)]">
                      Imetumika {dashboardData.featuredUsagePercent}%
                    </span>

                    <span className="text-[var(--color-green-dark)]">
                      {dashboardData.remainingFeatured} baki
                    </span>
                  </div>
                </div>
              </div>

              {dashboardData.remainingProducts === 0 && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-black text-amber-700">
                    Umefikia limit ya bidhaa
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-amber-700">
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
    <div className="min-w-0 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        {icon}
      </div>

      <p className="mt-3 truncate text-2xl font-black text-gray-950">{value}</p>

      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  )
}

function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-gray-950">{title}</h3>

      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
        {description}
      </p>
    </button>
  )
}

export default VendorDashboardPage