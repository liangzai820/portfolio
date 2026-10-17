import { Link, useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getPost, savePost } from '../../api'
import type { Post } from '../../types'
import Field, { inputClass } from '../components/Field'
import MarkdownEditor from '../components/MarkdownEditor'

const postSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  slug: z
    .string()
    .min(1, '请输入 URL 标识')
    .regex(/^[a-z0-9-]+$/, '仅支持小写字母、数字、连字符'),
  summary: z.string().min(1, '请输入摘要'),
  content: z.string(),
  tagsText: z.string(),
  date: z.string().min(1, '请选择日期'),
  draft: z.boolean(),
})

type FormValues = z.infer<typeof postSchema>

export default function PostEdit() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEdit = slug != null
  const existing = slug ? getPost(slug) : undefined

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: existing?.title ?? '',
      slug: existing?.slug ?? '',
      summary: existing?.summary ?? '',
      content: existing?.content ?? '',
      tagsText: existing?.tags.join(', ') ?? '',
      date: existing?.date ?? new Date().toISOString().slice(0, 10),
      draft: existing?.draft ?? false,
    },
  })

  if (isEdit && !existing) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <p className="mb-4">未找到该文章。</p>
        <Link to="/admin/posts" className="text-accent">
          返回博客管理
        </Link>
      </div>
    )
  }

  const onSubmit = (values: FormValues) => {
    if (!isEdit && getPost(values.slug)) {
      setError('slug', { message: '该标识已存在，请更换' })
      return
    }
    const post: Post = {
      slug: values.slug,
      title: values.title,
      summary: values.summary,
      content: values.content,
      tags: values.tagsText
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
      date: values.date,
      readingTime: Math.max(1, Math.ceil(values.content.length / 400)),
      draft: values.draft,
    }
    savePost(post)
    navigate('/admin/posts')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? '编辑文章' : '新建文章'}</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/posts"
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
          <Field label="标题" error={errors.title?.message}>
            <input className={inputClass} {...register('title')} />
          </Field>
          <Field
            label="URL 标识（如 learning-path）"
            error={errors.slug?.message}
          >
            <input className={inputClass} {...register('slug')} readOnly={isEdit} />
          </Field>
        </div>

        <Field label="摘要" error={errors.summary?.message}>
          <textarea className={inputClass} rows={2} {...register('summary')} />
        </Field>

        <Field label="正文（Markdown）">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <MarkdownEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="标签（逗号分隔）">
            <input className={inputClass} {...register('tagsText')} />
          </Field>
          <Field label="发布日期" error={errors.date?.message}>
            <input type="date" className={inputClass} {...register('date')} />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register('draft')}
            className="h-4 w-4 accent-[#4f8cff]"
          />
          草稿（保存为草稿，前台不展示）
        </label>
      </div>
    </form>
  )
}
