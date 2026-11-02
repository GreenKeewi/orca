import { installOrcadShutdownSignals } from './orcad-lifecycle'
import type { OrcadHandle, OrcadOptions } from './orcad-start-contract'
import type { Readable } from 'node:stream'

export function desktopParentHandshake(
  options: OrcadOptions,
  env: NodeJS.ProcessEnv = process.env
): { desktopParent?: { protocolVersion: 1; nonce: string } } {
  if (!options.desktopParentStdio) {
    return {}
  }
  const nonce = env.ORCA_ADE_PARENT_NONCE
  if (
    !nonce ||
    !/^[a-f0-9]{64}$/.test(nonce) ||
    !options.json ||
    options.bind !== '127.0.0.1' ||
    options.port !== 0 ||
    options.noPairing ||
    options.mobilePairing ||
    options.grantDesktopControl ||
    options.recipeJson
  ) {
    throw new Error(
      'Desktop parent requires a nonce, JSON readiness and ephemeral loopback runtime pairing.'
    )
  }
  return { desktopParent: { protocolVersion: 1, nonce } }
}

export function watchDesktopParent(input: Readable, stop: () => void): void {
  let stopped = false
  const lost = (): void => {
    if (!stopped) {
      stopped = true
      stop()
    }
  }
  input.once('end', lost)
  input.once('close', lost)
  input.once('error', lost)
  input.resume()
}

export function installDesktopParentShutdown(options: OrcadOptions, startup: Promise<OrcadHandle>) {
  const shutdown = installOrcadShutdownSignals(async () => (await startup).stop())
  if (options.desktopParentStdio) {
    watchDesktopParent(process.stdin, () => shutdown('desktop parent disconnected'))
  }
  return shutdown
}
