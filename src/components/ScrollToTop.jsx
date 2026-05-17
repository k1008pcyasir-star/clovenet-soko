import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

function ScrollToTop() {
  const { pathname, hash, key } = useLocation()

  useLayoutEffect(() => {
    const html = document.documentElement
    const previousScrollBehavior = html.style.scrollBehavior

    // Lazimisha scroll zote za navigation ziwe instant
    html.style.scrollBehavior = "auto"

    if (hash) {
      const sectionId = hash.replace("#", "")
      const section = document.getElementById(sectionId)

      if (section) {
        section.scrollIntoView({
          behavior: "auto",
          block: "start",
        })
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      })
    }

    html.style.scrollBehavior = previousScrollBehavior
  }, [pathname, hash, key])

  return null
}

export default ScrollToTop