import { useLocation, useNavigate } from "react-router-dom"
import {
  FileText,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Store,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react"

import BrandLogo from "../brand/BrandLogo"

function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = (path) => {
    const currentPath = `${location.pathname}${location.hash}`

    // Kama user yupo tayari kwenye route hiyo hiyo,
    // mpeleke juu instantly bila animation
    if (currentPath === path || location.pathname === path) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      })
      return
    }

    navigate(path)
  }

  return (
    <footer className="mt-8 bg-[var(--color-navy)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <BrandLogo
            light
            showSubtitle
            iconSize="md"
            textSize="lg"
            subtitle="WhatsApp-first marketplace"
            onClick={() => goTo("/")}
          />

          <p className="mt-5 max-w-xs text-sm font-medium leading-7 text-slate-400">
            Nunua, uza na simamia bidhaa zako kupitia marketplace rahisi kwa
            wateja na wafanyabiashara wa Tanzania.
          </p>

          <button
            type="button"
            onClick={() => goTo("/support")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
          >
            <MessageCircle size={17} strokeWidth={2.7} />
            Pata Msaada
          </button>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-black">Quick Links</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <FooterButton onClick={() => goTo("/soko")}>
              <ShoppingBag size={15} strokeWidth={2.6} />
              Angalia Bidhaa
            </FooterButton>

            <FooterButton onClick={() => goTo("/soko")}>
              <Store size={15} strokeWidth={2.6} />
              Maduka
            </FooterButton>

            <FooterButton onClick={() => goTo("/cart")}>
              <ShoppingCart size={15} strokeWidth={2.6} />
              Kikapu
            </FooterButton>

            <FooterButton onClick={() => goTo("/#why-us")}>
              <ShieldCheck size={15} strokeWidth={2.6} />
              Kwa Nini CloveNet Soko?
            </FooterButton>
          </div>
        </div>

        {/* Vendor Links */}
        <div>
          <h4 className="text-lg font-black">Kwa Wafanyabiashara</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <FooterButton onClick={() => goTo("/vendor/register")}>
              <Store size={15} strokeWidth={2.6} />
              Fungua Duka Lako
            </FooterButton>

            <FooterButton onClick={() => goTo("/vendor/login")}>
              <ShieldCheck size={15} strokeWidth={2.6} />
              Ingia Dukani
            </FooterButton>

            <FooterButton onClick={() => goTo("/support")}>
              <HelpCircle size={15} strokeWidth={2.6} />
              Mwongozo wa Wauzaji
            </FooterButton>
          </div>
        </div>

        {/* Support and Legal */}
        <div>
          <h4 className="text-lg font-black">Msaada na Taarifa</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <FooterButton onClick={() => goTo("/support")}>
              <MessageCircle size={15} strokeWidth={2.6} />
              Mawasiliano
            </FooterButton>

            <FooterButton onClick={() => goTo("/privacy")}>
              <ShieldCheck size={15} strokeWidth={2.6} />
              Privacy Policy
            </FooterButton>

            <FooterButton onClick={() => goTo("/terms")}>
              <FileText size={15} strokeWidth={2.6} />
              Masharti ya Matumizi
            </FooterButton>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-5 text-center text-xs font-semibold text-slate-500 md:px-6">
        © 2026 CloveNet Soko. All rights reserved.
      </div>
    </footer>
  )
}

function FooterButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-left transition hover:text-[var(--color-green)]"
    >
      {children}
    </button>
  )
}

export default Footer