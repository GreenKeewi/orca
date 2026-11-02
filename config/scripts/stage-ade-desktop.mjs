import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { orcadNodeRuntimeRelativePath } from '../../src/shared/orcad-artifacts.ts'

const root = resolve(import.meta.dirname, '../..')
const desktop = join(root, 'native/ade-desktop')
const source = join(root, 'out/orcad')
const destination = join(desktop, 'resources')
if (!existsSync(join(root, 'out/web/web-index.html'))) {
  throw new Error('Build the existing Orca web renderer first: pnpm build:web')
}
const target = readFileSync(join(source, '.server-target'), 'utf8').trim()
const digest = readFileSync(join(source, '.runtime-node'), 'utf8').trim()
if (!/^[a-f0-9]{64}$/.test(digest)) {
  throw new Error('Invalid packaged Node digest')
}
const nodeRelative = orcadNodeRuntimeRelativePath(target, digest)
const nodeSource = resolve(source, ...nodeRelative)
if (createHash('sha256').update(readFileSync(nodeSource)).digest('hex') !== digest) {
  throw new Error('Packaged Node does not match upstream pin')
}
rmSync(destination, { recursive: true, force: true })
mkdirSync(destination, { recursive: true })
cpSync(source, join(destination, 'orcad'), { recursive: true, dereference: true })
cpSync(join(root, 'LICENSE'), join(destination, 'ORCA-LICENSE.txt'))
const nodeDestination = resolve(destination, 'orcad', ...nodeRelative)
if (relative(destination, nodeDestination).startsWith('..')) {
  throw new Error('Packaged Node escaped desktop resources')
}
mkdirSync(dirname(nodeDestination), { recursive: true })
cpSync(nodeSource, nodeDestination)
const files = {}
function inventory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      inventory(path)
    } else if (entry.isFile()) {
      files[relative(destination, path).replaceAll('\\', '/')] = createHash('sha256')
        .update(readFileSync(path))
        .digest('hex')
    } else {
      throw new Error(`Non-file runtime resource: ${path}`)
    }
  }
}
inventory(destination)
writeFileSync(
  join(desktop, 'runtime-manifest.json'),
  `${JSON.stringify(
    {
      node: relative(destination, nodeDestination).replaceAll('\\', '/'),
      launcher: 'orcad/orcad-server.js',
      files
    },
    null,
    2
  )}\n`
)
console.log(
  `Staged ${Object.keys(files).length} verified runtime files; no provider credentials imported.`
)
