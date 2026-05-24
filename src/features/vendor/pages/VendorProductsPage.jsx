import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  BadgeCheck,
  Check,
  Edit3,
  Eye,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"

import { vendorApiService } from "../../../services/vendorApiService"
import { formatMoney } from "../../../utils/formatters"

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
  images: [],
}

const MAX_IMAGE_WIDTH = 900
const IMAGE_QUALITY = 0.75

function formatPriceInput(value) {
  const digits = String(value || "").replace(/\D/g, "")

  if (!digits) return ""

  return Number(digits).toLocaleString("en-US")
}

function parseMoneyValue(value) {
  const digits = String(value || "").replace(/\D/g, "")

  if (!digits) return 0

  return Number(digits)
}

function getProductId(product) {
  return product?.id || product?.product_id || ""
}

function getVendorId(product) {
  return product?.vendorId || product?.vendor_id || ""
}

function getOldPrice(product) {
  return product?.oldPrice || product?.old_price || 0
}

function getProductImages(product) {
  if (Array.isArray(product?.images)) {
    return product.images.filter(Boolean)
  }

  if (product?.image) {
    return [product.image]
  }

  if (product?.image_url) {
    return [product.image_url]
  }

  return []
}

function getImageLimitByVendor(vendor) {
  if (!vendor) return 3

  const plan = vendor.plan || "free"

  if (plan === "free") {
    return 3
  }

  return 5
}

function getFeaturedLimitByVendor(vendor) {
  if (!vendor) return 1

  const plan = vendor.plan || "free"

  if (plan === "free") return 1
  if (plan === "basic") return 3
  if (plan === "pro") return 5
  if (plan === "business") return 10

  return 1
}

function getCategoryFormValue(category) {
  const exists = PRODUCT_CATEGORIES.some((item) => item.value === category)

  if (!category) return ""
  if (exists) return category

  return "Other"
}

function buildFormFromProduct(product) {
  const categoryValue = getCategoryFormValue(product?.category || "")
  const productImages = getProductImages(product)
  const oldPrice = getOldPrice(product)

  return {
    name: product?.name || "",
    category: categoryValue,
    otherCategory:
      product?.category && categoryValue === "Other" ? product.category : "",
    price: product?.price ? formatPriceInput(product.price) : "",
    oldPrice: oldPrice ? formatPriceInput(oldPrice) : "",
    specs: product?.specs || "",
    description: product?.description || "",
    featured: Boolean(product?.featured),
    images: productImages,
  }
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File si picha sahihi."))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        const scale = Math.min(MAX_IMAGE_WIDTH / image.width, 1)
        const canvas = document.createElement("canvas")

        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)

        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        const compressedImage = canvas.toDataURL("image/jpeg", IMAGE_QUALITY)
        resolve(compressedImage)
      }

      image.onerror = () => {
        reject(new Error("Picha imeshindwa kusomwa."))
      }

      image.src = reader.result
    }

    reader.onerror = () => {
      reject(new Error("Imeshindikana kusoma picha."))
    }

    reader.readAsDataURL(file)
  })
}

function VendorProductsPage() {
  const [form, setForm] = useState(initialForm)
  const [products, setProducts] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingProductId, setEditingProductId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const vendor = useMemo(() => {
    return vendorApiService.getCurrentVendor()
  }, [])

  const vendorProducts = useMemo(() => {
    return Array.isArray(products) ? products : []
  }, [products])

  const isEditing = Boolean(editingProductId)
  const productLimit = Number(vendor?.productLimit || vendor?.product_limit || 15)
  const imageLimit = getImageLimitByVendor(vendor)
  const featuredLimit = getFeaturedLimitByVendor(vendor)

  const currentFeaturedCount = vendorProducts.filter((product) => {
    const productId = getProductId(product)

    if (isEditing && productId === editingProductId) {
      return false
    }

    return Boolean(product.featured)
  }).length

  const remainingProducts = Math.max(productLimit - vendorProducts.length, 0)
  const hasReachedLimit = !isEditing && vendorProducts.length >= productLimit
  const productUsagePercent = Math.min(
    Math.round((vendorProducts.length / productLimit) * 100),
    100
  )

  async function loadVendorProducts() {
    try {
      setIsLoading(true)
      setError("")

      const data = await vendorApiService.getVendorProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError?.message || "Imeshindikana kupakia bidhaa.")
    } finally {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    if (vendor) {
      loadVendorProducts()
    } else {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }, [vendor])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    const nextValue =
      name === "price" || name === "oldPrice" ? formatPriceInput(value) : value

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : nextValue,
      ...(name === "category" && value !== "Other"
        ? { otherCategory: "" }
        : {}),
    }))

    setError("")
    setSuccess("")
  }

  async function handleImageUpload(event) {
    const selectedFiles = Array.from(event.target.files || [])

    if (!selectedFiles.length) return

    const remainingSlots = imageLimit - form.images.length

    if (remainingSlots <= 0) {
      setError(`Kwa sasa unaweza kuweka hadi picha ${imageLimit} kwa bidhaa.`)
      event.target.value = ""
      return
    }

    const filesToProcess = selectedFiles.slice(0, remainingSlots)

    try {
      const compressedImages = await Promise.all(
        filesToProcess.map((file) => compressImage(file))
      )

      setForm((current) => ({
        ...current,
        images: [...current.images, ...compressedImages],
      }))

      if (selectedFiles.length > remainingSlots) {
        setError(`Umezidisha picha. Tumepokea picha ${remainingSlots} tu.`)
      } else {
        setError("")
      }
    } catch (uploadError) {
      setError(uploadError.message || "Imeshindikana kupakia picha.")
    } finally {
      event.target.value = ""
    }
  }

  function removeImage(indexToRemove) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove),
    }))

    setError("")
    setSuccess("")
  }

  function getFinalCategory() {
    if (form.category === "Other") {
      return form.otherCategory.trim()
    }

    return form.category.trim()
  }

  function resetForm() {
    setForm(initialForm)
    setEditingProductId("")
    setError("")
  }

  function validateProductForm() {
    const finalCategory = getFinalCategory()
    const price = parseMoneyValue(form.price)
    const oldPrice = parseMoneyValue(form.oldPrice)

    if (!form.name.trim()) {
      setError("Weka jina la bidhaa.")
      return null
    }

    if (!finalCategory) {
      setError("Chagua au andika category ya bidhaa.")
      return null
    }

    if (!price || price <= 0) {
      setError("Weka bei sahihi ya bidhaa.")
      return null
    }

    if (oldPrice && oldPrice < price) {
      setError("Bei ya zamani isiwe ndogo kuliko bei ya sasa.")
      return null
    }

    if (form.featured && currentFeaturedCount >= featuredLimit) {
      setError(
        `Plan yako ya sasa inaruhusu featured product ${featuredLimit} tu. Upgrade plan kuongeza featured products zaidi.`
      )
      return null
    }

    return {
      finalCategory,
      price,
      oldPrice,
    }
  }

  async function handleSubmit(event) {
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

    const validated = validateProductForm()

    if (!validated) return

    const { finalCategory, price, oldPrice } = validated
    const productImages = form.images.slice(0, imageLimit)

    const payload = {
      name: form.name.trim(),
      category: finalCategory,
      price,
      oldPrice,
      specs: form.specs.trim(),
      description: form.description.trim(),
      featured: form.featured,
      image: productImages[0] || "",
      images: productImages,
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      if (isEditing) {
        await vendorApiService.updateVendorProduct(editingProductId, payload)
        setSuccess("Mabadiliko ya bidhaa yamehifadhiwa.")
      } else {
        await vendorApiService.createVendorProduct(payload)
        setSuccess("Bidhaa imehifadhiwa kikamilifu.")
      }

      resetForm()
      await loadVendorProducts()
    } catch (saveError) {
      setError(saveError?.message || "Imeshindikana kuhifadhi bidhaa.")
    } finally {
      setIsSaving(false)
    }
  }

  function startEditProduct(product) {
    const productId = getProductId(product)

    if (!productId) {
      setError("Bidhaa hii haina ID sahihi.")
      return
    }

    if (getVendorId(product) && vendor?.id && getVendorId(product) !== vendor.id) {
      setError("Huwezi ku-edit bidhaa ya vendor mwingine.")
      return
    }

    setEditingProductId(productId)
    setForm(buildFormFromProduct(product))
    setError("")
    setSuccess("")

    window.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }

  function cancelEdit() {
    resetForm()
    setSuccess("")
  }

  async function deleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Una uhakika unataka kufuta bidhaa hii? Hatua hii haiwezi kurudishwa."
    )

    if (!confirmDelete) {
      return
    }

    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      await vendorApiService.deleteVendorProduct(productId)

      if (editingProductId === productId) {
        resetForm()
      }

      setSuccess("Bidhaa imefutwa.")
      await loadVendorProducts()
    } catch (deleteError) {
      setError(deleteError?.message || "Imeshindikana kufuta bidhaa.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading && !hasLoaded) {
    return null
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
              Bidhaa za {vendor.storeName || vendor.store_name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Ongeza, angalia, edit na simamia bidhaa za duka lako. Bidhaa za
              vendor aliyethibitishwa zitaonekana kwenye marketplace.
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
                Kwa sasa unaweza kuongeza hadi bidhaa {productLimit}. Kila
                bidhaa inaweza kuwa na picha hadi {imageLimit}.
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
                <Check
                  size={18}
                  strokeWidth={3}
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

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  {isEditing ? (
                    <Edit3 size={21} strokeWidth={2.8} />
                  ) : (
                    <Plus size={21} strokeWidth={2.8} />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-950">
                    {isEditing ? "Edit bidhaa" : "Ongeza bidhaa mpya"}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    {isEditing
                      ? "Badilisha taarifa za bidhaa, kisha hifadhi mabadiliko."
                      : "Jaza taarifa za bidhaa ili ionekane vizuri kwa wateja."}
                  </p>
                </div>
              </div>
            </div>

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
                      Huwezi kuongeza bidhaa mpya kwa sasa. Lakini unaweza
                      ku-edit bidhaa ulizoweka tayari.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-700">
                  Picha za bidhaa
                </label>

                <div className="mt-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <label
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-4 py-5 text-center shadow-sm transition hover:bg-[var(--color-green-soft)] ${
                      hasReachedLimit || form.images.length >= imageLimit
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={
                        hasReachedLimit ||
                        form.images.length >= imageLimit ||
                        isSaving
                      }
                      className="hidden"
                    />

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                      <ImagePlus size={24} strokeWidth={2.6} />
                    </div>

                    <p className="mt-3 text-sm font-black text-gray-950">
                      Chagua picha za bidhaa
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                      Unaweza kuweka hadi picha {imageLimit}. Picha ya kwanza
                      ndiyo itaonekana kama picha kuu.
                    </p>
                  </label>

                  {form.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {form.images.map((image, index) => (
                        <div
                          key={`${image.slice(0, 20)}-${index}`}
                          className="group relative overflow-hidden rounded-2xl bg-white shadow-sm"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={isSaving}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Ondoa picha"
                          >
                            <X size={14} strokeWidth={2.8} />
                          </button>

                          {index === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[var(--color-green)] px-2 py-0.5 text-[9px] font-black text-[var(--color-navy)]">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs font-black">
                    <span className="text-[var(--color-muted)]">
                      {form.images.length}/{imageLimit} picha
                    </span>

                    {form.images.length >= imageLimit && (
                      <span className="text-[var(--color-green-dark)]">
                        Limit imefikiwa
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Jina la bidhaa
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={hasReachedLimit || isSaving}
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
                  disabled={hasReachedLimit || isSaving}
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
                    disabled={hasReachedLimit || isSaving}
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
                  type="text"
                  inputMode="numeric"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  disabled={hasReachedLimit || isSaving}
                  placeholder="Mfano: 980,000"
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700">
                  Bei ya zamani
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  disabled={hasReachedLimit || isSaving}
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
                  disabled={hasReachedLimit || isSaving}
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
                  disabled={hasReachedLimit || isSaving}
                  rows={3}
                  placeholder="Elezea bidhaa kwa ufupi..."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 ${
                    hasReachedLimit || isSaving
                      ? "cursor-not-allowed opacity-60"
                      : ""
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
                    disabled={hasReachedLimit || isSaving}
                    className="h-4 w-4 accent-[var(--color-green)]"
                  />
                </label>

                <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                  Plan yako ya sasa inaruhusu featured product {featuredLimit}.
                  Umetumia {currentFeaturedCount}/{featuredLimit}.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={hasReachedLimit || isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2
                    size={17}
                    strokeWidth={2.7}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <Save size={16} strokeWidth={2.7} />
                    {isEditing ? "Hifadhi Mabadiliko" : "Hifadhi Bidhaa"}
                  </>
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={16} strokeWidth={2.7} />
                  Cancel Edit
                </button>
              )}
            </div>
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
                {vendorProducts.map((product) => {
                  const productId = getProductId(product)
                  const productImages = getProductImages(product)
                  const mainImage = productImages[0] || ""
                  const activeEditing = editingProductId === productId
                  const oldPrice = getOldPrice(product)

                  return (
                    <article
                      key={productId}
                      className={`rounded-2xl border p-4 transition ${
                        activeEditing
                          ? "border-[var(--color-green)] bg-[var(--color-green-soft)]/45"
                          : "border-[var(--color-border)] bg-[var(--color-bg)]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={30} strokeWidth={2.3} />
                          )}

                          {productImages.length > 1 && (
                            <span className="absolute bottom-1 right-1 rounded-full bg-black/65 px-2 py-0.5 text-[9px] font-black text-white">
                              {productImages.length}
                            </span>
                          )}
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

                          {Number(oldPrice) > Number(product.price) && (
                            <p className="mt-0.5 text-xs font-semibold text-gray-400 line-through">
                              {formatMoney(oldPrice)}
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
                              onClick={() => startEditProduct(product)}
                              disabled={isSaving}
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                activeEditing
                                  ? "border-[var(--color-green)] bg-white text-[var(--color-green-dark)]"
                                  : "border-[var(--color-border)] bg-white text-gray-700 hover:bg-[var(--color-green-soft)] hover:text-[var(--color-green-dark)]"
                              }`}
                            >
                              <Edit3 size={13} strokeWidth={2.7} />
                              {activeEditing ? "Editing" : "Edit"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteProduct(productId)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 size={13} strokeWidth={2.7} />
                              Delete
                            </button>

                            <div className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-black text-[var(--color-muted)]">
                              <Eye size={13} strokeWidth={2.7} />
                              {product.views || 0} views
                            </div>
                          </div>

                          {(product.updatedAt || product.updated_at) && (
                            <p className="mt-2 text-[10px] font-bold text-[var(--color-muted)]">
                              Updated recently
                            </p>
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
      </div>
    </section>
  )
}

export default VendorProductsPage