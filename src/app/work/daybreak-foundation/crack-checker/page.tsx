import type { Metadata } from "next";
import { Crumbs, PillLabel } from "@/components/template/primitives";
import { CrackChecker } from "@/components/tools/CrackChecker";
import { company, demoBase, homeHref, quoteCta, tool } from "@/lib/site";

export const metadata: Metadata = {
  title: "Is My Foundation Crack Serious? Free Crack Checker",
  description: `Answer four questions about a crack in your brick, drywall or slab and see how serious it probably is, what usually causes it and what a fix typically costs in ${company.locality}.`,
  alternates: { canonical: `${demoBase}/crack-checker` },
};

export default function CrackCheckerPage() {
  return (
    <section className="bg-white pb-24 pt-8 lg:pb-32 lg:pt-10">
      <div className="container-x">
        <Crumbs trail={[{ name: "Home", href: homeHref }, { name: tool.name }]} />

        <div className="mt-10 max-w-3xl lg:mt-14">
          <PillLabel>{tool.name}</PillLabel>
          <h1 className="home-display mt-5 text-[clamp(2.6rem,5.4vw,4.5rem)] text-fg">Is that crack serious?</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-muted sm:text-[18px]">
            Four questions about what you&rsquo;re seeing. You&rsquo;ll get a plain answer, the usual cause, and what a fix
            typically costs around {company.address.city}. {tool.reassurance}
          </p>
        </div>

        <div className="mt-12 rounded-[32px] bg-card p-2 sm:p-2.5">
          <CrackChecker bookHref={quoteCta.href} phone={{ display: company.phoneDisplay, href: company.phoneHref }} />
        </div>

        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {tool.steps.map((s, i) => (
            <li key={s.title} className="rounded-[28px] bg-card px-7 py-8 text-center">
              <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-fg">
                {i + 1}
              </span>
              <h2 className="home-title mt-5 text-[20px] text-fg">{s.title}</h2>
              <p className="mx-auto mt-2 max-w-xs text-[15px] leading-[1.55] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
