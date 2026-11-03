import { spawnSync } from 'node:child_process'
import process from 'node:process'

const requiredVersion = '26.13.0'
const [command, ...argumentsToPass] = process.argv.slice(2)
const candidates = process.platform === 'darwin'
  ? ['/opt/homebrew/bin/fnm', '/usr/local/bin/fnm', 'fnm']
  : ['fnm']

if (!command) {
  console.error('Uso interno: with-node.mjs <comando> [...argumentos]')
  process.exit(1)
}

for (const fnm of candidates) {
  const result = spawnSync(fnm, ['exec', `--using=${requiredVersion}`, command, ...argumentsToPass], {
    stdio: 'inherit',
  })

  if (result.error?.code === 'ENOENT') continue
  process.exit(result.status ?? 1)
}

console.error(`ColorWheel necesita Node ${requiredVersion}. Instálalo con: fnm install ${requiredVersion}`)
process.exit(1)
