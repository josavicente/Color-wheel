import { useEffect, useMemo, useState } from 'react'
import { colorDistance, contrastText, type PaletteColor } from './color'
import type { PaintCatalogEntry, PaintRange } from './data/paint-catalog'
import PaintPicker from './PaintPicker'
import { ingredientPercent, isMixHex, MAX_INGREDIENTS, MIXER_STORAGE_KEY, mixResult, newMixRecipe, readMixerState, recipeSnapshot, type MixIngredient, type MixRecipe } from './mixing'
import { paintBrand } from './paint'
import { exportRecipePng } from './recipe-export'
import './mixer.css'

type Props = {
  active: string
  palette: PaletteColor[]
  paints: PaintCatalogEntry[]
  ranges: PaintRange[]
  favorites: string[]
  recentIds: string[]
  onRemember: (paint: PaintCatalogEntry) => void
  onAdd: (hex: string, name: string, recipe?: MixRecipe) => void
  onReplace: (hex: string, recipe?: MixRecipe) => void
  canReplace: boolean
}

function initialState(active: string) {
  try { return readMixerState(localStorage.getItem(MIXER_STORAGE_KEY), active) || { draft: newMixRecipe(active), recipes: [] } }
  catch { return { draft: newMixRecipe(active), recipes: [] } }
}

function IngredientHex({ hex, index, onChange }: { hex: string; index: number; onChange: (hex: string) => void }) {
  const [text, setText] = useState(hex)
  useEffect(() => setText(hex), [hex])
  return <label className="mixer-hex">HEX<input aria-label={`HEX del ingrediente ${index + 1}`} value={text} maxLength={7} spellCheck={false} onChange={(event) => {
    const value = event.target.value.toUpperCase()
    setText(value)
    const normalized = value.startsWith('#') ? value : `#${value}`
    if (isMixHex(normalized) && normalized !== hex) onChange(normalized)
  }} onBlur={() => setText(hex)} /></label>
}

export default function MixerWorkspace({ active, palette, paints, ranges, favorites, recentIds, onRemember, onAdd, onReplace, canReplace }: Props) {
  const [initial] = useState(() => initialState(active))
  const [draft, setDraft] = useState(initial.draft)
  const [recipes, setRecipes] = useState(initial.recipes)
  const [pickerTarget, setPickerTarget] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [storageError, setStorageError] = useState(false)
  const [exporting, setExporting] = useState(false)
  const ingredients = draft.ingredients
  const result = useMemo(() => mixResult(ingredients), [ingredients])
  const totalParts = ingredients.reduce((total, ingredient) => total + ingredient.parts, 0)
  const canAdd = ingredients.length < MAX_INGREDIENTS
  const equivalents = useMemo(() => paints.filter((paint) => !favorites.length || favorites.includes(paintBrand(paint)))
    .sort((left, right) => colorDistance(result, left.hex) - colorDistance(result, right.hex)).slice(0, 4), [paints, favorites, result])

  useEffect(() => {
    try { localStorage.setItem(MIXER_STORAGE_KEY, JSON.stringify({ draft: recipeSnapshot(draft), recipes })); setStorageError(false) }
    catch { setStorageError(true) }
  }, [draft, recipes])

  const updateIngredient = (id: string, patch: Partial<MixIngredient>) => setDraft((recipe) => ({ ...recipe, ingredients: recipe.ingredients.map((ingredient) => ingredient.id === id ? { ...ingredient, ...patch } : ingredient) }))
  const addIngredient = (hex: string, name: string, paint?: PaintCatalogEntry) => {
    if (!canAdd) return
    setDraft((recipe) => recipe.ingredients.length >= MAX_INGREDIENTS ? recipe : { ...recipe, ingredients: [...recipe.ingredients, { id: crypto.randomUUID(), hex, name, parts: 1, ...(paint ? { paint } : {}) }] })
    setNotice(`${name} añadido a la mezcla`)
  }
  const selectPaint = (paint: PaintCatalogEntry) => {
    if (pickerTarget === 'add') addIngredient(paint.hex, paint.name, paint)
    else if (pickerTarget) updateIngredient(pickerTarget, { hex: paint.hex, name: paint.name, paint })
    onRemember(paint)
    setPickerTarget(null)
  }
  const saveRecipe = () => {
    const snapshot = recipeSnapshot(draft)
    setDraft(snapshot)
    setRecipes((items) => [snapshot, ...items.filter((item) => item.id !== snapshot.id)])
    setNotice('Receta guardada en este navegador')
  }
  const addResult = () => { if (palette.length >= 12) return; const snapshot = recipeSnapshot(draft); onAdd(result, snapshot.title, snapshot); setNotice('Mezcla y receta añadidas al Estudio') }
  const download = async () => {
    setExporting(true)
    try { await exportRecipePng(recipeSnapshot(draft)); setNotice('Receta exportada como PNG') }
    catch { setNotice('No se pudo exportar la receta. Vuelve a intentarlo.') }
    finally { setExporting(false) }
  }

  return <section className="mixer-workspace" aria-labelledby="mixer-heading">
    <div className="mixer-heading"><div><p className="panel-kicker">Tu mesa de mezclas</p><h2 id="mixer-heading">Elige pinturas.<br /><em>Encuentra tu mezcla.</em></h2><p>Combina pinturas del catálogo, muestras de tu paleta o colores libres.</p></div><button className="ghost-action" onClick={() => { setDraft(newMixRecipe(active)); setNotice('Nueva mezcla creada con una copia del color del estudio') }}>Nueva mezcla</button></div>
    <div className="mixer-columns">
      <div className="mixer-ingredients">
        <div className="mixer-section-label"><h3>Ingredientes</h3><span>{ingredients.length} / {MAX_INGREDIENTS} colores</span></div>
        <div className="mixer-ingredient-list">{ingredients.map((ingredient, index) => <article className="mixer-ingredient" key={ingredient.id}>
          <div className="mixer-ingredient-head"><span className="mixer-ingredient-number">{String(index + 1).padStart(2, '0')}</span><span className="mixer-ingredient-swatch" style={{ background: ingredient.hex }} /><div className="mixer-ingredient-name"><b>{ingredient.name}</b>{ingredient.paint ? <small>{paintBrand(ingredient.paint)} · {ingredient.paint.range}<br />{ingredient.paint.code || ingredient.paint.type} · {ingredient.hex}</small> : <small>Color libre · {ingredient.hex}</small>}</div><button className="mixer-remove" disabled={ingredients.length === 1} onClick={() => setDraft((recipe) => ({ ...recipe, ingredients: recipe.ingredients.filter((item) => item.id !== ingredient.id) }))} aria-label={`Quitar ${ingredient.name}`}>×</button></div>
          <div className="mixer-ingredient-controls"><button className="ghost-action" onClick={() => setPickerTarget(ingredient.id)}>Cambiar pintura</button><label className="mixer-free-color">Color libre<input type="color" value={ingredient.hex} onChange={(event) => updateIngredient(ingredient.id, { hex: event.target.value.toUpperCase(), name: 'Color libre', paint: undefined })} aria-label={`Elegir color libre para ingrediente ${index + 1}`} /></label><IngredientHex hex={ingredient.hex} index={index} onChange={(hex) => updateIngredient(ingredient.id, { hex, name: 'Color libre', paint: undefined })} /><label className="mixer-parts" htmlFor={`parts-${ingredient.id}`}><span>Partes <output>{ingredient.parts} · {ingredientPercent(ingredient, ingredients).toFixed(1)} %</output></span><input id={`parts-${ingredient.id}`} type="range" min="1" max="8" value={ingredient.parts} onChange={(event) => updateIngredient(ingredient.id, { parts: Number(event.target.value) })} /></label></div>
        </article>)}</div>
        <div className="mixer-add-actions"><button className="primary-action" disabled={!canAdd} onClick={() => setPickerTarget('add')}>+ Añadir pintura</button><button className="ghost-action" disabled={!canAdd} onClick={() => addIngredient(active, 'Color del estudio')}>+ Color del estudio</button><button className="ghost-action" disabled={!canAdd} onClick={() => addIngredient('#FFFFFF', 'Color libre')}>+ Color libre</button></div>
        <p className="mixer-help">Cada ingrediente es independiente de la rueda. Ajusta todos entre 1 y 8 partes.</p>
        {palette.length > 0 && <details className="mixer-palette"><summary>Añadir desde tu paleta · {palette.length}</summary><div className="mixer-palette-colors">{palette.map((color) => <button key={color.id} disabled={!canAdd} onClick={() => addIngredient(color.hex, color.name, color.paint?.hex.toUpperCase() === color.hex.toUpperCase() ? color.paint : undefined)}><i style={{ background: color.hex }} /><span>{color.name}<small>{color.paint ? `${paintBrand(color.paint)} · ${color.paint.code || color.paint.range}` : color.hex}</small></span><span aria-hidden="true">+</span></button>)}</div></details>}
      </div>
      <aside className="mixer-result-pane" aria-label="Resultado y receta">
        <div className="mixer-section-label"><h3>Resultado aproximado</h3><span>{totalParts} {totalParts === 1 ? 'parte' : 'partes'}</span></div>
        <div className="mixer-result-swatch" style={{ background: result, color: contrastText(result) }}><span>Tu mezcla</span><strong>{result}</strong></div>
        <div className="mixer-proportion-bar" aria-hidden="true">{ingredients.map((ingredient) => <span key={ingredient.id} style={{ background: ingredient.hex, flex: ingredient.parts }} />)}</div>
        <p className="mixer-help">Simulación visual RGB. El resultado real depende de los pigmentos, la opacidad y el acabado; compruébalo con tus pinturas.</p>
        {ingredients.length === 2 && <div className="mixer-variants"><h3>Compara proporciones</h3><div>{[[1, 1], [2, 1], [1, 2]].map(([first, second]) => {
          const variant = ingredients.map((ingredient, index) => ({ ...ingredient, parts: index === 0 ? first : second }))
          const hex = mixResult(variant)
          return <button key={`${first}:${second}`} aria-label={`Aplicar proporción ${first} a ${second}`} aria-pressed={ingredients[0].parts === first && ingredients[1].parts === second} onClick={() => setDraft((recipe) => ({ ...recipe, ingredients: recipe.ingredients.map((ingredient, index) => ({ ...ingredient, parts: index === 0 ? first : second })) }))}><i style={{ background: hex }} /><b>{first}:{second}</b><small>{hex}</small></button>
        })}</div><p className="mixer-help">En el orden de los ingredientes. Toca una variante para aplicarla.</p></div>}
        <div className="mixer-recipe"><label htmlFor="mix-recipe-title">Nombre de la receta<input id="mix-recipe-title" value={draft.title} maxLength={120} onChange={(event) => setDraft((recipe) => ({ ...recipe, title: event.target.value }))} /></label><div className="mixer-recipe-summary">{ingredients.map((ingredient) => <div key={ingredient.id}><span>{ingredient.name}</span><b>{ingredient.parts} {ingredient.parts === 1 ? 'parte' : 'partes'}</b></div>)}</div><div className="mixer-recipe-actions"><button className="primary-action" onClick={saveRecipe}>Guardar receta</button><button className="ghost-action" disabled={exporting} onClick={() => void download()}>{exporting ? 'Exportando…' : 'Exportar receta PNG ↗'}</button></div><div className="mixer-recipe-actions"><button className="ghost-action" disabled={palette.length >= 12} onClick={addResult}>+ Añadir mezcla al Estudio</button><button className="ghost-action" disabled={!canReplace} onClick={() => { onReplace(result, recipeSnapshot(draft)); setNotice('Muestra del Estudio sustituida por la mezcla y su receta') }}>Sustituir muestra</button></div>{palette.length >= 12 && <p className="mixer-help">Tu paleta tiene 12 muestras. Elimina una o selecciona una muestra desbloqueada para sustituirla.</p>}</div>
        <details className="mixer-equivalents"><summary>Pinturas próximas al resultado</summary><p className="mixer-help">{favorites.length ? 'Solo tus marcas favoritas. ' : ''}Consultar estas pinturas conserva tu mezcla.</p>{!paints.length ? <p className="mixer-help">Cargando catálogo…</p> : equivalents.map((paint) => <div className="mixer-equivalent" key={paint.id}><i style={{ background: paint.hex }} /><span><b>{paint.name}</b><small>{paint.range} · {paint.code || paint.type}</small></span><button className="ghost-action" disabled={!canAdd} onClick={() => { addIngredient(paint.hex, paint.name, paint); onRemember(paint) }} aria-label={`Añadir ${paint.name} como ingrediente`}>+ Añadir</button></div>)}</details>
      </aside>
    </div>
    <section className="mixer-saved" aria-labelledby="saved-recipes-heading"><div className="mixer-section-label"><h3 id="saved-recipes-heading">Tus recetas guardadas</h3><span>{recipes.length} · en este navegador</span></div>{recipes.length ? <div className="mixer-saved-list">{recipes.map((recipe) => <article key={recipe.id}><i style={{ background: mixResult(recipe.ingredients) }} /><div><b>{recipe.title}</b><small>{recipe.ingredients.length} ingredientes · {recipe.ingredients.map((ingredient) => ingredient.parts).join(':')}</small></div><button className="ghost-action" onClick={() => { setDraft(recipeSnapshot(recipe)); setNotice(`Receta «${recipe.title}» cargada`) }}>Cargar</button><button className="mixer-remove" onClick={() => { setRecipes((items) => items.filter((item) => item.id !== recipe.id)); setNotice('Receta eliminada de la biblioteca') }} aria-label={`Eliminar receta ${recipe.title}`}>×</button></article>)}</div> : <p className="mixer-help">Guarda una receta para recuperar las pinturas y sus proporciones.</p>}</section>
    <p className="mixer-status" role="status">{storageError ? 'No se puede guardar en este navegador. Exporta tu receta PNG para conservarla.' : notice}</p>
    {pickerTarget && <PaintPicker paints={paints} ranges={ranges} favorites={favorites} recentIds={recentIds} onPick={selectPaint} onClose={() => setPickerTarget(null)} />}
  </section>
}
