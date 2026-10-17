import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProject, listProjects } from '../../api'
import ConfirmDialog from '../components/ConfirmDialog'

export default function AdminProjects() {
  const [projects, setProjects] = useState(() => listProjects())
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)

  const handleDelete = () => {
    if (confirmSlug) {
      deleteProject(confirmSlug)
      setProjects(listProjects())
      setConfirmSlug(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <Link
          to="/admin/projects/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90"
        >
          新建项目
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-surface/60 p-4"
          >
            <div className="min-w-0">
              <div className="font-medium">{p.name}</div>
              <div className="truncate text-sm text-ink-muted">{p.summary}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to={`/admin/projects/${p.slug}/edit`}
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
        title="删除项目"
        message="确定要删除该项目吗？此操作不可撤销。"
        onCancel={() => setConfirmSlug(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
