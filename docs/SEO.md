# MagicKeys search implementation

Updated 21 October 2026. Run `npm run check` before publishing; Netlify builds `dist/` from `main`.

The preferred public hostname is `https://www.magickeys.com.au`. The apex host redirects to it. Canonical links, Open Graph URLs, structured data and the sitemap use the same hostname. Netlify permanently redirects explicit index.html variants to directory URLs. Unknown pages retain a real 404 response.

## Search intent and destinations

| Search intent | Destination |
| --- | --- |
| Melbourne access control and CCTV | `/` and `/melbourne/` |
| Owners corporation, body corporate and apartment security | `/solutions/owners-corporations/` |
| School gate access, campus schedules and venue hire | `/solutions/schools/` |
| Aged care and retirement living access | `/solutions/aged-care/` |
| Commercial building and facilities access control | `/solutions/commercial-properties/` |
| Warehouse, factory and logistics gates | `/solutions/warehouses-logistics/` |
| Boom gates, sliding gates, swing gates and rising bollards | `/gate-control/` |
| Overhead anti-tailgating and entry interlocks | `/anti-tailgating/` |
| Compatible CCTV and controller integration | `/cctv/` and `/security-integrations/` |

The Melbourne hub groups useful regional coverage rather than generating near-identical suburb pages. Glen Waverley and other apartment precincts appear in the owners corporation guide. No prospective property is presented as a customer, reference project or endorsement.

## Implemented across the site

- Unique descriptive titles and meta descriptions, one H1 per page, descriptive image alternatives, crawlable contextual links and shared industry navigation.
- Server-rendered HTML content: no client-side rendering required for search engines to read the guides.
- Organization, WebSite, WebPage/ContactPage/CollectionPage, relevant Service and BreadcrumbList JSON-LD. Business name, telephone, publisher and service area are consistent with visible content. No invented street address, reviews, ratings or business hours.
- Open Graph and Twitter large-image cards using an existing app image with dimensions and alternative text.
- An 18-URL sitemap and discoverable robots.txt. The login and 404 pages are noindex and excluded from the sitemap; they remain crawlable so the directive can be read.
- Visible content immediately on arrival. The opening sequence remains visitor-initiated. The first lazy hero image is eager/high-priority; lower images remain lazy.
- Existing app layout and media retained. Development-only AI detection continues to be labelled in development. Compatibility and commissioning claims remain scoped to the equipment and agreed installation.

## Validation and limits

The build verifies page counts, metadata uniqueness, canonical URLs, sitemap membership, indexing directives, structured-data syntax and identity, internal links, media, shared app layout and interactive controls. Browser review checks the new layouts and navigation. Publishing verification checks production HTML, critical assets, redirects, sitemap and 404 behaviour.

This is on-site implementation, not a claim that Google has indexed the new pages or changed rankings. Search Console query/click data, URL inspection, sitemap submission and Google Business Profile changes require access to the actual business accounts. No account ownership, verification tag, tracking identifier, ranking, review or completed customer installation should be fabricated. Do not use the removed public sitemap ping endpoint or Google's restricted Indexing API for ordinary service pages.

Once account access is available, submit the sitemap at `https://www.magickeys.com.au/sitemap.xml`, inspect priority pages, review indexing/canonical reports and monitor Melbourne service/industry queries. Align the real Google Business Profile service area and public business details with the website. Add genuine project evidence and customer testimonials only with permission and accurate attribution.
