import { getProfile } from '../api'

export default function About() {
  const profile = getProfile()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">关于我</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-accent">教育背景</h2>
        {profile.education.map((edu) => (
          <div
            key={edu.school}
            className="rounded-xl border border-white/5 bg-surface/60 p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-medium">{edu.school}</span>
              {edu.note && (
                <span className="rounded bg-accent/10 px-2 py-0.5 text-sm text-accent">
                  {edu.note}
                </span>
              )}
            </div>
            <p className="mt-2 text-ink-muted">
              {edu.major} · {edu.degree} · {edu.period}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-accent">主修课程</h2>
        <div className="flex flex-wrap gap-2">
          {profile.courses.map((course) => (
            <span
              key={course}
              className="rounded-lg border border-white/5 bg-surface/60 px-3 py-1.5 text-sm"
            >
              {course}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-accent">竞赛获奖</h2>
        <ul className="space-y-3">
          {profile.awards.map((award) => (
            <li
              key={award.title}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-surface/60 p-4"
            >
              <span>{award.title}</span>
              <span className="text-accent">{award.level}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-accent">实践与校园经历</h2>
        <ul className="space-y-3">
          {profile.experiences.map((exp) => (
            <li
              key={exp.organization}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-surface/60 p-4"
            >
              <span>{exp.organization}</span>
              <span className="text-ink-muted">{exp.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
