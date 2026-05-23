const jwt = require("jsonwebtoken")

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token haijatumwa.",
      })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token haipo.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token si sahihi au ime-expire.",
    })
  }
}

function requireAdmin(req, res, next) {
  const allowedRoles = ["admin", "super_admin"]

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    })
  }

  next()
}

function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin only.",
    })
  }

  next()
}

function requireVendor(req, res, next) {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Vendor only.",
    })
  }

  next()
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  requireVendor,
}