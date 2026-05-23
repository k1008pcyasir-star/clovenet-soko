const { query } = require("../config/db")
const { hashPassword } = require("../utils/auth")
const { logAdminAction } = require("../utils/adminLogger")

function formatAdmin(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    username: row.username,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function isStrongPassword(password) {
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const hasMinLength = password.length >= 8

  return hasLowercase && hasUppercase && hasNumber && hasSpecial && hasMinLength
}

async function getAdmins(req, res) {
  try {
    const result = await query(
      `
      SELECT
        id,
        full_name,
        email,
        username,
        role,
        is_active,
        created_at,
        updated_at
      FROM admins
      ORDER BY created_at DESC
      `
    )

    return res.json({
      success: true,
      admins: result.rows.map(formatAdmin),
    })
  } catch (error) {
    console.error("Get admins error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata admins.",
      error: error.message,
    })
  }
}

async function createAdmin(req, res) {
  try {
    const { fullName, email, username, password, role } = req.body

    const finalRole = role || "admin"

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Weka jina sahihi la admin.",
      })
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Weka email sahihi ya admin.",
      })
    }

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username iwe na angalau herufi 3.",
      })
    }

    if (!["admin", "super_admin"].includes(finalRole)) {
      return res.status(400).json({
        success: false,
        message: "Role ya admin si sahihi.",
      })
    }

    if (!isStrongPassword(password || "")) {
      return res.status(400).json({
        success: false,
        message:
          "Neno la siri liwe na angalau herufi 8, herufi kubwa, herufi ndogo, namba na alama maalum.",
      })
    }

    const existingAdmin = await query(
      `
      SELECT id, email, username
      FROM admins
      WHERE LOWER(email) = LOWER($1)
         OR LOWER(username) = LOWER($2)
      LIMIT 1
      `,
      [email.trim(), username.trim()]
    )

    if (existingAdmin.rows.length > 0) {
      const existing = existingAdmin.rows[0]

      if (existing.email.toLowerCase() === email.trim().toLowerCase()) {
        return res.status(409).json({
          success: false,
          message: "Email hii tayari imesajiliwa.",
        })
      }

      return res.status(409).json({
        success: false,
        message: "Username hii tayari imetumika.",
      })
    }

    const passwordHash = await hashPassword(password)

    const result = await query(
      `
      INSERT INTO admins (
        full_name,
        email,
        username,
        password_hash,
        role,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING
        id,
        full_name,
        email,
        username,
        role,
        is_active,
        created_at,
        updated_at
      `,
      [
        fullName.trim(),
        email.trim(),
        username.trim(),
        passwordHash,
        finalRole,
      ]
    )

    const createdAdmin = formatAdmin(result.rows[0])

    await logAdminAction({
      admin: req.user,
      action: "CREATE_ADMIN",
      targetType: "admin",
      targetId: createdAdmin.id,
      targetName: createdAdmin.username,
      description: `${createdAdmin.username} created by super admin.`,
      metadata: {
        createdAdminId: createdAdmin.id,
        fullName: createdAdmin.fullName,
        email: createdAdmin.email,
        username: createdAdmin.username,
        role: createdAdmin.role,
        isActive: createdAdmin.isActive,
      },
    })

    return res.status(201).json({
      success: true,
      message: "Admin mpya ameongezwa kikamilifu.",
      admin: createdAdmin,
    })
  } catch (error) {
    console.error("Create admin error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kuongeza admin.",
      error: error.message,
    })
  }
}

async function updateAdminStatus(req, res) {
  try {
    const { id } = req.params
    const { isActive } = req.body

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Status ya admin si sahihi.",
      })
    }

    if (id === req.user.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Huwezi kuzima akaunti yako mwenyewe.",
      })
    }

    const result = await query(
      `
      UPDATE admins
      SET
        is_active = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        full_name,
        email,
        username,
        role,
        is_active,
        created_at,
        updated_at
      `,
      [isActive, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin hajapatikana.",
      })
    }

    const updatedAdmin = formatAdmin(result.rows[0])

    await logAdminAction({
      admin: req.user,
      action: isActive ? "ENABLE_ADMIN" : "DISABLE_ADMIN",
      targetType: "admin",
      targetId: updatedAdmin.id,
      targetName: updatedAdmin.username,
      description: isActive
        ? `${updatedAdmin.username} enabled by super admin.`
        : `${updatedAdmin.username} disabled by super admin.`,
      metadata: {
        updatedAdminId: updatedAdmin.id,
        fullName: updatedAdmin.fullName,
        email: updatedAdmin.email,
        username: updatedAdmin.username,
        role: updatedAdmin.role,
        isActive: updatedAdmin.isActive,
      },
    })

    return res.json({
      success: true,
      message: isActive
        ? "Admin amewezeshwa kikamilifu."
        : "Admin amezimwa kikamilifu.",
      admin: updatedAdmin,
    })
  } catch (error) {
    console.error("Update admin status error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kubadilisha status ya admin.",
      error: error.message,
    })
  }
}

module.exports = {
  getAdmins,
  createAdmin,
  updateAdminStatus,
}