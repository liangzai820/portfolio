import { Link } from 'react-router-dom'
import Hero from '../components/sections/Hero'

const sections = [
  { to: '/about', label: '关于我', desc: '教育 · 课程 · 获奖 · 经历' },
  { to: '/skills', label: '技能', desc: '技术栈与能力' },
  { to: '/projects', label: '项目', desc: '项目成果展示' },
  { to: '/blog', label: '博客', desc: '技术文章与思考' },
]

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-semibold">快速导航</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl border border-white/5 bg-surface/60 p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="mb-2 text-lg font-semibold">{item.label}</h3>
              <p className="text-sm text-ink-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
