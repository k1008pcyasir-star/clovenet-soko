import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Eye,
  Images,
  Loader2,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  UsersRound,
  X,
  XCircle,
} from "lucide-react"

import { AdminApiService } from "../../../services/adminApiService"
import { formatDate, formatMoney } from "../../../utils/formatters"

function getProductImages(product) {
  if (!product) return []

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean)
  }

  if (product.image) {
    return [product.image]
  }

  return []
}

function getVendorStatus(vendor) {
  if (!vendor) return "unknown"

  if (vendor.status === "verified" || vendor.isVerified) {
    return "verified"
  }

  if (vendor.status === "suspended") {
    return "suspended"
  }

  return "pending_verification"
}

function AdminProductsPage() {
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [featureFilter, setFeatureFilter] = useState("all")
  const [vendorStatusFilter, setVendorStatusFilter] = useState("all")
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deletingProductId, setDeletingProductId] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setIsLoading(true)
      setError("")

      const productsData = await AdminApiService.getProducts()
      setProducts(productsData)
    } catch (loadError) {
      setError(loadError.message || "Imeshindikana kupata bidhaa.")
    } finally {
      setIsLoading(false)
    }
  }

  const productsWithVendors = useMemo(() => {
    return products.map((product) => {
      const vendor = product.vendor || null

      return {
        ...product,
        vendor,
        vendorStatus: getVendorStatus(vendor),
      }
    })
  }, [products])

  const filteredProducts = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    return productsWithVendors.filter((product) => {
      const name = product.name?.toLowerCase() || ""
      const category = product.category?.toLowerCase() || ""
      const storeName = product.vendor?.storeName?.toLowerCase() || ""
      const specs = product.specs?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        category.includes(searchText) ||
        storeName.includes(searchText) ||
        specs.includes(searchText) ||
        description.includes(searchText)

      const matchesFeature =
        featureFilter === "all" ||
        (featureFilter === "featured" && product.featured) ||
        (featureFilter === "normal" && !product.featured)

      const matchesVendorStatus =
        vendorStatusFilter === "all" ||
        product.vendorStatus === vendorStatusFilter

      return matchesSearch && matchesFeature && matchesVendorStatus
    })
  }, [productsWithVendors, query, featureFilter, vendorStatusFilter])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const featuredProducts = products.filter((product) => product.featured)
      .length

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

  const hasFilters =
    query.trim() || featureFilter !== "all" || vendorStatusFilter !== "all"

  function clearFilters() {
    setQuery("")
    setFeatureFilter("all")
    setVendorStatusFilter("all")
  }

  async function deleteProduct(productId) {
    const product = products.find((item) => item.id === productId)

    const confirmDelete = window.confirm(
      `Una uhakika unataka kufuta bidhaa "${
        product?.name || "hii"
      }"? Hatua hii haiwezi kurudishwa.`
    )

    if (!confirmDelete) {
      return
    }

    try {
      setDeletingProductId(productId)
      setError("")
      setSuccess("")

      await AdminApiService.deleteProduct(productId)

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== productId)
      )

      setSuccess("Bidhaa imefutwa kikamilifu.")
    } catch (deleteError) {
      setError(deleteError.message || "Imeshindikana kufuta bidhaa.")
    } finally {
      setDeletingProductId("")
    }
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
              Angalia, tafuta na simamia bidhaa zote zilizowekwa na vendors
              kwenye CloveNet Soko kutoka backend.
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
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
              <Search
                size={17}
                strokeWidth={2.6}
                className="shrink-0 text-gray-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tafuta bidhaa, category, duka, specs au maelezo..."
                className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
              />

              {query.trim() && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 transition hover:text-gray-800"
                  aria-label="Futa utafutaji"
                >
                  <X size={14} strokeWidth={2.7} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {[
                { label: "All", value: "all" },
                { label: "Featured", value: "featured" },
                { label: "Normal", value: "normal" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFeatureFilter(item.value)}
                  className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    featureFilter === item.value
                      ? "bg-[var(--color-navy)] text-white"
                      : "border border-[var(--color-border)] bg-[var(--color-bg)] text-gray-700 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {[
                { label: "Vendors: All", value: "all" },
                { label: "Verified", value: "verified" },
                { label: "Pending", value: "pending_verification" },
                { label: "Suspended", value: "suspended" },
                { label: "Unknown", value: "unknown" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setVendorStatusFilter(item.value)}
                  className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    vendorStatusFilter === item.value
                      ? "bg-[var(--color-green)] text-[var(--color-navy)]"
                      : "border border-[var(--color-border)] bg-[var(--color-bg)] text-gray-700 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {hasFilters && (
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
          <div className="border-b border-[var(--color-border)] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-black text-gray-950">
                  Product List
                </h2>

                <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                  Inaonyesha bidhaa {filteredProducts.length} kati ya{" "}
                  {products.length}
                </p>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-white"
                >
                  <X size={14} strokeWidth={2.7} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia bidhaa kutoka backend...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Package size={34} strokeWidth={2.4} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-950">
                {products.length === 0
                  ? "Hakuna bidhaa bado"
                  : "Hakuna bidhaa iliyopatikana"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                {products.length === 0
                  ? "Bidhaa zitakazowekwa na vendors zitaonekana hapa."
                  : "Jaribu kubadilisha search au filter ulizoweka."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                >
                  Futa Filters
                  <ArrowRight size={16} strokeWidth={2.7} />
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredProducts.map((product) => {
                const productImages = getProductImages(product)
                const mainImage = productImages[0] || ""
                const hasMultipleImages = productImages.length > 1
                const vendorStatus = product.vendorStatus
                const vendorIsVerified = vendorStatus === "verified"
                const vendorIsSuspended = vendorStatus === "suspended"
                const vendorIsPending = vendorStatus === "pending_verification"
                const isDeleting = deletingProductId === product.id

                return (
                  <article key={product.id} className="p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div className="flex gap-4">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={product.name || "Bidhaa"}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={34} strokeWidth={2.3} />
                          )}

                          {hasMultipleImages && (
                            <span className="absolute bottom-1 right-1 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[9px] font-black text-white">
                              <Images size={10} strokeWidth={2.7} />
                              {productImages.length}
                            </span>
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

                            {vendorIsVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-green-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                                <CheckCircle2 size={12} strokeWidth={2.8} />
                                Vendor Verified
                              </span>
                            )}

                            {vendorIsPending && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                                <Clock size={12} strokeWidth={2.8} />
                                Vendor Pending
                              </span>
                            )}

                            {vendorIsSuspended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600">
                                <XCircle size={12} strokeWidth={2.8} />
                                Vendor Suspended
                              </span>
                            )}

                            {hasMultipleImages && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-[10px] font-black text-gray-500">
                                <Images size={12} strokeWidth={2.6} />
                                Picha {productImages.length}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
                            <span>{product.category || "Bidhaa"}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Store size={13} strokeWidth={2.5} />
                              {product.vendor?.storeName ||
                                "Vendor haijapatikana"}
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
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? (
                            <Loader2
                              size={14}
                              strokeWidth={2.7}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} strokeWidth={2.7} />
                          )}
                          Delete
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

export default AdminProductsPage