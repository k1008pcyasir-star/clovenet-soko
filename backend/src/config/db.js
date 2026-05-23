const { Pool } = require("pg")

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function query(text, params) {
  const start = Date.now()

  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start

    if (process.env.NODE_ENV === "development") {
      console.log("Executed query", {
        text,
        duration,
        rows: result.rowCount,
      })
    }

    return result
  } catch (error) {
    console.error("Database query error:", error.message)
    throw error
  }
}

async function testConnection() {
  const result = await query("SELECT NOW() AS current_time")
  return result.rows[0]
}

module.exports = {
  pool,
  query,
  testConnection,
}