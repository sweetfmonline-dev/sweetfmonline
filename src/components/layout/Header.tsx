import { TopBar } from "./TopBar";
import { MainNav } from "./MainNav";
import { BreakingNewsTicker } from "./BreakingNewsTicker";
import { getBreakingNews } from "@/lib/contentful";

export async function Header() {
  const breakingNews = await getBreakingNews();

  return (
    <header className="w-full">
      <TopBar />
      <MainNav />
      <BreakingNewsTicker news={breakingNews} />
    </header>
  );
}
