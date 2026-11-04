import { mkdir, writeFile } from 'node:fs/promises'

const rawSiteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL
const output = 'dist'
const robots = ['User-agent: *', 'Allow: /']

if (rawSiteUrl) {
  let siteUrl
  try { siteUrl = new URL(rawSiteUrl) } catch { throw new Error('SITE_URL debe ser una URL absoluta, por ejemplo https://colorwheel.example') }
  siteUrl.hash = ''
  siteUrl.search = ''
  const baseUrl = `${siteUrl.origin}${siteUrl.pathname.replace(/\/+$/, '')}`
  const pageUrl = `${baseUrl}/`
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${pageUrl}</loc>\n  </url>\n</urlset>\n`
  await mkdir(output, { recursive: true })
  await writeFile(`${output}/sitemap.xml`, sitemap)
  robots.push(`Sitemap: ${pageUrl}sitemap.xml`)
}

await mkdir(output, { recursive: true })
await writeFile(`${output}/robots.txt`, `${robots.join('\n')}\n`)
console.log(rawSiteUrl ? `SEO: sitemap generado para ${rawSiteUrl}` : 'SEO: sitemap omitido; configura SITE_URL en el despliegue público.')
