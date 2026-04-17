import { useState, useCallback } from 'react'
import { Card, Input, Button, Space, message, Radio, Typography, Row, Col, Statistic } from 'antd'
import {
  CompressOutlined,
  CopyOutlined,
  ClearOutlined,
  SwapOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons'
import PageLeaveGuard from '@/components/PageLeaveGuard'
import PageDetail from '@/components/PageDetail'
import { TEXT_AREA_ROWS, COMPRESS_TYPE } from '@/constants'
import type { CompressType } from '@/types'
import { detectCodeType, formatCodeByType } from '@/utils'

const { TextArea } = Input
const { Text } = Typography

function CodeCompress() {
  const [inputCode, setInputCode] = useState('')
  const [outputCode, setOutputCode] = useState('')
  const [compressType, setCompressType] = useState<CompressType>(COMPRESS_TYPE.JSON)
  const [loading, setLoading] = useState(false)

  // 简单的代码压缩函数
  const compressCode = useCallback((code: string, type: CompressType): string => {
    if (!code.trim()) return ''

    switch (type) {
      case COMPRESS_TYPE.JS:
        // 移除单行注释、多行注释、多余空白
        return code
          .replace(/\/\/.*$/gm, '') // 移除单行注释
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
          .replace(/\s+/g, ' ') // 多个空白替换为单个空格
          .replace(/\s*([{}();,:])\s*/g, '$1') // 移除符号周围的空白
          .replace(/;\s*}/g, '}') // 移除最后一个分号前的空白
          .trim()

      case COMPRESS_TYPE.CSS:
        return code
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
          .replace(/\s+/g, ' ') // 多个空白替换为单个空格
          .replace(/\s*([{}:;,])\s*/g, '$1') // 移除符号周围的空白
          .replace(/;}/g, '}') // 移除最后一个分号
          .trim()

      case COMPRESS_TYPE.HTML:
        return code
          .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
          .replace(/\s+/g, ' ') // 多个空白替换为单个空格
          .replace(/>\s+</g, '><') // 移除标签之间的空白
          .trim()

      case COMPRESS_TYPE.JSON:
        try {
          const parsed = JSON.parse(code)
          return JSON.stringify(parsed)
        } catch {
          message.error('无效的 JSON 格式')
          return code
        }

      default:
        return code
    }
  }, [])

  const typeLabel: Record<CompressType, string> = {
    [COMPRESS_TYPE.JSON]: 'JSON',
    [COMPRESS_TYPE.JS]: 'JavaScript',
    [COMPRESS_TYPE.CSS]: 'CSS',
    [COMPRESS_TYPE.HTML]: 'HTML',
  }

  const handleCompress = useCallback(() => {
    if (!inputCode.trim()) {
      message.warning('请输入要压缩的代码')
      return
    }
    const detectedType = detectCodeType(inputCode)
    if (detectedType !== compressType) {
      message.warning(
        `检测到代码类型为「${typeLabel[detectedType]}」，请先切换到「${typeLabel[detectedType]}」再压缩`
      )
      return
    }
    setLoading(true)
    // 模拟处理延迟
    setTimeout(() => {
      const result = compressCode(inputCode, compressType)
      setOutputCode(result)
      setLoading(false)
      if (result) {
        message.success('压缩完成')
      }
    }, 300)
  }, [inputCode, compressType, compressCode])

  const handleCopy = useCallback(async () => {
    if (!outputCode) {
      message.warning('没有可复制的内容')
      return
    }
    try {
      await navigator.clipboard.writeText(outputCode)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }, [outputCode])

  const handleClear = useCallback(() => {
    setInputCode('')
    setOutputCode('')
  }, [])

  const handleSwap = useCallback(() => {
    setInputCode(outputCode)
    setOutputCode('')
  }, [outputCode])

  /** 先检测代码类型，与当前选中类型一致才格式化，否则提示切换 */
  const handleFormat = useCallback(() => {
    if (!inputCode.trim()) {
      message.warning('请输入要格式化的代码')
      return
    }
    const detectedType = detectCodeType(inputCode)
    if (detectedType !== compressType) {
      message.warning(
        `检测到代码类型为「${typeLabel[detectedType]}」，请先切换到「${typeLabel[detectedType]}」再格式化`
      )
      return
    }
    const formatted = formatCodeByType(inputCode, compressType)
    if (formatted !== inputCode) {
      setInputCode(formatted)
      message.success(`已按 ${typeLabel[compressType]} 格式化`)
    }
  }, [inputCode, compressType])

  // 计算压缩统计
  const inputSize = new Blob([inputCode]).size
  const outputSize = new Blob([outputCode]).size
  const compressionRatio = inputSize > 0 ? ((1 - outputSize / inputSize) * 100).toFixed(1) : '0'

  // 当输入框有内容时，启用离开提示
  const hasContent = inputCode.trim().length > 0

  return (
    <PageDetail title="代码压缩工具" description="支持 JSON、JavaScript、CSS、HTML 的压缩与格式化">
      <PageLeaveGuard when={hasContent} />
      <Card>
        <Card className="mb-4">
          <Space direction="vertical" className="w-full">
            <div className="flex-between">
              <Space>
                <Text strong>代码类型：</Text>
                <Radio.Group
                  value={compressType}
                  onChange={e => setCompressType(e.target.value as CompressType)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value={COMPRESS_TYPE.JSON}>JSON</Radio.Button>
                  <Radio.Button value={COMPRESS_TYPE.JS}>JavaScript</Radio.Button>
                  <Radio.Button value={COMPRESS_TYPE.CSS}>CSS</Radio.Button>
                  <Radio.Button value={COMPRESS_TYPE.HTML}>HTML</Radio.Button>
                </Radio.Group>
              </Space>

              <Space>
                <Button
                  icon={<CompressOutlined />}
                  type="primary"
                  onClick={handleCompress}
                  loading={loading}
                >
                  压缩
                </Button>
                <Button
                  icon={<FormatPainterOutlined />}
                  onClick={handleFormat}
                  disabled={!inputCode.trim()}
                >
                  格式化
                </Button>
                <Button icon={<SwapOutlined />} onClick={handleSwap} disabled={!outputCode}>
                  交换
                </Button>
                <Button icon={<ClearOutlined />} onClick={handleClear}>
                  清空
                </Button>
              </Space>
            </div>
          </Space>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="输入代码" extra={<Text type="secondary">{inputSize} 字节</Text>}>
              <TextArea
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="请粘贴要压缩的代码..."
                rows={TEXT_AREA_ROWS}
                className="font-mono"
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title="压缩结果"
              extra={
                <Space>
                  <Text type="secondary">{outputSize} 字节</Text>
                  {outputCode && <Text type="success">压缩率: {compressionRatio}%</Text>}
                  <Button
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={handleCopy}
                    disabled={!outputCode}
                  >
                    复制
                  </Button>
                </Space>
              }
            >
              <TextArea
                value={outputCode}
                readOnly
                placeholder="压缩后的代码将显示在这里..."
                rows={TEXT_AREA_ROWS}
                className="font-mono"
              />
            </Card>
          </Col>
        </Row>

        {outputCode && (
          <Card className="mt-4">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="原始大小" value={inputSize} suffix="字节" />
              </Col>
              <Col span={8}>
                <Statistic title="压缩后大小" value={outputSize} suffix="字节" />
              </Col>
              <Col span={8}>
                <Statistic
                  title="压缩率"
                  value={compressionRatio}
                  suffix="%"
                  valueStyle={{ color: Number(compressionRatio) > 30 ? '#3f8600' : '#1677ff' }}
                />
              </Col>
            </Row>
          </Card>
        )}
      </Card>
    </PageDetail>
  )
}

export default CodeCompress
