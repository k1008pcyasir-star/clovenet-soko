import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Gift,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import EmptyState from "../../../components/ui/EmptyState"
import MobileBottomNav from "../../../components/layout/MobileBottomNav"
import ProductGrid from "../../products/components/ProductGrid"

function StorePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const storeData = useMemo(() => {
    const vendors = StorageService.getVendors()
    const products = StorageService.getProducts()

    const vendor = vendors.find((item) => item.id === id)

    if (!vendor) {
      return {
        vendor: null,
        products: [],
      }
    }

    const vendorProducts = products
      .filter((product) => product.vendorId === vendor.id)
      .map((product) => ({
        ...product,
        vendor,
      }))

    return {
      vendor,
      products: vendorProducts,
    }
  }, [id])

  const { vendor, products } = storeData

  if (!vendor) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="mx-auto max-w-4xl px-4 py-8 pb-28 md:px-6 md:pb-8">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-[var(--color-bg)]"
          >
            <ShoppingBag size={15} strokeWidth={2.7} />
            Rudi Sokoni
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 md:px-6 md:pb-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-[var(--color-navy)] text-white shadow-sm">
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

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10">
                <Store size={13} strokeWidth={2.7} />
                {vendor.category || "Vendor Store"}
              </span>

              {isVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-green)] px-3 py-1 text-[11px] font-black text-[var(--color-navy)]">
                  <ShieldCheck size={13} strokeWidth={2.7} />
                  Verified
                </span>
              )}

              {vendor.trial && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-200 ring-1 ring-white/10">
                  <Gift size={13} strokeWidth={2.7} />
                  {vendor.trialLabel || "Free Trial"}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
              {vendor.storeName || "Duka la Vendor"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
              {vendor.description || "Duka hili bado halijaweka maelezo."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Location
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-black text-white">
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

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  WhatsApp
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-black text-white">
                  <MessageCircle
                    size={16}
                    strokeWidth={2.6}
                    className="shrink-0 text-[var(--color-green)]"
                  />
                  <span className="truncate">
                    {vendor.whatsapp || "Haijawekwa"}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Products
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-black text-white">
                  <Package
                    size={16}
                    strokeWidth={2.6}
                    className="shrink-0 text-[var(--color-green)]"
                  />
                  <span>{products.length} bidhaa</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
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
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
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