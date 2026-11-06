import { contrastText } from './color'
import { ingredientPercent, mixResult, type MixRecipe } from './mixing'
import { paintBrand } from './paint'

export async function exportRecipePng(recipe: MixRecipe) {
  const canvas = document.createElement('canvas')
  const width = 1200
  canvas.width = width * 2
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo crear la imagen.')
  const wrap = (text: string, maxWidth: number) => {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      if (line && context.measureText(`${line} ${word}`).width > maxWidth) { lines.push(line); line = word }
      else line = line ? `${line} ${word}` : word
    }
    if (line) lines.push(line)
    return lines
  }
  context.font = '600 26px Georgia, serif'
  const titles = wrap(recipe.title, width - 128)
  const rowHeights = recipe.ingredients.map((ingredient) => {
    context.font = '600 25px Georgia, serif'
    return Math.max(112, 68 + wrap(ingredient.name, 690).length * 30 + (ingredient.paint ? 28 : 0))
  })
  const titleHeight = titles.length * 34
  const height = 420 + titleHeight + rowHeights.reduce((sum, row) => sum + row, 0)
  canvas.height = height * 2
  context.scale(2, 2)
  context.fillStyle = '#F6F2E9'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#6D716A'
  context.font = '500 16px monospace'
  context.fillText('COLORWHEEL / RECETA DE MEZCLA', 64, 57)
  context.fillStyle = '#1E201D'
  context.font = '600 26px Georgia, serif'
  titles.forEach((line, index) => context.fillText(line, 64, 110 + index * 34, width - 128))
  const result = mixResult(recipe.ingredients)
  const swatchY = 135 + titleHeight
  context.fillStyle = result
  context.fillRect(64, swatchY, width - 128, 125)
  context.fillStyle = contrastText(result)
  context.font = '600 24px monospace'
  context.fillText(`Resultado aproximado · ${result}`, 88, swatchY + 78)
  let y = swatchY + 160
  recipe.ingredients.forEach((ingredient, index) => {
    context.fillStyle = '#D4CDC0'
    context.fillRect(64, y, width - 128, 1)
    context.fillStyle = ingredient.hex
    context.fillRect(64, y + 22, 56, 56)
    context.fillStyle = '#1E201D'
    context.font = '600 25px Georgia, serif'
    const lines = wrap(ingredient.name, 690)
    lines.forEach((line, lineIndex) => context.fillText(line, 140, y + 43 + lineIndex * 30, 690))
    context.font = '500 13px monospace'
    context.fillStyle = '#62695F'
    let detailY = y + 43 + lines.length * 30
    if (ingredient.paint) {
      const paint = ingredient.paint
      context.fillText(`${paintBrand(paint)} · ${paint.range} · ${paint.code || paint.type}`, 140, detailY, 700)
      detailY += 24
    }
    context.fillText(ingredient.hex, 140, detailY)
    context.fillStyle = '#1E473E'
    context.font = '600 21px monospace'
    context.textAlign = 'right'
    context.fillText(`${ingredient.parts} ${ingredient.parts === 1 ? 'parte' : 'partes'}`, width - 64, y + 44)
    context.font = '500 15px monospace'
    context.fillText(`${ingredientPercent(ingredient, recipe.ingredients).toFixed(1)} %`, width - 64, y + 72)
    context.textAlign = 'left'
    y += rowHeights[index]
  })
  context.fillStyle = '#6D716A'
  context.font = '500 14px monospace'
  context.fillText('Simulación visual RGB. Comprueba la mezcla con tus pinturas.', 64, height - 49)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('No se pudo exportar la receta.')
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${recipe.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'receta'}.png`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
