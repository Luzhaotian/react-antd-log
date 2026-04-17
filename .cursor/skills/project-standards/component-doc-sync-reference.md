# 组件文档同步

当 `src/components` 有**新增、修改或删除**组件时，必须同步：

1. **docs/components/<ComponentName>.md** — 组件文档
2. **project-components-reference.md** — 对应章节（路径、props、示例）

## 目录对应

```
src/components/<ComponentName>/index.tsx  →  docs/components/<ComponentName>.md
```

## 文档模板（docs/components）

```markdown
# <ComponentName> 组件

<一句话简介>

## 引入方式

\`\`\`tsx
import <ComponentName> from '@/components/<ComponentName>'
\`\`\`

## 基本用法

\`\`\`tsx
<示例>
\`\`\`

## API

| 参数 | 说明 | 类型 | 默认值 |

## 功能特性 / 高级用法 / 注意事项 / 更新日志
```

## 同步检查清单

- [ ] `docs/components/<ComponentName>.md` 已更新
- [ ] API 表格与组件代码一致
- [ ] 示例可运行
- [ ] 更新日志已添加
- [ ] project-components-reference.md 对应章节已更新（有重大变更时）

## 删除组件时

1. 删除 `docs/components/<ComponentName>.md`
2. 更新 `docs/components-usage.md`（如有引用）
3. 从 project-components-reference.md 中移除对应章节

## 相关路径

- 组件源码: `src/components/`
- 组件文档: `docs/components/`
- 使用指南: `docs/components-usage.md`
