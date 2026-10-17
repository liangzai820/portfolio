import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../../api'

const menuItems = [
  { to: '/admin', label: '仪表盘', end: true },
  { to: '/admin/profile', label: '个人信息', end: false },
  { to: '/admin/skills', label: '技能管理', end: false },
  { to: '/admin/projects', label: '项目管理', end: false },
  { to: '/admin/posts', label: '博客管理', end: false },
  { to: '/admin/settings', label: '站点设置', end: false },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive
      ? 'bg-accent/10 text-accent'
      : 'text-ink-muted hover:bg-white/5 hover:text-ink'
  }`

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* 桌面端侧边栏 */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-white/5 bg-surface/40 p-4 md:flex">
        <Link to="/admin" className="mb-6 block px-2 text-lg font-semibold">
          管理后台<span className="text-accent">.</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/5 pt-4">
          <Link
            to="/"
            className="block rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5 hover:text-ink"
          >
            查看网站
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:bg-white/5 hover:text-ink"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 主区域 */}
      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-bg/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-ink md:hidden"
              aria-label="切换侧边栏"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <span className="text-sm text-ink-muted">内容管理</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-ink-muted hover:text-ink">
              查看网站
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-ink-muted hover:text-ink"
            >
              退出
            </button>
          </div>
        </header>

        {/* 移动端侧边栏 */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-64 bg-surface p-4">
              <Link
                to="/admin"
                className="mb-6 block px-2 text-lg font-semibold"
              >
                管理后台<span className="text-accent">.</span>
              </Link>
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={navLinkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:bg-white/5 hover:text-ink"
              >
                退出登录
              </button>
            </aside>
          </div>
        )}

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
