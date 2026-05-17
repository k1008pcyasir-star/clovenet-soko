import { Navigate, Route, Routes } from "react-router-dom"

import AdminLayout from "../components/layout/AdminLayout"
import MarketplaceLayout from "../components/layout/MarketplaceLayout"
import PublicLayout from "../components/layout/PublicLayout"
import VendorLayout from "../components/layout/VendorLayout"

import AdminAuthGuard from "../features/auth/components/AdminAuthGuard"
import VendorAuthGuard from "../features/auth/components/VendorAuthGuard"
import AdminLoginPage from "../features/auth/pages/AdminLoginPage"
import VendorLoginPage from "../features/auth/pages/VendorLoginPage"

import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage"
import AdminProductsPage from "../features/admin/pages/AdminProductsPage"
import AdminVendorsPage from "../features/admin/pages/AdminVendorsPage"

import CartPage from "../features/cart/pages/CartPage"
import CustomerPage from "../features/customer/pages/CustomerPage"
import StorePage from "../features/customer/pages/StorePage"
import EntryPage from "../features/landing/pages/EntryPage"
import ProductDetailPage from "../features/products/pages/ProductDetailPage"

import SupportPage from "../features/support/pages/SupportPage"
import PrivacyPage from "../features/legal/pages/PrivacyPage"
import TermsPage from "../features/legal/pages/TermsPage"

import VendorDashboardPage from "../features/vendor/pages/VendorDashboardPage"
import VendorProductsPage from "../features/vendor/pages/VendorProductsPage"
import VendorProfilePage from "../features/vendor/pages/VendorProfilePage"
import VendorRegisterPage from "../features/vendor/pages/VendorRegisterPage"

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<EntryPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/vendor/login" element={<VendorLoginPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Marketplace */}
      <Route element={<MarketplaceLayout />}>
        <Route path="/soko" element={<CustomerPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/store/:id" element={<StorePage />} />
      </Route>

      {/* Vendor */}
      <Route element={<VendorAuthGuard />}>
        <Route element={<VendorLayout />}>
          <Route
            path="/vendor"
            element={<Navigate to="/vendor/dashboard" replace />}
          />
          <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="/vendor/products" element={<VendorProductsPage />} />
          <Route path="/vendor/profile" element={<VendorProfilePage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLoginPage />} />

      <Route element={<AdminAuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/vendors" element={<AdminVendorsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes