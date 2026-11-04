import { rgbToHex } from './color'

type Sample = { r: number; g: number; b: number; weight: number }
type Cluster = Sample

const MIN_COLORS = 4
const MAX_COLORS = 12

const distance = (left: Sample, right: Sample) => (left.r - right.r) ** 2 + (left.g - right.g) ** 2 + (left.b - right.b) ** 2

function seedClusters(samples: Sample[], count: number) {
  const sorted = [...samples].sort((left, right) => right.weight - left.weight)
  const seeds = [sorted[0]]
  while (seeds.length < count) {
    const candidate = sorted.reduce((best, sample) => {
      const separation = Math.min(...seeds.map((seed) => distance(sample, seed))) * sample.weight
      return separation > best.separation ? { sample, separation } : best
    }, { sample: sorted[0], separation: -1 })
    if (seeds.some((seed) => seed.r === candidate.sample.r && seed.g === candidate.sample.g && seed.b === candidate.sample.b)) break
    seeds.push(candidate.sample)
  }
  return seeds.map((sample) => ({ ...sample }))
}

/** Extracts representative colours from a browser ImageData buffer without uploading the source image. */
export function extractImagePalette(image: ImageData, requestedCount: number) {
  const buckets = new Map<string, Sample>()
  const pixels = image.width * image.height
  const stride = Math.max(1, Math.floor(Math.sqrt(pixels / 9000)))
  for (let y = 0; y < image.height; y += stride) {
    for (let x = 0; x < image.width; x += stride) {
      const offset = (y * image.width + x) * 4
      const alpha = image.data[offset + 3]
      if (alpha < 128) continue
      const r = image.data[offset]
      const g = image.data[offset + 1]
      const b = image.data[offset + 2]
      const key = `${r >> 4}-${g >> 4}-${b >> 4}`
      const current = buckets.get(key) || { r: 0, g: 0, b: 0, weight: 0 }
      current.r += r
      current.g += g
      current.b += b
      current.weight += 1
      buckets.set(key, current)
    }
  }
  const samples = [...buckets.values()].map((sample) => ({
    ...sample,
    r: sample.r / sample.weight,
    g: sample.g / sample.weight,
    b: sample.b / sample.weight,
  }))
  if (!samples.length) return []

  const count = Math.min(MAX_COLORS, Math.max(MIN_COLORS, Math.round(requestedCount)), samples.length)
  let clusters = seedClusters(samples, count)
  for (let iteration = 0; iteration < 12; iteration += 1) {
    const totals = clusters.map(() => ({ r: 0, g: 0, b: 0, weight: 0 }))
    samples.forEach((sample) => {
      let nearest = 0
      let nearestDistance = Number.POSITIVE_INFINITY
      clusters.forEach((cluster, index) => {
        const candidateDistance = distance(sample, cluster)
        if (candidateDistance < nearestDistance) { nearest = index; nearestDistance = candidateDistance }
      })
      totals[nearest].r += sample.r * sample.weight
      totals[nearest].g += sample.g * sample.weight
      totals[nearest].b += sample.b * sample.weight
      totals[nearest].weight += sample.weight
    })
    clusters = clusters.map((cluster, index) => totals[index].weight
      ? { r: totals[index].r / totals[index].weight, g: totals[index].g / totals[index].weight, b: totals[index].b / totals[index].weight, weight: totals[index].weight }
      : cluster)
  }
  const seen = new Set<string>()
  return clusters
    .sort((left, right) => right.weight - left.weight)
    .map((cluster) => rgbToHex(cluster))
    .filter((hex) => !seen.has(hex) && Boolean(seen.add(hex)))
}
