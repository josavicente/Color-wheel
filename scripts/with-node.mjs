import { spawnSync } from 'node:child_process'
import { delimiter, dirname } from 'node:path'
import process from 'node:process'

const minimumMajor = 24
const fallbackVersion = '26.13.0'
const [command, ...argumentsToPass] = process.argv.slice(2)
const candidates = process.platform === 'darwin'
  ? ['/opt/homebrew/bin/fnm', '/usr/local/bin/fnm', 'fnm']
  : ['fnm']

if (!command) {
  console.error('Uso interno: with-node.mjs <comando> [...argumentos]')
  process.exit(1)
}

const currentMajor = Number.parseInt(process.versions.node.split('.')[0], 10)
if (currentMajor >= minimumMajor) {
  const runtimePath = [dirname(process.execPath), process.env.PATH].filter(Boolean).join(delimiter)
  const result = spawnSync(command, argumentsToPass, { stdio: 'inherit', env: { ...process.env, PATH: runtimePath } })
  process.exit(result.status ?? 1)
}

for (const fnm of candidates) {
  const result = spawnSync(fnm, ['exec', `--using=${fallbackVersion}`, command, ...argumentsToPass], {
    stdio: 'inherit',
  })

  if (result.error?.code === 'ENOENT') continue
  process.exit(result.status ?? 1)
}

console.error(`ColorWheel necesita Node ${minimumMajor} o superior. Instálalo con: fnm install ${fallbackVersion}`)
process.exit(1)
