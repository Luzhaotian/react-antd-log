import { useRef, useCallback, useState } from 'react'
import { Button, Space } from 'antd'
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ResumeData, ResumeTemplate } from '@/types'
import { renderResume } from '../services/resumeRenderer'

interface ResumePreviewProps {
  resumeData: ResumeData | null
  template: ResumeTemplate
  isLoading: boolean
}

export default function ResumePreview({ resumeData, template, isLoading }: ResumePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = useCallback(async () => {
    if (!iframeRef.current?.contentDocument?.body) return

    setExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')

      const canvas = await html2canvas(iframeRef.current.contentDocument.body, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = resumeData?.personalInfo?.name
        ? `${resumeData.personalInfo.name}_简历.pdf`
        : '简历.pdf'
      pdf.save(fileName)
    } catch (err) {
      console.error('导出 PDF 失败:', err)
    } finally {
      setExporting(false)
    }
  }, [resumeData])

  const handlePrint = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.print()
  }, [])

  if (isLoading) {
    return (
      <div className="ai-resume-preview">
        <div className="preview-header">
          <h3 className="component-title">📄 简历预览</h3>
        </div>
        <div className="preview-loading">
          <div className="loading-spinner" />
          <p>AI 正在解析您的简历内容...</p>
          <p className="loading-hint">这可能需要几秒钟时间</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="ai-resume-preview">
        <div className="preview-header">
          <h3 className="component-title">📄 简历预览</h3>
        </div>
        <div className="preview-empty">
          <span className="empty-icon">📝</span>
          <p>上传 Markdown 文件并配置 AI 后</p>
          <p>生成的简历将在此处预览</p>
        </div>
      </div>
    )
  }

  const html = renderResume(resumeData, template)

  return (
    <div className="ai-resume-preview">
      <div className="preview-header">
        <h3 className="component-title">📄 简历预览</h3>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            打印
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            loading={exporting}
          >
            {exporting ? '导出中...' : '导出 PDF'}
          </Button>
        </Space>
      </div>
      <div className="preview-frame-wrapper">
        <iframe
          ref={iframeRef}
          className="preview-frame"
          srcDoc={html}
          title="简历预览"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}
