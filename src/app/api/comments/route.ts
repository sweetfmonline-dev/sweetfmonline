import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

function supabaseHeaders() {
  return {
    apikey: supabaseAnonKey!,
    Authorization: `Bearer ${supabaseAnonKey!}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    Prefer: "return=representation",
  };
}

// GET /api/comments?slug=article-slug
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Comments service unavailable" }, { status: 503 });
  }

  try {
    const params = new URLSearchParams({
      select: "id,article_slug,author_name,content,created_at",
      article_slug: `eq.${slug}`,
      order: "created_at.desc",
    });

    const res = await fetch(`${supabaseUrl}/rest/v1/comments?${params.toString()}`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase GET comments failed:", res.status, text);
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }

    const comments = await res.json();
    return NextResponse.json(comments);
  } catch (e) {
    console.error("Comments fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Comments service unavailable" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { article_slug, author_name, content } = body;

    // Validation
    if (!article_slug || typeof article_slug !== "string") {
      return NextResponse.json({ error: "Missing article_slug" }, { status: 400 });
    }
    if (!author_name || typeof author_name !== "string" || author_name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 3) {
      return NextResponse.json({ error: "Comment must be at least 3 characters" }, { status: 400 });
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: "Comment must be under 2000 characters" }, { status: 400 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/comments`, {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify({
        article_slug: article_slug.trim(),
        author_name: author_name.trim(),
        content: content.trim(),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase POST comment failed:", res.status, text);
      return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }

    const [comment] = await res.json();
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    console.error("Comment post error:", e);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
