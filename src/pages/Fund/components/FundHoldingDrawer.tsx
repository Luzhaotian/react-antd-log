import { useEffect } from 'react'
import { Form, InputNumber, Select, Input, Button, Space, Typography } from 'antd'
import AppDrawer from '@/components/AppDrawer'
import { FUND_GROUP_OPTIONS } from '@/constants'
import type { FundHolding, FundHoldingDrawerProps } from '@/types'

const { Text } = Typography

interface HoldingFormValues {
  shares: number
  costPrice: number
  group?: string
  note?: string
}

function FundHoldingDrawer({ open, fund, holding, onClose, onSave }: FundHoldingDrawerProps) {
  const [form] = Form.useForm<HoldingFormValues>()

  useEffect(() => {
    if (!open || !fund) return
    form.setFieldsValue({
      shares: holding?.shares,
      costPrice: holding?.costPrice,
      group: holding?.group,
      note: holding?.note,
    })
  }, [open, fund, holding, form])

  const handleSubmit = async () => {
    if (!fund) return
    const values = await form.validateFields()
    const next: FundHolding = {
      shares: values.shares,
      costPrice: values.costPrice,
      group: values.group?.trim() || undefined,
      note: values.note?.trim() || undefined,
    }
    onSave(fund.FCODE, next)
    onClose()
  }

  const handleClear = () => {
    if (!fund) return
    onSave(fund.FCODE, null)
    onClose()
  }

  return (
    <AppDrawer
      title={fund ? `持仓 · ${fund.SHORTNAME}` : '持仓'}
      open={open}
      onClose={onClose}
      width={400}
      destroyOnClose
      footer={
        <Space className="w-full justify-between">
          <Button danger onClick={handleClear} disabled={!holding}>
            清除持仓
          </Button>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </Space>
        </Space>
      }
    >
      {fund && (
        <>
          <Text type="secondary" className="block mb-4">
            {fund.FCODE} · 最新净值 {fund.NAV ? Number(fund.NAV).toFixed(4) : '--'}
            {fund.GSZ ? ` · 估算 ${Number(fund.GSZ).toFixed(4)}` : ''}
          </Text>
          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item
              label="持有份额"
              name="shares"
              rules={[{ required: true, message: '请输入持有份额' }]}
            >
              <InputNumber min={0} precision={2} className="w-full" placeholder="例如 1000" />
            </Form.Item>
            <Form.Item
              label="成本单价（净值）"
              name="costPrice"
              rules={[{ required: true, message: '请输入成本单价' }]}
            >
              <InputNumber min={0} precision={4} className="w-full" placeholder="买入时单位净值" />
            </Form.Item>
            <Form.Item label="分组" name="group">
              <Select
                allowClear
                placeholder="可选，便于组合归类"
                options={FUND_GROUP_OPTIONS.map(item => ({ label: item.label, value: item.value }))}
              />
            </Form.Item>
            <Form.Item label="备注" name="note">
              <Input.TextArea
                rows={2}
                placeholder="买入日期、策略说明等"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </>
      )}
    </AppDrawer>
  )
}

export default FundHoldingDrawer
