import { useRef, useCallback } from 'react'

/**
 * useStableFn：返回一个「引用稳定、但始终调用最新回调」的函数。
 *
 * 用法：把会随 state 变化的回调传进来，得到一个新函数，引用在每次渲染间不变，
 * 但调用时执行的是当前最新的回调。适合传给子组件或 addEventListener，避免因回调
 * 引用变化导致子组件重渲染或重复绑定/解绑事件。
 *
 * @example
 * const onKeyDown = useStableFn((e: KeyboardEvent) => {
 *   if (e.key === 'Enter') doSomething(stateValue) // 总能拿到最新 stateValue
 * })
 * useEffect(() => {
 *   window.addEventListener('keydown', onKeyDown)
 *   return () => window.removeEventListener('keydown', onKeyDown)
 * }, []) // 依赖为空即可，无需依赖 stateValue
 */
export function useStableFn<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn)
  ref.current = fn
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T
}
