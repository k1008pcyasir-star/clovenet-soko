const { query } = require("../config/db")

function normalizePhone(phone) {
  const raw = String(phone || "").trim()
  const digits = raw.replace(/\D/g, "")

  if (!raw) return ""

  if (!digits) return raw

  if (digits.startsWith("255")) return `+${digits}`
  if (digits.startsWith("0")) return `+255${digits.slice(1)}`
  if (digits.length === 9) return `+255${digits}`

  return raw
}

function formatOrder(row) {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerLocation: row.customer_location,
    customerNote: row.customer_note,
    totalAmount: Number(row.total_amount || 0),
    status: row.status,
    whatsappSent: row.whatsapp_sent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    vendor: {
      id: row.vendor_id,
      storeName: row.store_name,
      ownerName: row.owner_name,
      whatsapp: row.vendor_whatsapp,
    },
    items: row.items || [],
  }
}

function buildCustomerInfo({
  customerName,
  customerPhone,
  customerLocation,
  customerNote,
  orderSource,
}) {
  const isQuickWhatsApp = orderSource === "quick_whatsapp"

  const finalName =
    String(customerName || "").trim() ||
    (isQuickWhatsApp ? "WhatsApp Customer" : "Customer")

  const finalPhone =
    normalizePhone(customerPhone) ||
    (isQuickWhatsApp ? "WhatsApp" : "Haijawekwa")

  const finalLocation = String(customerLocation || "").trim()
  const finalNote = String(customerNote || "").trim()

  return {
    finalName,
    finalPhone,
    finalLocation,
    finalNote,
  }
}

async function createOrder(req, res) {
  try {
    const {
      vendorId,
      customerName,
      customerPhone,
      customerLocation,
      customerNote,
      whatsappSent,
      orderSource,
      items,
    } = req.body

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID inahitajika.",
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order lazima iwe na bidhaa angalau moja.",
      })
    }

    const vendorResult = await query(
      `
      SELECT id, store_name, owner_name, whatsapp, status, is_verified
      FROM vendors
      WHERE id = $1::uuid
      LIMIT 1
      `,
      [vendorId]
    )

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor hajapatikana.",
      })
    }

    const vendor = vendorResult.rows[0]

    if (vendor.status !== "verified" && !vendor.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Duka hili bado halijaverified.",
      })
    }

    const productIds = items.map((item) => item.productId).filter(Boolean)

    if (productIds.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Kuna bidhaa haina productId.",
      })
    }

    const productsResult = await query(
      `
      SELECT id, vendor_id, name, price
      FROM products
      WHERE id = ANY($1::uuid[])
        AND vendor_id = $2::uuid
      `,
      [productIds, vendorId]
    )

    if (productsResult.rows.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Baadhi ya bidhaa hazijapatikana kwenye duka hili.",
      })
    }

    const productMap = new Map(
      productsResult.rows.map((product) => [product.id, product])
    )

    const preparedItems = items.map((item) => {
      const product = productMap.get(item.productId)
      const quantity = Math.max(Number(item.quantity || 1), 1)
      const unitPrice = Number(product.price || 0)
      const totalPrice = quantity * unitPrice

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice,
      }
    })

    const totalAmount = preparedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )

    const customerInfo = buildCustomerInfo({
      customerName,
      customerPhone,
      customerLocation,
      customerNote,
      orderSource,
    })

    const orderResult = await query(
      `
      INSERT INTO orders (
        vendor_id,
        customer_name,
        customer_phone,
        customer_location,
        customer_note,
        total_amount,
        status,
        whatsapp_sent
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'new', $7)
      RETURNING *
      `,
      [
        vendorId,
        customerInfo.finalName,
        customerInfo.finalPhone,
        customerInfo.finalLocation,
        customerInfo.finalNote,
        totalAmount,
        Boolean(whatsappSent),
      ]
    )

    const order = orderResult.rows[0]

    for (const item of preparedItems) {
      await query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          order.id,
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ]
      )
    }

    return res.status(201).json({
      success: true,
      message: "Order imehifadhiwa kikamilifu.",
      order: formatOrder({
        ...order,
        store_name: vendor.store_name,
        owner_name: vendor.owner_name,
        vendor_whatsapp: vendor.whatsapp,
        items: preparedItems,
      }),
    })
  } catch (error) {
    console.error("Create order error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuhifadhi order.",
      error: error.message,
    })
  }
}

async function getVendorOrders(req, res) {
  try {
    const vendorId = req.user.id

    const result = await query(
      `
      SELECT
        o.id,
        o.vendor_id,
        o.customer_name,
        o.customer_phone,
        o.customer_location,
        o.customer_note,
        o.total_amount,
        o.status,
        o.whatsapp_sent,
        o.created_at,
        o.updated_at,

        v.store_name,
        v.owner_name,
        v.whatsapp AS vendor_whatsapp,

        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'productId', oi.product_id,
              'productName', oi.product_name,
              'quantity', oi.quantity,
              'unitPrice', oi.unit_price,
              'totalPrice', oi.total_price
            )
            ORDER BY oi.created_at ASC
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      INNER JOIN vendors v ON v.id = o.vendor_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.vendor_id = $1::uuid
      GROUP BY o.id, v.id
      ORDER BY o.created_at DESC
      `,
      [vendorId]
    )

    return res.json({
      success: true,
      orders: result.rows.map(formatOrder),
    })
  } catch (error) {
    console.error("Get vendor orders error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata orders za vendor.",
      error: error.message,
    })
  }
}

async function updateVendorOrderStatus(req, res) {
  try {
    const vendorId = req.user.id
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = [
      "new",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status ya order si sahihi.",
      })
    }

    const result = await query(
      `
      UPDATE orders
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2::uuid
        AND vendor_id = $3::uuid
      RETURNING *
      `,
      [status, id, vendorId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order haijapatikana.",
      })
    }

    return res.json({
      success: true,
      message: "Status ya order imebadilishwa.",
      order: formatOrder({
        ...result.rows[0],
        items: [],
      }),
    })
  } catch (error) {
    console.error("Update vendor order status error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kubadilisha status ya order.",
      error: error.message,
    })
  }
}

module.exports = {
  createOrder,
  getVendorOrders,
  updateVendorOrderStatus,
}