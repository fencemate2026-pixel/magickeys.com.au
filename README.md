# MagicKeys commercial website

The advertising site for **magickeys.com.au** presents MagicKeys as an all-in-one access control and CCTV platform with a fully customisable client app. The operational client portals remain separate.

The approved original website archive, MagicKeys-Azure-Website (1).zip, supplies the actual transparent logos, Zing Sans Rust font, introduction videos, supplied portal screenshots, equipment images and solid 3D hardware models. The build preserves those media assets and turns the approved source sections into separate pages with shared navigation.

## Pages

- / — product overview, opening sequence, animated gate control and CCTV examples
- /platform/ — platform capabilities, actual supplied portal screens and full image gallery
- /gate-control/ — single, double, sliding and boom gate information with the original 3D demo
- /anti-tailgating/ — OPTEX ACCURANCE OV-102 and HYD Technology detection, installation workflow and the interactive overhead apartment demo
- /cctv/ — CCTV views and the optional Sentinel package
- /emergency-guidance/ — site-specific staff prompts, instructions and configured responses
- /customisation/ — fully customisable app, dashboard concepts and four independent demo gates
- /security-integrations/ — interactive MagicKeys app-style 15-camera apartment CCTV and three-foyer overhead anti-tailgating example, secure portal access, permissions and integration options
- /solutions/ — commercial, education, body corporate and logistics requirements
- /how-it-works/ — assessment, app scope, connections, commissioning and handover
- /development/ — developing AI threat and fire detection with human acknowledgement
- /client-login/ — organisation-specific client portal links
- /contact/ — contact the team and discuss requirements

Each page has its own title, description and canonical URL. The sitemap lists every public page. A real 404 page is included. Previously shared homepage section bookmarks navigate to their new pages; /login and /login/ redirect to /client-login/.

## Build and verify

Use Node 22+ and unzip. There are no npm dependencies to install.

Run npm run build to extract the original archive, apply the Client Login and hero layer patches, copy the new site assets and generate the pages.

Run npm run check to build and verify every page, media link, internal anchor, accessibility reference, canonical URL and sitemap entry. The check also compares original image, video, font and SVG bytes with the approved archive, checks JavaScript syntax, and exercises the actual page scripts against the generated HTML using a dependency-free DOM harness. It covers page initialisation with and without reduced motion, the original gate and foyer demo, independent multi-gate controls, portal and guidance tabs, image enlargement, navigation, enquiry context and legacy bookmarks.

The DOM harness tests state and events; it does not replace a visual browser review. The generated dist folder is a build output and is not committed.

## Consistent app presentation

scripts/app-layout.mjs is the single source for app navigation, palette and frame. It builds the HTML frame used by the homepage, gate demo, custom gate controls and CCTV/anti-tailgating demos, plus the self-contained SVG app images used throughout the site. Real supplied panel screenshots are embedded unchanged inside that frame. The current supplied app screenshot remains the layout reference; the sidebar, bar and card colours are sampled from it. Exported app views include their images and logos so enlargement preserves the same layout. No generated mockup is used as an alternative app design.

The homepage presents the complete app in a compact landscape tablet beside the headline. `patches/hero-tablet.css` preserves a 1200×750 workspace and scales the whole screen uniformly, so the navigation, calendar, controls, CCTV and overhead detection stay in proportion at every device width. The anti-tailgating introduction uses the same landscape viewport with camera and event details side by side. `patches/multipage.js` fits these viewports with ResizeObserver; no app content is cropped to make the device frame fit.

The single anti-tailgating product page is /anti-tailgating/. It has one direct header entry, kept on one line. The separate /security-integrations/ page covers integration scope and reuses the same demo module. The obsolete isometric foyer tab has been removed from the gate-only demo.

## Editing

- scripts/pages.mjs owns the page content, shared header/footer, metadata and sitemap.
- patches/app-consistency.css owns the shared MagicKeys app palette and accurate screen colours; app screenshots are exempt from photographic brightness filters. The displayed app views use one shared frame; superseded generated dashboards are no longer referenced.
- scripts/anti-tailgating.mjs owns the OPTEX and HYD product and integration page, with links to the manufacturer references.
- patches/multipage.css owns responsive layouts and the brighter image presentation.
- scripts/security-demo.mjs and patches/security-demo.css/.js own the disconnected apartment security demo. The camera wall uses a single generated 5-by-3 photo atlas, supports all 15 selections and links three foyer zones to simulated events and operator review. The ceiling-camera photo pair shows one entrant and a follower directly from above; a red box identifies the following person. Portal chrome follows the supplied MagicKeys app screen.
- patches/multipage.js owns dropdown navigation, legacy bookmarks and the simulated multi-gate controls.
- patches/hero-layers.css keeps the original AI face behind the gate preview.
- patches/client-access.html and .css preserve the approved organisation-specific login section.
- site-assets holds new project-bound WebP images. image-prompts.json documents their provenance and prompts.

Screenshots from the actual supplied portal are identified as portal/setup views. Custom dashboard and site visuals are identified as configuration examples without AI wording in their captions. Image brightness and contrast are presentation styles; the original source assets and logo transparency remain intact.

## Claims and client access

Security copy is limited to the supplied portal's secure sign-in, HTTPS connection, site permissions and recorded activity. Existing-system integrations are assessed and agreed before inclusion in a proposal; there are no universal compatibility or certification guarantees.

AI-assisted threat and fire detection is clearly marked IN DEVELOPMENT. The proposed workflow includes authorised human review and acknowledgement. No release date or current commissioned capability is claimed.

The only listed organisation-specific sign-in is the existing approved Balwyn High School portal at https://magickeys-balwyn-portal.com/login. This marketing site never collects credentials, handles access tokens, sends notifications or issues hardware commands. All demonstrations are disconnected browser simulations.

## Netlify deployment

The root netlify.toml sets the base to the repository root, the command to npm run check, the publish directory to dist and Node to version 22. Connect Netlify to this repository's main branch. The checked-in configuration supplies the build settings. All required media and scripts are emitted into dist/assets. DNS must use the actual domain target supplied by Netlify for magickeys.com.au.

The retained Azure static configuration also sends legacy login URLs to the new Client Login page. No operational portal or Azure resource is changed by this advertising-site update.
