import { useEffect, useMemo, useState, useRef } from 'react'
import { Empty, Spin, Typography, Tabs, Button } from 'antd'
import { FileUnknownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { renderAsync } from 'docx-preview'
import { pdfjs, Document, Page } from 'react-pdf'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { PREVIEW_TYPE } from '@/constants'
import type { FilePreviewProps } from '@/types'
import { getPreviewType } from '@/utils'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const { Text } = Typography

function FilePreview({
  file,
  height = 400,
  width = '100%',
  showFileName = true,
}: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [excelSheets, setExcelSheets] = useState<
    { key: string; label: string; data: unknown[][] }[]
  >([])
  const [pdfPage, setPdfPage] = useState(1)
  const [pdfTotal, setPdfTotal] = useState(0)
  const wordContainerRef = useRef<HTMLDivElement>(null)

  const supportType = useMemo(() => (file ? getPreviewType(file) : null), [file])

  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      setError(null)
      setExcelSheets([])
      setPdfPage(1)
      setPdfTotal(0)
      return
    }

    if (!supportType) {
      setObjectUrl(null)
      setError(
        `暂不支持预览该类型文件（${file.type || '未知'}），当前支持：图片、PDF、视频、音频、Excel、Word。`
      )
      return
    }

    setLoading(true)
    setError(null)
    setExcelSheets([])

    if (supportType === PREVIEW_TYPE.EXCEL) {
      file
        .arrayBuffer()
        .then(ab => {
          const wb = XLSX.read(ab)
          const items = wb.SheetNames.map((name: string) => {
            const ws = wb.Sheets[name]
            const aoa =
              ws && ws['!ref'] ? (XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][]) : []
            return { key: name, label: name, data: aoa }
          })
          setExcelSheets(items)
        })
        .catch(() => setError('Excel 解析失败'))
        .finally(() => setLoading(false))
      return
    }

    if (supportType === PREVIEW_TYPE.WORD) {
      file
        .arrayBuffer()
        .then(ab => {
          const container = wordContainerRef.current
          if (container) {
            container.innerHTML = ''
            renderAsync(ab, container, undefined, {
              experimental: true,
              inWrapper: false,
            }).finally(() => setLoading(false))
          } else {
            setLoading(false)
          }
        })
        .catch(() => {
          setError('Word 解析失败')
          setLoading(false)
        })
      return
    }

    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    setLoading(false)
    if (supportType === PREVIEW_TYPE.PDF) {
      setPdfPage(1)
      setPdfTotal(0)
    }
    return () => URL.revokeObjectURL(url)
  }, [file, supportType])

  if (!file) {
    return (
      <div
        className="flex-center rounded border border-dashed border-gray-300 bg-gray-50"
        style={{ height, width }}
      >
        <Empty description="暂无文件可预览" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-gray-50 p-4"
        style={{ height, width }}
      >
        <FileUnknownOutlined className="text-4xl text-gray-400" />
        <Text type="secondary">{error}</Text>
        {showFileName && (
          <Text type="secondary" className="text-sm">
            文件名：{file.name}
          </Text>
        )}
      </div>
    )
  }

  const waitingForContent =
    supportType === PREVIEW_TYPE.EXCEL
      ? excelSheets.length === 0
      : supportType !== PREVIEW_TYPE.WORD && !objectUrl
  if (loading && waitingForContent) {
    return (
      <div
        className="flex-center rounded border border-gray-200 bg-gray-50"
        style={{ height, width }}
      >
        <Spin tip="加载预览中..." />
      </div>
    )
  }

  const containerStyle = { height, width, overflow: 'auto' as const }

  const renderContent = () => {
    if (supportType === PREVIEW_TYPE.IMAGE && objectUrl) {
      return (
        <img
          src={objectUrl}
          alt={file.name}
          className="max-h-full max-w-full object-contain"
          style={{ maxHeight: height, display: 'block', margin: '0 auto' }}
        />
      )
    }
    if (supportType === PREVIEW_TYPE.PDF && objectUrl) {
      return (
        <div className="flex flex-col" style={{ height }}>
          <div className="flex shrink-0 items-center justify-center gap-2 border-b border-gray-200 bg-gray-50 py-1">
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              disabled={pdfPage <= 1}
              onClick={() => setPdfPage(p => Math.max(1, p - 1))}
            />
            <Typography.Text type="secondary" className="text-sm">
              {pdfPage} / {pdfTotal || '—'}
            </Typography.Text>
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              disabled={pdfPage >= pdfTotal}
              onClick={() => setPdfPage(p => Math.min(pdfTotal, p + 1))}
            />
          </div>
          <div className="flex-1 overflow-auto">
            <Document
              file={objectUrl}
              loading={<Spin className="flex justify-center py-20" />}
              onLoadSuccess={({ numPages }) => setPdfTotal(numPages)}
            >
              <Page
                pageNumber={pdfPage}
                loading={<Spin className="flex justify-center py-20" />}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="flex justify-center"
              />
            </Document>
          </div>
        </div>
      )
    }
    if (supportType === PREVIEW_TYPE.VIDEO && objectUrl) {
      return (
        <video
          src={objectUrl}
          controls
          controlsList="nodownload"
          className="max-h-full max-w-full"
          style={{ display: 'block', margin: '0 auto', maxHeight: height }}
        />
      )
    }
    if (supportType === PREVIEW_TYPE.AUDIO && objectUrl) {
      return (
        <div className="flex-center p-4" style={{ minHeight: height }}>
          <audio src={objectUrl} controls controlsList="nodownload" />
        </div>
      )
    }
    if (supportType === PREVIEW_TYPE.EXCEL && excelSheets.length > 0) {
      const tableStyle = {
        width: '100%' as const,
        borderCollapse: 'collapse' as const,
        fontSize: 14,
      }
      const thTdStyle = {
        border: '1px solid #e6e6e6',
        padding: '4px 8px',
        minWidth: 80,
      }
      return (
        <Tabs
          type="card"
          items={excelSheets.map(({ key, label, data }) => {
            const rows = data.length ? data : []
            const colCount = Math.max(0, ...rows.map((r: unknown[]) => r?.length ?? 0))
            const headerRow = rows[0] ?? []
            return {
              key,
              label,
              children: (
                <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                  <table style={tableStyle}>
                    {colCount > 0 && (
                      <thead>
                        <tr>
                          {Array.from({ length: colCount }, (_, i) => (
                            <th
                              key={i}
                              style={{
                                ...thTdStyle,
                                background: '#f5f5f5',
                                position: 'sticky',
                                top: 0,
                              }}
                            >
                              {String(headerRow[i] ?? '')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {rows.slice(1).map((row: unknown[], ri: number) => (
                        <tr key={ri}>
                          {Array.from({ length: colCount }, (_, ci) => (
                            <td key={ci} style={thTdStyle}>
                              {(row as unknown[])?.[ci] != null
                                ? String((row as unknown[])[ci])
                                : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            }
          })}
        />
      )
    }
    if (supportType === PREVIEW_TYPE.WORD) {
      return (
        <div
          ref={wordContainerRef}
          style={{ width: '100%', minHeight: height, overflow: 'auto', padding: 16 }}
        />
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {showFileName && (
        <Text type="secondary" className="text-sm">
          文件名：{file.name}
        </Text>
      )}
      <div className="rounded border border-gray-200 bg-white" style={containerStyle}>
        {renderContent()}
      </div>
    </div>
  )
}

export default FilePreview
