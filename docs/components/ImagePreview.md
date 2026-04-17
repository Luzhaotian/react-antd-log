# ImagePreview

## 说明

`ImagePreview` 是基于 Ant Design `Image` 的轻量二次封装，统一项目内图片缩略图 + 点击放大预览的行为。

## 路径

`src/components/ImagePreview/index.tsx`

## Props

| 属性      | 类型         | 默认值       | 说明                     |
| --------- | ------------ | ------------ | ------------------------ |
| `src`     | `string`     | -            | 图片地址（必填）         |
| `alt`     | `string`     | `'图片预览'` | 图片替代文本             |
| `width`   | `number`     | `56`         | 缩略图宽度               |
| `height`  | `number`     | `56`         | 缩略图高度               |
| `...rest` | `ImageProps` | -            | 透传 antd Image 其它属性 |

## 示例

```tsx
import ImagePreview from '@/components/ImagePreview'

;<ImagePreview src={imageUrl} alt="二维码" width={56} height={56} />
```
