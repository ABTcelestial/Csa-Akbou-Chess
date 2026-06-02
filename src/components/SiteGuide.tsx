import { useState, useRef, useEffect } from "react"
import { HelpCircle, X } from "lucide-react"
import { useGuide } from "@/lib/GuideContext"
import { GUIDES } from "@/lib/GuideContext"

const SiteGuide = () => {
  const [open, setOpen] = useState(false)
  const { startGuide, stopGuide, activeGuide } = useGuide()
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const pick = (id: string) => {
    stopGuide()
    setTimeout(() => startGuide(id), 50)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Guide du site"
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${
          activeGuide
            ? "text-[hsl(var(--chess-gold))] bg-[hsl(var(--chess-gold)/0.15)]"
            : "text-white/60 hover:text-white hover:bg-white/8"
        }`}
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] max-w-[calc(100vw-12px)] sm:w-72 bg-background border border-border rounded-2xl shadow-2xl z-[500] overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">♔</span>
              <div>
                <p className="text-white text-sm font-bold leading-tight">Le Roi, ton guide</p>
                <p className="text-white/50 text-[10px]">Choisis un guide pour commencer</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors p-1 rounded">
              <X size={14} />
            </button>
          </div>

          {/* Guide list */}
          <div className="p-2 space-y-0.5 overflow-y-auto flex-1">
            {GUIDES.map(g => (
              <button
                key={g.id}
                onClick={() => pick(g.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  activeGuide?.id === g.id
                    ? "bg-primary/8 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <span className="text-xl shrink-0">{g.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{g.title}</p>
                  <p className="text-xs text-muted-foreground">{g.steps.length} étapes</p>
                </div>
                {activeGuide?.id === g.id && (
                  <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                    En cours
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-4 pb-3 pt-1 shrink-0">
            <p className="text-[10px] text-muted-foreground text-center">
              Le Roi te guidera pas à pas sur le site
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteGuide
