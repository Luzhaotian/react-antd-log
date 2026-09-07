import { afterEach, describe, expect, it } from 'vitest'
import {
  clearAIConfigKey,
  getSavedAIConfig,
  saveAIConfig,
} from '@/utils/aiConfig'

describe('aiConfig', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('未配置时返回 null', () => {
    expect(getSavedAIConfig()).toBeNull()
  })

  it('保存偏好与 apiKey 到不同存储', () => {
    saveAIConfig({
      provider: 'deepseek',
      baseUrl: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      apiKey: 'sk-test',
    })

    expect(JSON.parse(localStorage.getItem('ai-resume-config-prefs')!)).toMatchObject({
      provider: 'deepseek',
      model: 'deepseek-chat',
    })
    expect(sessionStorage.getItem('ai-resume-api-key')).toBe('sk-test')
    expect(localStorage.getItem('ai-resume-api-key')).toBeNull()

    expect(getSavedAIConfig()).toEqual({
      provider: 'deepseek',
      baseUrl: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      apiKey: 'sk-test',
    })
  })

  it('空 apiKey 会清除 session 中的 key', () => {
    saveAIConfig({ provider: 'openai', model: 'gpt-4o', apiKey: 'sk-1' })
    saveAIConfig({ provider: 'openai', model: 'gpt-4o', apiKey: '' })
    expect(sessionStorage.getItem('ai-resume-api-key')).toBeNull()
    expect(getSavedAIConfig()?.apiKey).toBe('')
  })

  it('clearAIConfigKey 只清 key', () => {
    saveAIConfig({ provider: 'openai', model: 'm', apiKey: 'sk-1' })
    clearAIConfigKey()
    expect(getSavedAIConfig()?.provider).toBe('openai')
    expect(getSavedAIConfig()?.apiKey).toBe('')
  })

  it('迁移旧版 localStorage 一体配置', () => {
    localStorage.setItem(
      'ai-resume-config',
      JSON.stringify({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'legacy-key',
        baseUrl: 'https://api.openai.com/v1',
      })
    )

    const cfg = getSavedAIConfig()
    expect(cfg).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'legacy-key',
    })
    expect(localStorage.getItem('ai-resume-config')).toBeNull()
    expect(sessionStorage.getItem('ai-resume-api-key')).toBe('legacy-key')
  })
})
