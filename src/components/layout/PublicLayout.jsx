import { Outlet } from "react-router-dom"
import Footer from "./Footer"

function PublicLayout() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </main>
  )
}

export default PublicLayout