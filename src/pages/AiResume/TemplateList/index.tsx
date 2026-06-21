import { useState, useCallback, useEffect } from 'react'
import { Button, Tag, Space, Modal } from 'antd'
import { PlusOutlined, RobotOutlined, EyeOutlined } from '@ant-design/icons'
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
      <div style={{ display: 'flex', height: '100%', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            width: '35%',
            background: c,
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div
            style={{ height: 6, width: '60%', background: 'rgba(255,255,255,.7)', borderRadius: 2 }}
          />
          <div
            style={{ height: 4, width: '80%', background: 'rgba(255,255,255,.4)', borderRadius: 2 }}
          />
          <div
            style={{
              height: 3,
              width: '70%',
              background: 'rgba(255,255,255,.3)',
              borderRadius: 2,
              marginTop: 8,
            }}
          />
          <div
            style={{ height: 3, width: '50%', background: 'rgba(255,255,255,.3)', borderRadius: 2 }}
          />
          <div
            style={{ height: 3, width: '60%', background: 'rgba(255,255,255,.3)', borderRadius: 2 }}
          />
        </div>
        <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
          <div style={{ height: 4, width: '70%', background: '#e8e8e8', borderRadius: 2 }} />
          <div style={{ height: 4, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
          <div style={{ height: 4, width: '60%', background: '#e8e8e8', borderRadius: 2 }} />
        </div>
      </div>
    )
  }

  if (style === 'modern') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 28,
            background: `linear-gradient(135deg,${c},${c2})`,
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{ height: 6, width: '50%', background: 'rgba(255,255,255,.7)', borderRadius: 2 }}
          />
        </div>
        <div
          style={{ flex: 1, padding: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 3, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
            <div style={{ height: 3, width: '70%', background: '#e8e8e8', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 3, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
            <div style={{ height: 3, width: '60%', background: '#e8e8e8', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    )
  }

  if (style === 'creative') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 6, gap: 4 }}>
        <div style={{ borderLeft: `3px solid ${c}`, paddingLeft: 6 }}>
          <div style={{ height: 5, width: '60%', background: c, borderRadius: 2 }} />
          <div
            style={{ height: 3, width: '40%', background: '#ccc', borderRadius: 2, marginTop: 3 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: c,
              flexShrink: 0,
              marginTop: 2,
            }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 3, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
            <div style={{ height: 3, width: '70%', background: '#e8e8e8', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: c,
              flexShrink: 0,
              marginTop: 2,
            }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 3, width: '90%', background: '#e8e8e8', borderRadius: 2 }} />
            <div style={{ height: 3, width: '60%', background: '#e8e8e8', borderRadius: 2 }} />
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
          padding: 8,
          gap: 6,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: c,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          张
        </div>
        <div style={{ height: 4, width: '50%', background: '#333', borderRadius: 2 }} />
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            borderRadius: 4,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <div style={{ height: 3, width: '100%', background: '#e0e0e0', borderRadius: 2 }} />
          <div style={{ height: 3, width: '70%', background: '#e0e0e0', borderRadius: 2 }} />
        </div>
      </div>
    )
  }

  // classic
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 6, gap: 4 }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${c}`, paddingBottom: 4 }}>
        <div
          style={{ height: 5, width: '50%', background: c, borderRadius: 2, margin: '0 auto' }}
        />
        <div
          style={{ height: 3, width: '30%', background: c2, borderRadius: 2, margin: '3px auto 0' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ height: 3, width: '100%', background: '#e8e8e8', borderRadius: 2 }} />
        <div style={{ height: 3, width: '70%', background: '#e8e8e8', borderRadius: 2 }} />
        <div
          style={{
            height: 2,
            width: '100%',
            background: `${c}30`,
            borderRadius: 2,
            margin: '2px 0',
          }}
        />
        <div style={{ height: 3, width: '90%', background: '#e8e8e8', borderRadius: 2 }} />
        <div style={{ height: 3, width: '60%', background: '#e8e8e8', borderRadius: 2 }} />
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
      {/* 顶部工具栏 */}
      <div className="ai-resume-toolbar">
        <Space>
          <Button icon={<RobotOutlined />} onClick={() => setConfigDrawerOpen(true)}>
            AI 配置
            {aiConfig && (
              <Tag color="green" style={{ marginLeft: 4 }}>
                已配置
              </Tag>
            )}
          </Button>
        </Space>
      </div>

      {/* 分类标签 */}
      <div className="ai-resume-categories">
        {templateCategories.map(cat => (
          <Button
            key={cat}
            type={activeCategory === cat ? 'primary' : 'text'}
            size="small"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
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
