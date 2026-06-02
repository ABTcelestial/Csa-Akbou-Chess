import { useEffect, useState, useCallback, useRef } from "react"
import { useLocation } from "react-router-dom"
import { X, ChevronRight, SkipForward, GripHorizontal, Minus, ChevronUp } from "lucide-react"
import { useGuide } from "@/lib/GuideContext"

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { displayed, done }
}

// ── Visibility helper ──────────────────────────────────────────────────────
// Find first element matching selector that is actually visible on screen
// (skips display:none ancestors and collapsed overflow:hidden containers like the mobile nav)
function findVisibleElement(selector: string): Element | null {
  const all = document.querySelectorAll(selector)
  for (const el of all) {
    // Walk ancestors: skip if any has display:none
    let hiddenByDisplay = false
    let node: Element | null = el
    while (node) {
      if (window.getComputedStyle(node).display === "none") { hiddenByDisplay = true; break }
      node = node.parentElement
    }
    if (hiddenByDisplay) continue

    // Walk ancestors: skip if inside a collapsed overflow:hidden container (e.g. mobile nav max-h-0)
    let collapsed = false
    node = el.parentElement
    while (node && node !== document.body) {
      const s = window.getComputedStyle(node)
      const maxH = parseFloat(s.maxHeight)
      if (!isNaN(maxH) && maxH < 1 && s.overflow.includes("hidden")) { collapsed = true; break }
      node = node.parentElement
    }
    if (collapsed) continue

    return el
  }
  return null
}

// ── Pulsing highlight ──────────────────────────────────────────────────────
function useHighlight(selector: string | undefined, active: boolean) {
  useEffect(() => {
    const cleanup = () =>
      document.querySelectorAll(".guide-pulse").forEach(el => el.classList.remove("guide-pulse"))

    if (!active || !selector) { cleanup(); return }

    let attempts = 0
    const tryHighlight = () => {
      const el = findVisibleElement(selector)
      if (el) { cleanup(); el.classList.add("guide-pulse") }
      else if (attempts++ < 8) setTimeout(tryHighlight, 350)
    }
    tryHighlight()
    return cleanup
  }, [selector, active])
}

// ── Arrow pointing at highlighted element ─────────────────────────────────
interface ArrowPos { top: number; left: number; pointUp: boolean }

function useArrow(selector: string | undefined, active: boolean): ArrowPos | null {
  const [pos, setPos] = useState<ArrowPos | null>(null)

  useEffect(() => {
    if (!active || !selector) { setPos(null); return }

    const compute = () => {
      const el = findVisibleElement(selector)
      if (!el) { setPos(null); return }
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) { setPos(null); return }
      if (r.bottom < 0 || r.top > window.innerHeight) { setPos(null); return }
      const NAVBAR_H = 64
      const pointUp = r.top < NAVBAR_H + 80
      const rawLeft = r.left + r.width / 2
      const rawTop = pointUp ? r.bottom + 8 : r.top - 38
      setPos({
        top: Math.max(NAVBAR_H + 4, Math.min(rawTop, window.innerHeight - 50)),
        left: Math.max(20, Math.min(rawLeft, window.innerWidth - 20)),
        pointUp,
      })
    }

    let attempts = 0
    const tryFind = () => {
      if (findVisibleElement(selector)) compute()
      else if (attempts++ < 10) setTimeout(tryFind, 320)
    }
    tryFind()

    window.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute)
    return () => {
      window.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
      setPos(null)
    }
  }, [selector, active])

  return pos
}

// ── Main widget ────────────────────────────────────────────────────────────
const GuideWidget = () => {
  const { activeGuide, currentStep, advanceStep, stopGuide } = useGuide()
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)
  const [showHint, setShowHint] = useState(false)
  const [kingMood, setKingMood] = useState<"normal" | "celebrate">("normal")
  const [minimized, setMinimized] = useState(false)

  // ── Drag state ──────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const dragStart = useRef<{ clientX: number; clientY: number; elemX: number; elemY: number } | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      elemX: rect.left,
      elemY: rect.top,
    }

    const onMove = (ev: PointerEvent) => {
      if (!dragStart.current || !containerRef.current) return
      const dx = ev.clientX - dragStart.current.clientX
      const dy = ev.clientY - dragStart.current.clientY
      const w = containerRef.current.offsetWidth
      const h = containerRef.current.offsetHeight
      const newX = Math.max(0, Math.min(dragStart.current.elemX + dx, window.innerWidth - w))
      const newY = Math.max(0, Math.min(dragStart.current.elemY + dy, window.innerHeight - h))
      setDragPos({ x: newX, y: newY })
    }

    const onUp = () => {
      dragStart.current = null
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }, [])

  const step = activeGuide?.steps[currentStep] ?? null
  const isLastStep = activeGuide ? currentStep === activeGuide.steps.length - 1 : false

  const { displayed, done } = useTypewriter(step?.message ?? "")

  useHighlight(step?.highlight, !!activeGuide)
  const arrowPos = useArrow(step?.highlight, !!activeGuide)

  // Reset drag + minimize on guide change
  useEffect(() => {
    setDragPos(null)
    setMinimized(false)
  }, [activeGuide?.id])

  // ── Hint timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    setShowHint(false)
    if (!step?.hint) return
    const id = setTimeout(() => setShowHint(true), 11000)
    return () => clearTimeout(id)
  }, [activeGuide?.id, currentStep, step?.hint])

  // ── Celebrate on last step ─────────────────────────────────────────────
  useEffect(() => {
    if (isLastStep) {
      setKingMood("celebrate")
      return () => setKingMood("normal")
    }
    setKingMood("normal")
  }, [isLastStep])

  // ── Advance step logic ─────────────────────────────────────────────────
  const doAdvance = useCallback(() => {
    setShowHint(false)
    advanceStep()
  }, [advanceStep])

  // Navigate trigger: watch pathname changes
  useEffect(() => {
    if (!step || step.trigger.type !== "navigate") return
    const prev = prevPathRef.current
    const target = step.trigger.path
    if (location.pathname === target && prev !== location.pathname) {
      doAdvance()
    }
    prevPathRef.current = location.pathname
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Also handle "already on target page" at step load time
  useEffect(() => {
    if (!step || step.trigger.type !== "navigate") return
    if (location.pathname === step.trigger.path) {
      const id = setTimeout(doAdvance, 400)
      return () => clearTimeout(id)
    }
  }, [activeGuide?.id, currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click trigger
  useEffect(() => {
    if (!step || step.trigger.type !== "click") return
    const selector = step.trigger.selector
    const handler = (e: MouseEvent) => {
      const el = e.target as Element
      if (el.closest(selector)) setTimeout(doAdvance, 200)
    }
    document.addEventListener("click", handler, true)
    return () => document.removeEventListener("click", handler, true)
  }, [activeGuide?.id, currentStep, doAdvance])

  // Window event trigger (e.g. guide:registration-success)
  useEffect(() => {
    if (!step || step.trigger.type !== "event") return
    const name = step.trigger.name
    const handler = () => doAdvance()
    window.addEventListener(name, handler)
    return () => window.removeEventListener(name, handler)
  }, [activeGuide?.id, currentStep, doAdvance])

  // Timer trigger
  useEffect(() => {
    if (!step || step.trigger.type !== "timer") return
    const id = setTimeout(doAdvance, step.trigger.seconds * 1000)
    return () => clearTimeout(id)
  }, [activeGuide?.id, currentStep, doAdvance])

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") stopGuide() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [stopGuide])

  if (!activeGuide || !step) return null

  const progress = (currentStep / (activeGuide.steps.length - 1)) * 100

  const containerStyle: React.CSSProperties = dragPos
    ? { top: dragPos.y, left: dragPos.x, bottom: "auto", right: "auto" }
    : {}

  return (
    <>
    {/* ── Arrow indicator ── */}
    {arrowPos && (
      <div
        className="fixed z-[299] pointer-events-none flex flex-col items-center"
        style={{
          top: arrowPos.top,
          left: arrowPos.left,
          transform: "translateX(-50%)",
        }}
      >
        <span
          className="text-2xl drop-shadow-lg"
          style={{
            color: "hsl(var(--chess-gold))",
            animation: arrowPos.pointUp
              ? "arrow-bounce-up 0.75s ease-in-out infinite"
              : "arrow-bounce-down 0.75s ease-in-out infinite",
            display: "block",
            lineHeight: 1,
          }}
        >
          {arrowPos.pointUp ? "▲" : "▼"}
        </span>
      </div>
    )}

    <div
      ref={containerRef}
      className={`fixed z-[300] flex flex-col items-end gap-2 select-none pointer-events-none${
        dragPos ? "" : " bottom-3 right-3 sm:bottom-5 sm:right-4"
      }`}
      style={containerStyle}
    >

      {/* ── Speech bubble ── */}
      <div
        className="pointer-events-auto w-[min(320px,calc(100vw-24px))] bg-white dark:bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))" }}
      >
        {/* Header — drag handle */}
        <div
          className="flex items-center justify-between px-3 py-2.5 border-b cursor-grab active:cursor-grabbing touch-none"
          style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}
          onPointerDown={onPointerDown}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <GripHorizontal size={13} className="text-white/40 shrink-0" />
            <span className="text-white/80 text-xs font-semibold tracking-wide truncate">
              {activeGuide.title}
            </span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-white/50 text-[10px] mr-1">{currentStep + 1}/{activeGuide.steps.length}</span>
            <button
              onClick={() => setMinimized(m => !m)}
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg"
              aria-label={minimized ? "Agrandir le guide" : "Réduire le guide"}
              onPointerDown={e => e.stopPropagation()}
            >
              {minimized ? <ChevronUp size={13} /> : <Minus size={13} />}
            </button>
            <button
              onClick={stopGuide}
              className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg"
              aria-label="Fermer le guide"
              onPointerDown={e => e.stopPropagation()}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Collapsible content */}
        {!minimized && (
          <>
            {/* Progress bar */}
            <div className="h-0.5 bg-muted">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "hsl(var(--chess-gold))" }}
              />
            </div>

            {/* Message */}
            <div className="px-3.5 py-3 min-h-[64px] max-h-[28vh] overflow-y-auto">
              <p className="text-sm leading-relaxed text-foreground">
                {displayed}
                {!done && <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse align-middle" />}
              </p>
            </div>

            {/* Hint */}
            {showHint && step.hint && (
              <div className="mx-3 mb-2 px-3 py-2 rounded-xl text-xs flex gap-2"
                style={{ background: "hsl(var(--chess-gold)/0.10)", color: "hsl(var(--chess-gold-dark))" }}>
                <span className="shrink-0">💡</span>
                <span>{step.hint}</span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 px-3 pb-3">
              {/* Dot progress */}
              <div className="flex items-center gap-1">
                {activeGuide.steps.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all duration-300 ${
                    i < currentStep
                      ? "w-1.5 h-1.5 bg-green-400"
                      : i === currentStep
                      ? "w-3 h-1.5 bg-[hsl(var(--chess-blue))]"
                      : "w-1.5 h-1.5 bg-muted"
                  }`} />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={stopGuide}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
                >
                  <SkipForward size={12} /> Passer
                </button>

                {(step.trigger.type === "manual" || (done && showHint)) && (
                  <button
                    onClick={isLastStep ? stopGuide : doAdvance}
                    className="flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                    style={{ background: "hsl(var(--chess-blue))" }}
                  >
                    {isLastStep ? "Terminer ✓" : <>Suivant <ChevronRight size={12} /></>}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Bubble tail (hidden when minimized) */}
        {!minimized && (
          <div className="absolute -bottom-2 right-10 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
        )}
      </div>

      {/* ── King character ── */}
      <div className="pointer-events-auto flex items-center gap-2 mr-2">
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-default shadow-xl border-2"
          style={{
            background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))",
            borderColor: "hsl(var(--chess-gold)/0.5)",
            animation: kingMood === "celebrate"
              ? "king-celebrate 0.6s ease-in-out infinite alternate"
              : "king-float 3s ease-in-out infinite",
            fontSize: "1.75rem",
            userSelect: "none",
          }}
          title="Le Roi — ton guide"
        >
          {kingMood === "celebrate" ? "♛" : "♔"}
        </div>
      </div>
    </div>
    </>
  )
}

export default GuideWidget
