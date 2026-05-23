import { adminApi, publicApi } from "./apiClient"

const ADMIN_TOKEN_KEY = "clovenet_soko_admin_token"
const CURRENT_ADMIN_KEY = "clovenet_soko_current_admin"

function saveAdminSession({ token, admin }) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  }

  if (admin) {
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(admin))
  }
}

function getCurrentAdmin() {
  const savedAdmin = localStorage.getItem(CURRENT_ADMIN_KEY)

  if (!savedAdmin) return null

  try {
    return JSON.parse(savedAdmin)
  } catch {
    return null
  }
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

function isSuperAdmin() {
  const admin = getCurrentAdmin()
  return admin?.role === "super_admin"
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(CURRENT_ADMIN_KEY)
}

async function loginAdmin(payload) {
  const data = await publicApi("/admin/login", {
    method: "POST",
    body: payload,
  })

  if (data.success && data.token && data.admin) {
    saveAdminSession({
      token: data.token,
      admin: data.admin,
    })
  }

  return data
}

async function getVendors() {
  const data = await adminApi("/admin/vendors")
  return data.vendors || []
}

async function updateVendorStatus(vendorId, status) {
  return adminApi(`/admin/vendors/${vendorId}/status`, {
    method: "PATCH",
    body: { status },
  })
}

async function updateVendorPlan(vendorId, plan) {
  return adminApi(`/admin/vendors/${vendorId}/plan`, {
    method: "PATCH",
    body: { plan },
  })
}

async function getProducts() {
  const data = await adminApi("/admin/products")
  return data.products || []
}

async function deleteProduct(productId) {
  return adminApi(`/admin/products/${productId}`, {
    method: "DELETE",
  })
}

async function getAdminOrders() {
  const data = await adminApi("/admin/orders")
  return data.orders || []
}

async function getAdmins() {
  const data = await adminApi("/admin/admins")
  return data.admins || []
}

async function createAdmin(payload) {
  return adminApi("/admin/admins", {
    method: "POST",
    body: payload,
  })
}

async function updateAdminStatus(adminId, isActive) {
  return adminApi(`/admin/admins/${adminId}/status`, {
    method: "PATCH",
    body: { isActive },
  })
}

async function getAdminLogs() {
  const data = await adminApi("/admin/logs")
  return data.logs || []
}

async function getActiveOtps() {
  const data = await adminApi("/admin/otps")
  return data.otps || []
}

export const AdminApiService = {
  loginAdmin,
  saveAdminSession,
  getCurrentAdmin,
  getAdminToken,
  isSuperAdmin,
  logoutAdmin,

  getVendors,
  updateVendorStatus,
  updateVendorPlan,

  getProducts,
  deleteProduct,

  getAdminOrders,

  getAdmins,
  createAdmin,
  updateAdminStatus,

  getAdminLogs,
  getActiveOtps,
}