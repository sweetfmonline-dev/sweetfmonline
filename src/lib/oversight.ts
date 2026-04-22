// OverSight PI — central config for all subsections.
// Adding a new vertical? Add it here, create a new page under /oversight-pi/<slug>,
// and add a matching category in Supabase.

export interface OversightSubsectionConfig {
  slug: string;
  label: string;        // Full display label
  shortBadge: string;   // Short badge shown on article cards (e.g. "Dossier")
  title: string;        // Hero title
  titleAccent?: string; // Optional italicized red accent segment of the title
  kicker: string;       // Small caps kicker above the title
  description: string;  // Hero subtitle
  readActionLabel: string; // CTA text
  heroImage: string;
  heroAlt: string;
}

export const OVERSIGHT_PARENT_SLUG = "oversight-pi";

export const OVERSIGHT_SUBSECTIONS: OversightSubsectionConfig[] = [
  {
    slug: "the-dossier",
    label: "The Dossier",
    shortBadge: "Dossier",
    title: "The",
    titleAccent: "Dossier",
    kicker: "Long-Form Investigations",
    description:
      "Deep reporting on power, institutions, and public officials. Months of work. Documents, sources, and accountability.",
    readActionLabel: "Read the Report",
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
    heroAlt: "Stacks of documents and files",
  },
  {
    slug: "fact-check",
    label: "Fact Check",
    shortBadge: "Fact Check",
    title: "Fact",
    titleAccent: "Check",
    kicker: "Verified. Sourced. Rated.",
    description:
      "Verification of political claims, viral rumors, and statements from public figures. Evidence over noise.",
    readActionLabel: "Read the Verdict",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2400&q=80",
    heroAlt: "Magnifying glass over text",
  },
  {
    slug: "the-long-read",
    label: "The Long Read",
    shortBadge: "Long Read",
    title: "The Long",
    titleAccent: "Read",
    kicker: "Literary Journalism",
    description:
      "Profiles, essays, and cultural deep dives. Stories that reward the patient reader.",
    readActionLabel: "Begin Reading",
    heroImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2400&q=80",
    heroAlt: "Open book with reading light",
  },
  {
    slug: "the-forum",
    label: "The Forum",
    shortBadge: "The Forum",
    title: "The",
    titleAccent: "Forum",
    kicker: "Guest Voices",
    description:
      "Op-eds from academics, former officials, activists, and industry experts. Many voices, one arena.",
    readActionLabel: "Read the Essay",
    heroImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2400&q=80",
    heroAlt: "Panel discussion with speakers and audience",
  },
  {
    slug: "bolshevik-perspective",
    label: "Bolshevik Perspective",
    shortBadge: "Bolshevik",
    title: "Bolshevik",
    titleAccent: "Perspective",
    kicker: "Signature Editorial",
    description:
      "Editorials and commentary by Scott Bolshevik. Unfiltered. Unafraid. Uncompromising.",
    readActionLabel: "Read the Editorial",
    heroImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2400&q=80",
    heroAlt: "Vintage typewriter",
  },
];

export const OVERSIGHT_SUBSECTION_BY_SLUG: Record<string, OversightSubsectionConfig> =
  Object.fromEntries(OVERSIGHT_SUBSECTIONS.map((s) => [s.slug, s]));

// All category slugs (parent + subsections) that belong to OverSight PI
export const OVERSIGHT_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
  OVERSIGHT_PARENT_SLUG,
  ...OVERSIGHT_SUBSECTIONS.map((s) => s.slug),
]);

export function isOversightCategory(slug?: string | null): boolean {
  return !!slug && OVERSIGHT_CATEGORY_SLUGS.has(slug);
}
