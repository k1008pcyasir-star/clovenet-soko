const express = require("express")
const cors = require("cors")

const { testConnection } = require("./config/db")

const publicProductRoutes = require("./routes/publicProductRoutes")
const orderRoutes = require("./routes/orderRoutes")
const vendorAuthRoutes = require("./routes/vendorAuthRoutes")
const vendorProductRoutes = require("./routes/vendorProductRoutes")
const vendorProfileRoutes = require("./routes/vendorProfileRoutes")
const vendorOrderRoutes = require("./routes/vendorOrderRoutes")
const adminAuthRoutes = require("./routes/adminAuthRoutes")
const adminVendorRoutes = require("./routes/adminVendorRoutes")
const adminProductRoutes = require("./routes/adminProductRoutes")
const adminOrderRoutes = require("./routes/adminOrderRoutes")
const adminManagementRoutes = require("./routes/adminManagementRoutes")
const adminLogRoutes = require("./routes/adminLogRoutes")
const adminOtpRoutes = require("./routes/adminOtpRoutes")

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://10.34.83.79:5173",
      "http://10.34.83.79:5174",
    ],
    credentials: true,
  })
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CloveNet Soko Backend API is running",
  })
})

app.get("/api/health", async (req, res) => {
  try {
    const database = await testConnection()

    res.json({
      success: true,
      message: "Backend and database are working.",
      databaseTime: database.current_time,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Backend is running, but database connection failed.",
      error: error.message,
    })
  }
})

app.use("/api", publicProductRoutes)
app.use("/api/orders", orderRoutes)

app.use("/api/vendors", vendorAuthRoutes)
app.use("/api/vendor/products", vendorProductRoutes)
app.use("/api/vendor/profile", vendorProfileRoutes)
app.use("/api/vendor/orders", vendorOrderRoutes)

app.use("/api/admin", adminAuthRoutes)
app.use("/api/admin/vendors", adminVendorRoutes)
app.use("/api/admin/products", adminProductRoutes)
app.use("/api/admin/orders", adminOrderRoutes)
app.use("/api/admin/admins", adminManagementRoutes)
app.use("/api/admin/logs", adminLogRoutes)
app.use("/api/admin/otps", adminOtpRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

module.exports = app