import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  X,
  XCircle,
} from "lucide-react"

import { vendorApiService } from "../../../services/vendorApiService"
import { formatDate, formatMoney } from "../../../utils/formatters"

const STATUS_OPTIONS = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
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

function buildWhatsAppPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "")

  if (!digits) return ""

  if (digits.startsWith("255")) return digits
  if (digits.startsWith("0")) return `255${digits.slice(1)}`

  return digits
}

function buildOrderSummary(order) {
  const items = Array.isArray(order.items) ? order.items : []

  const itemLines = items
    .map((item, index) => {
      const quantity = Number(item.quantity || 1)
      const total = Number(item.totalPrice || item.total_price || 0)

      return `${index + 1}. ${
        item.productName || item.product_name
      } x${quantity} - ${formatMoney(total)}`
    })
    .join("\n")

  return `Habari ${order.customerName || "Mteja"}, tumepokea oda yako kwenye CloveNet Soko.

Bidhaa:
${itemLines || "- Hakuna item"}

Jumla: ${formatMoney(order.totalAmount || order.total_amount || 0)}

Tutawasiliana nawe kuhusu upatikanaji na makabidhiano.`
}

function openCustomerWhatsApp(order) {
  const phone = buildWhatsAppPhone(order.customerPhone || order.customer_phone)
  const message = buildOrderSummary(order)

  if (!phone) return

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  )
}

function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      const data = await vendorApiService.getVendorOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupata orders.")
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = orders.length
    const newOrders = orders.filter((order) => order.status === "new").length
    const contacted = orders.filter(
      (order) => order.status === "contacted"
    ).length
    const completed = orders.filter(
      (order) => order.status === "completed"
    ).length

    return {
      total,
      newOrders,
      contacted,
      completed,
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter

      const matchesSearch =
        !searchText ||
        order.customerName?.toLowerCase().includes(searchText) ||
        order.customerPhone?.toLowerCase().includes(searchText) ||
        order.customerLocation?.toLowerCase().includes(searchText) ||
        order.items?.some((item) =>
          item.productName?.toLowerCase().includes(searchText)
        )

      return matchesStatus && matchesSearch
    })
  }, [orders, query, statusFilter])

  async function updateOrderStatus(orderId, status) {
    try {
      setUpdatingOrderId(orderId)
      setError("")
      setSuccess("")

      const data = await vendorApiService.updateVendorOrderStatus(
        orderId,
        status
      )
      const updatedOrder = data.order

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: updatedOrder?.status || status,
                updatedAt: updatedOrder?.updatedAt || updatedOrder?.updated_at,
              }
            : order
        )
      )

      setSuccess("Status ya order imebadilishwa kikamilifu.")
    } catch (updateError) {
      setError(
        updateError?.message || "Imeshindikana kubadilisha status ya order."
      )
    } finally {
      setUpdatingOrderId("")
    }
  }

  function clearFilters() {
    setQuery("")
    setStatusFilter("all")
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Vendor Orders
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Orders za Wateja
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia order zilizotumwa na wateja, wasiliana nao kupitia
              WhatsApp, na badilisha status ya order.
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={ShoppingBag} label="Jumla" value={stats.total} />
          <StatCard icon={Clock} label="New" value={stats.newOrders} />
          <StatCard icon={Phone} label="Contacted" value={stats.contacted} />
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
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
                placeholder="Tafuta jina la mteja, simu, location au bidhaa..."
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

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
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
                const StatusIcon = getStatusIcon(order.status)
                const isUpdating = updatingOrderId === order.id
                const items = Array.isArray(order.items) ? order.items : []

                return (
                  <article key={order.id} className="p-5">
                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                            <UserRound size={20} strokeWidth={2.6} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-base font-black text-gray-950">
                              {order.customerName || "Mteja"}
                            </h3>

                            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                              {order.customerPhone || "Simu haijawekwa"} ·{" "}
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            <StatusIcon size={12} strokeWidth={2.8} />
                            {order.status || "new"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                              Location
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm font-black text-gray-950">
                              <MapPin
                                size={15}
                                strokeWidth={2.6}
                                className="text-[var(--color-green-dark)]"
                              />
                              {order.customerLocation || "Haijawekwa"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                              Total
                            </p>

                            <p className="mt-2 text-sm font-black text-gray-950">
                              {formatMoney(order.totalAmount)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                              WhatsApp Sent
                            </p>

                            <p className="mt-2 text-sm font-black text-gray-950">
                              {order.whatsappSent ? "Ndiyo" : "Hapana"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white p-4">
                          <p className="text-xs font-black text-gray-950">
                            Bidhaa kwenye order
                          </p>

                          <div className="mt-3 space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.id || item.productId}
                                className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-bg)] px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-gray-950">
                                    {item.productName}
                                  </p>

                                  <p className="text-xs font-semibold text-[var(--color-muted)]">
                                    Qty {item.quantity} ×{" "}
                                    {formatMoney(item.unitPrice)}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-black text-gray-950">
                                  {formatMoney(item.totalPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 lg:w-72 lg:grid-cols-1">
                        <button
                          type="button"
                          onClick={() => openCustomerWhatsApp(order)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                        >
                          <MessageCircle size={14} strokeWidth={2.7} />
                          WhatsApp Mteja
                        </button>

                        <select
                          value={order.status || "new"}
                          disabled={isUpdating}
                          onChange={(event) =>
                            updateOrderStatus(order.id, event.target.value)
                          }
                          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>

                        {isUpdating && (
                          <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-[var(--color-muted)]">
                            <Loader2
                              size={14}
                              strokeWidth={2.7}
                              className="animate-spin"
                            />
                            Inabadilisha...
                          </div>
                        )}
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
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        <Icon size={21} strokeWidth={2.6} />
      </div>

      <p className="text-2xl font-black text-gray-950">{value}</p>

      <p className="mt-1 text-xs font-bold text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  )
}

export default VendorOrdersPage