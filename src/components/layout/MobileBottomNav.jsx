import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home,
  Menu,
  ShoppingBag,
  ShoppingCart,
  Store,
} from "lucide-react"

import { StorageService } from "../../services/storageService"

const navItems = [
  {
    key: "soko",
    label: "Soko",
    icon: Home,
    path: "/soko",
  },
  {
    key: "stores",
    label: "Maduka",
    icon: Store,
    path: "/soko",
  },
  {
    key: "cart",
    label: "Kikapu",
    icon: ShoppingCart,
    path: "/cart",
  },
  {
    key: "vendor",
    label: "Duka",
    icon: ShoppingBag,
    path: "/vendor/login",
  },
  {
    key: "menu",
    label: "Menu",
    icon: Menu,
    path: "/",
  },
]

function getCartCount() {
  const cart = StorageService.getCart()

  if (!Array.isArray(cart)) {
    return 0
  }

  return cart.reduce((total, item) => {
    return total + Number(item.quantity || 0)
  }, 0)
}

function MobileBottomNav({ active = "soko" }) {
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(() => getCartCount())

  useEffect(() => {
    function updateCartCount() {
      setCartCount(getCartCount())
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        updateCartCount()
      }
    }

    updateCartCount()

    window.addEventListener("storage", updateCartCount)
    window.addEventListener("focus", updateCartCount)
    window.addEventListener("clovenet-cart-updated", updateCartCount)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("focus", updateCartCount)
      window.removeEventListener("clovenet-cart-updated", updateCartCount)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  function handleNavigate(path) {
    setCartCount(getCartCount())
    navigate(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 text-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          const showCartCount = item.key === "cart" && cartCount > 0

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavigate(item.path)}
              aria-label={item.label}
              className={`relative rounded-2xl px-2 py-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {showCartCount && (
                <span className="absolute right-2 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-yellow)] px-1 text-[10px] font-black text-[var(--color-navy)]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}

              <Icon size={18} strokeWidth={2.7} className="mx-auto mb-0.5" />
              <span className="block">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav