import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Layout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth()

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-title">
          note資料メーカー
        </Link>
        <nav className="app-nav">
          <Link to="/">作成</Link>
          <Link to="/history">履歴</Link>
          <button type="button" className="logout-button" onClick={signOut}>
            ログアウト
          </button>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
