import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { InboxOutlined } from '@ant-design/icons'

interface FileUploaderProps {
  onFileUpload: (content: string, fileName: string) => void
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]
      if (!file) return

      // 验证文件类型
      const validExtensions = ['.md', '.markdown', '.txt']
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      if (!validExtensions.includes(ext)) {
        setError('请上传 .md、.markdown 或 .txt 文件')
        return
      }

      // 验证文件大小（最大 1MB）
      if (file.size > 1024 * 1024) {
        setError('文件大小不能超过 1MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        if (!content.trim()) {
          setError('文件内容为空')
          return
        }
        setFileName(file.name)
        onFileUpload(content, file.name)
      }
      reader.onerror = () => {
        setError('读取文件失败')
      }
      reader.readAsText(file)
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md', '.markdown'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="ai-resume-file-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''} ${fileName ? 'has-file' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="dropzone-content">
            <InboxOutlined className="dropzone-icon" />
            <p>松开以上传文件</p>
          </div>
        ) : fileName ? (
          <div className="dropzone-content">
            <span className="dropzone-icon">✅</span>
            <p className="file-name">{fileName}</p>
            <p className="dropzone-hint">点击或拖拽替换文件</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <InboxOutlined className="dropzone-icon" />
            <p className="dropzone-title">上传 Markdown 文件</p>
            <p className="dropzone-hint">拖拽 .md 文件到此处，或点击选择文件</p>
            <p className="dropzone-hint">支持 .md、.markdown、.txt 格式，最大 1MB</p>
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
