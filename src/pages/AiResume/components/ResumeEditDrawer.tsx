import { useState, useCallback, useRef, useEffect } from 'react'
import { Drawer, Button, Input, Tabs, message, Space, Tag, Modal } from 'antd'
import { RocketOutlined, FileTextOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons'
import type { ResumeItem, ResumeAIConfig, ResumeTemplate, ResumeData } from '@/types'
import { resumeTemplates, getResumeTemplateById } from '../templates'
import { parseResumeWithAI } from '../services/aiService'
import { renderResume } from '../services/resumeRenderer'
import FileUploader from './FileUploader'

const { TextArea } = Input

interface ResumeEditDrawerProps {
  open: boolean
  onClose: () => void
  resume: ResumeItem | null
  defaultTemplateId?: string
  aiConfig: ResumeAIConfig | null
  onSave: (resume: ResumeItem) => void
  onPreview: (resume: ResumeItem) => void
}

const SAMPLE_MARKDOWN = `# 张三

📧 zhangsan@email.com | 📱 138-0000-0000 | 📍 北京市朝阳区 | 💻 github.com/zhangsan

## 个人简介

拥有5年全栈开发经验的软件工程师，专注于 React、Node.js 和云原生技术。

## 工作经历

### 高级前端工程师 | 字节跳动
**2022年3月 - 至今** | 北京

- 负责抖音 Web 端核心功能开发，日活用户超过 1 亿
- 主导前端性能优化项目，页面加载速度提升 40%

### 前端工程师 | 阿里巴巴
**2019年7月 - 2022年2月** | 杭州

- 参与淘宝商家后台系统开发，服务百万级商家
- 使用 React + TypeScript 构建复杂表单系统

## 教育背景

### 北京大学 | 硕士 · 计算机科学与技术
**2017年9月 - 2019年6月**
GPA: 3.8/4.0

## 专业技能

- React / Vue / TypeScript
- Node.js / Express
- Docker / Kubernetes
- Git / CI/CD
`

/** 用示例数据渲染模板预览 */
const PREVIEW_SAMPLE: ResumeData = {
  personalInfo: {
    name: '张三',
    title: '高级前端工程师',
    email: 'zhangsan@email.com',
    phone: '138-0000-0000',
    location: '北京市朝阳区',
  },
  summary: '拥有5年全栈开发经验的软件工程师，专注于 React、Node.js 和云原生技术。',
  experience: [
    {
      company: '字节跳动',
      position: '高级前端工程师',
      startDate: '2022-03',
      endDate: '至今',
      location: '北京',
      description: '',
      highlights: ['负责抖音 Web 端核心功能开发', '主导前端性能优化，页面加载速度提升 40%'],
    },
  ],
  education: [
    {
      school: '北京大学',
      degree: '硕士',
      major: '计算机科学与技术',
      startDate: '2017-09',
      endDate: '2019-06',
      gpa: '3.8/4.0',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Docker'],
  projects: [],
  languages: ['中文', '英文'],
}

function TemplatePreviewModal({
  open,
  onClose,
  template,
}: {
  open: boolean
  onClose: () => void
  template: ResumeTemplate | null
}) {
  if (!template) return null
  const html = renderResume(PREVIEW_SAMPLE, template)
  return (
    <Modal
      title={`预览模板：${template.name}`}
      open={open}
      onCancel={onClose}
      width={860}
      footer={null}
      destroyOnClose
    >
      <div className="template-preview-wrapper">
        <iframe
          className="template-preview-frame"
          srcDoc={html}
          title="模板预览"
          sandbox="allow-same-origin"
        />
      </div>
    </Modal>
  )
}

export default function ResumeEditDrawer({
  open,
  onClose,
  resume,
  defaultTemplateId,
  aiConfig,
  onSave,
  onPreview,
}: ResumeEditDrawerProps) {
  const [name, setName] = useState(resume?.name || '未命名简历')
  const [templateId, setTemplateId] = useState(resume?.templateId || defaultTemplateId || 'modern')
  const [markdownContent, setMarkdownContent] = useState(resume?.markdownContent || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const [previewTpl, setPreviewTpl] = useState<ResumeTemplate | null>(null)

  // 用 ref 同步最新 markdown，避免 useCallback 闭包陈旧
  const mdRef = useRef(markdownContent)
  mdRef.current = markdownContent

  // 追踪上传的文件内容
  const uploadedRef = useRef<string | null>(null)

  const selectedTemplate = getResumeTemplateById(templateId)

  // 打开时根据 resume prop 同步状态
  useEffect(() => {
    if (open) {
      if (resume) {
        setName(resume.name)
        setTemplateId(resume.templateId)
        setMarkdownContent(resume.markdownContent || '')
        mdRef.current = resume.markdownContent || ''
      } else {
        setName('未命名简历')
        setTemplateId(defaultTemplateId || 'modern')
        setMarkdownContent('')
        mdRef.current = ''
      }
      uploadedRef.current = null
      setIsGenerating(false)
      setActiveTab('edit')
      setPreviewTpl(null)
    }
  }, [open, resume, defaultTemplateId])

  const resetState = useCallback(() => {
    setName('未命名简历')
    setTemplateId(defaultTemplateId || 'modern')
    setMarkdownContent('')
    setIsGenerating(false)
    setActiveTab('edit')
    setPreviewTpl(null)
    mdRef.current = ''
    uploadedRef.current = null
  }, [defaultTemplateId])

  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [resetState, onClose])

  const handleFileUpload = useCallback((content: string) => {
    setMarkdownContent(content)
    mdRef.current = content
    uploadedRef.current = content
    setActiveTab('edit')
    message.success(`文件内容已加载，共 ${content.length} 字符`)
  }, [])

  const handleGenerate = useCallback(async () => {
    const md = mdRef.current
    if (!aiConfig) {
      message.warning('请先配置 AI API Key')
      return
    }
    if (!md.trim()) {
      message.warning('请先输入或上传 Markdown 内容')
      return
    }

    setIsGenerating(true)
    try {
      const data = await parseResumeWithAI(aiConfig, md)
      const now = Date.now()
      const resumeItem: ResumeItem = {
        id: resume?.id || `resume_${now}`,
        name,
        templateId,
        markdownContent: md,
        resumeData: data,
        createdAt: resume?.createdAt || now,
        updatedAt: now,
      }
      onSave(resumeItem)
      message.success('简历生成成功')
      onPreview(resumeItem)
    } catch (err) {
      message.error(err instanceof Error ? err.message : '生成简历失败')
    } finally {
      setIsGenerating(false)
    }
  }, [aiConfig, name, templateId, resume, onSave, onPreview])

  const handleSaveOnly = useCallback(() => {
    const md = mdRef.current
    const now = Date.now()
    const resumeItem: ResumeItem = {
      id: resume?.id || `resume_${now}`,
      name,
      templateId,
      markdownContent: md,
      resumeData: resume?.resumeData || null,
      createdAt: resume?.createdAt || now,
      updatedAt: now,
    }
    onSave(resumeItem)
    message.success('已保存')
    handleClose()
  }, [name, templateId, resume, onSave, handleClose])

  return (
    <>
      <Drawer
        title={resume ? '编辑简历' : '新建简历'}
        width={720}
        open={open}
        onClose={handleClose}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleSaveOnly} disabled={!name.trim()}>
              仅保存
            </Button>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!aiConfig || !name.trim()}
            >
              {isGenerating ? 'AI 生成中...' : 'AI 生成并预览'}
            </Button>
          </Space>
        }
      >
        <div className="resume-edit-drawer-content">
          {/* 基本信息 */}
          <div className="form-group">
            <label className="form-label">简历名称</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入简历名称"
              maxLength={50}
            />
          </div>

          {/* 模板选择 */}
          <div className="form-group">
            <label className="form-label">
              选择模板
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {selectedTemplate.name}
              </Tag>
            </label>
            <div className="template-selector-grid">
              {resumeTemplates.map(t => (
                <div
                  key={t.id}
                  className={`template-selector-item ${templateId === t.id ? 'active' : ''}`}
                  onClick={() => setTemplateId(t.id)}
                >
                  <div className="template-thumb" style={{ borderColor: t.primaryColor }}>
                    <div className="template-thumb-header" style={{ background: t.primaryColor }} />
                    <div className="template-thumb-body">
                      <div className="template-thumb-line" />
                      <div className="template-thumb-line short" />
                      <div className="template-thumb-line" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="template-thumb-name">{t.name}</span>
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={e => {
                        e.stopPropagation()
                        setPreviewTpl(t)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 内容输入 */}
          <div className="form-group">
            <label className="form-label">简历内容</label>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'upload',
                  label: (
                    <span>
                      <UploadOutlined /> 上传文件
                    </span>
                  ),
                  children: <FileUploader onFileUpload={handleFileUpload} />,
                },
                {
                  key: 'edit',
                  label: (
                    <span>
                      <FileTextOutlined /> 编辑内容
                    </span>
                  ),
                  children: (
                    <div>
                      <div
                        style={{
                          marginBottom: 8,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => {
                            const content = uploadedRef.current || SAMPLE_MARKDOWN
                            setMarkdownContent(content)
                            mdRef.current = content
                          }}
                        >
                          {uploadedRef.current ? '加载上传文件' : '加载示例'}
                        </Button>
                        <span className="char-count">
                          字符: {markdownContent.length} | 行数:{' '}
                          {markdownContent.split('\n').length}
                        </span>
                      </div>
                      <TextArea
                        value={markdownContent}
                        onChange={e => {
                          setMarkdownContent(e.target.value)
                          mdRef.current = e.target.value
                        }}
                        placeholder="在此输入或粘贴您的 Markdown 简历内容..."
                        autoSize={{ minRows: 12, maxRows: 24 }}
                        spellCheck={false}
                        style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Drawer>

      <TemplatePreviewModal
        open={!!previewTpl}
        onClose={() => setPreviewTpl(null)}
        template={previewTpl}
      />
    </>
  )
}
