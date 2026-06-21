import { Button, Card, Form, Input, Space, Popconfirm, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useResumeEditorStore } from '../store'

const { TextArea } = Input

export default function ProjectsForm() {
  const { currentResume, addProject, updateProject, removeProject } = useResumeEditorStore()
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
        <h3 style={{ margin: 0, fontSize: 18 }}>项目经历</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addProject()}>
          添加项目经历
        </Button>
      </div>

      {currentResume.projects.length === 0 ? (
        <Empty description="暂无项目经历" style={{ padding: '40px 0' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addProject()}>
            添加
          </Button>
        </Empty>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {currentResume.projects.map((project, index) => (
            <Card
              key={project.id}
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>项目 {index + 1}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={project.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => updateProject(project.id, { visible: !project.visible })}
                  />
                </div>
              }
              extra={
                <Popconfirm title="确定删除?" onConfirm={() => removeProject(project.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              }
            >
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="项目名称">
                    <Input
                      value={project.name}
                      onChange={e => updateProject(project.id, { name: e.target.value })}
                      placeholder="如：组件库 Design Pro"
                    />
                  </Form.Item>
                  <Form.Item label="担任角色">
                    <Input
                      value={project.role}
                      onChange={e => updateProject(project.id, { role: e.target.value })}
                      placeholder="如：技术负责人"
                    />
                  </Form.Item>
                </div>
                <Form.Item label="时间">
                  <Input
                    value={project.date}
                    onChange={e => updateProject(project.id, { date: e.target.value })}
                    placeholder="如：2023.01 - 2023.12"
                  />
                </Form.Item>
                <Form.Item label="项目描述">
                  <TextArea
                    value={project.description}
                    onChange={e => updateProject(project.id, { description: e.target.value })}
                    placeholder="描述项目内容和您的贡献"
                    rows={4}
                  />
                </Form.Item>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="项目链接">
                    <Input
                      value={project.link}
                      onChange={e => updateProject(project.id, { link: e.target.value })}
                      placeholder="https://..."
                    />
                  </Form.Item>
                  <Form.Item label="链接标签">
                    <Input
                      value={project.linkLabel}
                      onChange={e => updateProject(project.id, { linkLabel: e.target.value })}
                      placeholder="如：查看项目"
                    />
                  </Form.Item>
                </div>
              </Form>
            </Card>
          ))}
        </Space>
      )}
    </div>
  )
}
