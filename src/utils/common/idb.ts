/**
 * IndexedDB 封装（基于 idb-keyval）
 * 项目内所有 IndexedDB 读写统一由此处接入，key 使用 constants/idbKeys 中的 IDB_KEYS
 * 命名为 idbGet / idbSet / idbDel 避免与其它模块的 get/set/del 冲突
 */
import { get, set, del } from 'idb-keyval'

/** IndexedDB 读取 */
export const idbGet = get
/** IndexedDB 写入 */
export const idbSet = set
/** IndexedDB 删除 */
export const idbDel = del
