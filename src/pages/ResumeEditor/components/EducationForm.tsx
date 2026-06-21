import { Button, Card, Form, Input, Space, Popconfirm, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useResumeEditorStore } from '../store'

const { TextArea } = Input

export default function EducationForm() {
  const { currentResume, addEducation, updateEducation, removeEducation } = useResumeEditorStore()
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
        <h3 style={{ margin: 0, fontSize: 18 }}>教育经历</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addEducation()}>
          添加教育经历
        </Button>
      </div>

      {currentResume.education.length === 0 ? (
        <Empty description="暂无教育经历" style={{ padding: '40px 0' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addEducation()}>
            添加
          </Button>
        </Empty>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {currentResume.education.map((edu, index) => (
            <Card
              key={edu.id}
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>教育经历 {index + 1}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={edu.visible !== false ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => updateEducation(edu.id, { visible: edu.visible === false })}
                  />
                </div>
              }
              extra={
                <Popconfirm title="确定删除?" onConfirm={() => removeEducation(edu.id)}>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              }
            >
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <Form.Item label="学校">
                  <Input
                    value={edu.school}
                    onChange={e => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="如：北京大学"
                  />
                </Form.Item>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="学位">
                    <Input
                      value={edu.degree}
                      onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="如：本科"
                    />
                  </Form.Item>
                  <Form.Item label="专业">
                    <Input
                      value={edu.major}
                      onChange={e => updateEducation(edu.id, { major: e.target.value })}
                      placeholder="如：计算机科学"
                    />
                  </Form.Item>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <Form.Item label="开始时间">
                    <Input
                      value={edu.startDate}
                      onChange={e => updateEducation(edu.id, { startDate: e.target.value })}
                      placeholder="如：2018-09"
                    />
                  </Form.Item>
                  <Form.Item label="结束时间">
                    <Input
                      value={edu.endDate}
                      onChange={e => updateEducation(edu.id, { endDate: e.target.value })}
                      placeholder="如：2022-06"
                    />
                  </Form.Item>
                  <Form.Item label="GPA">
                    <Input
                      value={edu.gpa}
                      onChange={e => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="如：3.8/4.0"
                    />
                  </Form.Item>
                </div>
                <Form.Item label="描述">
                  <TextArea
                    value={edu.description}
                    onChange={e => updateEducation(edu.id, { description: e.target.value })}
                    placeholder="可选，描述相关经历"
                    rows={2}
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
