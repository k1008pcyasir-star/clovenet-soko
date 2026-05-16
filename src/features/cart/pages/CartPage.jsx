import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import EmptyState from "../../../components/ui/EmptyState"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import { formatMoney } from "../../../utils/formatters"
import { openWhatsAppOrder } from "../../../utils/whatsapp"

function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(() => StorageService.getCart())

  const products = useMemo(() => StorageService.getProducts(), [])
  const vendors = useMemo(() => StorageService.getVendors(), [])

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find(
          (productItem) => productItem.id === item.productId
        )

        const vendor = vendors.find(
          (vendorItem) => vendorItem.id === item.vendorId
        )

        if (!product || !vendor) {
          return null
        }

        return {
          ...item,
          product,
          vendor,
          lineTotal: Number(product.price || 0) * Number(item.quantity || 0),
        }
      })
      .filter(Boolean)
  }, [cart, products, vendors])

  const groupedByVendor = useMemo(() => {
    return cartItems.reduce((groups, item) => {
      const vendorId = item.vendor.id

      if (!groups[vendorId]) {
        groups[vendorId] = {
          vendor: item.vendor,
          items: [],
          total: 0,
        }
      }

      groups[vendorId].items.push(item)
      groups[vendorId].total += item.lineTotal

      return groups
    }, {})
  }, [cartItems])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const vendorCount = Object.keys(groupedByVendor).length

  function updateQuantity(productId, quantity) {
    const updatedCart = StorageService.updateCartQuantity(productId, quantity)
    setCart(updatedCart)
  }

  function removeItem(productId) {
    const updatedCart = StorageService.removeFromCart(productId)
    setCart(updatedCart)
  }

  function clearCart() {
    StorageService.clearCart()
    setCart([])
  }

  function handleVendorWhatsAppOrder(group) {
    const items = group.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    openWhatsAppOrder({
      vendor: group.vendor,
      items,
      products,
    })

    group.items.forEach((item) => {
      StorageService.recordOrderClick({
        ...item.product,
        vendor: group.vendor,
      })
    })
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="mx-auto max-w-4xl px-4 py-8 pb-28 md:px-6 md:pb-8">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <EmptyState
              icon={<ShoppingCart size={34} strokeWidth={2.4} />}
              title="Kikapu kiko tupu"
              description="Bidhaa utakazoongeza kutoka sokoni zitaonekana hapa kabla ya kuagiza kupitia WhatsApp."
            >
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/soko")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                >
                  Angalia Bidhaa
                  <ArrowRight size={16} strokeWidth={2.7} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
                >
                  Rudi Mwanzo
                </button>
              </div>
            </EmptyState>
          </div>
        </main>

        <MobileBottomNav active="cart" />
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => navigate("/soko")}
            className="flex min-w-0 items-center gap-3 rounded-2xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
            aria-label="Rudi sokoni"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm">
              <ArrowLeft size={22} strokeWidth={2.7} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black leading-tight text-gray-950 md:text-base">
                Kikapu Changu
              </p>

              <p className="truncate text-[10px] font-semibold text-[var(--color-muted)]">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "bidhaa" : "bidhaa"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={15} strokeWidth={2.7} />
            Futa Kikapu
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 md:px-6 md:pb-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.38fr]">
          <div className="space-y-5">
            {Object.values(groupedByVendor).map((group) => (
              <section
                key={group.vendor.id}
                className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm"
              >
                <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                          <Store size={17} strokeWidth={2.6} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-base font-black text-gray-950">
                            {group.vendor.storeName}
                          </h2>

                          <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                            WhatsApp: {group.vendor.whatsapp || "Haijawekwa"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVendorWhatsAppOrder(group)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-xs font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                    >
                      <MessageCircle size={16} strokeWidth={2.7} />
                      Agiza kwa Vendor Huyu
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[var(--color-border)]">
                  {group.items.map((item) => (
                    <article key={item.productId} className="p-5">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/product/${item.productId}`)}
                          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                          aria-label={`Fungua ${item.product.name}`}
                        >
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name || "Bidhaa"}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={32} strokeWidth={2.3} />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/product/${item.productId}`)
                                }
                                className="block w-full text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                              >
                                <h3 className="line-clamp-2 text-sm font-black text-gray-950 transition hover:text-[var(--color-green-dark)]">
                                  {item.product.name}
                                </h3>
                              </button>

                              <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                                {item.product.category || "Bidhaa"}
                              </p>

                              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                                {item.product.specs ||
                                  item.product.description ||
                                  "Maelezo hayajawekwa."}
                              </p>
                            </div>

                            <div className="shrink-0 text-left sm:text-right">
                              <p className="text-sm font-black text-[var(--color-navy)]">
                                {formatMoney(item.product.price)}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                                Jumla: {formatMoney(item.lineTotal)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-gray-700 transition hover:bg-[var(--color-bg)]"
                              aria-label="Punguza idadi"
                            >
                              <Minus size={15} strokeWidth={2.8} />
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center rounded-xl bg-[var(--color-bg)] px-3 text-sm font-black text-gray-950">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-gray-700 transition hover:bg-[var(--color-bg)]"
                              aria-label="Ongeza idadi"
                            >
                              <Plus size={15} strokeWidth={2.8} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={14} strokeWidth={2.7} />
                              Ondoa
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-gray-950">
                      Jumla ya vendor
                    </p>

                    <p className="text-lg font-black text-[var(--color-navy)]">
                      {formatMoney(group.total)}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Muhtasari
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-950">
              Muhtasari wa Kikapu
            </h2>

            <div className="mt-5 space-y-3 text-sm font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-muted)]">Bidhaa</span>

                <span className="font-black text-gray-950">
                  {cartItems.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--color-muted)]">Maduka</span>

                <span className="font-black text-gray-950">{vendorCount}</span>
              </div>

              <div className="border-t border-[var(--color-border)] pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--color-muted)]">Jumla</span>

                  <span className="text-xl font-black text-[var(--color-navy)]">
                    {formatMoney(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 rounded-2xl bg-[var(--color-green-soft)] p-4 text-xs font-semibold leading-5 text-[var(--color-green-dark)]">
              Kama umechagua bidhaa kutoka maduka tofauti, utatuma order tofauti
              kwa kila duka kupitia WhatsApp.
            </p>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
            >
              Endelea Kununua
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>
          </aside>
        </div>
      </main>

      <MobileBottomNav active="cart" />
    </section>
  )
}

export default CartPage