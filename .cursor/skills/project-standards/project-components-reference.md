# 项目组件（src/components）

开发时**优先使用** `src/components` 下的封装组件；无合适组件时再用 antd 原始组件或自定义实现。

**导入**：`import Xxx from '@/components/Xxx'`

---

## 1. DataTable

**路径**: `src/components/DataTable`  
基于 Ant Design Table，内置边框、斑马纹、空态与 loading 文案。

| 属性         | 类型      | 默认         | 说明                    |
| ------------ | --------- | ------------ | ----------------------- |
| `dataSource` | `T[]`     | `[]`         | 数据源                  |
| `loading`    | `boolean` | `false`      | 加载中                  |
| `bordered`   | `boolean` | `true`       | 显示边框                |
| `striped`    | `boolean` | `true`       | 斑马纹                  |
| `emptyText`  | `string`  | `'暂无数据'` | 空数据提示              |
| `autoHeight` | `boolean` | `false`      | 自适应高度（含 resize） |

支持透传 antd `TableProps`（如 `columns`、`rowKey`、`onChange` 等）。

```tsx
<DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" pagination={false} />
```

---

## 2. Pagination

**路径**: `src/components/Pagination`  
预设总数、快速跳转、每页条数选择及响应式。

| 属性              | 类型                       | 默认                     |
| ----------------- | -------------------------- | ------------------------ |
| `total`           | `number`                   | `0`                      |
| `current`         | `number`                   | `1`                      |
| `pageSize`        | `number`                   | `10`                     |
| `showTotal`       | `boolean`                  | `true`                   |
| `showQuickJumper` | `boolean`                  | `true`                   |
| `showSizeChanger` | `boolean`                  | `true`                   |
| `pageSizeOptions` | `string[]`                 | `['10','20','50','100']` |
| `onChange`        | `(page, pageSize) => void` | -                        |

```tsx
<Pagination
  total={total}
  current={page}
  pageSize={pageSize}
  onChange={(p, size) => {
    setPage(p)
    setPageSize(size)
  }}
/>
```

---

## 3. SearchBar

**路径**: `src/components/SearchBar`  
Card + 内联 Form，支持搜索/重置、可展开收起。

| 属性                 | 类型               | 说明            |
| -------------------- | ------------------ | --------------- |
| `fields`             | `SearchField[]`    | 搜索表单项配置  |
| `expandable`         | `boolean`          | 是否可展开/收起 |
| `defaultExpandCount` | `number`           | 默认展示字段数  |
| `onSearch`           | `(values) => void` | 搜索提交        |
| `onReset`            | `() => void`       | 重置            |
| `extra`              | `React.ReactNode`  | 额外操作区      |

**SearchField**: `name`, `label`, `placeholder`, `required`, `render?(form)`（不传则 Input）。

```tsx
<SearchBar
  fields={[{ name: 'keyword', label: '关键词', placeholder: '请输入' }]}
  expandable
  onSearch={v => fetchList({ ...params, ...v })}
  onReset={() => {}}
/>
```

---

## 4. TextButton

**路径**: `src/components/TextButton`  
`type="text"` 的 Button 封装，链接式无背景；支持 `forwardRef` 及透传 `ButtonProps`（除 `type`）。

```tsx
<TextButton onClick={handleEdit}>编辑</TextButton>
<TextButton danger onClick={handleDelete}>删除</TextButton>
```

---

## 5. BeforeUnload

**路径**: `src/components/BeforeUnload`  
页面离开确认：刷新/关闭用 `beforeunload`，路由切换用 `useBlocker` + Modal。

| 属性      | 类型      | 默认                    |
| --------- | --------- | ----------------------- |
| `when`    | `boolean` | -                       |
| `message` | `string`  | `'您有未保存的内容...'` |
| `title`   | `string`  | `'确认离开'`            |

```tsx
<BeforeUnload when={hasUnsavedChanges} />
```

---

## 6. FilePreview

**路径**: `src/components/FilePreview`  
预览本地文件：图片（jpeg/png/gif/webp/svg/bmp）与 PDF；传入 `File`。

| 属性           | 类型               | 默认     |
| -------------- | ------------------ | -------- |
| `file`         | `File \| null`     | -        |
| `height`       | `number \| string` | `400`    |
| `width`        | `number \| string` | `'100%'` |
| `showFileName` | `boolean`          | `true`   |

```tsx
<FilePreview file={file} height={420} showFileName />
```

---

## 7. PageDetail

**路径**: `src/components/PageDetail`  
详情页/内容页统一布局：标题、描述、可选返回按钮、标题右侧操作区、内容区。

| 属性               | 类型         | 默认 | 说明                         |
| ------------------ | ------------ | ---- | ---------------------------- |
| `title`            | `ReactNode`  | -    | 页面标题                     |
| `description`      | `ReactNode`  | -    | 标题下方描述（次要说明）     |
| `backTo`           | `string`     | -    | 返回目标路径，设置后显示返回 |
| `onBack`           | `() => void` | -    | 自定义返回回调               |
| `extra`            | `ReactNode`  | -    | 标题右侧操作区               |
| `children`         | `ReactNode`  | -    | 子内容                       |
| `contentClassName` | `string`     | `''` | 内容区域 className           |

```tsx
<PageDetail title="用户详情" description="查看用户信息" backTo="/user/list">
  <Card>...</Card>
</PageDetail>
```

---

## 8. ListPage

**路径**: `src/components/ListPage`  
列表页统一布局：标题、描述、标题右侧操作区、可选搜索栏（SearchBar）、主内容区。风格与 Fund / 房贷列表等保持一致。

| 属性             | 类型             | 说明                              |
| ---------------- | ---------------- | --------------------------------- |
| `title`          | `ReactNode`      | 页面标题                          |
| `description`    | `ReactNode`      | 标题下方描述（可选）              |
| `extra`          | `ReactNode`      | 标题右侧操作区（如新增、导出）    |
| `searchBarProps` | `SearchBarProps` | 传入则渲染 SearchBar（可选）      |
| `children`       | `ReactNode`      | 主内容（通常为 Card + DataTable） |
| `className`      | `string`         | 根节点 className（可选）          |

```tsx
<ListPage
  title="房贷计算器列表"
  description="管理房贷计算方案，数据保存在本地"
  extra={<Button type="primary" icon={<PlusOutlined />}>新增</Button>}
  searchBarProps={{ fields: [...], onSearch, onReset }}
>
  <Card size="small">
    <DataTable columns={columns} dataSource={list} rowKey="id" pagination={{...}} />
  </Card>
</ListPage>
```

---

## 9. ImagePreview

**路径**: `src/components/ImagePreview`  
图片缩略图 + 点击放大预览的统一封装，基于 antd `Image`，适合在表格中展示并快速查看大图。

| 属性      | 类型         | 默认         | 说明                     |
| --------- | ------------ | ------------ | ------------------------ |
| `src`     | `string`     | -            | 图片地址（必填）         |
| `alt`     | `string`     | `'图片预览'` | 图片替代文本             |
| `width`   | `number`     | `56`         | 缩略图宽度               |
| `height`  | `number`     | `56`         | 缩略图高度               |
| `...rest` | `ImageProps` | -            | 透传 antd Image 其它属性 |

```tsx
<ImagePreview src={imageUrl} alt="二维码" width={56} height={56} />
```

---

## 使用优先级

1. 列表页（标题+可选搜索+表格）→ `ListPage` + `DataTable`（+ 可选 `SearchBar` 通过 searchBarProps）
2. 表格+分页 → `DataTable` + `Pagination`
3. 顶部搜索区 → `SearchBar`
4. 表格内/操作列文字按钮 → `TextButton`
5. 页面离开提示 → `BeforeUnload`
6. 文件预览（图片/PDF）→ `FilePreview`
7. 详情页/设置页/工具页统一布局 → `PageDetail`
8. 图片缩略图点击放大预览 → `ImagePreview`
9. 无现成组件 → antd 或 `src` 下其他模块

## 扩展组件

新增通用组件：放在 `src/components/<ComponentName>/index.tsx`，导出 props 类型与 default；并更新 **project-components-reference.md** 与 **docs/components** 文档（见 component-doc-sync-reference.md）。
