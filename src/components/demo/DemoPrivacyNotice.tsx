import { legal } from "@/lib/agency";

/* ==========================================================================
   The privacy notice for a client concept demo (/demo/<client>/privacy).

   The demo looks like the client's site, but Daybreak runs it and keeps what
   is sent, so this says so plainly and stands on its own: who is responsible,
   what the estimator collects, where it goes, how long it's kept, and the
   rights over it. Linked from the demo's consent box and footer.

   Keep it in step with the lead path (app/api/tool-lead, lib/server/*):
   a new processor or a new use of the data changes this page.
   ========================================================================== */

export function DemoPrivacyNotice({ client, effective }: { client: string; effective: string }) {
  const email = (
    <a href={`mailto:${legal.privacyEmail}`} className="font-bold text-(--se-navy) underline underline-offset-4">
      {legal.privacyEmail}
    </a>
  );
  const h2 = "mt-9 text-[20px] font-bold leading-snug";
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 text-[16px] leading-relaxed text-[#333] sm:px-6 md:py-14 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      {/* The page's title band carries the h1. */}
      <p className="!mt-0 text-[14px] text-[#666]">For the {client} estimator demo · Effective {effective}</p>

      <h2 className="mt-5 text-[20px] font-bold leading-snug">Who runs this page</h2>
      <p>
        This page is a concept demo. {legal.tradingName} ({legal.entity}, {legal.country}) built it to show {client} what an
        instant repair estimator could look like on their website. It is not run by {client}, and {client} does not receive
        what you enter here. {legal.tradingName} is responsible for your information, as the &ldquo;responsible party&rdquo;
        under South Africa&rsquo;s Protection of Personal Information Act (POPIA) and the business that collects it under US
        state privacy laws.
      </p>

      <h2 className={h2}>What we collect</h2>
      <ul>
        <li>What you type into the estimate form: your name, email address, phone number and ZIP code.</li>
        <li>The repairs and sizes you picked, the estimate worked out from them, and its reference number.</li>
        <li>The address of this page, and the time you sent it.</li>
        <li>
          Your IP address, held briefly in memory to stop the form being flooded. It is not stored with your request.
        </li>
      </ul>
      <p>
        This page uses no analytics, advertising or tracking cookies. Picking repairs on the house happens in your browser;
        nothing is sent until you press &ldquo;Show My Estimate&rdquo;.
      </p>

      <h2 className={h2}>Why we use it</h2>
      <p>
        To show you your estimate, email you the PDF, keep a record of the request, and, because you ticked the box, contact
        you about it by email, phone or text. That consent is the basis we rely on, and you can withdraw it at any time. We
        do not sell your information, share it for advertising, or send automated marketing calls or texts.
      </p>

      <h2 className={h2}>Who it goes to</h2>
      <p>Only the service providers that run the demo for us, under their data processing terms:</p>
      <ul>
        <li>Netlify, which hosts the page and runs the form.</li>
        <li>Airtable, where the request is stored.</li>
        <li>Resend, which sends the email with your PDF.</li>
        <li>Cloudflare Turnstile, if it is switched on, to check the form is sent by a person.</li>
      </ul>
      <p>
        These providers are based in the United States, so your information is processed outside South Africa, with the
        protections POPIA requires for that transfer.
      </p>

      <h2 className={h2}>How long we keep it</h2>
      <p>
        While we are in contact with you about it and for a reasonable period afterwards, then it is deleted. You can ask us
        to delete it at any time, whether or not a law gives you the right to demand it.
      </p>

      <h2 className={h2}>Your rights</h2>
      <p>
        You can ask to see what we hold about you, correct it, delete it, withdraw your consent, or object to how we use it.
        Email {email} and we will answer within 30 days. Depending on where you live, US state laws (such as
        California&rsquo;s) give you these rights too, and we will not treat you differently for using them.
      </p>
      <p>
        You can also complain to South Africa&rsquo;s Information Regulator, at{" "}
        <a href="mailto:POPIAComplaints@inforegulator.org.za" className="font-bold text-(--se-navy) underline underline-offset-4">
          POPIAComplaints@inforegulator.org.za
        </a>{" "}
        or Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191, although we would welcome the chance to
        put things right first.
      </p>

      <h2 className={h2}>Children</h2>
      <p>This demo is not meant for anyone under 18, and we do not knowingly collect children&rsquo;s information.</p>

      <h2 className={h2}>Contact</h2>
      <p>
        {legal.tradingName} · {email}
      </p>
    </article>
  );
}
