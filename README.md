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

4. Gemini APIキー（[Google AI Studio](https://aistudio.google.com/)で無料取得）をSupabaseのEdge Functionシークレットとして登録し、Edge Functionをデプロイする（クライアントに公開しないため`.env`には入れない）

   ```bash
   supabase secrets set GEMINI_API_KEY=your-gemini-api-key
   supabase functions deploy generate-patterns
   ```

5. 開発サーバーを起動

   ```bash
   npm run dev
   ```

## 資料自動生成の仕組み

キーワード入力からの記事本文生成は、Supabase Edge Function（`supabase/functions/generate-patterns`）経由でGemini APIを呼び出す構成。Gemini APIキーをフロントエンドに直接持たせるとブラウザで露出してしまうため、サーバーサイド（Edge Function）にのみ保持する。Gemini API・Supabase Edge Functionsともに無料枠があるため、低コストでの運用を想定している。

記事に添える画像は「無料イラスト」「AI生成画像」の2種類から選択できる。

- **無料イラスト**：外部APIを使わず、アプリ内蔵のパステルカラーのオリジナルイラスト（[src/components/illustrations.tsx](src/components/illustrations.tsx)）をランダム表示する。課金なしで運用できる
- **AI生成画像**：Gemini画像生成（`gemini-2.5-flash-image`）でキーワードに合わせたイラストを都度生成し、Supabase Storageの`generated-images`バケットにアップロードして表示する。**Google Cloud側で課金を有効化する必要があり、1枚あたり少額の費用が発生する**

AI生成画像を使う場合は、Gemini APIキーを発行したGoogle Cloudプロジェクトで課金を有効化しておくこと。
