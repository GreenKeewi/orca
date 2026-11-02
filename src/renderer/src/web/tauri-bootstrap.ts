import { z } from 'zod'
import { parseWebPairingInput } from './web-pairing'
import {
  createStoredWebRuntimeEnvironment,
  saveStoredWebRuntimeEnvironment
} from './web-runtime-environment'

const DesktopBootstrapSchema = z.object({
  type: z.literal('orca_server_ready'),
  schemaVersion: z.literal(1),
  runtimeId: z.string().min(1),
  desktopParent: z.object({
    protocolVersion: z.literal(1),
    nonce: z.string().regex(/^[a-f0-9]{64}$/)
  }),
  boundEndpoint: z.string().url(),
  pairing: z.object({ available: z.literal(true), scope: z.literal('runtime'), url: z.string() })
})

export function parseDesktopBootstrap(input: unknown) {
  const readiness = DesktopBootstrapSchema.parse(input)
  const offer = parseWebPairingInput(readiness.pairing.url)
  if (!offer || offer.scope !== 'runtime' || offer.endpoint !== readiness.boundEndpoint) {
    throw new Error('Desktop runtime returned an inconsistent pairing offer.')
  }
  const endpoint = new URL(offer.endpoint)
  if (endpoint.protocol !== 'ws:' || endpoint.hostname !== '127.0.0.1' || !endpoint.port) {
    throw new Error('Desktop runtime must use its owned loopback endpoint.')
  }
  return { readiness, offer }
}

export async function bootstrapTauriRuntime(): Promise<void> {
  if (!('__TAURI_INTERNALS__' in window)) {
    return
  }
  const { invoke } = await import('@tauri-apps/api/core')
  const { readiness, offer } = parseDesktopBootstrap(await invoke('ade_runtime_bootstrap'))
  saveStoredWebRuntimeEnvironment({
    ...createStoredWebRuntimeEnvironment({ name: 'Orca ADE local runtime', offer }),
    runtimeId: readiness.runtimeId,
    sessionOnly: true
  })
}
