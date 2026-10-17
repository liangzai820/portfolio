import { useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'
import { getProfile, updateProfile } from '../../api'
import type { Award, Education, Experience, Profile } from '../../types'
import Field, { inputClass } from '../components/Field'

type StringField = 'name' | 'title' | 'slogan' | 'email' | 'location'

const basicSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入求职意向'),
  slogan: z.string(),
  email: z.string().email('请输入有效邮箱'),
  location: z.string(),
})

const emptyEducation = (): Education => ({
  school: '',
  major: '',
  degree: '',
  note: '',
  period: '',
})
const emptyAward = (): Award => ({ title: '', level: '', date: '' })
const emptyExperience = (): Experience => ({
  organization: '',
  role: '',
  period: '',
  description: '',
})

export default function AdminProfile() {
  const [form, setForm] = useState<Profile>(() => getProfile())
  const [tagsText, setTagsText] = useState(() => getProfile().tags.join(', '))
  const [coursesText, setCoursesText] = useState(() =>
    getProfile().courses.join('\n'),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const setBasic = (key: StringField, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = () => {
    const parsed = basicSchema.safeParse({
      name: form.name,
      title: form.title,
      slogan: form.slogan,
      email: form.email,
      location: form.location,
    })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        next[issue.path[0]] = issue.message
      }
      setErrors(next)
      setSaved(false)
      return
    }

    const next: Profile = {
      ...form,
      tags: tagsText
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      courses: coursesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    updateProfile(next)
    setErrors({})
    setSaved(true)
  }

  // 教育经历
  const updateEducation = (i: number, patch: Partial<Education>) =>
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    }))
  const addEducation = () =>
    setForm((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }))
  const removeEducation = (i: number) =>
    setForm((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))

  // 获奖
  const updateAward = (i: number, patch: Partial<Award>) =>
    setForm((prev) => ({
      ...prev,
      awards: prev.awards.map((a, idx) => (idx === i ? { ...a, ...patch } : a)),
    }))
  const addAward = () =>
    setForm((prev) => ({ ...prev, awards: [...prev.awards, emptyAward()] }))
  const removeAward = (i: number) =>
    setForm((prev) => ({ ...prev, awards: prev.awards.filter((_, idx) => idx !== i) }))

  // 实践经历
  const updateExperience = (i: number, patch: Partial<Experience>) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    }))
  const addExperience = () =>
    setForm((prev) => ({
      ...prev,
      experiences: [...prev.experiences, emptyExperience()],
    }))
  const removeExperience = (i: number) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, idx) => idx !== i),
    }))

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">个人信息</h1>
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

      {/* 基本信息 */}
      <section className="mb-8 rounded-xl border border-white/5 bg-surface/40 p-5">
        <h2 className="mb-4 text-lg font-semibold">基本信息</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="姓名" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(e) => setBasic('name', e.target.value)} />
          </Field>
          <Field label="求职意向" error={errors.title}>
            <input className={inputClass} value={form.title} onChange={(e) => setBasic('title', e.target.value)} />
          </Field>
          <Field label="邮箱" error={errors.email}>
            <input className={inputClass} value={form.email} onChange={(e) => setBasic('email', e.target.value)} />
          </Field>
          <Field label="所在地">
            <input className={inputClass} value={form.location} onChange={(e) => setBasic('location', e.target.value)} />
          </Field>
          <Field label="一句话简介" className="sm:col-span-2">
            <input className={inputClass} value={form.slogan} onChange={(e) => setBasic('slogan', e.target.value)} />
          </Field>
          <Field label="核心标签（逗号分隔）" className="sm:col-span-2">
            <input className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </Field>
          <Field label="主修课程（每行一个）" className="sm:col-span-2">
            <textarea className={inputClass} rows={4} value={coursesText} onChange={(e) => setCoursesText(e.target.value)} />
          </Field>
        </div>
      </section>

      {/* 教育经历 */}
      <ListSection
        title="教育背景"
        count={form.education.length}
        onAdd={addEducation}
      >
        {form.education.map((edu, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-surface/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="学校">
                <input className={inputClass} value={edu.school} onChange={(e) => updateEducation(i, { school: e.target.value })} />
              </Field>
              <Field label="专业">
                <input className={inputClass} value={edu.major} onChange={(e) => updateEducation(i, { major: e.target.value })} />
              </Field>
              <Field label="学历">
                <input className={inputClass} value={edu.degree} onChange={(e) => updateEducation(i, { degree: e.target.value })} />
              </Field>
              <Field label="备注（如 211 院校）">
                <input className={inputClass} value={edu.note ?? ''} onChange={(e) => updateEducation(i, { note: e.target.value })} />
              </Field>
              <Field label="时间">
                <input className={inputClass} value={edu.period} onChange={(e) => updateEducation(i, { period: e.target.value })} />
              </Field>
            </div>
            <RemoveButton onClick={() => removeEducation(i)} />
          </div>
        ))}
      </ListSection>

      {/* 竞赛获奖 */}
      <ListSection title="竞赛获奖" count={form.awards.length} onAdd={addAward}>
        {form.awards.map((award, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-surface/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="奖项名称">
                <input className={inputClass} value={award.title} onChange={(e) => updateAward(i, { title: e.target.value })} />
              </Field>
              <Field label="级别">
                <input className={inputClass} value={award.level} onChange={(e) => updateAward(i, { level: e.target.value })} />
              </Field>
              <Field label="时间">
                <input className={inputClass} value={award.date} onChange={(e) => updateAward(i, { date: e.target.value })} />
              </Field>
            </div>
            <RemoveButton onClick={() => removeAward(i)} />
          </div>
        ))}
      </ListSection>

      {/* 实践经历 */}
      <ListSection title="实践与校园经历" count={form.experiences.length} onAdd={addExperience}>
        {form.experiences.map((exp, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-surface/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="组织 / 团队">
                <input className={inputClass} value={exp.organization} onChange={(e) => updateExperience(i, { organization: e.target.value })} />
              </Field>
              <Field label="角色">
                <input className={inputClass} value={exp.role} onChange={(e) => updateExperience(i, { role: e.target.value })} />
              </Field>
              <Field label="时间">
                <input className={inputClass} value={exp.period} onChange={(e) => updateExperience(i, { period: e.target.value })} />
              </Field>
            </div>
            <RemoveButton onClick={() => removeExperience(i)} />
          </div>
        ))}
      </ListSection>
    </div>
  )
}

function ListSection({
  title,
  count,
  onAdd,
  children,
}: {
  title: string
  count: number
  onAdd: () => void
  children: ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {title} <span className="text-sm text-ink-muted">({count})</span>
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink hover:border-accent/50"
        >
          + 添加
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 text-sm text-red-400 hover:text-red-300"
    >
      删除该项
    </button>
  )
}
