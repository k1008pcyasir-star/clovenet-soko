const { query } = require("../config/db")
const { normalizePhone, isValidPhone } = require("../utils/auth")

function formatVendor(row) {
  return {
    id: row.id,
    ownerName: row.owner_name,
    storeName: row.store_name,
    whatsapp: row.whatsapp,
    location: row.location,
    category: row.category,
    description: row.description,
    status: row.status,
    isVerified: row.is_verified,
    plan: row.plan,
    productLimit: row.product_limit,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    verifiedAt: row.verified_at,
  }
}

async function getVendorProfile(req, res) {
  try {
    const vendorId = req.user.id

    const result = await query(
      `
      SELECT
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
        created_at,
        updated_at,
        verified_at
      FROM vendors
      WHERE id = $1
      LIMIT 1
      `,
      [vendorId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor hajapatikana.",
      })
    }

    return res.json({
      success: true,
      vendor: formatVendor(result.rows[0]),
    })
  } catch (error) {
    console.error("Get vendor profile error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata profile ya vendor.",
      error: error.message,
    })
  }
}

async function updateVendorProfile(req, res) {
  try {
    const vendorId = req.user.id

    const {
      ownerName,
      storeName,
      whatsapp,
      location,
      category,
      description,
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
        message: "Weka location sahihi ya biashara.",
      })
    }

    if (!category || category.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka category sahihi ya biashara.",
      })
    }

    const duplicateResult = await query(
      `
      SELECT id, store_name, whatsapp
      FROM vendors
      WHERE id <> $1
        AND (
          LOWER(store_name) = LOWER($2)
          OR whatsapp = $3
        )
      LIMIT 1
      `,
      [vendorId, storeName.trim(), normalizedWhatsapp]
    )

    if (duplicateResult.rows.length > 0) {
      const existing = duplicateResult.rows[0]

      if (existing.whatsapp === normalizedWhatsapp) {
        return res.status(409).json({
          success: false,
          message: "Namba hii tayari inatumiwa na duka jingine.",
        })
      }

      return res.status(409).json({
        success: false,
        message: "Jina hili la duka tayari linatumiwa na vendor mwingine.",
      })
    }

    const result = await query(
      `
      UPDATE vendors
      SET
        owner_name = $1,
        store_name = $2,
        whatsapp = $3,
        location = $4,
        category = $5,
        description = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
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
        created_at,
        updated_at,
        verified_at
      `,
      [
        ownerName.trim(),
        storeName.trim(),
        normalizedWhatsapp,
        location.trim(),
        category.trim(),
        description?.trim() || "",
        vendorId,
      ]
    )

    return res.json({
      success: true,
      message: "Profile ya duka imehifadhiwa kikamilifu.",
      vendor: formatVendor(result.rows[0]),
    })
  } catch (error) {
    console.error("Update vendor profile error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuhifadhi profile ya duka.",
      error: error.message,
    })
  }
}

module.exports = {
  getVendorProfile,
  updateVendorProfile,
}