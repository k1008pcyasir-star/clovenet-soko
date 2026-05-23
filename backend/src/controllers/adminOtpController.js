const { query } = require("../config/db")

function formatOtp(row) {
  return {
    id: row.id,
    userType: row.user_type,
    userId: row.user_id,
    phone: row.phone,
    otpCode: row.otp_code,
    purpose: row.purpose,
    isUsed: row.is_used,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    vendor: {
      id: row.vendor_id,
      ownerName: row.owner_name,
      storeName: row.store_name,
      whatsapp: row.vendor_whatsapp,
      status: row.vendor_status,
    },
  }
}

async function getActiveOtps(req, res) {
  try {
    const result = await query(
      `
      SELECT
        po.id,
        po.user_type,
        po.user_id,
        po.phone,
        po.otp_code,
        po.purpose,
        po.is_used,
        po.expires_at,
        po.created_at,

        v.id AS vendor_id,
        v.owner_name,
        v.store_name,
        v.whatsapp AS vendor_whatsapp,
        v.status AS vendor_status
      FROM password_otps po
      LEFT JOIN vendors v ON v.id = po.user_id
      WHERE po.user_type = 'vendor'
        AND po.purpose = 'forgot_password'
        AND po.is_used = false
        AND po.expires_at > CURRENT_TIMESTAMP
      ORDER BY po.created_at DESC
      LIMIT 100
      `
    )

    return res.json({
      success: true,
      otps: result.rows.map(formatOtp),
    })
  } catch (error) {
    console.error("Get active OTPs error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata OTP active.",
      error: error.message,
    })
  }
}

module.exports = {
  getActiveOtps,
}