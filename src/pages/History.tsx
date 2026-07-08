import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { ArticlePattern } from '../components/ArticlePattern'
import { RandomIllustration } from '../components/illustrations'
import { supabase } from '../lib/supabaseClient'
import type { Generation } from '../types/generation'

export function History() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchGenerations = async () => {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setErrorMessage('履歴の取得に失敗しました')
      } else {
        setGenerations(data ?? [])
      }
      setLoading(false)
    }

    fetchGenerations()
  }, [])

  return (
    <Layout>
      <div className="history-page">
        <h1>過去の作成履歴</h1>

        {loading && <p>読み込み中...</p>}
        {errorMessage && <p className="form-error">{errorMessage}</p>}

        {!loading && generations.length === 0 && <p>まだ作成履歴がありません</p>}

        <ul className="history-list">
          {generations.map((generation) => (
            <li key={generation.id} className="history-item">
              <p className="history-keyword">{generation.keyword}</p>
              <p className="history-date">
                {new Date(generation.created_at).toLocaleString('ja-JP')}
              </p>
              <RandomIllustration seed={generation.id} />
              <ul className="pattern-list">
                {generation.patterns.map((pattern) => (
                  <ArticlePattern key={pattern} content={pattern} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
