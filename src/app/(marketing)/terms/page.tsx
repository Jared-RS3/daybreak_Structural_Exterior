import { openGraphDefaults } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalCallout,
  LegalDoc,
  LegalFooterNav,
  LegalList,
  LegalSection,
} from "@/components/agency/LegalDoc";
import { agency, legal } from "@/lib/agency";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern use of this website, including what the crack checker is and is not, and how the demonstration and concept material on it should be read.",
  alternates: { canonical: "/terms" },
  openGraph: { ...openGraphDefaults, url: "/terms", title: "Terms of Use | Daybreak Structure-Works" },
};

/**
 * The two clauses on this page that are doing real work are Sections 3 and 4.
 *
 * Section 3 says the crack checker is a rule of thumb, not an inspection, and
 * that its cost ranges are not an offer. A price shown to a consumer that
 * turns out not to be honoured is the classic bait-and-switch fact pattern
 * under FTC Act §5 and every state deceptive-trade-practices act, and
 * foundation repair sits inside the home-improvement rules that most states
 * police hardest. The checker is a demonstration on a fictional contractor's
 * site and nobody can currently buy a repair through it, but the disclaimer
 * has to be in place before anybody can.
 *
 * Section 4 says the demonstration contractor and the concept companies are
 * invented. That is the same commitment the on-page labels make; having it here
 * as well means the disclosure survives someone deep-linking past the labels.
 *
 * Sections 8 and 9 are set in capitals on purpose. UCC §2-316 requires a
 * disclaimer of the implied warranty of merchantability to be conspicuous, and
 * courts read "conspicuous" as visually distinct from the surrounding text.
 */
const sections = [
  { id: "acceptance", title: "Accepting these terms" },
  { id: "what", title: "What this site is" },
  { id: "checker", title: "The crack checker is not an inspection" },
  { id: "demo", title: "Demonstration and concept material" },
  { id: "no-advice", title: "No professional advice" },
  { id: "ip", title: "Intellectual property" },
  { id: "acceptable", title: "Acceptable use" },
  { id: "warranty", title: "Disclaimer of warranties" },
  { id: "liability", title: "Limitation of liability" },
  { id: "indemnity", title: "Indemnification" },
  { id: "law", title: "Governing law" },
  { id: "changes", title: "Changes and contact" },
];

export default function TermsPage() {
  return (
    <LegalDoc
      eyebrow="Terms"
      title="Terms of Use"
      lede="The rules for using this website. The two that matter most are that the crack checker is not an inspection or a quote, and that the companies in our design concepts do not exist."
      sections={sections}
    >
      <LegalSection id="acceptance" index={1} title="Accepting these terms">
        <p>
          By using this website you agree to these terms. If you do not agree to them, do
          not use the site. They form an agreement between you and {legal.entity} (
          &ldquo;Daybreak&rdquo;, &ldquo;we&rdquo;).
        </p>
        <p>
          These terms govern the website only. If you engage Daybreak to do work, that
          engagement is governed by a separate written agreement, and where the two
          conflict, the engagement agreement wins.
        </p>
      </LegalSection>

      <LegalSection id="what" index={2} title="What this site is">
        <p>
          This is the marketing website of a company that builds websites, local search
          and sales automation for foundation repair, crawl space and siding contractors. It contains a description of that
          service, unbuilt design concepts, a demonstration crack checker, and a way to ask for
          requesting a free homepage concept for your own business.
        </p>
        <p>
          Nothing on this site is an offer capable of acceptance, and submitting the design
          form does not create a contract or a client relationship. It starts a
          conversation.
        </p>
      </LegalSection>

      <LegalSection id="checker" index={3} title="The crack checker is not an inspection">
        <p>
          The crack checker asks four questions about a crack and applies a simple rule of
          thumb to the answers. It is a demonstration of a tool. It cannot see your house,
          and its answer is only as good as the description you give it.
        </p>
        <LegalCallout>
          Nothing the checker shows — the severity, the likely cause or the cost ranges —
          is an engineering assessment, a diagnosis, a quote, an offer, a bid, or a price
          any contractor is bound by. A foundation cannot be assessed without someone
          measuring it. Soil, drainage, construction type, the extent of movement and
          local labour rates all change the real answer, sometimes by a great deal. If you
          are worried about the safety of a structure, have it inspected by a qualified
          professional.
        </LegalCallout>
        <p>
          The same applies to every calculator and worked example on this site. Their
          output is arithmetic on the inputs you supply, not a forecast, a projection of
          results, or a representation that you will achieve anything similar.
        </p>
      </LegalSection>

      <LegalSection id="demo" index={4} title="Demonstration and concept material">
        <p>
          The design concepts on this site show websites for contractors that do not
          exist. We would rather state that here as well as on the page itself.
        </p>
        <p>
          The concepts are unbuilt designs. The companies shown in them are invented, and
          the review scores, star ratings, platform badges, testimonials, phone numbers,
          addresses and price ranges rendered inside the mockups are drawn as part of the
          design. They are not reviews, not endorsements, and not measurements of anything.
        </p>
        <p>
          Third-party names and logos that appear inside those mockups — including those of
          review platforms, accreditation bodies and manufacturers — are the property of
          their respective owners. They appear as design placeholders and imply no
          affiliation with, sponsorship by, endorsement from, accreditation by, or rating
          from any of them.
        </p>
        <p>
          Where this site does present figures to explain how reporting works — the funnel
          example, the attribution report, the service-area plot — those figures are
          labelled as examples on the page and are not client results. Daybreak makes no
          representation that you will achieve any particular outcome.
        </p>
      </LegalSection>

      <LegalSection id="no-advice" index={5} title="No professional advice">
        <p>
          Content on this site about foundations, crawl spaces, siding, insurance, financing, warranties or
          marketing is general information, not professional advice. In particular,
          nothing here is legal advice, insurance advice, or a representation about what
          any insurance carrier will cover. Foundation and home improvement work is licensed
          and regulated state by state; consult a licensed contractor, your insurer, or a
          lawyer about your own situation.
        </p>
      </LegalSection>

      <LegalSection id="ip" index={6} title="Intellectual property">
        <p>
          The design, code, text, photography and concept artwork on this site are owned by
          Daybreak or used with permission, and are protected by copyright and trademark
          law. You may view the site, and quote short extracts with attribution. You may
          not copy the site wholesale, reproduce the concept artwork as your own work, or
          present any of it as the portfolio of another business.
        </p>
        <p>
          The same applies to a free homepage concept we prepare for your business. It is
          shown to you so you can judge the direction of our work, and it remains
          Daybreak&rsquo;s work. You may not use it, publish it, or have anyone else build
          from it unless you engage Daybreak. Rights in the final design and the finished
          site pass to you under your engagement agreement, once the work is paid for.
        </p>
        <p>
          Some photographs are used under the Unsplash licence, and one under a public
          domain dedication on Wikimedia Commons. They show no client&rsquo;s work.
        </p>
      </LegalSection>

      <LegalSection id="acceptable" index={7} title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Submit false information, someone else's personal details, or an address you have no connection to.",
            "Use the tools, the forms or the APIs behind them in an automated or high-volume way.",
            "Attempt to gain unauthorised access to the site, its servers, or any connected system.",
            "Scrape, republish or resell content from this site.",
            "Use the site to break any applicable law.",
          ]}
        />
        <p>
          We may restrict or withdraw access to the site, or to any tool on it, at any time
          and without notice.
        </p>
      </LegalSection>

      <LegalSection id="warranty" index={8} title="Disclaimer of warranties">
        <p className="border border-ink-900/20 bg-bone-100 p-5 text-[14px] uppercase leading-[1.6] tracking-[0.01em] text-ink-800">
          THE SITE AND EVERYTHING ON IT, INCLUDING THE CRACK CHECKER AND ALL CALCULATORS,
          ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT
          PERMITTED BY LAW, DAYBREAK DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING THE
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE
          AND NON-INFRINGEMENT. DAYBREAK DOES NOT WARRANT THAT THE SITE WILL BE
          UNINTERRUPTED OR ERROR-FREE, OR THAT ANY ASSESSMENT, ESTIMATE OR FIGURE
          PRODUCED BY IT WILL BE ACCURATE OR COMPLETE.
        </p>
        <p>
          Some states do not allow the exclusion of certain implied warranties, so parts of
          this section may not apply to you.
        </p>
      </LegalSection>

      <LegalSection id="liability" index={9} title="Limitation of liability">
        <p className="border border-ink-900/20 bg-bone-100 p-5 text-[14px] uppercase leading-[1.6] tracking-[0.01em] text-ink-800">
          TO THE FULLEST EXTENT PERMITTED BY LAW, DAYBREAK AND ITS OWNERS AND CONTRACTORS
          WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR
          PUNITIVE DAMAGES, OR FOR ANY LOST PROFITS, LOST REVENUE OR LOST DATA, ARISING OUT
          OF YOUR USE OF THIS SITE — INCLUDING ANY RELIANCE ON A FIGURE PRODUCED BY THE
          CRACK CHECKER OR ANY CALCULATOR. DAYBREAK&rsquo;S TOTAL LIABILITY ARISING OUT OF
          OR RELATING TO THIS SITE WILL NOT EXCEED ONE HUNDRED US DOLLARS ($100).
        </p>
        <p>
          Nothing in these terms excludes liability for fraud, for fraudulent
          misrepresentation, or for anything else that cannot lawfully be excluded. Some
          states do not allow the limitation of incidental or consequential damages, so
          parts of this section may not apply to you.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" index={10} title="Indemnification">
        <p>
          You agree to indemnify Daybreak against claims, losses and reasonable legal costs
          arising from your misuse of this site or your breach of these terms.
        </p>
      </LegalSection>

      <LegalSection id="law" index={11} title="Governing law">
        <p>
          These terms are governed by the laws of the State of {legal.state}, without
          regard to its conflict-of-laws rules. Any dispute will be brought in the state or
          federal courts located in {legal.state}, and you and Daybreak each consent to the
          jurisdiction of those courts. If any provision of these terms is held
          unenforceable, the rest remains in force.
        </p>
      </LegalSection>

      <LegalSection id="changes" index={12} title="Changes and contact">
        <p>
          We may amend these terms. The effective date at the top of this page records when
          the current version took effect, and continuing to use the site after a change
          means you accept it.
        </p>
        <p>
          Questions about these terms:{" "}
          <a
            className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600"
            href={`mailto:${agency.email}`}
          >
            {agency.email}
          </a>
          . For how we handle your information, see the{" "}
          <Link
            className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalFooterNav current="terms" />
    </LegalDoc>
  );
}
