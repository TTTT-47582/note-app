import { useState } from 'react'
import type { FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { ArticlePattern } from '../components/ArticlePattern'
import { RandomIllustration } from '../components/illustrations'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'

type ImageMode = 'free' | 'ai'

export function Dashboard() {
  const { session } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [imageMode, setImageMode] = useState<ImageMode>('free')
  const [patterns, setPatterns] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!session) return

    setSubmitting(true)
    setErrorMessage(null)

    // Gemini APIキーを扱うEdge Function経由で記事本文（と必要ならAI画像）を生成する
    const { data, error: functionError } = await supabase.functions.invoke<{
      patterns?: string[]
      imageUrl?: string | null
      imageError?: string | null
      error?: string
    }>('generate-patterns', { body: { keyword, useAiImage: imageMode === 'ai' } })

    if (functionError || !data?.patterns) {
      setSubmitting(false)
      setErrorMessage('資料の自動生成に失敗しました')
      return
    }

    const generated = data.patterns
    const generatedImageUrl = data.imageUrl ?? null

    const { error } = await supabase.from('generations').insert({
      user_id: session.user.id,
      keyword,
      patterns: generated,
      image_url: generatedImageUrl,
    })

    setSubmitting(false)

    if (error) {
      setErrorMessage('生成結果の保存に失敗しました')
      return
    }

    setPatterns(generated)
    setImageUrl(generatedImageUrl)

    if (imageMode === 'ai' && !generatedImageUrl) {
      setErrorMessage(
        data.imageError
          ? `AI画像生成に失敗しました（${data.imageError}）。無料イラストを表示します`
          : 'AI画像生成に失敗しました。無料イラストを表示します',
      )
    }
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

        <fieldset className="image-mode-fieldset">
          <legend>画像の種類</legend>
          <label className="image-mode-option">
            <input
              type="radio"
              name="imageMode"
              value="free"
              checked={imageMode === 'free'}
              onChange={() => setImageMode('free')}
            />
            無料イラスト
          </label>
          <label className="image-mode-option">
            <input
              type="radio"
              name="imageMode"
              value="ai"
              checked={imageMode === 'ai'}
              onChange={() => setImageMode('ai')}
            />
            AI生成画像（少額課金）
          </label>
        </fieldset>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        {patterns.length > 0 && (
          <>
            {imageUrl ? (
              <img src={imageUrl} alt="" className="ai-image" />
            ) : (
              <RandomIllustration seed={keyword} />
            )}
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
