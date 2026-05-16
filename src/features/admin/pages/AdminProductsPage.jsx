import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  UsersRound,
  X,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { formatDate, formatMoney } from "../../../utils/formatters"

function AdminProductsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState(() => StorageService.getProducts())

  const vendors = useMemo(() => StorageService.getVendors(), [])

  const productsWithVendors = useMemo(() => {
    return products.map((product) => {
      const vendor = vendors.find((item) => item.id === product.vendorId)

      return {
        ...product,
        vendor,
      }
    })
  }, [products, vendors])

  const filteredProducts = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    if (!searchText) {
      return productsWithVendors
    }

    return productsWithVendors.filter((product) => {
      const name = product.name?.toLowerCase() || ""
      const category = product.category?.toLowerCase() || ""
      const storeName = product.vendor?.storeName?.toLowerCase() || ""

      return (
        name.includes(searchText) ||
        category.includes(searchText) ||
        storeName.includes(searchText)
      )
    })
  }, [productsWithVendors, query])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const featuredProducts = products.filter((product) => product.featured).length

    const totalViews = products.reduce(
      (sum, product) => sum + Number(product.views || 0),
      0
    )

    const totalOrderClicks = products.reduce(
      (sum, product) => sum + Number(product.orderClicks || 0),
      0
    )

    return {
      totalProducts,
      featuredProducts,
      totalViews,
      totalOrderClicks,
    }
  }, [products])

  const statCards = [
    {
      label: "Products",
      value: stats.totalProducts,
      icon: Package,
      tone: "bg-purple-50 text-purple-700",
    },
    {
      label: "Featured",
      value: stats.featuredProducts,
      icon: BadgeCheck,
      tone: "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]",
    },
    {
      label: "Views",
      value: stats.totalViews,
      icon: Eye,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "WhatsApp clicks",
      value: stats.totalOrderClicks,
      icon: MessageCircle,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ]

  function clearSearch() {
    setQuery("")
  }

  function deleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Una uhakika unataka kufuta bidhaa hii? Hatua hii haiwezi kurudishwa."
    )

    if (!confirmDelete) {
      return
    }

    const updatedProducts = products.filter((product) => product.id !== productId)

    setProducts(updatedProducts)
    StorageService.saveProducts(updatedProducts)
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Admin Products
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Bidhaa zote
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia bidhaa zote zilizowekwa na vendors kwenye CloveNet Soko.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/vendors")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
            >
              <UsersRound size={17} strokeWidth={2.7} />
              Manage Vendors
            </button>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              <ShoppingBag size={17} strokeWidth={2.7} />
              Angalia Soko
            </button>
          </div>
        </div>

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

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
          <div className="border-b border-[var(--color-border)] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Product List
                </h2>

                <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                  Jumla inayoonekana: {filteredProducts.length}
                </p>
              </div>

              <div className="flex w-full items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 md:max-w-sm">
                <Search
                  size={17}
                  strokeWidth={2.6}
                  className="shrink-0 text-gray-400"
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tafuta bidhaa, category au duka..."
                  className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                />

                {query.trim() && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 transition hover:text-gray-800"
                    aria-label="Futa utafutaji"
                  >
                    <X size={14} strokeWidth={2.7} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Package size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                Hakuna bidhaa
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Bidhaa zitakazowekwa na vendors zitaonekana hapa.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredProducts.map((product) => (
                <article key={product.id} className="p-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="flex gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || "Bidhaa"}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package size={34} strokeWidth={2.3} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="line-clamp-1 text-sm font-black text-gray-950">
                            {product.name || "Bidhaa bila jina"}
                          </h3>

                          {product.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-2.5 py-1 text-[10px] font-black text-[var(--color-navy)]">
                              <BadgeCheck size={12} strokeWidth={2.8} />
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
                          <span>{product.category || "Bidhaa"}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Store size={13} strokeWidth={2.5} />
                            {product.vendor?.storeName || "Vendor haijapatikana"}
                          </span>
                        </p>

                        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                          {product.specs ||
                            product.description ||
                            "Maelezo hayajawekwa."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
                          <span>
                            Bei:{" "}
                            <strong className="text-gray-950">
                              {formatMoney(product.price)}
                            </strong>
                          </span>

                          <span>
                            Views:{" "}
                            <strong className="text-gray-950">
                              {product.views || 0}
                            </strong>
                          </span>

                          <span>
                            Clicks:{" "}
                            <strong className="text-gray-950">
                              {product.orderClicks || 0}
                            </strong>
                          </span>

                          <span>
                            Added:{" "}
                            <strong className="text-gray-950">
                              {formatDate(product.createdAt)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-72">
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-white"
                      >
                        <Eye size={14} strokeWidth={2.7} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={14} strokeWidth={2.7} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminProductsPage