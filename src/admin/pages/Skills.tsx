import { useState } from 'react'
import { getSkills, saveSkills } from '../../api'
import type { SkillGroup, SkillItem, SkillLevel } from '../../types'
import { inputClass } from '../components/Field'

const LEVELS: SkillLevel[] = ['熟练', '掌握', '了解']

const emptyItem = (): SkillItem => ({ name: '', level: '了解' })
const emptyGroup = (): SkillGroup => ({ category: '', items: [emptyItem()] })

export default function AdminSkills() {
  const [groups, setGroups] = useState<SkillGroup[]>(() => getSkills())
  const [saved, setSaved] = useState(false)

  const save = () => {
    const cleaned = groups
      .map((g) => ({
        category: g.category.trim(),
        items: g.items.filter((it) => it.name.trim() !== ''),
      }))
      .filter((g) => g.category !== '' && g.items.length > 0)
    saveSkills(cleaned)
    setGroups(cleaned)
    setSaved(true)
  }

  const updateGroup = (gi: number, patch: Partial<SkillGroup>) =>
    setGroups((prev) => prev.map((g, i) => (i === gi ? { ...g, ...patch } : g)))
  const addGroup = () => setGroups((prev) => [...prev, emptyGroup()])
  const removeGroup = (gi: number) =>
    setGroups((prev) => prev.filter((_, i) => i !== gi))

  const updateItem = (gi: number, ii: number, patch: Partial<SkillItem>) =>
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gi
          ? { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) }
          : g,
      ),
    )
  const addItem = (gi: number) =>
    setGroups((prev) =>
      prev.map((g, i) => (i === gi ? { ...g, items: [...g.items, emptyItem()] } : g)),
    )
  const removeItem = (gi: number, ii: number) =>
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gi ? { ...g, items: g.items.filter((_, j) => j !== ii) } : g,
      ),
    )

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">技能管理</h1>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90"
        >
          保存
        </button>
      </div>

      {saved && (
        <p className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          已保存
        </p>
      )}

      {groups.map((group, gi) => (
        <section
          key={gi}
          className="mb-6 rounded-xl border border-white/5 bg-surface/40 p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <input
              className={`${inputClass} max-w-xs`}
              value={group.category}
              onChange={(e) => updateGroup(gi, { category: e.target.value })}
              placeholder="技能分类（如 编程语言）"
            />
            <button
              type="button"
              onClick={() => removeGroup(gi)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              删除分类
            </button>
          </div>

          <div className="space-y-2">
            {group.items.map((item, ii) => (
              <div key={ii} className="flex items-center gap-3">
                <input
                  className={`${inputClass} flex-1`}
                  value={item.name}
                  onChange={(e) => updateItem(gi, ii, { name: e.target.value })}
                  placeholder="技能名称"
                />
                <select
                  className={`${inputClass} w-28`}
                  value={item.level}
                  onChange={(e) =>
                    updateItem(gi, ii, { level: e.target.value as SkillLevel })
                  }
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(gi, ii)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  删除
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addItem(gi)}
            className="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink hover:border-accent/50"
          >
            + 添加技能
          </button>
        </section>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-ink hover:border-accent/50"
      >
        + 添加分类
      </button>
    </div>
  )
}
