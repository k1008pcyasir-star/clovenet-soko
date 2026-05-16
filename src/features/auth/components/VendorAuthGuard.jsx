import { Navigate, Outlet } from "react-router-dom"

import { StorageService } from "../../../services/storageService"

function VendorAuthGuard() {
  const currentVendorId = StorageService.getCurrentVendorId()

  if (!currentVendorId) {
    return <Navigate to="/vendor/login" replace />
  }

  const vendors = StorageService.getVendors()
  const vendor = vendors.find((item) => item.id === currentVendorId)

  if (!vendor) {
    StorageService.clearCurrentVendorId()
    return <Navigate to="/vendor/login" replace />
  }

  const isVerified = vendor.status === "verified" || vendor.isVerified
  const isSuspended = vendor.status === "suspended"

  if (!isVerified || isSuspended) {
    StorageService.clearCurrentVendorId()
    return <Navigate to="/vendor/login" replace />
  }

  return <Outlet />
}

export default VendorAuthGuard