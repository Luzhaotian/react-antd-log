import dayjs, { type Dayjs } from 'dayjs'
import type {
  FileRenameItem,
  FileRenameTemplateConfig,
  StoredItem,
  TemplateType,
} from '@/types'
import { idbGet, idbSet, idbDel } from '@/utils'
import {
  IDB_KEYS,
  PICKER_TYPE,
  DEFAULT_EXPORT_FILENAME,
  DATE_NUM_TYPE,
  TEMPLATE_VALUE_TYPE,
} from '@/constants'

/** 默认模板配置（与抽屉默认值一致） */
export function getDefaultTemplateConfig(): FileRenameTemplateConfig {
  const d = defaultDate()
  const monthStart = dayjs().startOf(PICKER_TYPE.MONTH)
  return {
    templateType: TEMPLATE_VALUE_TYPE.DATE_NUM,
    templateDate: d.toISOString(),
    templateValue: null,
    templateMonth: monthStart.toISOString(),
    templateCustom: '',
    templateNamePrefix: DEFAULT_EXPORT_FILENAME,
    templateDateNumType: DATE_NUM_TYPE.ALIPAY,
  }
}

/** 上月 28 日 */
export function defaultDate(): Dayjs {
  return dayjs().subtract(1, PICKER_TYPE.MONTH).date(28).startOf(PICKER_TYPE.DAY)
}

export function getExtension(filename: string): string {
  const i = filename.lastIndexOf('.')
  return i > 0 ? filename.slice(i) : ''
}

export function buildFileName(
  templateType: TemplateType,
  params: {
    namePrefix?: string
    dateNumType?: string
    date?: Dayjs
    value?: number
    month?: Dayjs
    custom?: string
  }
): string {
  const prefix = (params.namePrefix ?? DEFAULT_EXPORT_FILENAME).trim() || DEFAULT_EXPORT_FILENAME
  switch (templateType) {
    case TEMPLATE_VALUE_TYPE.DATE_NUM: {
      const typeStr = (params.dateNumType ?? DATE_NUM_TYPE.ALIPAY).trim() || DATE_NUM_TYPE.ALIPAY
      const mid = `${prefix}-${typeStr}`
      const dateStr = params.date ? params.date.format('YYYY-MM-DD') : ''
      const numStr = params.value != null ? Number(params.value).toFixed(2) : ''
      const suffix = numStr !== '' ? `${dateStr}_${numStr}` : dateStr
      return suffix ? `${mid}-${suffix}` : mid
    }
    case TEMPLATE_VALUE_TYPE.INVOICE_MONTH: {
      const monthStr = params.month ? params.month.format('MM') + '月' : ''
      return [prefix, 'Invoice', monthStr].filter(Boolean).join('-')
    }
    case TEMPLATE_VALUE_TYPE.RECEIPT_MONTH: {
      const monthStr = params.month ? params.month.format('MM') + '月' : ''
      return [prefix, 'Receipt', monthStr].filter(Boolean).join('-')
    }
    case TEMPLATE_VALUE_TYPE.CUSTOM:
      return params.custom ?? ''
    default:
      return prefix
  }
}

export function buildDownloadFileName(file: File, generatedName: string): string {
  const ext = getExtension(file.name)
  const base = generatedName.trim() || file.name.replace(ext, '') || 'download'
  return base + (ext ? ext : '')
}

export function createItem(file: File): FileRenameItem {
  const templateConfig = getDefaultTemplateConfig()
  const baseName = buildFileName(TEMPLATE_VALUE_TYPE.DATE_NUM, {
    namePrefix: templateConfig.templateNamePrefix,
    dateNumType: templateConfig.templateDateNumType,
    date: dayjs(templateConfig.templateDate),
    value: templateConfig.templateValue ?? undefined,
  })
  const newName = buildDownloadFileName(file, baseName)
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    newName,
    templateConfig,
  }
}

export async function loadList(): Promise<FileRenameItem[]> {
  const raw = await idbGet<StoredItem[]>(IDB_KEYS.FILE_RENAME_LIST)
  if (!raw?.length) return []
  const items: FileRenameItem[] = []
  for (const it of raw) {
    try {
      const file = new File([it.fileData], it.originalName, {
        type: it.fileType ?? '',
      })
      items.push({
        id: it.id,
        file,
        newName: it.newName,
        ...(it.templateConfig && { templateConfig: it.templateConfig }),
      })
    } catch {
      // skip corrupted entry
    }
  }
  return items
}

export async function saveList(list: FileRenameItem[]): Promise<void> {
  if (list.length === 0) {
    await idbDel(IDB_KEYS.FILE_RENAME_LIST)
    return
  }
  const stored: StoredItem[] = await Promise.all(
    list.map(async item => ({
      id: item.id,
      originalName: item.file.name,
      newName: item.newName,
      fileType: item.file.type || undefined,
      fileData: await item.file.arrayBuffer(),
      ...(item.templateConfig && { templateConfig: item.templateConfig }),
    }))
  )
  await idbSet(IDB_KEYS.FILE_RENAME_LIST, stored)
}
