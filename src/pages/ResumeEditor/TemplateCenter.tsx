import { useCallback } from 'react'
import { Button, Card, Tag, message } from 'antd'
import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useResumeEditorStore } from './store'
import { resumeTemplates } from './templates'

export default function TemplateCenter() {
  const navigate = useNavigate()
  const { addResume, resumes } = useResumeEditorStore()

  const handleUseTemplate = useCallback(
    (templateId: string) => {
      const id = addResume({ templateId, title: '未命名简历' })
      message.success('已创建简历')
      navigate(`/resume-editor/workbench/${id}`)
    },
    [addResume, navigate]
  )

  const getUsageCount = (templateId: string) => {
    return resumes.filter(r => r.templateId === templateId).length
  }

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
          return (
            <Card
              key={template.id}
              hoverable
              style={{ borderRadius: 8 }}
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
                  }}
                >
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
    </div>
  )
}
