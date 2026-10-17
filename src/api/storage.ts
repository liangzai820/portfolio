// 统一的 localStorage 读写封装。
// 后续切换为真实后端时，只需替换本模块及各 api 模块的实现，页面代码无需改动。

export const STORAGE_PREFIX = 'portfolio:'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw == null) return clone(fallback)
    return JSON.parse(raw) as T
  } catch {
    return clone(fallback)
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
}

export function removeStorage(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}
