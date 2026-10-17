import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
}

// Markdown 编辑器：左侧编辑、右侧实时预览
export default function MarkdownEditor({
  value,
  onChange,
  height = '420px',
}: MarkdownEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <span className="mb-2 block text-sm text-ink-muted">编辑（Markdown）</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y rounded-lg border border-white/10 bg-surface/60 p-3 font-mono text-sm text-ink outline-none focus:border-accent/50"
          style={{ height }}
          spellCheck={false}
        />
      </div>
      <div>
        <span className="mb-2 block text-sm text-ink-muted">预览</span>
        <div
          className="markdown-body w-full overflow-y-auto rounded-lg border border-white/10 bg-surface/60 p-4"
          style={{ height }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
