import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/data";
import { OVERSIGHT_SUBSECTION_BY_SLUG } from "@/lib/oversight";
import { SubsectionLanding } from "@/components/oversight/SubsectionLanding";

const SLUG = "the-long-read";
const config = OVERSIGHT_SUBSECTION_BY_SLUG[SLUG];

export const metadata: Metadata = {
  title: `${config.label} — OverSight PI`,
  description: config.description,
  alternates: {
    canonical: `https://www.sweetfmonline.com/oversight-pi/${SLUG}`,
  },
  openGraph: {
    title: `${config.label} — OverSight PI`,
    description: config.description,
    url: `https://www.sweetfmonline.com/oversight-pi/${SLUG}`,
    type: "website",
  },
};

export const revalidate = 300;

export default async function Page() {
  if (!config) notFound();
  const articles = await getArticlesByCategory(SLUG);
  return <SubsectionLanding config={config} articles={articles} />;
}
