import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Radio,
  Typography,
  Divider,
  DatePicker,
  InputNumber,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Space,
} from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import FilePreview from '@/components/FilePreview'
import AppDrawer from '@/components/AppDrawer'
import { defaultDate, buildFileName, buildDownloadFileName } from '@/utils'
import {
  TEMPLATE_OPTIONS,
  DATE_NUM_TYPE_OPTIONS,
  PICKER_TYPE,
  COMPONENT_SIZE_TYPE,
} from '@/constants'
import { getDefaultTemplateConfig } from '@/utils'
import type { FileRenameDrawerProps, FileRenameTemplateConfig, TemplateType } from '@/types'

const { Text } = Typography

function FileRenameDrawer({
  open,
  item,
  onClose,
  onSave,
  componentSize = COMPONENT_SIZE_TYPE.MIDDLE,
}: FileRenameDrawerProps) {
  const defaultConfig = getDefaultTemplateConfig()
  const [templateType, setTemplateType] = useState<TemplateType>(defaultConfig.templateType)
  const [templateDate, setTemplateDate] = useState<Dayjs | null>(() =>
    defaultConfig.templateDate ? dayjs(defaultConfig.templateDate) : defaultDate()
  )
  const [templateValue, setTemplateValue] = useState<number | null>(defaultConfig.templateValue)
  const [templateMonth, setTemplateMonth] = useState<Dayjs | null>(() =>
    defaultConfig.templateMonth ? dayjs(defaultConfig.templateMonth) : dayjs().startOf(PICKER_TYPE.MONTH)
  )
  const [templateCustom, setTemplateCustom] = useState<string>(defaultConfig.templateCustom)
  const [templateNamePrefix, setTemplateNamePrefix] = useState<string>(defaultConfig.templateNamePrefix)
  const [templateDateNumType, setTemplateDateNumType] = useState<string>(defaultConfig.templateDateNumType)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)

  useEffect(() => {
    if (open && item?.templateConfig) {
      const c = item.templateConfig
      setTemplateType(c.templateType)
      setTemplateDate(c.templateDate ? dayjs(c.templateDate) : defaultDate())
      setTemplateValue(c.templateValue)
      setTemplateMonth(c.templateMonth ? dayjs(c.templateMonth) : dayjs().startOf(PICKER_TYPE.MONTH))
      setTemplateCustom(c.templateCustom)
      setTemplateNamePrefix(c.templateNamePrefix)
      setTemplateDateNumType(c.templateDateNumType)
    }
    if (open && !item?.templateConfig) {
      const d = getDefaultTemplateConfig()
      setTemplateType(d.templateType)
      setTemplateDate(d.templateDate ? dayjs(d.templateDate) : defaultDate())
      setTemplateValue(d.templateValue)
      setTemplateMonth(d.templateMonth ? dayjs(d.templateMonth) : dayjs().startOf(PICKER_TYPE.MONTH))
      setTemplateCustom(d.templateCustom)
      setTemplateNamePrefix(d.templateNamePrefix)
      setTemplateDateNumType(d.templateDateNumType)
    }
  }, [open, item?.id, item?.templateConfig])

  const file = item?.file ?? null

  const generatedName = useMemo(
    () =>
      buildFileName(templateType, {
        namePrefix: templateNamePrefix,
        dateNumType: templateDateNumType,
        date: templateDate ?? undefined,
        value: templateValue ?? undefined,
        month: templateMonth ?? undefined,
        custom: templateCustom.trim() || undefined,
      }),
    [
      templateType,
      templateNamePrefix,
      templateDateNumType,
      templateDate,
      templateValue,
      templateMonth,
      templateCustom,
    ]
  )

  const downloadFileName = useMemo(
    () => (file ? buildDownloadFileName(file, generatedName) : ''),
    [file, generatedName]
  )

  const handleConfirm = useCallback(() => {
    if (!file || !downloadFileName) return
    const payload: FileRenameTemplateConfig & { newName: string } = {
      newName: downloadFileName,
      templateType,
      templateDate: templateDate?.toISOString() ?? null,
      templateValue: templateValue ?? null,
      templateMonth: templateMonth?.toISOString() ?? null,
      templateCustom: templateCustom ?? '',
      templateNamePrefix: templateNamePrefix ?? '',
      templateDateNumType: templateDateNumType ?? '',
    }
    onSave(payload)
    onClose()
  }, [
    file,
    downloadFileName,
    templateType,
    templateDate,
    templateValue,
    templateMonth,
    templateCustom,
    templateNamePrefix,
    templateDateNumType,
    onSave,
    onClose,
  ])

  const handleDownload = useCallback(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadFileName
    a.click()
    URL.revokeObjectURL(url)
  }, [file, downloadFileName])

  return (
    <>
      <AppDrawer
        title="文件重命名"
        placement="right"
        width={1000}
        open={open}
        onClose={onClose}
        footer={
          <Space className="w-full justify-end">
            <Button onClick={onClose} size={componentSize}>
              取消
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewOpen(true)}
              disabled={!file}
              size={componentSize}
            >
              预览
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!file}
              size={componentSize}
            >
              按新文件名下载
            </Button>
            <Button type="primary" onClick={handleConfirm} disabled={!file} size={componentSize}>
              确定
            </Button>
          </Space>
        }
      >
        {item && (
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text type="secondary" className="text-sm">
                当前文件
              </Text>
              <div className="mt-1 break-all font-medium">{item.file.name}</div>
            </div>

            <Divider className="my-2" />

            <div>
              <Text strong className="mb-2 block text-gray-700">
                命名模板
              </Text>
              <Radio.Group
                value={templateType}
                onChange={e => setTemplateType(e.target.value)}
                options={TEMPLATE_OPTIONS}
                optionType="button"
                buttonStyle="solid"
                className="w-full"
              />
            </div>

            <Divider className="my-2" />

            {templateType === 'custom' ? (
              <Form size={componentSize}>
                <Form.Item label="文件名（不含扩展名）" className="mb-0">
                  <Input
                    value={templateCustom}
                    onChange={e => setTemplateCustom(e.target.value)}
                    placeholder="随意填写"
                    allowClear
                  />
                </Form.Item>
              </Form>
            ) : (
              <Form size={componentSize}>
                {templateType === 'date-num' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="姓名/前缀">
                        <Input
                          value={templateNamePrefix}
                          onChange={e => setTemplateNamePrefix(e.target.value)}
                          placeholder="卢照天"
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="类型">
                        <Select
                          value={templateDateNumType}
                          onChange={v => setTemplateDateNumType(v)}
                          options={DATE_NUM_TYPE_OPTIONS}
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="日期">
                        <DatePicker
                          value={templateDate}
                          onChange={d => setTemplateDate(d)}
                          allowClear={false}
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="数值">
                        <InputNumber
                          value={templateValue ?? undefined}
                          onChange={v => setTemplateValue(v ?? null)}
                          min={0}
                          step={0.01}
                          precision={2}
                          placeholder="可选"
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="姓名/前缀">
                        <Input
                          value={templateNamePrefix}
                          onChange={e => setTemplateNamePrefix(e.target.value)}
                          placeholder="卢照天"
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    {(templateType === 'invoice-month' || templateType === 'receipt-month') && (
                      <Col span={12}>
                        <Form.Item label="月份">
                          <DatePicker
                            picker={PICKER_TYPE.MONTH}
                            value={templateMonth}
                            onChange={d => setTemplateMonth(d)}
                            className="w-full"
                            allowClear={false}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                )}
              </Form>
            )}

            <Divider className="my-2" />

            <div className="rounded-lg bg-gray-50/80 p-4">
              <div className="mb-3">
                <Text type="secondary" className="text-sm">
                  生成文件名（不含扩展名）
                </Text>
                <div className="mt-1">
                  <Text strong copyable className="text-base">
                    {generatedName || '—'}
                  </Text>
                </div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  下载时文件名
                </Text>
                <div className="mt-1">
                  <Text strong copyable className="text-base">
                    {downloadFileName || (file ? file.name : '—')}
                  </Text>
                </div>
              </div>
            </div>
          </Space>
        )}
      </AppDrawer>

      <AppDrawer
        title={`预览：${file?.name ?? ''}`}
        placement="right"
        width="90vw"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        destroyOnClose
        styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}
      >
        <FilePreview file={file} height="75vh" showFileName />
      </AppDrawer>
    </>
  )
}

export default FileRenameDrawer
