import { useEffect, useState, useCallback, useRef } from "react"
import { useLocation } from "react-router-dom"
import { X, ChevronRight, SkipForward } from "lucide-react"
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

// ── Pulsing highlight ──────────────────────────────────────────────────────
function useHighlight(selector: string | undefined, active: boolean) {
  useEffect(() => {
    const cleanup = () =>
      document.querySelectorAll(".guide-pulse").forEach(el => el.classList.remove("guide-pulse"))

    if (!active || !selector) { cleanup(); return }

    let attempts = 0
    const tryHighlight = () => {
      const el = document.querySelector(selector)
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
      const el = document.querySelector(selector)
      if (!el) return
      const r = el.getBoundingClientRect()
      // If element is in top 180px → place arrow below it (pointing up ▲)
      const pointUp = r.top < 180
      setPos({
        top: pointUp ? r.bottom + 8 : r.top - 38,
        left: r.left + r.width / 2,
        pointUp,
      })
    }

    let attempts = 0
    const tryFind = () => {
      if (document.querySelector(selector)) compute()
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

  const step = activeGuide?.steps[currentStep] ?? null
  const isLastStep = activeGuide ? currentStep === activeGuide.steps.length - 1 : false

  const { displayed, done } = useTypewriter(step?.message ?? "")

  useHighlight(step?.highlight, !!activeGuide)
  const arrowPos = useArrow(step?.highlight, !!activeGuide)

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
    // Already on target page when step starts → advance immediately
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

    <div className="fixed bottom-5 right-4 z-[300] flex flex-col items-end gap-2 select-none pointer-events-none">

      {/* ── Speech bubble ── */}
      <div
        className="pointer-events-auto w-72 sm:w-80 bg-white dark:bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b"
          style={{ background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))" }}>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs font-semibold tracking-wide">
              {activeGuide.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 text-[10px]">{currentStep + 1}/{activeGuide.steps.length}</span>
            <button
              onClick={stopGuide}
              className="text-white/50 hover:text-white transition-colors p-0.5 rounded"
              aria-label="Fermer le guide"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "hsl(var(--chess-gold))" }}
          />
        </div>

        {/* Message */}
        <div className="px-4 py-3 min-h-[72px]">
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
            {/* Skip button — always visible */}
            <button
              onClick={stopGuide}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
            >
              <SkipForward size={11} /> Passer
            </button>

            {/* Manual "next" button — only shown on manual trigger OR as fallback */}
            {(step.trigger.type === "manual" || (done && showHint)) && (
              <button
                onClick={isLastStep ? stopGuide : doAdvance}
                className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: "hsl(var(--chess-blue))" }}
              >
                {isLastStep ? "Terminer ✓" : <>Suivant <ChevronRight size={11} /></>}
              </button>
            )}
          </div>
        </div>

        {/* Bubble tail */}
        <div className="absolute -bottom-2 right-10 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
      </div>

      {/* ── King character ── */}
      <div className="pointer-events-auto flex items-center gap-2 mr-2">
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-default shadow-xl border-2"
          style={{
            background: "linear-gradient(135deg, hsl(var(--chess-blue-dark)), hsl(var(--chess-blue)))",
            borderColor: "hsl(var(--chess-gold)/0.5)",
            animation: kingMood === "celebrate"
              ? "king-celebrate 0.6s ease-in-out infinite alternate"
              : "king-float 3s ease-in-out infinite",
            fontSize: "2rem",
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
