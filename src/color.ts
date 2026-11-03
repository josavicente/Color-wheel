export type Rgb = { r: number; g: number; b: number }

export type PaletteColor = {
  id: string
  hex: string
  name: string
  locked: boolean
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360

export function hexToRgb(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) return { r: 0, g: 0, b: 0 }
  return {
    r: Number.parseInt(match[1].slice(0, 2), 16),
    g: Number.parseInt(match[1].slice(2, 4), 16),
    b: Number.parseInt(match[1].slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb) {
  const encode = (channel: number) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0')
  return `#${encode(r)}${encode(g)}${encode(b)}`.toUpperCase()
}

export function hslToHex(hue: number, saturation: number, lightness: number) {
  const h = normalizeHue(hue) / 360
  const s = clamp(saturation / 100)
  const l = clamp(lightness / 100)
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const secondary = chroma * (1 - Math.abs((h * 6) % 2 - 1))
  const offset = l - chroma / 2
  const variants: Rgb[] = [
    { r: chroma, g: secondary, b: 0 }, { r: secondary, g: chroma, b: 0 },
    { r: 0, g: chroma, b: secondary }, { r: 0, g: secondary, b: chroma },
    { r: secondary, g: 0, b: chroma }, { r: chroma, g: 0, b: secondary },
  ]
  const color = variants[Math.floor(h * 6) % 6]
  return rgbToHex({ r: (color.r + offset) * 255, g: (color.g + offset) * 255, b: (color.b + offset) * 255 })
}

export function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2
  if (delta === 0) return { h: 0, s: 0, l: Math.round(lightness * 100) }
  let hue = max === red ? 60 * (((green - blue) / delta) % 6) : max === green ? 60 * ((blue - red) / delta + 2) : 60 * ((red - green) / delta + 4)
  return { h: Math.round(normalizeHue(hue)), s: Math.round(delta / (1 - Math.abs(2 * lightness - 1)) * 100), l: Math.round(lightness * 100) }
}

export function mixHex(left: string, right: string, amount: number) {
  const start = hexToRgb(left)
  const end = hexToRgb(right)
  const t = clamp(amount)
  return rgbToHex({ r: start.r + (end.r - start.r) * t, g: start.g + (end.g - start.g) * t, b: start.b + (end.b - start.b) * t })
}

export function mixManyHex(colors: Array<{ hex: string; weight: number }>) {
  const totalWeight = colors.reduce((total, color) => total + Math.max(0, color.weight), 0)
  if (!totalWeight) return '#000000'
  const channels = colors.reduce((total, color) => {
    const rgb = hexToRgb(color.hex)
    const weight = Math.max(0, color.weight)
    return { r: total.r + rgb.r * weight, g: total.g + rgb.g * weight, b: total.b + rgb.b * weight }
  }, { r: 0, g: 0, b: 0 })
  return rgbToHex({ r: channels.r / totalWeight, g: channels.g / totalWeight, b: channels.b / totalWeight })
}

function linearChannel(channel: number) {
  const value = channel / 255
  return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
}

function oklab(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const red = linearChannel(r)
  const green = linearChannel(g)
  const blue = linearChannel(b)
  const l = Math.cbrt(.4122214708 * red + .5363325363 * green + .0514459929 * blue)
  const m = Math.cbrt(.2119034982 * red + .6806995451 * green + .1073969566 * blue)
  const s = Math.cbrt(.0883024619 * red + .2817188376 * green + .6299787005 * blue)
  return {
    l: .2104542553 * l + .793617785 * m - .0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + .4505937099 * s,
    b: .0259040371 * l + .7827717662 * m - .808675766 * s,
  }
}

export function colorDistance(left: string, right: string) {
  const a = oklab(left)
  const b = oklab(right)
  return (a.l - b.l) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2
}

export function contrastText(hex: string) {
  const channels = Object.values(hexToRgb(hex)).map((channel) => {
    const value = channel / 255
    return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
  })
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2] > .38 ? '#181815' : '#FFFDF6'
}

const ryb = ['#F23B21', '#F46D1D', '#F6B328', '#F1D54B', '#B9C94F', '#5EAD57', '#258A78', '#267EB5', '#375BA8', '#624E9A', '#9C4E9A', '#C54672', '#F23B21']

export function wheelColor(hue: number, mode: 'ryb' | 'rgb', saturation: number, lightness: number) {
  const pure = mode === 'rgb'
    ? hslToHex(hue, 100, 50)
    : mixHex(ryb[Math.floor(normalizeHue(hue) / 30)], ryb[Math.floor(normalizeHue(hue) / 30) + 1], normalizeHue(hue) % 30 / 30)
  const hsl = hexToHsl(pure)
  return hslToHex(hsl.h, hsl.s * saturation / 100, lightness)
}

export const newColor = (hex: string, name = 'Sin nombre'): PaletteColor => ({ id: crypto.randomUUID(), hex, name, locked: false })
