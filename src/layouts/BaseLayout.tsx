import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import StarField from '../components/StarField'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/about', label: '关于我', end: false },
  { to: '/skills', label: '技能', end: false },
  { to: '/projects', label: '项目', end: false },
  { to: '/blog', label: '博客', end: false },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'text-accent bg-accent/10'
      : 'text-ink-muted hover:text-ink'
  }`

export default function BaseLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <StarField />

      <header className="sticky top-0 z-20 border-b border-white/5 bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-ink">
            梁宏宇<span className="text-accent">.</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-ink md:hidden"
            aria-label="切换导航菜单"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/5 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-ink-muted">
          © 2026 梁宏宇 · 人工智能算法工程师
          <span className="mx-2">·</span>
          <Link to="/admin" className="hover:text-ink">
            后台管理
          </Link>
        </div>
      </footer>
    </div>
  )
}
