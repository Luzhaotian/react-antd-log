import type { Activity } from '@/types'

/** 最近活动 */
export const recentActivities: Activity[] = [
  {
    id: 1,
    title: '新增热点：AI技术突破性进展',
    time: '2分钟前',
    category: '科技',
    status: 'new',
  },
  {
    id: 2,
    title: '热点处理完成：某明星事件',
    time: '15分钟前',
    category: '娱乐',
    status: 'completed',
  },
  {
    id: 3,
    title: '新增热点：股市大幅波动',
    time: '1小时前',
    category: '财经',
    status: 'new',
  },
  {
    id: 4,
    title: '热点处理完成：体育赛事报道',
    time: '2小时前',
    category: '体育',
    status: 'completed',
  },
  {
    id: 5,
    title: '新增热点：社会民生话题',
    time: '3小时前',
    category: '社会',
    status: 'new',
  },
]

/** 状态类型 */
export const STATUS_TYPE = {
  /** 新增 */
  NEW: 'new',
  /** 已完成 */
  COMPLETED: 'completed',
} as const

/** 标签属性 */
export const TAG_ATTRIBUTE = {
  [STATUS_TYPE.NEW]: {
    color: 'red',
    text: '新增',
  },
  [STATUS_TYPE.COMPLETED]: {
    color: 'green',
    text: '已完成',
  },
} as const
