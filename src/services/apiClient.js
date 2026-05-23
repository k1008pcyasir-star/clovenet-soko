const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://10.34.83.79:5001/api"

function getToken(storageKey) {
  return localStorage.getItem(storageKey)
}

async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body, token, headers = {} } = options

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "Request failed")
  }

  return data
}

export function publicApi(endpoint, options = {}) {
  return apiRequest(endpoint, options)
}

export function vendorApi(endpoint, options = {}) {
  const token = getToken("clovenet_soko_vendor_token")

  return apiRequest(endpoint, {
    ...options,
    token,
  })
}

export function adminApi(endpoint, options = {}) {
  const token = getToken("clovenet_soko_admin_token")

  return apiRequest(endpoint, {
    ...options,
    token,
  })
}

export { API_BASE_URL }