import { formatMoney, normalizePhone } from "./formatters"

const cleanWhatsAppPhone = (phone) => {
  return normalizePhone(phone)
}

const safeNumber = (value, fallback = 0) => {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

export const buildWhatsAppOrderMessage = ({ vendor, items = [], products = [] }) => {
  const lines = items
    .map((item, index) => {
      const product = products.find((productItem) => productItem.id === item.productId)

      if (!product) {
        return null
      }

      const quantity = safeNumber(item.quantity, 1)
      const price = safeNumber(product.price)
      const lineTotal = price * quantity

      return `${index + 1}. ${product.name} — ${formatMoney(price)} x ${quantity} = ${formatMoney(lineTotal)}`
    })
    .filter(Boolean)

  const total = items.reduce((sum, item) => {
    const product = products.find((productItem) => productItem.id === item.productId)

    if (!product) {
      return sum
    }

    return sum + safeNumber(product.price) * safeNumber(item.quantity, 1)
  }, 0)

  return `Habari ${vendor?.storeName || "Vendor"}, nahitaji kuagiza bidhaa hizi kutoka CloveNet Soko:

${lines.join("\n")}

Jumla: ${formatMoney(total)}

Tafadhali nisaidie upatikanaji na delivery.`
}

export const buildSingleProductOrderMessage = ({ product }) => {
  const storeName = product?.vendor?.storeName || "Vendor"
  const productName = product?.name || "Bidhaa"
  const price = safeNumber(product?.price)
  const specsLine = product?.specs ? `\nMaelezo: ${product.specs}` : ""

  return `Habari ${storeName}, nahitaji kuagiza bidhaa hii kutoka CloveNet Soko:

1. ${productName} — ${formatMoney(price)}${specsLine}

Tafadhali nisaidie upatikanaji na delivery.`
}

export const openWhatsAppOrder = ({ vendor, items = [], products = [] }) => {
  const phone = cleanWhatsAppPhone(vendor?.whatsapp)

  if (!phone) {
    alert("Namba ya WhatsApp ya vendor haijapatikana.")
    return
  }

  const message = buildWhatsAppOrderMessage({
    vendor,
    items,
    products,
  })

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank", "noopener,noreferrer")
}

export const openSingleProductWhatsAppOrder = (product) => {
  const phone = cleanWhatsAppPhone(product?.vendor?.whatsapp)

  if (!phone) {
    alert("Namba ya WhatsApp ya vendor haijapatikana.")
    return
  }

  const message = buildSingleProductOrderMessage({ product })
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  window.open(url, "_blank", "noopener,noreferrer")
}