import { Package } from "lucide-react"

function EmptyState({
  icon,
  title = "Hakuna data",
  description = "Hakuna taarifa za kuonyesha kwa sasa.",
  children,
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        {icon || <Package size={38} strokeWidth={2.4} />}
      </div>

      <h2 className="mt-5 text-xl font-black text-gray-950">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--color-muted)]">
        {description}
      </p>

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

export default EmptyState