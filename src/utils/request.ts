const SUCCESS_CODE = 200

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(url: string, config?: RequestConfig): Promise<T> {
  const { body, ...init } = config ?? {}
  const headers = new Headers(init.headers)
  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const json = (await res.json()) as ApiResponse<T | null>

  if (!res.ok || json?.code !== SUCCESS_CODE) {
    throw new Error(json?.message || '请求失败')
  }

  return json.data!
}

export function get<T>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>(url, { ...config, method: 'GET' })
}

export function post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>(url, { ...config, method: 'POST', body: data })
}

export function put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return request<T>(url, { ...config, method: 'PUT', body: data })
}

export async function del(url: string, data?: unknown, config?: RequestConfig): Promise<void> {
  await request<null>(url, { ...config, method: 'DELETE', body: data })
}
