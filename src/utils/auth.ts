const LOGIN_STATUS_KEY = 'isLoggedIn'
const AUTH_TOKEN_KEY = 'token'
const AUTH_USERNAME_KEY = 'username'

export const DEFAULT_ACCOUNT = 'admin'
export const DEFAULT_PASSWORD = '123456'

export function validateCredentials(account: string, password: string) {
  return account === DEFAULT_ACCOUNT && password === DEFAULT_PASSWORD
}

export function isLoggedIn() {
  const status = localStorage.getItem(LOGIN_STATUS_KEY) === 'true'
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  return status || Boolean(token)
}

export function setLoginStatus(loggedIn: boolean) {
  localStorage.setItem(LOGIN_STATUS_KEY, String(loggedIn))
}

export function setAuthSession(token: string, username: string) {
  setLoginStatus(true)
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USERNAME_KEY, username)
}

export function clearAuthSession() {
  setLoginStatus(false)
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USERNAME_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthUsername() {
  return localStorage.getItem(AUTH_USERNAME_KEY) || DEFAULT_ACCOUNT
}
