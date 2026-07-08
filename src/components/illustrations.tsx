// アプリ内蔵のパステルカラーイラスト（外部APIを使わず完全無料で表示するための自作SVG）
function NotebookIllustration() {
  return (
    <svg viewBox="0 0 200 140" role="presentation" aria-hidden="true">
      <rect width="200" height="140" rx="16" fill="#fbcfe8" />
      <circle cx="150" cy="35" r="28" fill="#fde68a" opacity="0.7" />
      <rect x="55" y="30" width="90" height="80" rx="6" fill="#ffffff" />
      <rect x="55" y="30" width="90" height="14" rx="6" fill="#ec4899" />
      <line x1="65" y1="60" x2="125" y2="60" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="75" x2="135" y2="75" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="90" x2="110" y2="90" stroke="#f9a8d4" strokeWidth="4" strokeLinecap="round" />
      <rect x="130" y="95" width="10" height="34" rx="4" fill="#db2777" transform="rotate(35 130 95)" />
    </svg>
  )
}

function IdeaIllustration() {
  return (
    <svg viewBox="0 0 200 140" role="presentation" aria-hidden="true">
      <rect width="200" height="140" rx="16" fill="#ddd6fe" />
      <circle cx="100" cy="60" r="34" fill="#fef3c7" />
      <rect x="88" y="92" width="24" height="18" rx="4" fill="#fef3c7" />
      <rect x="90" y="112" width="20" height="8" rx="4" fill="#c4b5fd" />
      <line x1="100" y1="10" x2="100" y2="22" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <line x1="150" y1="60" x2="162" y2="60" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="38" y2="60" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <line x1="136" y1="24" x2="145" y2="15" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <line x1="64" y1="24" x2="55" y2="15" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function ChatIllustration() {
  return (
    <svg viewBox="0 0 200 140" role="presentation" aria-hidden="true">
      <rect width="200" height="140" rx="16" fill="#fee2e2" />
      <rect x="30" y="30" width="100" height="60" rx="16" fill="#ffffff" />
      <polygon points="55,90 55,108 78,90" fill="#ffffff" />
      <circle cx="55" cy="60" r="6" fill="#f472b6" />
      <circle cx="80" cy="60" r="6" fill="#f472b6" />
      <circle cx="105" cy="60" r="6" fill="#f472b6" />
      <rect x="110" y="55" width="60" height="42" rx="14" fill="#ec4899" />
      <polygon points="150,97 150,112 132,97" fill="#ec4899" />
      <line x1="122" y1="70" x2="158" y2="70" stroke="#fbcfe8" strokeWidth="4" strokeLinecap="round" />
      <line x1="122" y1="82" x2="148" y2="82" stroke="#fbcfe8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function LaptopIllustration() {
  return (
    <svg viewBox="0 0 200 140" role="presentation" aria-hidden="true">
      <rect width="200" height="140" rx="16" fill="#fef9c3" />
      <rect x="55" y="35" width="90" height="58" rx="6" fill="#ffffff" stroke="#facc15" strokeWidth="3" />
      <rect x="65" y="45" width="70" height="8" rx="2" fill="#fde68a" />
      <rect x="65" y="58" width="50" height="6" rx="2" fill="#fbcfe8" />
      <rect x="65" y="70" width="60" height="6" rx="2" fill="#fbcfe8" />
      <path d="M40 98 h120 l10 20 h-140 z" fill="#facc15" />
      <circle cx="150" cy="40" r="18" fill="#fca5a5" opacity="0.8" />
    </svg>
  )
}

function BlobIllustration() {
  return (
    <svg viewBox="0 0 200 140" role="presentation" aria-hidden="true">
      <rect width="200" height="140" rx="16" fill="#fdf2f8" />
      <circle cx="70" cy="60" r="40" fill="#f9a8d4" opacity="0.8" />
      <circle cx="140" cy="80" r="30" fill="#ddd6fe" opacity="0.8" />
      <circle cx="120" cy="40" r="18" fill="#fde68a" opacity="0.9" />
      <circle cx="100" cy="90" r="10" fill="#ec4899" />
    </svg>
  )
}

const ILLUSTRATIONS = [
  NotebookIllustration,
  IdeaIllustration,
  ChatIllustration,
  LaptopIllustration,
  BlobIllustration,
]

// 文字列から0以上の整数ハッシュを作る（同じseedなら常に同じイラストを選ぶため）
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

// seedを指定すると同じイラストが安定して表示され、指定しないとランダムに選ばれる
export function RandomIllustration({ seed }: { seed?: string }) {
  const index = seed
    ? hashString(seed) % ILLUSTRATIONS.length
    : Math.floor(Math.random() * ILLUSTRATIONS.length)
  const Illustration = ILLUSTRATIONS[index]

  return (
    <div className="illustration">
      <Illustration />
    </div>
  )
}
