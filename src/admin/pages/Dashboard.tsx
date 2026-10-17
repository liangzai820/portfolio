import { Link } from 'react-router-dom'
import { getProfile, getSkills, listProjects, listPosts } from '../../api'

export default function Dashboard() {
  const profile = getProfile()
  const skills = getSkills()
  const projects = listProjects()
  const posts = listPosts()
  const publishedCount = posts.filter((p) => !p.draft).length
  const skillItemCount = skills.reduce((sum, g) => sum + g.items.length, 0)

  const stats = [
    { label: '项目', value: projects.length, to: '/admin/projects' },
    { label: '博客文章', value: posts.length, to: '/admin/posts' },
    { label: '已发布文章', value: publishedCount, to: '/admin/posts' },
    { label: '技能条目', value: skillItemCount, to: '/admin/skills' },
  ]

  const recentPosts = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">仪表盘</h1>
      <p className="mb-6 text-sm text-ink-muted">欢迎回来，{profile.name}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-xl border border-white/5 bg-surface/60 p-5 transition-colors hover:border-accent/40"
          >
            <div className="text-3xl font-bold text-accent">{s.value}</div>
            <div className="mt-1 text-sm text-ink-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">最近文章</h2>
      <div className="space-y-3">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/admin/posts/${post.slug}/edit`}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-surface/60 p-4 transition-colors hover:border-accent/40"
          >
            <span>{post.title}</span>
            <span className="text-sm text-ink-muted">
              {post.draft ? '草稿' : '已发布'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
