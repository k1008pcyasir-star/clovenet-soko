const { query } = require("../config/db")
const { logAdminAction } = require("../utils/adminLogger")

const PLAN_CONFIG = {
  free: {
    productLimit: 15,
    featuredLimit: 1,
  },
  basic: {
    productLimit: 30,
    featuredLimit: 3,
  },
  pro: {
    productLimit: 60,
    featuredLimit: 5,
  },
  business: {
    productLimit: 100,
    featuredLimit: 10,
  },
}

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
    productCount: Number(row.product_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    verifiedAt: row.verified_at,
  }
}

function buildWhatsAppPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "")

  if (!digits) return ""

  if (digits.startsWith("255")) return digits
  if (digits.startsWith("0")) return `255${digits.slice(1)}`

  return digits
}

function buildVendorVerifiedNotification(vendor) {
  const storeName = vendor.storeName || vendor.store_name || "duka lako"
  const ownerName = vendor.ownerName || vendor.owner_name || "Vendor"
  const phone = vendor.whatsapp || ""

  const notificationMessage = `Habari ${ownerName}, duka lako "${storeName}" limehakikiwa kikamilifu kwenye CloveNet Soko. Sasa unaweza kuingia kwenye dashboard yako, kuongeza bidhaa, na kuanza kupokea oda kupitia WhatsApp.

CloveNet Soko - Tunakuunganisha na wateja kwa urahisi.`

  const whatsappPhone = buildWhatsAppPhone(phone)
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        notificationMessage
      )}`
    : ""

  return {
    notificationMessage,
    whatsappUrl,
  }
}

function getVendorAction(status) {
  if (status === "verified") return "VERIFY_VENDOR"
  if (status === "suspended") return "SUSPEND_VENDOR"
  return "RETURN_VENDOR_PENDING"
}

function getVendorLogDescription(status, vendor) {
  if (status === "verified") {
    return `${vendor.storeName} verified by admin.`
  }

  if (status === "suspended") {
    return `${vendor.storeName} suspended by admin.`
  }

  return `${vendor.storeName} returned to pending verification by admin.`
}

async function getVendors(req, res) {
  try {
    const result = await query(
      `
      SELECT
        v.id,
        v.owner_name,
        v.store_name,
        v.whatsapp,
        v.location,
        v.category,
        v.description,
        v.status,
        v.is_verified,
        v.plan,
        v.product_limit,
        v.created_at,
        v.updated_at,
        v.verified_at,
        COUNT(p.id) AS product_count
      FROM vendors v
      LEFT JOIN products p ON p.vendor_id = v.id
      GROUP BY v.id
      ORDER BY v.created_at DESC
      `
    )

    return res.json({
      success: true,
      vendors: result.rows.map(formatVendor),
    })
  } catch (error) {
    console.error("Get admin vendors error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata vendors.",
      error: error.message,
    })
  }
}

async function updateVendorStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = ["pending_verification", "verified", "suspended"]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status si sahihi.",
      })
    }

    const result = await query(
      `
      UPDATE vendors
      SET
        status = $1::varchar,
        is_verified = $2::boolean,
        verified_at = CASE
          WHEN $1::text = 'verified' THEN CURRENT_TIMESTAMP
          ELSE verified_at
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3::uuid
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
      [status, status === "verified", id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor hajapatikana.",
      })
    }

    const vendor = formatVendor({
      ...result.rows[0],
      product_count: 0,
    })

    await logAdminAction({
      admin: req.user,
      action: getVendorAction(status),
      targetType: "vendor",
      targetId: vendor.id,
      targetName: vendor.storeName,
      description: getVendorLogDescription(status, vendor),
      metadata: {
        vendorId: vendor.id,
        storeName: vendor.storeName,
        ownerName: vendor.ownerName,
        whatsapp: vendor.whatsapp,
        newStatus: vendor.status,
        isVerified: vendor.isVerified,
      },
    })

    const notification =
      status === "verified" ? buildVendorVerifiedNotification(vendor) : null

    return res.json({
      success: true,
      message: "Status ya vendor imebadilishwa kikamilifu.",
      vendor,
      notification,
    })
  } catch (error) {
    console.error("Update vendor status error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kubadilisha status ya vendor.",
      error: error.message,
    })
  }
}

async function updateVendorPlan(req, res) {
  try {
    const { id } = req.params
    const { plan } = req.body

    if (!PLAN_CONFIG[plan]) {
      return res.status(400).json({
        success: false,
        message: "Plan si sahihi.",
      })
    }

    const selectedPlan = PLAN_CONFIG[plan]

    const currentVendorResult = await query(
      `
      SELECT
        id,
        owner_name,
        store_name,
        whatsapp,
        plan,
        product_limit
      FROM vendors
      WHERE id = $1::uuid
      LIMIT 1
      `,
      [id]
    )

    if (currentVendorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor hajapatikana.",
      })
    }

    const oldVendor = currentVendorResult.rows[0]

    const result = await query(
      `
      UPDATE vendors
      SET
        plan = $1,
        product_limit = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3::uuid
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
      [plan, selectedPlan.productLimit, id]
    )

    const vendor = formatVendor({
      ...result.rows[0],
      product_count: 0,
    })

    await logAdminAction({
      admin: req.user,
      action: "UPDATE_VENDOR_PLAN",
      targetType: "vendor",
      targetId: vendor.id,
      targetName: vendor.storeName,
      description: `${vendor.storeName} plan changed from ${oldVendor.plan || "free"} to ${vendor.plan}.`,
      metadata: {
        vendorId: vendor.id,
        storeName: vendor.storeName,
        ownerName: vendor.ownerName,
        whatsapp: vendor.whatsapp,
        oldPlan: oldVendor.plan || "free",
        newPlan: vendor.plan,
        oldProductLimit: Number(oldVendor.product_limit || 15),
        newProductLimit: Number(vendor.productLimit || selectedPlan.productLimit),
        featuredLimit: selectedPlan.featuredLimit,
      },
    })

    return res.json({
      success: true,
      message: "Plan ya vendor imebadilishwa kikamilifu.",
      vendor,
      planInfo: {
        plan,
        productLimit: selectedPlan.productLimit,
        featuredLimit: selectedPlan.featuredLimit,
      },
    })
  } catch (error) {
    console.error("Update vendor plan error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kubadilisha plan ya vendor.",
      error: error.message,
    })
  }
}

module.exports = {
  getVendors,
  updateVendorStatus,
  updateVendorPlan,
}