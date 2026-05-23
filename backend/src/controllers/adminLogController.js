const { query } = require("../config/db")

function formatAdminLog(row) {
  return {
    id: row.id,
    adminId: row.admin_id,
    adminUsername: row.admin_username,
    adminRole: row.admin_role,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    targetName: row.target_name,
    description: row.description,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  }
}

async function getAdminLogs(req, res) {
  try {
    const result = await query(
      `
      SELECT
        id,
        admin_id,
        admin_username,
        admin_role,
        action,
        target_type,
        target_id,
        target_name,
        description,
        metadata,
        created_at
      FROM admin_logs
      ORDER BY created_at DESC
      LIMIT 100
      `
    )

    return res.json({
      success: true,
      logs: result.rows.map(formatAdminLog),
    })
  } catch (error) {
    console.error("Get admin logs error:", error)

    return res.status(500).json({
      success: false,
      message: "Imeshindikana kupata admin logs.",
      error: error.message,
    })
  }
}

module.exports = {
  getAdminLogs,
}