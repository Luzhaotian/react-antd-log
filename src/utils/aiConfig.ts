/** AI 配置：非敏感偏好存 localStorage，apiKey 仅存 sessionStorage */

const PREFS_KEY = 'ai-resume-config-prefs'
const KEY_SESSION = 'ai-resume-api-key'
const LEGACY_KEY = 'ai-resume-config'

export interface AIConfigPrefs {
  provider: string
  baseUrl?: string
  model?: string
}

export interface AIConfigStored extends AIConfigPrefs {
  apiKey: string
}

function migrateLegacy(): AIConfigStored | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const old = JSON.parse(raw) as Partial<AIConfigStored>
    const prefs: AIConfigPrefs = {
      provider: old.provider || 'openai',
      baseUrl: old.baseUrl,
      model: old.model || '',
    }
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    if (old.apiKey) {
      sessionStorage.setItem(KEY_SESSION, old.apiKey)
    }
    localStorage.removeItem(LEGACY_KEY)
    return { ...prefs, apiKey: old.apiKey || '' }
  } catch {
    return null
  }
}

export function getSavedAIConfig(): AIConfigStored | null {
  migrateLegacy()
  try {
    const prefsRaw = localStorage.getItem(PREFS_KEY)
    const apiKey = sessionStorage.getItem(KEY_SESSION) || ''
    if (!prefsRaw && !apiKey) return null
    const prefs = prefsRaw
      ? (JSON.parse(prefsRaw) as AIConfigPrefs)
      : { provider: 'openai', model: '' }
    return {
      provider: prefs.provider || 'openai',
      apiKey,
      baseUrl: prefs.baseUrl,
      model: prefs.model || '',
    }
  } catch {
    return null
  }
}

export function saveAIConfig(config: AIConfigStored): void {
  const prefs: AIConfigPrefs = {
    provider: config.provider || 'openai',
    baseUrl: config.baseUrl,
    model: config.model || '',
  }
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  if (config.apiKey) {
    sessionStorage.setItem(KEY_SESSION, config.apiKey)
  } else {
    sessionStorage.removeItem(KEY_SESSION)
  }
  localStorage.removeItem(LEGACY_KEY)
}

export function clearAIConfigKey(): void {
  sessionStorage.removeItem(KEY_SESSION)
}
