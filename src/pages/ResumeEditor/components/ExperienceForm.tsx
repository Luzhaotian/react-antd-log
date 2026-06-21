import { Button, Card, Form, Input, Space, Popconfirm, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useResumeEditorStore } from '../store'

const { TextArea } = Input

export default function ExperienceForm() {
  const { currentResume, addExperience, updateExperience, removeExperience } =
    useResumeEditorStore()
  if (!currentResume) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18 }}>工作经历</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addExperience()}>
          添加工作经历
        </Button>
      </div>

      {currentResume.experience.length === 0 ? (
        <Empty description="暂无工作经历" style={{ padding: '40px 0' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addExperience()}>
            添加
          </Button>
        </Empty>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {currentResume.experience.map((exp, index) => (
            <Card
              key={exp.id}
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>工作经历 {index + 1}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={exp.visible !== false ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => updateExperience(exp.id, { visible: exp.visible === false })}
                  />
                </div>
              }
              extra={
                <Popconfirm title="确定删除?" onConfirm={() => removeExperience(exp.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              }
            >
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="公司">
                    <Input
                      value={exp.company}
                      onChange={e => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="如：字节跳动"
                    />
                  </Form.Item>
                  <Form.Item label="职位">
                    <Input
                      value={exp.position}
                      onChange={e => updateExperience(exp.id, { position: e.target.value })}
                      placeholder="如：高级前端工程师"
                    />
                  </Form.Item>
                </div>
                <Form.Item label="时间">
                  <Input
                    value={exp.date}
                    onChange={e => updateExperience(exp.id, { date: e.target.value })}
                    placeholder="如：2022.03 - 至今"
                  />
                </Form.Item>
                <Form.Item label="工作描述">
                  <TextArea
                    value={exp.details}
                    onChange={e => updateExperience(exp.id, { details: e.target.value })}
                    placeholder="描述您的工作职责和成就"
                    rows={4}
                  />
                </Form.Item>
              </Form>
            </Card>
          ))}
        </Space>
      )}
    </div>
  )
}
