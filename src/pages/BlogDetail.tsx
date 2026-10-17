import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPost } from '../api'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  if (!post || post.draft) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="mb-4">未找到该文章。</p>
        <Link to="/blog" className="text-accent">
          返回博客
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link to="/blog" className="mb-6 inline-block text-accent">
        ← 返回博客
      </Link>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readingTime} 分钟</span>
      </div>

      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-accent/10 px-2 py-0.5 text-sm text-accent"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
