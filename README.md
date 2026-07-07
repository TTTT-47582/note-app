# note-app

noteに投稿するための資料（記事の元ネタ）をキーワードから自動作成するアプリ。

技術構成やGit運用ルールは [CLAUDE.md](./CLAUDE.md) を参照。

## セットアップ

1. 依存パッケージをインストール

   ```bash
   npm install
   ```

2. Supabaseプロジェクトを作成し、`supabase/schema.sql` の内容をSQL Editorで実行してテーブルを用意する

3. `.env.example` を `.env` にコピーし、SupabaseのProject URLとAnon Keyを設定する

   ```bash
   cp .env.example .env
   ```

4. Gemini APIキー（[Google AI Studio](https://aistudio.google.com/)で無料取得）をSupabaseのEdge Functionシークレットとして登録し、Edge Functionをデプロイする（Gemini APIキーはクライアントに公開しないため`.env`には入れない）

   ```bash
   supabase secrets set GEMINI_API_KEY=your-gemini-api-key
   supabase functions deploy generate-patterns
   ```

5. 開発サーバーを起動

   ```bash
   npm run dev
   ```

## 資料自動生成の仕組み

キーワード入力からのタイトル案生成は、Supabase Edge Function（`supabase/functions/generate-patterns`）経由でGemini APIを呼び出す構成。Gemini APIキーをフロントエンドに直接持たせるとブラウザで露出してしまうため、サーバーサイド（Edge Function）にのみ保持する。GeminiのAPI・Supabase Edge Functionsともに無料枠があるため、低コストでの運用を想定している。
