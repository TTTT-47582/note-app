import { useState } from 'react'

// 生成された記事本文を表示し、noteへの貼り付け用にコピーできるカード
export function ArticlePattern({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <li className="pattern-item">
      <button type="button" className="copy-button" onClick={handleCopy}>
        {copied ? 'コピーしました' : 'コピーする'}
      </button>
      <pre className="pattern-content">{content}</pre>
    </li>
  )
}
