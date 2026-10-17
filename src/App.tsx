import { Routes, Route } from 'react-router-dom'
import BaseLayout from './layouts/BaseLayout'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'

import RouteGuard from './admin/components/RouteGuard'
import AdminLayout from './admin/layouts/AdminLayout'
import AdminLogin from './admin/pages/Login'
import Dashboard from './admin/pages/Dashboard'
import AdminProfile from './admin/pages/Profile'
import AdminSkills from './admin/pages/Skills'
import AdminProjects from './admin/pages/Projects'
import ProjectEdit from './admin/pages/ProjectEdit'
import AdminPosts from './admin/pages/Posts'
import PostEdit from './admin/pages/PostEdit'
import AdminSettings from './admin/pages/Settings'

export default function App() {
  return (
    <Routes>
      {/* 前台 */}
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Route>

      {/* 后台（登录页独立，其余受路由守卫保护） */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RouteGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<ProjectEdit />} />
          <Route path="projects/:slug/edit" element={<ProjectEdit />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<PostEdit />} />
          <Route path="posts/:slug/edit" element={<PostEdit />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  )
}
