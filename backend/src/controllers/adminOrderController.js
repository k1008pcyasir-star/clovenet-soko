const { query } = require("../config/db")

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
      location: row.vendor_location,
      category: row.vendor_category,
      status: row.vendor_status,
      isVerified: row.vendor_is_verified,
    },
    items: row.items || [],
  }
}

async function getAdminOrders(req, res) {
  try {
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
        v.location AS vendor_location,
        v.category AS vendor_category,
        v.status AS vendor_status,
        v.is_verified AS vendor_is_verified,

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
      GROUP BY o.id, v.id
      ORDER BY o.created_at DESC
      `
    )

    return res.json({
      success: true,
      orders: result.rows.map(formatOrder),
    })
  } catch (error) {
    console.error("Get admin orders error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata orders zote za admin.",
      error: error.message,
    })
  }
}

module.exports = {
  getAdminOrders,
}