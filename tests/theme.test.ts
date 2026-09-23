import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { cn, textStyles } from '../src/lib/utils'

const theme = await readFile(new URL('../src/theme.css', import.meta.url), 'utf8')
const tokens = new Map([...theme.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))

test('every text role has an explicit family and pixel size, line height, and tracking', () => {
  const roles = [...tokens.keys()].filter((key) => key.startsWith('text-') && !key.includes('--'))
  assert.deepEqual(roles.map((key) => key.slice(5)).sort(), [...textStyles].sort())
  for (const key of roles) {
    const role = key.slice(5)
    assert.match(tokens.get(`font-${role}`) ?? '', /^"(?:Inter|Jura|Newsreader)",/)
    for (const metric of [key, `${key}--line-height`, `${key}--letter-spacing`]) {
      assert.match(tokens.get(metric) ?? '', /^-?\d+(?:\.\d+)?px$/, metric)
    }
    assert.match(tokens.get(`${key}--font-weight`) ?? '', /^[1-9]00$/)
  }
})

test('color literals are hex and radius tokens are pixels', () => {
  assert.doesNotMatch(theme, /\b(?:rgba?|hsla?|oklch|oklab)\(/)
  for (const [key, value] of tokens) {
    if (key.startsWith('color-')) assert.match(value, /^#(?:[\da-f]{6}|[\da-f]{8})$/i, key)
    if (key.startsWith('radius-')) assert.match(value, /^\d+px$/, key)
  }
})

test('custom text sizes and colors coexist and can be overridden independently', () => {
  for (const role of textStyles) {
    assert.equal(cn(`font-${role} text-${role}`, 'text-ink'), `font-${role} text-${role} text-ink`)
  }
  assert.equal(cn('font-body text-body text-ink', 'font-caption text-caption'), 'text-ink font-caption text-caption')
  assert.equal(cn('text-body text-ink', 'text-danger'), 'text-body text-danger')
  assert.equal(cn('rounded-md', 'rounded-pill'), 'rounded-pill')
  assert.equal(cn('rounded-pill', 'rounded-sm'), 'rounded-sm')
})

test('UI components use theme tokens instead of arbitrary type, radius, or color values', async () => {
  async function checkDirectory(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) await checkDirectory(path)
      else if (path.endsWith('.tsx')) {
        const source = await readFile(path, 'utf8')
        assert.doesNotMatch(source, /(?:text|leading|tracking|rounded)-\[/, path)
        assert.doesNotMatch(source, /\b(?:rgba?|hsla?|oklch|oklab)\(/, path)
        assert.doesNotMatch(source, /#[\da-f]{6,8}\b/i, path)
      }
    }
  }
  await checkDirectory(fileURLToPath(new URL('../src', import.meta.url)))
})
