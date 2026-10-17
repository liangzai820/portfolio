import type { Settings } from '../types'
import { hashPassword } from '../lib/hash'

// 默认登录账号：admin / admin123
export const seedSettings: Settings = {
  siteTitle: '梁宏宇 · 人工智能算法工程师',
  siteDescription: '主攻人工智能算法方向，具备扎实的编程与数理基础。',
  adminUsername: 'admin',
  adminPasswordHash: hashPassword('admin123'),
}
