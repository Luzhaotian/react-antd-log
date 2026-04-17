import { Card, Switch, Typography, Divider, message } from 'antd'
import PageDetail from '@/components/PageDetail'

const { Paragraph } = Typography

function SettingsAdvanced() {
  const handleSwitchChange = (checked: boolean, name: string) => {
    message.success(`${name}已${checked ? '开启' : '关闭'}`)
  }

  return (
    <PageDetail title="高级设置" description="缓存、日志、通知与调试选项">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex-between">
            <div>
              <Paragraph strong>启用缓存</Paragraph>
              <Paragraph type="secondary">启用后可以提升页面加载速度</Paragraph>
            </div>
            <Switch defaultChecked onChange={checked => handleSwitchChange(checked, '缓存')} />
          </div>
          <Divider />
          <div className="flex-between">
            <div>
              <Paragraph strong>启用日志</Paragraph>
              <Paragraph type="secondary">记录系统运行日志</Paragraph>
            </div>
            <Switch defaultChecked onChange={checked => handleSwitchChange(checked, '日志')} />
          </div>
          <Divider />
          <div className="flex-between">
            <div>
              <Paragraph strong>启用通知</Paragraph>
              <Paragraph type="secondary">接收系统通知消息</Paragraph>
            </div>
            <Switch onChange={checked => handleSwitchChange(checked, '通知')} />
          </div>
          <Divider />
          <div className="flex-between">
            <div>
              <Paragraph strong>调试模式</Paragraph>
              <Paragraph type="secondary">开启后显示详细的调试信息</Paragraph>
            </div>
            <Switch onChange={checked => handleSwitchChange(checked, '调试模式')} />
          </div>
        </div>
      </Card>
    </PageDetail>
  )
}

export default SettingsAdvanced
