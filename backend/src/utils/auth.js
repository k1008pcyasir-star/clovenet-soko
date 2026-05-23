const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 10

async function hashPassword(password) {
  if (!password) {
    throw new Error("Password is required")
  }

  return bcrypt.hash(password, SALT_ROUNDS)
}

async function comparePassword(password, passwordHash) {
  if (!password || !passwordHash) {
    return false
  }

  return bcrypt.compare(password, passwordHash)
}

function generateToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env")
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

function normalizePhone(phone) {
  if (!phone) return ""

  const digits = String(phone).replace(/\D/g, "")

  if (!digits) return ""

  if (digits.startsWith("255")) {
    return `+${digits}`
  }

  if (digits.startsWith("0")) {
    return `+255${digits.slice(1)}`
  }

  if (digits.length === 9) {
    return `+255${digits}`
  }

  return `+${digits}`
}

function isValidPhone(phone) {
  const normalizedPhone = normalizePhone(phone)
  const digits = normalizedPhone.replace(/\D/g, "")

  return digits.length >= 9 && digits.length <= 13
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  normalizePhone,
  isValidPhone,
}