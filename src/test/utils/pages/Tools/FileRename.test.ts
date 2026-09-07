import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  buildDownloadFileName,
  buildFileName,
  getExtension,
} from '@/utils/pages/Tools/FileRename'
import { DATE_NUM_TYPE, DEFAULT_EXPORT_FILENAME, TEMPLATE_VALUE_TYPE } from '@/constants'

describe('FileRename 工具函数', () => {
  it('getExtension 取扩展名', () => {
    expect(getExtension('a.pdf')).toBe('.pdf')
    expect(getExtension('archive.tar.gz')).toBe('.gz')
    expect(getExtension('noext')).toBe('')
    expect(getExtension('.gitignore')).toBe('')
  })

  it('buildFileName DATE_NUM', () => {
    const name = buildFileName(TEMPLATE_VALUE_TYPE.DATE_NUM, {
      namePrefix: '测试',
      dateNumType: DATE_NUM_TYPE.ALIPAY,
      date: dayjs('2026-03-28'),
      value: 12.5,
    })
    expect(name).toBe('测试-支付宝账单-2026-03-28_12.50')
  })

  it('buildFileName 发票/收据月份与自定义', () => {
    expect(
      buildFileName(TEMPLATE_VALUE_TYPE.INVOICE_MONTH, {
        namePrefix: '张三',
        month: dayjs('2026-09-01'),
      })
    ).toBe('张三-Invoice-09月')

    expect(
      buildFileName(TEMPLATE_VALUE_TYPE.RECEIPT_MONTH, {
        namePrefix: '张三',
        month: dayjs('2026-01-01'),
      })
    ).toBe('张三-Receipt-01月')

    expect(buildFileName(TEMPLATE_VALUE_TYPE.CUSTOM, { custom: 'my-file' })).toBe('my-file')
  })

  it('空前缀回退默认名', () => {
    const name = buildFileName(TEMPLATE_VALUE_TYPE.DATE_NUM, {
      namePrefix: '   ',
      date: dayjs('2026-01-01'),
    })
    expect(name.startsWith(DEFAULT_EXPORT_FILENAME)).toBe(true)
  })

  it('buildDownloadFileName 保留原扩展名', () => {
    const file = new File(['x'], 'origin.PDF', { type: 'application/pdf' })
    expect(buildDownloadFileName(file, '新名字')).toBe('新名字.PDF')
    expect(buildDownloadFileName(file, '  ')).toBe('origin.PDF')
  })
})
