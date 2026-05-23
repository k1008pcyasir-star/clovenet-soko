const express = require("express")

const {
  getAdminProducts,
  deleteAdminProduct,
} = require("../controllers/adminProductController")

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin product routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireAdmin, getAdminProducts)
router.delete("/:id", requireAuth, requireAdmin, deleteAdminProduct)

module.exports = router