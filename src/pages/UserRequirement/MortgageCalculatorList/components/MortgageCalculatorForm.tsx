import React from 'react'
import { Form, Input, InputNumber, Radio, Button, Space, Cascader, Select } from 'antd'
import { ThunderboltOutlined, CalculatorOutlined } from '@ant-design/icons'
import type { MortgageFormValues } from '@/types'
import { REPAY_OPTIONS, LOAN_TYPE_OPTIONS } from '@/constants'
import { PCA_OPTIONS } from '@/utils'

export interface MortgageCalculatorFormProps {
  form: ReturnType<typeof Form.useForm<MortgageFormValues>>[0]
  initialValues: MortgageFormValues
  /** 总利息（元），由月供明细汇总，未计算时为 0 */
  totalInterest?: number
  disabled?: boolean
  rateLoading?: boolean
  onLoanTypeChange: (loanType: 'commercial' | 'provident') => void
  onFetchRate: () => void
  onRecalc: () => void
}

/** 总金额 = 首付 + 贷款金额 + 总利息 */
function getTotalAmount(downPayment: number, loanAmount: number, totalInterest: number): number {
  return (downPayment ?? 0) + (loanAmount ?? 0) + (totalInterest ?? 0)
}

/** 房屋总价 = 每平方米价格 × 平米数 */
function getHouseTotalPrice(pricePerSquareMeter: number, areaSquareMeters: number): number {
  return pricePerSquareMeter * areaSquareMeters
}

/** 生成贷款期限选项 */
function generateTermOptions() {
  const options = []
  for (let i = 1; i <= 360; i++) {
    options.push({
      value: i,
      label: `${i} 个月`,
    })
  }
  return options
}

export function MortgageCalculatorForm({
  form,
  initialValues,
  totalInterest = 0,
  disabled = false,
  rateLoading = false,
  onLoanTypeChange,
  onFetchRate,
  onRecalc,
}: MortgageCalculatorFormProps) {
  const pricePerSquareMeter = Form.useWatch('pricePerSquareMeter', form) ?? 0
  const areaSquareMeters = Form.useWatch('areaSquareMeters', form) ?? 0
  const downPayment = Form.useWatch('downPayment', form) ?? 0
  const annualRate = Form.useWatch('annualRate', form) ?? 0

  // 计算房屋总价
  const houseTotalPrice = getHouseTotalPrice(pricePerSquareMeter, areaSquareMeters)

  // 计算最低首付
  const minDownPayment = houseTotalPrice * 0.15

  // 计算贷款金额
  const loanAmount = houseTotalPrice - downPayment

  // 计算总金额
  const displayTotal = getTotalAmount(downPayment, loanAmount, totalInterest)

  // 当关键值变化时，更新表单中的贷款金额并重新计算
  React.useEffect(() => {
    if (pricePerSquareMeter > 0 && areaSquareMeters > 0 && downPayment > 0) {
      form.setFieldsValue({ totalAmount: loanAmount })
    }
  }, [pricePerSquareMeter, areaSquareMeters, downPayment, loanAmount, form])

  // 当年利率有值且变化时，重新计算
  React.useEffect(() => {
    if (annualRate > 0 && pricePerSquareMeter > 0 && areaSquareMeters > 0 && downPayment > 0) {
      onRecalc()
    }
  }, [annualRate, pricePerSquareMeter, areaSquareMeters, downPayment, onRecalc])

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      disabled={disabled}
      validateTrigger={['onChange', 'onBlur']}
    >
      <Form.Item name="name" label="名称/备注" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="如：首套房" allowClear />
      </Form.Item>
      <Form.Item
        name="loanType"
        label="贷款类型"
        rules={[{ required: true, message: '请选择贷款类型' }]}
      >
        <Radio.Group
          options={LOAN_TYPE_OPTIONS}
          optionType="button"
          onChange={e => onLoanTypeChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item name="city" label="省/市/区（国内地级及以上，三级联动）">
        <Cascader
          options={PCA_OPTIONS}
          placeholder="请选择省、市、区"
          allowClear
          showSearch={{
            filter: (inputValue, path) =>
              path.some(p => p.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
          }}
          displayRender={labels => labels.join(' / ')}
        />
      </Form.Item>
      <Form.Item
        name="pricePerSquareMeter"
        label="每平方米价格（元/㎡）"
        rules={[{ required: true, message: '请输入每平方米价格' }]}
      >
        <InputNumber className="w-full" min={0} precision={0} placeholder="如：50000" />
      </Form.Item>
      <Form.Item
        name="areaSquareMeters"
        label="平米数（㎡）"
        rules={[{ required: true, message: '请输入平米数' }]}
      >
        <InputNumber className="w-full" min={0} precision={2} placeholder="如：100" />
      </Form.Item>
      <Form.Item
        name="downPayment"
        label="首付（元）"
        rules={[
          { required: true, message: '请输入首付' },
          {
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(
                  new Error(`请输入首付, 最低首付为 15%,  ${minDownPayment.toFixed(0)} 元`)
                )
              }
              if (value?.toFixed(0) < minDownPayment?.toFixed(0)) {
                return Promise.reject(new Error(`首付最低为 ${minDownPayment.toFixed(0)} 元`))
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <InputNumber
          className="w-full"
          min={minDownPayment?.toFixed(0)}
          precision={0}
          placeholder="如：1000000"
        />
      </Form.Item>
      <Form.Item name="totalAmount" label="贷款金额（元）">
        <InputNumber
          className="w-full"
          min={0}
          precision={0}
          placeholder="如：3000000"
          value={loanAmount > 0 ? loanAmount : 0}
          readOnly
        />
      </Form.Item>
      <Form.Item label="利息（元）">
        <InputNumber
          className="w-full"
          readOnly
          value={totalInterest}
          formatter={v => (v != null ? `${Number(v).toLocaleString('zh-CN')}` : '')}
        />
      </Form.Item>
      <Form.Item label="总金额（元）">
        <InputNumber
          className="w-full"
          readOnly
          value={displayTotal}
          formatter={v => (v != null ? `${Number(v).toLocaleString('zh-CN')}` : '')}
        />
      </Form.Item>
      <Form.Item name="annualRate" label="年利率（%）">
        <InputNumber
          className="w-full"
          min={0.01}
          max={20}
          step={0.01}
          precision={2}
          placeholder="如：4.2"
        />
      </Form.Item>
      <Form.Item
        name="termMonths"
        label="贷款期限（月）"
        rules={[{ required: true, message: '请选择贷款期限' }]}
      >
        <Select className="w-full" placeholder="请选择贷款期限" options={generateTermOptions()} />
      </Form.Item>
      <Form.Item name="repayType" label="还款方式">
        <Radio.Group options={REPAY_OPTIONS} optionType="button" />
      </Form.Item>
      {!disabled && (
        <Form.Item label=" " colon={false}>
          <Space wrap>
            <Button icon={<ThunderboltOutlined />} loading={rateLoading} onClick={onFetchRate}>
              获取最新利率
            </Button>
            <Button type="primary" icon={<CalculatorOutlined />} onClick={onRecalc}>
              计算
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}
