# FilePreview 组件

用于在页面内预览本地文件，支持：**图片**（jpeg/png/gif/webp/svg/bmp/avif）、**PDF**、**视频**（mp4/webm/quicktime）、**音频**（mpeg/aac/ogg/flac/wav/webm）、**Excel**（.xlsx/.xls 等）、**Word**（.docx）。传入 `File` 对象即可展示预览，无文件或不支持类型时显示空态或提示。Excel/Word 使用 xlsx、docx-preview 插件渲染。

## 引入方式

```tsx
import FilePreview from '@/components/FilePreview'
```

## 基本用法

```tsx
const [file, setFile] = useState<File | null>(null)

<Upload beforeUpload={(f) => { setFile(f); return false }} maxCount={1}>
  <Button>选择文件</Button>
</Upload>
<FilePreview file={file} />
```

## API

| 参数           | 说明                             | 类型               | 默认值   |
| -------------- | -------------------------------- | ------------------ | -------- |
| `file`         | 要预览的文件，为 null 时显示空态 | `File \| null`     | -        |
| `height`       | 预览区域高度                     | `number \| string` | `400`    |
| `width`        | 预览区域宽度                     | `number \| string` | `'100%'` |
| `showFileName` | 是否显示文件名                   | `boolean`          | `true`   |

## 功能特性

- ✅ **图片预览**：jpeg、png、gif、webp、svg、bmp、avif，使用 `<img>` 展示
- ✅ **PDF 预览**：`<iframe>` 内嵌浏览器原生 PDF
- ✅ **视频预览**：mp4、webm、quicktime，使用 `<video>` 控件
- ✅ **音频预览**：mpeg、aac、ogg、flac、wav、webm，使用 `<audio>` 控件
- ✅ **Excel 预览**：xlsx 解析，多 Sheet 以 Tabs + 表格展示
- ✅ **Word 预览**：docx-preview 渲染 .docx
- ✅ **空态**：无文件时显示「暂无文件可预览」
- ✅ **不支持类型**：非上述类型时显示友好提示
- ✅ **自动释放**：组件卸载或文件变更时自动 `URL.revokeObjectURL`

## 高级用法

### 自定义尺寸

```tsx
<FilePreview file={file} height={500} width="100%" />
<FilePreview file={file} height="70vh" />
```

### 隐藏文件名

```tsx
<FilePreview file={file} showFileName={false} />
```

## 注意事项

1. 支持类型：图片、PDF、视频、音频、Excel、Word；其他类型会显示「暂不支持预览该类型文件」。
2. Excel/Word 依赖 `xlsx`、`docx-preview`，大文件加载时组件内会显示「加载预览中...」。
3. 仅适用于本地 `File`/`Blob`，不适用于远程 URL（需先 fetch 成 Blob 再传入）。

## 更新日志

- **v1.0.0** (2026-02-03)
  - 初始版本：支持图片与 PDF 预览，空态与不支持类型提示。
