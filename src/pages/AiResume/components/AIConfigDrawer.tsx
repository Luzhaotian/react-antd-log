import { useState, useCallback } from 'react'
import { Drawer, Button, Input, Select, Space, message, Tag } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons'
import type { ResumeAIConfig, ResumeModelInfo } from '@/types'
import { AI_PROVIDERS, fetchModels } from '../services/aiService'

interface AIConfigDrawerProps {
  open: boolean
  onClose: () => void
  config: ResumeAIConfig | null
  onConfigChange: (config: ResumeAIConfig) => void
}

export default function AIConfigDrawer({
  open,
  onClose,
  config,
  onConfigChange,
}: AIConfigDrawerProps) {
  const [provider, setProvider] = useState<string>(config?.provider || 'openai')
  const [apiKey, setApiKey] = useState(config?.apiKey || '')
  const [model, setModel] = useState(config?.model || '')
  const [customBaseUrl, setCustomBaseUrl] = useState(config?.baseUrl || '')
  const [showKey, setShowKey] = useState(false)

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
      if (list.length > 0 && !model) {
        setModel(list[0].id)
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取模型列表失败')
    } finally {
      setLoadingModels(false)
    }
  }, [apiKey, effectiveBaseUrl, model])

  const handleSave = () => {
    if (!apiKey.trim() || !model) {
      message.warning('请填写 API Key 并选择模型')
      return
    }

    const newConfig: ResumeAIConfig = {
      provider: provider as ResumeAIConfig['provider'],
      apiKey: apiKey.trim(),
      model,
      baseUrl: provider === 'custom' ? customBaseUrl.trim() : undefined,
    }

    localStorage.setItem('ai-resume-config', JSON.stringify(newConfig))
    onConfigChange(newConfig)
    message.success('AI 配置已保存')
    onClose()
  }

  return (
    <Drawer
      title="🤖 AI 配置"
      width={480}
      open={open}
      onClose={onClose}
      destroyOnClose={false}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave} disabled={!apiKey.trim() || !model}>
            保存配置
          </Button>
        </Space>
      }
    >
      <div className="ai-config-drawer-content">
        {/* 服务商选择 */}
        <div className="form-group">
          <label className="form-label">选择 AI 服务商</label>
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
            <label className="form-label">API Base URL</label>
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
          <label className="form-label">API Key</label>
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
          <label className="form-label">
            模型
            {models.length > 0 && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {models.length} 个可用
              </Tag>
            )}
          </label>
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
            notFoundContent={loadingModels ? '加载中...' : '请先获取模型列表'}
          />
        </div>

        <p className="security-note">🔒 API Key 仅保存在本地浏览器中，不会上传到任何服务器</p>
      </div>
    </Drawer>
  )
}
