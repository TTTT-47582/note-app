// キーワードからnoteにそのまま投稿できる記事本文を複数パターン生成するEdge Function
// Gemini APIキーはSupabaseのシークレットとして保存し、クライアントには公開しない
import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = "gemini-2.5-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "認証が必要です" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 呼び出し元のログイン状態を検証する
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "認証が無効です" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== "string") {
      return new Response(JSON.stringify({ error: "keywordが必要です" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEYが設定されていません" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const PATTERN_COUNT = 3;
    const PATTERN_DELIMITER = "---PATTERN---";

    const prompt =
      `あなたはnote(note.com)のクリエイター向けアシスタントです。` +
      `キーワード「${keyword}」を使って、noteにそのまま投稿できる完成した記事を${PATTERN_COUNT}パターン、日本語で作成してください。\n` +
      `各記事は次の構成にしてください。\n` +
      `1. 1行目に記事タイトル\n` +
      `2. 読者の興味を引く導入文（2〜3文）\n` +
      `3. 見出し付きの本文を2〜3セクション（見出しは「■」を先頭につける）\n` +
      `4. まとめの段落\n\n` +
      `${PATTERN_COUNT}パターンそれぞれの間は、必ず改行を挟んで "${PATTERN_DELIMITER}" という区切り文字だけの行を入れてください。` +
      `それ以外の説明文・前置き・番号付けは一切出力せず、記事本文のみを出力してください。`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 4096 },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: "Gemini APIの呼び出しに失敗しました", detail: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const patterns = rawText
      .split(PATTERN_DELIMITER)
      .map((article: string) => article.trim())
      .filter((article: string) => article.length > 0)
      .slice(0, PATTERN_COUNT);

    return new Response(JSON.stringify({ patterns }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "予期しないエラーが発生しました", detail: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
