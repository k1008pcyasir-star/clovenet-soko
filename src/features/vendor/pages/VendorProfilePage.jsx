import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Save,
  ShieldCheck,
  Store,
  UserRound,
  XCircle,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { formatDate, normalizePhone } from "../../../utils/formatters"

const BUSINESS_CATEGORIES = [
  { label: "💻 Laptop & Computer", value: "Laptop & Computer" },
  { label: "📱 Simu & Accessories", value: "Simu & Accessories" },
  { label: "🎧 Electronics", value: "Electronics" },
  { label: "👗 Fashion & Clothes", value: "Fashion & Clothes" },
  { label: "👟 Shoes & Bags", value: "Shoes & Bags" },
  { label: "💄 Beauty & Cosmetics", value: "Beauty & Cosmetics" },
  { label: "🍔 Food & Drinks", value: "Food & Drinks" },
  { label: "🏠 Home & Furniture", value: "Home & Furniture" },
  { label: "📚 Books & Stationery", value: "Books & Stationery" },
  { label: "🧸 Kids & Baby Products", value: "Kids & Baby Products" },
  { label: "🛠️ Hardware & Tools", value: "Hardware & Tools" },
  { label: "🚗 Auto Parts", value: "Auto Parts" },
  { label: "➕ Other / Nyingine", value: "Other" },
]

const initialMessage = {
  type: "",
  text: "",
}

function getCategoryFormValue(category) {
  const exists = BUSINESS_CATEGORIES.some((item) => item.value === category)

  if (!category) return ""
  if (exists) return category

  return "Other"
}

function VendorProfilePage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState(initialMessage)

  const vendor = useMemo(() => {
    const vendorId = StorageService.getCurrentVendorId()
    const vendors = StorageService.getVendors()

    return vendors.find((item) => item.id === vendorId) || null
  }, [])

  const [form, setForm] = useState(() => ({
    ownerName: vendor?.ownerName || "",
    storeName: vendor?.storeName || "",
    whatsapp: vendor?.whatsapp || "",
    location: vendor?.location || "",
    category: getCategoryFormValue(vendor?.category || ""),
    otherCategory:
      vendor?.category && getCategoryFormValue(vendor.category) === "Other"
        ? vendor.category
        : "",
    description: vendor?.description || "",
  }))

  const isVerified = vendor?.status === "verified" || vendor?.isVerified
  const isSuspended = vendor?.status === "suspended"

  function getFinalCategory() {
    if (form.category === "Other") {
      return form.otherCategory.trim()
    }

    return form.category.trim()
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "category" && value !== "Other"
        ? { otherCategory: "" }
        : {}),
    }))

    setMessage(initialMessage)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!vendor) {
      return
    }

    const finalCategory = getFinalCategory()

    if (!finalCategory) {
      setMessage({
        type: "error",
        text: "Chagua au andika aina ya biashara yako.",
      })
      return
    }

    const vendors = StorageService.getVendors()

    const updatedVendors = vendors.map((item) => {
      if (item.id !== vendor.id) {
        return item
      }

      return {
        ...item,
        ownerName: form.ownerName.trim(),
        storeName: form.storeName.trim(),
        whatsapp: normalizePhone(form.whatsapp),
        location: form.location.trim(),
        category: finalCategory,
        description: form.description.trim(),
        updatedAt: new Date().toISOString(),
      }
    })

    StorageService.saveVendors(updatedVendors)

    setMessage({
      type: "success",
      text: "Taarifa za duka zimehifadhiwa kikamilifu.",
    })
  }

  if (!vendor) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <LockKeyhole size={32} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Tafadhali ingia kwanza
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Hatujapata taarifa za duka lako. Ingia kwanza ili uweze kuangalia
              na kurekebisha profile ya duka.
            </p>

            <button
              type="button"
              onClick={() => navigate("/vendor/login")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Ingia Dukani
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Vendor Profile
            </p>

            <h1 className="mt-1 text-2xl font-black text-gray-950">
              Profile ya Duka
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Angalia na rekebisha taarifa muhimu za duka lako.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/vendor/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
          >
            <ArrowLeft size={16} strokeWidth={2.7} />
            Rudi Dashboard
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.4fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-7"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  <Store size={21} strokeWidth={2.7} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-950">
                    Taarifa za Duka
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                    Taarifa hizi ndizo zitakazoonekana kwa wateja.
                  </p>
                </div>
              </div>
            </div>

            {message.text && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  message.type === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === "success" ? (
                    <CheckCircle2
                      size={18}
                      strokeWidth={2.6}
                      className="mt-0.5 shrink-0 text-green-700"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      strokeWidth={2.6}
                      className="mt-0.5 shrink-0 text-red-700"
                    />
                  )}

                  <p
                    className={`text-sm font-bold leading-5 ${
                      message.type === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="ownerName"
                  className="text-xs font-black text-gray-700"
                >
                  Jina la mmiliki
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                  <UserRound
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="ownerName"
                    required
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    placeholder="Mfano: Yasir Hamdu"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="storeName"
                  className="text-xs font-black text-gray-700"
                >
                  Jina la duka
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                  <Store
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="storeName"
                    required
                    name="storeName"
                    value={form.storeName}
                    onChange={handleChange}
                    placeholder="Mfano: CloveNet Tech Store"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="text-xs font-black text-gray-700"
                >
                  Namba ya simu
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                  <MessageCircle
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="whatsapp"
                    required
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+255700000000"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="text-xs font-black text-gray-700"
                >
                  Eneo / Location
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 transition focus-within:border-[var(--color-green)] focus-within:ring-2 focus-within:ring-[var(--color-green)]/20">
                  <MapPin
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="location"
                    required
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Mfano: Kariakoo, Dar es Salaam"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="category"
                  className="text-xs font-black text-gray-700"
                >
                  Aina ya biashara
                </label>

                <select
                  id="category"
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20"
                >
                  <option value="">Chagua aina ya biashara</option>

                  {BUSINESS_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {form.category === "Other" && (
                  <input
                    required
                    name="otherCategory"
                    value={form.otherCategory}
                    onChange={handleChange}
                    placeholder="Andika aina ya biashara yako"
                    className="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="text-xs font-black text-gray-700"
                >
                  Maelezo mafupi ya duka
                </label>

                <textarea
                  id="description"
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Elezea duka lako kwa kifupi..."
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              <Save size={16} strokeWidth={2.7} />
              Hifadhi Mabadiliko
            </button>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Status
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black ${
                    isVerified
                      ? "bg-[var(--color-green-soft)] text-[var(--color-green-dark)]"
                      : isSuspended
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isVerified ? (
                    <ShieldCheck size={12} strokeWidth={2.7} />
                  ) : isSuspended ? (
                    <XCircle size={12} strokeWidth={2.7} />
                  ) : (
                    <Clock size={12} strokeWidth={2.7} />
                  )}

                  {isVerified
                    ? "Verified"
                    : isSuspended
                      ? "Suspended"
                      : "Pending Verification"}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-xs font-semibold text-gray-600">
                <p>
                  <span className="font-black text-gray-950">Joined:</span>{" "}
                  {formatDate(vendor.createdAt)}
                </p>

                {vendor.verifiedAt && (
                  <p>
                    <span className="font-black text-gray-950">Verified:</span>{" "}
                    {formatDate(vendor.verifiedAt)}
                  </p>
                )}

                {vendor.updatedAt && (
                  <p>
                    <span className="font-black text-gray-950">Updated:</span>{" "}
                    {formatDate(vendor.updatedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Preview
              </p>

              <div className="mt-4 rounded-2xl bg-[var(--color-bg)] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white">
                    <Store size={21} strokeWidth={2.6} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-gray-950">
                      {form.storeName || "Jina la duka"}
                    </h3>

                    <p className="mt-1 text-xs font-black text-[var(--color-green-dark)]">
                      {getFinalCategory() || "Category"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm font-semibold leading-6 text-[var(--color-muted)]">
                  {form.description || "Maelezo ya duka yataonekana hapa."}
                </p>

                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <MapPin
                      size={14}
                      strokeWidth={2.5}
                      className="text-[var(--color-green-dark)]"
                    />
                    {form.location || "Location"}
                  </p>

                  <p className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <MessageCircle
                      size={14}
                      strokeWidth={2.5}
                      className="text-[var(--color-green-dark)]"
                    />
                    {form.whatsapp || "Namba ya simu"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default VendorProfilePage