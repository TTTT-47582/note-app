# CLAUDE.md

## プロジェクト概要

note-app は、noteに投稿するための資料（記事の元ネタ）を自動作成するアプリケーション。

### 機能要件
- パスワードでログインできる
- ログイン後、キーワードを入力すると複数パターンの資料を自動生成する
- 過去に生成したデータを確認できる履歴ページを設ける
- 未ログインの場合はログイン画面にリダイレクトする
- ログアウトボタンを設ける

### 技術要件（確定）
- React + Vite + TypeScript
- Supabase（認証・データ保存）※無料枠で機能拡張しやすいため採用
- 資料自動生成はGemini API（無料枠を優先利用）を使用。GeminiのAPIキーはクライアントに公開しないよう、Supabase Edge Function（`supabase/functions/generate-patterns`）経由でのみ呼び出す
- 記事に添える画像は「無料イラスト」「AI生成画像」を選択式にする
  - 無料イラスト：外部APIを使わず、アプリ内蔵のオリジナルSVGイラスト（`src/components/illustrations.tsx`）をランダム表示（無料）
  - AI生成画像：Gemini画像生成（`gemini-2.5-flash-image`、通称Nano Banana）でキーワードに合わせた画像を生成し、Supabase Storage（`generated-images`バケット）にアップロードして表示（Google Cloud側で課金有効化が必要、1枚あたり少額課金）
- SupabaseのProject URL / Anon Key は `.env` で管理し、`.gitignore` に追加してリポジトリに含めない。Gemini APIキーは`.env`ではなくSupabaseのEdge Functionシークレットとして管理する
- コメントは日本語で記載する
- 全体としてなるべく無料枠内で運用できる構成にする

### UI要件
- ログイン画面はシンプルなフォーム
- 配色は女性っぽい（パステル調など）カラーを採用する

## Git運用ルール

- **コードに変更を加えたら、都度コミットしてGitHubにプッシュすること。** 変更を溜め込まず、こまめにコミット・プッシュする。
- コミットメッセージは変更内容が分かるように簡潔に記載する。
- `.env` など秘密情報を含むファイルは絶対にコミットしない（`.gitignore` で除外を徹底する）。
- push前に意図しない変更が含まれていないか `git status` / `git diff` で確認する。
- force push など破壊的な操作は行わない（必要な場合は事前にユーザーへ確認する）。

リモートリポジトリ: https://github.com/TTTT-47582/note-app.git（`origin`/`main`）
