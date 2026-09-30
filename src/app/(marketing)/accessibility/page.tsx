import type { Metadata } from "next";
import {
  LegalCallout,
  LegalDoc,
  LegalFooterNav,
  LegalList,
  LegalSection,
} from "@/components/agency/LegalDoc";
import { agency, legal } from "@/lib/agency";

export const metadata: Metadata = {
  title: "Accessibility — Daybreak",
  description:
    "Daybreak's accessibility commitment, the standard this site is built to, the parts of it that fall short today, and how to tell us about a barrier.",
  alternates: { canonical: "/accessibility" },
};

/**
 * An accessibility statement is worth something only if it is accurate, so
 * Section 3 names a barrier rather than claiming there are none.
 *
 * The rule for editing this page: every claim in Section 2 is checkable in the
 * source, and none of them may be written aspirationally. A statement claiming
 * conformance the site does not have is worse than no statement — it is a
 * misrepresentation made to exactly the audience least able to verify it, and
 * under ADA Title III it is evidence against you rather than for you.
 *
 * Verified when written:
 *   skip link            src/app/layout.tsx
 *   focus-visible ring   src/app/globals.css (":focus-visible")
 *   reduced motion       src/app/globals.css ("prefers-reduced-motion")
 *   labelled fields      src/components/daybreak/DesignForm.tsx
 *   checker controls     src/components/tools/CrackChecker.tsx (buttons, aria-pressed, aria-live)
 *   hidden mockups       src/components/daybreak/MiniSites.tsx ("aria-hidden")
 */
const sections = [
  { id: "commitment", title: "Our commitment" },
  { id: "measures", title: "What is in place" },
  { id: "known", title: "Where it falls short" },
  { id: "feedback", title: "Telling us about a barrier" },
  { id: "clients", title: "Sites we build for clients" },
];

export default function AccessibilityPage() {
  return (
    <LegalDoc
      eyebrow="Accessibility"
      title="Accessibility Statement"
      lede="What this site does to be usable by everyone, and — more usefully — the specific place where it currently does not."
      sections={sections}
    >
      <LegalSection id="commitment" index={1} title="Our commitment">
        <p>
          {legal.entity} is committed to making this website usable by as many people as
          possible, including people who browse with a screen reader, navigate by keyboard,
          rely on magnification, or need reduced motion.
        </p>
        <p>
          We build to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA as
          our target standard. That is the benchmark the Department of Justice and the
          courts have consistently applied when assessing whether a business&rsquo;s website
          is accessible under Title III of the Americans with Disabilities Act.
        </p>
        <LegalCallout>
          We say &ldquo;target&rdquo; deliberately. This site has not been through a formal
          third-party audit, so we are not claiming full conformance. Section 3 records
          what we know is wrong with it today.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="measures" index={2} title="What is in place">
        <p>Each of these is built into the site rather than added by an overlay:</p>
        <LegalList
          items={[
            "A skip link as the first focusable element on every page, so keyboard users can jump past the navigation straight to the content.",
            "A visible focus indicator on every interactive element, using :focus-visible so it appears for keyboard users without cluttering the page for mouse users.",
            "Semantic landmarks — header, nav, main and footer — and a heading structure that follows the document rather than the visual design.",
            "Descriptive alternative text on photographs and on the concept artwork, written to convey what the image shows rather than to repeat the caption.",
            "Form fields with real, associated labels. Errors are announced with aria-invalid and linked to the field with aria-describedby, so a screen reader reads the problem rather than just the field name.",
            "Full support for prefers-reduced-motion: the scroll-reveal animations, smooth scrolling and the counting statistics all stop when the operating system asks them to.",
            "Text that reflows and remains readable when zoomed, with layouts built on relative units rather than fixed pixel widths.",
            "No content that flashes, and no carousels or dialogs that move or dismiss on a timer.",
            "No accessibility overlay or accessibility widget. These are known to interfere with assistive technology that people have already configured, so we do not use one.",
          ]}
        />
      </LegalSection>

      <LegalSection id="known" index={3} title="Where it falls short">
        <p>
          We would rather name these than let someone discover them on their own time.
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">
                The concept homepages are hidden from screen readers.
              </strong>{" "}
              The sample sites in &ldquo;Our work&rdquo; are drawn illustrations, so they are
              marked as decorative and their text is not read out. Each one&rsquo;s name,
              trade and description are provided as text for screen readers instead.
            </>,
            <>
              <strong className="text-ink-900">The crack checker&rsquo;s answer is a summary.</strong>{" "}
              Each choice is a labelled button you can reach and press by keyboard, and the
              answer is announced when it changes. The colour of the severity label is
              always accompanied by its wording, never used on its own.
            </>,
          ]}
        />
        <p>
          If any of these blocks you from doing something on this site, the section below
          is not a formality — write to us and we will get you the information another way
          while we fix the underlying problem.
        </p>
      </LegalSection>

      <LegalSection id="feedback" index={4} title="Telling us about a barrier">
        <p>
          Email{" "}
          <a
            className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600"
            href={`mailto:${agency.email}`}
          >
            {agency.email}
          </a>{" "}
          with the page you were on, what you were trying to do, and the assistive
          technology or browser you were using if you know it. You do not need to identify
          the WCAG criterion — describing what happened is more useful.
        </p>
        <p>
          We aim to acknowledge accessibility reports within two business days and to tell
          you either when it is fixed or, if it is going to take longer, what the workaround
          is in the meantime. If you need something on this site in an alternative format,
          ask and we will send it.
        </p>
      </LegalSection>

      <LegalSection id="clients" index={5} title="Sites we build for clients">
        <p>
          Accessibility is part of the build, not an upsell. Contractors&rsquo; offices are places of
          public accommodation, which means their websites carry the same Title III exposure
          this one does — and the demand letters that follow an inaccessible contractor site
          are a real and growing cost in this industry.
        </p>
        <p>
          We build client sites to the same WCAG 2.1 AA target, we do not install
          accessibility overlays on them, and we will tell a client plainly when something
          they have asked for would create a barrier.
        </p>
      </LegalSection>

      <LegalFooterNav current="accessibility" />
    </LegalDoc>
  );
}
