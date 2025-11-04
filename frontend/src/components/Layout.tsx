import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 py-2 text-xl font-bold text-primary-400">
                📚 JS Daily
              </Link>
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  오늘의 문제
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/history')
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  히스토리
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

