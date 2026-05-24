import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BadgeCheck,
  Check,
  Images,
  Loader2,
  Package,
  ShoppingCart,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { vendorApiService } from "../../../services/vendorApiService"
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

function ProductGrid({ products = [] }) {
  const navigate = useNavigate()
  const [addedProductId, setAddedProductId] = useState("")
  const [orderingProductId, setOrderingProductId] = useState("")

  if (!products.length) {
    return null
  }

  function handleAddToCart(product) {
    StorageService.addToCart(product)

    setAddedProductId(product.id)

    window.setTimeout(() => {
      setAddedProductId("")
    }, 1500)
  }

  async function handleWhatsAppOrder(product) {
    if (!product?.id || orderingProductId) return

    const vendorId = getVendorId(product)

    if (!vendorId) {
      alert("Vendor wa bidhaa hii hajapatikana.")
      return
    }

    try {
      setOrderingProductId(product.id)

      await vendorApiService.createOrder({
        vendorId,
        customerName: "WhatsApp Customer",
        customerPhone: "WhatsApp",
        customerLocation: "",
        customerNote:
          "Mteja alibonyeza WhatsApp moja kwa moja kutoka kwenye bidhaa.",
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
      openSingleProductWhatsAppOrder(product)
    } catch (orderError) {
      alert(orderError?.message || "Imeshindikana kuhifadhi order.")
    } finally {
      setOrderingProductId("")
    }
  }

  function openProductDetail(productId) {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  function openStore(product) {
    const vendorId = getVendorId(product)
    if (!vendorId) return
    navigate(`/store/${vendorId}`)
  }

  function getProductLabel(product) {
    return product.category || "Bidhaa"
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
      {products.map((product) => {
        const isAdded = addedProductId === product.id
        const isOrdering = orderingProductId === product.id
        const hasDiscount = Number(product.oldPrice) > Number(product.price)
        const productImages = getProductImages(product)
        const mainImage = productImages[0] || ""
        const hasMultipleImages = productImages.length > 1
        const featured = isProductFeatured(product)

        return (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-green)]/60 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => openProductDetail(product.id)}
              className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
              aria-label={`Angalia bidhaa: ${product.name || "Bidhaa"}`}
            >
              <div className="relative h-36 overflow-hidden bg-gray-100 md:h-48">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name || "Bidhaa"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[var(--color-navy)]">
                    <Package size={38} strokeWidth={1.8} />
                  </div>
                )}

                {featured && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-2.5 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm">
                    <BadgeCheck size={12} strokeWidth={2.7} />
                    Featured
                  </span>
                )}

                {hasMultipleImages && (
                  <>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-black text-white shadow-sm backdrop-blur">
                      <Images size={12} strokeWidth={2.7} />
                      1/{productImages.length}
                    </span>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1">
                      {productImages.slice(0, 5).map((image, index) => (
                        <span
                          key={`${String(image).slice(0, 14)}-${index}`}
                          className={`h-1.5 rounded-full ${
                            index === 0 ? "w-4 bg-white" : "w-1.5 bg-white/55"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {hasDiscount && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-[var(--color-navy)] px-3 py-1 text-[10px] font-black text-white shadow-sm">
                    Offer
                  </span>
                )}
              </div>
            </button>

            <div className="p-3 md:p-4">
              <span className="inline-flex max-w-full rounded-full bg-[var(--color-green-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                <span className="truncate">{getProductLabel(product)}</span>
              </span>

              <button
                type="button"
                onClick={() => openProductDetail(product.id)}
                className="mt-3 block w-full rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                aria-label={`Fungua maelezo ya ${product.name || "bidhaa"}`}
              >
                <h3 className="line-clamp-1 text-sm font-black text-gray-950 transition hover:text-[var(--color-green-dark)] md:text-base">
                  {product.name || "Bidhaa bila jina"}
                </h3>
              </button>

              <button
                type="button"
                onClick={() => openStore(product)}
                className="mt-1 block max-w-full text-left text-xs font-semibold text-[var(--color-muted)] outline-none transition hover:text-[var(--color-green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                aria-label={`Fungua duka la ${
                  product.vendor?.storeName || "vendor"
                }`}
              >
                <span className="block truncate">
                  {product.vendor?.storeName || "Vendor"}
                </span>
              </button>

              <div className="mt-3">
                <p className="truncate text-base font-black leading-tight text-[var(--color-green-dark)] md:text-lg">
                  {formatMoney(product.price)}
                </p>

                {hasDiscount && (
                  <p className="mt-0.5 text-xs font-semibold text-gray-400 line-through">
                    {formatMoney(product.oldPrice)}
                  </p>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`inline-flex min-h-[2.65rem] items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2.5 text-[11px] font-black outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 md:text-xs ${
                    isAdded
                      ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={15} strokeWidth={3} />
                      Imeongezwa
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={15} strokeWidth={2.7} />
                      Kikapuni
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder(product)}
                  disabled={isOrdering}
                  className="inline-flex min-h-[2.65rem] items-center justify-center gap-1.5 rounded-2xl bg-[#25D366] px-2.5 py-2.5 text-[11px] font-black text-white outline-none transition hover:bg-[#1FAF55] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 md:text-xs"
                  aria-label={`Agiza ${product.name || "bidhaa"} kwa WhatsApp`}
                  title="Agiza kwa WhatsApp"
                >
                  {isOrdering ? (
                    <Loader2
                      size={16}
                      strokeWidth={2.7}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      <span className="text-sm leading-none">💬</span>
                      WhatsApp
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ProductGrid