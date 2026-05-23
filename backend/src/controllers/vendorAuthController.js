const { query } = require("../config/db")
const {
  hashPassword,
  comparePassword,
  generateToken,
  normalizePhone,
  isValidPhone,
} = require("../utils/auth")
const { generateOtpCode, getOtpExpiryDate } = require("../utils/otp")

function isStrongPassword(password) {
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const hasMinLength = password.length >= 8

  return hasLowercase && hasUppercase && hasNumber && hasSpecial && hasMinLength
}

async function registerVendor(req, res) {
  try {
    const {
      ownerName,
      storeName,
      whatsapp,
      location,
      category,
      description,
      password,
    } = req.body

    const normalizedWhatsapp = normalizePhone(whatsapp)

    if (!ownerName || ownerName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka jina sahihi la mmiliki.",
      })
    }

    if (!storeName || storeName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka jina sahihi la duka.",
      })
    }

    if (!isValidPhone(normalizedWhatsapp)) {
      return res.status(400).json({
        success: false,
        message: "Weka namba sahihi ya WhatsApp.",
      })
    }

    if (!location || location.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka eneo la biashara yako.",
      })
    }

    if (!category || category.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Chagua aina ya biashara yako.",
      })
    }

    if (!isStrongPassword(password || "")) {
      return res.status(400).json({
        success: false,
        message:
          "Neno la siri liwe na angalau herufi 8, herufi kubwa, herufi ndogo, namba na alama maalum.",
      })
    }

    const existingVendor = await query(
      `
      SELECT id, store_name, whatsapp
      FROM vendors
      WHERE LOWER(store_name) = LOWER($1)
         OR whatsapp = $2
      LIMIT 1
      `,
      [storeName.trim(), normalizedWhatsapp]
    )

    if (existingVendor.rows.length > 0) {
      const existing = existingVendor.rows[0]

      if (existing.whatsapp === normalizedWhatsapp) {
        return res.status(409).json({
          success: false,
          message: "Namba hii tayari imesajiliwa na duka jingine.",
        })
      }

      return res.status(409).json({
        success: false,
        message: "Jina hili la duka tayari limeshatumika.",
      })
    }

    const passwordHash = await hashPassword(password)

    const result = await query(
      `
      INSERT INTO vendors (
        owner_name,
        store_name,
        whatsapp,
        location,
        category,
        description,
        password_hash,
        status,
        is_verified,
        plan,
        product_limit
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_verification', false, 'free', 15)
      RETURNING
        id,
        owner_name,
        store_name,
        whatsapp,
        location,
        category,
        description,
        status,
        is_verified,
        plan,
        product_limit,
        created_at
      `,
      [
        ownerName.trim(),
        storeName.trim(),
        normalizedWhatsapp,
        location.trim(),
        category.trim(),
        description?.trim() || "",
        passwordHash,
      ]
    )

    return res.status(201).json({
      success: true,
      message: "Duka limepokelewa. Linasubiri verification.",
      vendor: result.rows[0],
    })
  } catch (error) {
    console.error("Register vendor error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kusajili duka. Jaribu tena.",
    })
  }
}

async function loginVendor(req, res) {
  try {
    const { whatsapp, password } = req.body

    const normalizedWhatsapp = normalizePhone(whatsapp)

    if (!isValidPhone(normalizedWhatsapp) || !password) {
      return res.status(400).json({
        success: false,
        message: "Weka namba ya WhatsApp na neno la siri.",
      })
    }

    const result = await query(
      `
      SELECT *
      FROM vendors
      WHERE whatsapp = $1
      LIMIT 1
      `,
      [normalizedWhatsapp]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Namba ya simu au neno la siri si sahihi.",
      })
    }

    const vendor = result.rows[0]
    const passwordMatches = await comparePassword(password, vendor.password_hash)

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Namba ya simu au neno la siri si sahihi.",
      })
    }

    if (vendor.status !== "verified" && !vendor.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Duka lako linasubiri verification.",
        status: vendor.status,
        vendor: {
          id: vendor.id,
          storeName: vendor.store_name,
          whatsapp: vendor.whatsapp,
          status: vendor.status,
          isVerified: vendor.is_verified,
        },
      })
    }

    const token = generateToken({
      id: vendor.id,
      role: "vendor",
    })

    return res.json({
      success: true,
      message: "Umeingia dukani kikamilifu.",
      token,
      vendor: {
        id: vendor.id,
        ownerName: vendor.owner_name,
        storeName: vendor.store_name,
        whatsapp: vendor.whatsapp,
        location: vendor.location,
        category: vendor.category,
        description: vendor.description,
        status: vendor.status,
        isVerified: vendor.is_verified,
        plan: vendor.plan,
        productLimit: vendor.product_limit,
        createdAt: vendor.created_at,
        updatedAt: vendor.updated_at,
        verifiedAt: vendor.verified_at,
      },
    })
  } catch (error) {
    console.error("Login vendor error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuingia dukani. Jaribu tena.",
    })
  }
}

async function requestVendorPasswordReset(req, res) {
  try {
    const { whatsapp } = req.body
    const normalizedWhatsapp = normalizePhone(whatsapp)

    if (!isValidPhone(normalizedWhatsapp)) {
      return res.status(400).json({
        success: false,
        message: "Weka namba sahihi ya WhatsApp.",
      })
    }

    const vendorResult = await query(
      `
      SELECT id, owner_name, store_name, whatsapp
      FROM vendors
      WHERE whatsapp = $1
      LIMIT 1
      `,
      [normalizedWhatsapp]
    )

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hatukupata duka lenye namba hii ya WhatsApp.",
      })
    }

    const vendor = vendorResult.rows[0]
    const otpCode = generateOtpCode()
    const expiresAt = getOtpExpiryDate(15)

    await query(
      `
      UPDATE password_otps
      SET is_used = true,
          used_at = CURRENT_TIMESTAMP
      WHERE user_type = 'vendor'
        AND user_id = $1
        AND purpose = 'forgot_password'
        AND is_used = false
      `,
      [vendor.id]
    )

    await query(
      `
      INSERT INTO password_otps (
        user_type,
        user_id,
        phone,
        otp_code,
        purpose,
        is_used,
        expires_at
      )
      VALUES ('vendor', $1, $2, $3, 'forgot_password', false, $4)
      `,
      [vendor.id, normalizedWhatsapp, otpCode, expiresAt]
    )

    return res.json({
      success: true,
      message:
        "OTP imetengenezwa. Wasiliana na support kama hujaipokea kupitia mfumo wa automatic.",
      resetInfo: {
        vendorId: vendor.id,
        storeName: vendor.store_name,
        whatsapp: vendor.whatsapp,
        expiresInMinutes: 15,
      },
    })
  } catch (error) {
    console.error("Request vendor password reset error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kutengeneza OTP. Jaribu tena.",
    })
  }
}

async function resetVendorPassword(req, res) {
  try {
    const { whatsapp, otpCode, newPassword } = req.body
    const normalizedWhatsapp = normalizePhone(whatsapp)

    if (!isValidPhone(normalizedWhatsapp)) {
      return res.status(400).json({
        success: false,
        message: "Weka namba sahihi ya WhatsApp.",
      })
    }

    if (!otpCode || String(otpCode).trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: "Weka OTP sahihi.",
      })
    }

    if (!isStrongPassword(newPassword || "")) {
      return res.status(400).json({
        success: false,
        message:
          "Neno jipya la siri liwe na angalau herufi 8, herufi kubwa, herufi ndogo, namba na alama maalum.",
      })
    }

    const vendorResult = await query(
      `
      SELECT id, owner_name, store_name, whatsapp
      FROM vendors
      WHERE whatsapp = $1
      LIMIT 1
      `,
      [normalizedWhatsapp]
    )

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hatukupata duka lenye namba hii ya WhatsApp.",
      })
    }

    const vendor = vendorResult.rows[0]

    const otpResult = await query(
      `
      SELECT id, otp_code, expires_at, is_used
      FROM password_otps
      WHERE user_type = 'vendor'
        AND user_id = $1
        AND phone = $2
        AND purpose = 'forgot_password'
        AND otp_code = $3
        AND is_used = false
        AND expires_at > CURRENT_TIMESTAMP
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [vendor.id, normalizedWhatsapp, String(otpCode).trim()]
    )

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP si sahihi au ime-expire.",
      })
    }

    const otp = otpResult.rows[0]
    const passwordHash = await hashPassword(newPassword)

    await query(
      `
      UPDATE vendors
      SET password_hash = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [passwordHash, vendor.id]
    )

    await query(
      `
      UPDATE password_otps
      SET is_used = true,
          used_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [otp.id]
    )

    return res.json({
      success: true,
      message: "Neno la siri limebadilishwa kikamilifu. Sasa unaweza ku-login.",
    })
  } catch (error) {
    console.error("Reset vendor password error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kubadilisha neno la siri. Jaribu tena.",
    })
  }
}

module.exports = {
  registerVendor,
  loginVendor,
  requestVendorPasswordReset,
  resetVendorPassword,
}