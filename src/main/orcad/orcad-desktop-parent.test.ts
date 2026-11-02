import { PassThrough } from 'node:stream'
import { describe, expect, it, vi } from 'vitest'
import { desktopParentHandshake, watchDesktopParent } from './orcad-desktop-parent'

const options = { desktopParentStdio: true, json: true, bind: '127.0.0.1', port: 0 }
const env = { ORCA_ADE_PARENT_NONCE: 'a'.repeat(64) }

describe('owned desktop runtime', () => {
  it('requires fresh local-only bootstrap without changing ordinary server startup', () => {
    expect(desktopParentHandshake({}, {})).toEqual({})
    expect(desktopParentHandshake(options, env)).toEqual({
      desktopParent: { protocolVersion: 1, nonce: env.ORCA_ADE_PARENT_NONCE }
    })
    for (const override of [
      { bind: '0.0.0.0' },
      { port: 6767 },
      { noPairing: true },
      { mobilePairing: true },
      { grantDesktopControl: true },
      { json: false }
    ]) {
      expect(() => desktopParentHandshake({ ...options, ...override }, env)).toThrow()
    }
    expect(() => desktopParentHandshake(options, {})).toThrow()
  })

  it('stops only its owned runtime when the parent pipe closes', async () => {
    const input = new PassThrough()
    const stop = vi.fn()
    watchDesktopParent(input, stop)
    input.end()
    await new Promise<void>((resolve) => input.once('end', resolve))
    input.emit('error', new Error('already closed'))
    expect(stop).toHaveBeenCalledExactlyOnceWith()
  })
})
