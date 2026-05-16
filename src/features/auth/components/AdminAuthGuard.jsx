import { Navigate, Outlet } from "react-router-dom"

const ADMIN_AUTH_KEY = "clovenet_soko_admin_logged_in"

function AdminAuthGuard() {
  const isAdminLoggedIn = localStorage.getItem(ADMIN_AUTH_KEY) === "true"

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default AdminAuthGuard