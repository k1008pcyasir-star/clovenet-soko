import { useNavigate } from "react-router-dom"
import {
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Store,
} from "lucide-react"

import BrandLogo from "../brand/BrandLogo"

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="mt-8 bg-[var(--color-navy)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <BrandLogo
            light
            showSubtitle
            iconSize="md"
            textSize="lg"
            subtitle="WhatsApp-first marketplace"
            onClick={() => navigate("/")}
          />

          <p className="mt-5 max-w-xs text-sm font-medium leading-7 text-slate-400">
            Nunua, uza na simamia bidhaa zako kupitia marketplace rahisi kwa
            wateja na wafanyabiashara wa Tanzania.
          </p>

          <button
            type="button"
            onClick={() => navigate("/support")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
          >
            <MessageCircle size={17} strokeWidth={2.7} />
            Pata Msaada
          </button>
        </div>

        <div>
          <h4 className="text-lg font-black">Quick Links</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="block transition hover:text-[var(--color-green)]"
            >
              Angalia Bidhaa
            </button>

            <button
              type="button"
              onClick={() => navigate("/soko")}
              className="block transition hover:text-[var(--color-green)]"
            >
              Maduka
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="block transition hover:text-[var(--color-green)]"
            >
              Kikapu
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-black">Kwa Wafanyabiashara</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => navigate("/vendor/register")}
              className="flex items-center gap-2 transition hover:text-[var(--color-green)]"
            >
              <Store size={15} strokeWidth={2.6} />
              Fungua Duka Lako
            </button>

            <button
              type="button"
              onClick={() => navigate("/vendor/login")}
              className="flex items-center gap-2 transition hover:text-[var(--color-green)]"
            >
              <ShieldCheck size={15} strokeWidth={2.6} />
              Ingia Dukani
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-black">Support</h4>

          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="flex items-center gap-2 transition hover:text-[var(--color-green)]"
            >
              <MessageCircle size={15} strokeWidth={2.6} />
              Mawasiliano
            </button>

            <button
              type="button"
              onClick={() => navigate("/support")}
              className="flex items-center gap-2 transition hover:text-[var(--color-green)]"
            >
              <HelpCircle size={15} strokeWidth={2.6} />
              Help Center
            </button>

            <button
              type="button"
              onClick={() => navigate("/support")}
              className="flex items-center gap-2 transition hover:text-[var(--color-green)]"
            >
              <ShieldCheck size={15} strokeWidth={2.6} />
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-5 text-center text-xs font-semibold text-slate-500 md:px-6">
        © 2026 CloveNet Soko. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer