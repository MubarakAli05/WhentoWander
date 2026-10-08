# When to Wander

A React + TypeScript travel explorer with country guides, seasonal recommendations and credited photography.

## Development

```sh
npm install
npm run dev
npm run typecheck
npm run build
node --test src/data/countryCatalog.test.mjs tests/*.test.mjs scripts/sync-country-images.test.mjs
```

The regression suites cover country coverage, gallery integrity, photo upgrades, active navigation and shared favorites. They use the installed Vite loader and Node's built-in test runner (Node 20.19+ or 22.12+ recommended). `npm run lint` runs the existing ESLint configuration.

## Country coverage

The 194 requested countries are listed in [countryCatalog.ts](src/data/countryCatalog.ts). The existing Oman guide is also preserved, giving 195 countries in total. Existing detailed guides remain in the original country datasets; [countriesAdditional.ts](src/data/countriesAdditional.ts) adds 128 missing countries. [index.ts](src/data/index.ts) combines them without replacing existing destination routes.

Every country includes highlights and a seasonal travel window. These are broad planning suggestions, **not live forecasts or safety endorsements**. Conditions vary within a country; consult current official travel advisories, entry requirements and local access information before booking. Undocumented weather, festivals and destination details are omitted rather than fabricated.

The country explorer supports text, region, month, travel-style and A–Z filters. Filters are retained in the URL; results load in batches of 24.

## Navigation and saved destinations

Desktop and mobile navigation expose Explore, By Month, Experiences, Countries, World, Events, Phenomena and Wanderlist, including active states for detail pages. Site search covers countries, destinations, events and phenomena. Search and mobile menus close on navigation, Escape or outside interaction.

Month selection follows the URL and browser history. Event country, month and category filters are shareable in the URL. Favorites update across components and browser tabs, remain on this device, and continue in memory if browser storage is unavailable. The original homepage background is preserved.

## Photo-led discovery

The By Month, Experiences, Events and Phenomena pages use an editorial photo-and-text layout with readable card summaries and visible source/license links. Local country-gallery images provide reliable previews without new image-service dependencies. Northern Lights and Midnight Sun use dedicated, subject-matched photographs on country cards and phenomenon listing/detail pages. Their local previews and CC BY-SA 4.0 attribution are recorded in [phenomenonPhotos.json](src/data/phenomenonPhotos.json); original dimensions describe the linked source, not the resized preview. Other location previews are not presented as photographs of a particular event, wildlife encounter or seasonal condition.

The [travel calendar](src/pages/MonthsPage.tsx) features twelve distinct photographs, country-specific ideas and practical caveats rather than a single worldwide season. Search by month, featured country or theme, or choose a three-month travel window. Each [month guide](src/pages/MonthPage.tsx) adds region and destination search; those filters remain in the URL when switching months. Broader country results link to the full country explorer.

Experience search and travel-month filters also carry into category guides and back to the listing. Topic membership is reviewed in [experienceDiscovery.ts](src/data/experienceDiscovery.ts), rather than inferred from country-wide keywords; review that mapping when adding destinations. Suggested visiting months belong to individual destinations, not a promise that every activity operates then. Events and phenomena add searchable, shareable filters, clear reset/empty states and planning caveats; confirm event dates with organisers and natural conditions locally before booking.

## SEO, branding and deployment

Page titles, descriptions, canonical links, Open Graph/Twitter cards and JSON-LD update on navigation. Country, destination, month, experience and phenomenon guides have their own descriptions. Search, saved lists, invalid routes and filtered views use `noindex`; tracking parameters resolve to the unfiltered canonical URL.

The homepage includes a descriptive travel-planning heading, a three-step guide with crawlable category links, and four visitor FAQs. The About page explains the site's scope and limits. These sections are included in prerendered HTML, not hidden keyword lists. [site.json](src/data/site.json) defines the brand description and the `WhentoWander` alternate name used by the homepage `WebSite` structured data; keep the fallback title and description in [index.html](index.html) consistent when editing them. FAQ content is intended to help visitors, not to promise a search-result enhancement.

After deploying content changes, verify the live homepage title and description, then use the verified property's URL inspection tools in Google Search Console and Bing Webmaster Tools to request a recrawl of the homepage and About page. Submit the canonical `/sitemap.xml` if not already submitted. Yahoo search visibility can also be monitored through Bing's webmaster workflow. Property verification requires the site owner's account; do not invent verification tokens. Search engines may keep an older snippet or rewrite the supplied description, and neither a new description nor a recrawl request guarantees first position. Similarly named websites and social profiles are not automatically affiliated with this project; do not add them to structured data without verifying ownership.

`npm run build` generates the Vite client plus **prerendered HTML for every public guide**, a canonical-only `sitemap.xml`, `robots.txt`, alias pages and a custom `404.html`. Crawlers and link-preview services receive real page content and metadata without running JavaScript. The existing client renderer mounts over the initial HTML so URL filters, saved destinations and current-month content retain their normal behaviour. Rebuild when guide data changes. Deploy the entire `dist` folder, not only its root HTML; do not add a catch-all rewrite that serves the homepage with a 200 status for missing guides. [vercel.json](vercel.json) configures clean URLs for the existing Vercel site.

The production origin defaults to **https://whentowander.vercel.app**, matching the GitHub repository's configured homepage. Change [site.json](src/data/site.json), or set `VITE_SITE_URL` to a public HTTP(S) origin before building; do not include a path or trailing query. Both prerendered and client metadata use that origin. After deployment, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. No ranking or indexing guarantee is implied.

The original amber compass-and-sun mark is used in navigation, the footer, browser icons, touch icons and social cards. Regenerate these assets with `powershell -NoProfile -File scripts/generate-brand-assets.ps1` on Windows. The manifest provides browser branding, not offline functionality. The original homepage background remains unchanged.

## Photography

[Country galleries](src/data/countryGalleries.json) contain 1,170 photographs across 195 countries, with six distinct photos per country, source URLs, credits, license links and original pixel dimensions. Optimized previews are stored locally under [public/images/countries](public/images/countries), so cards and galleries do not rely on a third-party image service at runtime. The lightbox attempts the original and falls back to the local preview if it is unavailable.

A **4K SOURCE** badge means the original is at least 3840 × 2160 pixels. The current catalog has **1,160 qualifying originals**, including 47 upgrades from the first collection. Ten smaller originals remain across Comoros, Republic of the Congo, Djibouti, Grenada, Nauru and Turkmenistan because suitable licensed replacements were not found. Smaller images are never relabeled or upscaled as 4K. Internet access is required for remote originals and external attribution pages. Country images fall back to other photos of the same country, not unrelated regional stock photography.

Use [sync-country-images.mjs](scripts/sync-country-images.mjs) to maintain licensed sources. Review the script's options and [photo-source documentation](PHOTO-SOURCES.md) before refreshing the catalog; network access and Wikimedia availability are required. Preserve attribution and license information when replacing photographs.

### Adding your own photographs

1. Only add photos you own or are licensed to publish.
2. Put optimized previews in `public/images/countries` and update the relevant country ID in `src/data/countryGalleries.json`.
3. Include `url`, `fullUrl`, `alt`, `caption`, `photographer`, `sourceUrl`, `license`, `licenseUrl`, `width` and `height`. Dimensions describe the original, not the preview. Use an HTTPS source for the published original; keep the preview local.
4. Keep at least six distinct photos per country. The first becomes the country hero.
5. Run the country regression suite, typecheck and build. If a photo is not openly licensed, adjust the publishing workflow and tests deliberately rather than declaring a false license.

The gallery supports arrow-key navigation, Escape, focus restoration and reduced-motion preferences. Credits are accessible below each photo and in the lightbox.
