import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
function sources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory()
      ? sources(path)
      : /\.(ts|tsx)$/.test(entry.name) &&
          !/\.(test|spec|test-support|test-fixture)\./.test(entry.name)
        ? [path]
        : []
  })
}
const runtimeFiles = sources(join(root, 'src/main/runtime/rpc/methods'))
const methods = runtimeFiles
  .flatMap((file) => {
    const source = readFileSync(file, 'utf8')
    return [
      ...source.matchAll(/name:\s*['"]([^'"]+)['"][\s\S]{0,180}?permission:\s*['"]([^'"]+)['"]/g)
    ].map((match) => ({ method: match[1], permission: match[2], source: relative(root, file) }))
  })
  .sort((a, b) => a.method.localeCompare(b.method))
const bridgeFiles = sources(join(root, 'src/renderer/src/web/preload-api'))
const electron = sources(join(root, 'src/main'))
  .filter((file) =>
    /from ['"]electron['"]|require\(['"]electron['"]\)/.test(readFileSync(file, 'utf8'))
  )
  .map((file) => relative(root, file))
  .sort()
const explicitWebDefaults = bridgeFiles.flatMap((file) => {
  const source = readFileSync(file, 'utf8')
  return source
    .split('\n')
    .flatMap((line, index) =>
      /Promise\.resolve|noopUnsubscribe|=> \(\) => \{\}/.test(line)
        ? [{ source: relative(root, file), line: index + 1, code: line.trim() }]
        : []
    )
})
const audit = {
  baseline: '32a6c4206eb7c31e846c2d32285e5125e6fc2bc2',
  scope:
    'Static literal method inventory; dynamic namespaces and source-only features require further audit. Defaults are candidates for review, never proof of missing or working functionality.',
  documentationRegister: 'docs/ade/orca-feature-parity.csv',
  preloadRegister: 'docs/ade/orca-api-parity.csv',
  runtimeMethods: methods,
  electronBoundaries: electron,
  explicitWebDefaults,
  releaseBlockers: [
    {
      owner: 'src/main/browser/offscreen-browser-backend.ts',
      status: 'adapter-required',
      evidence: 'Electron BrowserWindow; no Tauri browser parity verified'
    },
    {
      owner: 'src/main/agent-awake-service.ts',
      status: 'adapter-required',
      evidence: 'Electron powerSaveBlocker and platform assertions; physical lid/sleep untested'
    },
    {
      owner: 'src/renderer/src/web/preload-api/web-fallback-api.ts',
      status: 'audit-required',
      evidence: 'Missing methods return defaults; NOT native parity'
    },
    {
      owner: 'src/shared/mobile-relay-pairing-offer.ts',
      status: 'behavior-change-required',
      evidence:
        'Runtime-scoped relay offers explicitly rejected; mobile relay is not desktop team connectivity'
    },
    {
      owner: 'src/main/runtime/rpc/methods/orchestration/federation/federation-relay.ts',
      status: 'implemented',
      evidence: 'Atomic control-mail batch and duplicate validation; focused tests required'
    }
  ]
}
const output = join(root, 'docs/ade/cloud-capability-audit.json')
const rendered = `${JSON.stringify(audit, null, 2)}\n`
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== rendered) {
    throw new Error('Capability audit is stale; run node config/scripts/audit-ade-capabilities.mjs')
  }
} else {
  writeFileSync(output, rendered)
}
console.log(
  `${methods.length} literal runtime methods, ${electron.length} Electron boundaries, ${explicitWebDefaults.length} explicit web-default candidates.`
)
