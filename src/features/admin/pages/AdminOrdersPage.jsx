import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  UserRound,
  X,
  XCircle,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"
import { formatDate, formatMoney } from "../../../utils/formatters"

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

function getStatusStyle(status) {
  if (status === "completed") {
    return "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
  }

  if (status === "confirmed") {
    return "bg-blue-50 text-blue-700"
  }

  if (status === "contacted") {
    return "bg-purple-50 text-purple-700"
  }

  if (status === "cancelled") {
    return "bg-red-50 text-red-600"
  }

  return "bg-amber-50 text-amber-700"
}

function getStatusIcon(status) {
  if (status === "completed") return CheckCircle2
  if (status === "cancelled") return XCircle
  if (status === "contacted") return Phone
  if (status === "confirmed") return Package

  return Clock
}

function getOrderStatus(order) {
  return String(order?.status || "new").toLowerCase()
}

function getVendorName(order) {
  return (
    order?.vendor?.storeName ||
    order?.storeName ||
    order?.store_name ||
    "Duka"
  )
}

function getCustomerName(order) {
  return order?.customerName || order?.customer_name || "Mteja"
}

function getCustomerPhone(order) {
  return order?.customerPhone || order?.customer_phone || "Simu haijawekwa"
}

function getCustomerLocation(order) {
  return (
    order?.customerLocation ||
    order?.customer_location ||
    "Location haijawekwa"
  )
}

function getOrderTotal(order) {
  return order?.totalAmount || order?.total_amount || 0
}

function getOrderDate(order) {
  return order?.createdAt || order?.created_at || ""
}

function getItems(order) {
  return Array.isArray(order?.items) ? order.items : []
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setIsLoading(true)
      setError("")

      if (typeof AdminApiService.getAdminOrders !== "function") {
        setOrders([])
        setError(
          "Admin orders service bado haijaongezwa kwenye adminApiService."
        )
        return
      }

      const data = await AdminApiService.getAdminOrders()
      setOrders(Array.isArray(data) ? data : data?.orders || [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupata orders.")
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = orders.length

    const newOrders = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "new" || status === "pending"
    }).length

    const completed = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "completed"
    }).length

    const cancelled = orders.filter((order) => {
      const status = getOrderStatus(order)
      return status === "cancelled" || status === "canceled"
    }).length

    return {
      total,
      newOrders,
      completed,
      cancelled,
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return orders.filter((order) => {
      const status = getOrderStatus(order)

      const matchesStatus =
        statusFilter === "all" || status === statusFilter

      const items = getItems(order)

      const matchesSearch =
        !searchText ||
        getCustomerName(order).toLowerCase().includes(searchText) ||
        getCustomerPhone(order).toLowerCase().includes(searchText) ||
        getCustomerLocation(order).toLowerCase().includes(searchText) ||
        getVendorName(order).toLowerCase().includes(searchText) ||
        items.some((item) =>
          String(item.productName || item.product_name || "")
            .toLowerCase()
            .includes(searchText)
        )

      return matchesStatus && matchesSearch
    })
  }, [orders, query, statusFilter])

  function clearFilters() {
    setQuery("")
    setStatusFilter("all")
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-3 py-4 pb-28 text-[var(--color-text)] md:px-6 md:py-8 md:pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Admin Orders
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950 md:text-3xl">
              Orders zote za CloveNet Soko
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia orders kutoka kwa vendors wote, fuatilia status na
              taarifa za mteja kwa urahisi.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={16} strokeWidth={2.7} className="animate-spin" />
            ) : (
              <RefreshCw size={16} strokeWidth={2.7} />
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
          <StatCard icon={ShoppingBag} label="Jumla" value={stats.total} />
          <StatCard icon={Clock} label="New" value={stats.newOrders} />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
          />
          <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled} />
        </div>

        <div className="mt-5 rounded-[1.7rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem]">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
              <Search
                size={17}
                strokeWidth={2.5}
                className="shrink-0 text-gray-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tafuta mteja, simu, duka, location au bidhaa..."
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

            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {[{ label: "All", value: "all" }, ...STATUS_OPTIONS].map(
                (item) => (
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
                )
              )}

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

        <div className="mt-5 overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-white shadow-sm md:rounded-[2rem]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <ShoppingBag size={19} strokeWidth={2.6} />
              </div>

              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Order List
                </h2>

                <p className="mt-0.5 text-xs font-semibold text-[var(--color-muted)]">
                  Inaonyesha orders {filteredOrders.length} kati ya{" "}
                  {orders.length}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <ShoppingBag size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                Hakuna order iliyopatikana
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Orders mpya zitaonekana hapa baada ya wateja ku-submit order.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredOrders.map((order) => {
                const status = getOrderStatus(order)
                const StatusIcon = getStatusIcon(status)
                const items = getItems(order)

                return (
                  <article
                    key={order.id || order._id}
                    className="p-4 md:p-5"
                  >
                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                            <UserRound size={20} strokeWidth={2.6} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-base font-black text-gray-950">
                              {getCustomerName(order)}
                            </h3>

                            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                              {getCustomerPhone(order)} ·{" "}
                              {formatDate(getOrderDate(order))}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black ${getStatusStyle(
                              status
                            )}`}
                          >
                            <StatusIcon size={12} strokeWidth={2.8} />
                            {status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-4">
                          <InfoBox
                            label="Vendor"
                            icon={Store}
                            value={getVendorName(order)}
                          />

                          <InfoBox
                            label="Location"
                            icon={MapPin}
                            value={getCustomerLocation(order)}
                          />

                          <InfoBox
                            label="Total"
                            icon={ShoppingBag}
                            value={formatMoney(getOrderTotal(order))}
                          />

                          <InfoBox
                            label="WhatsApp Sent"
                            icon={Phone}
                            value={order.whatsappSent ? "Ndiyo" : "Hapana"}
                          />
                        </div>

                        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white p-4">
                          <p className="text-xs font-black text-gray-950">
                            Bidhaa kwenye order
                          </p>

                          {items.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {items.map((item) => (
                                <div
                                  key={item.id || item.productId}
                                  className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-bg)] px-3 py-2"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-gray-950">
                                      {item.productName || item.product_name}
                                    </p>

                                    <p className="text-xs font-semibold text-[var(--color-muted)]">
                                      Qty {item.quantity} ×{" "}
                                      {formatMoney(
                                        item.unitPrice || item.unit_price
                                      )}
                                    </p>
                                  </div>

                                  <p className="shrink-0 text-sm font-black text-gray-950">
                                    {formatMoney(
                                      item.totalPrice || item.total_price
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 rounded-xl bg-[var(--color-bg)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)]">
                              Hakuna bidhaa kwenye order hii.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-2 lg:w-64">
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                            Order ID
                          </p>

                          <p className="mt-2 break-all text-xs font-black text-gray-700">
                            {order.id || order._id}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                            Vendor
                          </p>

                          <p className="mt-2 text-sm font-black text-gray-950">
                            {getVendorName(order)}
                          </p>
                        </div>
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

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        <Icon size={21} strokeWidth={2.6} />
      </div>

      <p className="truncate text-2xl font-black text-gray-950">{value}</p>

      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  )
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[var(--color-bg)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
        {label}
      </p>

      <p className="mt-2 flex min-w-0 items-center gap-2 text-sm font-black text-gray-950">
        <Icon
          size={15}
          strokeWidth={2.6}
          className="shrink-0 text-[var(--color-green-dark)]"
        />
        <span className="truncate">{value}</span>
      </p>
    </div>
  )
}

export default AdminOrdersPage