import { Link } from 'react-router-dom'
import { listProjects } from '../api'

export default function Projects() {
  const projects = listProjects()

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">项目展示</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="rounded-xl border border-white/5 bg-surface/60 p-6 transition-colors hover:border-accent/40"
          >
            <h2 className="mb-2 text-xl font-semibold">{project.name}</h2>
            <p className="mb-4 text-ink-muted">{project.summary}</p>
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
          </Link>
        ))}
      </div>
    </div>
  )
}
