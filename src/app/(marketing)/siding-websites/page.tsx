import { TradePage } from "@/components/daybreak/TradePage";
import { tradePages } from "@/lib/daybreak";
import { openGraphDefaults } from "@/lib/seo";
import type { Metadata } from "next";

const page = tradePages.siding;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    ...openGraphDefaults,
    url: page.path,
    title: `${page.title} | Daybreak Structure-Works`,
    description: page.description,
  },
};

export default function Page() {
  return <TradePage page={page} />;
}
