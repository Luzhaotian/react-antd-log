import { Modal, Card, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { resumeTemplates } from '../templates'

interface TemplateSelectorProps {
  open: boolean
  onClose: () => void
  currentTemplateId: string
  onSelect: (templateId: string) => void
}

export default function TemplateSelector({
  open,
  onClose,
  currentTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <Modal title="选择模板" open={open} onCancel={onClose} width={800} footer={null} destroyOnClose>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {resumeTemplates.map(template => {
          const isSelected = template.id === currentTemplateId
          return (
            <Card
              key={template.id}
              hoverable
              onClick={() => onSelect(template.id)}
              style={{
                borderRadius: 8,
                border: isSelected ? `2px solid ${template.colorScheme.primary}` : undefined,
              }}
              cover={
                <div
                  style={{
                    height: 120,
                    background: `linear-gradient(135deg, ${template.colorScheme.primary}20, ${template.colorScheme.secondary}20)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `2px solid ${template.colorScheme.primary}`,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 70,
                      background: '#fff',
                      borderRadius: 4,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      padding: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        height: 12,
                        background: template.colorScheme.primary,
                        borderRadius: 2,
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ height: 2, background: '#e8e8e8', borderRadius: 1 }} />
                      <div
                        style={{ height: 2, background: '#e8e8e8', borderRadius: 1, width: '70%' }}
                      />
                      <div style={{ height: 2, background: '#e8e8e8', borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              }
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{template.name}</span>
                    {isSelected && (
                      <Tag color="green" icon={<CheckOutlined />}>
                        当前
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <span style={{ fontSize: 12, color: '#999' }}>{template.description}</span>
                }
              />
            </Card>
          )
        })}
      </div>
    </Modal>
  )
}
