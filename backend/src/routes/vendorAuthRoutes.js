const express = require("express")

const {
  registerVendor,
  loginVendor,
  requestVendorPasswordReset,
  resetVendorPassword,
} = require("../controllers/vendorAuthController")

const router = express.Router()

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Vendor auth routes are working.",
  })
})

router.post("/register", registerVendor)
router.post("/login", loginVendor)
router.post("/forgot-password", requestVendorPasswordReset)
router.post("/reset-password", resetVendorPassword)

module.exports = router