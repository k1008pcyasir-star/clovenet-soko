import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"

const INSTALL_DISMISSED_KEY = "clovenet_soko_install_dismissed"

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY)

    if (dismissed === "true") {
      return
    }

    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setDeferredPrompt(event)
      setIsVisible(true)
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

    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      localStorage.setItem(INSTALL_DISMISSED_KEY, "true")
    }

    setDeferredPrompt(null)
    setIsVisible(false)
  }

  function handleDismiss() {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true")
    setIsVisible(false)
  }

  if (!isVisible || isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-2xl md:bottom-6">
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