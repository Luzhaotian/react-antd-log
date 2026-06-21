import { useState, useCallback, useEffect } from 'react'
import { Button, Tag, Space, Modal } from 'antd'
import { PlusOutlined, RobotOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons'
import type { ResumeItem, ResumeAIConfig, ResumeData, ResumeTemplate } from '@/types'
import { resumeTemplates, templateCategories } from '../templates'
import { renderResume } from '../services/resumeRenderer'
import AIConfigDrawer from '../components/AIConfigDrawer'
import ResumeEditDrawer from '../components/ResumeEditDrawer'
import '../index.css'

const STORAGE_KEY = 'ai-resume-list'

const SAMPLE_DATA: ResumeData = {
  personalInfo: {
    name: '张三',
    title: '高级前端工程师',
    email: 'zhangsan@email.com',
    phone: '138-0000-0000',
    location: '北京市朝阳区',
    github: 'https://github.com/zhangsan',
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
      highlights: [
        '负责抖音 Web 端核心功能开发，日活用户超过 1 亿',
        '主导前端性能优化项目，页面加载速度提升 40%',
      ],
    },
    {
      company: '阿里巴巴',
      position: '前端工程师',
      startDate: '2019-07',
      endDate: '2022-02',
      location: '杭州',
      description: '',
      highlights: ['参与淘宝商家后台系统开发'],
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
  skills: ['React', 'TypeScript', 'Node.js', 'Vue', 'Docker', 'Git'],
  projects: [
    {
      name: '组件库 Design Pro',
      role: '技术负责人',
      startDate: '2023-01',
      endDate: '2023-12',
      description: '设计并开发了一套企业级 UI 组件库',
      highlights: ['GitHub Star 2000+'],
      technologies: ['React', 'TypeScript'],
    },
  ],
  languages: ['中文', '英文'],
}

function loadResumes(): ResumeItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveResumes(resumes: ResumeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

/** CSS 缩略图 */
function CssThumb({ template }: { template: ResumeTemplate }) {
  const { primaryColor: c, secondaryColor: c2, style } = template

  if (style === 'sidebar') {
    return (
      <div style={{ display: 'flex', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
        <div
          style={{
            width: '35%',
            background: c,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <div
            style={{ height: 8, width: '60%', background: 'rgba(255,255,255,.7)', borderRadius: 3 }}
          />
          <div
            style={{ height: 5, width: '80%', background: 'rgba(255,255,255,.4)', borderRadius: 3 }}
          />
          <div
            style={{
              height: 4,
              width: '70%',
              background: 'rgba(255,255,255,.3)',
              borderRadius: 3,
              marginTop: 10,
            }}
          />
          <div
            style={{ height: 4, width: '50%', background: 'rgba(255,255,255,.3)', borderRadius: 3 }}
          />
          <div
            style={{ height: 4, width: '60%', background: 'rgba(255,255,255,.3)', borderRadius: 3 }}
          />
        </div>
        <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ height: 5, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
          <div style={{ height: 5, width: '70%', background: '#e8e8e8', borderRadius: 3 }} />
          <div style={{ height: 5, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
          <div style={{ height: 5, width: '60%', background: '#e8e8e8', borderRadius: 3 }} />
        </div>
      </div>
    )
  }

  if (style === 'modern') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 36,
            background: `linear-gradient(135deg,${c},${c2})`,
            borderRadius: '6px 6px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{ height: 8, width: '50%', background: 'rgba(255,255,255,.7)', borderRadius: 3 }}
          />
        </div>
        <div
          style={{ flex: 1, padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
            <div style={{ height: 4, width: '70%', background: '#e8e8e8', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
            <div style={{ height: 4, width: '60%', background: '#e8e8e8', borderRadius: 3 }} />
          </div>
        </div>
      </div>
    )
  }

  if (style === 'creative') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 8, gap: 6 }}>
        <div style={{ borderLeft: `3px solid ${c}`, paddingLeft: 8 }}>
          <div style={{ height: 7, width: '60%', background: c, borderRadius: 3 }} />
          <div
            style={{ height: 4, width: '40%', background: '#ccc', borderRadius: 3, marginTop: 4 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c,
              flexShrink: 0,
              marginTop: 3,
            }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
            <div style={{ height: 4, width: '70%', background: '#e8e8e8', borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c,
              flexShrink: 0,
              marginTop: 3,
            }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '90%', background: '#e8e8e8', borderRadius: 3 }} />
            <div style={{ height: 4, width: '60%', background: '#e8e8e8', borderRadius: 3 }} />
          </div>
        </div>
      </div>
    )
  }

  if (style === 'minimal') {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 10,
          gap: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: c,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          张
        </div>
        <div style={{ height: 5, width: '50%', background: '#333', borderRadius: 3 }} />
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            borderRadius: 6,
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ height: 4, width: '100%', background: '#e0e0e0', borderRadius: 3 }} />
          <div style={{ height: 4, width: '70%', background: '#e0e0e0', borderRadius: 3 }} />
        </div>
      </div>
    )
  }

  // classic
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 8, gap: 6 }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${c}`, paddingBottom: 6 }}>
        <div
          style={{ height: 7, width: '50%', background: c, borderRadius: 3, margin: '0 auto' }}
        />
        <div
          style={{
            height: 4,
            width: '30%',
            background: c2,
            borderRadius: 3,
            margin: '4px auto 0',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 3 }} />
        <div style={{ height: 4, width: '70%', background: '#e8e8e8', borderRadius: 3 }} />
        <div
          style={{
            height: 3,
            width: '100%',
            background: `${c}30`,
            borderRadius: 3,
            margin: '3px 0',
          }}
        />
        <div style={{ height: 4, width: '90%', background: '#e8e8e8', borderRadius: 3 }} />
        <div style={{ height: 4, width: '60%', background: '#e8e8e8', borderRadius: 3 }} />
      </div>
    </div>
  )
}

/** 预览弹窗 */
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
  const html = renderResume(SAMPLE_DATA, template)
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

export default function Templates() {
  const [resumes, setResumes] = useState<ResumeItem[]>(loadResumes)
  const [aiConfig, setAiConfig] = useState<ResumeAIConfig | null>(() => {
    const saved = localStorage.getItem('ai-resume-config')
    return saved ? JSON.parse(saved) : null
  })

  const [configDrawerOpen, setConfigDrawerOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null)

  useEffect(() => {
    saveResumes(resumes)
  }, [resumes])

  const handleUseTemplate = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId)
    setEditDrawerOpen(true)
  }, [])

  const handleSave = useCallback((resume: ResumeItem) => {
    setResumes(prev => {
      const idx = prev.findIndex(r => r.id === resume.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = resume
        return next
      }
      return [resume, ...prev]
    })
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePreview = useCallback((_resume: ResumeItem) => {
    // 生成后不做跳转
  }, [])

  const handleAiConfigChange = useCallback((config: ResumeAIConfig) => {
    setAiConfig(config)
  }, [])

  const filteredTemplates =
    activeCategory === '全部'
      ? resumeTemplates
      : resumeTemplates.filter(t => t.category === activeCategory)

  return (
    <div className="ai-resume-page">
      {/* Hero 区域 */}
      <div className="template-hero">
        <div className="template-hero-content">
          <h1>📄 AI 简历生成器</h1>
          <p>
            选择专业模板，上传或输入您的简历内容，AI 智能解析并生成精美简历。支持 PDF
            导出，助您脱颖而出。
          </p>
          <div className="template-hero-actions">
            <Button
              type="primary"
              ghost
              icon={<RobotOutlined />}
              onClick={() => {
                setConfigDrawerOpen(true)
                setEditDrawerOpen(false)
              }}
              style={{
                background: 'rgba(255,255,255,.15)',
                borderColor: 'rgba(255,255,255,.4)',
                color: '#fff',
              }}
            >
              AI 配置
              {aiConfig && (
                <Tag color="green" style={{ marginLeft: 6 }}>
                  已配置
                </Tag>
              )}
            </Button>
            <Space size={4}>
              <ThunderboltOutlined style={{ opacity: 0.7 }} />
              <span style={{ fontSize: 13, opacity: 0.7 }}>已生成 {resumes.length} 份简历</span>
            </Space>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="template-filter-bar">
        <span className="template-filter-label">行业分类</span>
        {templateCategories.map(cat => (
          <button
            key={cat}
            className={`template-filter-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="template-card-grid">
        {filteredTemplates.map(template => {
          const usedCount = resumes.filter(r => r.templateId === template.id).length

          return (
            <div key={template.id} className="template-card-item">
              {/* CSS 缩略图 */}
              <div
                className="template-card-thumb-wrapper"
                onClick={() => setPreviewTemplate(template)}
              >
                <CssThumb template={template} />
                <div className="template-card-thumb-overlay">
                  <EyeOutlined /> 点击预览大图
                </div>
              </div>

              {/* 信息区 */}
              <div className="template-card-meta">
                <div className="template-card-meta-name">{template.name}</div>
                <div className="template-card-meta-desc">{template.description}</div>
                <Space size={4} wrap>
                  <Tag color="blue">{template.category}</Tag>
                  {usedCount > 0 && <Tag color="green">已用 {usedCount} 次</Tag>}
                </Space>
              </div>

              {/* 操作按钮 */}
              <div className="template-card-actions">
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => setPreviewTemplate(template)}
                >
                  预览
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  使用此模板
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 模板预览弹窗 */}
      <TemplatePreviewModal
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />

      {/* AI 配置抽屉 */}
      <AIConfigDrawer
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
        config={aiConfig}
        onConfigChange={handleAiConfigChange}
      />

      {/* 简历编辑抽屉 */}
      {selectedTemplateId && (
        <ResumeEditDrawer
          open={editDrawerOpen}
          onClose={() => {
            setEditDrawerOpen(false)
            setSelectedTemplateId(null)
          }}
          resume={null}
          defaultTemplateId={selectedTemplateId}
          aiConfig={aiConfig}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      )}
    </div>
  )
}
