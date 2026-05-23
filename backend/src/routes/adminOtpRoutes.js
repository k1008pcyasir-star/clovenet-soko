const express = require("express")

const { getActiveOtps } = require("../controllers/adminOtpController")

const {
  requireAuth,
  requireSuperAdmin,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireSuperAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin OTP routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireSuperAdmin, getActiveOtps)

module.exports = router