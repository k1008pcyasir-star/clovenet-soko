const { query } = require("../config/db")

function formatPublicProduct(row) {
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
      storeName: row.store_name,
      location: row.location,
      category: row.vendor_category,
      whatsapp: row.whatsapp,
      isVerified: row.is_verified,
      status: row.vendor_status,
    },
  }
}

function formatPublicStore(row, products = []) {
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
    products,
  }
}

async function getPublicProducts(req, res) {
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

        v.store_name,
        v.location,
        v.category AS vendor_category,
        v.whatsapp,
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
      WHERE v.status = 'verified'
        AND v.is_verified = true
      GROUP BY p.id, v.id
      ORDER BY p.featured DESC, p.created_at DESC
      `
    )

    return res.json({
      success: true,
      products: result.rows.map(formatPublicProduct),
    })
  } catch (error) {
    console.error("Get public products error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata bidhaa.",
      error: error.message,
    })
  }
}

async function getPublicProductById(req, res) {
  try {
    const { id } = req.params

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

        v.store_name,
        v.location,
        v.category AS vendor_category,
        v.whatsapp,
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
      WHERE p.id = $1::uuid
        AND v.status = 'verified'
        AND v.is_verified = true
      GROUP BY p.id, v.id
      LIMIT 1
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bidhaa haijapatikana.",
      })
    }

    await query(
      `
      UPDATE products
      SET views = views + 1
      WHERE id = $1::uuid
      `,
      [id]
    )

    return res.json({
      success: true,
      product: formatPublicProduct({
        ...result.rows[0],
        views: Number(result.rows[0].views || 0) + 1,
      }),
    })
  } catch (error) {
    console.error("Get public product by id error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata taarifa za bidhaa.",
      error: error.message,
    })
  }
}

async function getPublicStoreById(req, res) {
  try {
    const { vendorId } = req.params

    const storeResult = await query(
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
      WHERE id = $1::uuid
        AND status = 'verified'
        AND is_verified = true
      LIMIT 1
      `,
      [vendorId]
    )

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Duka halijapatikana.",
      })
    }

    const productsResult = await query(
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

        v.store_name,
        v.location,
        v.category AS vendor_category,
        v.whatsapp,
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
      WHERE p.vendor_id = $1::uuid
        AND v.status = 'verified'
        AND v.is_verified = true
      GROUP BY p.id, v.id
      ORDER BY p.featured DESC, p.created_at DESC
      `,
      [vendorId]
    )

    const products = productsResult.rows.map(formatPublicProduct)

    return res.json({
      success: true,
      store: formatPublicStore(storeResult.rows[0], products),
    })
  } catch (error) {
    console.error("Get public store by id error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata taarifa za duka.",
      error: error.message,
    })
  }
}

async function recordProductOrderClick(req, res) {
  try {
    const { id } = req.params

    const result = await query(
      `
      UPDATE products p
      SET order_clicks = order_clicks + 1
      FROM vendors v
      WHERE p.id = $1::uuid
        AND v.id = p.vendor_id
        AND v.status = 'verified'
        AND v.is_verified = true
      RETURNING
        p.id,
        p.vendor_id,
        p.name,
        p.order_clicks
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bidhaa haijapatikana au duka halijawa verified.",
      })
    }

    return res.json({
      success: true,
      message: "WhatsApp click imehifadhiwa.",
      product: {
        id: result.rows[0].id,
        vendorId: result.rows[0].vendor_id,
        name: result.rows[0].name,
        orderClicks: Number(result.rows[0].order_clicks || 0),
      },
    })
  } catch (error) {
    console.error("Record product order click error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuhifadhi WhatsApp click.",
      error: error.message,
    })
  }
}

module.exports = {
  getPublicProducts,
  getPublicProductById,
  getPublicStoreById,
  recordProductOrderClick,
}