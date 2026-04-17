import { useState, useCallback, useMemo } from 'react'
import { Card, Input, Button, Space, message, Upload, Typography, Row, Col, Tag, Empty } from 'antd'
import { UploadOutlined, ClearOutlined, SearchOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import type { JsonValue } from '@/types'
import { countJsonItems } from '@/utils'
import { JsonCard } from './components'
import PageLeaveGuard from '@/components/PageLeaveGuard'
import PageDetail from '@/components/PageDetail'

const { TextArea } = Input
const { Text } = Typography

function JsonViewerPro() {
  const [inputJson, setInputJson] = useState('')
  const [parsedData, setParsedData] = useState<JsonValue | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)

  const hasUnsavedChanges = useMemo(() => inputJson.trim().length > 0, [inputJson])
  // 解析 JSON
  const handleParse = useCallback(() => {
    const trimmedInput = inputJson.trim()
    if (!trimmedInput) {
      message.warning('请输入 JSON 数据')
      return
    }

    try {
      const parsed = JSON.parse(trimmedInput)
      setParsedData(parsed)
      setParseError(null)
      setInputJson(trimmedInput)
      message.success('JSON 解析成功')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setParseError(errorMessage)
      setParsedData(null)
      message.error('JSON 格式错误')
    }
  }, [inputJson])

  // 格式化 JSON
  // const handleFormat = useCallback(() => {
  //   const trimmedInput = inputJson.trim()
  //   if (!trimmedInput) {
  //     message.warning('请输入 JSON 数据')
  //     return
  //   }

  //   try {
  //     const parsed = JSON.parse(trimmedInput)
  //     setInputJson(JSON.stringify(parsed, null, 2))
  //     message.success('格式化成功')
  //   } catch {
  //     message.error('JSON 格式错误，无法格式化')
  //   }
  // }, [inputJson])

  // 压缩 JSON
  // const handleMinify = useCallback(() => {
  //   const trimmedInput = inputJson.trim()
  //   if (!trimmedInput) {
  //     message.warning('请输入 JSON 数据')
  //     return
  //   }

  //   try {
  //     const parsed = JSON.parse(trimmedInput)
  //     setInputJson(JSON.stringify(parsed))
  //     message.success('压缩成功')
  //   } catch {
  //     message.error('JSON 格式错误，无法压缩')
  //   }
  // }, [inputJson])

  // 清空
  const handleClear = useCallback(() => {
    setInputJson('')
    setParsedData(null)
    setParseError(null)
    setSearchKeyword('')
  }, [])

  // 复制
  // const handleCopy = useCallback(async () => {
  //   if (!inputJson) {
  //     message.warning('没有可复制的内容')
  //     return
  //   }
  //   try {
  //     await navigator.clipboard.writeText(inputJson)
  //     message.success('已复制到剪贴板')
  //   } catch {
  //     message.error('复制失败')
  //   }
  // }, [inputJson])

  // 文件上传配置
  const uploadProps: UploadProps = {
    accept: '.json',
    showUploadList: false,
    beforeUpload: file => {
      const reader = new FileReader()
      reader.onload = e => {
        const content = (e.target?.result as string).trim()
        setInputJson(content)
        try {
          const parsed = JSON.parse(content)
          setParsedData(parsed)
          setParseError(null)
          message.success(`文件 "${file.name}" 加载成功`)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '未知错误'
          setParseError(errorMessage)
          setParsedData(null)
          message.error('JSON 格式错误')
        }
      }
      reader.readAsText(file)
      return false
    },
  }

  // 统计信息
  const stats = useMemo(() => {
    if (!parsedData) return null
    const itemCount = countJsonItems(parsedData)
    const dataSize = JSON.stringify(parsedData).length
    return { itemCount, dataSize }
  }, [parsedData])

  return (
    <PageDetail title="JSON 查看器" description="支持深层嵌套数据展示">
      <PageLeaveGuard when={hasUnsavedChanges} />
      <Card>
        <Row gutter={16}>
          {/* 左侧输入区 */}
          <Col xs={24} lg={7}>
            <Card title="数据输入" size="small">
              <Space direction="vertical" className="w-full" size="middle">
                <TextArea
                  value={inputJson}
                  onChange={e => setInputJson(e.target.value)}
                  placeholder="在此处粘贴或输入 JSON 数据..."
                  rows={8}
                  className="font-mono text-sm"
                  status={parseError ? 'error' : undefined}
                />

                {parseError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <Text type="danger">
                      <strong>错误：</strong>
                      {parseError}
                    </Text>
                  </div>
                )}

                <Upload {...uploadProps} className="w-full block [&>div.ant-upload]:w-full">
                  <Button icon={<UploadOutlined />} block type="primary" className="w-full">
                    上传 JSON 文件
                  </Button>
                </Upload>

                <div className="flex gap-2">
                  <Button type="primary" onClick={handleParse} className="flex-1">
                    解析
                  </Button>
                  <Button danger onClick={handleClear} className="flex-1">
                    <ClearOutlined /> 清空
                  </Button>
                </div>

                {/* <div className="flex gap-2">
                <Button icon={<ExpandOutlined />} onClick={handleFormat} className="flex-1">
                  格式化
                </Button>
                <Button icon={<CompressOutlined />} onClick={handleMinify} className="flex-1">
                  压缩
                </Button>
                <Button icon={<CopyOutlined />} onClick={handleCopy} className="flex-1">
                  复制
                </Button>
              </div> */}
              </Space>
            </Card>
          </Col>

          {/* 右侧展示区 */}
          <Col xs={24} lg={17}>
            <Card
              title={
                <Space>
                  <span>数据展示</span>
                  {stats && (
                    <Tag color="blue">
                      {stats.itemCount} 项 | {(stats.dataSize / 1024).toFixed(2)} KB
                    </Tag>
                  )}
                </Space>
              }
              size="small"
              styles={{ body: { padding: 0 } }}
            >
              {/* 搜索栏 */}
              {parsedData && (
                <div className="p-3 border-b">
                  <Input
                    placeholder="搜索 key 或值..."
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    allowClear
                  />
                </div>
              )}

              {/* 内容区 */}
              <div
                className="overflow-auto"
                style={{
                  height: 'calc(100vh - 380px)',
                  minHeight: 400,
                  padding: 16,
                }}
              >
                {!parsedData ? (
                  <div className="h-full flex-center">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="请输入或上传 JSON 数据，然后点击解析"
                    />
                  </div>
                ) : (
                  <JsonCard title="JSON 数据" data={parsedData} searchKeyword={searchKeyword} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </PageDetail>
  )
}

export default JsonViewerPro
