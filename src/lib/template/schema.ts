/* JSON-LD builders. Pages call these and hand the result to <JsonLd>, which
   renders nothing unless the site has opted in with `publishStructuredData` —
   structured data is machine-readable business fact, so a fictional or
   placeholder-content site must not emit it. */

import type { Area, Business, Faq, Service } from "./types";

type Ld = Record<string, unknown>;

function postalAddress(b: Business) {
  return {
    "@type": "PostalAddress",
    streetAddress: b.address.street,
    addressLocality: b.address.city,
    addressRegion: b.address.state,
    postalCode: b.address.zip,
    addressCountry: "US",
  };
}

export function contractorLd(b: Business, url: string, areas: Area[], type = "GeneralContractor"): Ld {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: b.name,
    url,
    telephone: b.phoneHref.replace("tel:", ""),
    email: b.email,
    address: postalAddress(b),
    geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng },
    areaServed: areas.map((a) => ({ "@type": "City", name: `${a.city}, ${b.address.state}` })),
    foundingDate: String(b.founded),
  };
}

export function serviceLd(b: Business, s: Service, url: string, areaServed: string): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.blurb,
    url,
    serviceType: s.title,
    areaServed,
    provider: { "@type": "LocalBusiness", name: b.name, telephone: b.phoneHref.replace("tel:", "") },
  };
}

export function faqLd(items: Faq[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; url: string }[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}
