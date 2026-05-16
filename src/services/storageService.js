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

    return JSON.parse(raw)
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

export const StorageService = {
  getVendors() {
    return read(STORAGE_KEYS.vendors, [])
  },

  saveVendors(vendors) {
    write(STORAGE_KEYS.vendors, Array.isArray(vendors) ? vendors : [])
  },

  getProducts() {
    return read(STORAGE_KEYS.products, [])
  },

  saveProducts(products) {
    write(STORAGE_KEYS.products, Array.isArray(products) ? products : [])
  },

  updateProduct(productId, updates) {
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
    return read(STORAGE_KEYS.cart, [])
  },

  saveCart(cart) {
    write(STORAGE_KEYS.cart, Array.isArray(cart) ? cart : [])
  },

  addToCart(product) {
    if (!product?.id) {
      return this.getCart()
    }

    const cart = this.getCart()
    const existingItem = cart.find((item) => item.productId === product.id)

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: safeNumber(item.quantity, 1) + 1,
            }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          id: `cart_${Date.now()}`,
          productId: product.id,
          vendorId: product.vendorId,
          name: product.name || "Bidhaa",
          category: product.category || "",
          price: safeNumber(product.price),
          oldPrice: safeNumber(product.oldPrice),
          image: product.image || "",
          emoji: product.emoji || "",
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ]
    }

    this.saveCart(updatedCart)
    return updatedCart
  },

  removeFromCart(productId) {
    const cart = this.getCart()
    const updatedCart = cart.filter((item) => item.productId !== productId)

    this.saveCart(updatedCart)
    return updatedCart
  },

  updateCartQuantity(productId, quantity) {
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
    return read(STORAGE_KEYS.orders, [])
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
    return localStorage.getItem(STORAGE_KEYS.currentVendorId) || ""
  },

  setCurrentVendorId(vendorId) {
    if (!vendorId) {
      this.clearCurrentVendorId()
      return
    }

    localStorage.setItem(STORAGE_KEYS.currentVendorId, vendorId)
  },

  clearCurrentVendorId() {
    localStorage.removeItem(STORAGE_KEYS.currentVendorId)
  },

  // TODO: Dark mode support will be implemented later.
  // These methods are kept here so theme storage remains centralized.
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "light"
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  },

  resetAll() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  },
}