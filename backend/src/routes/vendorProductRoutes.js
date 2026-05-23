const express = require("express")

const {
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/vendorProductController")

const { requireAuth, requireVendor } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireVendor, (req, res) => {
  res.json({
    success: true,
    message: "Vendor product routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireVendor, getVendorProducts)
router.post("/", requireAuth, requireVendor, createProduct)
router.patch("/:id", requireAuth, requireVendor, updateProduct)
router.delete("/:id", requireAuth, requireVendor, deleteProduct)

module.exports = router