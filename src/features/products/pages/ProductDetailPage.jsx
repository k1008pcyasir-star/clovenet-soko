import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  MapPin,
  MessageCircle,
  Package,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import EmptyState from "../../../components/ui/EmptyState"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import { formatMoney } from "../../../utils/formatters"
import { openSingleProductWhatsAppOrder } from "../../../utils/whatsapp"

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hasTrackedView = useRef(false)
  const [added, setAdded] = useState(false)

  const product = useMemo(() => {
    const products = StorageService.getProducts()
    const vendors = StorageService.getVendors()

    const foundProduct = products.find((item) => item.id === id)

    if (!foundProduct) {
      return null
    }

    const vendor = vendors.find((item) => item.id === foundProduct.vendorId)

    return {
      ...foundProduct,
      vendor,
    }
  }, [id])

  useEffect(() => {
    if (!product || hasTrackedView.current) {
      return
    }

    hasTrackedView.current = true

    StorageService.updateProduct(product.id, {
      views: (product.views || 0) + 1,
    })
  }, [product])

  function handleAddToCart() {
    if (!product) return

    StorageService.addToCart(product)
    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  function handleWhatsAppOrder() {
    if (!product) return

    StorageService.recordOrderClick(product)
    openSingleProductWhatsAppOrder(product)
  }

  function openStore() {
    if (!product?.vendor?.id) return
    navigate(`/store/${product.vendor.id}`)
  }

  if (!product) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="mx-auto max-w-4xl px-4 py-8 pb-28 md:px-6 md:pb-8">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <EmptyState
              icon={<SearchX size={34} strokeWidth={2.4} />}
              title="Bidhaa haijapatikana"
              description="Bidhaa unayotafuta haipo au imeondolewa kwenye soko."
            >
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/soko")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                >
                  Rudi Sokoni
                  <ArrowRight size={16} strokeWidth={2.7} />
                </button>
              </div>
            </EmptyState>
          </div>
        </main>

        <MobileBottomNav active="home" />
      </section>
    )
  }

  const hasDiscount = Number(product.oldPrice) > Number(product.price)

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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green-soft)] px-4 py-2.5 text-xs font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green)] hover:text-[var(--color-navy)]"
            aria-label="Fungua kikapu"
          >
            <ShoppingBag size={16} strokeWidth={2.7} />
            Kikapu
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 md:px-6 md:pb-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
            <div className="relative flex aspect-square items-center justify-center bg-[var(--color-bg)] md:aspect-[4/3]">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name || "Bidhaa"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.8rem] bg-white text-[var(--color-navy)] shadow-sm">
                  <Package size={44} strokeWidth={2.2} />
                </div>
              )}

              <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
                <span className="max-w-full truncate rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)] shadow-sm backdrop-blur">
                  {product.category || "Bidhaa"}
                </span>

                {product.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm">
                    <BadgeCheck size={12} strokeWidth={2.7} />
                    Featured
                  </span>
                )}
              </div>

              {hasDiscount && (
                <span className="absolute bottom-4 right-4 rounded-full bg-[var(--color-navy)] px-3 py-1 text-[10px] font-black text-white shadow-sm">
                  Offer
                </span>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                {product.category || "Bidhaa"}
              </span>

              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)]">
                  <BadgeCheck size={12} strokeWidth={2.7} />
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-950 md:text-5xl">
              {product.name || "Bidhaa bila jina"}
            </h1>

            <div className="mt-4">
              <p className="text-3xl font-black text-[var(--color-navy)]">
                {formatMoney(product.price)}
              </p>

              {hasDiscount && (
                <p className="mt-1 text-sm font-semibold text-gray-400 line-through">
                  {formatMoney(product.oldPrice)}
                </p>
              )}
            </div>

            {product.specs && (
              <div className="mt-5 rounded-2xl bg-[var(--color-bg)] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                  Specs
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
                  {product.specs}
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                Description
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                {product.description ||
                  "Hakuna maelezo ya ziada kwa bidhaa hii."}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Duka
                  </p>

                  <button
                    type="button"
                    onClick={openStore}
                    className="mt-2 inline-flex items-center gap-2 text-left text-lg font-black text-gray-950 underline-offset-4 transition hover:text-[var(--color-green-dark)] hover:underline"
                  >
                    <Store size={18} strokeWidth={2.5} />
                    {product.vendor?.storeName || "Vendor"}
                  </button>
                </div>

                {(product.vendor?.status === "verified" ||
                  product.vendor?.isVerified) && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                    <ShieldCheck size={12} strokeWidth={2.7} />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <p className="flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
                  <MapPin
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  {product.vendor?.location || "Location haijawekwa"}
                </p>

                <p className="flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
                  <MessageCircle
                    size={14}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />
                  {product.vendor?.whatsapp || "WhatsApp haijawekwa"}
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  added
                    ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                    : "bg-[var(--color-yellow)] text-[var(--color-navy)] hover:bg-[var(--color-yellow-hover)]"
                }`}
              >
                {added ? (
                  <>
                    <Check size={17} strokeWidth={3} />
                    Imeongezwa Kikapuni
                  </>
                ) : (
                  <>
                    <ShoppingCart size={17} strokeWidth={2.7} />
                    Ongeza Kikapuni
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                <MessageCircle size={17} strokeWidth={2.7} />
                Agiza WhatsApp
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-[var(--color-bg)]"
            >
              <ArrowLeft size={16} strokeWidth={2.7} />
              Rudi Sokoni
            </button>
          </div>
        </div>
      </main>

      <MobileBottomNav active="home" />
    </section>
  )
}

export default ProductDetailPage