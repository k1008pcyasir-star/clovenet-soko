const { query } = require("../config/db")

function formatProduct(row) {
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
  }
}

function getFeaturedLimitByPlan(plan) {
  if (plan === "basic") return 3
  if (plan === "pro") return 5
  if (plan === "business") return 10

  return 1
}

async function getCurrentFeaturedCount(vendorId, excludeProductId = null) {
  const result = await query(
    `
    SELECT COUNT(*) AS total
    FROM products
    WHERE vendor_id = $1
      AND featured = true
      AND ($2::uuid IS NULL OR id <> $2::uuid)
    `,
    [vendorId, excludeProductId]
  )

  return Number(result.rows[0].total || 0)
}

async function getVendorProducts(req, res) {
  try {
    const vendorId = req.user.id

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
        COALESCE(
          ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
          FILTER (WHERE pi.id IS NOT NULL),
          '{}'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.vendor_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [vendorId]
    )

    return res.json({
      success: true,
      products: result.rows.map(formatProduct),
    })
  } catch (error) {
    console.error("Get vendor products error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata bidhaa za vendor.",
      error: error.message,
    })
  }
}

async function createProduct(req, res) {
  try {
    const vendorId = req.user.id

    const {
      name,
      category,
      price,
      oldPrice,
      specs,
      description,
      featured,
      images,
    } = req.body

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka jina sahihi la bidhaa.",
      })
    }

    if (!category || category.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Chagua category ya bidhaa.",
      })
    }

    const productPrice = Number(price)
    const productOldPrice = oldPrice ? Number(oldPrice) : 0

    if (!productPrice || productPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Weka bei sahihi ya bidhaa.",
      })
    }

    if (productOldPrice && productOldPrice < productPrice) {
      return res.status(400).json({
        success: false,
        message: "Bei ya zamani isiwe ndogo kuliko bei ya sasa.",
      })
    }

    const vendorResult = await query(
      `
      SELECT product_limit, plan
      FROM vendors
      WHERE id = $1
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
    const productLimit = Number(vendor.product_limit || 15)
    const featuredLimit = getFeaturedLimitByPlan(vendor.plan || "free")

    const countResult = await query(
      `
      SELECT COUNT(*) AS total
      FROM products
      WHERE vendor_id = $1
      `,
      [vendorId]
    )

    const currentProductCount = Number(countResult.rows[0].total || 0)

    if (currentProductCount >= productLimit) {
      return res.status(400).json({
        success: false,
        message: "Umefikia limit ya bidhaa kwa sasa.",
      })
    }

    if (Boolean(featured)) {
      const currentFeaturedCount = await getCurrentFeaturedCount(vendorId)

      if (currentFeaturedCount >= featuredLimit) {
        return res.status(400).json({
          success: false,
          message: `Plan yako ya sasa inaruhusu featured product ${featuredLimit} tu. Upgrade plan kuongeza featured products zaidi.`,
        })
      }
    }

    const productResult = await query(
      `
      INSERT INTO products (
        vendor_id,
        name,
        category,
        price,
        old_price,
        specs,
        description,
        featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        vendorId,
        name.trim(),
        category.trim(),
        productPrice,
        productOldPrice,
        specs?.trim() || "",
        description?.trim() || "",
        Boolean(featured),
      ]
    )

    const product = productResult.rows[0]
    const productImages = Array.isArray(images) ? images.filter(Boolean) : []

    if (productImages.length > 0) {
      for (let index = 0; index < productImages.length; index += 1) {
        await query(
          `
          INSERT INTO product_images (
            product_id,
            image_url,
            sort_order
          )
          VALUES ($1, $2, $3)
          `,
          [product.id, productImages[index], index]
        )
      }
    }

    const createdProductResult = await query(
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
        COALESCE(
          ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
          FILTER (WHERE pi.id IS NOT NULL),
          '{}'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [product.id]
    )

    return res.status(201).json({
      success: true,
      message: "Bidhaa imehifadhiwa kikamilifu.",
      product: formatProduct(createdProductResult.rows[0]),
    })
  } catch (error) {
    console.error("Create product error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuhifadhi bidhaa.",
      error: error.message,
    })
  }
}

async function updateProduct(req, res) {
  try {
    const vendorId = req.user.id
    const { id } = req.params

    const {
      name,
      category,
      price,
      oldPrice,
      specs,
      description,
      featured,
      images,
    } = req.body

    const existingProduct = await query(
      `
      SELECT id
      FROM products
      WHERE id = $1 AND vendor_id = $2
      LIMIT 1
      `,
      [id, vendorId]
    )

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bidhaa haijapatikana au siyo ya vendor huyu.",
      })
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka jina sahihi la bidhaa.",
      })
    }

    if (!category || category.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Chagua category ya bidhaa.",
      })
    }

    const productPrice = Number(price)
    const productOldPrice = oldPrice ? Number(oldPrice) : 0

    if (!productPrice || productPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Weka bei sahihi ya bidhaa.",
      })
    }

    if (productOldPrice && productOldPrice < productPrice) {
      return res.status(400).json({
        success: false,
        message: "Bei ya zamani isiwe ndogo kuliko bei ya sasa.",
      })
    }

    const vendorResult = await query(
      `
      SELECT plan
      FROM vendors
      WHERE id = $1
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

    const featuredLimit = getFeaturedLimitByPlan(
      vendorResult.rows[0].plan || "free"
    )

    if (Boolean(featured)) {
      const currentFeaturedCount = await getCurrentFeaturedCount(vendorId, id)

      if (currentFeaturedCount >= featuredLimit) {
        return res.status(400).json({
          success: false,
          message: `Plan yako ya sasa inaruhusu featured product ${featuredLimit} tu. Upgrade plan kuongeza featured products zaidi.`,
        })
      }
    }

    await query(
      `
      UPDATE products
      SET
        name = $1,
        category = $2,
        price = $3,
        old_price = $4,
        specs = $5,
        description = $6,
        featured = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND vendor_id = $9
      `,
      [
        name.trim(),
        category.trim(),
        productPrice,
        productOldPrice,
        specs?.trim() || "",
        description?.trim() || "",
        Boolean(featured),
        id,
        vendorId,
      ]
    )

    if (Array.isArray(images)) {
      await query(
        `
        DELETE FROM product_images
        WHERE product_id = $1
        `,
        [id]
      )

      const productImages = images.filter(Boolean)

      for (let index = 0; index < productImages.length; index += 1) {
        await query(
          `
          INSERT INTO product_images (
            product_id,
            image_url,
            sort_order
          )
          VALUES ($1, $2, $3)
          `,
          [id, productImages[index], index]
        )
      }
    }

    const updatedProductResult = await query(
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
        COALESCE(
          ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
          FILTER (WHERE pi.id IS NOT NULL),
          '{}'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [id]
    )

    return res.json({
      success: true,
      message: "Mabadiliko ya bidhaa yamehifadhiwa.",
      product: formatProduct(updatedProductResult.rows[0]),
    })
  } catch (error) {
    console.error("Update product error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana ku-edit bidhaa.",
      error: error.message,
    })
  }
}

async function deleteProduct(req, res) {
  try {
    const vendorId = req.user.id
    const { id } = req.params

    const result = await query(
      `
      DELETE FROM products
      WHERE id = $1 AND vendor_id = $2
      RETURNING id
      `,
      [id, vendorId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bidhaa haijapatikana au siyo ya vendor huyu.",
      })
    }

    return res.json({
      success: true,
      message: "Bidhaa imefutwa kikamilifu.",
      deletedProductId: id,
    })
  } catch (error) {
    console.error("Delete product error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kufuta bidhaa.",
      error: error.message,
    })
  }
}

module.exports = {
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}