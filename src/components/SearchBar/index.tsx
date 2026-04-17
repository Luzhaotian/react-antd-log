import { Form, Input, Button, Space, Card, Row, Col } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import type { SearchBarProps } from '@/types'

function SearchBar({
  fields = [],
  expandable = false,
  defaultExpandCount = 3,
  onSearch,
  onReset,
  showSearchButton = true,
  showResetButton = true,
  extra,
}: SearchBarProps) {
  const [form] = Form.useForm()
  const [expanded, setExpanded] = useState(!expandable)

  // 如果字段数量少于默认展开数量，则自动展开
  useEffect(() => {
    if (fields.length <= defaultExpandCount) {
      setExpanded(true)
    }
  }, [fields.length, defaultExpandCount])

  const handleSearch = () => {
    form.validateFields().then(values => {
      onSearch?.(values)
    })
  }

  const handleReset = () => {
    form.resetFields()
    onReset?.()
    // 重置后自动搜索
    const values = form.getFieldsValue()
    onSearch?.(values)
  }

  const visibleFields = expandable && !expanded ? fields.slice(0, defaultExpandCount) : fields

  return (
    <Card className="mb-4" size="small">
      <Form form={form} layout="inline" className="w-full">
        <Row gutter={[16, 8]} className="w-full">
          {visibleFields.map(field => (
            <Col key={field.name} xs={24} md={8} xl={6}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : []}
              >
                {field.render ? (
                  field.render(form)
                ) : (
                  <Input placeholder={field.placeholder || `请输入${field.label}`} allowClear />
                )}
              </Form.Item>
            </Col>
          ))}

          <Col flex="none" className="ml-auto">
            <Form.Item>
              <Space>
                {showSearchButton && (
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    搜索
                  </Button>
                )}
                {showResetButton && (
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                  </Button>
                )}
                {expandable && fields.length > defaultExpandCount && (
                  <Button type="link" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '收起' : '展开'}
                  </Button>
                )}
                {extra}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default SearchBar
