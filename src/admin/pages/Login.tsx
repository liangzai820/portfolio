import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAuthenticated, login } from '../../api'
import Field, { inputClass } from '../components/Field'

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  // 已登录则直接进入后台
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (values: LoginValues) => {
    setLoginError('')
    const res = await login(values.username, values.password)
    if (res.ok) {
      navigate('/admin', { replace: true })
    } else {
      setLoginError(res.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-ink">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-white/5 bg-surface/60 p-8"
      >
        <h1 className="mb-1 text-xl font-semibold">管理后台登录</h1>
        <p className="mb-6 text-sm text-ink-muted">默认账号 admin / admin123</p>

        <div className="space-y-4">
          <Field label="用户名" error={errors.username?.message}>
            <input
              className={inputClass}
              autoComplete="username"
              {...register('username')}
            />
          </Field>
          <Field label="密码" error={errors.password?.message}>
            <input
              type="password"
              className={inputClass}
              autoComplete="current-password"
              {...register('password')}
            />
          </Field>
        </div>

        {loginError && <p className="mt-4 text-sm text-red-400">{loginError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-accent py-2.5 font-medium text-bg hover:bg-accent/90 disabled:opacity-60"
        >
          {isSubmitting ? '登录中…' : '登录'}
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-sm text-ink-muted hover:text-ink"
        >
          ← 返回前台
        </Link>
      </form>
    </div>
  )
}
