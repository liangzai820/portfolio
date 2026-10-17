import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSettings, updateSettings } from '../../api'
import { hashPassword } from '../../lib/hash'
import type { Settings } from '../../types'
import Field, { inputClass } from '../components/Field'

const settingsSchema = z
  .object({
    siteTitle: z.string().min(1, '请输入站点标题'),
    siteDescription: z.string(),
    adminUsername: z.string().min(1, '请输入管理员用户名'),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: '两次输入的新密码不一致',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof settingsSchema>

export default function AdminSettings() {
  const initial = getSettings()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteTitle: initial.siteTitle,
      siteDescription: initial.siteDescription,
      adminUsername: initial.adminUsername,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    const current = getSettings()
    const next: Settings = {
      siteTitle: values.siteTitle,
      siteDescription: values.siteDescription,
      adminUsername: values.adminUsername,
      adminPasswordHash: current.adminPasswordHash,
    }

    if (values.newPassword) {
      if (hashPassword(values.currentPassword) !== current.adminPasswordHash) {
        setError('currentPassword', { message: '当前密码错误' })
        return
      }
      next.adminPasswordHash = hashPassword(values.newPassword)
    }

    updateSettings(next)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">站点设置</h1>
        <button
          type="submit"
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

      <div className="space-y-6">
        <section className="rounded-xl border border-white/5 bg-surface/40 p-5">
          <h2 className="mb-4 text-lg font-semibold">站点信息</h2>
          <div className="space-y-4">
            <Field label="站点标题" error={errors.siteTitle?.message}>
              <input className={inputClass} {...register('siteTitle')} />
            </Field>
            <Field label="站点描述">
              <textarea
                className={inputClass}
                rows={2}
                {...register('siteDescription')}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-surface/40 p-5">
          <h2 className="mb-4 text-lg font-semibold">管理员账号</h2>
          <div className="space-y-4">
            <Field label="管理员用户名" error={errors.adminUsername?.message}>
              <input className={inputClass} {...register('adminUsername')} />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-surface/40 p-5">
          <h2 className="mb-4 text-lg font-semibold">修改密码</h2>
          <div className="space-y-4">
            <Field label="当前密码" error={errors.currentPassword?.message}>
              <input
                type="password"
                className={inputClass}
                {...register('currentPassword')}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="新密码">
                <input
                  type="password"
                  className={inputClass}
                  {...register('newPassword')}
                />
              </Field>
              <Field label="确认新密码" error={errors.confirmPassword?.message}>
                <input
                  type="password"
                  className={inputClass}
                  {...register('confirmPassword')}
                />
              </Field>
            </div>
            <p className="text-xs text-ink-muted">
              留空则保持原密码不变。
            </p>
          </div>
        </section>
      </div>
    </form>
  )
}
