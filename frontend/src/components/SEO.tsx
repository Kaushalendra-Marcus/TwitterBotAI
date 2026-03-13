import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  noIndex?: boolean
}

const BASE_URL  = 'https://tweetbotai.vercel.app'
const OG_IMAGE  = `${BASE_URL}/og-image.png`
const SITE_NAME = 'TweetBotAI'

export function SEO({ title, description, keywords, canonical, noIndex = false }: SEOProps) {
  const fullTitle       = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Automate Your X Account with AI`
  const fullDescription = description ?? 'Create AI-powered bots that post to your real X account automatically. Powered by Google Gemini. AES-256 encrypted. Set up in 2 minutes.'
  const fullCanonical   = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author"   content="Kaushalendra Singh" />
      <meta name="creator"  content="Kaushalendra Singh" />
      <link rel="author"    href="https://kaushalendra-portfolio.vercel.app/" />
      <link rel="canonical" href={fullCanonical} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }

      {/* Open Graph */}
      <meta property="og:type"         content="website" />
      <meta property="og:url"          content={fullCanonical} />
      <meta property="og:title"        content={fullTitle} />
      <meta property="og:description"  content={fullDescription} />
      <meta property="og:image"        content={OG_IMAGE} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content="TweetBotAI - AI-powered X automation platform" />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:locale"       content="en_US" />

      {/* Twitter / X Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@tweetbotai" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image"       content={OG_IMAGE} />
      <meta name="twitter:image:alt"   content="TweetBotAI - AI-powered X automation platform" />
    </Helmet>
  )
}