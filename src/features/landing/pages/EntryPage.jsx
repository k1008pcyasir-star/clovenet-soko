import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Menu,
  Search,
  ShoppingBag,
  Store,
  UserRound,
  UserPlus,
  HelpCircle,
  X,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Laptop,
  Smartphone,
  Headphones,
  Shirt,
  Plug,
  MapPin,
  CheckCheck,
} from "lucide-react"

const categories = [
  { name: "Laptop", icon: Laptop },
  { name: "Simu", icon: Smartphone },
  { name: "Accessories", icon: Headphones },
  { name: "Fashion", icon: Shirt },
  { name: "Electronics", icon: Plug },
]

const actions = [
  {
    title: "Anza Kununua",
    subtitle: "Tafuta bidhaa kutoka kwenye maduka yaliyopo CloveNet Soko.",
    icon: ShoppingBag,
    bg: "bg-[var(--color-green-soft)]",
    path: "/soko",
  },
  {
    title: "Fungua Duka Lako",
    subtitle: "Jiunge kama mfanyabiashara na upate mini-store yako.",
    icon: Store,
    bg: "bg-[var(--color-green-soft)]",
    path: "/vendor/register",
  },
  {
    title: "Ingia Dukani",
    subtitle: "Simamia bidhaa, taarifa za duka na orders zako.",
    icon: UserRound,
    bg: "bg-[var(--color-bg-soft)]",
    path: "/vendor/login",
  },
  {
    title: "Msaada",
    subtitle: "Pata maelekezo ya kutumia CloveNet Soko kwa urahisi.",
    icon: HelpCircle,
    bg: "bg-[var(--color-green-soft)]",
    path: "/support",
  },
]

const steps = [
  {
    num: "1",
    title: "Tafuta bidhaa",
    desc: "Vinjari bidhaa sokoni. Chuja kwa aina, bei au duka unalolitaka.",
    icon: Search,
    tag: "Browse",
  },
  {
    num: "2",
    title: "Weka kikapuni",
    desc: "Chagua bidhaa moja au zaidi. Tazama jumla yako kabla ya kuagiza.",
    icon: ShoppingBag,
    tag: "Cart",
  },
  {
    num: "3",
    title: "Agiza kwa WhatsApp",
    desc: "Ujumbe wa order unatengenezwa moja kwa moja na kutumwa kwa vendor kupitia WhatsApp.",
    icon: MessageCircle,
    tag: "WhatsApp",
  },
]

const stats = [
  { value: "Pilot", label: "Hatua ya mwanzo" },
  { value: "0", label: "Maduka yaliyoongezwa" },
  { value: "24/7", label: "Platform online" },
]

const trustBadges = [
  { label: "Verification ya maduka", icon: ShieldCheck },
  { label: "WhatsApp-first", icon: MessageCircle },
  { label: "Tanzania", icon: MapPin },
]

const mobileMenuItems = [
  {
    label: "Browse / Nunua",
    path: "/soko",
    icon: ShoppingBag,
  },
  {
    label: "Login / Ingia",
    path: "/vendor/login",
    icon: UserRound,
  },
  {
    label: "Signup / Fungua Duka",
    path: "/vendor/register",
    icon: UserPlus,
  },
  {
    label: "Support / Msaada",
    path: "/support",
    icon: HelpCircle,
  },
]

function EntryPage() {
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  function closeMobilePanels() {
    setShowMobileSearch(false)
    setShowMobileMenu(false)
  }

  function goTo(path) {
    navigate(path)
    closeMobilePanels()
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    const query = searchVal.trim()

    if (!query) return

    navigate(`/soko?q=${encodeURIComponent(query)}`)
    closeMobilePanels()
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo("/")}
              className="flex min-w-0 items-center gap-3 rounded-2xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
              aria-label="Nenda ukurasa wa mwanzo"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm">
                <Store size={22} strokeWidth={2.6} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-black leading-tight tracking-tight md:text-lg">
                  CloveNet Soko
                </p>
              </div>
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden flex-1 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 shadow-sm transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 md:flex md:max-w-xl"
            >
              <Search size={17} className="text-gray-400" />

              <input
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                placeholder="Tafuta bidhaa au duka..."
                className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="rounded-xl bg-[var(--color-navy)] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[var(--color-green-dark)]"
              >
                Tafuta
              </button>
            </form>

            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={() => goTo("/soko")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Browse
              </button>

              <button
                type="button"
                onClick={() => goTo("/support")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Support
              </button>

              <button
                type="button"
                onClick={() => goTo("/vendor/login")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => goTo("/vendor/register")}
                className="rounded-2xl bg-[var(--color-green)] px-4 py-2.5 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Signup
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => {
                  setShowMobileSearch((current) => !current)
                  setShowMobileMenu(false)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-navy)] shadow-sm transition hover:border-[var(--color-green)]"
                aria-label="Fungua sehemu ya kutafuta"
                aria-expanded={showMobileSearch}
                aria-controls="entry-mobile-search"
              >
                {showMobileSearch ? (
                  <X size={19} strokeWidth={2.7} />
                ) : (
                  <Search size={19} strokeWidth={2.7} />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu((current) => !current)
                  setShowMobileSearch(false)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm transition hover:bg-[var(--color-green-dark)]"
                aria-label="Fungua menu"
                aria-expanded={showMobileMenu}
                aria-controls="entry-mobile-menu"
              >
                {showMobileMenu ? (
                  <X size={20} strokeWidth={2.8} />
                ) : (
                  <Menu size={20} strokeWidth={2.8} />
                )}
              </button>
            </div>
          </div>

          {showMobileSearch && (
            <form
              id="entry-mobile-search"
              onSubmit={handleSearchSubmit}
              className="mt-3 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-3 py-2.5 shadow-sm transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 md:hidden"
            >
              <Search size={17} className="text-gray-400" />

              <input
                autoFocus
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                placeholder="Tafuta bidhaa au duka..."
                className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-navy)] text-white"
                aria-label="Tafuta"
              >
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </form>
          )}

          {showMobileMenu && (
            <div
              id="entry-mobile-menu"
              className="mt-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white p-2 shadow-sm md:hidden"
            >
              {mobileMenuItems.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black text-gray-700 transition hover:bg-[var(--color-green-soft)] hover:text-[var(--color-green-dark)]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-bg)] text-[var(--color-navy)]">
                      <Icon size={18} strokeWidth={2.6} />
                    </span>

                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <section className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-navy)] p-6 text-white shadow-xl shadow-slate-300/40 md:p-10">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-green)]/20 blur-2xl" />
            <div className="absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-[var(--color-green)]/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10">
                <MapPin size={13} strokeWidth={2.6} />
                Tanzania · WhatsApp-first marketplace
              </span>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Nunua na uza kwa urahisi kupitia WhatsApp.
              </h1>

              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
                CloveNet Soko inaunganisha maduka na wateja. Bidhaa zinaonekana
                online, na order inaenda moja kwa moja kwa vendor kupitia
                WhatsApp.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => goTo("/soko")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] shadow-sm transition hover:bg-[var(--color-green-dark)] hover:text-white"
                >
                  Anza Kununua
                  <ArrowRight size={17} strokeWidth={2.7} />
                </button>

                <button
                  type="button"
                  onClick={() => goTo("/vendor/register")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  Fungua Duka Lako
                  <ArrowRight size={17} strokeWidth={2.7} />
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                <MessageCircle size={22} strokeWidth={2.4} />
              </div>

              <div>
                <h2 className="text-sm font-black">Orders zinaenda WhatsApp</h2>

                <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                  Mteja akichagua bidhaa, ujumbe wa order unaandaliwa na
                  kutumwa moja kwa moja kwa vendor.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-[var(--color-bg)] p-4">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
                  Kwa mfanyabiashara
                </p>

                <p className="mt-1 text-sm font-black text-gray-950">
                  Fungua mini-store yako na weka bidhaa zako mtandaoni.
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-green-soft)] p-4">
                <p className="text-[11px] font-black uppercase tracking-wide text-[var(--color-green-dark)]">
                  Verification
                </p>

                <p className="mt-1 text-sm font-black text-gray-950">
                  Maduka yanahakikiwa ili kuongeza uaminifu kwa wateja.
                </p>
              </div>

              <button
                type="button"
                onClick={() => goTo("/vendor/register")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-navy-soft)]"
              >
                Jiunge kama Vendor
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Categories
              </p>

              <h2 className="mt-1 text-lg font-black">
                Angalia bidhaa kwa aina
              </h2>
            </div>

            <button
              type="button"
              onClick={() => goTo("/soko")}
              className="hidden items-center gap-1 rounded-2xl bg-[var(--color-green-soft)] px-4 py-2 text-xs font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green)] hover:text-[var(--color-navy)] md:inline-flex"
            >
              Angalia Soko
              <ArrowRight size={15} strokeWidth={2.7} />
            </button>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    goTo(`/soko?category=${encodeURIComponent(category.name)}`)
                  }
                  className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-gray-700 transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                >
                  <Icon size={17} strokeWidth={2.5} />
                  {category.name}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => goTo("/soko")}
              className="flex shrink-0 items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green-soft)]"
            >
              Zote
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-3">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Quick actions
            </p>

            <h2 className="mt-1 text-lg font-black">Unataka kufanya nini?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {actions.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => goTo(item.path)}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-green)] hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} text-[var(--color-navy)]`}
                  >
                    <Icon size={21} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-sm font-black text-gray-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    {item.subtitle}
                  </p>

                  <p className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[var(--color-green-dark)]">
                    Endelea
                    <ArrowRight size={14} strokeWidth={2.7} />
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Mchakato
            </p>

            <h2 className="mt-1 text-lg font-black">Jinsi inavyofanya kazi</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:items-start">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.num}
                  className="rounded-[1.6rem] border border-[var(--color-border)] bg-[var(--color-bg)] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs font-black text-white">
                        {step.num}
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--color-navy)] shadow-sm">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-gray-500">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-black text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                    {step.desc}
                  </p>

                  {step.num === "3" && (
                    <div className="mt-4 rounded-2xl bg-[#DCF8C6] p-3">
                      <p className="mb-1 text-[10px] font-black text-green-800">
                        Mfano wa ujumbe:
                      </p>

                      <p className="text-[11px] font-semibold leading-5 text-gray-800">
                        Habari, nahitaji kuagiza bidhaa hii kutoka CloveNet
                        Soko:
                        <br />
                        1. HP EliteBook 840 G6 × 1 = TZS 980,000
                        <br />
                        <br />
                        Jumla: TZS 980,000
                        <br />
                        Tafadhali nisaidie upatikanaji na delivery.
                      </p>

                      <p className="mt-2 flex items-center justify-end gap-1 text-[10px] font-semibold text-green-700">
                        <CheckCheck size={13} strokeWidth={2.7} />
                        Imetumwa
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] bg-[var(--color-navy)] p-5 text-white md:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-green)]">
                Takwimu
              </p>

              <h2 className="mt-1 text-lg font-black">
                CloveNet Soko Tanzania
              </h2>

              <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                Tupo kwenye hatua ya mwanzo ya kujenga marketplace yenye ubora,
                verification ya maduka, na mfumo rahisi wa orders kupitia
                WhatsApp.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon

                  return (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[var(--color-green)] ring-1 ring-white/10"
                    >
                      <Icon size={13} strokeWidth={2.5} />
                      {badge.label}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-center md:text-right"
                >
                  <p className="text-2xl font-black text-[var(--color-green)] md:text-3xl">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default EntryPage