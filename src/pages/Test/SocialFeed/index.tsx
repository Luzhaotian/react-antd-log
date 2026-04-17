/**
 * Social feed — 按 Figma「Social feed」画板（375×812，节点 1:1608）还原；外层手机框与其他测试页一致。
 */
import type { ReactNode } from 'react'
import { PhoneFrame } from '@/pages/Test/components/PhoneFrame'

const INSET = '1em'
/** 稿：Feed 宽 343，相对屏左右各 16 */
const FEED_GAP = '0.75em' /* 头像 32 与正文区间距 12px */

function IconMore() {
  return (
    <button
      type="button"
      aria-label="More"
      style={{
        width: '1.5em',
        height: '1.5em',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="15" height="3" viewBox="0 0 15 3" fill="none" aria-hidden>
        <circle cx="1.5" cy="1.5" r="1.5" fill="#000000" />
        <circle cx="7.5" cy="1.5" r="1.5" fill="#000000" />
        <circle cx="13.5" cy="1.5" r="1.5" fill="#000000" />
      </svg>
    </button>
  )
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 17.5S3.5 12.5 3.5 8.2A3.8 3.8 0 0110 5.5a3.8 3.8 0 016.5 2.7c0 4.3-6.5 9.3-6.5 9.3z"
        stroke="#000000"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 16V5a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H8l-4 3z"
        stroke="#000000"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Avatar() {
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

function PostImage() {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '18.6875em',
        borderRadius: '0.25em',
        background: 'linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 45%, #c4c4c4 100%)',
        marginTop: '0.75em',
      }}
    />
  )
}

function PostActions({ likes, comments }: { likes: string; comments: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1em',
        marginTop: '0.75em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        <IconHeart />
        <span
          style={{
            fontSize: '0.875em',
            fontWeight: 500,
            lineHeight: '1.225em',
            color: '#000000',
          }}
        >
          {likes}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        <IconComment />
        <span
          style={{
            fontSize: '0.875em',
            fontWeight: 500,
            lineHeight: '1.225em',
            color: '#000000',
          }}
        >
          {comments}
        </span>
      </div>
    </div>
  )
}

function PostHeader({
  name,
  group,
  time,
}: {
  name: string
  group: string
  time: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5em' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.25em' }}>
          <span
            style={{
              fontSize: '0.875em',
              fontWeight: 600,
              lineHeight: '1.3125em',
              color: '#000000',
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: '0.875em',
              fontWeight: 400,
              lineHeight: '1.3125em',
              color: '#000000',
            }}
          >
            {group}
          </span>
        </div>
        <div
          style={{
            marginTop: '0.125em',
            fontSize: '0.75em',
            fontWeight: 400,
            lineHeight: '1.125em',
            color: '#828282',
          }}
        >
          {time}
        </div>
      </div>
      <IconMore />
    </div>
  )
}

function FeedPost({ children }: { children: ReactNode }) {
  return (
    <article
      style={{
        display: 'flex',
        gap: FEED_GAP,
        marginBottom: '2em',
      }}
    >
      <Avatar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </article>
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
        width: '4.75em',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#000000' : '#828282',
      }}
    >
      {children}
    </div>
  )
}

function CreateTabIcon() {
  return (
    <div
      style={{
        width: '1.25em',
        height: '1.25em',
        borderRadius: '0.25em',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        background: '#ffffff',
      }}
    />
  )
}

export default function SocialFeedPage() {
  return (
    <PhoneFrame pageClassName="social-feed-test-page">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
        }}
      >
        {/* Header：高 40px；Following / For you / Favorites；下划线 24×2 居中于「For you」 */}
        <header
          style={{
            flexShrink: 0,
            height: '2.5em',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${INSET}`,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.875em',
              fontWeight: 600,
              lineHeight: '1.225em',
              letterSpacing: '-0.02em',
              color: '#000000',
              opacity: 0.4,
            }}
          >
            Following
          </span>
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.875em',
              fontWeight: 600,
              lineHeight: '1.225em',
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            For you
          </span>
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.875em',
              fontWeight: 600,
              lineHeight: '1.225em',
              letterSpacing: '-0.02em',
              color: '#000000',
              opacity: 0.4,
            }}
          >
            Favorites
          </span>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '0.25em',
              transform: 'translateX(-50%)',
              width: '1.5em',
              height: '0.125em',
              borderRadius: '0.0625em',
              background: 'rgba(0,0,0,0.9)',
            }}
          />
        </header>

        {/* 稿：Header 底 84 → Feed 顶 108，间距 24px */}
        <div
          className="social-feed-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: `1.5em ${INSET} 1em`,
            boxSizing: 'border-box',
          }}
        >
          <FeedPost>
            <div>
              <PostHeader name="Helena" group="in Group name" time="3 min ago" />
              <PostImage />
              <p
                style={{
                  margin: '0.75em 0 0',
                  fontSize: '0.875em',
                  fontWeight: 400,
                  lineHeight: '1.225em',
                  color: '#000000',
                }}
              >
                Post description
              </p>
              <PostActions likes="21 likes" comments="4 comments" />
            </div>
          </FeedPost>

          <FeedPost>
            <div>
              <PostHeader name="Daniel " group="in Group Name" time="2 hrs ago" />
              <p
                style={{
                  margin: '0.75em 0 0',
                  fontSize: '0.875em',
                  fontWeight: 400,
                  lineHeight: '1.225em',
                  color: '#000000',
                }}
              >
                Body text for a post. Since it’s a social app, sometimes it’s a hot take, and sometimes
                it’s a question.
              </p>
              <PostActions likes="6 likes" comments="18 comments" />
            </div>
          </FeedPost>

          <FeedPost>
            <div>
              <PostHeader name="Oscar  " group="in Group Name" time="1 day ago" />
              <PostImage />
              <p
                style={{
                  margin: '0.75em 0 0',
                  fontSize: '0.875em',
                  fontWeight: 400,
                  lineHeight: '1.225em',
                  color: '#000000',
                }}
              >
                Another post
              </p>
              <PostActions likes="58 likes" comments="5 comments" />
            </div>
          </FeedPost>
        </div>

        {/* Tab Bar：78 总高，44 图标行 + 底部留白；5×76 */}
        <nav
          style={{
            flexShrink: 0,
            background: '#ffffff',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '0.25em',
          }}
        >
          <div
            style={{
              height: '2.75em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4375em',
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
              <CreateTabIcon />
            </TabIcon>
            <TabIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22a7 7 0 001.4-13.9 5 5 0 00-9.5 1.5A4 4 0 0012 22z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </TabIcon>
            <TabIcon>
              <div
                style={{
                  width: '1.5em',
                  height: '1.5em',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ddd 0%, #bbb 100%)',
                }}
              />
            </TabIcon>
          </div>
          <div style={{ height: '2.125em' }} aria-hidden />
        </nav>
      </div>
    </PhoneFrame>
  )
}
