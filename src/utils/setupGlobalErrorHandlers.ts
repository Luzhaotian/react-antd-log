import { logger } from '@/utils/logger'

let installed = false

/** 捕获未处理的运行时错误与 Promise rejection（仅日志，无后端上报） */
export function setupGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return
  installed = true

  window.addEventListener('error', event => {
    logger.error('未捕获错误', event.error ?? event.message)
  })

  window.addEventListener('unhandledrejection', event => {
    logger.error('未处理的 Promise rejection', event.reason)
  })
}
