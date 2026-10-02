import { openGraphDefaults } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalCallout,
  LegalDetails,
  LegalDoc,
  LegalFooterNav,
  LegalList,
  LegalSection,
} from "@/components/agency/LegalDoc";
import { legal } from "@/lib/agency";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Daybreak Structure-Works collects, what it does not, who it is shared with, and the rights South African and US privacy laws give you over it.",
  alternates: { canonical: "/privacy" },
  openGraph: { ...openGraphDefaults, url: "/privacy", title: "Privacy Policy | Daybreak Structure-Works" },
};

/**
 * Written from what the code actually does, not from a template.
 *
 * Before editing this page, check the claim against the source. The three
 * facts that make this policy unusually short are all verifiable and all worth
 * keeping true: there is no analytics, no advertising pixel and no cookie
 * anywhere in this application. If any of those change, this page changes in
 * the same commit — a stale "we do not use cookies" is materially worse than
 * never having claimed it, because it is a misrepresentation rather than an
 * omission.
 *
 * Where the data goes, as of this version: the concept form posts to
 * /api/growth-audit, which writes to Airtable; "Pick a time" opens Cal.com
 * with the name, email and a note filled in (DesignForm.tsx); town
 * suggestions come from /api/places on this server; the form's consent box
 * is saved as "POPIA Agreement". One fact is a practice rather than code:
 * calls use an AI note-taker, announced at the start of each call. Add a new
 * destination or tool and Sections 2, 5 and 6 change with it, and so does
 * the PAIA manual (paia/page.tsx), which repeats them.
 *
 * Two legal systems apply. The company is South African, so POPIA governs
 * all of its processing and drives Sections 1, 4, 6 and 9 (responsible
 * party, lawful basis, cross-border transfer, the Information Regulator). The
 * visitors are mostly US contractors, so CalOPPA, the state privacy acts,
 * CAN-SPAM and the TCPA drive the rest. The company's own details live in
 * `legal` in lib/agency.ts. The Information Regulator's details were checked
 * against inforegulator.org.za/contact-us on 2 October 2026.
 */
const sections = [
  { id: "who", title: "Who we are" },
  { id: "collect", title: "What we collect" },
  { id: "no-tracking", title: "What we do not do" },
  { id: "use", title: "How we use it, and on what basis" },
  { id: "share", title: "Who it is shared with" },
  { id: "transfers", title: "Where it is stored" },
  { id: "retention", title: "How long we keep it" },
  { id: "rights", title: "Your rights" },
  { id: "requests", title: "Making a request or a complaint" },
  { id: "children", title: "Children" },
  { id: "security", title: "Security" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
];

const link = "underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600";

const privacyEmail = (
  <a className={link} href={`mailto:${legal.privacyEmail}`}>
    {legal.privacyEmail}
  </a>
);

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Privacy"
      title="Privacy Policy"
      lede="What we collect, what we deliberately do not collect, who it goes to, and what you can make us do about it."
      sections={sections}
    >
      <LegalSection id="who" index={1} title="Who we are">
        <p>
          {legal.tradingName} is a trading name of {legal.entity}, a company registered
          in {legal.country}. {legal.entity} runs this website, sells every service
          offered on it, and is responsible for the personal information this policy
          describes. It is the &ldquo;responsible party&rdquo; under South Africa&rsquo;s
          Protection of Personal Information Act (POPIA), and the business that collects
          your information under US state privacy laws. In this policy it is
          &ldquo;Daybreak&rdquo; or &ldquo;we&rdquo;.
        </p>
        <LegalDetails
          rows={[
            ["Registered name", legal.entity],
            ["Trading as", legal.tradingName],
            ["Registration number", legal.registrationNumber],
            ["VAT number", legal.vatNumber],
            ["Registered in", legal.country],
            ["Address", legal.address],
            ["Information Officer", legal.informationOfficer],
            ["Privacy contact", privacyEmail],
          ]}
        />
        <p>
          This policy covers this website, including the crack checker and the free
          homepage concept form, and the calls and emails that follow from them. It
          applies to everyone who uses the site, wherever they are. It does not cover the
          websites we build and operate for clients — those are governed by each
          client&rsquo;s own privacy policy.
        </p>
      </LegalSection>

      <LegalSection id="collect" index={2} title="What we collect">
        <p>There are four ways information reaches us.</p>
        <p className="pt-1 text-ink-900">
          <strong>1. The free homepage concept form.</strong> When you ask for a free
          concept we collect what you enter into it:
        </p>
        <LegalList
          items={[
            "Your name, email address and phone number",
            "Your company name, the main town or city you serve, and your website address if you give one",
            "What your company mainly does, the services you offer if you list them, roughly how many jobs you sign a month, your average job size, and when you want a new site",
            "That you ticked the box agreeing to this policy, the page you submitted from, and the date and time",
          ]}
        />
        <p className="pt-1 text-ink-900">
          <strong>2. Booking a call.</strong> Our booking calendar is run by Cal.com. When
          you pick a time you leave this site, and what you enter on the booking page —
          your name, email, any notes and the time you choose — goes to Cal.com and to us.
          If you arrive there from the form, the link fills in your name, email and a
          short note (your company, trade and town) so you do not have to type them twice.
        </p>
        <p className="pt-1 text-ink-900">
          <strong>3. Emails and calls.</strong> If you email us or speak to us, we have
          what you tell us. On calls we use an AI note-taking service, which records and
          transcribes the call and writes a summary, so that we can listen to you rather
          than to our own typing. We tell you at the start of every call and ask whether
          you are happy with it. If you would rather not, we switch it off and take notes
          by hand, and nothing about the call or the concept changes. We use the
          recording, transcript and summary only to prepare and follow up on the work you
          asked about.
        </p>
        <p className="pt-1 text-ink-900">
          <strong>4. Ordinary server logs.</strong> Like every web server, ours records
          requests — IP address, timestamp, the address requested (for the town
          suggestions on the form, that includes what you have typed so far) and the
          browser&rsquo;s user-agent string. These are operational records used to keep
          the site running and to investigate abuse. If saving a form ever fails, the
          submission is written to the server log so that a person can recover it rather
          than lose it.
        </p>
        <p>
          The crack checker is not one of them. It runs entirely in your browser: the
          answers you tap are never sent to us, never stored, and are gone when you leave
          the page.
        </p>
        <p>
          Under POPIA, information about a business is personal information too, not only
          information about you as a person, so your company&rsquo;s details get the same
          care as yours. We do not ask for, and do not want, sensitive information — ID or
          Social Security numbers, financial account details, health information and the
          like — or the details of your customers or the homeowners you work for.
        </p>
        <p>
          Giving us any of this is voluntary. The only consequence of leaving it out is
          practical: without your name, a way to reach you and the town you work in, we
          cannot prepare a concept or arrange the call.
        </p>
      </LegalSection>

      <LegalSection id="no-tracking" index={3} title="What we do not do">
        <p>
          This is the part of a privacy policy that is usually the longest. Ours is
          short, and every line of it is checkable by opening your browser&rsquo;s
          developer tools on this page:
        </p>
        <LegalList
          items={[
            "This site sets no cookies. Not analytics cookies, not preference cookies, none.",
            "This site keeps nothing in your browser's storage. No local storage, no session storage.",
            "There is no analytics package. No Google Analytics, no alternative, no first-party event pipeline.",
            "There are no advertising or social pixels. No Meta pixel, no Google Ads tag, no LinkedIn Insight tag, no TikTok pixel.",
            "We do not build advertising profiles, run cross-site tracking, or use session recording or heatmap tools, and no third party collects information about your activity over time or across other websites through this site.",
            "We have never sold personal information and we do not share it for cross-context behavioural advertising, as those terms are defined under California law.",
            "Web fonts are served from this domain. They are downloaded at build time rather than requested from Google when you load the page, so loading this site does not tell Google you did.",
          ]}
        />
        <p>
          Because no cookies or trackers are set, there is nothing here for a cookie
          banner to ask you about, and a Global Privacy Control or Do Not Track signal
          has nothing to switch off. We honour both regardless: if we ever add anything
          that responds to them, this section changes first.
        </p>
        <p>
          The one exception is off this site. When you follow a link to book a call you
          are on Cal.com&rsquo;s website, and its own cookies and privacy policy apply
          there.
        </p>
      </LegalSection>

      <LegalSection id="use" index={4} title="How we use it, and on what basis">
        <p>
          We use what you send us for the purposes below and no others. POPIA asks us to
          say what lawful basis each one rests on, so we do:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">
                To prepare the concept you asked for, arrange and hold the call, and reply
                to you.
              </strong>{" "}
              These are steps you asked us to take before any agreement exists (POPIA
              section 11(1)(b)). You also confirm your agreement when you tick the box on
              the form (section 11(1)(a)), and we keep a record of when you did.
            </>,
            <>
              <strong className="text-ink-900">To record and transcribe calls</strong>,
              with your agreement at the start of each call, which you can refuse or
              withdraw at any point during it.
            </>,
            <>
              <strong className="text-ink-900">To keep the site secure and working</strong>{" "}
              — server logs, rate limits and automatic spam checks. This rests on our
              legitimate interest in running a site that works and is not abused (section
              11(1)(f)).
            </>,
            <>
              <strong className="text-ink-900">To do the work, if you become a client</strong>,
              under the agreement we sign with you.
            </>,
            <>
              <strong className="text-ink-900">To meet legal obligations</strong>, such as
              keeping the business records that tax law requires.
            </>,
          ]}
        />
        <p>
          We may call, text or email you about the request you made.
        </p>
        <LegalCallout>
          We do not add you to a marketing list because you asked for a concept, and we
          do not send marketing calls or texts using an autodialer or a prerecorded or
          artificial voice. Reply STOP to any text from us and we will stop texting you.
          We send marketing email only if you have agreed to it, or if you are a client
          and it is about services like the ones you buy from us, as POPIA section 69
          requires. Any marketing email identifies itself as such, says who it is from,
          and carries a working unsubscribe link, as the US CAN-SPAM Act and South
          Africa&rsquo;s Electronic Communications and Transactions Act require.
          Unsubscribing stops it within ten business days at the latest.
        </LegalCallout>
        <p>
          Server logs are used for security, debugging and capacity — not to profile
          visitors. Our spam checks are automatic: a submission sent faster than a person
          could fill in the form, or that fills in a field hidden from people, is
          discarded. Nothing else about you is decided by automated means, and nothing
          with legal or similarly significant effects. If you think a genuine request of
          yours was caught, email us.
        </p>
      </LegalSection>

      <LegalSection id="share" index={5} title="Who it is shared with">
        <p>
          We do not sell your information. It reaches only service providers that handle
          it on our behalf — &ldquo;operators&rdquo;, in POPIA&rsquo;s terms — under
          written terms that limit them to doing that:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Our website host</strong>, which serves
              the site and keeps its logs.
            </>,
            <>
              <strong className="text-ink-900">
                Our customer relationship management system
              </strong>{" "}
              (Airtable), which receives form submissions so that a person actually
              follows up on them.
            </>,
            <>
              <strong className="text-ink-900">Our booking calendar</strong> (Cal.com),
              and the calendar and video-call services connected to it, for arranging and
              holding the call.
            </>,
            <>
              <strong className="text-ink-900">Our AI note-taking service</strong>, which
              records, transcribes and summarises calls when you have agreed to it.
            </>,
            <>
              <strong className="text-ink-900">Our email provider</strong>, which carries
              our emails to you and yours to us.
            </>,
          ]}
        />
        <LegalCallout>
          No mobile information will be shared with third parties or affiliates for
          marketing or promotional purposes. Text-messaging opt-in data and consent are
          never shared with anyone.
        </LegalCallout>
        <p>
          We will also disclose information where we are legally required to, or where it
          is necessary to establish or defend a legal claim. If Daybreak&rsquo;s business
          were ever sold or merged, the information would pass to the new owner, who
          would remain bound by this policy in how they use it.
        </p>
      </LegalSection>

      <LegalSection id="transfers" index={6} title="Where it is stored">
        <p>
          Daybreak is run from South Africa, and the service providers above are mainly
          based in the United States. In practice, what you send us is stored by US
          providers and read by us in South Africa — so whichever country you are in, it
          crosses a border.
        </p>
        <p>
          POPIA (section 72) allows that where the transfer is necessary to take steps
          you asked for before an agreement, or where the recipient is bound by law or a
          written agreement that protects the information to a standard comparable to
          POPIA&rsquo;s. Our providers&rsquo; data processing terms do that. Wherever your
          information is held, everything in this policy still applies to it.
        </p>
      </LegalSection>

      <LegalSection id="retention" index={7} title="How long we keep it">
        <p>
          Only as long as we need it for the reason we collected it. An enquiry that does
          not turn into work is kept while we are in contact with you about it and for a
          reasonable period afterwards, then deleted, together with any call recordings,
          transcripts and summaries that go with it. If you become a client, the records
          of our work together are kept for as long as South African company and tax law
          requires business records to be kept. Server logs are kept on a short
          operational rotation.
        </p>
        <p>
          You can ask us to delete your enquiry at any point, whether or not a law gives
          you the right to demand it.
        </p>
      </LegalSection>

      <LegalSection id="rights" index={8} title="Your rights">
        <p>
          Privacy laws in South Africa and in many US states give you rights over the
          information above. Not every one of those laws necessarily applies to a
          business of our size, but we extend all of the following to everyone, wherever
          they live, because running two standards would be more work than running one:
        </p>
        <LegalList
          items={[
            "The right to know what personal information we hold about you, where it came from, and who it has been shared with.",
            "The right to a copy of it, in a portable form.",
            "The right to have it corrected if it is wrong or incomplete.",
            "The right to have it deleted.",
            "The right to object to our using it, including for our legitimate interests, and to object to direct marketing at any time.",
            "The right to withdraw any consent you have given. That does not undo what was lawfully done before you withdrew it.",
            "The right to opt out of any sale or sharing of it for advertising — noting that we do neither, so there is nothing to opt out of.",
            "The right not to be treated differently for exercising any of these. Asking us to delete your enquiry does not cost you the design you asked for or a worse price on anything.",
          ]}
        />
        <p className="pt-1 text-ink-900">
          <strong>Under US law</strong>
        </p>
        <p>
          Depending on your state, these rights come from the California Consumer Privacy
          Act as amended by the CPRA, the comprehensive privacy statutes in Virginia,
          Colorado, Connecticut, Utah, Texas and a growing list of other states, and the
          California Online Privacy Protection Act. California residents may designate an
          authorised agent to make a request on their behalf. We do not collect sensitive
          personal information as California law defines it, and we do not share
          personal information with third parties for their own direct marketing.
        </p>
        <p className="pt-1 text-ink-900">
          <strong>Under South African law</strong>
        </p>
        <p>
          Because Daybreak is a South African company, POPIA governs everything we
          process, wherever the person it is about lives. It also gives you the right to
          complain to the Information Regulator (Section 9). You can request access to
          records we hold under the Promotion of Access to Information Act (PAIA) as well;
          our{" "}
          <Link className={link} href="/paia">
            PAIA manual
          </Link>{" "}
          explains how.
        </p>
      </LegalSection>

      <LegalSection id="requests" index={9} title="Making a request or a complaint">
        <p>
          Email {privacyEmail} and say what you want done. We will acknowledge it within
          ten business days and respond substantively within forty-five days, extending
          once by a further forty-five where a request is genuinely complex — and telling
          you if we do.
        </p>
        <p>
          To protect you, we have to be reasonably sure the request is yours before acting
          on it. In practice this usually means replying from the email address the
          enquiry came from. There is no charge for a request, and no account to create in
          order to make one.
        </p>
        <p>
          If we decline all or part of a request, we will tell you why. You can appeal by
          replying to that decision; we will answer an appeal within forty-five days, and
          if we still decline, tell you how to contact your state&rsquo;s attorney
          general.
        </p>
        <p>
          You can also complain at any time to South Africa&rsquo;s Information
          Regulator, which enforces POPIA — although we would welcome the chance to put
          things right first:
        </p>
        <p>
          Information Regulator (South Africa)
          <br />
          Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191
          <br />
          <a className={link} href="mailto:POPIAComplaints@inforegulator.org.za">
            POPIAComplaints@inforegulator.org.za
          </a>{" "}
          ·{" "}
          <a className={link} href="https://inforegulator.org.za" rel="noopener">
            inforegulator.org.za
          </a>
        </p>
      </LegalSection>

      <LegalSection id="children" index={10} title="Children">
        <p>
          This site sells business services to businesses. It is not directed to children,
          and we do not knowingly collect personal information from anyone under 18, the
          age POPIA sets, or under 13, the age the Children&rsquo;s Online Privacy
          Protection Act protects. If you believe a child has sent us information, write
          to us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection id="security" index={11} title="Security">
        <p>
          The site is served over HTTPS and form submissions are transmitted encrypted.
          Access to enquiry data is limited to the two people who run Daybreak, and to the
          service providers in Section 5 as far as they need it to do their job. No
          transmission over the internet is perfectly secure, and we do not claim
          otherwise — but the surface here is small on purpose, because the least risky
          way to hold data is to collect less of it.
        </p>
        <p>
          If information we hold about you is ever accessed or taken by someone who should
          not have it, we will tell you as soon as reasonably possible, with enough detail
          for you to protect yourself, and notify the Information Regulator and any US
          authority where the law requires it.
        </p>
      </LegalSection>

      <LegalSection id="changes" index={12} title="Changes">
        <p>
          If this policy changes in substance, the effective date at the top of the page
          changes with it and the amended policy is posted here. Where a change materially
          affects how we handle information already collected from you, we will contact
          you directly rather than relying on you re-reading this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" index={13} title="Contact">
        <p>
          Questions about this policy or about how we handle your information go to our
          Information Officer{legal.informationOfficer ? `, ${legal.informationOfficer}` : ""}:
        </p>
        <p>
          {legal.entity}, trading as {legal.tradingName}
          <br />
          {legal.address}
          <br />
          {privacyEmail}
        </p>
        <p>
          For how this site may be used, see the{" "}
          <Link className={link} href="/terms">
            Terms of Use
          </Link>
          .
        </p>
      </LegalSection>

      <LegalFooterNav current="privacy" />
    </LegalDoc>
  );
}
