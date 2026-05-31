import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface JoueurPayload {
  nom: string
  prenom: string
  fideId?: string
  dateNaissance?: string
}

interface RegistrationPayload {
  id: string
  type: 'solo' | 'club'
  nom?: string
  prenom?: string
  fide_id?: string
  club?: string
  date_naissance?: string
  nom_club?: string
  responsable?: string
  telephone?: string
  joueurs?: JoueurPayload[]
  email?: string
  created_at: string
}

interface TournamentPayload {
  title: string
  date: string
  location?: string
  type?: string
}

function buildEmailHtml(
  type: 'solo' | 'club',
  tournament: TournamentPayload,
  registration: RegistrationPayload,
): string {
  const ref = `#${registration.id.slice(0, 8).toUpperCase()}`
  const dateInscrit = new Date(registration.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const soloRows = type === 'solo' ? `
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:140px">Nom complet</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.prenom ?? ''} ${registration.nom ?? ''}</td></tr>
    ${registration.date_naissance ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Date de naissance</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.date_naissance}</td></tr>` : ''}
    ${registration.fide_id ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">FIDE ID</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.fide_id}</td></tr>` : ''}
    ${registration.club ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Club</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.club}</td></tr>` : ''}
  ` : ''

  const clubInfo = type === 'club' ? `
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:140px">Club</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.nom_club ?? ''}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Responsable</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.responsable ?? ''}</td></tr>
    ${registration.telephone ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Téléphone</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827">${registration.telephone}</td></tr>` : ''}
  ` : ''

  const joueursList = type === 'club' && registration.joueurs?.length ? `
    <h3 style="font-size:13px;font-weight:700;color:#374151;margin:20px 0 8px;text-transform:uppercase;letter-spacing:0.08em">Joueurs inscrits (${registration.joueurs.length})</h3>
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600">#</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600">Joueur</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600">Naissance</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600">FIDE ID</th>
        </tr>
      </thead>
      <tbody>
        ${registration.joueurs.map((j, i) => `
          <tr style="border-top:1px solid #f3f4f6">
            <td style="padding:8px 12px;font-size:12px;color:#6b7280">${i + 1}</td>
            <td style="padding:8px 12px;font-size:12px;font-weight:600;color:#111827">${j.prenom} ${j.nom}</td>
            <td style="padding:8px 12px;font-size:12px;color:#374151">${j.dateNaissance ?? '—'}</td>
            <td style="padding:8px 12px;font-size:12px;color:#374151">${j.fideId || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;max-width:560px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:28px 32px">
            <p style="margin:0 0 4px;color:#fbbf24;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">CSA Akbou Chess</p>
            <h1 style="margin:0 0 16px;color:#fff;font-size:22px;font-weight:800">Inscription confirmée ✓</h1>
            <div style="background:rgba(255,255,255,0.12);border-radius:10px;padding:14px 18px">
              <p style="margin:0 0 4px;color:rgba(255,255,255,0.55);font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">Tournoi</p>
              <p style="margin:0 0 4px;color:#fff;font-size:15px;font-weight:700">${tournament.title}</p>
              <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px">${tournament.date}${tournament.location ? ' · ' + tournament.location : ''}${tournament.type ? ' · ' + tournament.type : ''}</p>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 32px;background:#f9fafb">
            <h3 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.08em">
              ${type === 'solo' ? 'Joueur inscrit' : 'Club inscrit'}
            </h3>
            <div style="background:#fff;border-radius:10px;border:1px solid #e5e7eb;padding:14px 18px">
              <table style="width:100%;border-collapse:collapse">
                ${soloRows}
                ${clubInfo}
              </table>
            </div>
            ${joueursList}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#fff;border-top:1px solid #e5e7eb">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:10px;color:#9ca3af">Référence inscription</p>
                  <p style="margin:0;font-size:14px;font-weight:800;color:#1e3a5f;letter-spacing:0.05em">${ref}</p>
                </td>
                <td style="text-align:right">
                  <p style="margin:0;font-size:10px;color:#9ca3af">Inscrit le ${dateInscrit}</p>
                  <p style="margin:0;font-size:10px;color:#9ca3af">csa-akbou-chess.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, type, tournament, registration } = req.body as {
    email: string
    type: 'solo' | 'club'
    tournament: TournamentPayload
    registration: RegistrationPayload
  }

  if (!email || !type || !tournament || !registration) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await resend.emails.send({
      from: 'CSA Akbou Chess <inscriptions@csa-akbou-chess.com>',
      to: email,
      subject: `Confirmation d'inscription — ${tournament.title}`,
      html: buildEmailHtml(type, tournament, registration),
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
