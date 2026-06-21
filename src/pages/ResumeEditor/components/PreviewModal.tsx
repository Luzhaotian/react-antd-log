import { Modal } from 'antd'
import type { ResumeData } from '../types'
import { renderResumeToHtml } from '../utils/export'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  resume: ResumeData
}

export default function PreviewModal({ open, onClose, resume }: PreviewModalProps) {
  const html = renderResumeToHtml(resume)

  return (
    <Modal title="简历预览" open={open} onCancel={onClose} width={860} footer={null} destroyOnClose>
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
        <iframe
          srcDoc={html}
          title="简历预览"
          sandbox="allow-same-origin"
          style={{
            width: '100%',
            height: 600,
            border: 'none',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </Modal>
  )
}
