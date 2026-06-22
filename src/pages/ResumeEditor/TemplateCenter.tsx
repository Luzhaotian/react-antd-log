import { useCallback, useState } from 'react'
import { Button, Card, Tag, message, Modal } from 'antd'
import { PlusOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useResumeEditorStore } from './store'
import { resumeTemplates } from './templates'
import { renderResumeToHtml } from './utils/export'
import type { ResumeData, ResumeTemplate } from './types'

// Sample resume data for template preview
function createSampleResume(template: ResumeTemplate): ResumeData {
  return {
    id: 'preview',
    title: '预览简历',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templateId: template.id,
    basic: {
      name: '张三',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      location: '北京市朝阳区',
      birthDate: '1995-06',
      employementStatus: '在职',
      photo: '',
      photoConfig: {
        width: 90,
        height: 120,
        aspectRatio: '3:4',
        borderRadius: 'none',
        customBorderRadius: 0,
        visible: true,
      },
      customFields: [],
      layout: template.basic?.layout || 'left',
    },
    education: [
      {
        id: 'edu1',
        school: '北京大学',
        major: '计算机科学与技术',
        degree: '本科',
        startDate: '2013.09',
        endDate: '2017.06',
        gpa: '3.8/4.0',
        description: '主修课程：数据结构、算法设计、操作系统、计算机网络',
        visible: true,
      },
    ],
    experience: [
      {
        id: 'exp1',
        company: '字节跳动',
        position: '高级前端工程师',
        date: '2021.03 - 至今',
        details:
          '• 负责抖音电商平台的前端架构设计和开发\n• 优化页面性能，首屏加载时间减少 40%\n• 带领 5 人团队完成多个重点项目',
        visible: true,
      },
      {
        id: 'exp2',
        company: '阿里巴巴',
        position: '前端工程师',
        date: '2019.07 - 2021.02',
        details:
          '• 参与淘宝商家后台系统的开发和维护\n• 使用 React + TypeScript 构建复杂的表单系统\n• 获得年度优秀员工称号',
        visible: true,
      },
    ],
    projects: [
      {
        id: 'proj1',
        name: '电商平台重构',
        role: '前端负责人',
        date: '2022.06 - 2023.01',
        description:
          '• 主导电商平台前端架构从 jQuery 迁移到 React\n• 设计组件库，提高团队开发效率 50%\n• 实现微前端架构，支持多团队并行开发',
        visible: true,
        link: '',
        linkLabel: '查看项目',
      },
    ],
    certificates: [],
    customData: {},
    skillContent:
      'React / Vue.js / TypeScript\nNode.js / Webpack / Vite\nGit / CI/CD / Docker\n性能优化 / 前端架构',
    selfEvaluationContent:
      '5 年前端开发经验，精通 React 生态系统。具备良好的架构设计能力和团队协作精神，对前端性能优化有深入研究。',
    activeSection: 'basic',
    menuSections: [
      { id: 'basic', title: '基本信息', icon: '👤', enabled: true, order: 0 },
      { id: 'education', title: '教育经历', icon: '🎓', enabled: true, order: 1 },
      { id: 'experience', title: '工作经历', icon: '💼', enabled: true, order: 2 },
      { id: 'projects', title: '项目经历', icon: '🚀', enabled: true, order: 3 },
      { id: 'skills', title: '专业技能', icon: '⚡', enabled: true, order: 4 },
      { id: 'selfEvaluation', title: '自我评价', icon: '💬', enabled: true, order: 5 },
    ],
    globalSettings: {
      themeColor: template.colorScheme.primary,
      fontFamily: "'Noto Sans SC', sans-serif",
      baseFontSize: 14,
      pagePadding: 20,
      paragraphSpacing: 8,
      lineHeight: 1.6,
      sectionSpacing: 16,
      headerSize: 24,
      subheaderSize: 16,
      useIconMode: false,
      centerSubtitle: false,
      flexibleHeaderLayout: false,
      autoOnePage: false,
    },
  }
}

export default function TemplateCenter() {
  const navigate = useNavigate()
  const { addResume, resumes } = useResumeEditorStore()
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const handleUseTemplate = useCallback(
    (templateId: string) => {
      const id = addResume({ templateId, title: '未命名简历' })
      message.success('已创建简历')
      navigate(`/resume-editor/workbench/${id}`)
    },
    [addResume, navigate]
  )

  const handlePreview = useCallback((template: ResumeTemplate) => {
    setPreviewTemplate(template)
  }, [])

  const getUsageCount = (templateId: string) => {
    return resumes.filter(r => r.templateId === templateId).length
  }

  const previewHtml = previewTemplate ? renderResumeToHtml(createSampleResume(previewTemplate)) : ''

  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: '16px 24px',
          marginBottom: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 600 }}>模板中心</span>
        <span style={{ fontSize: 13, color: '#999', marginLeft: 12 }}>
          选择一个模板开始创建您的简历
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {resumeTemplates.map(template => {
          const usageCount = getUsageCount(template.id)
          const isHovered = hoveredTemplate === template.id
          return (
            <Card
              key={template.id}
              hoverable
              style={{ borderRadius: 8 }}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              cover={
                <div
                  style={{
                    height: 180,
                    background: `linear-gradient(135deg, ${template.colorScheme.primary}20, ${template.colorScheme.secondary}20)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    borderBottom: `3px solid ${template.colorScheme.primary}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Preview button - appears on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                    onClick={e => {
                      e.stopPropagation()
                      handlePreview(template)
                    }}
                  >
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                      <EyeOutlined style={{ fontSize: 36, marginBottom: 8 }} />
                      <div style={{ fontSize: 14 }}>预览模板</div>
                    </div>
                  </div>

                  {/* Template preview mockup */}
                  <div
                    style={{
                      width: 120,
                      height: 100,
                      background: '#fff',
                      borderRadius: 4,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        height: 16,
                        background: template.colorScheme.primary,
                        borderRadius: 2,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                      {template.layout === 'sidebar' && (
                        <div
                          style={{
                            width: '35%',
                            background: template.colorScheme.primary + '40',
                            borderRadius: 2,
                          }}
                        />
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div
                          style={{
                            height: 3,
                            background: '#e8e8e8',
                            borderRadius: 1,
                            width: '100%',
                          }}
                        />
                        <div
                          style={{
                            height: 3,
                            background: '#e8e8e8',
                            borderRadius: 1,
                            width: '70%',
                          }}
                        />
                        <div
                          style={{
                            height: 3,
                            background: '#e8e8e8',
                            borderRadius: 1,
                            width: '90%',
                          }}
                        />
                        <div
                          style={{
                            height: 3,
                            background: '#e8e8e8',
                            borderRadius: 1,
                            width: '60%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
              actions={[
                <Button
                  key="use"
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => handleUseTemplate(template.id)}
                >
                  使用此模板
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{template.name}</span>
                    {usageCount > 0 && (
                      <Tag color="green" icon={<CheckOutlined />}>
                        已用 {usageCount} 次
                      </Tag>
                    )}
                  </div>
                }
                description={template.description}
              />
            </Card>
          )
        })}
      </div>

      {/* Template Preview Modal */}
      <Modal
        title={previewTemplate ? `预览模板: ${previewTemplate.name}` : '模板预览'}
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        width={860}
        footer={
          previewTemplate
            ? [
                <Button key="cancel" onClick={() => setPreviewTemplate(null)}>
                  关闭
                </Button>,
                <Button
                  key="use"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    handleUseTemplate(previewTemplate.id)
                    setPreviewTemplate(null)
                  }}
                >
                  使用此模板
                </Button>,
              ]
            : null
        }
        destroyOnClose
      >
        {previewTemplate && (
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            <div
              style={{
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <iframe
                srcDoc={previewHtml}
                title="模板预览"
                sandbox="allow-same-origin"
                style={{
                  width: '100%',
                  height: 600,
                  border: 'none',
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
