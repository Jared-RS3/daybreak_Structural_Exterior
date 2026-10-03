import { agency, founders } from "./agency";
import { automationFilm, faqs, trades, type TradePage } from "./daybreak";
import { houseImage } from "./demo-site";
import { absoluteUrl, site, siteUrl } from "./seo";

/**
 * Schema.org JSON-LD for the homepage, as one connected graph: the business,
 * the website, the page, the service it sells, the FAQ and the founder's film.
 *
 * Same rule as the rest of the content: it states only what is true today.
 * There is no street address (none is published yet), no legal name (the
 * entity in lib/agency.ts is a placeholder), no ratings and no reviews — Google
 * ignores self-published review markup on a business's own site, and an
 * invented aggregate would be a claim the site can't back. Add `address` and
 * `sameAs` (LinkedIn, Google Business Profile) when the real ones exist.
 */
const org = `${siteUrl}/#organization`;
const website = `${siteUrl}/#website`;
const home = `${siteUrl}/#webpage`;
const howItWorks = `${siteUrl}/how-it-works#webpage`;
const film = `${siteUrl}/#automation-film`;

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: site.name,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
        },
        image: absoluteUrl("/og-image.jpg"),
        description: agency.positioning,
        email: agency.email,
        areaServed: { "@type": "Country", name: "United States" },
        knowsAbout: [
          "Web design for contractors",
          "Foundation repair marketing",
          "Crawl space repair marketing",
          "Siding contractor marketing",
          "Lead generation",
          "Local SEO",
        ],
        founder: founders.map((f) => ({
          "@type": "Person",
          name: f.name,
          jobTitle: f.role,
          image: absoluteUrl(f.portrait),
        })),
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: absoluteUrl("/"),
        name: site.name,
        description: site.description,
        inLanguage: "en-US",
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": home,
        url: absoluteUrl("/"),
        name: site.title,
        description: site.description,
        inLanguage: "en-US",
        isPartOf: { "@id": website },
        about: { "@id": org },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(houseImage.src),
        },
        video: { "@id": film },
      },
      {
        "@type": "Service",
        name: "Website design for foundation repair, crawl space and siding contractors",
        serviceType: "Contractor website design and lead generation",
        description: agency.positioning,
        provider: { "@id": org },
        areaServed: { "@type": "Country", name: "United States" },
        audience: {
          "@type": "BusinessAudience",
          audienceType: trades.map((t) => t.name).join(", "),
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Websites by trade",
          itemListElement: trades.map((t) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${t.name} websites`,
              description: t.line,
            },
          })),
        },
        offers: {
          "@type": "Offer",
          name: "Free homepage concept",
          description:
            "A concept of your new homepage, with your logo, services and the towns you work in, shown on your first call.",
          price: "0",
          priceCurrency: "USD",
          url: absoluteUrl("/#free-design"),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "VideoObject",
        "@id": film,
        name: automationFilm.title,
        description: automationFilm.description,
        thumbnailUrl: absoluteUrl(automationFilm.poster),
        contentUrl: absoluteUrl(automationFilm.src),
        uploadDate: `${automationFilm.uploaded}T00:00:00Z`,
        duration: `PT${automationFilm.seconds}S`,
        publisher: { "@id": org },
      },
    ],
  };
}

/** The how-it-works page, tied to the homepage graph by @id. */
export function howItWorksStructuredData({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": howItWorks,
        url: absoluteUrl("/how-it-works"),
        name: title,
        description,
        inLanguage: "en-US",
        isPartOf: { "@id": website },
        about: { "@id": org },
      },
    ],
  };
}

/**
 * A trade page: the page, the service it describes (offered by the
 * organisation on the homepage graph), its FAQ and the breadcrumb home.
 */
export function tradePageStructuredData(page: TradePage) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en-US",
        isPartOf: { "@id": website },
        about: { "@id": org },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        name: page.title,
        serviceType: "Contractor website design and lead generation",
        description: page.description,
        provider: { "@id": org },
        areaServed: { "@type": "Country", name: "United States" },
        audience: {
          "@type": "BusinessAudience",
          audienceType: `${page.journey.trade} contractors`,
        },
        offers: {
          "@type": "Offer",
          name: "Free homepage concept",
          price: "0",
          priceCurrency: "USD",
          url: `${url}#free-design`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          { "@type": "ListItem", position: 2, name: page.title, item: url },
        ],
      },
    ],
  };
}

/** Serialised for a <script type="application/ld+json">, with `<` escaped so
    no string in the content can close the script tag. */
export function jsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
