import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-bg-primary px-4 text-center">
      <p className="text-[80px] font-extrabold text-text-tertiary/20 leading-none select-none">
        404
      </p>
      <h1 className="mt-4 text-h2 font-bold text-text-primary">页面不存在</h1>
      <p className="mt-2 text-body text-text-tertiary">
        你访问的页面可能已被移除或链接错误
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-body-sm text-white font-medium hover:bg-primary-hover transition-colors"
      >
        <Home className="h-4 w-4" />
        返回首页
      </Link>
    </div>
  )
}
