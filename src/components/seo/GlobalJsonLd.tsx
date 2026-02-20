export function GlobalJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sweet FM Online",
    url: "https://www.sweetfmonline.com",
    logo: "https://www.sweetfmonline.com/sweet-fm-logo.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=100088742005548",
      "https://twitter.com/sweetfmonline",
      "https://www.instagram.com/sweetfm106.5",
      "https://www.youtube.com/@SweetFM106.5",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "GH",
      availableLanguage: "en",
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sweet FM Online",
    url: "https://www.sweetfmonline.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.sweetfmonline.com/category/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
