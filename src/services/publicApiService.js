import { publicApi } from "./apiClient"

async function getProducts() {
  const data = await publicApi("/products")
  return data.products || []
}

async function getProductById(productId) {
  const data = await publicApi(`/products/${productId}`)
  return data.product || null
}

async function getStoreById(vendorId) {
  const data = await publicApi(`/stores/${vendorId}`)
  return data.store || null
}

async function recordProductOrderClick(productId) {
  return publicApi(`/products/${productId}/order-click`, {
    method: "POST",
  })
}

export const PublicApiService = {
  getProducts,
  getProductById,
  getStoreById,
  recordProductOrderClick,
}