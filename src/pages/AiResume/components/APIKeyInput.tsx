import { useState, useCallback } from 'react'
import { Button, Input, Select, Space, message } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons'
import type { ResumeAIConfig } from '@/types'
import { AI_PROVIDERS, fetchModels } from '../services/aiService'
import type { ResumeModelInfo } from '@/types'

interface APIKeyInputProps {
  onConfigChange: (config: ResumeAIConfig) => void
  savedConfig: ResumeAIConfig | null
}

export default function APIKeyInput({ onConfigChange, savedConfig }: APIKeyInputProps) {
  const [provider, setProvider] = useState<string>(savedConfig?.provider || 'openai')
  const [apiKey, setApiKey] = useState(savedConfig?.apiKey || '')
  const [model, setModel] = useState(savedConfig?.model || '')
  const [customBaseUrl, setCustomBaseUrl] = useState(savedConfig?.baseUrl || '')
  const [showKey, setShowKey] = useState(false)

  // 模型列表相关
  const [models, setModels] = useState<ResumeModelInfo[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  const currentProvider = AI_PROVIDERS.find(p => p.id === provider)
  const effectiveBaseUrl =
    provider === 'custom' ? customBaseUrl.trim() : currentProvider?.baseUrl || ''

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider)
    const p = AI_PROVIDERS.find(pp => pp.id === newProvider)
    if (p) {
      setModel(p.defaultModel)
    }
    setModels([])
  }

  const handleFetchModels = useCallback(async () => {
    if (!apiKey.trim() || !effectiveBaseUrl) return
    setLoadingModels(true)
    setModels([])
    try {
      const list = await fetchModels(apiKey.trim(), effectiveBaseUrl)
      setModels(list)
      // 自动选中第一个模型
      if (list.length > 0) {
        setModel(list[0].id)
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取模型列表失败')
    } finally {
      setLoadingModels(false)
    }
  }, [apiKey, effectiveBaseUrl])

  const handleSave = () => {
    if (!apiKey.trim() || !model) return

    const config: ResumeAIConfig = {
      provider: provider as ResumeAIConfig['provider'],
      apiKey: apiKey.trim(),
      model,
      baseUrl: provider === 'custom' ? customBaseUrl.trim() : undefined,
    }

    localStorage.setItem('ai-resume-config', JSON.stringify(config))
    onConfigChange(config)
    message.success('配置已保存')
  }

  return (
    <div className="ai-resume-api-config">
      <h3 className="component-title">🤖 AI 配置</h3>
      <p className="component-desc">配置 AI API 以智能解析您的简历内容</p>

      {/* 服务商选择 */}
      <div className="form-group">
        <label>选择 AI 服务商</label>
        <div className="provider-grid">
          {AI_PROVIDERS.map(p => (
            <Button
              key={p.id}
              type={provider === p.id ? 'primary' : 'default'}
              onClick={() => handleProviderChange(p.id)}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Base URL (仅自定义) */}
      {provider === 'custom' && (
        <div className="form-group">
          <label>API Base URL</label>
          <Input
            value={customBaseUrl}
            onChange={e => {
              setCustomBaseUrl(e.target.value)
              setModels([])
            }}
            placeholder="https://your-api-endpoint.com/v1"
          />
        </div>
      )}

      {/* API Key */}
      <div className="form-group">
        <label>API Key</label>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => {
              setApiKey(e.target.value)
              setModels([])
            }}
            placeholder={currentProvider?.placeholder || '输入 API Key'}
            suffix={
              <span
                onClick={() => setShowKey(!showKey)}
                style={{ cursor: 'pointer', color: '#999' }}
              >
                {showKey ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            }
          />
          <Button
            icon={<SyncOutlined spin={loadingModels} />}
            onClick={handleFetchModels}
            disabled={!apiKey.trim() || !effectiveBaseUrl || loadingModels}
          >
            {loadingModels ? '获取中...' : '获取模型'}
          </Button>
        </Space.Compact>
      </div>

      {/* 模型列表 */}
      <div className="form-group">
        <label>模型</label>
        <Select
          value={model || undefined}
          onChange={val => setModel(val)}
          placeholder={loadingModels ? '加载中...' : '请先获取模型列表'}
          style={{ width: '100%' }}
          disabled={models.length === 0 && !loadingModels}
          options={models.map(m => ({ label: m.id, value: m.id }))}
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
        />
        {models.length > 0 && <p className="model-count">共 {models.length} 个可用模型</p>}
      </div>

      {/* 保存 */}
      <Button type="primary" block onClick={handleSave} disabled={!apiKey.trim() || !model}>
        💾 保存配置
      </Button>

      <p className="security-note">🔒 API Key 仅保存在本地浏览器中，不会上传到任何服务器</p>
    </div>
  )
}
