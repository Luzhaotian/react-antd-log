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
 * 统一 fetch：自动附带 Authorization；401 时清会话并跳转登录
 */
export async function request<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getAuthToken()
  // 仅对本站 /api 代理附加鉴权，避免第三方接口误带 token / 误清会话
  const isAppApi = url.startsWith('/api') || url.includes(`${window.location.origin}/api`)
  if (isAppApi && token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (init.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...init, headers })

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
