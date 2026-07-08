import { useState } from 'react'
import type { FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { ArticlePattern } from '../components/ArticlePattern'
import { RandomIllustration } from '../components/illustrations'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

export function Dashboard() {
  const { session } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [patterns, setPatterns] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!session) return

    setSubmitting(true)
    setErrorMessage(null)

    // Gemini APIキーを扱うEdge Function経由で記事本文を生成する
    const { data, error: functionError } = await supabase.functions.invoke<{
      patterns?: string[]
      error?: string
    }>('generate-patterns', { body: { keyword } })

    if (functionError || !data?.patterns) {
      setSubmitting(false)
      setErrorMessage('資料の自動生成に失敗しました')
      return
    }

    const generated = data.patterns

    const { error } = await supabase.from('generations').insert({
      user_id: session.user.id,
      keyword,
      patterns: generated,
    })

    setSubmitting(false)

    if (error) {
      setErrorMessage('生成結果の保存に失敗しました')
      return
    }

    setPatterns(generated)
  }

  return (
    <Layout>
      <div className="dashboard-page">
        <h1>資料を作成する</h1>
        <form className="keyword-form" onSubmit={handleSubmit}>
          <label>
            キーワード
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例：在宅ワーク"
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? '生成中...' : '自動生成する'}
          </button>
        </form>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        {patterns.length > 0 && (
          <>
            <RandomIllustration seed={keyword} />
            <ul className="pattern-list">
              {patterns.map((pattern) => (
                <ArticlePattern key={pattern} content={pattern} />
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  )
}
