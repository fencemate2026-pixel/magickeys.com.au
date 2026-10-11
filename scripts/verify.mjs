import { readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
const html = readFileSync('dist/index.html','utf8');
const css = readFileSync('dist/assets/site.css','utf8');
const required = [
  'id="site-intro"','id="client-access"','id="client-access-heading"',
  'class="client-access-panel"','https://magickeys-balwyn-portal.com/login',
  'id="portal-tour"','id="how-it-works"','id="contact"',
  'assets/magickeys-logo.png','assets/ai-face.png','assets/magickeys-intro.mp4',
  'assets/scene3d.js', 'assets/scene3d-mounts.js', 'assets/portal-overview.png'
];
for (const marker of required) if (!html.includes(marker)) throw new Error('Required original or login content missing: '+marker);
if (html.includes('id="portal-link"')) throw new Error('The obsolete portal-link section is still present.');
if (!css.includes('.client-access-grid')) throw new Error('Client Login CSS missing.');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs.');
for (const source of ['magickeys-logo.png','ai-face.png','magickeys-intro.mp4','magickeys-intro-mobile.mp4','scene3d.js','scene3d-mounts.js','site.js','zing-sans-rust.otf','portal-overview.png']) {
  if (statSync(join('dist/assets',source)).size === 0) throw new Error('Missing or empty original asset: '+source);
}
for(const src of ['site.js','scene3d.js','scene3d-mounts.js']){
  const c=spawnSync(process.execPath,['--check',join('dist/assets',src)],{encoding:'utf8'});
  if(c.status!==0) throw new Error(src+' syntax check failed: '+c.stderr);
}
console.log('Verified original MagicKeys assets, intro, 3D, portal showcase and integrated Client Login.');
