import { clearAuthSession, getAuthToken } from '@/utils/auth'

export class RequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'RequestError'
    this.status = status
  }
}

function redirectToLogin() {
  const useHash = import.meta.env.VITE_HASH_ROUTER === 'true'
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  if (useHash) {
    window.location.hash = '#/login'
    return
  }
  window.location.assign(`${window.location.origin}${base}login`)
}

/**
 * 统一 fetch：自动附带 Authorization；401 时清会话并跳转登录。
 * 支持 AbortSignal；可选 timeoutMs（超时自动 abort）。
 */
export async function request<T = unknown>(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs, ...fetchInit } = init
  const headers = new Headers(fetchInit.headers)
  const token = getAuthToken()
  // 仅对本站 /api 代理附加鉴权，避免第三方接口误带 token / 误清会话
  const isAppApi = url.startsWith('/api') || url.includes(`${window.location.origin}/api`)
  if (isAppApi && token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (fetchInit.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let timedOut = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const controller = timeoutMs != null && timeoutMs > 0 ? new AbortController() : undefined
  if (controller) {
    if (fetchInit.signal) {
      if (fetchInit.signal.aborted) {
        controller.abort(fetchInit.signal.reason)
      } else {
        fetchInit.signal.addEventListener(
          'abort',
          () => controller.abort(fetchInit.signal?.reason),
          {
            once: true,
          }
        )
      }
    }
    timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
  }

  try {
    const res = await fetch(url, {
      ...fetchInit,
      headers,
      signal: controller?.signal ?? fetchInit.signal,
    })

    if (isAppApi && res.status === 401) {
      clearAuthSession()
      redirectToLogin()
      throw new RequestError('未授权，请重新登录', 401)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new RequestError(text || `请求失败 (${res.status})`, res.status)
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return (await res.json()) as T
    }
    return (await res.text()) as T
  } catch (err) {
    if (timedOut) {
      throw new RequestError('请求超时', 408)
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new RequestError('请求已取消', 499)
    }
    throw err
  } finally {
    if (timeoutId != null) clearTimeout(timeoutId)
  }
}

export function get<T = unknown>(url: string, init?: RequestInit) {
  return request<T>(url, { ...init, method: 'GET' })
}

export function post<T = unknown>(url: string, data?: unknown, init?: RequestInit) {
  return request<T>(url, {
    ...init,
    method: 'POST',
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export function put<T = unknown>(url: string, data?: unknown, init?: RequestInit) {
  return request<T>(url, {
    ...init,
    method: 'PUT',
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export function del<T = unknown>(url: string, init?: RequestInit) {
  return request<T>(url, { ...init, method: 'DELETE' })
}
