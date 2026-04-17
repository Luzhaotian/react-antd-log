import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Card, Button, Space, Tag, Tooltip, AutoComplete, message } from 'antd'
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { searchFund } from '@/api/fund'
import type { FundSearchResult, FundSearchProps } from '@/types'

// 防抖 hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

function FundSearch({ fundCodes, funds, onFundCodesChange, onRefresh, loading }: FundSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([])
  const [searching, setSearching] = useState(false)

  // 防抖搜索关键词（500ms）
  const debouncedKeyword = useDebounce(inputValue, 500)

  // 缓存搜索结果，用于选中时获取基金名称
  const searchResultsRef = useRef<Map<string, FundSearchResult>>(new Map())

  // 基金代码到名称的映射
  const fundNameMap = useMemo(() => {
    return new Map(funds.map(fund => [fund.FCODE, fund.SHORTNAME]))
  }, [funds])

  // 搜索联想
  useEffect(() => {
    const fetchSuggestions = async () => {
      // 如果输入为空或包含逗号（批量输入模式），不搜索
      if (
        !debouncedKeyword.trim() ||
        debouncedKeyword.includes(',') ||
        debouncedKeyword.includes('，')
      ) {
        setOptions([])
        return
      }

      setSearching(true)
      try {
        const results = await searchFund(debouncedKeyword)
        // 缓存搜索结果
        results.forEach(item => {
          searchResultsRef.current.set(item.CODE, item)
        })
        // 转换为 AutoComplete 选项
        setOptions(
          results.slice(0, 10).map(item => ({
            value: item.CODE,
            label: (
              <div className="flex justify-between items-center">
                <span>
                  <span className="font-mono text-blue-600 mr-2">{item.CODE}</span>
                  <span>{item.NAME}</span>
                </span>
                <span className="text-gray-400 text-xs">{item.FundBaseInfo?.FTYPE || ''}</span>
              </div>
            ),
          }))
        )
      } catch {
        setOptions([])
      } finally {
        setSearching(false)
      }
    }

    fetchSuggestions()
  }, [debouncedKeyword])

  // 添加基金（支持手动输入和选择）
  const addFundCodes = useCallback(
    (codes: string[]) => {
      const existingCodes = codes.filter(code => fundCodes.includes(code))
      const newCodes = codes.filter(code => !fundCodes.includes(code))

      // 单个代码且已存在
      if (codes.length === 1 && existingCodes.length === 1) {
        message.warning(`基金 ${existingCodes[0]} 已存在`)
        return
      }

      // 多个代码全部已存在
      if (newCodes.length === 0) {
        message.warning(`基金 ${existingCodes.join('、')} 均已存在`)
        return
      }

      onFundCodesChange([...fundCodes, ...newCodes])
      setInputValue('')
      setOptions([])

      // 多个代码，部分已存在
      if (existingCodes.length > 0) {
        message.success(
          `已添加 ${newCodes.length} 个基金，${existingCodes.join('、')} 已存在已跳过`
        )
      } else {
        message.success(`已添加 ${newCodes.length} 个基金`)
      }
    },
    [fundCodes, onFundCodesChange]
  )

  // 从联想选择
  const handleSelect = useCallback(
    (value: string) => {
      addFundCodes([value])
    },
    [addFundCodes]
  )

  // 手动添加
  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) {
      message.warning('请输入基金代码')
      return
    }

    // 支持逗号分隔的多个代码
    const codes = trimmed.split(/[,，\s]+/).filter(Boolean)

    // 验证所有代码格式（基金代码为6位数字）
    const invalidCodes = codes.filter(code => !/^\d{6}$/.test(code))
    if (invalidCodes.length > 0) {
      message.warning(
        invalidCodes.length === 1
          ? `"${invalidCodes[0]}" 不是有效的基金代码（6位数字），请从联想列表中选择`
          : `存在无效的基金代码：${invalidCodes.join('、')}，基金代码应为6位数字`
      )
      return
    }

    addFundCodes(codes)
  }, [inputValue, addFundCodes])

  const handleRemove = useCallback(
    (code: string) => {
      onFundCodesChange(fundCodes.filter(c => c !== code))
    },
    [fundCodes, onFundCodesChange]
  )

  const handleClearAll = useCallback(() => {
    onFundCodesChange([])
  }, [onFundCodesChange])

  return (
    <Card className="mb-4" size="small">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <AutoComplete
            value={inputValue}
            options={options}
            onSelect={handleSelect}
            onChange={setInputValue}
            placeholder="输入基金代码/名称/拼音，多个用逗号分隔"
            style={{ width: 300 }}
            allowClear
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} loading={searching}>
            添加
          </Button>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            刷新数据
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleClearAll}
            danger
            disabled={fundCodes.length === 0}
          >
            清空
          </Button>
        </Space>

        <div className="flex-1 text-right text-gray-500">
          共监控 <span className="text-blue-600 font-semibold">{fundCodes.length}</span> 只基金
        </div>
      </div>

      {fundCodes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {fundCodes.map(code => {
              const fundName = fundNameMap.get(code)
              return (
                <Tooltip key={code} title={fundName || '加载中...'}>
                  <Tag closable onClose={() => handleRemove(code)} className="font-mono">
                    {code}
                  </Tag>
                </Tooltip>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

export default FundSearch
