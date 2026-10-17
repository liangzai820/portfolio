import { STORAGE_PREFIX } from './storage'
import { getSettings } from './settings'
import { hashPassword } from '../lib/hash'

const TOKEN_KEY = `${STORAGE_PREFIX}admin:token`

export function generateToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() != null
}

export async function login(
  username: string,
  password: string,
): Promise<{ ok: boolean; message: string }> {
  const settings = getSettings()
  const nameOk = username === settings.adminUsername
  const passOk = hashPassword(password) === settings.adminPasswordHash
  if (!nameOk || !passOk) {
    return { ok: false, message: '用户名或密码错误' }
  }
  localStorage.setItem(TOKEN_KEY, generateToken())
  return { ok: true, message: '登录成功' }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
}
