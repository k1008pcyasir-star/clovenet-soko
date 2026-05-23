const express = require("express")

const {
  getAdminOrders,
} = require("../controllers/adminOrderController")

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin order routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireAdmin, getAdminOrders)

module.exports = router