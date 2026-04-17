import { post } from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginData {
  token: string
  username: string
}

export async function login(params: LoginParams): Promise<LoginData> {
  return post<LoginData>('/api/auth/login', params)
}
