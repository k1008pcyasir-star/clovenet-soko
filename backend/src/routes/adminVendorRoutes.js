const express = require("express")

const {
  getVendors,
  updateVendorStatus,
  updateVendorPlan,
} = require("../controllers/adminVendorController")

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin vendor routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireAdmin, getVendors)
router.patch("/:id/status", requireAuth, requireAdmin, updateVendorStatus)
router.patch("/:id/plan", requireAuth, requireAdmin, updateVendorPlan)

module.exports = router