import { Link } from 'react-router-dom'
import { listPosts } from '../api'

export default function Blog() {
  const published = listPosts().filter((p) => !p.draft)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">博客</h1>

      <div className="space-y-6">
        {published.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block rounded-xl border border-white/5 bg-surface/60 p-6 transition-colors hover:border-accent/40"
          >
            <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
            <p className="mb-3 text-ink-muted">{post.summary}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readingTime} 分钟</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-accent/10 px-2 py-0.5 text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
