import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  UserPlus,
  UserRound,
  X,
} from "lucide-react"

import BrandLogo from "../../../components/brand/BrandLogo"
import { PublicApiService } from "../../../services/publicApiService"

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
    title: "Chagua bidhaa",
    desc: "Vinjari bidhaa na fungua unachohitaji kwa urahisi.",
    icon: Search,
    tag: "Browse",
  },
  {
    num: "2",
    title: "Weka order",
    desc: "Chagua bidhaa moja au zaidi kulingana na mahitaji yako.",
    icon: ShoppingBag,
    tag: "Order",
  },
  {
    num: "3",
    title: "Endelea WhatsApp",
    desc: "Order inahifadhiwa kwanza, kisha unaendelea kwa vendor.",
    icon: MessageCircle,
    tag: "WhatsApp",
  },
]

const whyItems = [
  {
    title: "Rahisi kwa mteja",
    desc: "Mteja anaona bidhaa na kuendelea na order bila mchakato mgumu.",
    icon: ShoppingBag,
  },
  {
    title: "Maduka sehemu moja",
    desc: "Bidhaa kutoka vendors mbalimbali zinaonekana sehemu moja.",
    icon: Store,
  },
  {
    title: "WhatsApp-first",
    desc: "Mawasiliano ya biashara yanaendelea kwenye WhatsApp.",
    icon: MessageCircle,
  },
  {
    title: "Uaminifu zaidi",
    desc: "Verification ya maduka inasaidia kuongeza imani kwa wateja.",
    icon: ShieldCheck,
  },
]

const trustBadges = [
  { label: "Maduka yaliyohakikiwa", icon: ShieldCheck },
  { label: "Order kupitia WhatsApp", icon: MessageCircle },
  { label: "Tanzania", icon: MapPin },
]

const mobileMenuItems = [
  {
    label: "Nunua",
    path: "/soko",
    icon: ShoppingBag,
  },
  {
    label: "Bidhaa Pendekezwa",
    sectionId: "featured-products",
    icon: Star,
  },
  {
    label: "Bidhaa Mpya",
    sectionId: "recent-products",
    icon: Package,
  },
  {
    label: "Aina za Bidhaa",
    sectionId: "categories",
    icon: SlidersHorizontal,
  },
  {
    label: "Kwa nini sisi?",
    sectionId: "why-us",
    icon: Sparkles,
  },
  {
    label: "Msaada",
    path: "/support",
    icon: HelpCircle,
  },
  {
    label: "Ingia",
    path: "/vendor/login",
    icon: UserRound,
  },
  {
    label: "Fungua Duka",
    path: "/vendor/register",
    icon: UserPlus,
  },
]

function formatCurrency(amount) {
  const numericAmount = Number(amount) || 0
  return `TZS ${numericAmount.toLocaleString("en-US")}`
}

function getProductImage(product) {
  const firstImage = product?.images?.[0]

  if (typeof firstImage === "string") return firstImage

  if (firstImage && typeof firstImage === "object") {
    return (
      firstImage.url ||
      firstImage.imageUrl ||
      firstImage.src ||
      firstImage.path ||
      ""
    )
  }

  return (
    product?.image ||
    product?.imageUrl ||
    product?.photo ||
    product?.photoUrl ||
    product?.coverImage ||
    product?.thumbnail ||
    product?.mainImage ||
    ""
  )
}

function getProductPrice(product) {
  return product?.price || product?.sellingPrice || product?.amount || 0
}

function getProductStoreName(product) {
  return (
    product?.vendor?.storeName ||
    product?.vendor?.businessName ||
    product?.vendor?.name ||
    product?.storeName ||
    product?.businessName ||
    product?.vendorName ||
    "CloveNet Vendor"
  )
}

function getProductLocation(product) {
  return (
    product?.vendor?.location ||
    product?.vendor?.region ||
    product?.vendor?.city ||
    product?.location ||
    product?.region ||
    product?.city ||
    "Tanzania"
  )
}

function isFeaturedProduct(product) {
  return Boolean(
    product?.isFeatured ||
      product?.featured ||
      product?.is_featured ||
      product?.featuredProduct
  )
}

function isProductVisible(product) {
  const status = String(product?.status || "").toLowerCase()
  const approvalStatus = String(product?.approvalStatus || "").toLowerCase()

  if (product?.isDeleted) return false
  if (status === "deleted") return false
  if (status === "hidden") return false
  if (status === "draft") return false
  if (approvalStatus === "rejected") return false

  return true
}

function normalizeProduct(product, index) {
  return {
    ...product,
    _id: product?.id || product?._id || product?.productId || `product-${index}`,
    _name: product?.name || product?.title || product?.productName || "Bidhaa",
    _category: product?.category || product?.categoryName || "Bidhaa",
    _price: getProductPrice(product),
    _image: getProductImage(product),
    _storeName: getProductStoreName(product),
    _location: getProductLocation(product),
    _specs: product?.specs || product?.description || "",
    _isFeatured: isFeaturedProduct(product),
    _createdAt:
      product?.createdAt ||
      product?.created_at ||
      product?.dateCreated ||
      product?.updatedAt ||
      "",
  }
}

function EntryPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [searchVal, setSearchVal] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setIsLoading(true)
      setError("")

      const productsData = await PublicApiService.getProducts()
      setAllProducts(Array.isArray(productsData) ? productsData : [])
    } catch (loadError) {
      setError(loadError.message || "Imeshindikana kupata bidhaa.")
      setAllProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const visibleProducts = useMemo(() => {
    return allProducts.filter(isProductVisible)
  }, [allProducts])

  const normalizedProducts = useMemo(() => {
    return visibleProducts.map(normalizeProduct)
  }, [visibleProducts])

  const featuredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => product._isFeatured)
  }, [normalizedProducts])

  const latestProducts = useMemo(() => {
    return [...normalizedProducts]
      .sort((a, b) => {
        const dateA = new Date(a._createdAt).getTime() || 0
        const dateB = new Date(b._createdAt).getTime() || 0
        return dateB - dateA
      })
      .slice(0, 8)
  }, [normalizedProducts])

  const recentProducts = useMemo(() => {
    return latestProducts.slice(0, 4)
  }, [latestProducts])

  const activeFeaturedProduct = featuredProducts[activeFeaturedIndex]

  const dynamicCategories = useMemo(() => {
    const uniqueCategories = normalizedProducts
      .map((product) => product._category)
      .filter(Boolean)

    return [...new Set(uniqueCategories)]
  }, [normalizedProducts])

  const verifiedVendors = useMemo(() => {
    const vendorsMap = new Map()

    visibleProducts.forEach((product) => {
      if (product.vendor?.id && !vendorsMap.has(product.vendor.id)) {
        vendorsMap.set(product.vendor.id, product.vendor)
      }
    })

    return Array.from(vendorsMap.values())
  }, [visibleProducts])

  useEffect(() => {
    setActiveFeaturedIndex(0)
  }, [featuredProducts.length])

  useEffect(() => {
    if (featuredProducts.length <= 1) return undefined

    const intervalId = window.setInterval(() => {
      setActiveFeaturedIndex((currentIndex) =>
        currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1
      )
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [featuredProducts.length])

  function closeMobilePanels() {
    setShowMobileSearch(false)
    setShowMobileMenu(false)
  }

  function forceInstantScrollToTop() {
    const html = document.documentElement
    const body = document.body

    const previousHtmlBehavior = html.style.scrollBehavior
    const previousBodyBehavior = body.style.scrollBehavior

    html.style.scrollBehavior = "auto"
    body.style.scrollBehavior = "auto"

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })

    html.style.scrollBehavior = previousHtmlBehavior
    body.style.scrollBehavior = previousBodyBehavior
  }

  function forceInstantScrollToSection(sectionId) {
    const html = document.documentElement
    const body = document.body

    const previousHtmlBehavior = html.style.scrollBehavior
    const previousBodyBehavior = body.style.scrollBehavior

    html.style.scrollBehavior = "auto"
    body.style.scrollBehavior = "auto"

    const section = document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: "auto",
        block: "start",
      })
    }

    html.style.scrollBehavior = previousHtmlBehavior
    body.style.scrollBehavior = previousBodyBehavior
  }

  function goTo(path) {
    closeMobilePanels()

    const currentPath = `${location.pathname}${location.search}${location.hash}`

    if (currentPath === path || location.pathname === path) {
      forceInstantScrollToTop()
      return
    }

    navigate(path)
  }

  function scrollToSection(sectionId) {
    closeMobilePanels()

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`)
      return
    }

    forceInstantScrollToSection(sectionId)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    const query = searchVal.trim()

    if (!query) return

    navigate(`/soko?q=${encodeURIComponent(query)}`)
    closeMobilePanels()
  }

  function openProduct(product) {
    if (!product) return
    navigate(`/soko?q=${encodeURIComponent(product._name)}`)
    closeMobilePanels()
  }

  function showPreviousFeatured() {
    if (featuredProducts.length <= 1) return

    setActiveFeaturedIndex((currentIndex) =>
      currentIndex === 0 ? featuredProducts.length - 1 : currentIndex - 1
    )
  }

  function showNextFeatured() {
    if (featuredProducts.length <= 1) return

    setActiveFeaturedIndex((currentIndex) =>
      currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <style>
        {`
          @keyframes clovenetSlideIn {
            from {
              opacity: 0;
              transform: translateX(24px) scale(0.985);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          @keyframes clovenetProgress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }

          .clovenet-slide-in {
            animation: clovenetSlideIn 520ms ease-out both;
          }

          .clovenet-slide-progress {
            animation: clovenetProgress 5200ms linear both;
          }
        `}
      </style>

      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo
              title="CloveNet Soko"
              iconSize="md"
              textSize="md"
              onClick={() => goTo("/")}
            />

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
                Nunua
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("featured-products")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Pendekezwa
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("recent-products")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Mpya
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("why-us")}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-white hover:text-[var(--color-navy)]"
              >
                Why Us
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
                Fungua Duka
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
                    key={item.path || item.sectionId}
                    type="button"
                    onClick={() =>
                      item.sectionId
                        ? scrollToSection(item.sectionId)
                        : goTo(item.path)
                    }
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

      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-7">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={18}
                strokeWidth={2.6}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-sm font-bold leading-5 text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        <section
          id="featured-products"
          className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-3 shadow-sm md:p-6"
        >
          <div className="mb-3 flex items-center justify-between gap-3 md:mb-4 md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[11px] font-black text-[var(--color-green-dark)]">
                <Star size={13} fill="currentColor" strokeWidth={2.7} />
                Featured Products
              </span>

              <h1 className="mt-3 hidden text-2xl font-black leading-tight text-gray-950 md:block md:text-4xl">
                Bidhaa zinazopendekezwa
              </h1>

              <p className="mt-2 hidden max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)] md:block">
                Gundua bidhaa zilizochaguliwa kutoka maduka ya CloveNet Soko.
              </p>
            </div>

            <button
              type="button"
              onClick={() => goTo("/soko")}
              className="hidden items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)] md:inline-flex"
            >
              Angalia Soko
              <ArrowRight size={17} strokeWidth={2.7} />
            </button>
          </div>

          {isLoading ? null : featuredProducts.length > 0 && activeFeaturedProduct ? (
            <>
              <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => openProduct(activeFeaturedProduct)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      openProduct(activeFeaturedProduct)
                    }
                  }}
                  className="relative cursor-pointer overflow-hidden rounded-[1.7rem] bg-[var(--color-navy)] p-3 text-white shadow-xl shadow-slate-300/30 md:rounded-[2rem] md:p-6"
                >
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-green)]/20 blur-2xl" />
                  <div className="absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-[var(--color-green)]/10 blur-3xl" />

                  <div
                    key={activeFeaturedProduct._id}
                    className="clovenet-slide-in relative z-10 grid gap-3 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-4"
                  >
                    <div className="group relative flex h-48 items-center justify-center overflow-hidden rounded-[1.45rem] bg-white/10 ring-1 ring-white/10 md:h-80 md:rounded-[1.8rem]">
                      {activeFeaturedProduct._image ? (
                        <img
                          src={activeFeaturedProduct._image}
                          alt={activeFeaturedProduct._name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-white/10 text-slate-300">
                          <Package size={50} strokeWidth={1.7} />
                          <p className="mt-3 text-xs font-black">
                            Picha haijawekwa
                          </p>
                        </div>
                      )}

                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-green)] px-3 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm md:text-[11px]">
                        <BadgeCheck size={12} strokeWidth={2.7} />
                        Pendekezwa
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-slate-200 ring-1 ring-white/10 md:text-[11px]">
                          {activeFeaturedProduct._category}
                        </span>

                        <span className="hidden items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-200 ring-1 ring-white/10 md:inline-flex">
                          <MapPin size={12} strokeWidth={2.5} />
                          {activeFeaturedProduct._location}
                        </span>
                      </div>

                      <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight md:mt-4 md:text-5xl">
                        {activeFeaturedProduct._name}
                      </h2>

                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-300 md:mt-2 md:text-sm">
                        {activeFeaturedProduct._storeName}
                      </p>

                      {activeFeaturedProduct._specs && (
                        <p className="mt-3 hidden line-clamp-2 text-xs font-semibold leading-5 text-slate-400 md:block">
                          {activeFeaturedProduct._specs}
                        </p>
                      )}

                      <p className="mt-4 text-2xl font-black text-[var(--color-green)] md:mt-5 md:text-4xl">
                        {formatCurrency(activeFeaturedProduct._price)}
                      </p>

                      <div className="mt-6 hidden flex-col gap-3 sm:flex-row md:flex">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            openProduct(activeFeaturedProduct)
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
                        >
                          Angalia Bidhaa
                          <ArrowRight size={17} strokeWidth={2.7} />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            goTo("/soko")
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                        >
                          Bidhaa Zote
                          <ShoppingBag size={17} strokeWidth={2.7} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="hidden rounded-[2rem] border border-[var(--color-green)]/40 bg-[var(--color-green-soft)] p-3 md:block md:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-green-dark)]">
                      Slideshow
                    </p>

                    <p className="text-xs font-black text-[var(--color-green-dark)]">
                      {activeFeaturedIndex + 1}/{featuredProducts.length}
                    </p>
                  </div>

                  <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1">
                    {featuredProducts.map((product, index) => {
                      const isActive = index === activeFeaturedIndex

                      return (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => setActiveFeaturedIndex(index)}
                          className={`flex items-center gap-3 rounded-[1.5rem] border p-3 text-left transition ${
                            isActive
                              ? "border-[var(--color-green)] bg-white shadow-sm"
                              : "border-transparent bg-transparent hover:bg-white/70"
                          }`}
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                            {product._image ? (
                              <img
                                src={product._image}
                                alt={product._name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package
                                size={28}
                                strokeWidth={1.8}
                                className="text-gray-400"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-[var(--color-green)] px-2.5 py-0.5 text-[10px] font-black text-[var(--color-navy)]">
                                Pendekezwa
                              </span>

                              <span className="truncate text-[10px] font-black text-gray-500">
                                {product._category}
                              </span>
                            </div>

                            <h3 className="mt-1 truncate text-sm font-black text-gray-950">
                              {product._name}
                            </h3>

                            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-muted)]">
                              {product._storeName}
                            </p>

                            <p className="mt-1 text-sm font-black text-[var(--color-green-dark)]">
                              {formatCurrency(product._price)}
                            </p>
                          </div>

                          <ArrowRight
                            size={18}
                            strokeWidth={2.8}
                            className={
                              isActive
                                ? "text-[var(--color-green-dark)]"
                                : "text-gray-400"
                            }
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {featuredProducts.length > 1 && (
                <div className="mt-4 md:mt-5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      key={activeFeaturedIndex}
                      className="h-full rounded-full bg-[var(--color-green)] clovenet-slide-progress"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 md:mt-4">
                    <div className="flex gap-2">
                      {featuredProducts.map((product, index) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => setActiveFeaturedIndex(index)}
                          className={`h-2.5 rounded-full transition ${
                            index === activeFeaturedIndex
                              ? "w-8 bg-[var(--color-green)]"
                              : "w-2.5 bg-gray-300"
                          }`}
                          aria-label={`Nenda kwenye featured product ${
                            index + 1
                          }`}
                        />
                      ))}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                      <button
                        type="button"
                        onClick={showPreviousFeatured}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-navy)]"
                        aria-label="Bidhaa iliyopita"
                      >
                        <ChevronLeft size={19} strokeWidth={2.8} />
                      </button>

                      <button
                        type="button"
                        onClick={showNextFeatured}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white"
                        aria-label="Bidhaa inayofuata"
                      >
                        <ChevronRight size={19} strokeWidth={2.8} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[1.7rem] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center md:rounded-[2rem] md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[var(--color-navy)] shadow-sm">
                <Star size={30} strokeWidth={2.2} />
              </div>

              <h2 className="mt-4 text-xl font-black text-gray-950">
                Hakuna bidhaa zilizopendekezwa kwa sasa
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Bidhaa zitakapopewa kipaumbele zitaonekana hapa.
              </p>

              <button
                type="button"
                onClick={() => goTo("/soko")}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Angalia Soko
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </div>
          )}
        </section>

        {recentProducts.length > 0 && (
          <section
            id="recent-products"
            className="scroll-mt-24 mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:p-6"
          >
            <div className="mb-4 flex items-end justify-between gap-3 md:mb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Bidhaa mpya
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950 md:text-2xl">
                  Zilizowekwa hivi karibuni
                </h2>
              </div>

              <button
                type="button"
                onClick={() => goTo("/soko")}
                className="hidden items-center gap-1 rounded-2xl bg-[var(--color-green-soft)] px-4 py-2 text-xs font-black text-[var(--color-green-dark)] transition hover:bg-[var(--color-green)] hover:text-[var(--color-navy)] md:inline-flex"
              >
                Ona zote
                <ArrowRight size={15} strokeWidth={2.7} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
              {recentProducts.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => openProduct(product)}
                  className="group overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100 md:h-48">
                    {product._image ? (
                      <img
                        src={product._image}
                        alt={product._name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[var(--color-navy)]">
                        <Package size={38} strokeWidth={1.8} />
                      </div>
                    )}

                    {product._isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-300 px-2.5 py-1 text-[10px] font-black text-[var(--color-navy)] shadow-sm">
                        <BadgeCheck size={12} strokeWidth={2.7} />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-3 md:p-4">
                    <span className="inline-flex rounded-full bg-[var(--color-green-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--color-green-dark)]">
                      {product._category}
                    </span>

                    <h3 className="mt-3 line-clamp-1 text-sm font-black text-gray-950 md:text-base">
                      {product._name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--color-muted)]">
                      {product._storeName}
                    </p>

                    <p className="mt-3 text-base font-black text-[var(--color-green-dark)] md:text-lg">
                      {formatCurrency(product._price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo("/soko")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)] md:hidden"
            >
              Bidhaa Zote
              <ArrowRight size={17} strokeWidth={2.7} />
            </button>
          </section>
        )}

        <section className="mt-5 grid grid-cols-3 gap-3 rounded-[2rem] bg-[var(--color-navy)] p-3 shadow-sm md:p-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
            <p className="text-2xl font-black leading-tight md:text-3xl">
              {visibleProducts.length}
            </p>

            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--color-green)]">
              Bidhaa Sokoni
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
            <p className="text-2xl font-black leading-tight md:text-3xl">
              {verifiedVendors.length}
            </p>

            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--color-green)]">
              Vendors Tayari
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white">
            <p className="text-2xl font-black leading-tight md:text-3xl">
              Fast
            </p>

            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--color-green)]">
              WhatsApp Orders
            </p>
          </div>
        </section>

        {dynamicCategories.length > 0 && (
          <section
            id="categories"
            className="scroll-mt-24 mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-sm md:p-5"
          >
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
              {dynamicCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    goTo(`/soko?category=${encodeURIComponent(category)}`)
                  }
                  className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-gray-700 transition hover:border-[var(--color-green)] hover:bg-[var(--color-green-soft)]"
                >
                  <Package size={17} strokeWidth={2.5} />
                  {category}
                </button>
              ))}

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
        )}

        <section className="mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Mchakato
            </p>

            <h2 className="mt-1 text-xl font-black text-gray-950 md:text-2xl">
              Jinsi inavyofanya kazi
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Njia rahisi ya kuona bidhaa, kuweka order na kuwasiliana na
              vendor.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.num}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-green)] hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-black text-white">
                        {step.num}
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-gray-500 shadow-sm">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                    {step.desc}
                  </p>

                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute bottom-4 right-4 hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--color-green-soft)] text-[var(--color-green-dark)] md:flex">
                      <ArrowRight size={16} strokeWidth={2.7} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section
          id="why-us"
          className="scroll-mt-24 mt-5 rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-6"
        >
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-green-soft)] px-3 py-1 text-[11px] font-black text-[var(--color-green-dark)]">
                <Sparkles size={13} strokeWidth={2.7} />
                Why CloveNet Soko?
              </span>

              <h2 className="mt-4 text-2xl font-black leading-tight text-gray-950 md:text-3xl">
                Marketplace rahisi kwa biashara zinazotumia WhatsApp.
              </h2>

              <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                CloveNet Soko inarahisisha mteja kuona bidhaa, kuchagua
                anachotaka na kuwasiliana na vendor kwa njia rahisi.
              </p>

              <button
                type="button"
                onClick={() => goTo("/vendor/register")}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-green-dark)]"
              >
                Fungua Duka Lako
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {whyItems.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-navy)] shadow-sm">
                      <Icon size={21} strokeWidth={2.6} />
                    </div>

                    <h3 className="mt-3 text-sm font-black text-gray-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
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
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-green)] hover:shadow-md"
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

        <section className="mt-5 rounded-[2rem] bg-[var(--color-navy)] p-5 text-white md:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-green)]">
                CloveNet Soko
              </p>

              <h2 className="mt-1 text-lg font-black">
                Nunua na uza kwa urahisi
              </h2>

              <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">
                Marketplace inayorahisisha maduka kuonekana online na wateja
                kuwasiliana na vendors kupitia WhatsApp.
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

            <div className="flex items-center md:justify-end">
              <button
                type="button"
                onClick={() => goTo("/soko")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white md:w-auto"
              >
                Anza Kununua
                <ArrowRight size={17} strokeWidth={2.7} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}

export default EntryPage