import sharp from 'sharp'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src  = resolve(root, 'public', 'logo-club.jpg')

if (!existsSync(src)) {
  console.error('logo-club.jpg introuvable dans public/')
  process.exit(1)
}

const icons = [
  { name: 'favicon-16x16.png',   size: 16  },
  { name: 'favicon-32x32.png',   size: 32  },
  { name: 'favicon-96x96.png',   size: 96  },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of icons) {
  const dest = resolve(root, 'public', name)
  await sharp(src).resize(size, size, { fit: 'cover' }).png().toFile(dest)
  console.log(`✓ ${name} (${size}×${size})`)
}
console.log('Icônes générées.')
