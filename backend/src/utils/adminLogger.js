const { query } = require("../config/db")

async function logAdminAction({
  admin,
  action,
  targetType = null,
  targetId = null,
  targetName = null,
  description = "",
  metadata = {},
}) {
  try {
    await query(
      `
      INSERT INTO admin_logs (
        admin_id,
        admin_username,
        admin_role,
        action,
        target_type,
        target_id,
        target_name,
        description,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        admin?.id || null,
        admin?.username || null,
        admin?.role || null,
        action,
        targetType,
        targetId,
        targetName,
        description,
        JSON.stringify(metadata || {}),
      ]
    )
  } catch (error) {
    console.error("Admin log error:", error.message)
  }
}

module.exports = {
  logAdminAction,
}