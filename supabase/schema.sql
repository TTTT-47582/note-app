-- Supabaseのプロジェクトで実行するテーブル定義
-- SQL Editorに貼り付けて実行してください

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  keyword text not null,
  patterns text[] not null,
  created_at timestamptz not null default now()
);

alter table generations enable row level security;

-- 自分が作成した履歴のみ参照・追加できるようにする
create policy "generations_select_own" on generations
  for select using (auth.uid() = user_id);

create policy "generations_insert_own" on generations
  for insert with check (auth.uid() = user_id);
