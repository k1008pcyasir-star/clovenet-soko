const { query } = require("../config/db")
const { comparePassword, generateToken } = require("../utils/auth")
const { logAdminAction } = require("../utils/adminLogger")

async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Weka username na password.",
      })
    }

    const result = await query(
      `
      SELECT
        id,
        full_name,
        email,
        username,
        password_hash,
        role,
        is_active,
        created_at,
        updated_at
      FROM admins
      WHERE username = $1
      LIMIT 1
      `,
      [username.trim()]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username au password si sahihi.",
      })
    }

    const admin = result.rows[0]

    if (admin.is_active === false) {
      return res.status(403).json({
        success: false,
        message: "Akaunti hii ya admin imefungwa. Wasiliana na super admin.",
      })
    }

    const passwordMatches = await comparePassword(
      password,
      admin.password_hash
    )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Username au password si sahihi.",
      })
    }

    const role = admin.role || "admin"

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      role,
    })

    await logAdminAction({
      admin: {
        id: admin.id,
        username: admin.username,
        role,
      },
      action: "ADMIN_LOGIN",
      targetType: "admin",
      targetId: admin.id,
      targetName: admin.username,
      description: `${admin.username} logged in to admin dashboard.`,
      metadata: {
        fullName: admin.full_name,
        email: admin.email,
      },
    })

    return res.json({
      success: true,
      message: "Admin ameingia kikamilifu.",
      token,
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        username: admin.username,
        role,
        isActive: admin.is_active,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuingia admin. Jaribu tena.",
    })
  }
}

module.exports = {
  loginAdmin,
}