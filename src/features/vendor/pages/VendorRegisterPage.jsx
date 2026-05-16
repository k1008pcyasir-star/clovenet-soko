import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react"

import { StorageService } from "../../../services/storageService"
import { createId, normalizePhone } from "../../../utils/formatters"

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

const initialForm = {
  ownerName: "",
  storeName: "",
  whatsapp: "",
  location: "",
  category: "",
  otherCategory: "",
  description: "",
  password: "",
  confirmPassword: "",
}

const initialErrors = {
  whatsapp: "",
  category: "",
  password: "",
  confirmPassword: "",
}

function VendorRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "category" && value !== "Other"
        ? { otherCategory: "" }
        : {}),
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }))
    }
  }

  function getFinalCategory() {
    if (form.category === "Other") {
      return form.otherCategory.trim()
    }

    return form.category.trim()
  }

  function validate() {
    const newErrors = { ...initialErrors }
    let isValid = true

    const digits = form.whatsapp.replace(/\D/g, "")

    if (digits.length < 9 || digits.length > 13) {
      newErrors.whatsapp = "Weka namba sahihi ya simu. Mfano: +255700000000"
      isValid = false
    }

    if (!getFinalCategory()) {
      newErrors.category = "Chagua au andika aina ya biashara yako."
      isValid = false
    }

    if (form.password.length < 6) {
      newErrors.password = "Neno la siri liwe na herufi angalau 6"
      isValid = false
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Maneno ya siri hayalingani"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) return

    const newVendor = {
      id: createId("vendor"),
      ownerName: form.ownerName.trim(),
      storeName: form.storeName.trim(),
      whatsapp: normalizePhone(form.whatsapp),
      location: form.location.trim(),
      category: getFinalCategory(),
      description: form.description.trim(),

      // Default free access ya mwanzo. Limit itaonyeshwa ndani ya dashboard/product page.
      plan: "free",
      productLimit: 15,

      // MVP only: kwenye production, password haitahifadhiwa plain text.
      password: form.password,

      status: "pending_verification",
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    const vendors = StorageService.getVendors()
    StorageService.saveVendors([newVendor, ...vendors])

    setIsSubmitted(true)
    setForm(initialForm)
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-6 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <CheckCircle2 size={34} strokeWidth={2.5} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-950">
              Duka lako limepokelewa
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Umefanikiwa kusajili duka lako kwenye CloveNet Soko. Taarifa zako
              zitapitiwa kwa ajili ya verification kabla ya duka kuonekana kwa
              wateja.
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-[var(--color-bg)] p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
                  <ShieldCheck size={18} strokeWidth={2.6} />
                </div>

                <div>
                  <p className="text-sm font-black text-gray-950">
                    Verification inaendelea
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                    Baada ya verification kukamilika, utaweza kuingia dukani na
                    kuanza kusimamia bidhaa zako.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/vendor/login")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-6 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Ingia Dukani
                <ArrowRight size={16} strokeWidth={2.7} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-3 text-sm font-black text-gray-700 transition hover:bg-white"
              >
                <ArrowLeft size={16} strokeWidth={2.7} />
                Rudi Mwanzo
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <div className="w-full">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-sm transition hover:bg-[var(--color-bg)]"
          >
            <ArrowLeft size={15} strokeWidth={2.7} />
            Rudi Mwanzo
          </button>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[var(--color-border)] bg-white p-5 shadow-sm md:p-7"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white shadow-sm">
                  <Store size={24} strokeWidth={2.6} />
                </div>

                <p className="text-xl font-black leading-tight text-gray-950">
                  CloveNet Soko
                </p>
              </div>

              <h1 className="mt-7 text-2xl font-black leading-tight text-gray-950">
                Fungua duka lako bure
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
                Jaza taarifa za biashara yako ili tuanze verification ya duka
                lako.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--color-green-soft)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-green-dark)]">
                  <ShieldCheck size={18} strokeWidth={2.6} />
                </div>

                <div>
                  <p className="text-sm font-black text-[var(--color-green-dark)]">
                    Verification ya duka
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-green-dark)]">
                    Tunapitia taarifa za duka ili kuongeza uaminifu kati ya
                    vendor na wateja.
                  </p>
                </div>
              </div>
            </div>

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

                <div
                  className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[var(--color-bg)] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 ${
                    errors.whatsapp
                      ? "border-red-400"
                      : "border-[var(--color-border)] focus-within:border-[var(--color-green)]"
                  }`}
                >
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

                {errors.whatsapp && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.whatsapp}
                  </p>
                )}
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
                  className={`mt-2 w-full rounded-2xl border bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 ${
                    errors.category
                      ? "border-red-400"
                      : "border-[var(--color-border)]"
                  }`}
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
                    className={`mt-3 w-full rounded-2xl border bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 ${
                      errors.category
                        ? "border-red-400"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                )}

                {errors.category && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.category}
                  </p>
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
                  placeholder="Elezea duka lako kwa kifupi..."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-black text-gray-700"
                >
                  Neno la siri
                </label>

                <div
                  className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[var(--color-bg)] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 ${
                    errors.password
                      ? "border-red-400"
                      : "border-[var(--color-border)] focus-within:border-[var(--color-green)]"
                  }`}
                >
                  <Lock
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Angalau herufi 6"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="shrink-0 text-gray-500 transition hover:text-[var(--color-navy)]"
                    aria-label={
                      showPassword ? "Ficha neno la siri" : "Onyesha neno la siri"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2.5} />
                    ) : (
                      <Eye size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-black text-gray-700"
                >
                  Thibitisha neno la siri
                </label>

                <div
                  className={`mt-2 flex items-center gap-2 rounded-2xl border bg-[var(--color-bg)] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[var(--color-green)]/20 ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-[var(--color-border)] focus-within:border-[var(--color-green)]"
                  }`}
                >
                  <Lock
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-[var(--color-green-dark)]"
                  />

                  <input
                    id="confirmPassword"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Rudia neno la siri"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="shrink-0 text-gray-500 transition hover:text-[var(--color-navy)]"
                    aria-label={
                      showConfirmPassword
                        ? "Ficha neno la siri"
                        : "Onyesha neno la siri"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} strokeWidth={2.5} />
                    ) : (
                      <Eye size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Fungua Duka Langu
              <ArrowRight size={16} strokeWidth={2.7} />
            </button>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--color-bg)] p-4">
              <p className="text-xs font-semibold text-[var(--color-muted)]">
                Tayari una duka?
              </p>

              <button
                type="button"
                onClick={() => navigate("/vendor/login")}
                className="shrink-0 text-sm font-black text-[var(--color-green-dark)] hover:underline"
              >
                Ingia dukani
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default VendorRegisterPage