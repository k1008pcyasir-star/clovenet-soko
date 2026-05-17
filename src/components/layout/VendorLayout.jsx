import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BarChart3,
  LogOut,
  Package,
  UserRound,
} from "lucide-react"

import BrandLogo from "../brand/BrandLogo"
import { StorageService } from "../../services/storageService"

const vendorNavItems = [
  {
    label: "Dashboard",
    icon: BarChart3,
    path: "/vendor/dashboard",
  },
  {
    label: "Bidhaa",
    icon: Package,
    path: "/vendor/products",
  },
  {
    label: "Profile",
    icon: UserRound,
    path: "/vendor/profile",
  },
]

function VendorLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    StorageService.clearCurrentVendorId()
    navigate("/vendor/login")
  }

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-24 text-[var(--color-text)] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <BrandLogo
            title="CloveNet Soko"
            subtitle="Vendor Dashboard"
            showSubtitle
            iconSize="md"
            textSize="sm"
            onClick={() => navigate("/vendor/dashboard")}
          />

          <nav className="hidden items-center gap-2 md:flex">
            {vendorNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                    active
                      ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                      : "text-gray-600 hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)]"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.7} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 md:inline-flex"
          >
            <LogOut size={15} strokeWidth={2.7} />
            Logout
          </button>
        </div>
      </header>

      <Outlet />

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 text-center">
          {vendorNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`rounded-2xl px-2 py-2 text-xs font-black transition ${
                  active
                    ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                    : "text-gray-500 hover:bg-[var(--color-green-soft)] hover:text-[var(--color-green-dark)]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={2.7}
                  className="mx-auto mb-0.5"
                />
                <span className="block">{item.label}</span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl px-2 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
          >
            <LogOut
              size={18}
              strokeWidth={2.7}
              className="mx-auto mb-0.5"
            />
            <span className="block">Logout</span>
          </button>
        </div>
      </nav>
    </main>
  )
}

export default VendorLayout