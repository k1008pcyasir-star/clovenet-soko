import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  Activity,
  BarChart3,
  KeyRound,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  UserCog,
  UsersRound,
  X,
} from "lucide-react"

import BrandLogo from "../brand/BrandLogo"
import { AdminApiService } from "../../services/adminApiService"

const baseAdminNavItems = [
  {
    label: "Dashboard",
    icon: BarChart3,
    path: "/admin/dashboard",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/admin/orders",
  },
  {
    label: "Vendors",
    icon: UsersRound,
    path: "/admin/vendors",
  },
  {
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
]

const superAdminBottomItems = [
  {
    label: "OTPs",
    icon: KeyRound,
    path: "/admin/otps",
  },
]

const superAdminMenuItems = [
  {
    label: "Admins",
    icon: UserCog,
    path: "/admin/users",
  },
  {
    label: "Logs",
    icon: Activity,
    path: "/admin/logs",
  },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const currentAdmin = AdminApiService.getCurrentAdmin()
  const isSuperAdmin = currentAdmin?.role === "super_admin"

  const adminNavItems = isSuperAdmin
    ? [...baseAdminNavItems, ...superAdminBottomItems]
    : baseAdminNavItems

  const menuItems = isSuperAdmin ? superAdminMenuItems : []

  function handleLogout() {
    AdminApiService.logoutAdmin()
    localStorage.removeItem("clovenet_soko_admin_logged_in")
    navigate("/admin")
  }

  function isActive(path) {
    return location.pathname === path
  }

  function goTo(path) {
    setShowAdminMenu(false)
    navigate(path)
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-24 text-[var(--color-text)] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <BrandLogo
            title="CloveNet Soko"
            subtitle={
              isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"
            }
            showSubtitle
            iconSize="md"
            textSize="sm"
            onClick={() => navigate("/admin/dashboard")}
          />

          <nav className="hidden items-center gap-2 md:flex">
            {adminNavItems.map((item) => {
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

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAdminMenu((current) => !current)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-[var(--color-navy)] shadow-sm transition md:h-11 md:w-11 ${
                showAdminMenu
                  ? "border-[var(--color-green)] bg-[var(--color-green-soft)]"
                  : "border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)]"
              }`}
              aria-label="Fungua admin menu"
              aria-expanded={showAdminMenu}
            >
              {showAdminMenu ? (
                <X size={20} strokeWidth={2.8} />
              ) : (
                <Menu size={20} strokeWidth={2.8} />
              )}
            </button>

            {showAdminMenu && (
              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-[1.4rem] border border-[var(--color-border)] bg-white p-2 shadow-xl shadow-slate-900/10">
                {menuItems.length > 0 && (
                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path)

                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => goTo(item.path)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black transition ${
                            active
                              ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                              : "text-gray-700 hover:bg-[var(--color-bg)] hover:text-[var(--color-navy)]"
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                            <Icon size={17} strokeWidth={2.7} />
                          </span>

                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {menuItems.length > 0 && (
                  <div className="my-2 h-px bg-[var(--color-border)]" />
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black text-red-600 transition hover:bg-red-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <LogOut size={17} strokeWidth={2.7} />
                  </span>

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      {showAdminMenu && (
        <button
          type="button"
          onClick={() => setShowAdminMenu(false)}
          className="fixed inset-0 z-20 cursor-default md:hidden"
          aria-label="Funga admin menu"
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white px-2 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] md:hidden">
        <div
          className={`mx-auto grid max-w-md gap-1 text-center ${
            adminNavItems.length === 5 ? "grid-cols-5" : "grid-cols-4"
          }`}
        >
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`rounded-2xl px-1.5 py-2 text-[10.5px] font-black transition ${
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

                <span className="block truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}

export default AdminLayout