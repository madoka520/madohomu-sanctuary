/**
 * [Ethan] IndexedDB 工具模块
 * 通用 IndexedDB 读写封装，不绑定具体业务语义。
 */
import { openDB } from 'idb'

const DB_NAME = 'madohomu-cache'
const DB_VERSION = 4

let _dbPromise: ReturnType<typeof openDB> | null = null

const _open = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('m3u8')) {
        db.createObjectStore('m3u8', { keyPath: 'src' })
      }
      if (!db.objectStoreNames.contains('segments')) {
        db.createObjectStore('segments', { keyPath: 'path' })
      }
    },
    blocked() {
      console.warn('[indexedDB] 升级被旧连接阻塞，请关闭其他标签页')
    },
  })
}

const _getDB = async () => {
  if (!_dbPromise) {
    _dbPromise = _open().catch(async (err) => {
      if (err instanceof DOMException && err.name === 'VersionError') {
        console.warn('[indexedDB] 版本冲突，删除旧库重建')
        await new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(DB_NAME)
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
          req.onblocked = () => console.warn('[indexedDB] deleteDatabase 被阻塞')
        })
        return _open()
      }
      _dbPromise = null
      throw err
    })
  }
  return _dbPromise
}

export const dbGet = async <T>(store: string, key: string): Promise<T | undefined> => {
  const db = await _getDB()
  return (await db.get(store, key)) as T | undefined
}

export const dbPut = async (store: string, value: Record<string, unknown>): Promise<void> => {
  const db = await _getDB()
  await db.put(store, value)
}
