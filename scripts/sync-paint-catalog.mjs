import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const baseUrl = process.argv[2]?.replace(/\/$/, '')
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/paint-catalog.ts')
const hex = /^#[0-9a-f]{6}$/i

if (!baseUrl) {
  throw new Error('Uso: npm run sync:catalog -- <origen-del-catalogo>')
}

const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')

const plainText = (value) => decodeHtml(value.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

async function response(url) {
  const result = await fetch(url, { headers: { Accept: 'text/html, application/json' } })
  if (!result.ok) throw new Error(`${result.status} al descargar ${url}`)
  return result
}

const listing = await (await response(`${baseUrl}/paints/by-range`)).text()
const ranges = [...new Set([...listing.matchAll(/href="(\/paints\/[^"?#]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path !== '/paints/by-range' && path !== '/paints/by-colour'))]

const catalog = []
const rangeIndex = []
for (const path of ranges) {
  const page = await (await response(`${baseUrl}${path}`)).text()
  const id = /paintRangeId(?:&quot;|\"):(\d+)/.exec(page)?.[1]
  const title = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(page)?.[1]
  if (!id || !title) throw new Error(`No se ha podido identificar la gama ${path}`)
  const range = plainText(title)
  rangeIndex.push({ id: Number(id), path, name: range })
  const payload = await (await response(`${baseUrl}/api/paints?paint_range_id=${id}`)).json()
  for (const paint of payload.paints ?? []) {
    const paintHex = paint.swatchStyle?.color ?? paint.swatchStyle?.background
    if (!hex.test(paintHex ?? '')) continue
    const [brand = range] = String(paint.fullIdentifier ?? '').split('/')
    catalog.push({
      id: `${id}-${paint.id}`,
      brand,
      range,
      name: paint.name,
      code: paint.manufacturerCode ?? '',
      hex: paintHex.toUpperCase(),
      type: paint.type ?? '',
    })
  }
  process.stdout.write(`✓ ${range}: ${payload.paints?.length ?? 0} pinturas\n`)
}

catalog.sort((left, right) => left.brand.localeCompare(right.brand) || left.name.localeCompare(right.name))
const source = `// Generado por scripts/sync-paint-catalog.mjs.\n// No editar a mano: npm run sync:catalog\n\nexport type PaintCatalogEntry = {\n  id: string\n  brand: string\n  range: string\n  name: string\n  code: string\n  hex: string\n  type: string\n}\n\nexport type PaintRange = { id: number; path: string; name: string }\n\nexport const paintCatalog: PaintCatalogEntry[] = ${JSON.stringify(catalog)}\n\nexport const paintRanges: PaintRange[] = ${JSON.stringify(rangeIndex)}\n\nexport const paintCatalogUpdatedAt = ${JSON.stringify(new Date().toISOString())}\n`
await mkdir(dirname(output), { recursive: true })
await writeFile(output, source)
process.stdout.write(`\nCatálogo generado: ${catalog.length} pinturas con HEX en ${output}\n`)
