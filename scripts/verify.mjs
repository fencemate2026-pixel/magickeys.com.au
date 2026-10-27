import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { verifyInteractions } from './verify-interactions.mjs';
import vm from 'node:vm';
import { sectors } from './sector-pages.mjs';

const root=resolve('dist');
function walk(dir) {
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
}
function assert(condition,message) { if(!condition) throw new Error(message); }
const files=walk(root);
const htmlFiles=files.filter(path=>path.endsWith('.html'));
const expectedRoutes=['/','/platform/','/gate-control/','/anti-tailgating/','/cctv/','/emergency-guidance/','/customisation/','/security-integrations/','/solutions/','/how-it-works/','/development/','/client-login/','/contact/','/melbourne/',...sectors.map(s=>'/solutions/'+s.slug+'/')];
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
  assert(html.includes('href="https://www.magickeys.com.au'+route+'"'),'Canonical URL mismatch in '+route);
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
    const url=new URL(value,'https://www.magickeys.com.au'+route);
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
assert(home.includes('/assets/app-cctv.svg'),'Homepage CCTV dashboard missing');
assert(!home.includes('id="portal-tour"')&&!home.includes('id="client-access"'),'Homepage still contains full sections that should have moved');
assert(pages.get('/platform/').html.includes('id="portal-tour"')&&pages.get('/platform/').html.includes('id="media-gallery"'),'Actual portal tour and full gallery missing');
assert(pages.get('/gate-control/').html.includes('id="interactive-demo"'),'Original 3D demonstration missing');
assert((pages.get('/customisation/').html.match(/data-gate-target=/g)||[]).length===8,'Multi-gate controls missing');
const clientLogin=pages.get('/client-login/').html;
assert(clientLogin.includes('method="post" action="https://magickeys-balwyn-portal.com/api/auth/client-entry"'),'Secure native login handoff missing');
assert(clientLogin.includes('name="username"')&&clientLogin.includes('autocomplete="username"')&&clientLogin.includes('name="password"')&&clientLogin.includes('autocomplete="current-password"'),'Login credential fields missing');
assert(clientLogin.includes('href="https://magickeys-balwyn-portal.com/client-login?method=google"'),'Google sign-in entry missing');
assert(!clientLogin.includes('Balwyn High School')&&!clientLogin.includes('Campus access portal'),'School branding remains on the general login');
assert(clientLogin.includes('/assets/client-access.js'),'Password visibility control missing');
assert(pages.get('/development/').html.includes('IN DEVELOPMENT')&&pages.get('/development/').html.includes('Human acknowledgement'),'Development status or human acknowledgement missing');
assert(home.includes('IN DEVELOPMENT')&&home.includes('/development/'),'Development programme not prominent on the homepage');
for(const [route,page] of pages) if(route!=='/') assert(!page.html.includes('id="site-intro"'),'Intro unexpectedly blocks a detail page: '+route);


// A new page cannot quietly reintroduce a different app layout or obsolete mockup.
for(const [route,page] of pages) {
  assert(!/custom-dashboard-(?:commercial|cctv)|sentinel-preview\.png|emergency-staff-preview\.png|src="\/assets\/portal-(?:overview|schedules|bookings|activity|gate-response|emergency-confirm|priority-clear)\.png/.test(page.html),'Obsolete app image on '+route);
  const header=page.html.match(/<header[\s\S]*?<\/header>/)?.[0]||'';
  assert((header.match(/href="\/anti-tailgating\/"/g)||[]).length===1,'Expected exactly one anti-tailgating header entry on '+route);
}
for(const file of files.filter(path=>/\/assets\/app-[^/]+\.svg$/.test(path))) {
  const svg=readFileSync(file,'utf8');
  assert(svg.includes('data-app-layout="magickeys-reference-v1"'),'App export has inconsistent chrome: '+file);
  assert(svg.includes('Gate schedules')&&svg.includes('CCTV &amp; zones'),'App navigation missing in '+file);
}
assert(home.includes('data-app-layout="magickeys-reference-v1"'),'Homepage does not use the common app layout');
const cameraSvg=readFileSync(join(root,'assets/app-cctv.svg'),'utf8');
assert((cameraSvg.match(/class="mk-rec-led"/g)||[]).length===16,'Each of the 15 cameras and the overhead camera must have a recording indicator');
assert(cameraSvg.includes('@keyframes rec-led'),'SVG camera recording animation missing');
assert(pages.get('/anti-tailgating/').html.includes('youtube-nocookie.com/embed/SOBpnzIweak?rel=0'),'Supplied OPTEX video is missing');
for(const [route,page] of pages) {
  const cameraCount=(page.html.match(/class="mk-camera-osd/g)||[]).length;
  if(cameraCount) assert(page.html.includes('/assets/camera-style.js'),'Camera example clock script missing on '+route);
}

const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
const indexableRoutes=expectedRoutes.filter(route=>route!=='/client-login/');
assert(locations.length===indexableRoutes.length,'Sitemap page count mismatch');
for(const route of indexableRoutes) assert(locations.includes('https://www.magickeys.com.au'+route),'Sitemap URL missing: '+route);
assert(readFileSync(join(root,'robots.txt'),'utf8').includes('https://www.magickeys.com.au/sitemap.xml'),'Robots sitemap missing');
assert(!locations.some(url=>url.includes('client-login')||url.includes('404')),'Private utility pages must be absent from sitemap');
for(const [route,page] of pages) {
  const noindex=route==='/client-login/'||route==='/404.html';
  assert((page.html.match(/<meta name="robots"/g)||[]).length===1,'Expected one robots directive on '+route);
  assert(page.html.includes(noindex?'content="noindex, follow"':'content="index, follow, max-image-preview:large"'),'Unexpected indexing rule on '+route);
  const json=page.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(json,'Missing structured data on '+route);
  const data=JSON.parse(json[1]);
  assert(data['@context']==='https://schema.org'&&Array.isArray(data['@graph']),'Invalid schema graph on '+route);
  const graph=data['@graph'];
  assert(graph.some(n=>n['@type']==='Organization'&&n.telephone==='+61400101132'),'Missing consistent business contact on '+route);
  assert(graph.some(n=>n['@id']==='https://www.magickeys.com.au'+route+'#webpage'),'Missing page entity on '+route);
  for(const n of graph) assert(!n.aggregateRating&&!n.review&&!n.address,'Unverified business claims must not be introduced');
  if(route.startsWith('/solutions/')) {
    const crumbs=graph.find(n=>n['@type']==='BreadcrumbList');
    assert(crumbs?.itemListElement.length===3,'Industry page needs a complete breadcrumb hierarchy');
    assert(page.html.includes('href="/solutions/"')&&page.html.includes('href="/melbourne/"'),'Missing industry/hub links');
    const words=page.html.split('<main')[1].split('</main>')[0].replace(/<[^>]+>/g,' ').trim().split(/\s+/).length;
    assert(words>420,'Industry guide lacks substantive content: '+route);
    assert(page.html.includes('fetchpriority="high"'),'Industry hero image is not prioritised');
  }
  assert(page.html.includes('name="twitter:card"'),'Missing social preview metadata on '+route);
}
assert(readFileSync(join(root,'assets/site.js'),'utf8').includes('Opening sequence plays only when the visitor chooses it.'),'Homepage must be visible without an automatic video overlay');
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
for(const source of ['site.js','multipage.js','security-demo.js','scene3d.js','scene3d-mounts.js','vehicle-access.js','client-access.js']) {
  execFileSync(process.execPath,['--check',join(root,'assets',source)]);
}
verifyInteractions(pages);
const vehicleContext=vm.createContext({});
vm.runInContext(readFileSync(join(root,'assets/scene3d.js'),'utf8'),vehicleContext);
const vehicles=vehicleContext.MagicKeys3D;
assert(vehicles.kinds.includes('bollard'),'Bollard model is missing');
const shaftHeights=[];
for(const progress of [0,.25,.5,.75,1]) {
  const model=vehicles.buildModel({kind:'bollard',progress});
  const shaft=model.meshes.find(mesh=>mesh.id==='bollard-1-shaft');
  shaftHeights.push(Math.max(...shaft.vertices.map(v=>v.y)));
  assert(shaft.vertices.every(v=>v.y>=0),'A lowered bollard went below the rendered road surface');
  for(const kind of ['bollard','boom','sliding']) {
    const scene=vehicles.project({kind,progress,width:500,height:300});
    assert(scene.faces.every(face=>face.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))),'Invalid vehicle projection');
    assert(scene.metadata.projectedBounds.minX>=0&&scene.metadata.projectedBounds.maxX<=500,'Vehicle clipped horizontally');
    assert(scene.metadata.projectedBounds.minY>=0&&scene.metadata.projectedBounds.maxY<=300,'Vehicle clipped vertically');
  }
}
assert(shaftHeights.every((height,i)=>i===0||height<shaftHeights[i-1]),'Bollards must retract vertically as the driveway opens');
assert(readFileSync(join(root,'assets/app-vehicle-access.svg'),'utf8').includes('Main sliding gate'),'Sliding gate missing from the vehicle portal image');
console.log('Verified '+expectedRoutes.length+' pages plus 404, '+links+' links/media references, all canonical URLs and sitemap entries, '+preserved+' unchanged original media assets, and page/control behaviour.');
