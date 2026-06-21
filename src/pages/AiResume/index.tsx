import { useState, useCallback, useEffect } from 'react'
import { Steps, Button, message } from 'antd'
import {
  UploadOutlined,
  SettingOutlined,
  EyeOutlined,
  RocketOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import type { ResumeAIConfig, ResumeData, ResumeTemplate } from '@/types'
import { resumeTemplates } from './templates'
import { parseResumeWithAI } from './services/aiService'
import FileUploader from './components/FileUploader'
import APIKeyInput from './components/APIKeyInput'
import TemplateSelector from './components/TemplateSelector'
import ResumePreview from './components/ResumePreview'
import MarkdownEditor from './components/MarkdownEditor'
import './index.css'

type StepKey = 'upload' | 'configure' | 'preview'

const stepItems = [
  { title: '上传内容', icon: <UploadOutlined /> },
  { title: '配置生成', icon: <SettingOutlined /> },
  { title: '预览导出', icon: <EyeOutlined /> },
]

export default function AiResume() {
  const [step, setStep] = useState<StepKey>('upload')
  const [markdownContent, setMarkdownContent] = useState('')
  const [aiConfig, setAiConfig] = useState<ResumeAIConfig | null>(() => {
    const saved = localStorage.getItem('ai-resume-config')
    return saved ? JSON.parse(saved) : null
  })
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeTemplates[0])
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 从 localStorage 恢复模板选择
  useEffect(() => {
    const savedTemplate = localStorage.getItem('ai-resume-template')
    if (savedTemplate) {
      const t = resumeTemplates.find(tt => tt.id === savedTemplate)
      if (t) setSelectedTemplate(t)
    }
  }, [])

  // 保存模板选择
  useEffect(() => {
    localStorage.setItem('ai-resume-template', selectedTemplate.id)
  }, [selectedTemplate])

  const handleFileUpload = useCallback((content: string) => {
    setMarkdownContent(content)
    setResumeData(null)
    setStep('configure')
  }, [])

  const handleConfigChange = useCallback((config: ResumeAIConfig) => {
    setAiConfig(config)
  }, [])

  const handleTemplateChange = useCallback((template: ResumeTemplate) => {
    setSelectedTemplate(template)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!aiConfig) {
      message.warning('请先配置 AI API Key')
      return
    }
    if (!markdownContent.trim()) {
      message.warning('请先上传或输入 Markdown 内容')
      return
    }

    setIsProcessing(true)

    try {
      const data = await parseResumeWithAI(aiConfig, markdownContent)
      setResumeData(data)
      setStep('preview')
    } catch (err) {
      const message_text = err instanceof Error ? err.message : '生成简历时发生错误'
      message.error(message_text)
    } finally {
      setIsProcessing(false)
    }
  }, [aiConfig, markdownContent])

  const handleRegenerate = useCallback(async () => {
    await handleGenerate()
  }, [handleGenerate])

  const handleMarkdownChange = useCallback((content: string) => {
    setMarkdownContent(content)
  }, [])

  const currentStepIndex = step === 'upload' ? 0 : step === 'configure' ? 1 : 2

  return (
    <div className="ai-resume-page">
      {/* Steps Indicator */}
      <div className="ai-resume-steps">
        <Steps
          current={currentStepIndex}
          items={stepItems.map((item, index) => ({
            ...item,
            status:
              index < currentStepIndex ? 'finish' : index === currentStepIndex ? 'process' : 'wait',
          }))}
        />
      </div>

      {/* Main Content */}
      <div className="ai-resume-main">
        {step === 'upload' && (
          <div className="step-content upload-step">
            <div className="upload-section">
              <FileUploader onFileUpload={handleFileUpload} />
              <div className="divider-text">
                <span>或者</span>
              </div>
              <div className="manual-input">
                <Button
                  size="large"
                  icon={<SettingOutlined />}
                  onClick={() => {
                    setStep('configure')
                    if (!markdownContent) {
                      setMarkdownContent('')
                    }
                  }}
                >
                  ✏️ 直接输入 Markdown 内容
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="step-content configure-step">
            <div className="configure-grid">
              <div className="configure-left">
                <MarkdownEditor
                  initialContent={markdownContent}
                  onContentChange={handleMarkdownChange}
                  onRegenerate={handleGenerate}
                  isProcessing={isProcessing}
                />
              </div>
              <div className="configure-right">
                <APIKeyInput onConfigChange={handleConfigChange} savedConfig={aiConfig} />
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                />
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<RocketOutlined />}
                  onClick={handleGenerate}
                  loading={isProcessing}
                  disabled={!aiConfig || !markdownContent.trim()}
                >
                  {isProcessing ? 'AI 生成中...' : '🚀 生成简历'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="step-content preview-step">
            <div className="preview-grid">
              <div className="preview-left">
                <MarkdownEditor
                  initialContent={markdownContent}
                  onContentChange={handleMarkdownChange}
                  onRegenerate={handleRegenerate}
                  isProcessing={isProcessing}
                />
                <div className="preview-config-bar">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={handleTemplateChange}
                  />
                  <Button
                    type="primary"
                    block
                    icon={<RocketOutlined />}
                    onClick={handleRegenerate}
                    loading={isProcessing}
                    disabled={!aiConfig}
                  >
                    {isProcessing ? '⏳ 重新生成中...' : '🔄 重新生成'}
                  </Button>
                  <Button
                    block
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      setStep('configure')
                      setResumeData(null)
                    }}
                  >
                    ← 返回配置
                  </Button>
                </div>
              </div>
              <div className="preview-right">
                <ResumePreview
                  resumeData={resumeData}
                  template={selectedTemplate}
                  isLoading={isProcessing}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
