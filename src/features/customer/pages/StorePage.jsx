import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Gift,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react"

import { PublicApiService } from "../../../services/publicApiService"
import EmptyState from "../../../components/ui/EmptyState"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import ProductGrid from "../../products/components/ProductGrid"

function getWhatsAppLink(phone) {
  if (!phone) return ""

  const cleaned = String(phone).replace(/\D/g, "")

  if (!cleaned) return ""

  if (cleaned.startsWith("255")) {
    return `https://wa.me/${cleaned}`
  }

  if (cleaned.startsWith("0")) {
    return `https://wa.me/255${cleaned.slice(1)}`
  }

  return `https://wa.me/${cleaned}`
}

function StorePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStore()
  }, [id])

  async function loadStore() {
    try {
      setIsLoading(true)
      setError("")

      const storeData = await PublicApiService.getStoreById(id)
      setStore(storeData)
    } catch (loadError) {
      setStore(null)
      setError(loadError.message || "Imeshindikana kupata taarifa za duka.")
    } finally {
      setIsLoading(false)
    }
  }

  const vendor = store

  const products = useMemo(() => {
    if (!store?.products) return []

    return store.products.map((product) => ({
      ...product,
      vendor: {
        id: store.id,
        storeName: store.storeName,
        whatsapp: store.whatsapp,
        location: store.location,
        category: store.category,
        status: store.status,
        isVerified: store.isVerified,
      },
    }))
  }, [store])

  if (isLoading) {
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
                Inapakia duka...
              </p>

              <p className="truncate text-[10px] font-semibold text-[var(--color-muted)]">
                CloveNet Soko
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-3 py-6 pb-28 md:px-6 md:py-8 md:pb-8">
          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-8 shadow-sm md:rounded-[2rem] md:p-10">
            <div className="flex items-center justify-center gap-3 text-sm font-black text-[var(--color-muted)]">
              <Loader2 className="animate-spin" size={20} strokeWidth={2.6} />
              Inapakia taarifa za duka kutoka backend...
            </div>
          </div>
        </main>

        <MobileBottomNav active="stores" />
      </section>
    )
  }

  if (!vendor) {
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
                Duka halijapatikana
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
              icon={<Store size={34} strokeWidth={2.4} />}
              title="Duka halijapatikana"
              description="Duka unalotafuta halipo au limeondolewa kwenye CloveNet Soko."
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

        <MobileBottomNav active="stores" />
      </section>
    )
  }

  const isVerified = vendor.status === "verified" || vendor.isVerified
  const whatsappLink = getWhatsAppLink(vendor.whatsapp)

  return (
    <section className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <style>
        {`
          @media (max-width: 767px) {
            .store-products-grid > div {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }
        `}
      </style>

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
                {vendor.storeName || "Duka la Vendor"}
              </p>

              <p className="truncate text-[10px] font-semibold text-[var(--color-muted)]">
                {vendor.category || "CloveNet Soko"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/soko")}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-xs font-black text-gray-700 transition hover:bg-[var(--color-bg)] md:gap-2 md:px-4"
          >
            <ShoppingBag size={15} strokeWidth={2.7} />
            <span className="hidden sm:inline">Rudi Sokoni</span>
            <span className="sm:hidden">Soko</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-3 py-4 pb-28 md:px-6 md:py-6 md:pb-8">
        <section className="relative overflow-hidden rounded-[1.7rem] bg-[var(--color-navy)] text-white shadow-sm md:rounded-[2rem]">
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

          <div className="relative z-10 p-4 md:p-8">
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10">
                <Store size={13} strokeWidth={2.7} className="shrink-0" />
                <span className="truncate">
                  {vendor.category || "Vendor Store"}
                </span>
              </span>

              {isVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-green)] px-3 py-1 text-[11px] font-black text-[var(--color-navy)]">
                  <ShieldCheck size={13} strokeWidth={2.7} />
                  Verified
                </span>
              )}

              {vendor.trial && (
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-200 ring-1 ring-white/10">
                  <Gift size={13} strokeWidth={2.7} className="shrink-0" />
                  <span className="truncate">
                    {vendor.trialLabel || "Free Trial"}
                  </span>
                </span>
              )}
            </div>

            <h1 className="mt-4 max-w-3xl break-words text-3xl font-black leading-tight md:mt-5 md:text-5xl">
              {vendor.storeName || "Duka la Vendor"}
            </h1>

            <p className="mt-3 max-w-2xl break-words text-sm font-semibold leading-6 text-slate-300">
              {vendor.description || "Duka hili bado halijaweka maelezo."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 md:mt-6">
              <div className="min-w-0 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Location
                </p>

                <p className="mt-2 flex min-w-0 items-center gap-2 text-sm font-black text-white">
                  <MapPin
                    size={16}
                    strokeWidth={2.6}
                    className="shrink-0 text-[var(--color-green)]"
                  />
                  <span className="truncate">
                    {vendor.location || "Haijawekwa"}
                  </span>
                </p>
              </div>

              <div className="min-w-0 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  WhatsApp
                </p>

                <p className="mt-2 flex min-w-0 items-center gap-2 text-sm font-black text-white">
                  <span className="text-base leading-none">💬</span>
                  <span className="truncate">
                    {vendor.whatsapp ? "WhatsApp ipo tayari" : "Haijawekwa"}
                  </span>
                </p>
              </div>

              <div className="min-w-0 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Products
                </p>

                <p className="mt-2 flex min-w-0 items-center gap-2 text-sm font-black text-white">
                  <Package
                    size={16}
                    strokeWidth={2.6}
                    className="shrink-0 text-[var(--color-green)]"
                  />
                  <span>{products.length} bidhaa</span>
                </p>
              </div>
            </div>

            {whatsappLink && (
              <div className="mt-5 flex md:mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white sm:w-auto"
                >
                  <span className="text-base leading-none">💬</span>
                  Wasiliana WhatsApp
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 md:mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Bidhaa za Duka
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950">
                {products.length > 0
                  ? `Bidhaa ${products.length} zinapatikana`
                  : "Bado hakuna bidhaa"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
            >
              Angalia Soko Zima
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>
          </div>

          {products.length > 0 ? (
            <div className="store-products-grid">
              <ProductGrid products={products} />
            </div>
          ) : (
            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:rounded-[2rem] md:p-6">
              <EmptyState
                icon={<Package size={34} strokeWidth={2.4} />}
                title="Duka bado halijaweka bidhaa"
                description="Vendor akiweka bidhaa, zitaonekana hapa kwa wateja."
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
          )}
        </section>
      </main>

      <MobileBottomNav active="stores" />
    </section>
  )
}

export default StorePage