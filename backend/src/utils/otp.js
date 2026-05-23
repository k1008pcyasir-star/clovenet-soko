function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function getOtpExpiryDate(minutes = 15) {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes)
  return expiresAt
}

module.exports = {
  generateOtpCode,
  getOtpExpiryDate,
}