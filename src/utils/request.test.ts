import { afterEach, describe, expect, it, vi } from 'vitest'
import { RequestError, request } from '@/utils/request'
import { clearAuthSession, setAuthSession } from '@/utils/auth'

describe('request', () => {
  afterEach(() => {
    clearAuthSession()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('成功解析 JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ ok: true }),
        text: async () => '',
      })
    )

    const data = await request<{ ok: boolean }>('/fundapi/ping')
    expect(data.ok).toBe(true)
  })

  it('对本站 /api 附加 Bearer', async () => {
    setAuthSession('abc', 'u')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({}),
      text: async () => '',
    })
    vi.stubGlobal('fetch', fetchMock)

    await request('/api/users')
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = new Headers(init.headers)
    expect(headers.get('Authorization')).toBe('Bearer abc')
  })

  it('超时抛出 RequestError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      })
    )

    await expect(request('/api/slow', { timeoutMs: 20 })).rejects.toMatchObject({
      name: 'RequestError',
      status: 408,
    } satisfies Partial<RequestError>)
  })
})
