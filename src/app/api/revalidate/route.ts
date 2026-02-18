import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint for Contentful webhooks.
 *
 * Set up a Contentful webhook to POST to:
 *   https://sweetfmonline.com/api/revalidate?secret=YOUR_SECRET
 *
 * Add REVALIDATION_SECRET to your Vercel environment variables.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate all main paths
    revalidatePath("/");
    revalidatePath("/article/[slug]", "page");
    revalidatePath("/category/[...slug]", "page");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}
