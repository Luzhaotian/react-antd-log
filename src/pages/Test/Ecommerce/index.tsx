/**
 * Ecommerce — 按 Figma「Ecommerce」画板（375×812，节点 1:1746）还原；外层手机框与 Sign In 测试页一致。
 */
import type { ReactNode } from 'react'
import { PhoneFrame } from '@/pages/Test/components/PhoneFrame'

function ChevronCircle() {
  return (
    <div
      style={{
        width: '1.25em',
        height: '1.25em',
        borderRadius: '50%',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden
    >
      <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden>
        <path
          d="M1 1l5 6-5 6"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function SectionTitleRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '2.375em',
        padding: '0 1em',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontSize: '1em',
          fontWeight: 600,
          lineHeight: '1.4em',
          letterSpacing: '-0.02em',
          color: '#000000',
        }}
      >
        Title
      </span>
      <ChevronCircle />
    </div>
  )
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 15.5S3.5 11.2 3.5 7.1A3.1 3.1 0 019 5.2a3.1 3.1 0 015.5 1.9c0 4.1-5.5 8.4-5.5 8.4z"
        stroke="#000000"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function IconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6.5" stroke="#000000" strokeWidth="1.2" />
      <path d="M9 5.5V9l2.5 1.5" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconFollowing() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="2.2" fill="#000000" />
      <circle cx="12" cy="6" r="2.2" fill="#000000" />
      <path d="M3 14c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconOrder() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5.5 6.5V5a3.5 3.5 0 017 0v1.5M4 6.5h10l-1 9H5L4 6.5z"
        stroke="#000000"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Pill({
  icon,
  label,
  color = 'rgba(0,0,0,0.9)',
}: {
  icon: ReactNode
  label: string
  color?: string
}) {
  return (
    <button
      type="button"
      style={{
        flexShrink: 0,
        height: '2em',
        padding: '0 0.625em',
        borderRadius: '0.375em',
        border: '1px solid #e6e6e6',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25em',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {icon}
      <span
        style={{
          fontSize: '0.875em',
          fontWeight: 500,
          lineHeight: '1.375em',
          color,
        }}
      >
        {label}
      </span>
    </button>
  )
}

function PlaceholderImg({
  w,
  h,
  radius,
}: {
  w: string
  h: string
  radius: string
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: 'linear-gradient(135deg, #f7f7f7 0%, #ececec 100%)',
        flexShrink: 0,
      }}
    />
  )
}

function TabIcon({
  children,
  active,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        color: active ? '#000000' : '#828282',
      }}
    >
      {children}
    </div>
  )
}

function EcommercePage() {
  const inset = '1em'
  const gapSection = '1em'
  const carouselGapSm = '0.75em'
  const carouselGapLg = '1.5em'

  return (
    <PhoneFrame pageClassName="ecommerce-test-page">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        <div
          className="ecommerce-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* 状态栏下 8px → Search；稿 y52−44 */}
          <div style={{ marginTop: '0.5em', padding: `0 ${inset}` }}>
            <div
              style={{
                height: '2.5em',
                borderRadius: '0.5em',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.75em',
                gap: '0.5em',
                boxSizing: 'border-box',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6" stroke="#828282" strokeWidth="1.5" />
                <path d="M16 16l4 4" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontSize: '1em',
                  fontWeight: 400,
                  lineHeight: '1.5em',
                  color: '#828282',
                }}
              >
                Search
              </span>
            </div>
          </div>

          {/* Pills：距 Search 底 8px */}
          <div
            style={{
              marginTop: '0.5em',
              paddingLeft: inset,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '0.5em',
                overflowX: 'auto',
                paddingBottom: '0.25em',
                scrollbarWidth: 'none',
              }}
              className="ecommerce-pill-row"
            >
              <Pill icon={<IconHeart />} label="Favorites" />
              <Pill icon={<IconHistory />} label="History" color="#1a1a1a" />
              <Pill icon={<IconFollowing />} label="Following" color="#1a1a1a" />
              <Pill icon={<IconOrder />} label="Orders" color="#1a1a1a" />
            </div>
          </div>

          {/* Banner：距 Pills 底 16px；343×136，圆角 8 */}
          <div style={{ marginTop: gapSection, padding: `0 ${inset}` }}>
            <div
              style={{
                position: 'relative',
                height: '8.5em',
                borderRadius: '0.5em',
                overflow: 'hidden',
                background: 'linear-gradient(120deg, #e8e8e8 0%, #f5f5f5 45%, #dedede 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '1.25em',
                  top: '3.375em',
                  maxWidth: '9.125em',
                }}
              >
                <div
                  style={{
                    fontSize: '1.25em',
                    fontWeight: 600,
                    lineHeight: '1.4em',
                    letterSpacing: '-0.02em',
                    color: '#000000',
                  }}
                >
                  Banner title
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '1em',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.625em',
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: '0.3125em',
                      height: '0.3125em',
                      borderRadius: '50%',
                      background: '#000000',
                      opacity: i === 0 ? 0.8 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row：圆角类目 76×104，图圆角 38 */}
          <div style={{ marginTop: gapSection }}>
            <SectionTitleRow />
            <div
              style={{
                display: 'flex',
                gap: carouselGapLg,
                overflowX: 'auto',
                padding: `0.5em ${inset} 0`,
                scrollbarWidth: 'none',
              }}
              className="ecommerce-h-scroll"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: '4.75em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5em',
                  }}
                >
                  <PlaceholderImg w="4.75em" h="4.75em" radius="2.375em" />
                  <span
                    style={{
                      fontSize: '0.875em',
                      fontWeight: 500,
                      lineHeight: '1.225em',
                      letterSpacing: '0.008em',
                      color: '#161823',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    Title
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 商品卡 148×223，图 148×148 r8，间距 12 */}
          <div style={{ marginTop: gapSection }}>
            <SectionTitleRow />
            <div
              style={{
                display: 'flex',
                gap: carouselGapSm,
                overflowX: 'auto',
                padding: `0.5em ${inset} 0`,
                scrollbarWidth: 'none',
              }}
              className="ecommerce-h-scroll"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ flexShrink: 0, width: '9.25em' }}>
                  <PlaceholderImg w="9.25em" h="9.25em" radius="0.5em" />
                  <div style={{ marginTop: '0.75em' }}>
                    <div
                      style={{
                        fontSize: '0.75em',
                        fontWeight: 400,
                        lineHeight: '1.05em',
                        color: 'rgba(0,0,0,0.5)',
                      }}
                    >
                      Brand{' '}
                    </div>
                    <div
                      style={{
                        marginTop: '0.125em',
                        fontSize: '0.875em',
                        fontWeight: 400,
                        lineHeight: '1.225em',
                        color: '#000000',
                      }}
                    >
                      Product name
                    </div>
                    <div
                      style={{
                        marginTop: '0.125em',
                        fontSize: '1em',
                        fontWeight: 500,
                        lineHeight: '1.4em',
                        color: '#000000',
                      }}
                    >
                      $10.99
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 大图横滑 96×96 r8 */}
          <div style={{ marginTop: gapSection, paddingBottom: '0.5em' }}>
            <SectionTitleRow />
            <div
              style={{
                display: 'flex',
                gap: carouselGapSm,
                overflowX: 'auto',
                padding: `0.5em ${inset} 1em`,
                scrollbarWidth: 'none',
              }}
              className="ecommerce-h-scroll"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <PlaceholderImg key={i} w="6em" h="6em" radius="0.5em" />
              ))}
            </div>
          </div>
        </div>

        {/* Tab Bar：高 78（44 图标区 + 底部留白对齐稿） */}
        <nav
          style={{
            flexShrink: 0,
            background: '#ffffff',
            paddingBottom: '0.25em',
          }}
        >
          <div
            style={{
              height: '2.75em',
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <TabIcon active>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
              </svg>
            </TabIcon>
            <TabIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </TabIcon>
            <TabIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9 8V6a3 3 0 016 0v2M5 8h14l-1 12H6L5 8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TabIcon>
            <TabIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 8a6 6 0 0012 0M9 8h6M12 21a3 3 0 003-3v-3H9v3a3 3 0 003 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TabIcon>
            <TabIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M6.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </TabIcon>
          </div>
          <div style={{ height: '2.125em' }} aria-hidden />
        </nav>
      </div>

      <style>{`
        .ecommerce-pill-row::-webkit-scrollbar,
        .ecommerce-h-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </PhoneFrame>
  )
}

export default EcommercePage
