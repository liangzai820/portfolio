import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deletePost, listPosts } from '../../api'
import ConfirmDialog from '../components/ConfirmDialog'

export default function AdminPosts() {
  const [posts, setPosts] = useState(() => listPosts())
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)

  const handleDelete = () => {
    if (confirmSlug) {
      deletePost(confirmSlug)
      setPosts(listPosts())
      setConfirmSlug(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">博客管理</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90"
        >
          新建文章
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-surface/60 p-4"
          >
            <div className="min-w-0">
              <div className="font-medium">{p.title}</div>
              <div className="truncate text-sm text-ink-muted">{p.summary}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs ${
                  p.draft
                    ? 'bg-white/10 text-ink-muted'
                    : 'bg-green-500/10 text-green-400'
                }`}
              >
                {p.draft ? '草稿' : '已发布'}
              </span>
              <Link
                to={`/admin/posts/${p.slug}/edit`}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink hover:border-accent/50"
              >
                编辑
              </Link>
              <button
                type="button"
                onClick={() => setConfirmSlug(p.slug)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-red-400 hover:border-red-400/50"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmSlug != null}
        title="删除文章"
        message="确定要删除该文章吗？此操作不可撤销。"
        onCancel={() => setConfirmSlug(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
