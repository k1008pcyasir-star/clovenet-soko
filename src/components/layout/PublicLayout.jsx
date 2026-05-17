import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import InstallPrompt from "../pwa/InstallPrompt"

function PublicLayout() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex-1">
        <Outlet />
      </div>

      <InstallPrompt />

      <Footer />
    </main>
  )
}

export default PublicLayout