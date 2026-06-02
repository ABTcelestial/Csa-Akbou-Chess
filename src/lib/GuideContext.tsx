import { createContext, useContext, useState, ReactNode } from "react"
import { type Tournament } from "@/lib/supabase"

// ── Mock tournament (used when guide is active but no real tournaments exist) ──
export const MOCK_GUIDE_TOURNAMENT: Tournament = {
  id: "__guide_test__",
  title: "Tournoi de démonstration — Guide",
  type: "Blitz",
  date: "15 juin 2026",
  date_iso: "2026-06-15",
  cadence: "5+3",
  rounds: 7,
  location: "Akbou, Béjaïa",
  description:
    "Ce tournoi est utilisé par le guide interactif. Votre inscription ne sera pas enregistrée en base de données — mais la génération du PDF et l'envoi de l'email de confirmation fonctionnent normalement.",
  homologue: false,
  niveaux: "Tous niveaux",
  fiches_techniques_urls: [],
  is_past: false,
  registrations_closed: false,
  display_order: 0,
  extra_places: [],
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}

// ── Trigger types ──────────────────────────────────────────────────────────
export type StepTrigger =
  | { type: "navigate"; path: string }
  | { type: "click"; selector: string }
  | { type: "event"; name: string }
  | { type: "timer"; seconds: number }
  | { type: "manual" }

export interface GuideStep {
  message: string
  trigger: StepTrigger
  highlight?: string   // CSS selector to pulse
  hint?: string        // shown after 10s if stuck
}

export interface Guide {
  id: string
  title: string
  icon: string
  steps: GuideStep[]
}

// ── Guide definitions ──────────────────────────────────────────────────────
export const GUIDES: Guide[] = [
  {
    id: "tour",
    title: "Tour du site",
    icon: "🗺️",
    steps: [
      {
        message: "Bienvenue ! Je suis le Roi, ton guide officiel. Commençons la visite du site — clique sur « Tournois » dans la barre de navigation !",
        trigger: { type: "navigate", path: "/tournois" },
        highlight: 'a[href="/tournois"]',
        hint: "La barre de navigation est tout en haut de la page.",
      },
      {
        message: "Tu vois la liste des compétitions. Clique sur n'importe quelle carte de tournoi pour voir ses détails.",
        trigger: { type: "click", selector: '[data-guide="tournament-card"]' },
        highlight: '[data-guide="tournament-card"]',
        hint: "Clique directement sur le titre ou la carte d'un tournoi.",
      },
      {
        message: "Voilà les détails — cadence, lieu, inscrits. Ferme ce panneau (✕) puis clique sur « À propos » dans la navigation.",
        trigger: { type: "navigate", path: "/a-propos" },
        highlight: 'a[href="/a-propos"]',
        hint: "Clique sur ✕ pour fermer ce panneau, puis sur « À propos » en haut.",
      },
      {
        message: "Ici tu découvres l'histoire et les valeurs du club. Va maintenant sur « Contact ».",
        trigger: { type: "navigate", path: "/contact" },
        highlight: 'a[href="/contact"]',
      },
      {
        message: "Tu trouves ici notre téléphone, adresse et réseaux sociaux. Retourne sur l'Accueil en cliquant sur le logo.",
        trigger: { type: "navigate", path: "/" },
        highlight: 'a[href="/"]',
      },
      {
        message: "Bravo ! Tu connais maintenant toutes les sections du site. Reviens quand tu veux pour t'inscrire à un tournoi. ♔",
        trigger: { type: "manual" },
      },
    ],
  },
  {
    id: "inscription-solo",
    title: "S'inscrire à un tournoi",
    icon: "👤",
    steps: [
      {
        message: "Pour t'inscrire à un tournoi, commence par cliquer sur « Tournois » dans la navigation.",
        trigger: { type: "navigate", path: "/tournois" },
        highlight: 'a[href="/tournois"]',
        hint: "Regarde la barre de navigation en haut de la page.",
      },
      {
        message: "Cherche un tournoi ouvert (marqué « Bientôt » ou « Aujourd'hui ») et clique dessus pour voir ses détails.",
        trigger: { type: "click", selector: '[data-guide="tournament-card"]' },
        highlight: '[data-guide="tournament-card"]',
        hint: "Clique sur la carte d'un tournoi disponible.",
      },
      {
        message: "Clique sur le bouton bleu « S'inscrire à ce tournoi ».",
        trigger: { type: "click", selector: '[data-guide="btn-sinscrire"]' },
        highlight: '[data-guide="btn-sinscrire"]',
        hint: "Le bouton bleu est en bas des détails du tournoi.",
      },
      {
        message: "Clique sur « Individuelle », remplis ton Nom, Prénom et ta date de naissance (JJ/MM/AAAA), puis clique sur « Valider mon inscription ».",
        trigger: { type: "event", name: "guide:registration-success" },
        highlight: '[data-guide="btn-confirmer"]',
        hint: "Le FIDE ID est facultatif. Si tu n'en as pas, laisse le champ vide.",
      },
      {
        message: "Inscription confirmée ! 🎉 Télécharge et conserve ta fiche PDF. ♔",
        trigger: { type: "manual" },
      },
    ],
  },
  {
    id: "inscription-club",
    title: "Inscrire un club",
    icon: "🏛️",
    steps: [
      {
        message: "Pour inscrire ton club à un tournoi, clique sur « Tournois » dans la navigation.",
        trigger: { type: "navigate", path: "/tournois" },
        highlight: 'a[href="/tournois"]',
      },
      {
        message: "Clique sur un tournoi ouvert pour accéder à ses détails.",
        trigger: { type: "click", selector: '[data-guide="tournament-card"]' },
        highlight: '[data-guide="tournament-card"]',
      },
      {
        message: "Clique sur le bouton bleu « S'inscrire à ce tournoi ».",
        trigger: { type: "click", selector: '[data-guide="btn-sinscrire"]' },
        highlight: '[data-guide="btn-sinscrire"]',
      },
      {
        message: "Clique sur « Club », remplis le nom du club et du responsable, ajoute chaque joueur (+ Ajouter un joueur), puis valide. Tu peux aussi importer un fichier JSON d'un tournoi précédent !",
        trigger: { type: "event", name: "guide:registration-success" },
        highlight: '[data-guide="btn-confirmer"]',
        hint: "Chaque joueur doit avoir un Nom, Prénom et une date de naissance complète.",
      },
      {
        message: "Club inscrit ! 🏆 Télécharge la fiche de confirmation pour tes archives. ♔",
        trigger: { type: "manual" },
      },
    ],
  },
  {
    id: "infos",
    title: "Trouver les infos",
    icon: "ℹ️",
    steps: [
      {
        message: "Les horaires des séances se trouvent sur la page d'Accueil. Clique sur le logo du club ou sur « Accueil ».",
        trigger: { type: "navigate", path: "/" },
        highlight: 'a[href="/"]',
      },
      {
        message: "Fais défiler vers le bas pour voir les horaires, les actualités et la galerie photo.",
        trigger: { type: "timer", seconds: 6 },
        hint: "Fais défiler la page vers le bas.",
      },
      {
        message: "Pour nous contacter directement, clique sur « Contact » dans la navigation.",
        trigger: { type: "navigate", path: "/contact" },
        highlight: 'a[href="/contact"]',
      },
      {
        message: "Tu trouves ici notre numéro WhatsApp, Facebook, adresse et un formulaire de message. C'est tout ! ♔",
        trigger: { type: "manual" },
      },
    ],
  },
]

// ── Context ────────────────────────────────────────────────────────────────
interface GuideCtx {
  activeGuide: Guide | null
  currentStep: number
  startGuide: (id: string) => void
  advanceStep: () => void
  stopGuide: () => void
}

const Ctx = createContext<GuideCtx | null>(null)

export const GuideProvider = ({ children }: { children: ReactNode }) => {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const startGuide = (id: string) => {
    const g = GUIDES.find(g => g.id === id) ?? null
    setActiveGuide(g)
    setCurrentStep(0)
  }

  const advanceStep = () => {
    setActiveGuide(prev => {
      if (!prev) return null
      setCurrentStep(s => {
        if (s >= prev.steps.length - 1) {
          // will stop guide after state settles
          setTimeout(() => setActiveGuide(null), 50)
          return 0
        }
        return s + 1
      })
      return prev
    })
  }

  const stopGuide = () => {
    setActiveGuide(null)
    setCurrentStep(0)
  }

  return (
    <Ctx.Provider value={{ activeGuide, currentStep, startGuide, advanceStep, stopGuide }}>
      {children}
    </Ctx.Provider>
  )
}

export const useGuide = (): GuideCtx => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useGuide must be inside GuideProvider")
  return ctx
}
