import { useState } from "react";
import { HelpCircle, X, ChevronLeft, ChevronRight, MapPin, Trophy, Users, UserPlus, Building2, Info, Phone, ArrowRight, CheckCircle2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Step {
  title: string;
  description: string;
  tip?: string;
  icon?: React.ReactNode;
}

interface Guide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  steps: Step[];
}

// ── Guide content ──────────────────────────────────────────────────────────
const guides: Guide[] = [
  {
    id: "navigation",
    title: "Naviguer sur le site",
    subtitle: "Découvrez toutes les pages disponibles",
    icon: <MapPin size={20} />,
    color: "hsl(var(--chess-blue))",
    steps: [
      {
        title: "La barre de navigation",
        description: "En haut de chaque page, la barre de navigation vous donne accès à toutes les sections du site. Sur mobile, appuyez sur l'icône ☰ pour ouvrir le menu.",
        icon: <ArrowRight size={16} />,
      },
      {
        title: "Accueil",
        description: "La page d'accueil présente les actualités récentes, les photos de nos événements, les horaires des séances et les informations clés du club.",
        tip: "Faites défiler vers le bas pour voir toute la galerie photo.",
      },
      {
        title: "À propos",
        description: "Découvrez l'histoire du club, nos valeurs, notre équipe et les informations sur nos séances d'entraînement.",
      },
      {
        title: "Tournois",
        description: "Consultez les compétitions à venir, les tournois passés et inscrivez-vous directement en ligne.",
        tip: "Les tournois ouverts à l'inscription affichent un bouton \"S'inscrire\".",
      },
      {
        title: "Réalisations",
        description: "Retrouvez tous nos palmarès, trophées et résultats lors des compétitions nationales et régionales.",
      },
      {
        title: "Contact",
        description: "Trouvez nos coordonnées, notre adresse, nos réseaux sociaux et envoyez-nous un message directement depuis le formulaire.",
      },
    ],
  },
  {
    id: "inscription-individuelle",
    title: "S'inscrire à un tournoi",
    subtitle: "Inscription individuelle pas à pas",
    icon: <UserPlus size={20} />,
    color: "hsl(215, 70%, 45%)",
    steps: [
      {
        title: "Accédez à la page Tournois",
        description: "Cliquez sur « Tournois » dans la barre de navigation en haut du site.",
        icon: <ArrowRight size={16} />,
      },
      {
        title: "Choisissez un tournoi",
        description: "Parcourez la liste des tournois disponibles. Les tournois ouverts affichent un bouton bleu « S'inscrire ».",
        tip: "Les tournois marqués « Complet » ou « Terminé » ne sont plus accessibles.",
      },
      {
        title: "Ouvrez le formulaire d'inscription",
        description: "Cliquez sur le bouton « S'inscrire » sur la carte du tournoi. Un formulaire s'ouvre en bas de la page.",
      },
      {
        title: "Choisissez le type « Individuel »",
        description: "Dans le formulaire, sélectionnez l'onglet « Individuel » si vous vous inscrivez seul(e).",
      },
      {
        title: "Remplissez vos informations",
        description: "Entrez votre Nom, Prénom, FIDE ID (si vous en avez un) et votre date de naissance (JJ/MM/AAAA). Tous les champs marqués * sont obligatoires.",
        tip: "Votre FIDE ID se trouve sur le site officiel de la FIDE (fide.com).",
      },
      {
        title: "Confirmez l'inscription",
        description: "Cliquez sur « Confirmer l'inscription ». Vous recevrez une fiche de confirmation que vous pouvez télécharger ou photographier.",
        icon: <CheckCircle2 size={16} />,
      },
    ],
  },
  {
    id: "inscription-club",
    title: "Inscrire un club entier",
    subtitle: "Inscription collective pour les responsables de club",
    icon: <Building2 size={20} />,
    color: "hsl(var(--chess-gold-dark))",
    steps: [
      {
        title: "Accédez à la page Tournois",
        description: "Cliquez sur « Tournois » dans la barre de navigation, puis repérez un tournoi ouvert à l'inscription.",
      },
      {
        title: "Ouvrez le formulaire et choisissez « Club »",
        description: "Cliquez sur « S'inscrire », puis sélectionnez l'onglet « Club » dans le formulaire.",
      },
      {
        title: "Renseignez les informations du club",
        description: "Entrez le nom du club, le nom du responsable, son téléphone et son email. Ces informations seront visibles dans les exports.",
      },
      {
        title: "Ajoutez les joueurs un par un",
        description: "Cliquez sur « + Ajouter un joueur » pour chaque membre. Remplissez Nom, Prénom, FIDE ID et date de naissance pour chacun.",
        tip: "Minimum 1 joueur requis pour valider l'inscription.",
      },
      {
        title: "Ou importez un fichier JSON",
        description: "Si vous avez déjà exporté les joueurs lors d'un tournoi précédent, cliquez sur « Importer JSON » pour les charger automatiquement.",
        tip: "Le fichier JSON doit avoir été exporté depuis ce site.",
      },
      {
        title: "Confirmez et téléchargez la fiche",
        description: "Cliquez sur « Confirmer l'inscription ». Téléchargez la fiche PDF de confirmation pour vos archives.",
        icon: <CheckCircle2 size={16} />,
      },
    ],
  },
  {
    id: "informations",
    title: "Trouver les informations",
    subtitle: "Horaires, contact et actualités",
    icon: <Info size={20} />,
    color: "hsl(160, 55%, 40%)",
    steps: [
      {
        title: "Horaires des séances",
        description: "Les jours et heures des séances d'entraînement sont affichés sur la page d'Accueil, dans la section « Programme ». Faites défiler vers le bas.",
      },
      {
        title: "Actualités du club",
        description: "Les dernières nouvelles, annonces et articles sont publiés sur la page d'Accueil dans la section « Actualités ».",
      },
      {
        title: "Nous contacter",
        description: "Rendez-vous sur la page « Contact » via la navigation. Vous y trouverez notre adresse, numéro de téléphone et un formulaire de message.",
        icon: <Phone size={16} />,
      },
      {
        title: "Réseaux sociaux",
        description: "Nos liens Facebook, Instagram et WhatsApp sont disponibles dans le pied de page (en bas de chaque page) et sur la page Contact.",
        tip: "Rejoignez notre groupe WhatsApp pour les annonces urgentes et les invitations aux tournois.",
      },
    ],
  },
  {
    id: "realisations",
    title: "Consulter nos réalisations",
    subtitle: "Palmarès, trophées et galerie",
    icon: <Trophy size={20} />,
    color: "hsl(38, 80%, 45%)",
    steps: [
      {
        title: "Page Réalisations",
        description: "Cliquez sur « Réalisations » dans la navigation pour consulter tous nos trophées et résultats en compétition.",
      },
      {
        title: "Galerie photo",
        description: "Sur la page d'Accueil, faites défiler vers la section « Galerie » pour voir les photos de nos événements et tournois.",
        tip: "Cliquez sur une photo pour l'agrandir.",
      },
      {
        title: "Résultats des tournois",
        description: "Dans la page « Tournois », les compétitions passées indiquent le nombre de participants et la date. Consultez-les pour l'historique.",
      },
    ],
  },
  {
    id: "joueurs",
    title: "Informations pour les joueurs",
    subtitle: "Classements, FIDE ID et compétitions",
    icon: <Users size={20} />,
    color: "hsl(280, 60%, 50%)",
    steps: [
      {
        title: "Votre FIDE ID",
        description: "Le FIDE ID est un numéro d'identifiant international attribué par la FIDE. Vous pouvez le trouver sur le site fide.com en cherchant votre nom.",
        tip: "Si vous n'en avez pas encore, laissez le champ vide lors de l'inscription.",
      },
      {
        title: "Format de la date de naissance",
        description: "Lors de l'inscription, entrez votre date de naissance au format JJ/MM/AAAA (ex: 15/03/1990). Les chiffres s'ajoutent automatiquement.",
      },
      {
        title: "Fiche de confirmation",
        description: "Après inscription, téléchargez votre fiche de confirmation (PDF). Elle contient toutes vos informations et peut être demandée lors du tournoi.",
        icon: <CheckCircle2 size={16} />,
      },
      {
        title: "Tournois homologués",
        description: "Nos tournois sont homologués par la Fédération Algérienne d'Échecs. Les résultats sont pris en compte dans les classements nationaux.",
      },
    ],
  },
];

// ── Step indicator ─────────────────────────────────────────────────────────
const StepDot = ({ n, active, done }: { n: number; active: boolean; done: boolean }) => (
  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
    done ? "bg-green-500 text-white" : active ? "text-white" : "bg-muted text-muted-foreground"
  }`} style={active ? { background: "hsl(var(--chess-blue))" } : undefined}>
    {done ? <CheckCircle2 size={14} /> : n}
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
const SiteGuide = () => {
  const [open, setOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [step, setStep] = useState(0);

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setStep(0);
  };

  const back = () => {
    if (step > 0) setStep(s => s - 1);
    else setSelectedGuide(null);
  };

  const next = () => {
    if (selectedGuide && step < selectedGuide.steps.length - 1) setStep(s => s + 1);
    else setSelectedGuide(null);
  };

  const close = () => {
    setOpen(false);
    setSelectedGuide(null);
    setStep(0);
  };

  const currentStep = selectedGuide?.steps[step];

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Aide et guide du site"
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-colors"
      >
        <HelpCircle size={18} />
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* ── Panel ── */}
      <div className={`fixed top-0 right-0 h-full z-[201] w-full max-w-sm bg-background shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ background: "hsl(var(--chess-blue-dark))" }}>
          <div className="flex items-center gap-2.5">
            {selectedGuide && (
              <button onClick={back} className="text-white/70 hover:text-white transition-colors p-1 -ml-1 rounded-lg hover:bg-white/10">
                <ChevronLeft size={18} />
              </button>
            )}
            <HelpCircle size={18} className="text-[hsl(var(--chess-gold))]" />
            <span className="font-semibold text-sm text-white">
              {selectedGuide ? selectedGuide.title : "Guide du site"}
            </span>
          </div>
          <button onClick={close} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Topic list ── */}
          {!selectedGuide && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground px-1 pb-1">Choisissez un sujet pour commencer :</p>
              {guides.map((g) => (
                <button
                  key={g.id}
                  onClick={() => openGuide(g)}
                  className="w-full text-left flex items-center gap-3.5 p-4 rounded-2xl border hover:border-transparent transition-all group"
                  style={{ "--guide-color": g.color } as React.CSSProperties}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105"
                    style={{ background: `${g.color}18`, color: g.color }}>
                    {g.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">{g.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{g.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {/* ── Step view ── */}
          {selectedGuide && currentStep && (
            <div className="p-4 space-y-4">

              {/* Step progress dots */}
              <div className="flex items-center gap-1.5 px-1">
                {selectedGuide.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? "bg-green-500" : i === step ? "bg-[hsl(var(--chess-blue))]" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground text-right -mt-2">
                Étape {step + 1} / {selectedGuide.steps.length}
              </p>

              {/* Step content card */}
              <div className="rounded-2xl border overflow-hidden">
                {/* Step header */}
                <div className="flex items-center gap-3 p-4 border-b" style={{ background: `${selectedGuide.color}0c` }}>
                  <StepDot n={step + 1} active={true} done={false} />
                  <h3 className="font-bold text-sm leading-snug">{currentStep.title}</h3>
                </div>

                {/* Step body */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
                  {currentStep.tip && (
                    <div className="flex gap-2 p-3 rounded-xl text-xs" style={{ background: `${selectedGuide.color}0e`, color: selectedGuide.color }}>
                      <span className="font-bold shrink-0">💡</span>
                      <span>{currentStep.tip}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous steps summary */}
              {step > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-1">Étapes précédentes</p>
                  {selectedGuide.steps.slice(0, step).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
                    >
                      <StepDot n={i + 1} active={false} done={true} />
                      <span className="text-xs text-muted-foreground line-through">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {selectedGuide && (
          <div className="border-t p-4 flex gap-2">
            <button
              onClick={back}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
            >
              <ChevronLeft size={15} />
              {step === 0 ? "Retour" : "Précédent"}
            </button>
            <button
              onClick={next}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ background: selectedGuide.color }}
            >
              {step === selectedGuide.steps.length - 1 ? (
                <>Terminé <CheckCircle2 size={15} /></>
              ) : (
                <>Suivant <ChevronRight size={15} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SiteGuide;
