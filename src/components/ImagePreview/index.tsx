import { Image } from 'antd'
import type { ImageProps } from 'antd'

interface ImagePreviewProps extends Omit<ImageProps, 'src'> {
  src: string
  alt?: string
  width?: number
  height?: number
}

function ImagePreview({
  src,
  alt = '图片预览',
  width = 56,
  height = 56,
  ...rest
}: ImagePreviewProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: 'cover', borderRadius: 6 }}
      preview={{ mask: '点击预览大图' }}
      {...rest}
    />
  )
}

export type { ImagePreviewProps }
export default ImagePreview
