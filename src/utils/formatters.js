export const formatMoney = (amount) => {
  const value = Number(amount)

  if (!Number.isFinite(value)) {
    return "TZS 0"
  }

  return `TZS ${value.toLocaleString("en-US")}`
}

export const formatDate = (dateValue) => {
  if (!dateValue) return "-"

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleDateString("sw-TZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const createId = (prefix = "id") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const normalizePhone = (phone) => {
  if (!phone) return ""

  let value = String(phone).trim().replace(/\D/g, "")

  if (value.startsWith("255")) {
    return value
  }

  if (value.startsWith("0")) {
    return `255${value.slice(1)}`
  }

  if (value.length === 9) {
    return `255${value}`
  }

  return value
}