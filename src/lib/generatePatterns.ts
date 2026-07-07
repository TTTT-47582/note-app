// キーワードから複数パターンのnote資料タイトル案を生成する
// TODO: 現状はテンプレートによる仮実装。将来的には外部AI APIと連携して精度を上げる想定
const TEMPLATES = [
  (keyword: string) => `${keyword}を始める人が最初に知っておくべきこと`,
  (keyword: string) => `${keyword}で失敗しないための5つのポイント`,
  (keyword: string) => `初心者から見た${keyword}のリアル`,
  (keyword: string) => `${keyword}を続けて分かったこと`,
  (keyword: string) => `${keyword}比較：何を選べばいいのか`,
]

export function generatePatterns(keyword: string): string[] {
  return TEMPLATES.map((template) => template(keyword))
}
