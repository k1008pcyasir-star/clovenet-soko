import { useEffect, useState } from "react"
import { ArrowRight, Download, Share, X } from "lucide-react"

const INSTALL_DISMISSED_KEY = "clovenet_soko_install_dismissed"

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream
}

function isSafariBrowser() {
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
}

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  )
}

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true)
      return
    }

    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY)

    if (dismissed === "true") {
      return
    }

    const isIOSSafari = isIOSDevice() && isSafariBrowser()

    if (isIOSSafari) {
      const timer = window.setTimeout(() => {
        setShowIOSGuide(true)
        setIsVisible(true)
      }, 5000)

      return () => window.clearTimeout(timer)
    }

    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setDeferredPrompt(event)

      window.setTimeout(() => {
        setIsVisible(true)
      }, 4000)
    }

    function handleAppInstalled() {
      setIsInstalled(true)
      setIsVisible(false)
      setDeferredPrompt(null)
      localStorage.setItem(INSTALL_DISMISSED_KEY, "true")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      localStorage.setItem(INSTALL_DISMISSED_KEY, "true")
    }

    setDeferredPrompt(null)
    setIsVisible(false)
  }

  function handleDismiss() {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true")
    setIsVisible(false)
    setShowIOSGuide(false)
  }

  if (!isVisible || isInstalled) {
    return null
  }

  if (!showIOSGuide && !deferredPrompt) {
    return null
  }

  if (showIOSGuide) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-2xl md:hidden">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg)] text-gray-500 transition hover:text-gray-900"
          aria-label="Funga"
        >
          <X size={16} strokeWidth={2.7} />
        </button>

        <div className="pr-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white">
              <Download size={20} strokeWidth={2.7} />
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-950">
                Install CloveNet Soko
              </h3>

              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                Weka app kwenye home screen kwa access ya haraka.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-bg)] px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs font-black text-white">
                1
              </div>

              <Share
                size={16}
                strokeWidth={2.7}
                className="shrink-0 text-[var(--color-green-dark)]"
              />

              <p className="text-xs font-semibold leading-5 text-gray-700">
                Bonyeza kitufe cha Share kwenye Safari.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-bg)] px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs font-black text-white">
                2
              </div>

              <ArrowRight
                size={16}
                strokeWidth={2.7}
                className="shrink-0 text-[var(--color-green-dark)]"
              />

              <p className="text-xs font-semibold leading-5 text-gray-700">
                Chagua Add to Home Screen, kisha bonyeza Add.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-4 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 text-xs font-black text-gray-600 transition hover:bg-white"
          >
            Sawa, Nimeelewa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-2xl md:hidden">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg)] text-gray-500 transition hover:text-gray-900"
        aria-label="Funga install prompt"
      >
        <X size={16} strokeWidth={2.7} />
      </button>

      <div className="pr-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-white">
            <Download size={22} strokeWidth={2.7} />
          </div>

          <div>
            <h3 className="text-sm font-black text-gray-950">
              Install CloveNet Soko
            </h3>

            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
              Pata access ya haraka kwenye simu yako bila kufungua browser kila
              mara.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-4 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
        >
          <Download size={17} strokeWidth={2.7} />
          Install App
        </button>
      </div>
    </div>
  )
}

export default InstallPrompt