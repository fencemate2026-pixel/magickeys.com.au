import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { verifyInteractions } from './verify-interactions.mjs';

const root=resolve('dist');
function walk(dir) {
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
}
function assert(condition,message) { if(!condition) throw new Error(message); }
const files=walk(root);
const htmlFiles=files.filter(path=>path.endsWith('.html'));
const expectedRoutes=['/','/platform/','/gate-control/','/anti-tailgating/','/cctv/','/emergency-guidance/','/customisation/','/security-integrations/','/solutions/','/how-it-works/','/development/','/client-login/','/contact/'];
const pages=new Map();
const titles=new Set(), descriptions=new Set();
const parseAttributes=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map(match=>[match[1],match[2]]));
for(const file of htmlFiles) {
  const html=readFileSync(file,'utf8');
  const route='/'+relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert(new Set(ids).size===ids.length,'Duplicate HTML IDs in '+route);
  assert([...html.matchAll(/<h1\b/g)].length===1,'Expected one page heading in '+route);
  assert(html.includes('id="main-navigation"')&&html.includes('aria-label="Footer navigation"'),'Shared navigation missing in '+route);
  assert(html.includes('/assets/zing-sans-rust.otf'),'Zing Sans Rust font missing in '+route);
  assert(html.includes('/assets/magickeys-logo.png')&&html.includes('/assets/rjl-logo.png'),'Official logos missing in '+route);
  assert(!/AI[- ]generated|AI-GENERATED|MagicKeys Detect|Contact Jarrod/i.test(html),'Obsolete image caption, product name or contact copy in '+route);
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(title&&!titles.has(title),'Missing or duplicate title in '+route); titles.add(title);
  assert(description&&!descriptions.has(description),'Missing or duplicate description in '+route); descriptions.add(description);
  assert(html.includes('href="https://magickeys.com.au'+route+'"'),'Canonical URL mismatch in '+route);
  pages.set(route,{file,html,ids:new Set(ids)});
}
assert(pages.size===expectedRoutes.length+1,'Unexpected page count');
expectedRoutes.forEach(route=>assert(pages.has(route),'Missing page: '+route));
assert(pages.has('/404.html'),'Missing real 404 page');

let links=0;
for(const [route,page] of pages) {
  const references=[...page.html.matchAll(/<[^>]+>/g)].flatMap(match=>{
    const attributes=parseAttributes(match[0]);
    return ['href','src','poster','data-image','data-preview','data-desktop-src','data-mobile-src'].filter(key=>attributes[key]).map(key=>[key,attributes[key]]);
  });
  for(const [attribute,value] of references) {
    links++;
    if(/^(?:https?:|tel:|mailto:|data:)/.test(value)) continue;
    assert(!value.startsWith('//'),'Unexpected external URL in '+route);
    const url=new URL(value,'https://magickeys.com.au'+route);
    if(url.pathname.startsWith('/assets/')) {
      assert(!url.hash,'Asset unexpectedly has an anchor in '+route);
      const target=join(root,decodeURIComponent(url.pathname));
      assert(existsSync(target)&&statSync(target).isFile()&&statSync(target).size>0,'Broken asset '+value+' in '+route);
    } else {
      const targetPage=pages.get(url.pathname);
      assert(targetPage,'Broken internal link '+value+' in '+route);
      if(url.hash) assert(targetPage.ids.has(decodeURIComponent(url.hash.slice(1))),'Broken anchor '+value+' in '+route);
      if(attribute==='src') throw new Error('Page URL used as a media source in '+route);
    }
  }
  for(const match of page.html.matchAll(/<[^>]+>/g)) {
    const attributes=parseAttributes(match[0]);
    for(const name of ['aria-controls','aria-labelledby']) {
      for(const id of (attributes[name]||'').split(/\s+/).filter(Boolean)) {
        assert(page.ids.has(id),'Broken '+name+' reference '+id+' in '+route);
      }
    }
  }
}

const home=pages.get('/').html;
assert(home.includes('id="site-intro"')&&home.includes('id="hero-preview"'),'Homepage intro or animated gate preview missing');
assert(home.includes('/assets/custom-dashboard-cctv.webp'),'Homepage CCTV dashboard missing');
assert(!home.includes('id="portal-tour"')&&!home.includes('id="client-access"'),'Homepage still contains full sections that should have moved');
assert(pages.get('/platform/').html.includes('id="portal-tour"')&&pages.get('/platform/').html.includes('id="media-gallery"'),'Actual portal tour and full gallery missing');
assert(pages.get('/gate-control/').html.includes('id="interactive-demo"'),'Original 3D demonstration missing');
assert((pages.get('/customisation/').html.match(/data-gate-target=/g)||[]).length===8,'Multi-gate controls missing');
assert(pages.get('/client-login/').html.includes('https://magickeys-balwyn-portal.com/login'),'Approved client portal link missing');
assert(pages.get('/development/').html.includes('IN DEVELOPMENT')&&pages.get('/development/').html.includes('Human acknowledgement'),'Development status or human acknowledgement missing');
assert(home.includes('IN DEVELOPMENT')&&home.includes('/development/'),'Development programme not prominent on the homepage');
for(const [route,page] of pages) if(route!=='/') assert(!page.html.includes('id="site-intro"'),'Intro unexpectedly blocks a detail page: '+route);

const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
assert(locations.length===expectedRoutes.length,'Sitemap page count mismatch');
for(const route of expectedRoutes) assert(locations.includes('https://magickeys.com.au'+route),'Sitemap URL missing: '+route);
assert(readFileSync(join(root,'robots.txt'),'utf8').includes('https://magickeys.com.au/sitemap.xml'),'Robots sitemap missing');
const css=readFileSync(join(root,'assets/site.css'),'utf8');
assert(/transform-style:\s*flat/.test(css)&&/\.hero-screen\s*\{[^}]*z-index:\s*2/.test(css),'Approved hero layer fix missing');
assert(css.includes('.client-access-grid')&&css.includes('.page-hero-grid')&&css.includes('.custom-gates'),'Page styles missing');
assert(css.includes('brightness(1.10)')&&css.includes('contrast(1.07)'),'Image clarity treatment missing');
for(const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  assert(existsSync(resolve(root,'assets',match[1])),'Broken CSS asset: '+match[1]);
}

const archive='MagicKeys-Azure-Website (1).zip';
const archiveFiles=execFileSync('unzip',['-Z1',archive],{encoding:'utf8'}).trim().split('\n');
const hash=data=>createHash('sha256').update(data).digest('hex');
let preserved=0;
for(const path of archiveFiles.filter(path=>/\/dist\/assets\/[^/]+\.(png|webp|svg|otf|mp4)$/.test(path))) {
  const destination=join(root,'assets',path.split('/').at(-1));
  const approved=execFileSync('unzip',['-p',archive,path],{maxBuffer:20_000_000});
  assert(hash(readFileSync(destination))===hash(approved),'An approved media asset changed: '+destination);
  preserved++;
}
for(const source of ['site.js','multipage.js','scene3d.js','scene3d-mounts.js']) {
  execFileSync(process.execPath,['--check',join(root,'assets',source)]);
}
verifyInteractions(pages);
console.log('Verified '+expectedRoutes.length+' pages plus 404, '+links+' links/media references, all canonical URLs and sitemap entries, '+preserved+' unchanged original media assets, and page/control behaviour.');
