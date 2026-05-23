const express = require("express")

const {
  getPublicProducts,
  getPublicProductById,
  getPublicStoreById,
  recordProductOrderClick,
} = require("../controllers/publicProductController")

const router = express.Router()

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Public product routes are working.",
  })
})

router.get("/products", getPublicProducts)
router.get("/products/:id", getPublicProductById)
router.post("/products/:id/order-click", recordProductOrderClick)

router.get("/stores/:vendorId", getPublicStoreById)

module.exports = router