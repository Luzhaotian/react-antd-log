import type { Form } from 'antd'

/**
 * 工具相关类型定义
 */

/** CodeCompress 代码压缩类型（与 constants/tools COMPRESS_TYPE 一致） */
export type CompressType = 'json' | 'javascript' | 'css' | 'html'

/** FileRename 文件重命名项 */
export interface FileRenameItem {
  /** ID */
  id: string
  /** 文件 */
  file: File
  /** 新文件名 */
  newName: string
  /** 命名模板配置，编辑时回填、保存时一并持久化 */
  templateConfig?: FileRenameTemplateConfig
}

/** 存储项 */
export interface StoredItem {
  /** ID */
  id: string
  /** 原始文件名 */
  originalName: string
  /** 新文件名 */
  newName: string
  /** 文件类型 */
  fileType?: string
  /** 文件数据 */
  fileData: ArrayBuffer
  /** 命名模板配置，编辑时回填、保存时一并持久化 */
  templateConfig?: FileRenameTemplateConfig
}

/** 模板值类型（与 constants/tools TEMPLATE_VALUE_TYPE 一致） */
export type TemplateType = 'date-num' | 'invoice-month' | 'receipt-month' | 'custom'

/** 文件重命名模板配置（可序列化，用于持久化与回填） */
export interface FileRenameTemplateConfig {
  /** 模板类型 */
  templateType: TemplateType
  /** 模板日期 */
  templateDate: string | null
  /** 模板值 */
  templateValue: number | null
  /** 模板月份 */
  templateMonth: string | null
  /** 模板自定义 */
  templateCustom: string
  /** 模板名称前缀 */
  templateNamePrefix: string
  /** 模板日期数字类型 */
  templateDateNumType: string
}

/** 组件尺寸类型（与 constants/tools COMPONENT_SIZE_TYPE 一致） */
export type ComponentSize = 'small' | 'middle' | 'large'

/** 导出弹窗组件属性 */
export interface ExportModalProps {
  /** 是否打开 */
  open: boolean
  /** 是否加载中 */
  loading: boolean
  /** 列表 */
  list: FileRenameItem[]
  /** 表单 */
  form: ReturnType<typeof Form.useForm>[0]
  /** 点击导出时传入当前选中的项 id 列表，仅导出选中项 */
  onOk: (selectedIds: string[]) => void
  /** 点击取消时回调 */
  onCancel: () => void
}

/** 文件重命名表格处理器 */
export interface FileRenameTableHandlers {
  /** 预览回调 */
  handlePreview: (record: FileRenameItem) => void
  /** 编辑回调 */
  handleEdit: (record: FileRenameItem) => void
  /** 复制回调 */
  handleCopy: (newName: string) => void
  /** 删除回调 */
  handleDelete: (record: FileRenameItem) => void
}

/** 文件重命名抽屉保存 payload（新文件名 + 完整模板配置） */
export type FileRenameSavePayload = { newName: string } & FileRenameTemplateConfig

/** 文件重命名抽屉组件属性 */
export interface FileRenameDrawerProps {
  /** 是否打开 */
  open: boolean
  /** 项 */
  item: FileRenameItem | null
  /** 关闭回调 */
  onClose: () => void
  /** 保存回调 */
  onSave: (payload: FileRenameSavePayload) => void
  /** 组件尺寸 */
  componentSize?: ComponentSize
}

/** JsonViewer 相关类型 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/** JsonViewer 属性项 */
export interface PropertyItemProps {
  /** 键名 */
  keyName: string
  /** 值 */
  value: JsonValue
  /** 深度 */
  depth: number
  /** 是否为数组项 */
  isArrayItem?: boolean
  /** 索引 */
  index?: number
  /** 搜索关键词 */
  searchKeyword?: string
}

/** JsonViewer 卡片项 */
export interface JsonCardProps {
  /** 标题 */
  title: string
  /** 数据 */
  data: JsonValue
  /** 搜索关键词 */
  searchKeyword?: string
}

/** 深度颜色配置 */
export interface DepthColors {
  /** 条形背景颜色 */
  barBg: string
  /** 强调颜色 */
  accent: string
  /** 边框颜色 */
  border: string
}

/** JsonViewer 项头 */
export interface ItemHeaderProps {
  /** 深度 */
  depth: number
  /** 值类型 */
  valueType: string
  /** 键名 */
  keyName: string
  /** 是否为数组项 */
  isArrayItem: boolean
  /** 索引 */
  index?: number
  /** 摘要 */
  summary: string | null
  /** 深度颜色配置 */
  depthColors: DepthColors
  /** 是否匹配 */
  isMatch: boolean
}

/** QrCode 二维码管理项 */
export interface QrCodeItem {
  /** ID */
  id: string
  /** 文本 */
  text: string
  /** 图片 URL */
  imageUrl: string
  /** 创建时间戳 */
  createdAt: number
  /** 更新时间戳 */
  updatedAt: number
}

/** QrCode 表单值 */
export interface QrFormValues {
  /** 文本 */
  text: string
}

/** QrCode 表格属性 */
export interface QrCodeTableProps {
  /** 是否加载中 */
  loading: boolean
  /** 数据源 */
  dataSource: QrCodeItem[]
  /** 编辑回调 */
  onEdit: (record: QrCodeItem) => void
  /** 删除回调 */
  onDelete: (id: string) => void
}

/** QrCode 弹窗属性 */
export interface QrCodeModalProps {
  /** 是否打开 */
  open: boolean
  /** 是否加载中 */
  saving: boolean
  /** 编辑记录 */
  editingRecord: QrCodeItem | null
  /** 表单 */
  form: ReturnType<typeof Form.useForm<QrFormValues>>[0]
  /** 取消回调 */
  onCancel: () => void
  /** 提交回调 */
  onSubmit: () => void
}
