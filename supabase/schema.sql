-- Supabaseのプロジェクトで実行するテーブル定義
-- SQL Editorに貼り付けて実行してください

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  keyword text not null,
  patterns text[] not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- 既存環境向け：カラムが未追加であれば追加する
alter table generations add column if not exists image_url text;

alter table generations enable row level security;

-- 自分が作成した履歴のみ参照・追加できるようにする（再実行できるよう一度削除してから作成する）
drop policy if exists "generations_select_own" on generations;
create policy "generations_select_own" on generations
  for select using (auth.uid() = user_id);

drop policy if exists "generations_insert_own" on generations;
create policy "generations_insert_own" on generations
  for insert with check (auth.uid() = user_id);

-- AI生成画像を保存する公開ストレージバケット（Edge Functionからservice roleでアップロードする）
insert into storage.buckets (id, name, public)
values ('generated-images', 'generated-images', true)
on conflict (id) do nothing;
