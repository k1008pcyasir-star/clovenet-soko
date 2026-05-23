const express = require("express")

const {
  getAdmins,
  createAdmin,
  updateAdminStatus,
} = require("../controllers/adminManagementController")

const {
  requireAuth,
  requireSuperAdmin,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", requireAuth, requireSuperAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin management routes are protected and working.",
    user: req.user,
  })
})

router.get("/", requireAuth, requireSuperAdmin, getAdmins)
router.post("/", requireAuth, requireSuperAdmin, createAdmin)
router.patch("/:id/status", requireAuth, requireSuperAdmin, updateAdminStatus)

module.exports = router