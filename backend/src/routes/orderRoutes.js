const express = require("express")

const { createOrder } = require("../controllers/orderController")

const router = express.Router()

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Public order routes are working.",
  })
})

router.post("/", createOrder)

module.exports = router