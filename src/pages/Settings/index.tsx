import { Card, Typography } from 'antd'
import PageDetail from '@/components/PageDetail'

const { Paragraph } = Typography

function Settings() {
  return (
    <PageDetail
      title="设置"
      description="系统配置与偏好"
    >
      <Card>
        <Paragraph>这是设置首页，您可以在这里进行各种配置。</Paragraph>
        <Paragraph>请使用左侧菜单导航到具体的设置页面：</Paragraph>
        <ul>
          <li>基础设置 - 系统基础配置</li>
          <li>高级设置 - 高级功能配置</li>
        </ul>
      </Card>
    </PageDetail>
  )
}

export default Settings
