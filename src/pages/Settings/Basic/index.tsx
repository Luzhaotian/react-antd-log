import { Card, Form, Input, Button, message } from 'antd'
import PageDetail from '@/components/PageDetail'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'

function SettingsBasic() {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    message.success(`保存成功！${JSON.stringify(values)}`)
  }

  return (
    <PageDetail title="基础设置" description="站点名称、地址、描述等基础配置">
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: APP_NAME,
            siteUrl: 'https://example.com',
            description: APP_DESCRIPTION,
          }}
        >
          <Form.Item
            label="站点名称"
            name="siteName"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input placeholder="请输入站点名称" />
          </Form.Item>
          <Form.Item
            label="站点地址"
            name="siteUrl"
            rules={[{ required: true, message: '请输入站点地址' }]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="站点描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入站点描述" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageDetail>
  )
}

export default SettingsBasic
