# 代码规范（Code Standards）

## Code Style

**Prettier** (`.prettierrc.json`): 无分号、单引号、2 空格、100 字符宽、单参数箭头函数无括号、`lf`。

**ESLint 9** 扁平配置：TypeScript ESLint、React Hooks、React Refresh、Prettier 集成。

**TS** 所有 TS 类型全部放在 `types/` 下

## File Structure

- **组件**: `ComponentName/index.tsx`（可选 `index.ts` 再导出、`types.ts`）
- **页面**: `PageName/index.tsx` + `components/`、`utils/`
- **文件**: 尽可能的拆分页面

## Import Order

1. React → 2. 第三方 (antd 等) → 3. 内部组件 → 4. Utils/Hooks → 5. Types → 6. Styles

**路径**：一律用 `@/` 别名，不用相对路径（如 `@/components/DataTable`）。

## Component Patterns

- 函数组件 + TypeScript；事件处理用 `useCallback`，昂贵计算用 `useMemo`
- 命名：组件/文件/目录均 PascalCase 且与组件名一致

## Best Practices

- ✅ 用 TypeScript、跟 Prettier、用 `@/`、组件小而专注
- ❌ 不用 class 组件、不忽略 TS 报错、不用相对路径（当 `@/` 可用时）

## 示例

```typescript
// 导入顺序示例
import { useState, useCallback } from 'react'
import { Button, Table } from 'antd'
import DataTable from '@/components/DataTable'
import type { DataType } from '@/types'

interface Props {
  data: DataType[]
  onRefresh: () => void
}

function MyPage({ data, onRefresh }: Props) {
  const handleRefresh = useCallback(async () => {
    await onRefresh()
  }, [onRefresh])
  return <DataTable dataSource={data} ... />
}
export default MyPage
```
