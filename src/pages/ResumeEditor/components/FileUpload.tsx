import { useState, useCallback, useRef } from 'react'
import {
  Button,
  Card,
  Space,
  message,
  Progress,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
} from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { parseFile, getFileIcon, getSupportedExtensions } from '../services/fileParser'
import {
  parseResumeWithAI,
  getSavedAIConfig,
  saveAIConfig,
  type AIResumeConfig,
} from '../services/aiService'
import type { ResumeData } from '../types'

const { Text, Paragraph } = Typography

interface FileUploadProps {
  onImport: (data: Partial<ResumeData>) => void
}

type UploadStatus = 'idle' | 'parsing' | 'extracting' | 'done' | 'error'

interface AIConfigFormValues {
  provider: AIResumeConfig['provider']
  apiKey: string
  baseUrl?: string
  model: string
}

export default function FileUpload({ onImport }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string>('')
  const [parsedContent, setParsedContent] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [aiConfig, setAiConfig] = useState<AIResumeConfig | null>(getSavedAIConfig)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAIParse = useCallback(
    async (content: string, type: string, config: AIResumeConfig) => {
      try {
        setProgress(60)
        const resumeData = await parseResumeWithAI(config, content, type)
        setProgress(100)
        setStatus('done')
        message.success('简历数据解析成功')
        onImport(resumeData)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'AI 解析失败')
      }
    },
    [onImport]
  )

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile)
      setError('')
      setStatus('parsing')
      setProgress(20)

      try {
        const result = await parseFile(selectedFile)
        setParsedContent(result.text)
        setFileType(result.fileType)
        setStatus('extracting')
        setProgress(50)

        // If it's a JSON with direct resume data structure, try to import directly
        if (result.fileType === 'json') {
          try {
            const jsonData = JSON.parse(result.text)
            if (jsonData.basic || jsonData.personalInfo) {
              // Direct import
              setProgress(100)
              setStatus('done')
              message.success('JSON 文件解析成功，正在导入...')
              onImport(jsonData as Partial<ResumeData>)
              return
            }
          } catch {
            // Not valid JSON, continue with AI parsing
          }
        }

        // Use AI to parse the content
        if (!aiConfig?.apiKey) {
          setStatus('error')
          setError('请先配置 AI 服务以解析文件内容')
          setConfigModalOpen(true)
          return
        }

        await handleAIParse(result.text, result.fileType, aiConfig)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : '文件解析失败')
      }
    },
    [aiConfig, onImport, handleAIParse]
  )

  const handleRetry = useCallback(() => {
    if (file && parsedContent && aiConfig) {
      setStatus('extracting')
      setError('')
      handleAIParse(parsedContent, fileType, aiConfig)
    }
  }, [file, parsedContent, fileType, aiConfig, handleAIParse])

  const handleReset = useCallback(() => {
    setFile(null)
    setStatus('idle')
    setError('')
    setParsedContent('')
    setFileType('')
    setProgress(0)
  }, [])

  const handleConfigSave = useCallback(
    (values: AIConfigFormValues) => {
      const config: AIResumeConfig = {
        provider: values.provider,
        apiKey: values.apiKey,
        baseUrl: values.baseUrl,
        model: values.model,
      }
      setAiConfig(config)
      saveAIConfig(config)
      setConfigModalOpen(false)
      message.success('AI 配置已保存')

      // If we have parsed content, retry with new config
      if (parsedContent && fileType) {
        setStatus('extracting')
        setError('')
        handleAIParse(parsedContent, fileType, config)
      }
    },
    [parsedContent, fileType, handleAIParse]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileSelect(selectedFile)
      }
    },
    [handleFileSelect]
  )

  const getStatusIcon = () => {
    switch (status) {
      case 'parsing':
      case 'extracting':
        return <LoadingOutlined spin style={{ fontSize: 24, color: '#1890ff' }} />
      case 'done':
        return <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
      case 'error':
        return <DeleteOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
      default:
        return <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'parsing':
        return '正在解析文件...'
      case 'extracting':
        return '正在使用 AI 提取简历信息...'
      case 'done':
        return '解析完成'
      case 'error':
        return error || '解析失败'
      default:
        return '拖拽文件到此处，或点击选择文件'
    }
  }

  return (
    <>
      <Card
        title={
          <Space>
            <RobotOutlined />
            <span>导入简历</span>
          </Space>
        }
        extra={
          <Button icon={<SettingOutlined />} onClick={() => setConfigModalOpen(true)}>
            AI 配置
          </Button>
        }
      >
        <div
          style={{
            border: '2px dashed #d9d9d9',
            borderRadius: 8,
            padding: '40px 20px',
            textAlign: 'center',
            cursor: status === 'idle' ? 'pointer' : 'default',
            background: status === 'idle' ? '#fafafa' : '#fff',
            borderColor: status === 'done' ? '#52c41a' : status === 'error' ? '#ff4d4f' : '#d9d9d9',
            transition: 'all 0.3s',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={status === 'idle' ? handleClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getSupportedExtensions()}
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />

          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {getStatusIcon()}

            <div>
              <Text strong style={{ fontSize: 16 }}>
                {getStatusText()}
              </Text>
              {status === 'idle' && (
                <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                  支持格式：JSON、PDF、Word (.docx)、Markdown (.md)、TXT
                </Paragraph>
              )}
            </div>

            {file && (
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span style={{ fontSize: 20 }}>{getFileIcon(file.name)}</span>
                <Text>{file.name}</Text>
                <Tag color="blue">{fileType.toUpperCase()}</Tag>
              </div>
            )}

            {(status === 'parsing' || status === 'extracting') && (
              <Progress
                percent={progress}
                status="active"
                style={{ maxWidth: 300, margin: '0 auto' }}
              />
            )}

            {status === 'error' && (
              <Space>
                <Button type="primary" onClick={handleRetry}>
                  重试
                </Button>
                <Button onClick={handleReset}>重新选择</Button>
              </Space>
            )}

            {status === 'done' && <Button onClick={handleReset}>导入其他文件</Button>}
          </Space>
        </div>

        {status === 'idle' && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              提示：如果导入 JSON 格式的简历数据，将直接导入无需 AI 解析。其他格式将使用 AI
              自动提取简历信息。
            </Text>
          </div>
        )}
      </Card>

      {/* AI Config Modal */}
      <Modal
        title="AI 配置"
        open={configModalOpen}
        onCancel={() => setConfigModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{
            provider: aiConfig?.provider || 'deepseek',
            apiKey: aiConfig?.apiKey || '',
            baseUrl: aiConfig?.baseUrl || '',
            model: aiConfig?.model || '',
          }}
          onFinish={handleConfigSave}
        >
          <Form.Item label="AI 服务商" name="provider">
            <Select
              options={[
                { value: 'openai', label: 'OpenAI' },
                { value: 'deepseek', label: 'DeepSeek' },
                { value: 'custom', label: '自定义 (OpenAI 兼容)' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="API Key"
            name="apiKey"
            rules={[{ required: true, message: '请输入 API Key' }]}
          >
            <Input.Password placeholder="输入您的 API Key" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.provider !== cur.provider}>
            {({ getFieldValue }) =>
              getFieldValue('provider') === 'custom' && (
                <Form.Item
                  label="API Base URL"
                  name="baseUrl"
                  rules={[{ required: true, message: '请输入 API Base URL' }]}
                >
                  <Input placeholder="https://api.example.com/v1" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item label="模型" name="model">
            <Input placeholder="如：gpt-4o-mini、deepseek-chat" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存配置
              </Button>
              <Button onClick={() => setConfigModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
