const { query } = require("../config/db")
const { logAdminAction } = require("../utils/adminLogger")

function formatAdminProduct(row) {
  const images = row.images ? row.images.filter(Boolean) : []

  return {
    id: row.id,
    vendorId: row.vendor_id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: Number(row.old_price || 0),
    specs: row.specs,
    description: row.description,
    featured: row.featured,
    image: images[0] || "",
    images,
    views: Number(row.views || 0),
    orderClicks: Number(row.order_clicks || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    vendor: {
      id: row.vendor_id,
      ownerName: row.owner_name,
      storeName: row.store_name,
      whatsapp: row.whatsapp,
      location: row.location,
      category: row.vendor_category,
      status: row.vendor_status,
      isVerified: row.is_verified,
    },
  }
}

async function getAdminProducts(req, res) {
  try {
    const result = await query(
      `
      SELECT
        p.id,
        p.vendor_id,
        p.name,
        p.category,
        p.price,
        p.old_price,
        p.specs,
        p.description,
        p.featured,
        p.views,
        p.order_clicks,
        p.created_at,
        p.updated_at,

        v.owner_name,
        v.store_name,
        v.whatsapp,
        v.location,
        v.category AS vendor_category,
        v.status AS vendor_status,
        v.is_verified,

        COALESCE(
          ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
          FILTER (WHERE pi.id IS NOT NULL),
          '{}'
        ) AS images
      FROM products p
      INNER JOIN vendors v ON v.id = p.vendor_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      GROUP BY p.id, v.id
      ORDER BY p.created_at DESC
      `
    )

    return res.json({
      success: true,
      products: result.rows.map(formatAdminProduct),
    })
  } catch (error) {
    console.error("Get admin products error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata bidhaa zote.",
      error: error.message,
    })
  }
}

async function deleteAdminProduct(req, res) {
  try {
    const { id } = req.params

    const productResult = await query(
      `
      SELECT
        p.id,
        p.name,
        p.category,
        p.price,
        p.vendor_id,
        v.store_name,
        v.owner_name,
        v.whatsapp
      FROM products p
      INNER JOIN vendors v ON v.id = p.vendor_id
      WHERE p.id = $1::uuid
      LIMIT 1
      `,
      [id]
    )

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bidhaa haijapatikana.",
      })
    }

    const product = productResult.rows[0]

    const result = await query(
      `
      DELETE FROM products
      WHERE id = $1::uuid
      RETURNING id, name
      `,
      [id]
    )

    await logAdminAction({
      admin: req.user,
      action: "DELETE_PRODUCT",
      targetType: "product",
      targetId: product.id,
      targetName: product.name,
      description: `${product.name} deleted by admin.`,
      metadata: {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: Number(product.price || 0),
        vendorId: product.vendor_id,
        storeName: product.store_name,
        ownerName: product.owner_name,
        whatsapp: product.whatsapp,
      },
    })

    return res.json({
      success: true,
      message: "Bidhaa imefutwa na admin kikamilifu.",
      deletedProduct: result.rows[0],
    })
  } catch (error) {
    console.error("Delete admin product error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kufuta bidhaa.",
      error: error.message,
    })
  }
}

module.exports = {
  getAdminProducts,
  deleteAdminProduct,
}