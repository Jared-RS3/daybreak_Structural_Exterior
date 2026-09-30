import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalCallout,
  LegalDoc,
  LegalFooterNav,
  LegalList,
  LegalSection,
} from "@/components/agency/LegalDoc";
import { legal } from "@/lib/agency";

export const metadata: Metadata = {
  title: "Privacy Policy — Daybreak",
  description:
    "What Daybreak collects, what it does not collect, who it is shared with, and the rights US state privacy laws give you over it.",
  alternates: { canonical: "/privacy" },
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
 */
const sections = [
  { id: "scope", title: "Who this covers" },
  { id: "collect", title: "What we collect" },
  { id: "no-tracking", title: "What we do not do" },
  { id: "use", title: "How we use it" },
  { id: "share", title: "Who it is shared with" },
  { id: "retention", title: "How long we keep it" },
  { id: "rights", title: "Your rights" },
  { id: "requests", title: "Making a request" },
  { id: "children", title: "Children" },
  { id: "security", title: "Security" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Privacy"
      title="Privacy Policy"
      lede="What we collect, what we deliberately do not collect, who it goes to, and what you can make us do about it."
      sections={sections}
    >
      <LegalSection id="scope" index={1} title="Who this covers">
        <p>
          This policy describes how {legal.entity} (&ldquo;Daybreak&rdquo;,
          &ldquo;we&rdquo;) handles personal information collected through this website,
          including the reference build published under <code>/work</code> and the crack
          checker tool. It does not cover the separate websites we build and operate
          for clients — those are governed by each client&rsquo;s own privacy policy.
        </p>
      </LegalSection>

      <LegalSection id="collect" index={2} title="What we collect">
        <p>There are exactly two ways information reaches us through this site.</p>
        <p className="pt-1 text-ink-900">
          <strong>1. The free homepage design form.</strong> When you ask for a free
          design we collect what you type into it:
        </p>
        <LegalList
          items={[
            "Your name",
            "Your email address",
            "Your phone number, if you choose to give one — the field is optional and the form works without it",
            "Your company name, and your website address if you give one",
            "Roughly how many jobs you do a month, if you choose to say",
            "The page you submitted from, and the date and time",
          ]}
        />
        <p className="pt-1 text-ink-900">
          <strong>2. Ordinary server logs.</strong> Like every web server, ours records
          requests — IP address, timestamp, the page requested, and the browser&rsquo;s
          user-agent string. These are operational records used to keep the site running
          and to investigate abuse.
        </p>
        <p>
          The crack checker is not one of them. It runs entirely in your browser: the
          answers you tap are never sent to us, never stored, and are gone when you leave
          the page. The booking form on the reference build is a demonstration and sends
          nothing anywhere.
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
            "We do not build advertising profiles, run cross-site tracking, or use session recording or heatmap tools.",
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
      </LegalSection>

      <LegalSection id="use" index={4} title="How we use it">
        <p>
          Form submissions are used to prepare and send the free homepage design you
          asked for, and to reply to you about it. If you gave a phone number, we may call or
          text you about that request.
        </p>
        <LegalCallout>
          We do not add you to a marketing list because you asked for a design, and we do
          not send automated marketing calls or texts. Any marketing email we do send
          will identify itself as such and carry a working unsubscribe link, as the
          CAN-SPAM Act requires; unsubscribing stops it.
        </LegalCallout>
        <p>
          Server logs are used for security, debugging and capacity — not to profile
          visitors.
        </p>
      </LegalSection>

      <LegalSection id="share" index={5} title="Who it is shared with">
        <p>We do not sell your information. It reaches two kinds of third party:</p>
        <LegalList
          items={[
            <>
              <strong className="text-ink-900">Our hosting and email providers</strong>,
              which process data on our instructions in order to run the site and deliver
              our replies.
            </>,
            <>
              <strong className="text-ink-900">
                Our customer relationship management system
              </strong>
              , which receives form submissions so that a person actually follows
              up on them.
            </>,
          ]}
        />
        <p>
          We will also disclose information where we are legally required to, or where it
          is necessary to establish or defend a legal claim.
        </p>
      </LegalSection>

      <LegalSection id="retention" index={6} title="How long we keep it">
        <p>
          Design enquiries are kept for as long as we are in contact with you about the
          work and for a reasonable period afterwards, then deleted. Server logs are kept
          on a short operational rotation.
          You can ask us to delete your enquiry at any point, whether or not a state law
          gives you the right to demand it.
        </p>
      </LegalSection>

      <LegalSection id="rights" index={7} title="Your rights">
        <p>
          Depending on where you live, US state privacy laws — including the California
          Consumer Privacy Act as amended by the CPRA, and the comprehensive privacy
          statutes in Virginia, Colorado, Connecticut, Utah, Texas and a growing list of
          other states — give you rights over the information above. We extend all of the
          following to every visitor, regardless of state, because operating two
          standards would be more work than operating one:
        </p>
        <LegalList
          items={[
            "The right to know what personal information we hold about you and where it came from.",
            "The right to a copy of it, in a portable form.",
            "The right to have it corrected if it is wrong.",
            "The right to have it deleted.",
            "The right to opt out of any sale or sharing of it for advertising — noting that we do neither, so there is nothing to opt out of.",
            "The right not to be treated differently for exercising any of these. Asking us to delete your enquiry does not cost you the design you asked for or a worse price on anything.",
          ]}
        />
        <p>
          California residents may also designate an authorised agent to make a request on
          their behalf. We do not use personal information for automated decision-making
          or profiling that produces legal or similarly significant effects.
        </p>
      </LegalSection>

      <LegalSection id="requests" index={8} title="Making a request">
        <p>
          Email <a className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>{" "}
          and say what you want done. We will acknowledge it within ten business days and
          respond substantively within forty-five days, extending once by a further
          forty-five where a request is genuinely complex — and telling you if we do.
        </p>
        <p>
          To protect you, we have to be reasonably sure the request is yours before acting
          on it. In practice this usually means replying from the email address the
          enquiry came from. There is no charge for a request, and no account to create in
          order to make one.
        </p>
      </LegalSection>

      <LegalSection id="children" index={9} title="Children">
        <p>
          This site sells business services to businesses. It is not directed to children
          under 13 and we do not knowingly collect personal information from them, as the
          Children&rsquo;s Online Privacy Protection Act requires. If you believe a child
          has sent us information, write to us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection id="security" index={10} title="Security">
        <p>
          The site is served over HTTPS and form submissions are transmitted encrypted.
          Access to enquiry data is limited to the two people who run Daybreak. No
          transmission over the internet is perfectly secure, and we do not claim
          otherwise — but the surface here is small on purpose, because the least risky
          way to hold data is to collect less of it.
        </p>
      </LegalSection>

      <LegalSection id="changes" index={11} title="Changes">
        <p>
          If this policy changes in substance, the effective date at the top of the page
          changes with it and the amended policy is posted here. Where a change materially
          affects how we handle information already collected from you, we will contact
          you directly rather than relying on you re-reading this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" index={12} title="Contact">
        <p>
          {legal.entity}
          <br />
          {legal.address}
          <br />
          <a
            className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600"
            href={`mailto:${legal.privacyEmail}`}
          >
            {legal.privacyEmail}
          </a>
        </p>
        <p>
          For how this site may be used, see the{" "}
          <Link
            className="underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600"
            href="/terms"
          >
            Terms of Use
          </Link>
          .
        </p>
      </LegalSection>

      <LegalFooterNav current="privacy" />
    </LegalDoc>
  );
}
