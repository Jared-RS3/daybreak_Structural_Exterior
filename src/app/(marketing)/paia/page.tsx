import { openGraphDefaults, siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDetails,
  LegalDoc,
  LegalFooterNav,
  LegalList,
  LegalSection,
} from "@/components/agency/LegalDoc";
import { legal } from "@/lib/agency";
import { analyticsOn } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "PAIA Manual",
  description:
    "The PAIA manual of the company behind Daybreak Structure-Works: what records it holds, how to request access to them, and how it processes personal information.",
  alternates: { canonical: "/paia" },
  openGraph: { ...openGraphDefaults, url: "/paia", title: "PAIA Manual | Daybreak Structure-Works" },
};

/**
 * The manual every South African private body must publish under section 51
 * of the Promotion of Access to Information Act (the small-business exemption
 * ended in 2021). Its sections follow the Information Regulator's template
 * for private bodies, in the template's order, so a reader who knows the
 * template finds things where they expect them.
 *
 * Section 7 repeats what the privacy policy says about personal information
 * (Sections 2, 5 and 6 there). The two must agree: change one, change the
 * other, and bump `legal.effective`. The template asks for the manual to be
 * updated regularly; reviewing it once a year is the floor.
 */
const sections = [
  { id: "about", title: "About this manual" },
  { id: "contact", title: "Contact details" },
  { id: "guide", title: "The Regulator's guide to PAIA" },
  { id: "available", title: "Records available without a request" },
  { id: "legislation", title: "Records kept under other laws" },
  { id: "subjects", title: "Subjects and categories of records" },
  { id: "personal", title: "Processing of personal information" },
  { id: "request", title: "How to request a record" },
  { id: "availability", title: "Where this manual is available" },
  { id: "updating", title: "Updating this manual" },
];

const link = "underline decoration-ink-900/25 underline-offset-4 hover:decoration-ember-600";

const privacyEmail = (
  <a className={link} href={`mailto:${legal.privacyEmail}`}>
    {legal.privacyEmail}
  </a>
);

const website = (
  <a className={link} href={siteUrl}>
    {siteUrl.replace(/^https?:\/\//, "")}
  </a>
);

export default function PaiaPage() {
  return (
    <LegalDoc
      eyebrow="Access to information"
      title="PAIA Manual"
      lede="Prepared under section 51 of the Promotion of Access to Information Act 2 of 2000, as amended. What records we hold, how to ask for them, and how we handle personal information."
      sections={sections}
    >
      <LegalSection id="about" index={1} title="About this manual">
        <p>
          This is the manual of {legal.entity}, a private company registered in{" "}
          {legal.country} that trades as {legal.tradingName} (&ldquo;Daybreak&rdquo;,
          &ldquo;we&rdquo;). It is published so that anyone can:
        </p>
        <LegalList
          items={[
            "see which of our records are available without a formal request;",
            "understand how to request access to any other record we hold, and on which subjects we hold records;",
            "see which records we keep because other laws require them;",
            "find the contact details of the person who deals with requests;",
            "find the Information Regulator's guide on how to use PAIA; and",
            "know how we process personal information: why, about whom, who receives it, whether it leaves South Africa, and how it is kept secure.",
          ]}
        />
        <p>
          In this manual, PAIA is the Promotion of Access to Information Act 2 of 2000,
          POPIA is the Protection of Personal Information Act 4 of 2013, and the
          Regulator is the Information Regulator of South Africa. The date this version
          was compiled is the effective date at the top of the page.
        </p>
      </LegalSection>

      <LegalSection id="contact" index={2} title="Contact details">
        <p>
          Requests under PAIA, and questions about personal information, go to our
          Information Officer. We have not designated a Deputy Information Officer.
        </p>
        <LegalDetails
          rows={[
            ["Information Officer", legal.informationOfficer || "The head of the company"],
            ["Email", privacyEmail],
            ["Telephone", legal.phone],
            ["Address", legal.address],
            ["Registered name", legal.entity],
            ["Registration number", legal.registrationNumber],
            ["Website", website],
          ]}
        />
      </LegalSection>

      <LegalSection id="guide" index={3} title="The Regulator's guide to PAIA">
        <p>
          Under section 10 of PAIA, the Regulator publishes a guide, in an easily
          understood form, for anyone who wants to exercise a right under PAIA or POPIA.
          It describes the objects of both Acts, how to make a request to a public or a
          private body, the help available from the Regulator, and every remedy in law,
          including how to complain to the Regulator or apply to a court.
        </p>
        <p>
          The guide is available in each official language and in braille. You can get it
          from the{" "}
          <a className={link} href="https://inforegulator.org.za/paia/" rel="noopener">
            Regulator&rsquo;s website
          </a>
          , inspect it at the Regulator&rsquo;s offices, or ask our Information Officer to
          send you a copy.
        </p>
      </LegalSection>

      <LegalSection id="available" index={4} title="Records available without a request">
        <p>
          These records are available on this website to anyone, without a request under
          PAIA:
        </p>
        <LegalList
          items={[
            "The content of this website, including our description of our services and our design concepts.",
            <>
              Our <Link className={link} href="/privacy">Privacy Policy</Link>,{" "}
              <Link className={link} href="/terms">Terms of Use</Link> and{" "}
              <Link className={link} href="/accessibility">Accessibility statement</Link>.
            </>,
            "This manual.",
          ]}
        />
      </LegalSection>

      <LegalSection id="legislation" index={5} title="Records kept under other laws">
        <p>
          We keep the following records because the legislation beside them requires it.
          Where a law applies only to companies that employ staff or are registered for
          VAT, the records exist only if that is the case.
        </p>
        <LegalDetails
          rows={[
            ["Companies Act 71 of 2008", "Memorandum of incorporation, registration documents, register of directors, securities register, minutes and resolutions, and accounting records."],
            ["Tax Administration Act 28 of 2011 and Income Tax Act 58 of 1962", "Tax returns, assessments and the records that support them."],
            ["Value-Added Tax Act 89 of 1991", "VAT invoices and returns, if the company is registered for VAT."],
            ["Basic Conditions of Employment Act 75 of 1997, Labour Relations Act 66 of 1995, Unemployment Insurance Act 63 of 2001", "Employment, payroll and leave records, if the company employs staff."],
            ["Protection of Personal Information Act 4 of 2013", "Records of how personal information is processed, and of consents given."],
            ["Promotion of Access to Information Act 2 of 2000", "This manual, and records of requests made under it."],
          ]}
        />
      </LegalSection>

      <LegalSection id="subjects" index={6} title="Subjects and categories of records">
        <p>We hold records on these subjects:</p>
        <LegalDetails
          rows={[
            ["Company", "Statutory and secretarial records, agreements between the shareholders and directors, and resolutions."],
            ["Finance and tax", "Accounting records, bank statements, invoices issued and received, and tax records."],
            ["Prospective clients", "Enquiries sent through the website form, call bookings, call recordings, transcripts and summaries, and correspondence."],
            ["Clients", "Agreements, project files, designs and website content, records of work done, invoices and correspondence."],
            ["Clients' enquiries", "Where we run a website or lead system for a client, the enquiries it receives, held on the client's behalf."],
            ["Suppliers and service providers", "Agreements, invoices and contact details."],
            ["Website and systems", "Source code, configuration and server logs."],
          ]}
        />
      </LegalSection>

      <LegalSection id="personal" index={7} title="Processing of personal information">
        <p className="pt-1 text-ink-900">
          <strong>7.1 Why we process it</strong>
        </p>
        <LegalList
          items={[
            "To prepare the free homepage concepts people ask for, arrange and hold the calls where we present them, and reply to enquiries.",
            "To deliver our services to clients under our agreements with them, including running websites and lead systems on their behalf.",
            "To run this website and keep it secure.",
            "To keep the records that company, tax and other laws require.",
            "To send marketing, only to people who have agreed to it or to clients about services like the ones they buy from us.",
          ]}
        />
        <p className="pt-1 text-ink-900">
          <strong>7.2 Whose information, and what</strong>
        </p>
        <LegalDetails
          rows={[
            ["Prospective clients (contractor businesses and the people who contact us for them)", "Name, email address, phone number, company name, town or city served, website, the trade, job volume, average job size and timeline they tell us, their agreement to our privacy policy and when it was given, and call recordings, transcripts and summaries where they agreed to them."],
            ["Clients", "The same, plus the agreement, billing details, the content of their websites and the access to their accounts needed to do the work."],
            ["Clients' customers", "Where we run a website or lead system for a client, the details homeowners send through it, such as their name, contact details and the job or property concerned. We process these on the client's instructions, as an operator under POPIA."],
            [
              "Website visitors",
              analyticsOn
                ? "IP address, timestamp, the address requested and browser user-agent, in server logs; their cookie choice; and, only if they accept analytics cookies, the pages they visit, how they arrived, approximate location and device, through Google Analytics."
                : "IP address, timestamp, the address requested and browser user-agent, in server logs.",
            ],
            ["Suppliers and service providers", "Names, contact details, registration and VAT numbers, and banking details for payment."],
            ["Directors and any staff", "What company and employment law require us to keep."],
          ]}
        />
        <p>
          Under POPIA, a business is a data subject too, so information about a company is
          personal information as well as information about a person. We do not process
          special personal information as POPIA defines it, or information about children.
        </p>
        <p className="pt-1 text-ink-900">
          <strong>7.3 Who receives it</strong>
        </p>
        <LegalList
          items={[
            `Service providers that handle it on our behalf, under written terms: our website host, our customer relationship management system (Airtable), our booking calendar (Cal.com) and the calendar and video-call services connected to it, our AI note-taking service, and our email provider${analyticsOn ? ", and, for visitors who accept analytics cookies, Google (Google Analytics)" : ""}.`,
            "Our professional advisers, such as accountants and lawyers, where they need it.",
            "The South African Revenue Service, the Companies and Intellectual Property Commission and other authorities, where the law requires it.",
          ]}
        />
        <p>We do not sell personal information.</p>
        <p className="pt-1 text-ink-900">
          <strong>7.4 Transfers outside South Africa</strong>
        </p>
        <p>
          Yes. The service providers in 7.3 are mainly based in the United States, so
          enquiries, client information, call recordings and server logs are stored there.
          We transfer it under section 72 of POPIA: because the transfer is necessary for
          steps the person asked us to take or for our agreement with them, and because
          the providers are bound by written terms that protect the information to a
          standard comparable to POPIA&rsquo;s.
        </p>
        <p className="pt-1 text-ink-900">
          <strong>7.5 Security measures</strong>
        </p>
        <LegalList
          items={[
            "This website is served only over HTTPS, with a content security policy that stops it loading code or sending data anywhere but this site.",
            "Access to personal information is limited to the two directors who run the company, and to service providers as far as they need it.",
            "The key the website uses for our customer relationship management system is limited to writing records in one base, and cannot read them back.",
            "Two-factor authentication on the accounts that hold personal information.",
            "Rate limits and checks on the website form, to stop it being abused.",
            "Collecting as little as we can, and deleting what we no longer need.",
          ]}
        />
        <p>
          More detail, including how long we keep information and the rights people have
          over it, is in our <Link className={link} href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="request" index={8} title="How to request a record">
        <p>
          <strong className="text-ink-900">Your own personal information.</strong> You do
          not need a PAIA request to find out what personal information we hold about you,
          or to have it corrected or deleted. Email {privacyEmail}; there is no charge.
        </p>
        <p>
          <strong className="text-ink-900">Any other record.</strong> Under section 50 of
          PAIA, you must be given access to a record of a private body if you need it to
          exercise or protect a right, you follow the procedure below, and none of the
          grounds for refusal applies.
        </p>
        <LegalList
          items={[
            <>
              Complete Form 2 (Request for Access to Record) under Regulation 7 of the PAIA
              Regulations, available on the{" "}
              <a className={link} href="https://inforegulator.org.za/paia/" rel="noopener">
                Regulator&rsquo;s website
              </a>
              , and email it to our Information Officer at {privacyEmail}.
            </>,
            "Describe the record well enough for us to find it, say what form of access you want, and say which right you are exercising or protecting and why you need the record to do so.",
            "If you are asking on someone else's behalf, include proof that you are allowed to.",
            "We will tell you of any request fee before we process the request, and of any access fee before we give you the record. The fees are those prescribed in the PAIA Regulations.",
            "We will decide within 30 days, and may extend that once by up to a further 30 days where the law allows, telling you why.",
          ]}
        />
        <p>
          We may refuse access only on the grounds in Chapter 4 of Part 3 of PAIA — for
          example, to protect another person&rsquo;s privacy, a third party&rsquo;s
          commercial or confidential information, our own commercial information, or a
          record privileged from production in legal proceedings. If we refuse, we will
          say why.
        </p>
        <p>
          A private body has no internal appeal. If you are unhappy with our decision you
          may complain to the Information Regulator at{" "}
          <a className={link} href="mailto:PAIAComplaints@inforegulator.org.za">
            PAIAComplaints@inforegulator.org.za
          </a>
          , or apply to a court.
        </p>
      </LegalSection>

      <LegalSection id="availability" index={9} title="Where this manual is available">
        <LegalList
          items={[
            "On this website, at this address.",
            "From our Information Officer, by email, free of charge.",
            "For inspection at our address during normal business hours, by arrangement.",
            "To the Information Regulator, on request.",
          ]}
        />
      </LegalSection>

      <LegalSection id="updating" index={10} title="Updating this manual">
        <p>
          We update this manual whenever what it describes changes, and review it at least
          once a year. The effective date at the top of the page shows when the current
          version was compiled.
        </p>
        <p>
          {legal.informationOfficer
            ? `Issued by ${legal.informationOfficer}, Information Officer, ${legal.entity}.`
            : `Issued by the Information Officer of ${legal.entity}.`}
        </p>
      </LegalSection>

      <LegalFooterNav current="paia" />
    </LegalDoc>
  );
}
