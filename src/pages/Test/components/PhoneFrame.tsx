/**
 * 测试页共用：402×874 手机展示框 + 灵动岛 + 状态栏 + Home Indicator；内层 375 逻辑宽。
 */
import type { ReactNode } from 'react'

/** 874 / 16 */
export const PHONE_H_EM = 54.625
/** 402 / 16 */
export const PHONE_W_EM = 25.125

const font =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export function StatusBar() {
  return (
    <header
      style={{
        height: '2.75em',
        width: '100%',
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5em',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1.0625em',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: '#000000',
        }}
      >
        9:41
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375em',
        }}
      >
        <span
          style={{
            width: '0.375em',
            height: '0.375em',
            borderRadius: '50%',
            background: '#ff9500',
            flexShrink: 0,
          }}
          title="Recording"
        />
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden style={{ display: 'block' }}>
          <path
            fill="#000000"
            d="M1 7h2v3H1V7zm4-2h2v5H5V5zm4-2h2v7H9V3zm4-2h2v9h-2V1z"
          />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden style={{ display: 'block' }}>
          <path
            fill="#000000"
            d="M8 2.2c2.3 1.5 4.3 3.6 5.9 6.1l-1.3 1c-1.4-2.1-3.1-3.9-5.1-5.2h-.9c-2.1 1.3-3.8 3.1-5.2 5.2L.1 8.3C1.7 5.8 3.7 3.7 6 2.2L8 2.2zm0 3.3c1.4.9 2.6 2.1 3.6 3.5l-1.2 1C9.5 9 8.8 8.1 8 7.4c-.8.7-1.5 1.6-2.4 2.6l-1.2-1c1-1.4 2.2-2.6 3.6-3.5L8 5.5zM8 8.6a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden style={{ display: 'block' }}>
          <path
            fill="#000000"
            d="M2 3.5h16v5H2v-5zm17 2h1.5c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H19v-3z"
            opacity="0.35"
          />
          <path fill="#000000" d="M3 4.5h14v3H3v-3z" />
        </svg>
      </div>
    </header>
  )
}

function DynamicIsland() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '0.6875em',
        transform: 'translateX(-50%)',
        width: '7.5em',
        height: '2.1875em',
        background: '#000000',
        borderRadius: '1.25em',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}

type PhoneFrameProps = {
  children: ReactNode
  /** 根节点 class，用于页面级样式（如 Sign In 的表单 class） */
  pageClassName?: string
}

export function PhoneFrame({ children, pageClassName = 'phone-frame-page' }: PhoneFrameProps) {
  return (
    <div
      className={pageClassName}
      style={{
        fontFamily: font,
        background: '#f5f5f5',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5em',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="phone-frame-device"
        style={{
          width: `${PHONE_W_EM}em`,
          height: `${PHONE_H_EM}em`,
          background: '#ffffff',
          borderRadius: '3.4375em',
          boxShadow:
            '0 0 0 1px rgba(0,0,0,0.06), 0 1.5em 4em rgba(0,0,0,0.12), 0 0.5em 1em rgba(0,0,0,0.06)',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <DynamicIsland />
        <div
          style={{
            width: '23.4375em',
            height: '100%',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            zIndex: 1,
          }}
        >
          <StatusBar />
          {children}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '0.5em',
            width: '8.375em',
            height: '0.3125em',
            background: '#000000',
            borderRadius: '6.25em',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />
      </div>
      <style>{`
        .${pageClassName} {
          font-size: min(
            16px,
            calc((100vh - 120px) / ${PHONE_H_EM}),
            calc((100vw - 48px) / ${PHONE_W_EM})
          );
        }
      `}</style>
    </div>
  )
}
