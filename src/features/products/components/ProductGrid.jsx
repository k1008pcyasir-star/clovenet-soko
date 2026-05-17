import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  Images,
  MessageCircle,
  Package,
  ShoppingCart,
  Store,
  BadgeCheck,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
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

function ProductGrid({ products = [] }) {
  const navigate = useNavigate()
  const [addedProductId, setAddedProductId] = useState("")

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

  function handleWhatsAppOrder(product) {
    StorageService.recordOrderClick(product)
    openSingleProductWhatsAppOrder(product)
  }

  function openProductDetail(productId) {
    if (!productId) return
    navigate(`/product/${productId}`)
  }

  function openStore(vendorId) {
    if (!vendorId) return
    navigate(`/store/${vendorId}`)
  }

  function getProductLabel(product) {
    return product.category || "Bidhaa"
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const isAdded = addedProductId === product.id
        const hasDiscount = Number(product.oldPrice) > Number(product.price)
        const productImages = getProductImages(product)
        const mainImage = productImages[0] || ""
        const hasMultipleImages = productImages.length > 1

        return (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[1.8rem] border border-[var(--color-border)] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--color-green)]/50 hover:shadow-lg"
          >
            <button
              type="button"
              onClick={() => openProductDetail(product.id)}
              className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
              aria-label={`Angalia bidhaa: ${product.name}`}
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--color-bg)]">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name || "Bidhaa"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-[var(--color-navy)] shadow-sm">
                    <Package size={36} strokeWidth={2.2} />
                  </div>
                )}

                <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
                  <span className="max-w-full truncate rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[var(--color-green-dark)] shadow-sm backdrop-blur">
                    {getProductLabel(product)}
                  </span>

                  {product.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-yellow)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm">
                      <BadgeCheck size={12} strokeWidth={2.7} />
                      Featured
                    </span>
                  )}
                </div>

                {hasMultipleImages && (
                  <>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-black text-white shadow-sm backdrop-blur">
                      <Images size={12} strokeWidth={2.7} />
                      1/{productImages.length}
                    </span>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1">
                      {productImages.slice(0, 5).map((image, index) => (
                        <span
                          key={`${image.slice(0, 14)}-${index}`}
                          className={`h-1.5 rounded-full ${
                            index === 0
                              ? "w-4 bg-white"
                              : "w-1.5 bg-white/55"
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

            <div className="p-4">
              <button
                type="button"
                onClick={() => openProductDetail(product.id)}
                className="block w-full rounded-xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                aria-label={`Fungua maelezo ya ${product.name}`}
              >
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-gray-950 transition hover:text-[var(--color-green-dark)]">
                  {product.name || "Bidhaa bila jina"}
                </h3>
              </button>

              <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-5 text-[var(--color-muted)]">
                {product.specs ||
                  product.description ||
                  "Maelezo ya bidhaa hayajawekwa."}
              </p>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black leading-tight text-[var(--color-navy)]">
                    {formatMoney(product.price)}
                  </p>

                  {hasDiscount && (
                    <p className="mt-0.5 text-xs font-semibold text-gray-400 line-through">
                      {formatMoney(product.oldPrice)}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => openStore(product.vendor?.id)}
                className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--color-bg)] px-3 py-1.5 text-[11px] font-black text-gray-700 outline-none transition hover:bg-[var(--color-green-soft)] hover:text-[var(--color-green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                aria-label={`Fungua duka la ${
                  product.vendor?.storeName || "vendor"
                }`}
              >
                <Store size={13} strokeWidth={2.5} className="shrink-0" />

                <span className="truncate">
                  {product.vendor?.storeName || "Vendor"}
                </span>
              </button>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 ${
                    isAdded
                      ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                      : "bg-[var(--color-yellow)] text-[var(--color-navy)] hover:bg-[var(--color-yellow-hover)]"
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
                  className="inline-flex h-full min-h-[2.5rem] items-center justify-center rounded-2xl bg-[var(--color-green)] px-3 text-[var(--color-navy)] outline-none transition hover:bg-[var(--color-green-dark)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
                  aria-label={`Agiza ${product.name || "bidhaa"} kwa WhatsApp`}
                  title="Agiza kwa WhatsApp"
                >
                  <MessageCircle size={18} strokeWidth={2.7} />
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