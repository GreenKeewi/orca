import { describe, expect, it } from 'vitest'
import { parseDesktopBootstrap } from './tauri-bootstrap'

function bootstrap(endpoint = 'ws://127.0.0.1:12345') {
  const offer = {
    v: 2,
    endpoint,
    scope: 'runtime',
    deviceToken: 'local-test-token',
    publicKeyB64: 'key'
  }
  return {
    type: 'orca_server_ready',
    schemaVersion: 1,
    runtimeId: 'ade-test',
    desktopParent: { protocolVersion: 1, nonce: 'a'.repeat(64) },
    boundEndpoint: endpoint,
    pairing: {
      available: true,
      scope: 'runtime',
      url: `orca://pair?code=${Buffer.from(JSON.stringify(offer)).toString('base64url')}`
    }
  }
}

describe('native runtime bootstrap', () => {
  it('uses the real runtime pairing contract', () => {
    expect(parseDesktopBootstrap(bootstrap()).offer.endpoint).toBe('ws://127.0.0.1:12345')
  })

  it('rejects remote, stale-protocol and inconsistent bootstrap responses', () => {
    expect(() => parseDesktopBootstrap(bootstrap('ws://192.168.1.2:12345'))).toThrow()
    const response = bootstrap()
    expect(() => parseDesktopBootstrap({ ...response, schemaVersion: 2 })).toThrow()
    expect(() =>
      parseDesktopBootstrap({ ...response, boundEndpoint: 'ws://127.0.0.1:12346' })
    ).toThrow()
    expect(() => parseDesktopBootstrap({ ...response, desktopParent: undefined })).toThrow()
  })
})
