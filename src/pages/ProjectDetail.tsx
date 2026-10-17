import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getProject } from '../api'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="mb-4">未找到该项目。</p>
        <Link to="/projects" className="text-accent">
          返回项目列表
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link to="/projects" className="mb-6 inline-block text-accent">
        ← 返回项目列表
      </Link>
      <h1 className="mb-4 text-3xl font-bold">{project.name}</h1>
      <p className="mb-6 text-ink-muted">职责：{project.role}</p>

      <div className="markdown-body mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {project.description}
        </ReactMarkdown>
      </div>

      <h2 className="mb-3 text-xl font-semibold">成果亮点</h2>
      <ul className="mb-6 list-inside list-disc space-y-2">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent/10 px-2 py-0.5 text-sm text-accent"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
