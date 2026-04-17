/**
 * Dashboard — 按 Figma「Dashboard」画板（375×812，节点 1:2248）还原；外层手机框与其他测试页一致。
 * 稿：Header 56px、Pills、横向 Stats 卡（224×120/#e0e0e0）、Chart、列表卡、底栏 4 Tab。
 */
import type { ReactNode } from 'react'
import { PhoneFrame } from '@/pages/Test/components/PhoneFrame'

const INSET = '1em'
const STROKE = '#e0e0e0'

const STATS = [
  {
    title: 'Title',
    value: '$45,678.90',
    sub: '+20% month over month',
  },
  {
    title: 'Title',
    value: '2,405',
    sub: '+33% month over month',
  },
  {
    title: 'MAU (Monthly Active Users)',
    value: '10,353',
    sub: '-8% month over month',
  },
] as const

const LIST_ROWS = [
  { name: 'Elynn Lee', email: 'email@fakedomain.net' },
  { name: 'Oscar Dum', email: 'email@fakedomain.net' },
  { name: 'Carlo Emilion', email: 'email@fakedomain.net' },
  { name: 'Daniel Jay Park', email: 'djpark@gmail.com' },
  { name: 'Mark Rojas', email: 'rojasmar@skiff.com' },
] as const

function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function AvatarSm() {
  return (
    <div
      style={{
        width: '1.5em',
        height: '1.5em',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%)',
        flexShrink: 0,
      }}
    />
  )
}

function AvatarMd() {
  return (
    <div
      style={{
        width: '2em',
        height: '2em',
        borderRadius: '50%',
        background: '#f7f7f7',
        flexShrink: 0,
      }}
    />
  )
}

/** 稿 Graph 区 301×157；折线 + 终点 #2d6eff 光晕点 */
function ChartSvg() {
  const w = 301
  const h = 157
  const padL = 26
  const padR = 8
  const padT = 8
  const padB = 22
  const gw = w - padL - padR
  const gh = h - padT - padB
  const linePath =
    'M ' +
    [
      [padL + 4, padT + gh * 0.72],
      [padL + gw * 0.18, padT + gh * 0.62],
      [padL + gw * 0.35, padT + gh * 0.55],
      [padL + gw * 0.52, padT + gh * 0.42],
      [padL + gw * 0.68, padT + gh * 0.35],
      [padL + gw * 0.82, padT + gh * 0.22],
      [padL + gw * 0.92, padT + gh * 0.12],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(' L ')

  const dotCx = padL + gw * 0.92
  const dotCy = padT + gh * 0.12

  return (
    <svg
      width="100%"
      height="9.8125em"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      <path
        d={linePath}
        fill="none"
        stroke="#2d6eff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <radialGradient id="dash-dot-glow" cx="50%" cy="50%" r="50%">
          <stop offset="61.5%" stopColor="#2d6eff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2d6eff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={dotCx} cy={dotCy} r="15" fill="url(#dash-dot-glow)" />
      <circle cx={dotCx} cy={dotCy} r="4" fill="#2d6eff" />
    </svg>
  )
}

function TabItem({
  children,
  active,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <div
      style={{
        width: '4.75em',
        flexShrink: 0,
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

export default function DashboardPage() {
  return (
    <PhoneFrame pageClassName="dashboard-test-page">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        {/* Header：高 56px；左菜单、居中 App name 20 Semibold、右头像 24 */}
        <header
          style={{
            flexShrink: 0,
            height: '3.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${INSET}`,
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            aria-label="Menu"
            style={{
              width: '1.5em',
              height: '1.5em',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconMenu />
          </button>
          <h1
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              margin: 0,
              fontSize: '1.25em',
              fontWeight: 600,
              lineHeight: '1.4em',
              letterSpacing: '-0.025em',
              color: '#000000',
              maxWidth: '10em',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            App name
          </h1>
          <AvatarSm />
        </header>

        <div
          className="dashboard-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Pills：距 Header 底 12px；高 32 圆角 20；选中黑 90% + 白字 */}
          <div
            style={{
              display: 'flex',
              gap: '0.75em',
              padding: `0.75em ${INSET} 0`,
            }}
          >
            {[
              { label: 'Tab', active: true },
              { label: 'Tab', active: false },
              { label: 'Tab', active: false },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  minWidth: '3.3125em',
                  height: '2em',
                  padding: '0 0.75em',
                  borderRadius: '1.25em',
                  boxSizing: 'border-box',
                  background: p.active ? 'rgba(0,0,0,0.9)' : '#f6f6f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875em',
                    fontWeight: 500,
                    lineHeight: '1.225em',
                    color: p.active ? '#ffffff' : '#000000',
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stats：距 Pills 底 24px；卡 224×120，间距 12，横向滚动 */}
          <div
            style={{
              marginTop: '1.5em',
              display: 'flex',
              gap: '0.75em',
              overflowX: 'auto',
              padding: `0 ${INSET}`,
              scrollbarWidth: 'none',
            }}
            className="dashboard-h-scroll"
          >
            {STATS.map((c, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: '14em',
                  height: '7.5em',
                  boxSizing: 'border-box',
                  border: `1px solid ${STROKE}`,
                  borderRadius: '0.5em',
                  background: '#ffffff',
                  padding: '1em',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                }}
              >
                <div
                  style={{
                    fontSize: '0.875em',
                    fontWeight: 600,
                    lineHeight: '1.225em',
                    color: '#000000',
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    marginTop: '0.5em',
                    fontSize: '1.75em',
                    fontWeight: 600,
                    lineHeight: '1.2em',
                    letterSpacing: '-0.035em',
                    color: '#000000',
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    marginTop: '0.5em',
                    fontSize: '0.75em',
                    fontWeight: 500,
                    lineHeight: '1.125em',
                    color: '#828282',
                  }}
                >
                  {c.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Chart：距 Stats 底 12px；343×282 #e0e0e0 描边 r8 */}
          <div
            style={{
              marginTop: '0.75em',
              marginLeft: INSET,
              marginRight: INSET,
              width: 'calc(100% - 2em)',
              boxSizing: 'border-box',
              border: `1px solid ${STROKE}`,
              borderRadius: '0.5em',
              background: '#ffffff',
              padding: '1em',
              paddingBottom: '0.75em',
            }}
          >
            <div
              style={{
                fontSize: '0.875em',
                fontWeight: 600,
                lineHeight: '1.225em',
                color: '#000000',
                marginBottom: '0.75em',
              }}
            >
              Title
            </div>
            <div style={{ position: 'relative', paddingLeft: '1.625em', paddingBottom: '0.875em' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.25em',
                  bottom: '1.125em',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontSize: '0.625em',
                  fontWeight: 400,
                  lineHeight: '0.875em',
                  color: '#828282',
                }}
              >
                {['$50K', '$45K', '$40K', '$35K', '$30K'].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <ChartSvg />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.25em',
                  paddingLeft: '1.625em',
                  paddingRight: '0.25em',
                  fontSize: '0.625em',
                  fontWeight: 400,
                  lineHeight: '0.875em',
                  color: '#828282',
                }}
              >
                <span>Nov 23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
              </div>
            </div>
          </div>

          {/* List：距 Chart 底 12px；343×330 */}
          <div
            style={{
              marginTop: '0.75em',
              marginLeft: INSET,
              marginRight: INSET,
              marginBottom: '1em',
              boxSizing: 'border-box',
              border: `1px solid ${STROKE}`,
              borderRadius: '0.5em',
              background: '#ffffff',
              padding: '1em',
              paddingBottom: '0.75em',
            }}
          >
            <div
              style={{
                fontSize: '0.875em',
                fontWeight: 600,
                lineHeight: '1.225em',
                color: '#000000',
                marginBottom: '0.5em',
              }}
            >
              Title
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {LIST_ROWS.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75em',
                    minHeight: '3.375em',
                    borderRadius: '0.5em',
                  }}
                >
                  <AvatarMd />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.875em',
                        fontWeight: 500,
                        lineHeight: '1.225em',
                        color: '#000000',
                      }}
                    >
                      {row.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75em',
                        fontWeight: 400,
                        lineHeight: '1.125em',
                        color: '#828282',
                        marginTop: '0.125em',
                      }}
                    >
                      {row.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Bar：高 83（49 图标行 + 底部留白）；4×76 宽项 */}
        <nav
          style={{
            flexShrink: 0,
            background: '#ffffff',
            borderTop: `1px solid rgba(0,0,0,0.06)`,
            paddingTop: '0.25em',
          }}
        >
          <div
            style={{
              height: '3.0625em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25em',
            }}
          >
            <TabItem active>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
              </svg>
            </TabItem>
            <TabItem>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </TabItem>
            <TabItem>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 9l-3 3 3 3M18 15l3-3-3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </TabItem>
            <TabItem>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="5"
                  y="6"
                  width="14"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </TabItem>
          </div>
          <div style={{ height: '2.125em' }} aria-hidden />
        </nav>
      </div>

      <style>{`
        .dashboard-h-scroll::-webkit-scrollbar {
          display: none;
        }
        .dashboard-test-page header {
          position: relative;
        }
      `}</style>
    </PhoneFrame>
  )
}
