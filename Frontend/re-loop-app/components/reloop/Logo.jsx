import { Infinity } from "lucide-react"

export function Logo({ size = "medium", dark = false }) {
  const sizes = {
    small: { fontSize: "1.25rem", iconSize: 18 },
    medium: { fontSize: "1.75rem", iconSize: 24 },
    large: { fontSize: "3rem", iconSize: 42 },
  }

  const { fontSize, iconSize } = sizes[size]

  return (
    <div className={`logo ${dark ? "dark" : ""}`} style={{ fontSize }}>
      <span className="logo-text">
        ReL
        <span className="logo-icon">
          <Infinity size={iconSize} strokeWidth={2.5} />
        </span>
        p
      </span>
    </div>
  )
}
