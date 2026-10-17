import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
      {children}
    </span>
  )
}
