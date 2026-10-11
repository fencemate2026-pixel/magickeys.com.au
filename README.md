# MagicKeys — official commercial website

The site on `magickeys.com.au` is based on the approved **MagicKeys Azure Website** package uploaded by RJL. The original cinematic introduction, branding, real customer portal screenshots, interactive 3D gates, optional packages and photographic assets are preserved.

The original website archive remains checked in as `MagicKeys-Azure-Website (1).zip`. `npm run build` extracts its public `dist/` files and replaces **only the Client Access section** with the branded login component in `patches/client-access.html` and `patches/client-access.css`. This keeps the provided design authoritative instead of introducing a different landing page.

## Verify

Run `npm run check` with Node 22+ and `unzip` installed. It builds the public static site and checks that the intro, 3D code, gallery assets and Balwyn login destination remain present. The generated `dist/` folder is a build output and should not be committed.

## Secure sign-in

`#client-access` contains a real direct link to the existing approved **Balwyn High School** portal: `https://magickeys-balwyn-portal.com/login`. The marketing website never asks for portal credentials, handles no access tokens, and issues no hardware control commands. Existing Google, Microsoft and email/password methods stay on the existing portal. Additional clients require their own confirmed portal URLs and access policy before being listed.

## Netlify deployment

The root `netlify.toml` sets the base directory to the repository root, the build command to `npm run check`, the publish directory to `dist`, and Node.js to version 22. The build extracts the approved website archive, applies the supplied Client Login patch and verifies the generated site. All images, videos, the Zing Sans Rust font and 3D model scripts are copied into `dist/assets`.

Connect Netlify to this repository's `main` branch. The checked-in configuration supplies its build and publish settings. `/login` redirects to the Client Access section. Domain records must use the actual target shown by Netlify for `magickeys.com.au`.
