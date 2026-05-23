const express = require("express")

const { getAdminLogs } = require("../controllers/adminLogController")

const {
  requireAuth,
  requireSuperAdmin,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireSuperAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin log routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireSuperAdmin, getAdminLogs)

module.exports = router