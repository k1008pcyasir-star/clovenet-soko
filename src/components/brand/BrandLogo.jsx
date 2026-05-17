import { ShoppingCart } from "lucide-react"

function BrandLogo({
  title = "CloveNet Soko",
  subtitle = "",
  showSubtitle = false,
  iconSize = "md",
  textSize = "md",
  light = false,
  onClick,
}) {
  const iconClasses = {
    sm: "h-10 w-10 rounded-2xl",
    md: "h-11 w-11 rounded-[1.1rem]",
    lg: "h-12 w-12 rounded-[1.2rem]",
  }

  const cartSizes = {
    sm: 20,
    md: 23,
    lg: 25,
  }

  const titleClasses = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-xl",
  }

  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex min-w-0 items-center gap-3 text-left ${
        onClick
          ? "rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-green)] focus-visible:ring-offset-2"
          : ""
      }`}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center bg-[var(--color-navy)] text-white shadow-sm ring-1 ring-white/40 ${
          iconClasses[iconSize] || iconClasses.md
        }`}
      >
        <ShoppingCart
          size={cartSizes[iconSize] || cartSizes.md}
          strokeWidth={2.7}
        />

        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-green)] ring-2 ring-[var(--color-navy)]" />
      </div>

      <div className="min-w-0">
        <p
          className={`truncate font-black leading-tight tracking-tight ${
            light ? "text-white" : "text-gray-950"
          } ${titleClasses[textSize] || titleClasses.md}`}
        >
          {title}
        </p>

        {showSubtitle && subtitle && (
          <p
            className={`truncate text-[10px] font-semibold ${
              light ? "text-slate-400" : "text-[var(--color-muted)]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </Wrapper>
  )
}

export default BrandLogo