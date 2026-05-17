import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import InstallPrompt from "../pwa/InstallPrompt"

function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex-1">
        <Outlet />
      </div>

      <InstallPrompt />

      <Footer />
    </div>
  )
}

export default PublicLayout