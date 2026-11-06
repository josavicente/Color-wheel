import type { PaintCatalogEntry } from './data/paint-catalog'

export function paintBrand(paint: PaintCatalogEntry) {
  if (paint.range.startsWith('AK Interactive')) return 'AK Interactive'
  if (paint.range.startsWith('The Army Painter')) return 'The Army Painter'
  if (paint.range.startsWith('Vallejo')) return 'Vallejo'
  if (paint.range.startsWith('Scale75')) return 'Scale75'
  if (paint.range.startsWith('Monument Hobbies')) return 'Monument Hobbies'
  return paint.range
}
