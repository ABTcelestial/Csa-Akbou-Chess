import { Registration } from "@/hooks/useSupabase"
import { CheckCircle } from "lucide-react"

interface ConfirmationCardProps {
  registration: Registration
  tournament: { title: string; date: string; location?: string; type?: string }
}

const Row = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-400 w-28 shrink-0">{label}</span>
      <span className="font-medium text-gray-800 break-all">{value}</span>
    </div>
  ) : null

const ConfirmationCard = ({ registration, tournament }: ConfirmationCardProps) => {
  const ref = `#${registration.id.slice(0, 8).toUpperCase()}`
  const dateInscrit = new Date(registration.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div
      id="confirmation-card"
      style={{ width: 560, fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb" }}
    >
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
              CSA Akbou Chess
            </p>
            <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "4px 0 0", lineHeight: 1.2 }}>
              Confirmation d'inscription
            </h1>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: 8, display: "flex" }}>
            <CheckCircle size={28} color="#86efac" />
          </div>
        </div>

        {/* Tournoi */}
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            Tournoi
          </p>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.3 }}>{tournament.title}</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>
            {tournament.date}{tournament.location ? ` · ${tournament.location}` : ""}{tournament.type ? ` · ${tournament.type}` : ""}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 24px", background: "#f9fafb" }}>
        {registration.type === 'solo' ? (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Joueur inscrit
            </p>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              <Row label="Nom complet" value={`${registration.prenom || ''} ${registration.nom || ''}`.trim()} />
              <Row label="Date de naissance" value={registration.date_naissance} />
              <Row label="FIDE ID" value={registration.fide_id} />
              <Row label="Club" value={registration.club} />
              <Row label="Email" value={registration.email} />
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Club inscrit
            </p>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              <Row label="Nom du club" value={registration.nom_club} />
              <Row label="Responsable" value={registration.responsable} />
              <Row label="Téléphone" value={registration.telephone} />
              <Row label="Email" value={registration.email} />
            </div>
            {registration.joueurs && registration.joueurs.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
                  Joueurs ({registration.joueurs.length})
                </p>
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                  {registration.joueurs.map((j, i) => (
                    <div key={i} style={{
                      padding: "8px 14px",
                      borderBottom: i < (registration.joueurs?.length ?? 0) - 1 ? "1px solid #f3f4f6" : "none",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827" }}>{j.prenom} {j.nom}</p>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>
                          {j.dateNaissance}{j.fideId ? ` · FIDE ${j.fideId}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 24px", background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 9, color: "#9ca3af" }}>Référence inscription</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#1e3a5f", letterSpacing: "0.05em" }}>{ref}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 9, color: "#9ca3af" }}>Inscrit le</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#374151" }}>{dateInscrit}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 9, color: "#9ca3af" }}>csa-akbou-chess.com</p>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationCard
