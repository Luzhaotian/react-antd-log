/**
 * Sign In — 按 Figma「Sign In」画板（402×874）还原；外层为手机展示框，内层为 375 逻辑宽屏内容区。
 * 设计节点：Frame 1:2109；表单项顺序与稿一致：邮箱 → 主按钮 → 密码。
 */
import { useCallback } from 'react'
import { PhoneFrame } from '@/pages/Test/components/PhoneFrame'

function GoogleMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.82-.07-1.6-.2-2.35H10v4.45h5.38a5.6 5.6 0 01-2.4 3.67v3.07h3.87c2.26-2.09 3.75-5.17 3.75-8.84z"
      />
      <path
        fill="#34A853"
        d="M10 20c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.07c-1.08.73-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H.96v3.16A9.99 9.99 0 0010 20z"
      />
      <path
        fill="#FBBC05"
        d="M3.27 11.22a6 6 0 010-3.84V4.22H.96A9.99 9.99 0 000 10c0 1.62.39 3.16 1.04 4.52l2.23-1.3z"
      />
      <path
        fill="#EA4335"
        d="M10 3.88c1.76 0 3.34.61 4.57 1.8l3.43-3.43C15.95.99 13.24 0 10 0 6.09 0 2.71 2.24 1.04 5.48l2.23 1.3C4.22 5.99 6.87 3.88 10 3.88z"
      />
    </svg>
  )
}

function AppleMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        fill="currentColor"
        d="M15.3 10.55c-.02-2.45 2-3.63 2.09-3.69-1.15-1.68-2.93-1.9-3.55-1.93-1.52-.15-2.96.9-3.73.9-.78 0-1.97-.87-3.25-.85-1.66.03-3.2.97-4.05 2.45-1.73 3-.44 7.43 1.23 9.87.82 1.2 1.8 2.54 3.09 2.49 1.23-.05 1.7-.8 3.19-.8 1.48 0 1.9.8 3.2.77 1.32-.02 2.16-1.2 2.97-2.4.94-1.37 1.32-2.71 1.34-2.78-.03-.01-2.57-.99-2.6-3.92zM13.14 3.2c.67-.81 1.12-1.93 1-3.06-1.05.04-2.33.7-3.08 1.51-.62.71-1.17 1.85-1.02 2.94 1.08.08 2.19-.55 3.1-1.39z"
      />
    </svg>
  )
}

function SignInPage() {
  const handleSignIn = useCallback(() => {}, [])
  const handleGoogle = useCallback(() => {}, [])
  const handleApple = useCallback(() => {}, [])

  return (
    <PhoneFrame pageClassName="sign-in-page">
      {/* App name：距画板顶 108px ⇒ 状态栏 44px + 64px */}
      <h1
        style={{
          margin: '4em 0 0',
          padding: 0,
          fontSize: '1.5em',
          fontWeight: 600,
          lineHeight: '1.5em',
          letterSpacing: '-0.015em',
          color: '#000000',
          textAlign: 'center',
        }}
      >
        App name
      </h1>

      {/* 标题区与主内容间距 84.5px（稿：228.5 − 144） */}
      <div
        style={{
          marginTop: '5.28125em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          minHeight: 0,
          paddingBottom: '2.125em',
        }}
      >
        {/* Copy：宽 268px 居中 */}
        <div
          style={{
            width: '16.75em',
            textAlign: 'center',
            marginBottom: '1.5em',
          }}
        >
          <div
            style={{
              fontSize: '1em',
              fontWeight: 600,
              lineHeight: '1.5em',
              color: '#000000',
              marginBottom: '0.125em',
            }}
          >
            Sign In
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.875em',
              fontWeight: 400,
              lineHeight: '1.3125em',
              color: '#000000',
            }}
          >
            Enter your email and password to sign in
          </p>
        </div>

        {/* 表单区：宽 327px */}
        <div style={{ width: '20.4375em' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1em',
              marginBottom: '0.5em',
            }}
          >
            <label className="sign-in-field">
              <span className="visually-hidden">Email</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="email@domain.com"
                className="sign-in-input"
              />
            </label>
            <button type="button" onClick={handleSignIn} className="sign-in-btn">
              Sign In
            </button>
            <label className="sign-in-field">
              <span className="visually-hidden">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                className="sign-in-input"
              />
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75em',
              height: '1.25em',
              marginBottom: '1.5em',
            }}
          >
            <div className="sign-in-divider-line" />
            <span className="sign-in-divider-or">or</span>
            <div className="sign-in-divider-line" />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5em',
              marginBottom: '1.5em',
            }}
          >
            <button type="button" onClick={handleGoogle} className="sign-in-social-btn">
              <GoogleMark size={20} />
              Continue with Google
            </button>
            <button type="button" onClick={handleApple} className="sign-in-social-btn">
              <AppleMark size={20} />
              Continue with Apple
            </button>
          </div>

          <p className="sign-in-terms">
            By clicking Sign in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <div style={{ flex: 1, minHeight: '1em' }} aria-hidden />
      </div>

      <style>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .sign-in-field {
          display: block;
          margin: 0;
        }
        .sign-in-input {
          width: 100%;
          height: 2.5em;
          padding: 0 1em;
          border: 1px solid #e0e0e0;
          border-radius: 0.5em;
          font-family: inherit;
          font-size: 0.875em;
          font-weight: 400;
          line-height: 1.4em;
          color: #000000;
          background: #ffffff;
          outline: none;
          box-sizing: border-box;
        }
        .sign-in-input::placeholder {
          color: #828282;
        }
        .sign-in-btn {
          width: 100%;
          height: 2.5em;
          background: #000000;
          border: none;
          border-radius: 0.5em;
          font-family: inherit;
          font-size: 0.875em;
          font-weight: 500;
          line-height: 1.4em;
          color: #ffffff;
          cursor: pointer;
        }
        .sign-in-divider-line {
          flex: 1;
          height: 1px;
          background: #e6e6e6;
        }
        .sign-in-divider-or {
          font-size: 0.875em;
          font-weight: 400;
          line-height: 1.225em;
          color: #828282;
          flex-shrink: 0;
        }
        .sign-in-social-btn {
          width: 100%;
          height: 2.5em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          background: #eeeeee;
          border: none;
          border-radius: 0.5em;
          font-family: inherit;
          font-size: 0.875em;
          font-weight: 500;
          line-height: 1.225em;
          color: #000000;
          cursor: pointer;
        }
        .sign-in-terms {
          margin: 0;
          font-size: 0.75em;
          font-weight: 400;
          line-height: 1.5em;
          color: #828282;
          text-align: center;
        }
      `}</style>
    </PhoneFrame>
  )
}

export default SignInPage
