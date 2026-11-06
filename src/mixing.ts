import { mixManyHex } from './color'
import type { PaintCatalogEntry } from './data/paint-catalog'

export type MixIngredient = { id: string; hex: string; name: string; parts: number; paint?: PaintCatalogEntry }
export type MixRecipe = { id: string; title: string; ingredients: MixIngredient[] }
export type MixerState = { draft: MixRecipe; recipes: MixRecipe[] }
export const MIXER_STORAGE_KEY = 'colorwheel-mixer-v1'
export const MAX_INGREDIENTS = 6

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
export const isMixHex = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

function parseIngredient(value: unknown): MixIngredient | null {
  if (!isRecord(value) || !isText(value.id) || !isText(value.name) || !isMixHex(value.hex) || !Number.isInteger(value.parts) || Number(value.parts) < 1 || Number(value.parts) > 8) return null
  const ingredient: MixIngredient = { id: value.id, name: value.name, hex: value.hex.toUpperCase(), parts: Number(value.parts) }
  if (value.paint !== undefined) {
    const paint = value.paint
    if (!isRecord(paint) || !['id', 'brand', 'range', 'name', 'code', 'type'].every((key) => typeof paint[key] === 'string') || !isText(paint.id) || !isText(paint.name) || !isMixHex(paint.hex) || paint.hex.toUpperCase() !== ingredient.hex) return null
    ingredient.paint = { id: paint.id, brand: paint.brand as string, range: paint.range as string, name: paint.name, code: paint.code as string, type: paint.type as string, hex: paint.hex.toUpperCase() }
  }
  return ingredient
}

export function parseMixRecipe(value: unknown): MixRecipe | null {
  if (!isRecord(value) || !isText(value.id) || !isText(value.title) || !Array.isArray(value.ingredients) || value.ingredients.length < 1 || value.ingredients.length > MAX_INGREDIENTS) return null
  const ingredients = value.ingredients.map(parseIngredient)
  if (ingredients.some((ingredient) => !ingredient) || new Set(ingredients.map((ingredient) => ingredient?.id)).size !== ingredients.length) return null
  return { id: value.id, title: value.title, ingredients: ingredients as MixIngredient[] }
}

export function readMixerState(raw: string | null, fallbackHex = '#808080'): MixerState | null {
  try {
    const value: unknown = JSON.parse(raw || 'null')
    if (!isRecord(value) || !Array.isArray(value.recipes)) return null
    const draft = parseMixRecipe(value.draft) || newMixRecipe(fallbackHex)
    const recipes = value.recipes.map(parseMixRecipe).filter((recipe): recipe is MixRecipe => recipe !== null)
    return { draft, recipes: recipes.filter((recipe, index) => recipes.findIndex((other) => other.id === recipe.id) === index) }
  } catch { return null }
}

export function newMixRecipe(hex: string): MixRecipe {
  return { id: crypto.randomUUID(), title: 'Nueva mezcla', ingredients: [{ id: crypto.randomUUID(), hex: isMixHex(hex) ? hex.toUpperCase() : '#808080', name: 'Color del estudio', parts: 1 }] }
}

export function mixResult(ingredients: MixIngredient[]) {
  return mixManyHex(ingredients.map((ingredient) => ({ hex: ingredient.hex, weight: ingredient.parts })))
}

export function ingredientPercent(ingredient: MixIngredient, ingredients: MixIngredient[]) {
  const total = ingredients.reduce((sum, item) => sum + item.parts, 0)
  return total ? ingredient.parts / total * 100 : 0
}

export function recipeSnapshot(recipe: MixRecipe): MixRecipe {
  return { ...recipe, title: recipe.title.trim() || 'Mezcla sin título', ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient, name: ingredient.name.trim() || 'Color libre', ...(ingredient.paint ? { paint: { ...ingredient.paint } } : {}) })) }
}
