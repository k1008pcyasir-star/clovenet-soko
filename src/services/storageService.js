const STORAGE_KEYS = {
  vendors: "clovenet_soko_vendors",
  products: "clovenet_soko_products",
  cart: "clovenet_soko_cart",
  orders: "clovenet_soko_orders",
  currentVendorId: "clovenet_soko_current_vendor_id",
  theme: "clovenet_soko_theme",
}

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)

    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw)

    return parsed ?? fallback
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error)
    return fallback
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to write ${key} to localStorage`, error)
  }
}

const safeNumber = (value, fallback = 0) => {
  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
}

const getProductImages = (product) => {
  if (!product) return []

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean)
  }

  if (product.image) {
    return [product.image]
  }

  return []
}

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event("clovenet-cart-updated"))
}

export const StorageService = {
  getVendors() {
    const vendors = read(STORAGE_KEYS.vendors, [])

    return Array.isArray(vendors) ? vendors : []
  },

  saveVendors(vendors) {
    write(STORAGE_KEYS.vendors, Array.isArray(vendors) ? vendors : [])
  },

  getProducts() {
    const products = read(STORAGE_KEYS.products, [])

    return Array.isArray(products) ? products : []
  },

  saveProducts(products) {
    write(STORAGE_KEYS.products, Array.isArray(products) ? products : [])
  },

  updateProduct(productId, updates) {
    if (!productId) {
      return this.getProducts()
    }

    const products = this.getProducts()

    const updatedProducts = products.map((product) =>
      product.id === productId
        ? {
            ...product,
            ...updates,
          }
        : product
    )

    this.saveProducts(updatedProducts)

    return updatedProducts
  },

  getCart() {
    const cart = read(STORAGE_KEYS.cart, [])

    return Array.isArray(cart) ? cart : []
  },

  saveCart(cart) {
    write(STORAGE_KEYS.cart, Array.isArray(cart) ? cart : [])
    notifyCartUpdated()
  },

  addToCart(product) {
    if (!product?.id) {
      return this.getCart()
    }

    const cart = this.getCart()
    const existingItem = cart.find((item) => item.productId === product.id)
    const productImages = getProductImages(product)

    const vendorSnapshot = product.vendor
      ? {
          id: product.vendor.id || product.vendorId || "",
          storeName: product.vendor.storeName || product.vendor.store_name || "",
          ownerName: product.vendor.ownerName || product.vendor.owner_name || "",
          whatsapp: product.vendor.whatsapp || "",
          location: product.vendor.location || "",
          category: product.vendor.category || "",
          status: product.vendor.status || "",
          isVerified:
            product.vendor.isVerified || product.vendor.is_verified || false,
        }
      : null

    const productSnapshot = {
      id: product.id,
      vendorId: product.vendorId || product.vendor?.id || "",
      name: product.name || "Bidhaa",
      category: product.category || "",
      price: safeNumber(product.price),
      oldPrice: safeNumber(product.oldPrice || product.old_price),
      specs: product.specs || "",
      description: product.description || "",
      image: productImages[0] || "",
      images: productImages,
      featured: Boolean(product.featured),
      vendor: vendorSnapshot,
    }

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: safeNumber(item.quantity, 1) + 1,
              product: item.product || productSnapshot,
              vendor: item.vendor || vendorSnapshot,
              image: item.image || productImages[0] || "",
              images:
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images
                  : productImages,
            }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          id: `cart_${Date.now()}`,
          productId: product.id,
          vendorId: product.vendorId || product.vendor?.id || "",
          name: product.name || "Bidhaa",
          category: product.category || "",
          price: safeNumber(product.price),
          oldPrice: safeNumber(product.oldPrice || product.old_price),
          image: productImages[0] || "",
          images: productImages,
          emoji: product.emoji || "",
          quantity: 1,
          product: productSnapshot,
          vendor: vendorSnapshot,
          addedAt: new Date().toISOString(),
        },
      ]
    }

    this.saveCart(updatedCart)

    return updatedCart
  },

  removeFromCart(productId) {
    if (!productId) {
      return this.getCart()
    }

    const cart = this.getCart()
    const updatedCart = cart.filter((item) => item.productId !== productId)

    this.saveCart(updatedCart)

    return updatedCart
  },

  updateCartQuantity(productId, quantity) {
    if (!productId) {
      return this.getCart()
    }

    const nextQuantity = safeNumber(quantity)

    if (nextQuantity <= 0) {
      return this.removeFromCart(productId)
    }

    const cart = this.getCart()

    const updatedCart = cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: nextQuantity,
          }
        : item
    )

    this.saveCart(updatedCart)

    return updatedCart
  },

  clearCart() {
    this.saveCart([])

    return []
  },

  getOrders() {
    const orders = read(STORAGE_KEYS.orders, [])

    return Array.isArray(orders) ? orders : []
  },

  saveOrders(orders) {
    write(STORAGE_KEYS.orders, Array.isArray(orders) ? orders : [])
  },

  recordOrderClick(product) {
    if (!product?.id) {
      return null
    }

    const orders = this.getOrders()

    const newOrderClick = {
      id: `order_click_${Date.now()}`,
      productId: product.id,
      vendorId: product.vendorId || product.vendor?.id || "",
      productName: product.name || "Bidhaa",
      vendorName: product.vendor?.storeName || "",
      whatsapp: product.vendor?.whatsapp || "",
      type: "whatsapp_click",
      createdAt: new Date().toISOString(),
    }

    this.saveOrders([newOrderClick, ...orders])

    const products = this.getProducts()

    const updatedProducts = products.map((item) =>
      item.id === product.id
        ? {
            ...item,
            orderClicks: safeNumber(item.orderClicks) + 1,
          }
        : item
    )

    this.saveProducts(updatedProducts)

    return newOrderClick
  },

  getCurrentVendorId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.currentVendorId) || ""
    } catch {
      return ""
    }
  },

  setCurrentVendorId(vendorId) {
    try {
      if (!vendorId) {
        this.clearCurrentVendorId()
        return
      }

      localStorage.setItem(STORAGE_KEYS.currentVendorId, vendorId)
    } catch (error) {
      console.error("Failed to save current vendor id", error)
    }
  },

  clearCurrentVendorId() {
    try {
      localStorage.removeItem(STORAGE_KEYS.currentVendorId)
    } catch (error) {
      console.error("Failed to clear current vendor id", error)
    }
  },

  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) || "light"
    } catch {
      return "light"
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme || "light")
    } catch (error) {
      console.error("Failed to save theme", error)
    }
  },

  resetAll() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Failed to remove ${key} from localStorage`, error)
      }
    })

    notifyCartUpdated()
  },
}