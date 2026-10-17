import { getSkills } from '../api'

export default function Skills() {
  const skills = getSkills()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">技能</h1>

      <div className="space-y-8">
        {skills.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 text-xl font-semibold text-accent">
              {group.category}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-surface/60 p-4"
                >
                  <span>{item.name}</span>
                  <span className="text-accent">{item.level}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
