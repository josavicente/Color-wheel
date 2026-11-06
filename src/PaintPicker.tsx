import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { PaintCatalogEntry, PaintRange } from './data/paint-catalog'
import { paintBrand } from './paint'
import './paint-picker.css'

type PaintPickerProps = {
  paints: PaintCatalogEntry[]
  ranges: PaintRange[]
  favorites: string[]
  recentIds: string[]
  onPick: (paint: PaintCatalogEntry) => void
  onClose: () => void
}

type Filters = { search: string; brand: string; range: string }
const FILTER_KEY = 'colorwheel-paint-picker-v1'
const emptyFilters: Filters = { search: '', brand: '', range: '' }
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()

function readFilters(): Filters {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(FILTER_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return emptyFilters
    const fields = saved as Record<string, unknown>
    return {
      search: typeof fields.search === 'string' ? fields.search : '',
      brand: typeof fields.brand === 'string' ? fields.brand : '',
      range: typeof fields.range === 'string' ? fields.range : '',
    }
  } catch { return emptyFilters }
}

// Selecting a paint calls onPick and then onClose; callers only apply the selection.
export default function PaintPicker({ paints, ranges, favorites, recentIds, onPick, onClose }: PaintPickerProps) {
  const [filters, setFilters] = useState(readFilters)
  const [limit, setLimit] = useState(30)
  const dialog = useRef<HTMLDialogElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const helpId = useId()

  const indexed = useMemo(() => paints.map((paint) => ({
    paint,
    brand: paintBrand(paint),
    search: normalize([paint.name, paintBrand(paint), paint.brand, paint.range, paint.code, paint.type, paint.hex].join(' ')),
  })), [paints])
  const brands = useMemo(() => [...new Set(indexed.map((entry) => entry.brand))].sort((left, right) => left.localeCompare(right, 'es')), [indexed])
  const brand = brands.includes(filters.brand) ? filters.brand : ''
  const availableRanges = useMemo(() => {
    const names = new Set(indexed.filter((entry) => !brand || entry.brand === brand).map((entry) => entry.paint.range))
    return ranges.filter((range) => names.has(range.name))
  }, [indexed, ranges, brand])
  const range = availableRanges.some((entry) => entry.name === filters.range) ? filters.range : ''
  const matches = useMemo(() => {
    const tokens = normalize(filters.search).split(/\s+/).filter(Boolean)
    return indexed.filter((entry) => (!brand || entry.brand === brand) && (!range || entry.paint.range === range) && tokens.every((token) => entry.search.includes(token))).map((entry) => entry.paint)
  }, [indexed, filters.search, brand, range])
  const recentPaints = useMemo(() => {
    const byId = new Map(matches.map((paint) => [paint.id, paint]))
    return [...new Set(recentIds)].flatMap((id) => {
      const paint = byId.get(id)
      return paint ? [paint] : []
    }).slice(0, 6)
  }, [matches, recentIds])
  const recentSet = new Set(recentPaints.map((paint) => paint.id))
  const results = matches.filter((paint) => !recentSet.has(paint.id))

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    searchInput.current?.focus()
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
      if (opener?.isConnected) opener.focus()
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(FILTER_KEY, JSON.stringify(filters)) } catch { /* Selection still works without local storage. */ }
  }, [filters])

  const changeFilters = (patch: Partial<Filters>) => {
    setFilters((previous) => ({ ...previous, ...patch }))
    setLimit(30)
  }
  const clearFilters = () => { setFilters(emptyFilters); setLimit(30); searchInput.current?.focus() }
  const selectPaint = (paint: PaintCatalogEntry) => { onPick(paint); onClose() }
  const renderPaint = (paint: PaintCatalogEntry) => <button type="button" className="picker-paint" key={paint.id} onClick={() => selectPaint(paint)}>
    <i className="picker-swatch" style={{ background: paint.hex }} aria-hidden="true" />
    <span className="picker-paint-info"><b>{paint.name}</b><small>{paintBrand(paint)} · {paint.range}</small><small>{paint.code ? `Ref. ${paint.code}` : 'Sin referencia'} · {paint.type || 'Sin clasificar'}</small></span>
    <span className="picker-paint-hex">{paint.hex}<span aria-hidden="true">Elegir ↗</span></span>
  </button>

  return <dialog ref={dialog} className="paint-picker" aria-labelledby={titleId} aria-describedby={helpId} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() } }} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="paint-picker-content">
      <header className="picker-heading"><div><p className="eyebrow">Catálogo de pinturas</p><h2 id={titleId}>Elige tu <em>pintura.</em></h2><p id={helpId}>Busca por marca, gama, nombre o referencia y toca una muestra para seleccionarla.</p></div><button type="button" className="picker-close" aria-label="Cerrar selector de pinturas" onClick={onClose}>×</button></header>
      <div className="picker-filters">
        <label className="picker-search">Buscar pintura<input ref={searchInput} type="search" value={filters.search} placeholder="Nombre, referencia, tipo o HEX" onChange={(event) => changeFilters({ search: event.target.value })} /></label>
        <label>Marca<select value={brand} disabled={!paints.length} onChange={(event) => changeFilters({ brand: event.target.value, range: '' })}><option value="">Todas las marcas</option>{brands.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
        <label>Gama<select value={range} disabled={!paints.length} onChange={(event) => changeFilters({ range: event.target.value })}><option value="">Todas las gamas</option>{availableRanges.map((entry) => <option key={entry.id} value={entry.name}>{entry.name}</option>)}</select></label>
      </div>
      {favorites.some((name) => brands.includes(name)) && <div className="picker-favorites" aria-label="Acceso rápido a marcas favoritas"><span>Favoritas</span>{favorites.filter((name) => brands.includes(name)).map((name) => <button type="button" key={name} aria-pressed={brand === name} onClick={() => changeFilters({ brand: brand === name ? '' : name, range: '' })}>★ {name}</button>)}</div>}
      <div className="picker-status"><p role="status" aria-live="polite">{paints.length ? `${matches.length.toLocaleString('es-ES')} ${matches.length === 1 ? 'pintura encontrada' : 'pinturas encontradas'}` : 'Cargando catálogo de pinturas…'}</p><button type="button" onClick={clearFilters} disabled={!filters.search && !filters.brand && !filters.range}>Limpiar filtros</button></div>
      {recentPaints.length > 0 && <section className="picker-section" aria-label="Pinturas recientes"><h3>Recientes</h3><div className="picker-grid">{recentPaints.map(renderPaint)}</div></section>}
      {results.length > 0 && <section className="picker-section" aria-label="Resultados del catálogo"><h3>Catálogo</h3><div className="picker-grid">{results.slice(0, limit).map(renderPaint)}</div>{results.length > limit && <button type="button" className="picker-more" onClick={() => setLimit((previous) => previous + 30)}>Mostrar {Math.min(30, results.length - limit)} pinturas más</button>}</section>}
      {paints.length > 0 && matches.length === 0 && <div className="picker-empty"><h3>No encontramos esa pintura.</h3><p>Prueba otra referencia o amplía la marca y la gama.</p><button type="button" className="primary-action" onClick={clearFilters}>Ver todo el catálogo</button></div>}
    </div>
  </dialog>
}
