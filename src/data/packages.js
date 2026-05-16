export const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: 10000,
    priceLabel: "TZS 10,000 / mwezi",
    productLimit: 30,
    featuredLimit: 0,
    bannerAllowed: false,
    color: "orange",
    description: "Kwa mfanyabiashara anayeanza kuweka bidhaa mtandaoni.",
    features: [
      "Hadi bidhaa 30",
      "Kitufe cha Agiza WhatsApp",
      "Mini-store ndani ya CloveNet Soko",
      "Support ya msingi",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 20000,
    priceLabel: "TZS 20,000 / mwezi",
    productLimit: 100,
    featuredLimit: 5,
    bannerAllowed: false,
    color: "blue",
    description: "Kwa duka linalotaka bidhaa nyingi na visibility zaidi.",
    features: [
      "Hadi bidhaa 100",
      "Featured products 5",
      "Kitufe cha Agiza WhatsApp",
      "Mini-store ndani ya CloveNet Soko",
      "Ripoti ya mwezi",
      "Support ya kawaida",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 30000,
    priceLabel: "TZS 30,000 / mwezi",
    productLimit: 200,
    featuredLimit: 10,
    bannerAllowed: true,
    color: "purple",
    description: "Kwa biashara inayotaka muonekano wa juu na nafasi kubwa.",
    features: [
      "Hadi bidhaa 200",
      "Featured products 10",
      "Store banner",
      "Kitufe cha Agiza WhatsApp",
      "Mini-store ndani ya CloveNet Soko",
      "Analytics report",
      "Priority support",
    ],
  },
]

export const getPackageById = (packageId) => {
  return PACKAGES.find((item) => item.id === packageId) || PACKAGES[0]
}