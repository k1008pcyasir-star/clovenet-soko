import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  X,
} from "lucide-react"

import BrandLogo from "../../../components/brand/BrandLogo"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import ProductGrid from "../../products/components/ProductGrid"
import EmptyState from "../../../components/ui/EmptyState"
import { PublicApiService } from "../../../services/publicApiService"

function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0
  return `TZS ${numericAmount.toLocaleString("en-US")}`
}

function getProductImage(product) {
  const firstImage = product?.images?.[0]

  if (typeof firstImage === "string") return firstImage

  if (firstImage && typeof firstImage === "object") {
    return (
      firstImage.url ||
      firstImage.imageUrl ||
      firstImage.src ||
      firstImage.path ||
      ""
    )
  }

  return (
    product?.image ||
    product?.imageUrl ||
    product?.photo ||
    product?.photoUrl ||
    product?.coverImage ||
    product?.thumbnail ||
    product?.mainImage ||
    ""
  )
}

function getProductPrice(product) {
  return product?.price || product?.sellingPrice || product?.amount || 0
}

function getProductStoreName(product) {
  return (
    product?.vendor?.storeName ||
    product?.vendor?.businessName ||
    product?.vendor?.name ||
    product?.storeName ||
    product?.businessName ||
    product?.vendorName ||
    "CloveNet Vendor"
  )
}

function getProductLocation(product) {
  return (
    product?.vendor?.location ||
    product?.vendor?.region ||
    product?.vendor?.city ||
    product?.location ||
    product?.region ||
    product?.city ||
    "Tanzania"
  )
}

function isFeaturedProduct(product) {
  return Boolean(
    product?.isFeatured ||
      product?.featured ||
      product?.is_featured ||
      product?.featuredProduct
  )
}

function isProductVisible(product) {
  const status = String(product?.status || "").toLowerCase()
  const approvalStatus = String(product?.approvalStatus || "").toLowerCase()

  if (product?.isDeleted) return false
  if (status === "deleted") return false
  if (status === "hidden") return false
  if (status === "draft") return false
  if (approvalStatus === "rejected") return false

  return true
}

function normalizeProduct(product, index) {
  return {
    ...product,
    _id: product?.id || product?._id || product?.productId || `product-${index}`,
    _name: product?.name || product?.title || product?.productName || "Bidhaa",
    _category: product?.category || product?.categoryName || "Bidhaa",
    _price: getProductPrice(product),
    _image: getProductImage(product),
    _storeName: getProductStoreName(product),
    _location: getProductLocation(product),
    _specs: product?.specs || product?.description || "",
    _isFeatured: isFeaturedProduct(product),
    _createdAt:
      product?.createdAt ||
      product?.created_at ||
      product?.dateCreated ||
      product?.updatedAt ||
      "",
  }
}

function CustomerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get("category") ?? ""
  const urlQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(urlQuery)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState("all")
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setIsLoading(true)
      setError("")

      const productsData = await PublicApiService.getProducts()
      setAllProducts(Array.isArray(productsData) ? productsData : [])
    } catch (loadError) {
      setError(loadError.message || "Imeshindikana kupata bidhaa.")
      setAllProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const visibleProducts = useMemo(() => {
    return allProducts.filter(isProductVisible)
  }, [allProducts])

  const normalizedProducts = useMemo(() => {
    return visibleProducts.map(normalizeProduct)
  }, [visibleProducts])

  const featuredProducts = useMemo(() => {
    return normalizedProducts
      .filter((product) => product._isFeatured)
      .slice(0, 8)
  }, [normalizedProducts])

  const activeSlideProduct = featuredProducts[activeSlideIndex]

  useEffect(() => {
    setActiveSlideIndex(0)
  }, [featuredProducts.length])

  useEffect(() => {
    if (featuredProducts.length <= 1) return undefined

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) =>
        currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1
      )
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [featuredProducts.length])

  const verifiedVendors = useMemo(() => {
    const vendorsMap = new Map()

    visibleProducts.forEach((product) => {
      if (product.vendor?.id && !vendorsMap.has(product.vendor.id)) {
        vendorsMap.set(product.vendor.id, product.vendor)
      }
    })

    return Array.from(vendorsMap.values())
  }, [visibleProducts])

  const totalOrderClicks = useMemo(() => {
    return visibleProducts.reduce(
      (sum, product) => sum + Number(product.orderClicks || 0),
      0
    )
  }, [visibleProducts])

  const categories = useMemo(() => {
    const uniqueCategories = visibleProducts
      .map((product) => product.category)
      .filter(Boolean)

    return [...new Set(uniqueCategories)]
  }, [visibleProducts])

  const filteredProducts = useMemo(() => {
    const searchText = query.trim().toLowerCase()
    const categoryText = selectedCategory.trim().toLowerCase()

    const base =
      selectedVendorId === "all"
        ? visibleProducts
        : visibleProducts.filter(
            (product) => product.vendor?.id === selectedVendorId
          )

    return base.filter((product) => {
      const productName = product.name?.toLowerCase() || ""
      const category = product.category?.toLowerCase() || ""
      const specs = product.specs?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""
      const storeName = product.vendor?.storeName?.toLowerCase() || ""

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        category.includes(searchText) ||
        specs.includes(searchText) ||
        description.includes(searchText) ||
        storeName.includes(searchText)

      const matchesCategory = !categoryText || category === categoryText

      return matchesSearch && matchesCategory
    })
  }, [visibleProducts, query, selectedCategory, selectedVendorId])

  const hasProducts = filteredProducts.length > 0
  const isSearching = query.trim().length > 0
  const hasCategoryFilter = selectedCategory.trim().length > 0
  const hasVendorFilter = selectedVendorId !== "all"
  const isFiltering = isSearching || hasCategoryFilter || hasVendorFilter
  const hasMarketplaceProducts = visibleProducts.length > 0
  const showFeaturedSection = !isFiltering && featuredProducts.length > 0

  const selectedVendor = verifiedVendors.find(
    (vendor) => vendor.id === selectedVendorId
  )

  function forceAutoScroll(callback) {
    const html = document.documentElement
    const body = document.body

    const previousHtmlBehavior = html.style.scrollBehavior
    const previousBodyBehavior = body.style.scrollBehavior

    html.style.scrollBehavior = "auto"
    body.style.scrollBehavior = "auto"

    callback()

    html.style.scrollBehavior = previousHtmlBehavior
    body.style.scrollBehavior = previousBodyBehavior
  }

  function scrollToProductsInstantly() {
    forceAutoScroll(() => {
      document.getElementById("products-section")?.scrollIntoView({
        behavior: "auto",
        block: "start",
      })
    })
  }

  function updateParams(nextQuery, nextCategory = selectedCategory) {
    const params = {}

    if (nextQuery.trim()) {
      params.q = nextQuery.trim()
    }

    if (nextCategory.trim()) {
      params.category = nextCategory.trim()
    }

    setSearchParams(params)
  }

  function handleSearchChange(event) {
    const value = event.target.value

    setQuery(value)
    updateParams(value)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    updateParams(query)
    setShowMobileSearch(false)
  }

  function clearSearch() {
    setQuery("")

    const params = {}

    if (selectedCategory.trim()) {
      params.category = selectedCategory.trim()
    }

    setSearchParams(params)
  }

  function openCategory(categoryName) {
    updateParams(query, categoryName)
  }

  function clearCategory() {
    const params = {}

    if (query.trim()) {
      params.q = query.trim()
    }

    setSearchParams(params)
  }

  function clearAllFilters() {
    setQuery("")
    setSelectedVendorId("all")
    setSearchParams({})
  }

  function openProduct(product) {
    if (!product) return
    navigate(`/soko?q=${encodeURIComponent(product._name)}`)
  }

  function showPreviousSlide() {
    if (featuredProducts.length <= 1) return

    setActiveSlideIndex((currentIndex) =>
      currentIndex === 0 ? featuredProducts.length - 1 : currentIndex - 1
    )
  }

  function showNextSlide() {
    if (featuredProducts.length <= 1) return

    setActiveSlideIndex((currentIndex) =>
      currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <style>
        {`
          @keyframes clovenetSlideIn {
            from {
              opacity: 0;
              transform: translateX(24px) scale(0.985);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          @keyframes clovenetProgress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }

          .clovenet-slide-in {
            animation: clovenetSlideIn 520ms ease-out both;
          }

          .clovenet-slide-progress {
            animation: clovenetProgress 5200ms linear both;
          }

          @media (max-width: 767px) {
            .customer-products-grid > div {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }
        `}
      </style>

      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo
              title="CloveNet Soko"
              iconSize="md"
              textSize="sm"
              onClick={() => navigate("/")}
            />

            <form
              onSubmit={handleSearchSubmit}
              className={`hidden flex-1 items-center gap-2 rounded-2xl border bg-white px-3 py-2.5 shadow-sm transition md:flex md:max-w-xl ${
                isSearching
                  ? "border-[var(--color-green)] shadow-[0_0_0_3px_rgba(33,197,93,0.12)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <Search size={17} className="shrink-0 text-gray-400" />

              <input
                value={query}
                onChange={handleSearchChange}
                placeholder="Tafuta bidhaa, duka, au specs..."
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400"
              />

              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Futa utafutaji"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                >
                  <X size={14} strokeWidth={2.6} />
                </button>
              )}
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileSearch((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-navy)] shadow-sm transition hover:border-[var(--color-green)] md:hidden"
                aria-label="Fungua sehemu ya kutafuta"
                aria-expanded={showMobileSearch}
                aria-controls="customer-mobile-search"
              >
                {showMobileSearch ? (
                  <X size={19} strokeWidth={2.7} />
                ) : (
                  <Search size={19} strokeWidth={2.7} />
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-navy)] shadow-sm transition hover:bg-[var(--color-bg)]"
                aria-label="Fungua kikapu"
              >
                <ShoppingBag size={19} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/vendor/register")}
                className="hidden rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:bg-[var(--color-green-dark)] hover:text-white md:block"
              >
                Fungua Duka
              </button>
            </div>
          </div>

          {showMobileSearch && (
            <form
              id="customer-mobile-search"
              onSubmit={handleSearchSubmit}
              className={`mt-3 flex items-center gap-2 rounded-2xl border bg-white px-3 py-2.5 shadow-sm transition md:hidden ${
                isSearching
                  ? "border-[var(--color-green)] shadow-[0_0_0_3px_rgba(33,197,93,0.12)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <Search size={17} className="shrink-0 text-gray-400" />

              <input
                autoFocus
                value={query}
                onChange={handleSearchChange}
                placeholder="Tafuta bidhaa au duka..."
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400"
              />

              {isSearching ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Futa utafutaji"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
                >
                  <X size={14} strokeWidth={2.6} />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Tafuta"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-navy)] text-white"
                >
                  <ArrowRight size={16} strokeWidth={2.7} />
                </button>
              )}
            </form>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 md:px-6 md:pb-8">
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
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

        {showFeaturedSection && (
          <section className="mt-5 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-3 shadow-sm md:p-6">
            <div className="mb-3 flex items-center justify-between gap-3 md:mb-4 md:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[11px] font-black text-[var(--color-green-dark)]">
                  <Star size={13} fill="currentColor" strokeWidth={2.7} />
                  Featured Products
                </span>

                <h1 className="mt-3 hidden text-2xl font-black leading-tight text-gray-950 md:block md:text-4xl">
                  Bidhaa zinazopendekezwa
                </h1>

                <p className="mt-2 hidden max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)] md:block">
                  Bidhaa zilizowekwa mbele ili uzione kwa haraka kabla ya
                  kuendelea sokoni.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToProductsInstantly}
                className="hidden items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)] md:inline-flex"
              >
                Angalia Bidhaa Zote
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </div>

            {activeSlideProduct && (
              <>
                <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => openProduct(activeSlideProduct)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        openProduct(activeSlideProduct)
                      }
                    }}
                    className="relative cursor-pointer overflow-hidden rounded-[1.7rem] bg-[var(--color-navy)] p-3 text-white shadow-xl shadow-slate-300/30 md:rounded-[2rem] md:p-6"
                  >
                    <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-green)]/20 blur-2xl" />
                    <div className="absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-[var(--color-green)]/10 blur-3xl" />

                    <div
                      key={activeSlideProduct._id}
                      className="clovenet-slide-in relative z-10 grid gap-3 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-4"
                    >
                      <div className="group relative flex h-48 items-center justify-center overflow-hidden rounded-[1.45rem] bg-white/10 ring-1 ring-white/10 md:h-80 md:rounded-[1.8rem]">
                        {activeSlideProduct._image ? (
                          <img
                            src={activeSlideProduct._image}
                            alt={activeSlideProduct._name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-white/10 text-slate-300">
                            <Package size={50} strokeWidth={1.7} />
                            <p className="mt-3 text-xs font-black">
                              Picha haijawekwa
                            </p>
                          </div>
                        )}

                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-green)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm md:text-[11px]">
                          <BadgeCheck size={12} strokeWidth={2.7} />
                          Pendekezwa
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-slate-200 ring-1 ring-white/10 md:text-[11px]">
                            {activeSlideProduct._category}
                          </span>

                          <span className="hidden items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-200 ring-1 ring-white/10 md:inline-flex">
                            <MapPin size={12} strokeWidth={2.5} />
                            {activeSlideProduct._location}
                          </span>
                        </div>

                        <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight md:mt-4 md:text-5xl">
                          {activeSlideProduct._name}
                        </h2>

                        <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-300 md:mt-2 md:text-sm">
                          {activeSlideProduct._storeName}
                        </p>

                        {activeSlideProduct._specs && (
                          <p className="mt-3 hidden line-clamp-2 text-xs font-semibold leading-5 text-slate-400 md:block">
                            {activeSlideProduct._specs}
                          </p>
                        )}

                        <p className="mt-4 text-2xl font-black text-[var(--color-green)] md:mt-5 md:text-4xl">
                          {formatCurrency(activeSlideProduct._price)}
                        </p>

                        <div className="mt-6 hidden flex-col gap-3 sm:flex-row md:flex">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              openProduct(activeSlideProduct)
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                          >
                            Angalia Bidhaa
                            <ArrowRight size={17} strokeWidth={2.7} />
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              scrollToProductsInstantly()
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                          >
                            Bidhaa Zote
                            <ShoppingBag size={17} strokeWidth={2.7} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>

                  <div className="hidden rounded-[2rem] border border-[var(--color-green)]/40 bg-[var(--color-green-soft)] p-3 md:block md:p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-green-dark)]">
                        Slideshow
                      </p>

                      <p className="text-xs font-black text-[var(--color-green-dark)]">
                        {activeSlideIndex + 1}/{featuredProducts.length}
                      </p>
                    </div>

                    <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1">
                      {featuredProducts.map((product, index) => {
                        const isActive = index === activeSlideIndex

                        return (
                          <button
                            key={product._id}
                            type="button"
                            onClick={() => setActiveSlideIndex(index)}
                            className={`flex items-center gap-3 rounded-[1.5rem] border p-3 text-left transition ${
                              isActive
                                ? "border-[var(--color-green)] bg-white shadow-sm"
                                : "border-transparent bg-transparent hover:bg-white/70"
                            }`}
                          >
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                              {product._image ? (
                                <img
                                  src={product._image}
                                  alt={product._name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package
                                  size={28}
                                  strokeWidth={1.8}
                                  className="text-gray-400"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[var(--color-green)] px-2.5 py-0.5 text-[10px] font-black text-[var(--color-navy)]">
                                  Pendekezwa
                                </span>

                                <span className="truncate text-[10px] font-black text-gray-500">
                                  {product._category}
                                </span>
                              </div>

                              <h3 className="mt-1 truncate text-sm font-black text-gray-950">
                                {product._name}
                              </h3>

                              <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                                {product._storeName}
                              </p>

                              <p className="mt-1 text-sm font-black text-[var(--color-green-dark)]">
                                {formatCurrency(product._price)}
                              </p>
                            </div>

                            <ArrowRight
                              size={18}
                              strokeWidth={2.8}
                              className={
                                isActive
                                  ? "text-[var(--color-green-dark)]"
                                  : "text-gray-400"
                              }
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {featuredProducts.length > 1 && (
                  <div className="mt-4 md:mt-5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        key={activeSlideIndex}
                        className="h-full rounded-full bg-[var(--color-green)] clovenet-slide-progress"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 md:mt-4">
                      <div className="flex gap-2">
                        {featuredProducts.map((product, index) => (
                          <button
                            key={product._id}
                            type="button"
                            onClick={() => setActiveSlideIndex(index)}
                            className={`h-2.5 rounded-full transition ${
                              index === activeSlideIndex
                                ? "w-8 bg-[var(--color-green)]"
                                : "w-2.5 bg-gray-300"
                            }`}
                            aria-label={`Nenda kwenye bidhaa ${index + 1}`}
                          />
                        ))}
                      </div>

                      <div className="hidden items-center gap-2 md:flex">
                        <button
                          type="button"
                          onClick={showPreviousSlide}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-navy)]"
                          aria-label="Bidhaa iliyopita"
                        >
                          <ChevronLeft size={19} strokeWidth={2.8} />
                        </button>

                        <button
                          type="button"
                          onClick={showNextSlide}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white"
                          aria-label="Bidhaa inayofuata"
                        >
                          <ChevronRight size={19} strokeWidth={2.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {!isFiltering && hasMarketplaceProducts && (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-0.5">
            {[
              { icon: Store, value: verifiedVendors.length, label: "Maduka" },
              { icon: Package, value: visibleProducts.length, label: "Bidhaa" },
              { icon: MessageCircle, value: totalOrderClicks, label: "Clicks" },
            ].map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <div>
                    <p className="text-lg font-black leading-tight text-[var(--color-navy)]">
                      {stat.value}
                    </p>

                    <p className="text-[10px] font-bold text-[var(--color-muted)]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              )
            })}

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--color-green)]/30 bg-[var(--color-green-soft)] px-4 py-3">
              <MessageCircle
                size={20}
                strokeWidth={2.5}
                className="text-[var(--color-green-dark)]"
              />

              <p className="text-[11px] font-black text-[var(--color-green-dark)]">
                Order inaendelea WhatsApp
              </p>
            </div>
          </div>
        )}

        {!isSearching && verifiedVendors.length > 0 && (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                Chagua Duka
              </p>

              {selectedVendorId !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedVendorId("all")}
                  className="text-[11px] font-black text-[var(--color-green-dark)] underline-offset-2 hover:underline"
                >
                  Rejesha zote
                </button>
              )}
            </div>

            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setSelectedVendorId("all")}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black transition ${
                  selectedVendorId === "all"
                    ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white shadow-md"
                    : "border-[var(--color-border)] bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag size={16} strokeWidth={2.5} />
                <span>Zote</span>

                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                    selectedVendorId === "all"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {visibleProducts.length}
                </span>
              </button>

              {verifiedVendors.map((vendor) => {
                const count = visibleProducts.filter(
                  (product) => product.vendor?.id === vendor.id
                ).length
                const isSelected = selectedVendorId === vendor.id

                return (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => setSelectedVendorId(vendor.id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-left transition ${
                      isSelected
                        ? "border-[var(--color-green)] bg-[var(--color-green-soft)] shadow-md shadow-green-100"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-green)]/40 hover:bg-[var(--color-green-soft)]/50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-[var(--color-green)]/20 text-[var(--color-green-dark)]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Store size={16} strokeWidth={2.5} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`max-w-[120px] truncate text-[11px] font-black ${
                          isSelected
                            ? "text-[var(--color-green-dark)]"
                            : "text-gray-900"
                        }`}
                      >
                        {vendor.storeName}
                      </p>

                      <p className="text-[10px] font-semibold text-[var(--color-muted)]">
                        {count} bidhaa
                      </p>
                    </div>

                    {isSelected && (
                      <Check
                        size={15}
                        strokeWidth={2.8}
                        className="text-[var(--color-green-dark)]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <section className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                  Categories
                </p>

                <h2 className="mt-1 text-base font-black text-gray-950">
                  Chuja kwa aina
                </h2>
              </div>

              {hasCategoryFilter && (
                <button
                  type="button"
                  onClick={clearCategory}
                  className="rounded-2xl bg-[var(--color-green-soft)] px-3 py-2 text-xs font-black text-[var(--color-green-dark)]"
                >
                  Ondoa filter
                </button>
              )}
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active =
                  selectedCategory.trim().toLowerCase() ===
                  category.trim().toLowerCase()

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => openCategory(category)}
                    className={`shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-black transition ${
                      active
                        ? "border-[var(--color-green)] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg)] text-gray-700 hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                    }`}
                  >
                    {category}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-black text-gray-600 transition hover:bg-gray-50"
              >
                <SlidersHorizontal size={15} strokeWidth={2.5} />
                Zote
              </button>
            </div>
          </section>
        )}

        {isFiltering && (
          <div className="mb-5 mt-5 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  hasProducts
                    ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <Search size={17} strokeWidth={2.6} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-gray-950">
                  {hasProducts
                    ? `${filteredProducts.length} bidhaa zimepatikana`
                    : "Hakuna bidhaa iliyopatikana"}
                </p>

                <p className="truncate text-xs font-semibold text-[var(--color-muted)]">
                  {selectedVendor?.storeName ||
                    selectedCategory ||
                    query ||
                    "Filter imetumika"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-black text-gray-700 transition hover:bg-gray-100"
            >
              Futa
            </button>
          </div>
        )}

        <div
          id="products-section"
          className={isFiltering || !verifiedVendors.length ? "mt-5" : "mt-6"}
        >
          {isLoading ? null : hasProducts ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                    {isSearching
                      ? "Matokeo"
                      : selectedVendorId !== "all"
                        ? selectedVendor?.storeName
                        : selectedCategory || "Bidhaa Sokoni"}
                  </p>

                  <h2 className="mt-0.5 text-xl font-black text-gray-950">
                    {filteredProducts.length} bidhaa{" "}
                    {isFiltering ? "zimepatikana" : "zinapatikana"}
                  </h2>
                </div>

                {hasVendorFilter && !isSearching && (
                  <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-[var(--color-green-soft)] px-3 py-2 ring-1 ring-[var(--color-green)]/20">
                    <Store
                      size={15}
                      strokeWidth={2.5}
                      className="text-[var(--color-green-dark)]"
                    />

                    <span className="max-w-[130px] truncate text-xs font-black text-[var(--color-green-dark)]">
                      {selectedVendor?.storeName}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedVendorId("all")}
                      className="text-[var(--color-green-dark)] hover:opacity-70"
                      aria-label="Ondoa filter ya duka"
                    >
                      <X size={13} strokeWidth={2.8} />
                    </button>
                  </div>
                )}
              </div>

              <div className="customer-products-grid">
                <ProductGrid products={filteredProducts} />
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
              <EmptyState
                icon={<Package size={34} strokeWidth={2.4} />}
                title={
                  isFiltering ? "Hakuna bidhaa kwa sasa" : "Bado hakuna bidhaa"
                }
                description={
                  isFiltering
                    ? "Jaribu filter nyingine au angalia bidhaa zote."
                    : "Fungua duka lako na anza kuweka bidhaa za kuuza."
                }
              >
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  {isFiltering ? (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)]"
                    >
                      Angalia Bidhaa Zote
                      <ArrowRight size={16} strokeWidth={2.7} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/vendor/register")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)]"
                    >
                      Fungua Duka
                      <ArrowRight size={16} strokeWidth={2.7} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-sm font-black text-gray-700"
                  >
                    Rudi Mwanzo
                  </button>
                </div>
              </EmptyState>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav active="soko" />
    </section>
  )
}

export default CustomerPage