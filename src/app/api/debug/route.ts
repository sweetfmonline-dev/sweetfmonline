import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    contentful: {
      spaceId: process.env.CONTENTFUL_SPACE_ID ? "set" : "MISSING",
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? "set" : "MISSING",
      managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN ? "set" : "MISSING",
    },
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "MISSING",
    },
    adsense: process.env.NEXT_PUBLIC_ADSENSE_ID ? "set" : "MISSING",
    nodeEnv: process.env.NODE_ENV,
  });
}
