/**
 * 应用名称与描述，全项目唯一配置处
 */

/** 应用名称（站点标题、Logo 等统一使用） */
export const APP_NAME = '热点集'

/** 应用默认描述（如设置页表单默认值） */
export const APP_DESCRIPTION = '基于 React + TypeScript + Ant Design 的热点集管理'

/** 构建版本（由 Vite define 注入，与 package.json version 同步） */
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'

/** 当前运行模式 */
export const APP_MODE = import.meta.env.MODE
