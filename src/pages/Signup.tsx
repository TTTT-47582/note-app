import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Signup() {
  const { session, signUpWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signedUp, setSignedUp] = useState(false)

  if (session) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)
    setSubmitting(true)

    const { error } = await signUpWithPassword(email, password)

    setSubmitting(false)
    if (error) {
      setErrorMessage('会員登録に失敗しました。入力内容をご確認ください')
      return
    }

    setSignedUp(true)
  }

  if (signedUp) {
    return (
      <div className="login-page">
        <div className="login-form">
          <h1>登録完了</h1>
          <p>
            確認メールを送信しました。メール内のリンクを開いて登録を完了してください。
          </p>
          <Link to="/login">ログイン画面へ戻る</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '会員登録する'}
        </button>
        <p className="form-footer-link">
          <Link to="/login">すでにアカウントをお持ちの方はこちら</Link>
        </p>
      </form>
    </div>
  )
}
