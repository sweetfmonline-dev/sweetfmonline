import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Newsletter service is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString("hex");

    // Insert into Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey as string,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        unsubscribe_token: unsubscribeToken,
        is_active: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Log detailed error for debugging
      console.error("Supabase newsletter subscription error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: `${supabaseUrl}/rest/v1/newsletter_subscribers`,
        hasAnonKey: !!supabaseAnonKey,
      });
      
      // Check if email already exists
      if (response.status === 409 || errorText.includes("duplicate key")) {
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter" },
          { status: 409 }
        );
      }

      // Return more specific error message
      return NextResponse.json(
        { 
          error: "Failed to subscribe. Please try again later.",
          details: process.env.NODE_ENV === 'development' ? errorText : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Successfully subscribed to newsletter!",
        success: true 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status or unsubscribe
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Newsletter service is not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400 }
    );
  }

  try {
    if (action === "unsubscribe") {
      // Update subscription status
      const response = await fetch(
        `${supabaseUrl}/rest/v1/newsletter_subscribers?unsubscribe_token=eq.${token}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseAnonKey as string,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            is_active: false,
          }),
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to unsubscribe" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Successfully unsubscribed from newsletter", success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Newsletter action error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
