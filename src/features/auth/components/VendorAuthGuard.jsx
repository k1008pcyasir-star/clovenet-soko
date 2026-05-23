import { Navigate, Outlet } from "react-router-dom"

import { vendorApiService } from "../../../services/vendorApiService"

function VendorAuthGuard() {
  const token = vendorApiService.getVendorToken()
  const vendor = vendorApiService.getCurrentVendor()

  if (!token || !vendor) {
    vendorApiService.logoutVendor()
    return <Navigate to="/vendor/login" replace />
  }

  const isVerified = vendor.status === "verified"
  const isSuspended = vendor.status === "suspended"

  if (!isVerified || isSuspended) {
    vendorApiService.logoutVendor()
    return <Navigate to="/vendor/login" replace />
  }

  return <Outlet />
}

export default VendorAuthGuard