import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, cpSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildAppVisuals } from './app-layout.mjs';
import { buildPages } from './pages.mjs';
import { prepareVehicleModels } from './vehicle-access.mjs';

const archive = join(process.cwd(), 'MagicKeys-Azure-Website (1).zip');
if (!existsSync(archive)) throw new Error('The original MagicKeys Azure website ZIP is missing.');
const scratch = mkdtempSync(join(tmpdir(), 'magickeys-'));
try {
  execFileSync('unzip', ['-q', archive, 'magickeys-website/dist/*', '-d', scratch], {timeout: 90_000});
  rmSync('dist', {recursive:true, force:true});
  cpSync(join(scratch, 'magickeys-website', 'dist'), 'dist', {recursive:true});
  const page = 'dist/index.html';
  let content = readFileSync(page, 'utf8');
  const original = /<section class="client-section" id="client-access">[\s\S]*?<\/section>/g;
  if ([...content.matchAll(original)].length !== 1) throw new Error('Expected exactly one original Client Access section; check the source ZIP before replacing.');
  content = content.replace(original, readFileSync('patches/client-access.html', 'utf8').trim());
  // Preserve the site's real animations, 3D models, screenshots, logos and video files.
  writeFileSync(page, content, 'utf8');
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/client-access.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/hero-layers.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/multipage.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/security-demo.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/app-consistency.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/app-layout.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/hero-tablet.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/camera-style.css', 'utf8'));
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('patches/vehicle-access.css', 'utf8'));
  cpSync('patches/security-demo.js', 'dist/assets/security-demo.js');
  cpSync('patches/clear-space.js', 'dist/assets/clear-space.js');
  cpSync('patches/camera-style.js', 'dist/assets/camera-style.js');
  cpSync('patches/vehicle-access.js', 'dist/assets/vehicle-access.js');
  cpSync('site-assets', 'dist/assets', {recursive:true});
  const vehicleModels = prepareVehicleModels();
  buildAppVisuals(vehicleModels);
  appendFileSync('dist/assets/site.css', '\n'+readFileSync('dist/assets/app-palette.css','utf8'));
  cpSync('patches/multipage.js', 'dist/assets/multipage.js');
  const siteScript='dist/assets/site.js';
  writeFileSync(siteScript,readFileSync(siteScript,'utf8')
    .replace("foyer:'Foyer detection'","foyer:'Anti-Tailgating System'")
    .replace("const preview=$('#hero-preview');", "const preview=$('#legacy-hero-preview');")
    .replace('if(!reducedMotion.matches) playIntro();','// Opening sequence plays only when the visitor chooses it.'));
  buildPages();
} finally {
  rmSync(scratch, {recursive:true, force:true});
}
