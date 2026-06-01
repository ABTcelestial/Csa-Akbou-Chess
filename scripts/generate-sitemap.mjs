import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const BASE = 'https://csa-akbou-chess.com'
const today = new Date().toISOString().split('T')[0]

const routes = [
  { path: '/',            changefreq: 'weekly',  priority: '1.0' },
  { path: '/tournois',    changefreq: 'weekly',  priority: '0.9' },
  { path: '/a-propos',    changefreq: 'monthly', priority: '0.8' },
  { path: '/realisations',changefreq: 'weekly',  priority: '0.7' },
  { path: '/contact',     changefreq: 'monthly', priority: '0.6' },
]

const urls = routes.map(r => `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

writeFileSync(resolve(root, 'public', 'sitemap.xml'), xml)
console.log(`✓ sitemap.xml généré (${today})`)
