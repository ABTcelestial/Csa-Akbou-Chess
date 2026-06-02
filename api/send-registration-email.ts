import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── Palette (identique à ConfirmationCard) ─────────────────────
const NAVY  = '#1a2f4e'
const NAVY2 = '#243d5c'
const GOLD  = '#c9a227'
const GRAY_BG = '#f5f6f8'
const GRAY_BORDER = '#e2e5ea'
const GRAY_TEXT = '#5a6272'
const DARK_TEXT = '#1a2030'
const WHITE = '#ffffff'

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
  registration_order?: number
  is_waitlist?: boolean
  created_at: string
}

interface TournamentPayload {
  title: string
  date: string
  location?: string
  type?: string
}

function row(label: string, value?: string | null): string {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:8px 0 8px 0;font-size:12px;color:${GRAY_TEXT};font-weight:500;width:150px;vertical-align:top;border-bottom:1px solid ${GRAY_BORDER}">${label}</td>
      <td style="padding:8px 0 8px 12px;font-size:12px;color:${DARK_TEXT};font-weight:700;border-bottom:1px solid ${GRAY_BORDER}">${value}</td>
    </tr>`
}

function buildEmailHtml(
  type: 'solo' | 'club',
  tournament: TournamentPayload,
  registration: RegistrationPayload,
  maxCapacity: number | null,
): string {
  const ref = `#${registration.id.slice(0, 8).toUpperCase()}`
  const dateInscrit = new Date(registration.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const tournamentMeta = [tournament.date, tournament.location, tournament.type].filter(Boolean).join('  ·  ')

  const soloRows = type === 'solo' ? `
    ${row('Nom complet', `${registration.prenom ?? ''} ${registration.nom ?? ''}`.trim())}
    ${row('Date de naissance', registration.date_naissance)}
    ${row('FIDE ID', registration.fide_id)}
    ${row('Club', registration.club)}
    ${row('Email', registration.email)}
  ` : ''

  const clubRows = type === 'club' ? `
    ${row('Nom du club', registration.nom_club)}
    ${row('Responsable', registration.responsable)}
    ${row('Téléphone', registration.telephone)}
    ${row('Email', registration.email)}
  ` : ''

  const baseOrder = registration.registration_order ?? null
  const joueurRows = type === 'club' && registration.joueurs?.length ? `
    <tr><td colspan="2" style="padding:20px 0 10px">
      <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:0.15em;color:${NAVY};text-transform:uppercase">
        Joueurs inscrits (${registration.joueurs.length})
      </p>
    </td></tr>
    <tr><td colspan="2" style="padding:0">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid ${GRAY_BORDER}">
        <tr style="background:${NAVY}">
          <td style="padding:8px 12px;font-size:10px;font-weight:700;color:${GOLD};width:52px">${maxCapacity != null ? 'Rang' : '#'}</td>
          <td style="padding:8px 12px;font-size:10px;font-weight:700;color:${GOLD}">Joueur</td>
          <td style="padding:8px 12px;font-size:10px;font-weight:700;color:${GOLD}">Naissance</td>
          <td style="padding:8px 12px;font-size:10px;font-weight:700;color:${GOLD}">FIDE ID</td>
        </tr>
        ${(registration.joueurs ?? []).map((j, i) => {
          const pOrder = maxCapacity != null && baseOrder != null ? baseOrder + i : i + 1
          const pWaitlist = maxCapacity != null && pOrder > maxCapacity
          const rankColor = maxCapacity != null ? (pWaitlist ? '#ea580c' : '#16a34a') : GRAY_TEXT
          const rankLabel = maxCapacity != null ? `${pOrder}/${maxCapacity}` : String(i + 1)
          return `
        <tr style="background:${i % 2 === 1 ? GRAY_BG : WHITE};border-top:1px solid ${GRAY_BORDER}">
          <td style="padding:8px 12px;font-size:11px;color:${rankColor};font-weight:800">${rankLabel}</td>
          <td style="padding:8px 12px;font-size:12px;color:${DARK_TEXT};font-weight:700">${j.prenom} ${j.nom}</td>
          <td style="padding:8px 12px;font-size:11px;color:${GRAY_TEXT}">${j.dateNaissance ?? '—'}</td>
          <td style="padding:8px 12px;font-size:11px;color:${GRAY_TEXT}">${j.fideId || '—'}</td>
        </tr>`
        }).join('')}
      </table>
    </td></tr>
  ` : ''

  const numJoueursEmail = type === 'club' ? (registration.joueurs?.length ?? 1) : 1
  const lastOrderEmail = baseOrder != null ? baseOrder + numJoueursEmail - 1 : null
  const allWlEmail = baseOrder != null && maxCapacity != null && baseOrder > maxCapacity
  const anyWlEmail = lastOrderEmail != null && maxCapacity != null && lastOrderEmail > maxCapacity
  const noteWlEmail = type === 'solo' ? (registration.is_waitlist ?? false) : anyWlEmail

  let noteMsg = ''
  if (baseOrder != null && maxCapacity != null) {
    if (type === 'club') {
      if (allWlEmail) {
        noteMsg = `Vos ${numJoueursEmail} joueur${numJoueursEmail > 1 ? 's' : ''} ont été placés en liste d'attente (positions ${baseOrder}–${lastOrderEmail}/${maxCapacity}).`
      } else if (anyWlEmail) {
        const inList = maxCapacity - baseOrder + 1
        const onWait = lastOrderEmail! - maxCapacity
        noteMsg = `${inList} joueur${inList > 1 ? 's' : ''} confirmé${inList > 1 ? 's' : ''} (positions ${baseOrder}–${maxCapacity}) · ${onWait} en liste d'attente (positions ${maxCapacity + 1}–${lastOrderEmail}).`
      } else {
        noteMsg = `Vos ${numJoueursEmail} joueur${numJoueursEmail > 1 ? 's' : ''} sont inscrits (positions ${baseOrder}–${lastOrderEmail} sur ${maxCapacity}).`
      }
    } else {
      noteMsg = registration.is_waitlist
        ? `Vous avez été placé(e) en liste d'attente (position ${baseOrder}/${maxCapacity}). Votre inscription est bien enregistrée.`
        : `Vous êtes ${baseOrder === 1 ? 'le/la premier(e) inscrit(e)' : `la ${baseOrder}ème personne inscrite`} sur ${maxCapacity} places disponibles.`
    }
  }

  const capacityNote = maxCapacity != null && noteMsg ? `
    <tr><td colspan="2" style="padding:14px 0 0">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="background:${noteWlEmail ? '#fff7ed' : '#f0fdf4'};border:1px solid ${noteWlEmail ? '#fed7aa' : '#bbf7d0'};border-radius:8px;padding:10px 14px">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:16px;vertical-align:top;padding-right:10px;width:24px">${noteWlEmail ? '⏳' : '✅'}</td>
              <td style="font-size:11px;color:${noteWlEmail ? '#9a3412' : '#14532d'};font-weight:600;line-height:1.4">${noteMsg}</td>
            </tr></table>
          </td>
        </tr>
      </table>
    </td></tr>
  ` : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${GRAY_BG};font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0"
  style="background:${WHITE};border-radius:14px;overflow:hidden;border:1px solid ${GRAY_BORDER};max-width:600px;width:100%">

  <!-- ── HEADER ────────────────────────────────────────── -->
  <tr>
    <td style="background:linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%);padding:22px 28px 20px">
      <!-- Logo + titre + badge -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:72px;vertical-align:middle">
            <img src="https://csa-akbou-chess.com/logo-club.jpg"
              alt="CSA Akbou Chess"
              width="66" height="66"
              style="border-radius:50%;border:3px solid ${GOLD};display:block;object-fit:cover"
            />
          </td>
          <td style="padding-left:16px;vertical-align:middle">
            <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:0.18em;color:${GOLD};text-transform:uppercase">CSA AKBOU CHESS</p>
            <p style="margin:1px 0 0;font-size:10px;color:rgba(255,255,255,0.5)">النادي الهواوي الرياضي أقبو للشطرنج</p>
            <h1 style="margin:5px 0 0;font-size:17px;font-weight:900;color:${WHITE};letter-spacing:0.03em;line-height:1.2">CONFIRMATION D'INSCRIPTION</h1>
          </td>
          <td style="vertical-align:middle;text-align:center;width:96px">
            <div style="background:rgba(201,162,39,0.15);border:2px solid ${GOLD};border-radius:8px;padding:6px 10px;display:inline-block;margin-bottom:${maxCapacity != null ? '6px' : '0'}">
              <div style="font-size:20px;color:${GOLD}">✓</div>
              <p style="margin:0;font-size:9px;font-weight:800;color:${GOLD};letter-spacing:0.1em">VALIDÉE</p>
            </div>
            ${maxCapacity != null ? `
            <div style="background:${registration.is_waitlist ? 'rgba(234,88,12,0.18)' : 'rgba(22,163,74,0.15)'};border:2px solid ${registration.is_waitlist ? '#ea580c' : '#16a34a'};border-radius:8px;padding:5px 8px;display:inline-block">
              <p style="margin:0;font-size:13px;font-weight:900;color:${registration.is_waitlist ? '#ea580c' : '#16a34a'};line-height:1.1">${registration.registration_order ?? '?'} / ${maxCapacity}</p>
              <p style="margin:0;font-size:8px;font-weight:800;color:${registration.is_waitlist ? '#ea580c' : '#16a34a'};letter-spacing:0.08em;text-transform:uppercase">${registration.is_waitlist ? 'ATTENTE' : 'PLACE'}</p>
            </div>` : ''}
          </td>
        </tr>
      </table>

      <!-- Séparateur or -->
      <div style="height:1px;background:linear-gradient(90deg,${GOLD},transparent);margin:16px 0 14px"></div>

      <!-- Tournoi -->
      <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(201,162,39,0.35);border-radius:10px;padding:12px 16px">
        <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:0.12em;color:${GOLD};text-transform:uppercase">TOURNOI</p>
        <p style="margin:0;font-size:15px;font-weight:800;color:${WHITE};line-height:1.3">${tournament.title}</p>
        <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.65)">${tournamentMeta}</p>
      </div>
    </td>
  </tr>

  <!-- ── BODY ──────────────────────────────────────────── -->
  <tr>
    <td style="background:${GRAY_BG};padding:20px 28px">

      <!-- Section label -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:12px">
        <tr>
          <td style="width:4px;background:${GOLD};border-radius:2px;vertical-align:middle">&nbsp;</td>
          <td style="padding-left:8px;font-size:10px;font-weight:800;letter-spacing:0.15em;color:${NAVY};text-transform:uppercase">
            ${type === 'solo' ? 'JOUEUR INSCRIT' : 'CLUB INSCRIT'}
          </td>
        </tr>
      </table>

      <!-- Info box -->
      <div style="background:${WHITE};border-radius:10px;border:1px solid ${GRAY_BORDER};padding:4px 16px">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${soloRows}
          ${clubRows}
          ${joueurRows}
          ${capacityNote}
        </table>
      </div>
    </td>
  </tr>

  <!-- ── RÉFÉRENCE ─────────────────────────────────────── -->
  <tr>
    <td style="background:${WHITE};border-top:1px solid ${GRAY_BORDER};padding:14px 28px">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:middle">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:${NAVY};border-radius:8px;padding:6px 12px;vertical-align:middle">
                  <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.6);font-weight:600;letter-spacing:0.1em">RÉFÉRENCE</p>
                  <p style="margin:0;font-size:15px;font-weight:900;color:${GOLD};letter-spacing:0.1em">${ref}</p>
                </td>
                <td style="padding-left:12px;vertical-align:middle">
                  <p style="margin:0;font-size:9px;color:${GRAY_TEXT}">Date d'inscription</p>
                  <p style="margin:0;font-size:12px;font-weight:700;color:${DARK_TEXT}">${dateInscrit}</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align:right;vertical-align:middle">
            <p style="margin:0;font-size:9px;color:${GRAY_TEXT}">Document officiel</p>
            <p style="margin:0;font-size:10px;font-weight:700;color:${NAVY}">csa-akbou-chess.com</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── FOOTER TAGLINE ────────────────────────────────── -->
  <tr>
    <td style="background:${NAVY};padding:10px 28px;text-align:center">
      <p style="margin:0;font-size:9px;color:${GOLD};font-weight:700;letter-spacing:0.18em">
        ÉCHECS &nbsp;·&nbsp; STRATÉGIE &nbsp;·&nbsp; RÉFLEXION &nbsp;·&nbsp; RESPECT &nbsp;·&nbsp; AMITIÉ
      </p>
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

  const { email, type, tournament, registration, maxCapacity } = req.body as {
    email: string
    type: 'solo' | 'club'
    tournament: TournamentPayload
    registration: RegistrationPayload
    maxCapacity?: number | null
  }

  if (!email || !type || !tournament || !registration) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await resend.emails.send({
      from: 'CSA Akbou Chess <inscriptions@csa-akbou-chess.com>',
      to: email,
      subject: `Confirmation d'inscription — ${tournament.title}`,
      html: buildEmailHtml(type, tournament, registration, maxCapacity ?? null),
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
