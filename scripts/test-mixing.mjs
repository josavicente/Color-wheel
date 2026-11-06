import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = fileURLToPath(new URL('../', import.meta.url))
const output = mkdtempSync(join(tmpdir(), 'colorwheel-mixing-'))
try {
  execFileSync(process.execPath, [join(project, 'node_modules/typescript/bin/tsc'), '--module', 'commonjs', '--target', 'ES2022', '--moduleResolution', 'node', '--skipLibCheck', '--outDir', output, join(project, 'src/mixing.ts')], { cwd: project, stdio: 'inherit' })
  writeFileSync(join(output, 'package.json'), '{"type":"commonjs"}')
  const require = createRequire(import.meta.url)
  const { ingredientPercent, mixResult, newMixRecipe, parseMixRecipe, readMixerState, recipeSnapshot } = require(join(output, 'mixing.js'))
  const paint = { id: 'paint-1', name: 'Black', hex: '#000000', brand: 'Vallejo', range: 'Vallejo Model Color', code: '70.950', type: 'Base' }
  const recipe = { id: 'recipe-1', title: 'Gris', ingredients: [{ id: 'ingredient-1', name: paint.name, hex: paint.hex, parts: 1, paint }, { id: 'ingredient-2', name: 'Blanco', hex: '#FFFFFF', parts: 3 }] }

  assert.equal(mixResult(recipe.ingredients), '#BFBFBF', 'las partes pesan en el resultado')
  assert.equal(ingredientPercent(recipe.ingredients[0], recipe.ingredients), 25)
  assert.equal(mixResult([{ ...recipe.ingredients[0], parts: 1 }, { ...recipe.ingredients[1], parts: 1 }]), '#808080')
  assert.deepEqual(parseMixRecipe(recipe), recipe)
  assert.equal(parseMixRecipe({ ...recipe, ingredients: [] }), null)
  assert.equal(parseMixRecipe({ ...recipe, ingredients: Array.from({ length: 7 }, (_, index) => ({ ...recipe.ingredients[0], id: `ingredient-${index}` })) }), null)
  assert.equal(parseMixRecipe({ ...recipe, ingredients: [recipe.ingredients[0], recipe.ingredients[0]] }), null, 'rechaza identidades duplicadas')
  for (const parts of [0, 9, 1.5, '2', null]) {
    assert.equal(parseMixRecipe({ ...recipe, ingredients: [{ ...recipe.ingredients[0], parts }] }), null, `rechaza partes ${parts}`)
  }
  for (const parts of [1, 8]) assert.ok(parseMixRecipe({ ...recipe, ingredients: [{ ...recipe.ingredients[0], parts }] }))
  assert.equal(parseMixRecipe({ ...recipe, ingredients: [{ ...recipe.ingredients[0], hex: '#123456' }] }), null, 'rechaza pintura cuya identidad no corresponde al HEX')
  assert.equal(parseMixRecipe({ ...recipe, ingredients: [{ ...recipe.ingredients[1], hex: '#FFF' }] }), null)

  const snapshot = recipeSnapshot(recipe)
  snapshot.ingredients[0].parts = 8
  snapshot.ingredients[0].paint.name = 'Changed'
  assert.equal(recipe.ingredients[0].parts, 1, 'editar un snapshot no cambia la receta original')
  assert.equal(recipe.ingredients[0].paint.name, 'Black', 'también copia la identidad de la pintura')
  const unnamed = recipeSnapshot({ ...recipe, title: '  ', ingredients: [{ ...recipe.ingredients[1], name: ' ' }] })
  assert.ok(parseMixRecipe(unnamed), 'los campos vacíos temporales se normalizan antes de persistir')

  const state = { draft: recipe, recipes: [recipe] }
  assert.deepEqual(readMixerState(JSON.stringify(state)), state, 'persistencia conserva ingredientes, identidad y proporciones')
  for (const raw of [null, 'broken', 'null', '[]', '{}']) assert.equal(readMixerState(raw), null)
  const recovered = readMixerState(JSON.stringify({ draft: {}, recipes: [recipe, { id: 'broken' }, recipe] }), '#123456')
  assert.deepEqual(recovered.recipes, [recipe], 'conserva las recetas válidas aunque el borrador esté dañado y elimina duplicados')
  assert.equal(recovered.draft.ingredients[0].hex, '#123456')
  const fresh = newMixRecipe('#ABCDEF')
  assert.equal(fresh.ingredients[0].hex, '#ABCDEF')
  assert.equal(fresh.ingredients.length, 1)
  assert.notEqual(fresh.id, newMixRecipe('#ABCDEF').id)
  assert.equal(newMixRecipe('invalid').ingredients[0].hex, '#808080')
  console.log('Mixing checks passed: proportions, validation, identity, snapshots and persistence.')
} finally {
  rmSync(output, { recursive: true, force: true })
}
