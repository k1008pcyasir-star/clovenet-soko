require("dotenv").config()

const { query, pool } = require("../config/db")
const { hashPassword } = require("../utils/auth")

async function seedAdmin() {
  try {
    const username = "admin"
    const password = "CloveNet@Admin2026"

    const existingAdmin = await query(
      `
      SELECT id
      FROM admins
      WHERE username = $1
      LIMIT 1
      `,
      [username]
    )

    if (existingAdmin.rows.length > 0) {
      console.log("Admin already exists.")
      return
    }

    const passwordHash = await hashPassword(password)

    const result = await query(
      `
      INSERT INTO admins (
        full_name,
        email,
        username,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, username, role, created_at
      `,
      [
        "CloveNet Admin",
        "admin@clovenetsoko.local",
        username,
        passwordHash,
        "admin",
      ]
    )

    console.log("Admin created successfully:")
    console.log(result.rows[0])
    console.log("")
    console.log("Login credentials:")
    console.log("Username:", username)
    console.log("Password:", password)
  } catch (error) {
    console.error("Seed admin error:", error)
  } finally {
    await pool.end()
  }
}

seedAdmin()