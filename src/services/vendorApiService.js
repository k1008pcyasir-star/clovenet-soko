import { publicApi, vendorApi } from "./apiClient"

const VENDOR_TOKEN_KEY = "clovenet_soko_vendor_token"
const CURRENT_VENDOR_KEY = "clovenet_soko_current_vendor"

function saveVendorSession({ token, vendor }) {
  if (token) {
    localStorage.setItem(VENDOR_TOKEN_KEY, token)
  }

  if (vendor) {
    localStorage.setItem(CURRENT_VENDOR_KEY, JSON.stringify(vendor))
  }
}

function getCurrentVendor() {
  const savedVendor = localStorage.getItem(CURRENT_VENDOR_KEY)

  if (!savedVendor) return null

  try {
    return JSON.parse(savedVendor)
  } catch {
    return null
  }
}

function getVendorToken() {
  return localStorage.getItem(VENDOR_TOKEN_KEY)
}

function logoutVendor() {
  localStorage.removeItem(VENDOR_TOKEN_KEY)
  localStorage.removeItem(CURRENT_VENDOR_KEY)
}

async function registerVendor(payload) {
  return publicApi("/vendors/register", {
    method: "POST",
    body: payload,
  })
}

async function loginVendor(payload) {
  const data = await publicApi("/vendors/login", {
    method: "POST",
    body: payload,
  })

  if (data.success && data.token && data.vendor) {
    saveVendorSession({
      token: data.token,
      vendor: data.vendor,
    })
  }

  return data
}

async function requestPasswordReset(payload) {
  return publicApi("/vendors/forgot-password", {
    method: "POST",
    body: payload,
  })
}

async function resetPassword(payload) {
  return publicApi("/vendors/reset-password", {
    method: "POST",
    body: payload,
  })
}

async function getVendorProfile() {
  const data = await vendorApi("/vendor/profile")

  if (data.success && data.vendor) {
    saveVendorSession({
      vendor: data.vendor,
    })
  }

  return data.vendor || null
}

async function updateVendorProfile(payload) {
  const data = await vendorApi("/vendor/profile", {
    method: "PATCH",
    body: payload,
  })

  if (data.success && data.vendor) {
    saveVendorSession({
      vendor: data.vendor,
    })
  }

  return data
}

async function getVendorProducts() {
  const data = await vendorApi("/vendor/products")
  return data.products || []
}

async function createVendorProduct(payload) {
  return vendorApi("/vendor/products", {
    method: "POST",
    body: payload,
  })
}

async function updateVendorProduct(productId, payload) {
  return vendorApi(`/vendor/products/${productId}`, {
    method: "PATCH",
    body: payload,
  })
}

async function deleteVendorProduct(productId) {
  return vendorApi(`/vendor/products/${productId}`, {
    method: "DELETE",
  })
}

async function createOrder(payload) {
  return publicApi("/orders", {
    method: "POST",
    body: payload,
  })
}

async function getVendorOrders() {
  const data = await vendorApi("/vendor/orders")
  return data.orders || []
}

async function updateVendorOrderStatus(orderId, status) {
  return vendorApi(`/vendor/orders/${orderId}/status`, {
    method: "PATCH",
    body: { status },
  })
}

export const vendorApiService = {
  registerVendor,
  loginVendor,
  requestPasswordReset,
  resetPassword,

  saveVendorSession,
  getCurrentVendor,
  getVendorToken,
  logoutVendor,

  getVendorProfile,
  updateVendorProfile,

  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,

  createOrder,
  getVendorOrders,
  updateVendorOrderStatus,
}

export const VendorApiService = vendorApiService