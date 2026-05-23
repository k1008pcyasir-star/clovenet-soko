const express = require("express")

const { loginAdmin } = require("../controllers/adminAuthController")

const router = express.Router()

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin auth routes are working.",
  })
})

router.post("/login", loginAdmin)

module.exports = router