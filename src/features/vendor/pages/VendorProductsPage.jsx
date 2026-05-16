import { useMemo, useState } from "react"
import {
  AlertCircle,
  BadgeCheck,
  Check,
  Edit3,
  Eye,
  LockKeyhole,
  Package,
  Plus,
  Save,
  ShoppingBag,
  Store,
  Trash2,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { createId, formatMoney } from "../../../utils/formatters"

const PRODUCT_CATEGORIES = [
  { label: "Laptop & Computer", value: "Laptop" },
  { label: "Simu & Accessories", value: "Simu" },
  { label: "Electronics", value: "Electronics" },
  { label: "Fashion & Clothes", value: "Fashion" },
  { label: "Shoes & Bags", value: "Shoes & Bags" },
  { label: "Beauty & Cosmetics", value: "Beauty & Cosmetics" },
  { label: "Food & Drinks", value: "Food & Drinks" },
  { label: "Home & Furniture", value: "Home & Furniture" },
  { label: "Books & Stationery", value: "Books & Stationery" },
  { label: "Kids & Baby Products", value: "Kids & Baby Products" },
  { label: "Hardware & Tools", value: "Hardware & Tools" },
  { label: "Auto Parts", value: "Auto Parts" },
  { label: "Other / Nyingine", value: "Other" },
]

const initialForm = {
  name: "",
  category: "",
  otherCategory: "",
  price: "",
  oldPrice: "",
  specs: "",
  description: "",
  featured: false,
}

function VendorProductsPage() {
  const [form, setForm] = useState(initialForm)
  const [products, setProducts] = useState(() => StorageService.getProducts())
  const [error, setError] = useState("")

  const vendor = useMemo(() => {
    const vendorId = StorageService.getCurrentVendorId()
    const vendors = StorageService.getVendors()

    return vendors.find((item) => item.id === vendorId) || null
  }, [])

  const vendorProducts = useMemo(() => {
    if (!vendor) return []

    return products.filter((product) => product.vendorId === vendor.id)
  }, [products, vendor])

  const productLimit = Number(vendor?.productLimit || 15)
  const remainingProducts = Math.max(productLimit - vendorProducts.length, 0)
  const hasReachedLimit = vendorProducts.length >= productLimit
  const productUsagePercent = Math.min(
    Math.round((vendorProducts.length / productLimit) * 100),
    100
  )

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" && value !== "Other"
        ? { otherCategory: "" }
        : {}),
    }))

    setError("")
  }

  function getFinalCategory() {
    if (form.category === "Other") {
      return form.otherCategory.trim()
    }

    return form.category.trim()
  }

  function resetForm() {
    setForm(initialForm)
    setError("")
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!vendor) {
      setError("Tafadhali ingia dukani kwanza.")
      return
    }

    if (hasReachedLimit) {
      setError(
        "Umefikia limit ya bidhaa kwa sasa. Tutawezesha kuongeza nafasi zaidi kwenye hatua inayofuata."
      )
      return
    }

    const finalCategory = getFinalCategory()
    const price = Number(form.price)
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : 0

    if (!form.name.trim()) {
      setError("Weka jina la bidhaa.")
      return
    }

    if (!finalCategory) {
      setError("Chagua au andika category ya bidhaa.")
      return
    }

    if (!price || price <= 0) {
      setError("Weka bei sahihi ya bidhaa.")
      return
    }

    if (oldPrice && oldPrice < price) {
      setError("Bei ya zamani isiwe ndogo kuliko bei ya sasa.")
      return
    }

    const newProduct = {
      id: createId("product"),
      vendorId: vendor.id,
      name: form.name.trim(),
      category: finalCategory,
      price,
      oldPrice,
      specs: form.specs.trim(),
      description: form.description.trim(),
      featured: form.featured,
      views: 0,
      orderClicks: 0,
      createdAt: new Date().toISOString(),
    }

    const updatedProducts = [newProduct, ...products]

    setProducts(updatedProducts)
    StorageService.saveProducts(updatedProducts)
    resetForm()
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
              Hatujapata taarifa za duka lako. Ingia kwanza ili uweze kusimamia
              bidhaa zako.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Vendor Products
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Bidhaa za {vendor.storeName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Ongeza, angalia na simamia bidhaa za duka lako. Bidhaa za vendor
              aliyethibitishwa zitaonekana kwenye marketplace.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <Package size={18} strokeWidth={2.6} />
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--color-muted)]">
                  Bidhaa
                </p>

                <p className="text-sm font-black text-gray-950">
                  {vendorProducts.length}/{productLimit}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Product Capacity
              </p>

              <h2 className="mt-1 text-lg font-black text-gray-950">
                {remainingProducts} nafasi baki
              </h2>

              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                Kwa sasa unaweza kuongeza hadi bidhaa {productLimit} kwenye duka
                lako.
              </p>
            </div>

            <div className="w-full md:max-w-xs">
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-bg)]">
                <div
                  className="h-full rounded-full bg-[var(--color-green)] transition-all"
                  style={{ width: `${productUsagePercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs font-black">
                <span className="text-[var(--color-muted)]">
                  {productUsagePercent}% imetumika
                </span>

                <span className="text-[var(--color-green-dark)]">
                  {vendorProducts.length}/{productLimit}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  <Plus size={21} strokeWidth={2.8} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-950">
                    Ongeza bidhaa mpya
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    Jaza taarifa za bidhaa ili ionekane vizuri kwa wateja.
                  </p>
                </div>
              </div>
            </div>

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

            {hasReachedLimit && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={18}
                    strokeWidth={2.6}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>
                    <p className="text-sm font-black text-amber-800">
                      Umefikia limit ya bidhaa kwa sasa.
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-amber-700">
                      Huwezi kuongeza bidhaa mpya kwa sasa. Tutawezesha kuongeza
                      nafasi zaidi kwenye hatua inayofuata.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-black text-gray-700">
                  Jina la bidhaa
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  placeholder="Mfano: HP EliteBook 840 G6"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Category
                </label>

                <select
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Chagua category</option>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {form.category === "Other" && (
                  <input
                    required
                    name="otherCategory"
                    value={form.otherCategory}
                    onChange={handleChange}
                    disabled={hasReachedLimit}
                    placeholder="Andika category ya bidhaa"
                    className="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Bei ya sasa
                </label>

                <input
                  required
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  placeholder="Mfano: 980000"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Bei ya zamani
                </label>

                <input
                  type="number"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  placeholder="Optional"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-700">
                  Specs / Maelezo mafupi
                </label>

                <input
                  name="specs"
                  value={form.specs}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  placeholder="Mfano: Core i5, RAM 8GB, SSD 256GB"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-700">
                  Description
                </label>

                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={hasReachedLimit}
                  rows={3}
                  placeholder="Elezea bidhaa kwa ufupi..."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 ${
                    hasReachedLimit ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-black text-gray-700">
                    <BadgeCheck
                      size={17}
                      strokeWidth={2.6}
                      className="text-[var(--color-green-dark)]"
                    />
                    Weka kama Featured
                  </span>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    disabled={hasReachedLimit}
                    className="h-4 w-4 accent-[var(--color-green)]"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={hasReachedLimit}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} strokeWidth={2.7} />
              Hifadhi Bidhaa
            </button>
          </form>

          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-950">
                  Bidhaa Zangu
                </h2>

                <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
                  Jumla: {vendorProducts.length}
                </p>
              </div>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="mt-6 rounded-[2rem] bg-[var(--color-bg)] p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  <Package size={34} strokeWidth={2.4} />
                </div>

                <h3 className="mt-4 text-lg font-black text-gray-950">
                  Bado hujaongeza bidhaa
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                  Bidhaa utakazoongeza zitaonekana hapa na baadaye kwenye
                  marketplace baada ya duka kuthibitishwa.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {vendorProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                        <Package size={30} strokeWidth={2.3} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-sm font-black text-gray-950">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                              {product.category || "Bidhaa"}
                            </p>
                          </div>

                          {product.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-2.5 py-1 text-[10px] font-black text-[var(--color-navy)]">
                              <Check size={12} strokeWidth={3} />
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-lg font-black text-[var(--color-navy)]">
                          {formatMoney(product.price)}
                        </p>

                        {Number(product.oldPrice) > Number(product.price) && (
                          <p className="mt-0.5 text-xs font-semibold text-gray-400 line-through">
                            {formatMoney(product.oldPrice)}
                          </p>
                        )}

                        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                          {product.specs ||
                            product.description ||
                            "Maelezo hayajawekwa."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled
                            title="Feature hii itaongezwa baadaye"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-black text-gray-400 opacity-70"
                          >
                            <Edit3 size={13} strokeWidth={2.7} />
                            Edit · Inakuja
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={13} strokeWidth={2.7} />
                            Delete
                          </button>

                          <div className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-black text-[var(--color-muted)]">
                            <Eye size={13} strokeWidth={2.7} />
                            {product.views || 0} views
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VendorProductsPage