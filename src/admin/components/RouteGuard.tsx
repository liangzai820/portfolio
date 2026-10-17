import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../api'

// 路由守卫：未登录时重定向到登录页
export default function RouteGuard() {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
