const express = require("express")

const {
  getVendorProfile,
  updateVendorProfile,
} = require("../controllers/vendorProfileController")

const { requireAuth, requireVendor } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireVendor, (req, res) => {
  res.json({
    success: true,
    message: "Vendor profile routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireVendor, getVendorProfile)
router.patch("/", requireAuth, requireVendor, updateVendorProfile)

module.exports = router