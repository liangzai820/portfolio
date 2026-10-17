import { Link, useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getProject, saveProject } from '../../api'
import type { Project } from '../../types'
import Field, { inputClass } from '../components/Field'
import MarkdownEditor from '../components/MarkdownEditor'

const projectSchema = z.object({
  name: z.string().min(1, '请输入项目名称'),
  slug: z
    .string()
    .min(1, '请输入 URL 标识')
    .regex(/^[a-z0-9-]+$/, '仅支持小写字母、数字、连字符'),
  summary: z.string().min(1, '请输入一句话简介'),
  description: z.string(),
  role: z.string().min(1, '请输入个人职责'),
  techStackText: z.string(),
  highlightsText: z.string(),
  demoUrl: z
    .string()
    .refine((v) => v === '' || /^https?:\/\//.test(v), '请输入有效 URL'),
  sourceUrl: z
    .string()
    .refine((v) => v === '' || /^https?:\/\//.test(v), '请输入有效 URL'),
  featured: z.boolean(),
  date: z.string().min(1, '请选择日期'),
})

type FormValues = z.infer<typeof projectSchema>

export default function ProjectEdit() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = slug != null
  const existing = slug ? getProject(slug) : undefined

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: existing?.name ?? '',
      slug: existing?.slug ?? '',
      summary: existing?.summary ?? '',
      description: existing?.description ?? '',
      role: existing?.role ?? '',
      techStackText: existing?.techStack.join(', ') ?? '',
      highlightsText: existing?.highlights.join('\n') ?? '',
      demoUrl: existing?.demoUrl ?? '',
      sourceUrl: existing?.sourceUrl ?? '',
      featured: existing?.featured ?? false,
      date: existing?.date ?? new Date().toISOString().slice(0, 10),
    },
  })

  if (isEdit && !existing) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <p className="mb-4">未找到该项目。</p>
        <Link to="/admin/projects" className="text-accent">
          返回项目管理
        </Link>
      </div>
    )
  }

  const onSubmit = (values: FormValues) => {
    if (!isEdit && getProject(values.slug)) {
      setError('slug', { message: '该标识已存在，请更换' })
      return
    }
    const project: Project = {
      slug: values.slug,
      name: values.name,
      summary: values.summary,
      description: values.description,
      role: values.role,
      techStack: values.techStackText
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      highlights: values.highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      demoUrl: values.demoUrl || undefined,
      sourceUrl: values.sourceUrl || undefined,
      featured: values.featured,
      date: values.date,
    }
    saveProject(project)
    navigate('/admin/projects')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? '编辑项目' : '新建项目'}</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/projects"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-ink hover:border-white/30"
          >
            取消
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90"
          >
            保存
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="项目名称" error={errors.name?.message}>
            <input className={inputClass} {...register('name')} />
          </Field>
          <Field
            label="URL 标识（如 huaxia-diancang）"
            error={errors.slug?.message}
          >
            <input
              className={inputClass}
              {...register('slug')}
              readOnly={isEdit}
            />
          </Field>
        </div>

        <Field label="一句话简介" error={errors.summary?.message}>
          <input className={inputClass} {...register('summary')} />
        </Field>

        <Field label="正文（Markdown）">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <MarkdownEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="个人职责" error={errors.role?.message}>
            <input className={inputClass} {...register('role')} />
          </Field>
          <Field label="日期" error={errors.date?.message}>
            <input type="date" className={inputClass} {...register('date')} />
          </Field>
        </div>

        <Field label="技术栈（逗号分隔）">
          <input className={inputClass} {...register('techStackText')} />
        </Field>

        <Field label="成果亮点（每行一个）">
          <textarea className={inputClass} rows={4} {...register('highlightsText')} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="演示链接" error={errors.demoUrl?.message}>
            <input className={inputClass} {...register('demoUrl')} />
          </Field>
          <Field label="源码链接" error={errors.sourceUrl?.message}>
            <input className={inputClass} {...register('sourceUrl')} />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register('featured')}
            className="h-4 w-4 accent-[#4f8cff]"
          />
          精选项目（置顶展示）
        </label>
      </div>
    </form>
  )
}
