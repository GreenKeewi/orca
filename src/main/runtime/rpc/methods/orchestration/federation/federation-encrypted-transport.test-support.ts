import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { z } from 'zod'
import { encodePairingOffer } from '../../../../../../shared/pairing'
import { DeviceRegistry } from '../../../../device-registry'
import { devicePrincipalOf } from '../../../../device-principal'
import { loadOrCreateE2EEKeypair } from '../../../../e2ee-keypair'
import { MobileSocketWiring } from '../../../mobile-socket-wiring'
import { WebSocketTransport } from '../../../ws-transport'
import type { RpcDispatcher } from '../../../dispatcher'

const WireRequest = z.object({
  id: z.string(),
  method: z.string(),
  params: z.unknown().optional(),
  orchestrationContractVersion: z.number().optional(),
  orchestrationRequestId: z.string().optional()
})

export async function startEncryptedFederationPeer(dispatcher: RpcDispatcher) {
  const directory = mkdtempSync(join(tmpdir(), 'ade-encrypted-peer-'))
  const registry = new DeviceRegistry(directory)
  const device = registry.addDevice('Coordinator test device', 'runtime', 'this-computer')
  const keypair = loadOrCreateE2EEKeypair(directory)
  const transport = new WebSocketTransport({ host: '127.0.0.1', port: 0 })
  const wiring = new MobileSocketWiring({
    deviceRegistry: registry,
    e2eeKeypair: keypair,
    onText: (socket, text, reply) => {
      const request = WireRequest.parse(JSON.parse(text))
      void dispatcher
        .dispatch(
          {
            ...request,
            authToken: socket.device.deviceToken ?? socket.device.deviceId
          },
          { authenticatedCallerFingerprint: socket.device.callerFingerprint }
        )
        .then((response) => reply(JSON.stringify(response)))
    },
    onBinary: () => {},
    onClose: () => {}
  })
  const detach = wiring.attachTransport(transport)
  try {
    await transport.start()
  } catch (error) {
    detach()
    wiring.dispose()
    registry.flushPendingLastSeen()
    rmSync(directory, { recursive: true, force: true })
    throw error
  }
  return {
    fingerprint: devicePrincipalOf(device).callerFingerprint,
    pairingUrl: encodePairingOffer({
      v: 2,
      endpoint: `ws://127.0.0.1:${transport.resolvedPort}`,
      deviceToken: device.token,
      publicKeyB64: keypair.publicKeyB64,
      scope: 'runtime'
    }),
    async close() {
      await transport.stop()
      detach()
      wiring.dispose()
      registry.flushPendingLastSeen()
      rmSync(directory, { recursive: true, force: true })
    }
  }
}
