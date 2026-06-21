import { Form, Input, Select, Typography } from 'antd'
import { useResumeEditorStore } from '../store'

const { Title } = Typography

export default function BasicInfoForm() {
  const { currentResume, updateBasicInfo } = useResumeEditorStore()
  if (!currentResume) return null
  const { basic } = currentResume

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        基本信息
      </Title>

      <Form layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item label="姓名">
          <Input
            value={basic.name}
            onChange={e => updateBasicInfo({ name: e.target.value })}
            placeholder="请输入姓名"
          />
        </Form.Item>

        <Form.Item label="职位/头衔">
          <Input
            value={basic.title}
            onChange={e => updateBasicInfo({ title: e.target.value })}
            placeholder="如：高级前端工程师"
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="邮箱">
            <Input
              value={basic.email}
              onChange={e => updateBasicInfo({ email: e.target.value })}
              placeholder="your@email.com"
            />
          </Form.Item>
          <Form.Item label="电话">
            <Input
              value={basic.phone}
              onChange={e => updateBasicInfo({ phone: e.target.value })}
              placeholder="138-0000-0000"
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="所在地">
            <Input
              value={basic.location}
              onChange={e => updateBasicInfo({ location: e.target.value })}
              placeholder="如：北京市"
            />
          </Form.Item>
          <Form.Item label="出生日期">
            <Input
              value={basic.birthDate}
              onChange={e => updateBasicInfo({ birthDate: e.target.value })}
              placeholder="如：1995-01"
            />
          </Form.Item>
        </div>

        <Form.Item label="求职状态">
          <Select
            value={basic.employementStatus || undefined}
            onChange={value => updateBasicInfo({ employementStatus: value })}
            placeholder="请选择求职状态"
            allowClear
            options={[
              { value: '在职-考虑机会', label: '在职-考虑机会' },
              { value: '在职-不考虑', label: '在职-不考虑' },
              { value: '离职-随时到岗', label: '离职-随时到岗' },
              { value: '在校生', label: '在校生' },
            ]}
          />
        </Form.Item>

        <Form.Item label="头部布局">
          <Select
            value={basic.layout || 'left'}
            onChange={value => updateBasicInfo({ layout: value })}
            options={[
              { value: 'left', label: '左对齐' },
              { value: 'center', label: '居中' },
              { value: 'right', label: '右对齐' },
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
