import type { ReactNode } from 'react'

// 后台表单统一输入框样式
export const inputClass =
  'w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent/50'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
  className?: string
}

// 表单字段包装：标签 + 输入 + 校验错误提示
export default function Field({ label, error, children, className }: FieldProps) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-sm text-ink-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  )
}
