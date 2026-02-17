const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

interface QueryOptions {
  table: string;
  select: string;
  filters?: Record<string, string>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}

export async function supabaseRestFetch<T>({
  table,
  select,
  filters,
  order,
  limit,
}: QueryOptions): Promise<T[]> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  const baseUrl = supabaseUrl as string;
  const anonKey = supabaseAnonKey as string;

  const params = new URLSearchParams({ select });

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      params.set(key, value);
    }
  }

  if (order) {
    params.set("order", `${order.column}.${order.ascending ? "asc" : "desc"}`);
  }

  if (typeof limit === "number") {
    params.set("limit", String(limit));
  }

  const response = await fetch(`${baseUrl}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase query failed (${response.status}): ${message}`);
  }

  return (await response.json()) as T[];
}
