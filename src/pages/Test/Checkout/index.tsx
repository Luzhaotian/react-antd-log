/**
 * Checkout — 按 Figma「Checkout」画板（375×812，节点 1:2014）还原；外层手机框与其他测试页一致。
 * 稿面：Header 42px + Checkout Info 分区 + 金额摘要 + 底栏 Place order（343×52，圆角 8）。
 */
import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { PhoneFrame } from '@/pages/Test/components/PhoneFrame'

const INSET = '1em'
const BORDER = '#e6e6e6'

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path
        d="M8 5l5 5-5 5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronLeft({ onClick = () => {} }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      style={{
        width: '1.5em',
        height: '1.5em',
        padding: 0,
        border: 'none',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 6l-6 6 6 6"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span
      style={{
        width: '6.25em',
        flexShrink: 0,
        fontSize: '0.75em',
        fontWeight: 500,
        lineHeight: '1.25em',
        color: '#000000',
      }}
    >
      {children}
    </span>
  )
}

function RowChevron({
  label,
  children,
  muted,
}: {
  label: string
  children: ReactNode
  muted?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '3.25em',
        padding: `0 ${INSET}`,
        borderBottom: `1px solid ${BORDER}`,
        boxSizing: 'border-box',
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.5em',
        }}
      >
        <span
          style={{
            maxWidth: '13.1875em',
            fontSize: '0.875em',
            fontWeight: 400,
            lineHeight: '1.225em',
            color: muted ? 'rgba(0,0,0,0.5)' : '#000000',
            textAlign: 'left' as const,
          }}
        >
          {children}
        </span>
        <ChevronRight />
      </div>
    </div>
  )
}

function PlaceholderThumb() {
  return (
    <div
      style={{
        width: '5.25em',
        height: '5.25em',
        borderRadius: '0.5em',
        background: 'linear-gradient(135deg, #f7f7f7 0%, #ececec 100%)',
        flexShrink: 0,
      }}
    />
  )
}

function CheckoutPage() {
  const onPlaceOrder = useCallback(() => {}, [])
  const onBack = useCallback(() => {}, [])

  return (
    <PhoneFrame pageClassName="checkout-test-page">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        {/* Header：高 42px，底边 #e6e6e6；标题 17 Semibold 居中 */}
        <header
          style={{
            flexShrink: 0,
            height: '2.625em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: `1px solid ${BORDER}`,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'absolute', left: INSET, top: '50%', transform: 'translateY(-50%)' }}>
            <ChevronLeft onClick={onBack} />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.0625em',
              fontWeight: 600,
              lineHeight: '1.4em',
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            Checkout
          </h1>
        </header>

        <div
          className="checkout-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Shipping */}
          <RowChevron label="SHIPPING" muted>
            Add shipping address
          </RowChevron>

          {/* Delivery：72px 双行 */}
          <div
            style={{
              padding: `0 ${INSET}`,
              borderBottom: `1px solid ${BORDER}`,
              minHeight: '4.5em',
              display: 'flex',
              alignItems: 'flex-start',
              boxSizing: 'border-box',
            }}
          >
            <SectionLabel>DELIVERY</SectionLabel>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                gap: '0.5em',
              }}
            >
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' as const }}>
                <div
                  style={{
                    fontSize: '0.875em',
                    fontWeight: 400,
                    lineHeight: '1.225em',
                    color: '#000000',
                  }}
                >
                  Free
                </div>
                <div
                  style={{
                    fontSize: '0.875em',
                    fontWeight: 400,
                    lineHeight: '1.225em',
                    color: '#000000',
                    marginTop: '0.125em',
                  }}
                >
                  Standard | 3-4 days{' '}
                </div>
              </div>
              <ChevronRight />
            </div>
          </div>

          <RowChevron label="PAYMENT">Visa *1234</RowChevron>

          <RowChevron label="PROMOS" muted>
            Apply promo code
          </RowChevron>

          {/* Items 区块：顶部分栏标题 + 两行商品 */}
          <div style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: `${INSET} ${INSET} 0`,
                paddingTop: '1em',
                paddingBottom: '0.5em',
              }}
            >
              <span
                style={{
                  width: '6.25em',
                  flexShrink: 0,
                  fontSize: '0.75em',
                  fontWeight: 500,
                  lineHeight: '1.25em',
                  color: '#000000',
                }}
              >
                ITEMS
              </span>
              <span
                style={{
                  flex: 1,
                  marginLeft: '0.75em',
                  fontSize: '0.75em',
                  fontWeight: 500,
                  lineHeight: '1.25em',
                  color: '#000000',
                  textAlign: 'left' as const,
                }}
              >
                DESCRIPTION
              </span>
              <span
                style={{
                  width: '6.25em',
                  fontSize: '0.75em',
                  fontWeight: 500,
                  lineHeight: '1.25em',
                  color: '#000000',
                  textAlign: 'right' as const,
                }}
              >
                PRICE
              </span>
            </div>

            {[
              { price: '$10.99' },
              { price: '$8.99' },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: `0 ${INSET} ${idx === 1 ? '1em' : '0.625em'}`,
                  paddingTop: idx === 0 ? '0.375em' : '0.625em',
                  gap: '1.75em',
                  boxSizing: 'border-box',
                }}
              >
                <PlaceholderThumb />
                <div style={{ flex: 1, minWidth: 0, paddingTop: '0.125em' }}>
                  <div
                    style={{
                      fontSize: '0.75em',
                      fontWeight: 400,
                      lineHeight: '1.125em',
                      color: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    Brand{' '}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875em',
                      fontWeight: 400,
                      lineHeight: '1.225em',
                      color: '#000000',
                      marginTop: '0.125em',
                    }}
                  >
                    Product name
                  </div>
                  <div
                    style={{
                      fontSize: '0.875em',
                      fontWeight: 400,
                      lineHeight: '1.225em',
                      color: '#000000',
                      marginTop: '0.125em',
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: '0.875em',
                      fontWeight: 400,
                      lineHeight: '1.225em',
                      color: '#000000',
                      marginTop: '0.125em',
                    }}
                  >
                    Quantity: 01
                  </div>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    marginLeft: '2.3125em',
                    fontSize: '0.875em',
                    fontWeight: 400,
                    lineHeight: '1.225em',
                    color: '#000000',
                    textAlign: 'right' as const,
                    paddingTop: '0.125em',
                  }}
                >
                  {row.price}
                </div>
              </div>
            ))}
          </div>

          {/* 金额：行高 20px，行距 8px（稿 y 582/610/638/666） */}
          {/* 稿：Checkout Info 底 566 → 摘要顶 582，间距 16px */}
          <div style={{ padding: `1em ${INSET} 1em` }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875em',
                fontWeight: 400,
                lineHeight: '1.225em',
                color: '#000000',
              }}
            >
              <span>Subtotal (2)</span>
              <span>$19.98</span>
            </div>
            <div
              style={{
                marginTop: '0.5em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875em',
                fontWeight: 400,
                lineHeight: '1.225em',
                color: '#000000',
              }}
            >
              <span>Shipping total</span>
              <span>Free</span>
            </div>
            <div
              style={{
                marginTop: '0.5em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875em',
                fontWeight: 400,
                lineHeight: '1.225em',
                color: '#000000',
              }}
            >
              <span>Taxes</span>
              <span>$2.00</span>
            </div>
            <div
              style={{
                marginTop: '0.5em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875em',
                fontWeight: 500,
                lineHeight: '1.225em',
                color: '#000000',
              }}
            >
              <span>Total</span>
              <span>$21.98</span>
            </div>
          </div>
        </div>

        {/* Bottom button：顶描边 #e6e6e6，内边距后按钮 343×52 */}
        <div
          style={{
            flexShrink: 0,
            borderTop: `1px solid ${BORDER}`,
            background: '#ffffff',
            padding: `0.75em ${INSET} 1.75em`,
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={onPlaceOrder}
            style={{
              width: '21.4375em',
              maxWidth: '100%',
              margin: '0 auto',
              display: 'block',
              height: '3.25em',
              background: '#000000',
              border: 'none',
              borderRadius: '0.5em',
              fontFamily: 'inherit',
              fontSize: '1em',
              fontWeight: 500,
              lineHeight: '1.5em',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Place order
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default CheckoutPage
