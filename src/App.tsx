import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { colorDistance, contrastText, hexToHsl, mixHex, mixManyHex, newColor, normalizeHue, PaletteColor, wheelColor } from './color'
import type { PaintCatalogEntry, PaintRange } from './data/paint-catalog'
import { extractImagePalette } from './image-palette'

type Tool = 'explore' | 'harmony' | 'mix' | 'image'
type WheelMode = 'ryb' | 'rgb'
type Page = 'studio' | 'brands'
type SavedPalette = { id: string; title: string; palette: PaletteColor[] }
type MixColor = { id: string; hex: string; parts: number }

const STORAGE_KEY = 'colorwheel-workspace-v1'
const seed = [
  newColor('#2E6495', 'Azul editorial'),
  newColor('#E8B74A', 'Ámbar suave'),
  newColor('#CF5C42', 'Terracota'),
  newColor('#E8DED0', 'Marfil'),
]
const wheelBands = [
  { id: 'deep', lightness: 28, label: 'Profundo' },
  { id: 'base', lightness: 50, label: 'Medio' },
  { id: 'light', lightness: 76, label: 'Claro' },
]
const PALETTE_MATCH_LIMIT = 8

function paintBrand(paint: PaintCatalogEntry) {
  if (paint.range.startsWith('AK Interactive')) return 'AK Interactive'
  if (paint.range.startsWith('The Army Painter')) return 'The Army Painter'
  if (paint.range.startsWith('Vallejo')) return 'Vallejo'
  if (paint.range.startsWith('Scale75')) return 'Scale75'
  if (paint.range.startsWith('Monument Hobbies')) return 'Monument Hobbies'
  return paint.range
}

function brandMonogram(brand: string) {
  return brand.split(/\s+/).filter((word) => !['de', 'the', 'and'].includes(word.toLocaleLowerCase())).map((word) => word[0]).join('').slice(0, 3).toUpperCase()
}

function brandTone(brand: string) {
  return `hsl(${[...brand].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 360} 37% 28%)`
}

function exportPng(palette: PaletteColor[], matches: PaintCatalogEntry[][], title: string, dark: boolean, showHex: boolean) {
  const width = 1600
  const scale = 2
  const margin = 72
  const gap = 28
  const columns = palette.length === 1 ? 1 : 2
  const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns
  const rowHeights = Array.from({ length: Math.ceil(palette.length / columns) }, (_, row) => Math.max(...palette.slice(row * columns, row * columns + columns).map((_, column) => 170 + (matches[row * columns + column]?.length || 0) * 56)))
  const height = 220 + rowHeights.reduce((total, rowHeight) => total + rowHeight, 0) + gap * Math.max(0, rowHeights.length - 1) + margin
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext('2d')!
  context.scale(scale, scale)
  const paper = dark ? '#191A17' : '#F8F4EA'
  const ink = dark ? '#F8F4EA' : '#1A1A15'
  context.fillStyle = paper
  context.fillRect(0, 0, width, height)
  context.fillStyle = ink
  context.font = '700 64px Georgia, serif'
  context.fillText(title || 'Paleta sin título', 72, 100)
  context.font = '500 22px monospace'
  context.fillStyle = dark ? '#B7B3AA' : '#716F67'
  context.fillText(`${palette.length} colores · equivalencias de pintura · ColorWheel`, 74, 142)
  let y = 186
  palette.forEach((color, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    if (column === 0 && index > 0) y += rowHeights[row - 1] + gap
    const x = margin + column * (cardWidth + gap)
    context.fillStyle = color.hex
    context.fillRect(x, y, cardWidth, 82)
    if (showHex) {
      context.fillStyle = contrastText(color.hex)
      context.font = '700 19px monospace'
      context.fillText(color.hex, x + 18, y + 53)
    }
    context.fillStyle = ink
    context.font = '600 25px Georgia, serif'
    context.fillText(color.name || `Color ${index + 1}`, x, y + 118)
    context.fillStyle = dark ? '#B7B3AA' : '#716F67'
    context.font = '600 13px monospace'
    context.fillText('PINTURAS CORRESPONDIENTES', x, y + 148)
    matches[index]?.forEach((paint, paintIndex) => {
      const paintY = y + 168 + paintIndex * 56
      context.fillStyle = paint.hex
      context.fillRect(x, paintY, 26, 26)
      context.fillStyle = ink
      context.font = '600 16px Georgia, serif'
      context.fillText(paint.name, x + 38, paintY + 13)
      context.fillStyle = dark ? '#B7B3AA' : '#716F67'
      context.font = '500 10px monospace'
      context.fillText(`Marca · ${paintBrand(paint)}`, x + 38, paintY + 29)
      context.font = '500 9px monospace'
      context.fillText(`Gama · ${paint.range} · ${paint.code || paint.type} · ${paint.hex}`, x + 38, paintY + 43)
    })
  })
  canvas.toBlob((blob) => {
    if (!blob) return
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(blob)
    anchor.download = `${(title || 'paleta').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }, 'image/png')
}

function App() {
  const saved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
  }, [])
  const [palette, setPalette] = useState<PaletteColor[]>(saved.palette || seed)
  const [title, setTitle] = useState(saved.title || 'Estudio de color')
  const [library, setLibrary] = useState<SavedPalette[]>(saved.library || [])
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>(Array.isArray(saved.favoriteBrands) ? saved.favoriteBrands : [])
  const [page, setPage] = useState<Page>(() => window.location.hash === '#marcas' ? 'brands' : 'studio')
  const [tool, setTool] = useState<Tool>('explore')
  const [mode, setMode] = useState<WheelMode>('ryb')
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(72)
  const [lightness, setLightness] = useState(48)
  const [selected, setSelected] = useState<number | null>(null)
  const [history, setHistory] = useState<PaletteColor[][]>([])
  const [future, setFuture] = useState<PaletteColor[][]>([])
  const [notice, setNotice] = useState('')
  const [exportOpen, setExportOpen] = useState(false)
  const [exportDark, setExportDark] = useState(false)
  const [showHex, setShowHex] = useState(true)
  const [wheelExpanded, setWheelExpanded] = useState(false)
  const [mixColors, setMixColors] = useState<MixColor[]>([{ id: crypto.randomUUID(), hex: '#F6B328', parts: 1 }])
  const [paintSearch, setPaintSearch] = useState('')
  const [paintRange, setPaintRange] = useState('Todas las gamas')
  const [paintLimit, setPaintLimit] = useState(30)
  const [paintCatalog, setPaintCatalog] = useState<PaintCatalogEntry[]>([])
  const [paintCatalogUpdatedAt, setPaintCatalogUpdatedAt] = useState('')
  const [paintRangeIndex, setPaintRangeIndex] = useState<PaintRange[]>([])
  const [exactHex, setExactHex] = useState<string | null>(null)
  const [harmony, setHarmony] = useState<'Complementaria' | 'Tríada' | 'Análoga'>('Complementaria')
  const wheel = useRef<HTMLDivElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const imageData = useRef<ImageData | null>(null)
  const imagePreviewUrl = useRef<string | null>(null)
  const imageLoad = useRef(0)
  const [imagePreview, setImagePreview] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageColors, setImageColors] = useState<string[]>([])
  const [imageColorCount, setImageColorCount] = useState(6)
  const [imageStatus, setImageStatus] = useState('Elige una foto para empezar.')
  const active = useMemo(() => exactHex ?? wheelColor(hue, mode, saturation, lightness), [exactHex, hue, mode, saturation, lightness])
  const mix = useMemo(() => mixManyHex([{ hex: active, weight: 1 }, ...mixColors.map((color) => ({ hex: color.hex, weight: color.parts }))]), [active, mixColors])
  const harmonyColors = useMemo(() => {
    const offsets = harmony === 'Complementaria' ? [0, 180] : harmony === 'Tríada' ? [0, 120, 240] : [-28, 0, 28]
    return offsets.map((offset) => wheelColor(hue + offset, mode, saturation, lightness))
  }, [harmony, hue, mode, saturation, lightness])
  const paintRanges = useMemo(() => paintRangeIndex.map((range) => range.name), [paintRangeIndex])
  const paintBrands = useMemo(() => [...new Set(paintCatalog.map(paintBrand))].sort((left, right) => left.localeCompare(right, 'es')), [paintCatalog])
  const suggestedPaintCatalog = useMemo(() => favoriteBrands.length
    ? paintCatalog.filter((paint) => favoriteBrands.includes(paintBrand(paint)))
    : paintCatalog, [favoriteBrands, paintCatalog])
  const closePaints = useMemo(() => [...suggestedPaintCatalog]
    .sort((left, right) => colorDistance(active, left.hex) - colorDistance(active, right.hex))
    .slice(0, 5), [active, suggestedPaintCatalog])
  const closeMixPaints = useMemo(() => [...suggestedPaintCatalog]
    .sort((left, right) => colorDistance(mix, left.hex) - colorDistance(mix, right.hex))
    .slice(0, 5), [mix, suggestedPaintCatalog])
  const palettePaintMatches = useMemo(() => palette.map((color) => [...suggestedPaintCatalog]
    .sort((left, right) => colorDistance(color.hex, left.hex) - colorDistance(color.hex, right.hex))
    .slice(0, PALETTE_MATCH_LIMIT)), [palette, suggestedPaintCatalog])
  const filteredPaints = useMemo(() => {
    const query = paintSearch.trim().toLocaleLowerCase()
    return paintCatalog.filter((paint) => {
      const rangeMatch = paintRange === 'Todas las gamas' || paint.range === paintRange
      const searchMatch = !query || [paint.name, paint.brand, paint.range, paint.code, paint.hex, paint.type].some((value) => value.toLocaleLowerCase().includes(query))
      return rangeMatch && searchMatch
    })
  }, [paintCatalog, paintRange, paintSearch])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ palette, title, library, favoriteBrands })) }, [favoriteBrands, palette, title, library])
  useEffect(() => {
    const syncPage = () => setPage(window.location.hash === '#marcas' ? 'brands' : 'studio')
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])
  useEffect(() => {
    void import('./data/paint-catalog').then((catalog) => {
      setPaintCatalog(catalog.paintCatalog)
      setPaintCatalogUpdatedAt(catalog.paintCatalogUpdatedAt)
      setPaintRangeIndex(catalog.paintRanges)
    })
  }, [])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])
  useEffect(() => {
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL
    const href = configuredSiteUrl ? new URL(window.location.pathname, configuredSiteUrl).href : new URL(window.location.pathname, window.location.origin).href
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = href
    let ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.append(ogUrl) }
    ogUrl.content = href
  }, [])
  useEffect(() => () => { if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current) }, [])
  useEffect(() => {
    if (!imageData.current) return
    const colors = extractImagePalette(imageData.current, imageColorCount)
    setImageColors(colors)
    setImageStatus(`${colors.length} ${colors.length === 1 ? 'color detectado' : 'colores detectados'} en local.`)
  }, [imageColorCount])

  const commit = (next: PaletteColor[]) => {
    setHistory((previous) => [...previous.slice(-99), palette])
    setFuture([])
    setPalette(next)
  }
  const add = (hex = active, name = 'Nuevo color') => {
    if (palette.length === 12) { setNotice('Llegaste a 12 colores. Edita o elimina una muestra para continuar.'); return }
    commit([...palette, newColor(hex, name)])
    setSelected(palette.length)
    setNotice('Color añadido a la paleta')
  }
  const replace = (hex: string) => {
    if (selected === null || palette[selected].locked) { add(hex); return }
    commit(palette.map((color, index) => index === selected ? { ...color, hex } : color))
    setNotice('Muestra actualizada')
  }
  const update = (index: number, patch: Partial<PaletteColor>) => commit(palette.map((color, position) => position === index ? { ...color, ...patch } : color))
  const move = (index: number, direction: number) => {
    const target = index + direction
    if (target < 0 || target >= palette.length) return
    const next = [...palette]
    ;[next[index], next[target]] = [next[target], next[index]]
    commit(next)
    setSelected(target)
  }
  const pick = (clientX: number, clientY: number, nextLightness?: number) => {
    const box = wheel.current?.getBoundingClientRect()
    if (!box) return
    setExactHex(null)
    setHue(normalizeHue(Math.atan2(clientY - box.top - box.height / 2, clientX - box.left - box.width / 2) * 180 / Math.PI + 90))
    if (nextLightness !== undefined) setLightness(nextLightness)
  }
  const copy = (value: string, message: string) => navigator.clipboard?.writeText(value).then(() => setNotice(message)).catch(() => setNotice('Selecciona el código para copiarlo.'))
  const pickHex = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return
    const hsl = hexToHsl(hex)
    setExactHex(hex.toUpperCase())
    setHue(hsl.h); setSaturation(hsl.s); setLightness(hsl.l)
  }
  const adjustHue = (value: number) => { setExactHex(null); setHue(value) }
  const adjustSaturation = (value: number) => { setExactHex(null); setSaturation(value) }
  const adjustLightness = (value: number) => { setExactHex(null); setLightness(value) }
  const downloadData = (contents: string, filename: string, type: string) => {
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(new Blob([contents], { type }))
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }
  const saveCopy = () => {
    setLibrary((items) => [{ id: crypto.randomUUID(), title: title || 'Paleta sin título', palette }, ...items])
    setNotice('Copia guardada en tu biblioteca')
  }
  const share = () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ v: 1, title, palette, mode }))))
    if (payload.length > 8192) { setNotice('La paleta es demasiado grande para compartirla por enlace.'); return }
    navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#cw=${payload}`).then(() => setNotice('Enlace de paleta copiado'))
  }
  const undo = () => {
    const previous = history.at(-1)
    if (!previous) return
    setFuture((items) => [palette, ...items]); setPalette(previous); setHistory((items) => items.slice(0, -1)); setNotice('Cambio deshecho')
  }
  const redo = () => {
    const next = future[0]
    if (!next) return
    setHistory((items) => [...items, palette]); setPalette(next); setFuture((items) => items.slice(1)); setNotice('Cambio rehecho')
  }
  const updateMixColor = (id: string, patch: Partial<MixColor>) => setMixColors((colors) => colors.map((color) => color.id === id ? { ...color, ...patch } : color))
  const addMixColor = () => {
    if (mixColors.length >= 5) { setNotice('Puedes combinar hasta seis colores, incluido el color actual.'); return }
    setMixColors((colors) => [...colors, { id: crypto.randomUUID(), hex: '#5EAD57', parts: 1 }])
  }
  const usePaint = (paint: { hex: string }) => {
    setMode('rgb')
    pickHex(paint.hex)
    setNotice(`Color de pintura ${paint.hex} seleccionado`)
  }
  const toggleFavoriteBrand = (brand: string) => {
    const isFavorite = favoriteBrands.includes(brand)
    setFavoriteBrands((brands) => isFavorite ? brands.filter((item) => item !== brand) : [...brands, brand])
    setNotice(isFavorite ? `${brand} retirada de tus favoritas` : `${brand} añadida a tus favoritas`)
  }
  const addFavoriteBrand = (brand: string) => {
    if (brand && !favoriteBrands.includes(brand)) toggleFavoriteBrand(brand)
  }
  const useImageColor = (hex: string) => {
    setMode('rgb')
    pickHex(hex)
    setNotice(`Color de foto ${hex} seleccionado`)
  }
  const loadImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageStatus('Elige un archivo de imagen válido.'); return }
    if (file.size > 20 * 1024 * 1024) { setImageStatus('La foto supera 20 MB. Prueba con una versión más ligera.'); return }
    const request = ++imageLoad.current
    const previewUrl = URL.createObjectURL(file)
    const image = new Image()
    setImageStatus('Analizando colores en este dispositivo…')
    image.onload = () => {
      if (request !== imageLoad.current) { URL.revokeObjectURL(previewUrl); return }
      const longestSide = Math.max(image.naturalWidth, image.naturalHeight)
      const scale = Math.min(1, 320 / longestSide)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      const context = canvas.getContext('2d')
      if (!context) { URL.revokeObjectURL(previewUrl); setImageStatus('No se pudo preparar la imagen.'); return }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const data = context.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractImagePalette(data, imageColorCount)
      if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current)
      imagePreviewUrl.current = previewUrl
      imageData.current = data
      setImagePreview(previewUrl)
      setImageName(file.name)
      setImageColors(colors)
      setImageStatus(`${colors.length} ${colors.length === 1 ? 'color detectado' : 'colores detectados'} en local.`)
    }
    image.onerror = () => { URL.revokeObjectURL(previewUrl); if (request === imageLoad.current) setImageStatus('No se pudo leer esta imagen.') }
    image.src = previewUrl
  }
  const createImagePalette = () => {
    if (!imageColors.length) return
    const next = imageColors.map((hex, index) => newColor(hex, `Foto ${String(index + 1).padStart(2, '0')}`))
    commit(next)
    setSelected(0)
    useImageColor(imageColors[0])
    setNotice(`Paleta de ${next.length} colores creada. Puedes deshacerla si lo necesitas.`)
  }
  const addImageColors = () => {
    const available = 12 - palette.length
    if (available <= 0) { setNotice('Tu Estudio ya tiene 12 colores. Libera una muestra para añadir la foto.'); return }
    const colors = imageColors.slice(0, available)
    if (!colors.length) return
    commit([...palette, ...colors.map((hex, index) => newColor(hex, `Foto ${String(index + 1).padStart(2, '0')}`))])
    setSelected(palette.length)
    useImageColor(colors[0])
    setNotice(colors.length < imageColors.length ? `Se añadieron ${colors.length} colores; el Estudio ha llegado a 12.` : `${colors.length} colores de foto añadidos al Estudio.`)
  }

  return <main className="app-shell">
    <header className="site-header">
      <a className="brand" href="#top"><img className="brand-mark" src="/colorwheel-mark.svg?v=2" alt="" />ColorWheel</a><p className="eyebrow">Laboratorio de color / 01</p>
      <div className="header-actions"><button className="text-button" onClick={() => { window.location.hash = page === 'brands' ? '#top' : '#marcas' }}>{page === 'brands' ? '← Estudio' : `Marcas${favoriteBrands.length ? ` · ${favoriteBrands.length}` : ''}`}</button>{page === 'studio' && <><button className="text-button" onClick={undo} disabled={!history.length}>↶ Deshacer</button><button className="text-button" onClick={redo} disabled={!future.length}>Rehacer ↷</button></>}</div>
    </header>
    {page === 'brands' ? <BrandsPage brands={paintBrands} favorites={favoriteBrands} onToggle={toggleFavoriteBrand} onReturn={() => { window.location.hash = '#top' }} /> : <>
    <section className="intro" id="top"><div><p className="eyebrow">Rueda de color para miniaturas</p><h1>Encuentra un color.<br /><em>Hazlo tuyo.</em></h1></div><p>Una rueda de color y generador de paletas para explorar relaciones, guardar hallazgos y llevar tus pinturas de miniaturas contigo.</p></section>
    <nav className="tool-nav" aria-label="Herramientas de color">
      {([['explore', '01', 'Explorar'], ['harmony', '02', 'Armonías'], ['mix', '03', 'Mezclar'], ['image', '04', 'Foto']] as [Tool, string, string][]).map(([id, number, label]) => <button key={id} className={tool === id ? 'tool-tab active' : 'tool-tab'} onClick={() => setTool(id)}><span>{number}</span>{label}</button>)}
    </nav>
    <section className="workspace" aria-label="Espacio de experimentación">
      {tool === 'image' ? <ImagePaletteWorkspace preview={imagePreview} imageName={imageName} colors={imageColors} count={imageColorCount} status={imageStatus} fileInput={imageInput} onFile={loadImage} onCount={setImageColorCount} onUseColor={useImageColor} onCreate={createImagePalette} onAdd={addImageColors} canAdd={palette.length < 12} /> : <>
      <div className="wheel-stage">
        <div className="wheel-meta"><span>Rueda {mode === 'ryb' ? 'artística RYB' : 'digital RGB'}</span><span className="wheel-switches"><button onClick={() => { setExactHex(null); setMode(mode === 'ryb' ? 'rgb' : 'ryb') }}>Cambiar a {mode === 'ryb' ? 'RGB' : 'RYB'} ↗</button><button className={wheelExpanded ? 'active' : ''} onClick={() => setWheelExpanded((value) => !value)}>{wheelExpanded ? 'Volver a rueda' : 'Rueda ampliada'} ↗</button></span></div>
        <div ref={wheel} className={`color-wheel ${mode} ${wheelExpanded ? 'expanded' : ''}`} role="application" aria-label={wheelExpanded ? 'Rueda ampliada con anillos de colores claros, medios y profundos' : 'Rueda de color'} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); pick(event.clientX, event.clientY) }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) pick(event.clientX, event.clientY) }}>
          {wheelExpanded && wheelBands.map((band) => <button key={band.id} type="button" className={`wheel-band ${mode} ${band.id}`} onClick={() => adjustLightness(band.lightness)} onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); pick(event.clientX, event.clientY, band.lightness) }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) pick(event.clientX, event.clientY, band.lightness) }} aria-label={`Seleccionar una versión ${band.label.toLowerCase()} del matiz`}>{band.label}</button>)}
          <div className="wheel-grain" /><div className="wheel-center"><span>COLOR<br />ACTUAL</span><strong>{active}</strong></div><i className="wheel-marker" style={{ transform: `rotate(${hue}deg) translateY(-50%)` }} />
        </div>
        {wheelExpanded && <div className="wheel-value-key" aria-hidden="true"><span>Profundo</span><span>Medio</span><span>Claro</span></div>}
        <div className="wheel-scale"><span>R · Rojo</span><span>A · Amarillo</span><span>B · Azul</span></div>
      </div>
      <aside className="inspector">
        {tool === 'explore' && <><p className="panel-kicker">Selección libre</p><h2>Da forma al<br /><em>matiz.</em></h2><div className="active-swatch" style={{ background: active, color: contrastText(active) }}><span>{active}</span><button onClick={() => copy(active, 'HEX copiado')}>Copiar</button></div><PaintMatches paints={closePaints} loading={!paintCatalog.length} onPick={usePaint} />
          <Control label="Matiz" id="hue" value={Math.round(hue)} max={360} suffix="°" onChange={adjustHue} /><Control label="Croma" id="saturation" value={saturation} max={100} suffix="%" onChange={adjustSaturation} /><Control label="Luz" id="lightness" value={lightness} min={8} max={92} suffix="%" onChange={adjustLightness} />
          <div className="code-row"><label>HEX<input value={active} maxLength={7} onChange={(event) => pickHex(event.target.value)} /></label><label>HSL<output>{Math.round(hue)}°, {saturation}%, {lightness}%</output></label></div>
          <div className="button-row"><button className="primary-action" onClick={() => add()}>+ Añadir a la paleta</button><button className="ghost-action" disabled={selected === null || palette[selected]?.locked} onClick={() => replace(active)}>Sustituir</button></div>
          <div className="variation-set"><p>Variaciones rápidas</p><div>{[['Blanco', '#FFFFFF'], ['Gris', '#8A8A84'], ['Negro', '#11120F']].map(([name, target]) => <button key={name} style={{ background: mixHex(active, target, .42), color: contrastText(mixHex(active, target, .42)) }} onClick={() => add(mixHex(active, target, .42), `${name} de ${active}`)}>{name}</button>)}</div></div>
        </>}
        {tool === 'harmony' && <><p className="panel-kicker">Relaciones sobre la rueda</p><h2>Deja que el<br /><em>color responda.</em></h2><div className="harmony-options">{(['Complementaria', 'Tríada', 'Análoga'] as const).map((option) => <button key={option} className={option === harmony ? 'selected' : ''} onClick={() => setHarmony(option)}>{option}</button>)}</div><div className="harmony-samples">{harmonyColors.map((color, index) => <button key={`${color}-${index}`} style={{ background: color, color: contrastText(color) }} onClick={() => add(color, `${harmony} ${index + 1}`)}>{color}</button>)}</div><p className="help-copy">Elige una muestra concreta o incorpora toda la relación a tu colección.</p><button className="primary-action wide" onClick={() => harmonyColors.forEach((color, index) => add(color, `${harmony} ${index + 1}`))}>Añadir relación completa</button></>}
        {tool === 'mix' && <><p className="panel-kicker">Mezcla digital</p><h2>Prueba sin<br /><em>gastar pintura.</em></h2><div className="mix-workbench"><div className="mix-base"><span style={{ background: active }} /><div><b>Color actual</b><small>{active} · 1 parte</small></div></div>{mixColors.map((color, index) => <div className="mix-input" key={color.id}><input type="color" value={color.hex} onChange={(event) => updateMixColor(color.id, { hex: event.target.value.toUpperCase() })} aria-label={`Color de mezcla ${index + 2}`} /><label>Color {index + 2}<input type="text" value={color.hex} maxLength={7} onChange={(event) => /^#?[0-9A-Fa-f]{0,6}$/.test(event.target.value) && updateMixColor(color.id, { hex: event.target.value.startsWith('#') ? event.target.value.toUpperCase() : `#${event.target.value.toUpperCase()}` })} /></label><label className="mix-parts">Partes <input type="range" min="1" max="8" value={color.parts} onChange={(event) => updateMixColor(color.id, { parts: Number(event.target.value) })} /><output>{color.parts}</output></label><button className="remove-mix" onClick={() => setMixColors((colors) => colors.filter((item) => item.id !== color.id))} aria-label={`Quitar color ${index + 2}`}>×</button></div>)}</div><button className="add-mix" onClick={addMixColor}>+ Añadir otro color</button><div className="mix-result"><span>Resultado</span><strong style={{ background: mix, color: contrastText(mix) }}>{mix}</strong></div><PaintMatches paints={closeMixPaints} loading={!paintCatalog.length} onPick={usePaint} label="Equivalencias de pintura" /><p className="help-copy">Cada parte pesa en el promedio de mezcla. Ajusta las partes para probar recetas de hasta seis colores.</p><div className="button-row"><button className="primary-action" onClick={() => add(mix, 'Mezcla')}>+ Añadir mezcla</button><button className="ghost-action" disabled={selected === null || palette[selected]?.locked} onClick={() => replace(mix)}>Sustituir</button></div></>}
      </aside>
      </>}
    </section>
    <section className="palette-area" aria-labelledby="palette-title"><div className="palette-heading"><div><p className="eyebrow">Tu colección</p><input id="palette-title" aria-label="Nombre de la paleta" value={title} onChange={(event) => setTitle(event.target.value)} /><p>{palette.length ? `${palette.length} / 12 muestras · se guarda en este dispositivo` : 'Elige un punto en la rueda para empezar'}</p></div><div className="palette-actions"><button className="export-button palette-export" disabled={!palette.length} onClick={() => setExportOpen(true)}>Exportar PNG ↗</button><button className="text-button" disabled={!palette.length} onClick={saveCopy}>Guardar copia</button><button className="text-button" disabled={!palette.length} onClick={() => downloadData(JSON.stringify({ v: 1, title, palette }, null, 2), 'paleta-colorwheel.json', 'application/json')}>JSON</button><button className="text-button" disabled={!palette.length} onClick={() => copy(palette.map((color, index) => `--color-${index + 1}: ${color.hex};`).join('\n'), 'Variables CSS copiadas')}>CSS</button><button className="text-button" disabled={!palette.length} onClick={share}>Compartir</button><button className="text-button danger" disabled={!palette.length} onClick={() => { commit([]); setSelected(null); setNotice('Paleta vaciada; puedes recuperarla con Deshacer.') }}>Vaciar</button></div></div>
      {palette.length ? <div className="palette-grid">{palette.map((color, index) => <article key={color.id} className={selected === index ? 'palette-card selected' : 'palette-card'} onClick={() => setSelected(index)}><div className="palette-chip" style={{ background: color.hex }}><span>{String(index + 1).padStart(2, '0')}</span><button className="lock-button" aria-label={color.locked ? 'Desbloquear muestra' : 'Bloquear muestra'} onClick={(event) => { event.stopPropagation(); update(index, { locked: !color.locked }) }}>{color.locked ? '●' : '○'}</button></div><div className="palette-card-body"><input className="color-name" value={color.name} onClick={(event) => event.stopPropagation()} onChange={(event) => update(index, { name: event.target.value })} aria-label={`Nombre del color ${index + 1}`} /><button className="hex" onClick={(event) => { event.stopPropagation(); copy(color.hex, 'HEX copiado') }}>{color.hex}</button><div className="card-controls"><input type="color" value={color.hex} disabled={color.locked} onClick={(event) => event.stopPropagation()} onChange={(event) => update(index, { hex: event.target.value.toUpperCase() })} aria-label={`Editar ${color.name}`} /><button disabled={index === 0} onClick={(event) => { event.stopPropagation(); move(index, -1) }}>←</button><button disabled={index === palette.length - 1} onClick={(event) => { event.stopPropagation(); move(index, 1) }}>→</button><button disabled={color.locked} onClick={(event) => { event.stopPropagation(); commit(palette.filter((_, position) => position !== index)); setSelected(null) }}>×</button></div><PaintMatches paints={palettePaintMatches[index]} loading={!paintCatalog.length} onPick={usePaint} label="Pinturas próximas" compact /></div></article>)}</div> : <div className="empty-palette"><span>+</span><p>Tu paleta está abierta.<br />Empieza por el color que te llame.</p><button className="primary-action" onClick={() => add()}>Añadir el color actual</button></div>}
    </section>
    <section className="paint-catalog" aria-labelledby="paint-catalog-title"><div className="catalog-heading"><div><p className="eyebrow">Biblioteca de pintura</p><h2 id="paint-catalog-title">Catálogo de pinturas<br /><em>con códigos HEX.</em></h2><p>{paintCatalog.length ? `${paintCatalog.length.toLocaleString('es-ES')} pinturas · ${paintRanges.length} gamas · actualización ${new Date(paintCatalogUpdatedAt).toLocaleDateString('es-ES')}` : 'Cargando catálogo local de pinturas…'}</p></div></div><section className="favorite-brands" aria-labelledby="favorite-brands-title"><div><p className="eyebrow" id="favorite-brands-title">Tus marcas favoritas</p><p>{favoriteBrands.length ? 'Las equivalencias se ajustan únicamente a estas marcas.' : 'Elige marcas para priorizar todas las equivalencias de pintura.'}</p></div><div className="favorite-brand-controls"><label>Agregar marca<select value="" disabled={!paintCatalog.length} onChange={(event) => addFavoriteBrand(event.target.value)}><option value="">Selecciona una marca</option>{paintBrands.filter((brand) => !favoriteBrands.includes(brand)).map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></label>{favoriteBrands.length > 0 && <button className="clear-favorites" onClick={() => { setFavoriteBrands([]); setNotice('Las equivalencias vuelven a usar todo el catálogo') }}>Usar todo el catálogo</button>}</div>{favoriteBrands.length > 0 && <div className="favorite-brand-list" aria-label="Marcas favoritas seleccionadas">{favoriteBrands.map((brand) => <button key={brand} onClick={() => setFavoriteBrands((brands) => brands.filter((item) => item !== brand))}>{brand}<span aria-hidden="true">×</span><span className="sr-only">Quitar {brand}</span></button>)}</div>}</section><div className="catalog-filters"><label>Buscar pintura, código, tipo o HEX<input value={paintSearch} disabled={!paintCatalog.length} onChange={(event) => { setPaintSearch(event.target.value); setPaintLimit(30) }} placeholder="Ej. Shade, Squid Orange, 74.211 o #F49444" /></label><label>Gama<select value={paintRange} disabled={!paintCatalog.length} onChange={(event) => { setPaintRange(event.target.value); setPaintLimit(30) }}><option>Todas las gamas</option>{paintRanges.map((range) => <option key={range}>{range}</option>)}</select></label></div><p className="catalog-result-count">{paintCatalog.length ? `${filteredPaints.length.toLocaleString('es-ES')} resultados · pulsa una pintura para llevar su HEX a la rueda.` : 'Preparando resultados…'}</p><div className="paint-grid">{filteredPaints.slice(0, paintLimit).map((paint) => <button className="paint-card" key={paint.id} onClick={() => usePaint(paint)}><i style={{ background: paint.hex }} /><span><b>{paint.name}</b><small>{paint.range}</small></span><em>{paint.hex}</em><small>{paint.code || '—'}</small><mark>{paint.type || 'Sin clasificar'}</mark></button>)}</div>{filteredPaints.length > paintLimit && <button className="show-more" onClick={() => setPaintLimit((limit) => limit + 30)}>Mostrar 30 pinturas más</button>}<p className="catalog-source">Los nombres y marcas pertenecen a sus respectivos propietarios.</p></section>
    {library.length > 0 && <section className="library" aria-label="Biblioteca de paletas"><p className="eyebrow">Biblioteca local · {library.length}</p><div>{library.map((entry) => <article key={entry.id}><button onClick={() => { commit(entry.palette); setTitle(entry.title); setSelected(null); setNotice('Paleta recuperada') }}><strong>{entry.title}</strong><span>{entry.palette.map((color) => color.hex).join(' · ')}</span></button><button className="remove-library" aria-label={`Eliminar ${entry.title}`} onClick={() => setLibrary((items) => items.filter((item) => item.id !== entry.id))}>×</button></article>)}</div></section>}
    {notice && <div className="toast" role="status">{notice}</div>}
    {exportOpen && <div className="modal-backdrop" onMouseDown={() => setExportOpen(false)}><section className="export-modal" role="dialog" aria-modal="true" aria-labelledby="export-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setExportOpen(false)} aria-label="Cerrar">×</button><p className="eyebrow">Salida de estudio</p><h2 id="export-title">Tu paleta, <em>lista para salir.</em></h2><p className="export-equivalents-note">Incluye hasta {PALETTE_MATCH_LIMIT} equivalencias de pintura por muestra.</p><div className={exportDark ? 'export-preview dark' : 'export-preview'}>{palette.map((color) => <div key={color.id} style={{ background: color.hex, color: contrastText(color.hex) }}>{showHex && color.hex}</div>)}</div><div className="export-options"><fieldset><legend>Fondo</legend><button className={!exportDark ? 'selected' : ''} onClick={() => setExportDark(false)}>Claro</button><button className={exportDark ? 'selected' : ''} onClick={() => setExportDark(true)}>Oscuro</button></fieldset><label className="checkbox-label"><input type="checkbox" checked={showHex} onChange={(event) => setShowHex(event.target.checked)} /> Incluir HEX</label></div><div className="modal-footer"><p>PNG a 2× · altura según equivalencias</p><button className="primary-action" onClick={() => exportPng(palette, palettePaintMatches, title, exportDark, showHex)}>Descargar PNG ↗</button></div></section></div>}
    </>}
  </main>
}

function Control({ label, id, value, max, min = 0, suffix, onChange }: { label: string; id: string; value: number; max: number; min?: number; suffix: string; onChange: (value: number) => void }) {
  return <div className="slider-group"><label htmlFor={id}>{label}<output>{value}{suffix}</output></label><input id={id} type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>
}

function PaintMatches({ paints, loading, onPick, label = 'Coincidencias en pinturas', compact = false }: { paints: PaintCatalogEntry[]; loading: boolean; onPick: (paint: PaintCatalogEntry) => void; label?: string; compact?: boolean }) {
  return <div className={compact ? 'paint-matches compact' : 'paint-matches'}><div><p>{label}</p><span>{loading ? 'cargando catálogo…' : `${paints.length} más cercanas`}</span></div>{paints.map((paint) => <button key={paint.id} onClick={(event) => { event.stopPropagation(); onPick(paint) }}><i style={{ background: paint.hex }} /><span><b>{paint.name}</b><small>{paint.range} · {paint.code || paint.type}</small></span><em>{paint.hex}</em></button>)}</div>
}

function ImagePaletteWorkspace({ preview, imageName, colors, count, status, fileInput, onFile, onCount, onUseColor, onCreate, onAdd, canAdd }: { preview: string; imageName: string; colors: string[]; count: number; status: string; fileInput: RefObject<HTMLInputElement | null>; onFile: (file?: File) => void; onCount: (count: number) => void; onUseColor: (hex: string) => void; onCreate: () => void; onAdd: () => void; canAdd: boolean }) {
  return <div className="image-workspace"><section className="image-photo-pane" aria-labelledby="photo-upload-title"><div><p className="panel-kicker">Foto local</p><h2 id="photo-upload-title">Mira dentro<br /><em>de la imagen.</em></h2></div><div className={preview ? 'image-frame populated' : 'image-frame'} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onFile(event.dataTransfer.files?.[0]) }}>{preview ? <img src={preview} alt={`Vista previa de ${imageName}`} /> : <div className="image-empty" aria-hidden="true"><span>▧</span><p>Arrastra una foto<br />o elígela debajo.</p></div>}</div><label className="image-upload"><span>{preview ? 'Analizar otra foto' : 'Elegir una foto'}</span><input ref={fileInput} type="file" accept="image/*" capture="environment" onChange={(event) => { onFile(event.target.files?.[0]); event.currentTarget.value = '' }} /></label><p className="image-local-note">Tu foto se analiza solo en este navegador; no se sube a ningún sitio.</p></section><aside className="image-inspector"><p className="panel-kicker">Extracción de color</p><h2>Elige cuántos<br /><em>tonos guardar.</em></h2><label className="image-count" htmlFor="image-color-count"><span>Colores a extraer <output>{count}</output></span><input id="image-color-count" type="range" min="4" max="12" value={count} onChange={(event) => onCount(Number(event.target.value))} /><small>De 4 a 12 colores predominantes.</small></label><p className="image-status" role="status" aria-live="polite">{status}</p>{colors.length ? <><div className="image-swatches" role="list" aria-label="Colores detectados">{colors.map((hex, index) => <button key={`${hex}-${index}`} role="listitem" style={{ background: hex, color: contrastText(hex) }} onClick={() => onUseColor(hex)} aria-label={`Usar ${hex} en la rueda`}><span>{String(index + 1).padStart(2, '0')}</span><b>{hex}</b></button>)}</div><p className="image-help">Toca una muestra para llevarla a la rueda. Al crear o añadir la paleta, las equivalencias de pintura aparecen en el Estudio.</p><div className="image-actions"><button className="primary-action" onClick={onCreate}>Crear paleta de {colors.length}</button><button className="ghost-action" onClick={onAdd} disabled={!canAdd}>Añadir al Estudio</button></div><p className="image-undo-note">Crear paleta sustituye el Estudio actual; siempre puedes deshacerlo.</p></> : <p className="image-help">La extracción aparecerá aquí al elegir una foto.</p>}</aside></div>
}

function BrandsPage({ brands, favorites, onToggle, onReturn }: { brands: string[]; favorites: string[]; onToggle: (brand: string) => void; onReturn: () => void }) {
  return <section className="brands-page" aria-labelledby="brands-page-title"><div className="brands-hero"><div><p className="eyebrow">Preferencias de pintura / local</p><h1 id="brands-page-title">Tu mesa,<br /><em>tus marcas.</em></h1><p>Marca tus favoritas y todas las equivalencias de color se ajustarán a ellas: en la rueda, las mezclas y tu Estudio de color.</p><button className="primary-action" onClick={onReturn}>← Volver al estudio</button></div><aside><span>{favorites.length}</span><p>{favorites.length === 1 ? 'marca favorita activa' : 'marcas favoritas activas'}</p><small>Se guarda en este navegador.</small></aside></div><div className="brands-grid">{brands.map((brand) => {
    const favorite = favorites.includes(brand)
    return <button key={brand} className={favorite ? 'brand-card favorite' : 'brand-card'} onClick={() => onToggle(brand)} aria-pressed={favorite} style={{ backgroundColor: brandTone(brand) }}><span className="brand-watermark" aria-hidden="true">{brandMonogram(brand)}</span><span className="brand-card-top"><i aria-hidden="true">{favorite ? '★' : '☆'}</i><small>{favorite ? 'Favorita' : 'Añadir'}</small></span><span className="brand-name">{brand}</span><span className="brand-card-action">{favorite ? 'Activa en sugerencias' : 'Usar en sugerencias'}</span></button>
  })}</div></section>
}

export default App
