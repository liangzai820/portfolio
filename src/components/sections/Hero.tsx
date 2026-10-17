import { Link } from 'react-router-dom'
import { getProfile } from '../../api'
import Tag from '../ui/Tag'

export default function Hero() {
  const profile = getProfile()

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="mb-4 text-sm text-accent">{profile.location}</p>
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{profile.name}</h1>
      <p className="mb-6 text-xl text-ink-muted sm:text-2xl">{profile.title}</p>
      <p className="mb-8 max-w-2xl text-ink-muted">{profile.slogan}</p>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {profile.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/projects"
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-bg hover:bg-accent/90"
        >
          查看项目
        </Link>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-lg border border-white/10 px-5 py-2.5 font-medium text-ink hover:border-accent/50"
        >
          联系我
        </a>
      </div>
    </section>
  )
}
