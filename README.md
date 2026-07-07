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

4. 開発サーバーを起動

   ```bash
   npm run dev
   ```
