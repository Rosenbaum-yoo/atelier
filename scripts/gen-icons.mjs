// Generiert alle PWA-Raster-Icons aus EINER SVG-Quelle (Brand-Mark, gesperrte Tokens).
// Reproduzierbar im Build statt Handarbeit pro Groesse. Lauf: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const icons = resolve(root, 'public/icons')
const svg = readFileSync(resolve(icons, 'icon.svg'))
const svgMask = readFileSync(resolve(icons, 'icon-maskable.svg'))

const out = (src, size, name) => sharp(src).resize(size, size).png().toFile(resolve(icons, name))

await Promise.all([
  out(svg, 192, 'icon-192.png'),
  out(svg, 512, 'icon-512.png'),
  out(svgMask, 192, 'maskable-192.png'),
  out(svgMask, 512, 'maskable-512.png'),
  out(svg, 180, 'apple-touch-icon.png'),
  out(svg, 32, 'favicon-32.png'),
])
console.log('PWA icons generated -> public/icons/')
