import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const baseUrl = 'https://paintpad.app'
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/paintpad-catalog.ts')
const apiDocsOutput = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/paintpad-api.md')
const hex = /^#[0-9a-f]{6}$/i
const rangeAliases = new Map([
  ['AKA', 'AK Interactive Acrylics'], ['AKI', 'AK Interactive'], ['AKR', 'AK Interactive Real Color'], ['AKT', 'AK Interactive 3rd Generation Acrylics'],
  ['APA', 'The Army Painter Warpaints Air'], ['APF', 'The Army Painter Warpaints Fanatic'], ['APS', 'The Army Painter Speedpaint 2.0'], ['APW', 'The Army Painter Warpaints'],
  ['CPS', 'Citadel Painting System'], ['FP3', 'Formula P3'], ['GSW', 'Green Stuff World'], ['KKO', 'Kimera Kolors'], ['MPA', 'Monument Hobbies Pro Acryl'],
  ['SCA', 'Scale75 Scalecolor Artist'], ['SCC', 'Scale75 Scalecolor'], ['SCF', 'Scale75 Scalecolor Floww'], ['SIN', 'Scale75 Instant Colors'], ['SMC', 'Scale75 Mystic Colors'], ['SPE', 'Scale75 Prism Effect'], ['SQC', 'Vallejo Squidmar Color'],
  ['TAM', 'Tamiya'], ['VGA', 'Vallejo Game Air'], ['VHS', 'Vallejo Hobby Spray Paint'], ['VMA', 'Vallejo Model Air'], ['VMC', 'Vallejo Model Color'], ['VME', 'Vallejo Metal Color'], ['VMH', 'Vallejo Mecha Color'], ['VMW', 'Vallejo Model Wash'], ['VSP', 'Vallejo Surface Primer'], ['VXP', 'Vallejo Xpress'],
])

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
const source = `// Generado por scripts/sync-paintpad-catalog.mjs desde la API pública de PaintPad.\n// No editar a mano: npm run sync:paintpad\n\nexport type PaintCatalogEntry = {\n  id: string\n  brand: string\n  range: string\n  name: string\n  code: string\n  hex: string\n  type: string\n}\n\nexport type PaintpadRange = { id: number; path: string; name: string }\n\nexport const paintpadCatalog: PaintCatalogEntry[] = ${JSON.stringify(catalog)}\n\nexport const paintpadRanges: PaintpadRange[] = ${JSON.stringify(rangeIndex)}\n\nexport const paintpadCatalogUpdatedAt = ${JSON.stringify(new Date().toISOString())}\n`
await mkdir(dirname(output), { recursive: true })
await writeFile(output, source)
const aliases = [...rangeAliases].map(([code, range]) => `| \`${code}\` | ${range} | \`GET /api/paints?paint_range_id=${code}\` |`).join('\n')
const calls = rangeIndex.map((range) => `- [${range.name}](${baseUrl}${range.path}) — \`GET ${baseUrl}/api/paints?paint_range_id=${range.id}\``).join('\n')
const apiDocs = `# API pública de PaintPad\n\nActualizado con \`npm run sync:paintpad\`. La sincronización primero lee la página pública de gamas y después consulta la API de pinturas para cada gama.\n\n## Contrato\n\n- \`GET ${baseUrl}/paints/by-range\`: descubre las rutas públicas de las gamas.\n- \`GET ${baseUrl}/paints/:slug\`: permite resolver el \`paintRangeId\` numérico presente en la página.\n- \`GET ${baseUrl}/api/paints?paint_range_id=<id>\`: devuelve \`{ paints: [...] }\`, con \`name\`, \`fullIdentifier\`, \`manufacturerCode\`, \`type\` y \`swatchStyle.color\` (HEX cuando existe).\n\nLa aplicación usa los IDs numéricos porque están publicados en cada página de gama y cubren las 62 gamas.\n\n## Alias de tres caracteres verificados\n\nLos alias siguientes son los códigos de tres caracteres conocidos; no se infieren alias para gamas que la API no documenta con uno.\n\n| Código | Gama | Llamada equivalente |\n| --- | --- | --- |\n${aliases}\n\n## Llamadas de sincronización actuales\n\n${calls}\n`
await writeFile(apiDocsOutput, apiDocs)
process.stdout.write(`\nCatálogo generado: ${catalog.length} pinturas con HEX en ${output}\n`)
