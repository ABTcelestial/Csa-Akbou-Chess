import { Registration } from "@/hooks/useSupabase"
import logoClub from "@/assets/logo-club.jpg"

interface ConfirmationCardProps {
  registration: Registration
  tournament: { title: string; date: string; location?: string; type?: string }
  cardId?: string
}

// Palette
const NAVY   = "#1a2f4e"
const NAVY2  = "#243d5c"
const GOLD   = "#c9a227"
const GOLD2  = "#e8bc2d"
const WHITE  = "#ffffff"
const GRAY_BG = "#f5f6f8"
const GRAY_BORDER = "#e2e5ea"
const GRAY_TEXT = "#5a6272"
const DARK_TEXT = "#1a2030"

interface RowProps { label: string; value?: string | null }
const Row = ({ label, value }: RowProps) =>
  value ? (
    <div style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: `1px solid ${GRAY_BORDER}` }}>
      <span style={{ width: 150, flexShrink: 0, fontSize: 12, color: GRAY_TEXT, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 12, color: DARK_TEXT, fontWeight: 700, flex: 1 }}>{value}</span>
    </div>
  ) : null

const ConfirmationCard = ({ registration, tournament, cardId = "confirmation-card" }: ConfirmationCardProps) => {
  const ref = `#${registration.id.slice(0, 8).toUpperCase()}`
  const dateInscrit = new Date(registration.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div
      id={cardId}
      style={{
        width: 620,
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: WHITE,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${GRAY_BORDER}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: "22px 28px 20px" }}>
        {/* Ligne logo + titre + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            border: `3px solid ${GOLD}`,
            overflow: "hidden", flexShrink: 0,
            background: "#0f1e30",
          }}>
            <img src={logoClub} alt="CSA Akbou Chess" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Club name */}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" }}>
              CSA AKBOU CHESS
            </p>
            <p style={{ margin: "1px 0 0", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
              النادي الهواوي الرياضي أقبو للشطرنج
            </p>
            <h1 style={{ margin: "6px 0 0", fontSize: 17, fontWeight: 900, color: WHITE, letterSpacing: "0.03em", lineHeight: 1.2 }}>
              CONFIRMATION D'INSCRIPTION
            </h1>
          </div>

          {/* Badge validé */}
          <div style={{
            flexShrink: 0,
            background: "rgba(201,162,39,0.15)",
            border: `2px solid ${GOLD}`,
            borderRadius: 8,
            padding: "6px 12px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 18 }}>✓</div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: "0.1em" }}>VALIDÉE</p>
          </div>
        </div>

        {/* Séparateur or */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, margin: "16px 0 14px" }} />

        {/* Tournoi */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          border: `1px solid rgba(201,162,39,0.35)`,
          borderRadius: 10,
          padding: "12px 16px",
        }}>
          <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, textTransform: "uppercase" }}>
            TOURNOI
          </p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: WHITE, lineHeight: 1.3 }}>{tournament.title}</p>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
            {[tournament.date, tournament.location, tournament.type].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ background: GRAY_BG, padding: "20px 28px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 4, height: 16, background: GOLD, borderRadius: 2 }} />
          <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: NAVY, textTransform: "uppercase" }}>
            {registration.type === "solo" ? "Joueur inscrit" : "Club inscrit"}
          </p>
        </div>

        {/* Infos */}
        <div style={{ background: WHITE, borderRadius: 10, border: `1px solid ${GRAY_BORDER}`, padding: "4px 16px 4px" }}>
          {registration.type === "solo" ? (
            <>
              <Row label="Nom complet" value={`${registration.prenom ?? ""} ${registration.nom ?? ""}`.trim()} />
              <Row label="Date de naissance" value={registration.date_naissance} />
              <Row label="FIDE ID" value={registration.fide_id} />
              <Row label="Club" value={registration.club} />
              <Row label="Email" value={registration.email} />
            </>
          ) : (
            <>
              <Row label="Nom du club" value={registration.nom_club} />
              <Row label="Responsable" value={registration.responsable} />
              <Row label="Téléphone" value={registration.telephone} />
              <Row label="Email" value={registration.email} />
            </>
          )}
        </div>

        {/* Joueurs (club) */}
        {registration.type === "club" && registration.joueurs && registration.joueurs.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 16, background: GOLD, borderRadius: 2 }} />
              <p style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: NAVY, textTransform: "uppercase" }}>
                Joueurs inscrits ({registration.joueurs.length})
              </p>
            </div>
            <div style={{ background: WHITE, borderRadius: 10, border: `1px solid ${GRAY_BORDER}`, overflow: "hidden" }}>
              {/* En-tête table */}
              <div style={{ display: "flex", background: NAVY, padding: "7px 14px", gap: 8 }}>
                {["#", "Joueur", "Naissance", "FIDE ID"].map((h, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 10, fontWeight: 700, color: GOLD, flex: i === 1 ? 2 : 1, letterSpacing: "0.05em" }}>{h}</p>
                ))}
              </div>
              {registration.joueurs.map((j, i) => (
                <div key={i} style={{
                  display: "flex", padding: "8px 14px", gap: 8,
                  background: i % 2 === 1 ? GRAY_BG : WHITE,
                  borderTop: i > 0 ? `1px solid ${GRAY_BORDER}` : "none",
                  alignItems: "center",
                }}>
                  <p style={{ margin: 0, flex: 1, fontSize: 11, color: GRAY_TEXT, fontWeight: 700 }}>{i + 1}</p>
                  <p style={{ margin: 0, flex: 2, fontSize: 12, color: DARK_TEXT, fontWeight: 700 }}>{j.prenom} {j.nom}</p>
                  <p style={{ margin: 0, flex: 1, fontSize: 11, color: GRAY_TEXT }}>{j.dateNaissance || "—"}</p>
                  <p style={{ margin: 0, flex: 1, fontSize: 11, color: GRAY_TEXT }}>{j.fideId || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RÉFÉRENCE ───────────────────────────────────────── */}
      <div style={{
        background: WHITE,
        borderTop: `1px solid ${GRAY_BORDER}`,
        padding: "12px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: NAVY, borderRadius: 8, padding: "6px 12px" }}>
            <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.1em" }}>RÉFÉRENCE</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: GOLD, letterSpacing: "0.1em" }}>{ref}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 9, color: GRAY_TEXT }}>Date d'inscription</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>{dateInscrit}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 9, color: GRAY_TEXT }}>Document officiel</p>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: NAVY }}>csa-akbou-chess.com</p>
        </div>
      </div>

      {/* ── FOOTER TAGLINE ──────────────────────────────────── */}
      <div style={{ background: NAVY, padding: "8px 28px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.18em" }}>
          ÉCHECS &nbsp;·&nbsp; STRATÉGIE &nbsp;·&nbsp; RÉFLEXION &nbsp;·&nbsp; RESPECT &nbsp;·&nbsp; AMITIÉ
        </p>
      </div>
    </div>
  )
}

export default ConfirmationCard
