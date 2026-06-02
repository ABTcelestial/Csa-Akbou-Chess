import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'CSA Akbou Chess'
const SITE_URL  = 'https://csa-akbou-chess.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-home.jpg`

interface PageSEOProps {
  title: string
  description: string
  path: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: object
}

export default function PageSEO({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: PageSEOProps) {
  const isHome     = path === '/'
  const fullTitle  = isHome ? title : `${title} | ${SITE_NAME}`
  const canonical  = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"        content={fullTitle} />
      <meta property="og:description"  content={description} />
      <meta property="og:type"         content={ogType} />
      <meta property="og:url"          content={canonical} />
      <meta property="og:image"        content={`${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type"   content="image/jpeg" />
      <meta property="og:image:alt"    content={fullTitle} />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:locale"       content="fr_FR" />

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={`${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
