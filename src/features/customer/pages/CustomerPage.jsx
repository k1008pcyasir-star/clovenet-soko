import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Store,
  X,
  Check,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import ProductGrid from "../../products/components/ProductGrid"
import EmptyState from "../../../components/ui/EmptyState"

function CustomerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get("category") ?? ""
  const urlQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(urlQuery)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState("all")

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const verifiedVendors = useMemo(() => {
    return StorageService.getVendors().filter(
      (vendor) => vendor.status === "verified" || vendor.isVerified
    )
  }, [])

  const products = useMemo(() => StorageService.getProducts(), [])

  const allProducts = useMemo(() => {
    return products
      .map((product) => {
        const vendor = verifiedVendors.find(
          (item) => item.id === product.vendorId
        )

        if (!vendor) return null

        return {
          ...product,
          vendor,
        }
      })
      .filter(Boolean)
  }, [products, verifiedVendors])

  const orders = useMemo(() => StorageService.getOrders(), [])

  const categories = useMemo(() => {
    const uniqueCategories = allProducts
      .map((product) => product.category)
      .filter(Boolean)

    return [...new Set(uniqueCategories)]
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    const searchText = query.trim().toLowerCase()
    const categoryText = selectedCategory.trim().toLowerCase()

    const base =
      selectedVendorId === "all"
        ? allProducts
        : allProducts.filter((product) => product.vendor?.id === selectedVendorId)

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
  }, [allProducts, query, selectedCategory, selectedVendorId])

  const hasProducts = filteredProducts.length > 0
  const isSearching = query.trim().length > 0
  const hasCategoryFilter = selectedCategory.trim().length > 0
  const hasVendorFilter = selectedVendorId !== "all"
  const isFiltering = isSearching || hasCategoryFilter || hasVendorFilter
  const hasMarketplaceProducts = allProducts.length > 0

  const selectedVendor = verifiedVendors.find(
    (vendor) => vendor.id === selectedVendorId
  )

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

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex min-w-0 items-center gap-3 rounded-2xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
              aria-label="Rudi ukurasa wa mwanzo"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm">
                <Store size={22} strokeWidth={2.6} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black leading-tight tracking-tight md:text-base">
                  CloveNet Soko
                </p>
              </div>
            </button>

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
        {!isFiltering && (
          <div className="relative mt-5 overflow-hidden rounded-[2rem] bg-[var(--color-navy)] p-6 text-white shadow-2xl shadow-slate-900/20 md:p-10">
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
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-green)]" />
                  Marketplace
                </span>

                {verifiedVendors.length > 0 && (
                  <span className="rounded-full bg-[var(--color-green)]/15 px-3 py-1 text-[11px] font-black text-[var(--color-green)]">
                    {verifiedVendors.length}{" "}
                    {verifiedVendors.length === 1
                      ? "duka limehakikiwa"
                      : "maduka yamehakikiwa"}
                  </span>
                )}
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-[1.15] tracking-tight md:text-5xl">
                {hasMarketplaceProducts ? (
                  <>
                    Bidhaa bora kutoka{" "}
                    <span className="text-[var(--color-green)]">
                      maduka yaliyohakikiwa
                    </span>
                    .
                  </>
                ) : (
                  <>
                    Duka lako la{" "}
                    <span className="text-[var(--color-green)]">
                      WhatsApp
                    </span>{" "}
                    sasa lipo online.
                  </>
                )}
              </h1>

              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-slate-400">
                {hasMarketplaceProducts
                  ? "Tafuta, chagua, na agiza bidhaa moja kwa moja kupitia WhatsApp."
                  : "Fungua duka lako, weka bidhaa, na pokea oda kupitia WhatsApp."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {hasMarketplaceProducts ? (
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("products-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] shadow-lg shadow-green-900/20 transition hover:bg-[var(--color-green-dark)] hover:text-white"
                  >
                    Angalia Bidhaa
                    <ArrowRight size={17} strokeWidth={2.7} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/vendor/register")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] shadow-lg shadow-green-900/20 transition hover:bg-[var(--color-green-dark)] hover:text-white"
                  >
                    Fungua Duka Lako
                    <ArrowRight size={17} strokeWidth={2.7} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  Jinsi inavyofanya kazi
                </button>
              </div>
            </div>
          </div>
        )}

        {!isFiltering && (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-0.5">
            {[
              { icon: Store, value: verifiedVendors.length, label: "Maduka" },
              { icon: Package, value: allProducts.length, label: "Bidhaa" },
              { icon: MessageCircle, value: orders.length, label: "Oda" },
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
                Oda inaenda WhatsApp moja kwa moja
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
                  {allProducts.length}
                </span>
              </button>

              {verifiedVendors.map((vendor) => {
                const count = allProducts.filter(
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
          {hasProducts && (
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
          )}

          {hasProducts ? (
            <ProductGrid products={filteredProducts} />
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

      <MobileBottomNav active="home" />
    </section>
  )
}

export default CustomerPage