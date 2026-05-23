const express = require("express")

const {
  getVendorOrders,
  updateVendorOrderStatus,
} = require("../controllers/orderController")

const { requireAuth, requireVendor } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireVendor, (req, res) => {
  res.json({
    success: true,
    message: "Vendor order routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireVendor, getVendorOrders)
router.patch("/:id/status", requireAuth, requireVendor, updateVendorOrderStatus)

module.exports = router