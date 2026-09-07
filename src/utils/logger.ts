export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  time: string
  detail?: unknown
}

const MAX_BUFFER = 50
const buffer: LogEntry[] = []

function push(entry: LogEntry) {
  buffer.push(entry)
  if (buffer.length > MAX_BUFFER) {
    buffer.shift()
  }
}

function formatDetail(detail: unknown): unknown {
  if (detail instanceof Error) {
    return { name: detail.name, message: detail.message, stack: detail.stack }
  }
  return detail
}

function emit(level: LogLevel, message: string, detail?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    time: new Date().toISOString(),
    detail: detail === undefined ? undefined : formatDetail(detail),
  }
  push(entry)

  const payload = entry.detail === undefined ? [entry.message] : [entry.message, entry.detail]
  if (level === 'error') {
    console.error(...payload)
  } else if (level === 'warn') {
    console.warn(...payload)
  } else if (level === 'debug' && import.meta.env.DEV) {
    console.debug(...payload)
  } else if (level === 'info' && import.meta.env.DEV) {
    console.info(...payload)
  }
}

export const logger = {
  debug: (message: string, detail?: unknown) => emit('debug', message, detail),
  info: (message: string, detail?: unknown) => emit('info', message, detail),
  warn: (message: string, detail?: unknown) => emit('warn', message, detail),
  error: (message: string, detail?: unknown) => emit('error', message, detail),
  /** 最近日志（内存，刷新即清空；无后端上报） */
  getRecent: (): readonly LogEntry[] => buffer.slice(),
  clear: () => {
    buffer.length = 0
  },
}
