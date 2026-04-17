import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MortgageExportData } from '@/types'
import { PDF_FONT_NAME, FONT_FILE_NAME } from '@/constants'

/** 缓存字体 base64（jspdf-font 内置），只加载一次 */
let fontBase64Cache: string | null = null

async function loadChineseFontBase64(): Promise<string> {
  if (fontBase64Cache) return fontBase64Cache
  const mod = await import('jspdf-font/fonts/SongtiSCBlack.js')
  fontBase64Cache = mod.default as string
  return fontBase64Cache
}

function registerChineseFontToDoc(doc: jsPDF, fontBase64: string): void {
  doc.addFileToVFS(FONT_FILE_NAME, fontBase64)
  doc.addFont(FONT_FILE_NAME, PDF_FONT_NAME, 'normal')
}

const NUM_FMT = (n: number): string =>
  n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 生成导出文件名前缀（不含扩展名） */
export function getExportFileNameBase(name: string): string {
  const safe = (name || '导出').replace(/[/\\?*[\]]/g, '_')
  return `房贷计算_${safe}_${Date.now()}`
}

/** 导出为 XLSX */
export function exportMortgageToXLSX(data: MortgageExportData): void {
  const { params, monthlyList } = data
  const paramRows: (string | number)[][] = [
    ['计算参数', ''],
    ['名称/备注', params.name],
    ['贷款类型', params.loanTypeLabel],
    ['省/市/区', params.city],
    ['平米数（㎡）', params.areaSquareMeters],
    ['每平米价格（元/㎡）', params.pricePerSquareMeter],
    ['首付（元）', params.downPayment],
    ['贷款金额（元）', params.loanAmount],
    ['总金额（元）', params.totalAmount],
    ['年利率（%）', params.annualRate],
    ['贷款期限（月）', params.termMonths],
    ['还款方式', params.repayTypeLabel],
    [],
    ['期数', '月供（元）', '本金（元）', '利息（元）', '剩余本金（元）'],
  ]
  const dataRows = monthlyList.map(item => [
    item.period,
    item.monthlyPayment,
    item.principal,
    item.interest,
    item.remainingPrincipal,
  ])
  const aoa = [...paramRows, ...dataRows]
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '房贷计算明细')
  XLSX.writeFile(wb, `${getExportFileNameBase(params.name)}.xlsx`)
}

/** 导出为 PDF（需先加载中文字体，避免乱码） */
export async function exportMortgageToPDF(data: MortgageExportData): Promise<void> {
  const { params, monthlyList } = data
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const fontBase64 = await loadChineseFontBase64()
  registerChineseFontToDoc(doc, fontBase64)
  doc.setFont(PDF_FONT_NAME, 'normal')

  const margin = 14
  let y = 20

  doc.setFontSize(14)
  doc.text('房贷计算明细', margin, y)
  y += 10

  doc.setFontSize(10)
  const paramLines = [
    `名称/备注：${params.name}`,
    `贷款类型：${params.loanTypeLabel}`,
    `省/市/区：${params.city}`,
    `平米数（㎡）：${params.areaSquareMeters}`,
    `每平米价格（元/㎡）：${params.pricePerSquareMeter}`,
    `首付（元）：${params.downPayment}`,
    `贷款金额（元）：${params.loanAmount}`,
    `总金额（元）：${params.totalAmount}`,
    `年利率（%）：${params.annualRate}`,
    `贷款期限（月）：${params.termMonths}`,
    `还款方式：${params.repayTypeLabel}`,
  ]
  paramLines.forEach(line => {
    doc.text(line, margin, y)
    y += 6
  })
  y += 6

  autoTable(doc, {
    startY: y,
    head: [['期数', '月供（元）', '本金（元）', '利息（元）', '剩余本金（元）']],
    body: monthlyList.map(item => [
      String(item.period),
      NUM_FMT(item.monthlyPayment),
      NUM_FMT(item.principal),
      NUM_FMT(item.interest),
      NUM_FMT(item.remainingPrincipal),
    ]),
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, font: PDF_FONT_NAME },
    headStyles: { fillColor: [66, 139, 202], font: PDF_FONT_NAME },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  doc.save(`${getExportFileNameBase(params.name)}.pdf`)
}
