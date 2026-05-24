import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { PublicApiService } from "../../../services/publicApiService"
import { vendorApiService } from "../../../services/vendorApiService"
import EmptyState from "../../../components/ui/EmptyState"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import { formatMoney } from "../../../utils/formatters"
import { openSingleProductWhatsAppOrder } from "../../../utils/whatsapp"

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

function getVendorId(product) {
  return product.vendorId || product.vendor?.id || ""
}

function isProductFeatured(product) {
  return Boolean(
    product?.isFeatured ||
      product?.featured ||
      product?.is_featured ||
      product?.featuredProduct
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isOrdering, setIsOrdering] = useState(false)

  useEffect(() => {
    setActiveImageIndex(0)
    loadProduct()
  }, [id])

  async function loadProduct() {
    try {
      setIsLoading(true)
      setError("")

      const productData = await PublicApiService.getProductById(id)
      setProduct(productData)
    } catch (loadError) {
      setProduct(null)
      setError(loadError.message || "Imeshindikana kupata bidhaa.")
    } finally {
      setIsLoading(false)
    }
  }

  const productImages = useMemo(() => getProductImages(product), [product])
  const activeImage = productImages[activeImageIndex] || ""

  function handleAddToCart() {
    if (!product) return

    StorageService.addToCart(product)
    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  function handleAddToCartAndGoToCart() {
    if (!product) return

    StorageService.addToCart(product)
    navigate("/cart")
  }

  async function handleWhatsAppOrder() {
    if (!product || isOrdering) return

    const vendorId = getVendorId(product)

    if (!vendorId) {
      setError("Vendor wa bidhaa hii hajapatikana.")
      return
    }

    try {
      setIsOrdering(true)
      setError("")

      await vendorApiService.createOrder({
        vendorId,
        customerName: "WhatsApp Customer",
        customerPhone: "WhatsApp",
        customerLocation: "",
        customerNote:
          "Mteja alibonyeza WhatsApp moja kwa moja kutoka kwenye product detail.",
        whatsappSent: true,
        orderSource: "quick_whatsapp",
        items: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      })

      StorageService.recordOrderClick(product)

      setProduct((currentProduct) => {
        if (!currentProduct) return currentProduct

        return {
          ...currentProduct,
          orderClicks: Number(currentProduct.orderClicks || 0) + 1,
        }
      })

      openSingleProductWhatsAppOrder(product)
    } catch (orderError) {
      setError(orderError?.message || "Imeshindikana kuhifadhi order.")
    } finally {
      setIsOrdering(false)
    }
  }

  function openStore() {
    const vendorId = getVendorId(product)
    if (!vendorId) return
    navigate(`/store/${vendorId}`)
  }

  function goToPreviousImage() {
    if (productImages.length <= 1) return

    setActiveImageIndex((current) =>
      current === 0 ? productImages.length - 1 : current - 1
    )
  }

  function goToNextImage() {
    if (productImages.length <= 1) return

    setActiveImageIndex((current) =>
      current === productImages.length - 1 ? 0 : current + 1
    )
  }

  if (isLoading) {
    return null
  }

  if (!product) {
    return (
      <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 md:px-6">
            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm transition hover:bg-[var(--color-navy-soft)] md:h-11 md:w-11"
              aria-label="Rudi sokoni"
            >
              <ArrowLeft size={21} strokeWidth={2.7} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-black leading-tight text-gray-950 md:text-base">
                Bidhaa haijapatikana
              </p>

              <p className="truncate text-[10px] font-semibold text-[var(--color-muted)]">
                CloveNet Soko
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-3 py-6 pb-28 md:px-6 md:py-8 md:pb-8">
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

          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:rounded-[2rem] md:p-6">
            <EmptyState
              icon={<SearchX size={34} strokeWidth={2.4} />}
              title="Bidhaa haijapatikana"
              description="Bidhaa unayotafuta haipo au imeondolewa kwenye soko."
            >
              <button
                type="button"
                onClick={() => navigate("/soko")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Rudi Sokoni
                <ArrowRight size={16} strokeWidth={2.7} />
              </button>
            </EmptyState>
          </div>
        </main>

        <MobileBottomNav active="soko" />
      </section>
    )
  }

  const hasDiscount = Number(product.oldPrice) > Number(product.price)
  const hasMultipleImages = productImages.length > 1
  const vendorIsVerified =
    product.vendor?.status === "verified" || product.vendor?.isVerified
  const featured = isProductFeatured(product)

  return (
    <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 md:px-6">
          <button
            type="button"
            onClick={() => navigate("/soko")}
            className="flex min-w-0 items-center gap-2 rounded-2xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 md:gap-3"
            aria-label="Rudi sokoni"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm md:h-11 md:w-11">
              <ArrowLeft size={21} strokeWidth={2.7} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black leading-tight text-gray-950 md:text-base">
                Maelezo ya Bidhaa
              </p>

              <p className="truncate text-[10px] font-semibold text-[var(--color-muted)]">
                CloveNet Soko
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[var(--color-green-soft)] px-3 py-2.5 text-xs font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green)] hover:text-[var(--color-navy)] md:gap-2 md:px-4"
            aria-label="Fungua kikapu"
          >
            <ShoppingBag size={16} strokeWidth={2.7} />
            Kikapu
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-3 py-4 pb-28 md:px-6 md:py-6 md:pb-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 md:mb-5">
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

        <div className="grid min-w-0 gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:gap-5">
          <div className="min-w-0 overflow-hidden rounded-[1.55rem] border border-[var(--color-border)] bg-white shadow-sm md:rounded-[2rem]">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gray-100 md:aspect-[4/3]">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name || "Bidhaa"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-[var(--color-navy)] shadow-sm md:h-24 md:w-24 md:rounded-[1.8rem]">
                  <Package size={40} strokeWidth={2.2} />
                </div>
              )}

              <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 md:left-4 md:top-4 md:max-w-[calc(100%-2rem)]">
                <span className="max-w-full truncate rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)] shadow-sm backdrop-blur">
                  {product.category || "Bidhaa"}
                </span>

                {featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm">
                    <BadgeCheck size={12} strokeWidth={2.7} />
                    Featured
                  </span>
                )}
              </div>

              {hasDiscount && (
                <span className="absolute bottom-3 right-3 rounded-full bg-[var(--color-navy)] px-3 py-1 text-[10px] font-black text-white shadow-sm md:bottom-4 md:right-4">
                  Offer
                </span>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-navy)] shadow-sm backdrop-blur transition hover:bg-white md:left-3 md:h-10 md:w-10"
                    aria-label="Picha iliyopita"
                  >
                    <ChevronLeft size={21} strokeWidth={2.8} />
                  </button>

                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-navy)] shadow-sm backdrop-blur transition hover:bg-white md:right-3 md:h-10 md:w-10"
                    aria-label="Picha inayofuata"
                  >
                    <ChevronRight size={21} strokeWidth={2.8} />
                  </button>

                  <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-black text-white shadow-sm md:bottom-4 md:left-4">
                    {activeImageIndex + 1}/{productImages.length}
                  </span>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="border-t border-[var(--color-border)] bg-white p-3 md:p-4">
                <div className="mb-3 flex items-center justify-center gap-1.5">
                  {productImages.map((image, index) => (
                    <button
                      key={`${String(image).slice(0, 18)}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        activeImageIndex === index
                          ? "w-6 bg-[var(--color-green)]"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Fungua picha ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
                  {productImages.map((image, index) => (
                    <button
                      key={`${String(image).slice(0, 24)}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border bg-[var(--color-bg)] transition ${
                        activeImageIndex === index
                          ? "border-[var(--color-green)] ring-2 ring-[var(--color-green)]/25"
                          : "border-[var(--color-border)] hover:border-[var(--color-green)]"
                      }`}
                      aria-label={`Chagua picha ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name || "Bidhaa"} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 rounded-[1.55rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:rounded-[2rem] md:p-7">
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <span className="max-w-full truncate rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                {product.category || "Bidhaa"}
              </span>

              {featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)]">
                  <BadgeCheck size={12} strokeWidth={2.7} />
                  Featured
                </span>
              )}

              {hasMultipleImages && (
                <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-[10px] font-black text-gray-500">
                  Picha {productImages.length}
                </span>
              )}
            </div>

            <h1 className="mt-4 break-words text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              {product.name || "Bidhaa bila jina"}
            </h1>

            <button
              type="button"
              onClick={openStore}
              className="mt-2 inline-flex max-w-full items-center gap-1.5 text-left text-sm font-semibold text-[var(--color-muted)] outline-none transition hover:text-[var(--color-green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
            >
              <Store size={15} strokeWidth={2.5} className="shrink-0" />
              <span className="truncate">
                {product.vendor?.storeName || "Vendor"}
              </span>
            </button>

            <div className="mt-5">
              <p className="break-words text-3xl font-black text-[var(--color-green-dark)] md:text-4xl">
                {formatMoney(product.price)}
              </p>

              {hasDiscount && (
                <p className="mt-1 text-sm font-semibold text-gray-400 line-through">
                  {formatMoney(product.oldPrice)}
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`inline-flex min-h-[3rem] min-w-0 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 md:px-4 ${
                  added
                    ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
                }`}
              >
                {added ? (
                  <>
                    <Check size={17} strokeWidth={3} />
                    <span className="truncate">Imeongezwa</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={17} strokeWidth={2.7} />
                    <span className="truncate">Kikapuni</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                disabled={isOrdering}
                className="inline-flex min-h-[3rem] min-w-0 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-3 text-sm font-black text-white transition hover:bg-[#1FAF55] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 md:px-4"
                aria-label={`Agiza ${product.name || "bidhaa"} kwa WhatsApp`}
                title="Agiza kwa WhatsApp"
              >
                <span className="text-base leading-none">💬</span>
                <span className="truncate">WhatsApp</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCartAndGoToCart}
              className="mt-3 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)]"
            >
              <ShoppingBag size={16} strokeWidth={2.7} />
              <span className="truncate">Nenda Kikapuni</span>
            </button>

            {(product.specs || product.description) && (
              <div className="mt-5 grid min-w-0 gap-3 md:mt-6 md:gap-4">
                {product.specs && (
                  <div className="min-w-0 rounded-2xl bg-[var(--color-bg)] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                      Specs
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold leading-6 text-gray-700">
                      {product.specs}
                    </p>
                  </div>
                )}

                <div className="min-w-0 rounded-2xl bg-[var(--color-bg)] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Description
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--color-muted)]">
                    {product.description ||
                      "Hakuna maelezo ya ziada kwa bidhaa hii."}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:mt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Duka
                  </p>

                  <button
                    type="button"
                    onClick={openStore}
                    className="mt-2 inline-flex max-w-full items-center gap-2 text-left text-base font-black text-gray-950 underline-offset-4 transition hover:text-[var(--color-green-dark)] hover:underline md:text-lg"
                  >
                    <Store size={18} strokeWidth={2.5} className="shrink-0" />
                    <span className="truncate">
                      {product.vendor?.storeName || "Vendor"}
                    </span>
                  </button>
                </div>

                {vendorIsVerified && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                    <ShieldCheck size={12} strokeWidth={2.7} />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
                  <MapPin
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  <span className="truncate">
                    {product.vendor?.location || "Location haijawekwa"}
                  </span>
                </p>

                <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
                  <span className="text-sm leading-none">💬</span>
                  <span className="truncate">
                    {product.vendor?.whatsapp
                      ? "WhatsApp ipo tayari kwa oda"
                      : "WhatsApp haijawekwa"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={openStore}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-xs font-black text-gray-700 transition hover:bg-[var(--color-green-soft)] hover:text-[var(--color-green-dark)]"
              >
                Angalia Duka
                <ArrowRight size={14} strokeWidth={2.7} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="mt-3 inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-[var(--color-bg)]"
            >
              <ArrowLeft size={16} strokeWidth={2.7} />
              <span className="truncate">Rudi Sokoni</span>
            </button>
          </div>
        </div>
      </main>

      <MobileBottomNav active="soko" />
    </section>
  )
}

export default ProductDetailPage