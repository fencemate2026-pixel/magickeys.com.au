import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { appShell } from './app-layout.mjs';
import { cameraOverlay } from './camera-style.mjs';
import { securityDemo } from './security-demo.mjs';
import { antiTailgatingContent } from './anti-tailgating.mjs';

const origin = 'https://magickeys.com.au';
const arrow = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const button = (text, href='/contact/', style='btn-orange') => `<a class="btn ${style}" href="${href}">${text} ${arrow}</a>`;
const link = (text, href) => `<a class="text-link" href="${href}">${text} ${arrow}</a>`;
const heading = (eyebrow, title, text) => `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div><p>${text}</p></div>`;
const section = (content, classes='section-shell section-space', id='') => `<section class="${classes}"${id ? ` id="${id}"` : ''}>${content}</section>`;
const cards = items => `<div class="benefit-grid">${items.map(([title,text,name='check']) => `<article>${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`;
const faq = items => `<div class="faq-list">${items.map(([q,a])=>`<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div>`;
const dimensions = {'optex-system-reference.jpg':[750,405], 'optex-detection-reference.jpg':[640,480], 'tailgating-example.webp':[750,346], 'projector-guidance.png':[941,630], 'sentinel-preview.png':[1769,749], 'portal-overview.png':[1917,911], 'detection-unit.webp':[540,540], 'hyd-pasins-3d.webp':[1536,1024]};
const image = (file, alt, caption, branded=false) => {
  const [width,height]=file.startsWith('app-')&&file.endsWith('.svg')?[1891,895]:dimensions[file] || [1672,941];
  const appVisual=file.startsWith('app-');
  if(appVisual) branded=false;
  return `<figure class="detail-figure${appVisual?' app-screen-figure':''}${branded?' dashboard-figure':''}">${branded ? '<div class="dashboard-brandbar"><span class="brand"><img src="/assets/magickeys-logo.png" alt="MagicKeys" width="2061" height="763"></span><span>YOUR SITE / YOUR CONFIGURATION</span><img class="dashboard-rjl" src="/assets/rjl-logo.png" alt="RJL Commercial" width="900" height="210"></div>' : ''}<button type="button" class="detail-image-button" data-preview="/assets/${file}" data-preview-alt="${escape(alt)}" data-preview-caption="${escape(caption)}" aria-label="Enlarge ${escape(alt)}"><img src="/assets/${file}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy"><span aria-hidden="true">↗</span></button><figcaption>${caption}</figcaption></figure>`;
};
const model = (id, kind, title, compact=false) => `<div class="model-stage detail-model${compact?' model-stage-compact':''}" id="${id}" data-scene-kind="${kind}" data-state="closed"${compact?' data-scene-compact="true"':''} role="group" aria-label="Illustrative 3D ${title}"><img class="model-poster" src="/assets/model-${kind}-closed.svg" width="800" height="560" alt="Proportioned 3D ${title}" loading="lazy"><canvas class="model-canvas" tabindex="0" role="img" aria-label="3D ${title}. Drag or use arrow keys to rotate; press R to reset." hidden></canvas><div class="model-caption"><span>Drag to inspect · Arrow keys · R to reset</span><span>ILLUSTRATIVE HARDWARE</span></div></div>`;
const hero = (eyebrow, title, text, visual, primary='Discuss your site', extra='') => `<section class="page-hero"><div class="section-shell"><a class="breadcrumb" href="/">MagicKeys ${arrow}</a><div class="page-hero-grid"><div class="page-hero-copy"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${text}</p><div class="hero-actions">${button(primary)}${extra}</div></div><div class="page-hero-visual">${visual}</div></div></div></section>`;
const cta = (title='A system built around your site.', text='Tell the MagicKeys team what you need to control, see and manage. We will work through the equipment and tailor a proposal to your operation.', interest='MagicKeys') => section(`<div class="conversion-panel"><div><div class="eyebrow">YOUR NEXT STEP</div><h2>${title}</h2><p>${text}</p></div>${button('Discuss your requirements', '/contact/?interest='+encodeURIComponent(interest))}</div>`, 'section-shell conversion-section');
const rows = items => `<div class="story-rows">${items.map(([no,title,text])=>`<article><span>${no}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`;
const future = () => section(`<div class="development-teaser"><div><span class="development-status">IN DEVELOPMENT</span><h2>AI-assisted threat and fire detection.<br>Human judgement at the centre.</h2><p>We are developing detection that can flag potential threats and signs of fire for authorised staff to review and acknowledge. Human acknowledgement is central to the proposed response workflow.</p><p class="development-note">This capability is in development. Availability and project scope will be confirmed by the team.</p></div>${link('Explore the development programme','/development/')}</div>`, 'future-band', 'in-development');

// Extract approved sections with balanced tags, so source changes fail clearly.
function extract(source, pattern, tag='section') {
  const match=pattern.exec(source);
  if(!match) throw new Error('Approved section not found: '+pattern);
  const start=match.index;
  const tokens=new RegExp('<'+tag+'\\b[^>]*>|</'+tag+'>','g');
  tokens.lastIndex=start;
  let depth=0, token;
  while((token=tokens.exec(source))) {
    depth += token[0].startsWith('</') ? -1 : 1;
    if(depth===0) return source.slice(start,tokens.lastIndex);
  }
  throw new Error('Unbalanced approved section: '+pattern);
}

export function buildPages() {
  const source=readFileSync('dist/index.html','utf8');
  const intro=extract(source,/<div class="site-intro"/,'div');
  const symbols=extract(source,/<svg class="icon-defs"/,'svg');
  const posters=extract(source,/<div class="model-poster-assets"/,'div');
  const dialogs=source.slice(source.indexOf('<dialog class="image-dialog"'),source.indexOf('</body>'))
    .replace('Azure hosting may record standard request and security logs.','Our hosting provider may record standard request and security logs.');
  const appAssetMap={
    'portal-overview.png':'app-overview.svg','current-portal-layout-v2.webp':'app-overview.svg',
    'portal-schedules.png':'app-schedules.svg','portal-bookings.png':'app-bookings.svg',
    'portal-activity.png':'app-activity.svg','portal-gate-response.png':'app-overview.svg',
    'portal-emergency-confirm.png':'app-emergency-confirm.svg','portal-priority-clear.png':'app-priority-clear.svg',
    'sentinel-preview.png':'app-cctv.svg','emergency-staff-preview.png':'app-guidance.svg',
    'tailgating-example.webp':'app-cctv.svg'
  };
  const original=(pattern,tag) => {
    let result=extract(source,pattern,tag);
    // Remove superseded gallery repeats while retaining the actual equipment views.
    result=result.replace(/<figure class="media-card"[\s\S]*?<\/figure>/g,card=>/portal-gate-response|tailgating-example/.test(card)?'':card);
    for(const [before,after] of Object.entries(appAssetMap)) result=result.replaceAll(before,after);
    return result.replace(/<[^>]+(?:src|data-image|data-preview)="(?:\/)?assets\/app-[^"]+\.svg"[^>]*>/g,tag=>tag.replace(/(width|data-width)="\d+"/g,'$1="1891"').replace(/(height|data-height)="\d+"/g,'$1="895"'));
  };

  const tour=original(/<section class="portal-tour/)
    .replaceAll('portal-overview.png','app-overview.svg')
    .replaceAll('1917','1891').replaceAll('911','895')
    .replace('THE FULL PICTURE / 13 IMAGES','PORTAL SCREENS &amp; SITE EQUIPMENT')
    .replace('Explore the screens and equipment.','See the details behind the platform.')
    .replace('Every supplied screen and equipment image, ready to enlarge.','Explore the supplied portal screens and equipment. Select an image for a closer view.')
;
  const capabilities=original(/<section class="platform /);
  let demo=original(/<section class="demo-section"/).replaceAll('Foyer detection','Anti-Tailgating System');
  // The dedicated overhead product page owns anti-tailgating; this selector is gates only.
  demo=demo.replace(/<button id="tab-foyer"[\s\S]*?<\/button>/,'');
  const demoWindow=extract(demo,/<div class="demo-workspace"/,'div');
  demo=demo.replace(demoWindow,appShell(demoWindow,{active:'overview'}));

  const solutions=original(/<section class="solutions /)
    .replaceAll('AI-GENERATED CONCEPT','SITE CONFIGURATION EXAMPLE')
    .replaceAll('AI-generated architectural concept','Architectural site concept')
    .replaceAll('AI-generated site concept','Site configuration example');
  const detection=original(/<section class="detect-section"/)
    .replace('<section class="detect-section"', '<section id="anti-tailgating" class="detect-section"')
    .replace('MAGICKEYS <strong>DETECT</strong>','MAGICKEYS <strong>ANTI-TAILGATING SYSTEMS</strong>')
    .replace('PERSON-DETECTION ALERTS','INSTALLED ANTI-TAILGATING SYSTEMS')
    .replace('The right alert.<br>The right people.','Identify tailgating.<br>Inform your team.')
    .replace('Connect compatible person-detection equipment to MagicKeys. Set a permitted person count and route configured events to the nominated people for your site.',
      'We install Anti-Tailgating Systems and connect compatible entrance-detection equipment to MagicKeys. Configure the permitted person count and give your nominated team visibility of events that need attention.')
    .replace('Discuss person detection','Discuss Anti-Tailgating Systems')
    .replace('MagicKeys Detect','Anti-Tailgating System');
  const sentinel=original(/<article class="upgrade-card sentinel-card"/,'article').replace('OPTIONAL / AI CCTV','CCTV / OPTIONAL SENTINEL PACKAGE');
  const guidance=original(/<article class="upgrade-card guidance-card"/,'article');
  const how=original(/<section class="section-shell section-space how-section"/);
  const login=original(/<section class="client-section"/)
    .replace('<h2 id="client-access-heading">','<h1 id="client-access-heading">')
    .replace('Your access.</span></h2>','Your access.</span></h1>');
  let homeHero=original(/<section class="hero">/)
    .replace('THE MAGICKEYS PLATFORM','ALL-IN-ONE ACCESS CONTROL &amp; CCTV')
    .replace('Access,<br><span>connected.</span>','Your site.<br><span>Connected.</span>')
    .replace('Gates. People. Spaces.','Access control. CCTV. And more.')
    .replace('Control connected gates, plan access schedules and see your site’s activity in one workspace. Add person-detection alerts, CCTV and Emergency Guidance to suit your site.',
      'Bring gate controls, CCTV, access schedules and activity into one fully customisable MagicKeys app. Built around your people, your equipment and the way your site works.')
    .replace('Discuss your site','Plan your MagicKeys system')
    .replace('The selected blue holographic AI face with connected points and data patterns','Blue digital face with connected points and data patterns')
    .replace('<div class="hero-portal-foot">',
      '<div class="hero-cctv-preview"><span>CCTV<br><small>EXAMPLE VIEWS</small></span><figure><span class="sd-scene" style="--camera-x:50%;--camera-y:100%" role="img" aria-label="High-mounted CCTV view of the pedestrian entry"></span>'+cameraOverlay('CAM 13',{compact:true})+'<figcaption>Pedestrian entry</figcaption></figure><figure><span class="sd-scene" style="--camera-x:0%;--camera-y:0%" role="img" aria-label="Ceiling-mounted CCTV view of the foyer inner doors"></span>'+cameraOverlay('CAM 01',{compact:true})+'<figcaption>Foyer 01 · Inner doors</figcaption></figure></div><div class="hero-portal-foot">');
  const oldHomeApp=extract(homeHero,/<div class="hero-screen hero-control-preview"/,'div');
  const homeTitle=extract(oldHomeApp,/<div class="hero-portal-title"/,'div').replace('Campus entry','Main entry');
  const homeWorkspace=extract(oldHomeApp,/<div class="hero-portal-workspace"/,'div');
  const homeCameras=extract(oldHomeApp,/<div class="hero-cctv-preview"/,'div');
  const homeApp=appShell(`<div class="mk-module-heading"><strong>Active gate controls &amp; site security</strong><button type="button" class="hero-preview-toggle" id="hero-preview-toggle">Pause preview</button></div><div class="mk-home-workspace"><div class="mk-home-gate">${homeTitle}${homeWorkspace}</div><div class="mk-home-tailgate"><div class="mk-tailgate-title"><strong>Foyer 01 / anti-tailgating</strong><span>EVENT FLAGGED</span></div><div class="mk-tailgate-camera"><div class="sd-overhead-view" data-state="alert" role="img" aria-label="Overhead foyer example with the following person boxed in red"><div class="sd-overhead-photo"></div>${cameraOverlay('FOYER 01 / OVERHEAD',{compact:true})}<span class="sd-track sd-track-one" aria-hidden="true"><b>Authorised entrant</b></span><span class="sd-track sd-track-two" aria-hidden="true"><b>Following person</b></span></div><div><span class="mk-alert-dot">●</span><strong>Following person detected</strong><p>Overhead camera<br>Foyer 01 · Inner doorway</p><a href="/anti-tailgating/#apartment-security-demo">Review event →</a></div></div></div></div>${homeCameras}`,{active:'overview',classes:'hero-control-preview',attributes:'id="hero-preview" role="group" aria-labelledby="hero-preview-title"'});
  homeHero=homeHero.replace(oldHomeApp,`<div class="hero-tablet" aria-label="MagicKeys app displayed on a landscape tablet"><span class="tablet-camera" aria-hidden="true"></span><div class="tablet-screen" data-app-viewport="1200">${homeApp}</div></div>`);
  const maker=original(/<div class="principle-strip"/,'div').replace('Detection alerts','Anti-Tailgating Systems');

  const productCards=[
    ['/gate-control/','lock','Gate control','Manage connected swing, sliding and boom gates through familiar controls.'],
    ['/cctv/','grid','CCTV &amp; Sentinel','Bring camera views and configured alerts into your site workspace.'],
    ['/anti-tailgating/','users','Anti-Tailgating Systems','Installed entrance detection, clear-space entry checks and event alerts for your team.'],
    ['/platform/','clock','Schedules &amp; bookings','Plan gate access around operating hours and approved venue hire.'],
    ['/customisation/','check','Fully customisable app','Shape the screens, access rules and workflow around your operation.'],
    ['/emergency-guidance/','shield','Emergency Guidance','Discuss staff prompts, visual instructions and agreed gate responses.']
  ];
  const productGrid=section(heading('CONNECTED CAPABILITIES','One platform.<br>A broader view of your site.','Explore each part of MagicKeys and build the combination that fits your site.')+
    `<div class="product-grid">${productCards.map(([href,name,title,text])=>`<a class="product-card" href="${href}">${icon(name)}<h3>${title}</h3><p>${text}</p><span>Explore ${arrow}</span></a>`).join('')}</div>`);

  const pages=[
    {
      route:'/', title:'MagicKeys | All-in-one access control & CCTV',
      description:'Connect access control, CCTV, schedules and more in one fully customisable MagicKeys app. Installed Anti-Tailgating Systems by RJL Commercial.',
      content:homeHero+maker+
        section(heading('YOUR SITE, IN VIEW','Control the entrance.<br>See the bigger picture.','From the gate at the driveway to the camera above it, MagicKeys brings the parts of your site together in a workspace designed for your team.')+
          image('app-cctv.svg','MagicKeys app with 15 CCTV views and an overhead tailgating detection panel','Custom configuration example · CCTV and overhead anti-tailgating in the same MagicKeys workspace. Final features depend on the agreed installation.',true)+
          `<div class="overview-links">${link('Explore the platform','/platform/')}${link('See CCTV capabilities','/cctv/')}</div>`,'section-shell section-space home-overview','site-overview')+
        productGrid+
        section(`<div class="customisation-pitch"><div><div class="eyebrow">FULLY CUSTOMISABLE</div><h2>Your operation.<br>Your MagicKeys.</h2><p>Your site has its own entrances, routines and responsibilities. The MagicKeys app can be customised to suit your client requirements, from the dashboard layout to the access rules and day-to-day workflows.</p>${link('Explore customisation','/customisation/')}</div>${image('commercial-entry-concept.webp','Commercial site concept with double swing gates, a boom gate and CCTV cameras','Site configuration example · Equipment and layout are agreed for each project.')}</div>`)+future()+cta()
    },
    {
      route:'/platform/', title:'The MagicKeys Platform | Access control, CCTV & schedules',
      description:'Explore the MagicKeys all-in-one platform: gate controls, CCTV, access schedules, venue bookings and activity in a fully customisable app.',
      content:hero('THE MAGICKEYS PLATFORM','One workspace.<br><span>More control.</span>','Access control, CCTV, schedules, bookings and activity belong together. MagicKeys brings them into a fully customisable app, so your team can manage the connected parts of your site with clarity.',image('app-cctv.svg','MagicKeys CCTV and anti-tailgating view in the supplied app layout','Custom configuration example · Modules and connections are scoped for your site.',true),'Discuss your platform',button('View real portal screens','#portal-tour','btn-outline'))+
        section(cards([
          ['A clearer working day','Find configured entrance controls, access windows and recorded activity in one site workspace.','grid'],
          ['A setup that fits','Customise the app around your site layout, authorised operators and agreed operating procedures.','users'],
          ['More context for decisions','Combine access information with compatible CCTV views and configured alerts where included in your project.','log']
        ]))+tour+capabilities+
        section(heading('BEYOND THE OPEN BUTTON','Plan access.<br>Keep the details together.','A useful access system supports the way your site operates before, during and after the gate moves.')+rows([
          ['01','Schedules around real operating hours','Set approved access windows for everyday operations and after-hours activity. The weekly schedule view makes planned access easier for your nominated operators to review.'],
          ['02','Venue hire with access in mind','Bring approved bookings and configured entrance access into the same planning conversation. A school, shared venue or commercial site can have a workflow tailored to how it manages hire.'],
          ['03','Activity and service context','Review recorded operator actions and access events. Configured service intervals and equipment information help your team keep the installation in view.']
        ])+`<div class="overview-links">${link('Customise your app','/customisation/')}${link('Explore security &amp; integration','/security-integrations/')}</div>`)+cta('Bring your site into one workspace.','Talk through the controls, camera views and workflows your team needs. We will map the right MagicKeys configuration for your operation.','Platform')
    },
    {
      route:'/gate-control/', title:'MagicKeys Gate Control | Swing, sliding & boom gates',
      description:'Explore MagicKeys control for connected single swing, double swing, sliding and boom gates. Try the 3D demonstration and discuss your equipment.',
      content:hero('CONNECTED GATE CONTROL','Every entrance.<br><span>A clearer way to operate.</span>','Give authorised operators a consistent workspace for connected gates and boom barriers. Organise entrances by your site, plan approved access windows and keep requested actions distinct from confirmed equipment feedback.',model('gate-page-hero','double','double swing gate'),'Discuss your gates',button('Try the controls','#interactive-demo','btn-outline'))+
        demo+section(heading('THE HARDWARE YOU USE','From a side gate<br>to the main driveway.','The portal is tailored to the entrances you have. Controllers, connection options and position feedback are assessed as part of the installation.')+cards([
          ['Single swing gates','Keep a smaller pedestrian or side entrance visible to the operators responsible for it.','lock'],
          ['Double swing gates','Bring the two-leaf entrance into a clear control card, with operating rules agreed for the site.','lock'],
          ['Sliding gates','Manage a connected sliding entrance alongside the other access points in your workspace.','lock'],
          ['Boom gates','Organise entry, exit and visitor-lane controls around your parking or vehicle-access requirements.','lock']
        ]))+
        section(heading('CONFIDENCE IN THE DETAILS','Know the command.<br>Check the response.','A request to open a gate and a confirmed open position are different pieces of information.')+rows([
          ['01','Clear equipment status','Where connected feedback is commissioned, the workspace can show reported responses. A missing or unconfirmed position remains clear to the operator.'],
          ['02','Approved operating roles','Configure which nominated operators can access the controls for their site. Discuss shared entrances, operating hours and exception handling during setup.'],
          ['03','A properly commissioned installation','Local safety devices and controller behaviour remain part of the physical gate installation. Operation, feedback and agreed procedures are checked onsite before handover.']
        ]))+cta('Let’s connect your entrances.','Share the gate types, controllers and access routines at your site. We will assess the connections and propose a suitable setup.','Gate control')
    },
    {
      route:'/anti-tailgating/', title:'Anti-Tailgating & Integration | OPTEX & HYD | MagicKeys',
      description:'OPTEX OV-102 and HYD Technology anti-tailgating systems, connected to a customised MagicKeys app. Explore overhead foyer detection and 15 CCTV views.',
      content:antiTailgatingContent({hero,section,heading,cards,rows,faq,cta,button,link,image,securityDemo})
    },
    {
      route:'/cctv/', title:'MagicKeys CCTV & Sentinel | Camera views in your workspace',
      description:'Bring compatible CCTV cameras and configured Sentinel alerts into MagicKeys. See your access points and review visual context in a customised workspace.',
      content:hero('CCTV &amp; MAGICKEYS SENTINEL','See the entrance.<br><span>Understand the context.</span>','Bring compatible camera views into the same MagicKeys workspace as your connected entrances. Discuss the zones, visibility and optional Sentinel alerts that support your team’s day-to-day oversight.',image('app-cctv.svg','MagicKeys app with 15 CCTV views and an overhead anti-tailgating panel','Custom configuration example · CCTV connections and modules are confirmed for each project.',true),'Discuss your CCTV setup')+
        section(heading('ACCESS AND CCTV, TOGETHER','The control.<br>The camera view.','Your team should be able to understand which entrance it is managing and the visual context available for that area.')+cards([
          ['Views around your site','Plan the camera views that matter: the main entry, parking area, pedestrian entrance or service yard.','grid'],
          ['A dashboard built for your team','Arrange included camera views and gate controls around the way your operators work.','users'],
          ['Existing cameras considered','We assess camera compatibility and the available connection method before confirming what can be brought into MagicKeys.','check']
        ]))+section(sentinel,'section-shell section-space')+
        section(heading('A CONSIDERED CCTV SETUP','Choose the zones.<br>Define the response.','Sentinel is an optional package, tailored to compatible equipment and the events agreed for your site.')+rows([
          ['01','Map camera coverage','Review the cameras, viewing areas and the site’s monitoring responsibilities. Existing hardware is considered as part of the proposal.'],
          ['02','Agree configured event prompts','Discuss which supported events need a staff prompt, who should receive it and what visual context they need.'],
          ['03','Keep people in the workflow','Nominated staff review the context and follow the agreed response. AI-assisted threat and fire detection is a separate capability currently in development.']
        ])+link('See what is in development','/development/'))+cta('Build a clearer view of your site.','Share your existing cameras and the areas your team needs to see. We will assess the CCTV setup and tailor the workspace around it.','CCTV & Sentinel')
    },
    {
      route:'/emergency-guidance/', title:'MagicKeys Emergency Guidance | Site-specific response planning',
      description:'Explore the MagicKeys Emergency Guidance package: staff prompts, visual instructions and configured gate responses tailored to an agreed site plan.',
      content:hero('SITE-SPECIFIC EMERGENCY GUIDANCE','Clear instructions.<br><span>An agreed response.</span>','Discuss a package that brings staff confirmation, visual messages and configured gate responses into your site’s agreed procedures. Equipment, layout and commissioning shape the final scope.',image('projector-guidance.png','Illustrative projector screen showing route guidance','Emergency Guidance package example · Site instructions and scope are agreed for the installation.'))+
        section(guidance,'section-shell section-space')+
        section(heading('BUILT AROUND YOUR PROCEDURES','Plan the workflow<br>before it is needed.','The team works through your site requirements and available equipment to define a practical package.')+rows([
          ['01','Staff confirmation','Agree which prompts staff need to review and who is authorised to confirm the next step.'],
          ['02','Messages for your location','Discuss projector messages and route guidance that reflect the site’s agreed instructions and assembly arrangements.'],
          ['03','Configured equipment responses','Assess connected gate controllers and available feedback. Requested movements and reported responses remain distinct.']
        ])+`<div class="scope-note"><strong>AI threat and fire detection is in development.</strong><p>The developing AI-assisted module uses a proposed human review and acknowledgement workflow. Its availability will be confirmed separately.</p>${link('Explore the development programme','/development/')}</div>`)+cta('Talk through your site’s requirements.','The team will assess the equipment and discuss an Emergency Guidance package around your agreed procedures.','Emergency Guidance')
    }
  ];

  const morePages=buildMorePages({solutions, how, login, source});
  pages.push(...morePages);
  writeSite({pages, intro, symbols, posters, dialogs});
}

function buildMorePages({solutions, how, login}) {
  const combinedDemo=section(heading('YOUR WORKSPACE / INTERACTIVE EXAMPLE','More entrances.<br>One familiar workspace.','Try the controls across two boom gates and two double gates. This configuration example runs in your browser and is disconnected from physical equipment.')+
    appShell(`<div class="mk-module-heading"><strong>Active gate controls</strong><span>SIMULATED CONTROLS</span></div><div class="custom-gates">${[
      ['entry-boom','boom','Entry boom gate'],['exit-boom','boom','Exit boom gate'],['main-double','double','Main double gate'],['service-double','double','Service double gate']
    ].map(([id,kind,title],i)=>`<article class="custom-gate-card"><div class="custom-gate-heading"><span>0${i+1}</span><h3>${title}</h3><strong id="${id}-status" aria-live="polite">Demo: closed</strong></div>${model(id,kind,title,true)}<div class="custom-gate-controls"><button type="button" class="btn btn-green" data-gate-target="${id}" data-gate-state="open" aria-label="Open the simulated ${title.toLowerCase()}">OPEN</button><button type="button" class="btn btn-dark" data-gate-target="${id}" data-gate-state="closed" aria-label="Close the simulated ${title.toLowerCase()}" disabled>CLOSE</button></div></article>`).join('')}</div><p class="custom-workspace-note">Configuration example · Sample controls and equipment · No live commands or notifications</p>`,{active:'overview',classes:'custom-workspace'}), 'section-shell section-space','custom-controls');
  const secureVisual=securityDemo();
  const developmentVisual=`<div class="development-visual"><span class="development-status">IN DEVELOPMENT</span><h2>Flag.<br>Review.<br><span>Acknowledge.</span></h2><ol><li><span>01</span> Potential event flagged</li><li><span>02</span> Authorised staff review</li><li><span>03</span> Human acknowledgement</li><li><span>04</span> Agreed site procedure</li></ol><p>Proposed workflow · Developing capability</p></div>`;
  const contactVisual=`<div class="contact-card"><img src="/assets/magickeys-logo.png" alt="MagicKeys" width="2061" height="763"><span class="eyebrow">CONTACT THE TEAM</span><a class="contact-phone" href="tel:+61400101132">0400 101 132</a><p>Talk through your site, existing systems and the configuration you need.</p>${button('Call the team','tel:+61400101132')}${link('Visit RJL Commercial','https://www.rjlcommercialgroup.com')}</div>`;
  return [
    {
      route:'/customisation/', title:'Fully Customisable MagicKeys App | Built around your site',
      description:'The MagicKeys app is fully customisable to suit each client. Explore custom gate, boom, CCTV and scheduling layouts, roles and operating workflows.',
      content:hero('FULLY CUSTOMISABLE MAGICKEYS APP','Your site.<br><span>Your way of working.</span>','MagicKeys is fully customisable to suit each client’s requirements. Shape the dashboard, connected entrances, CCTV views, access rules and workflows around the people who use your site.',image('app-cctv.svg','MagicKeys app with 15 CCTV views and an overhead anti-tailgating view in the same supplied app layout','Commercial configuration example · Includes an overhead tailgating camera with the following person highlighted in red. Features are agreed for your project.',true),'Discuss your custom app',button('Try a multi-gate setup','#custom-controls','btn-outline'))+
        section(heading('A PLATFORM THAT FITS','Build the experience<br>around your operation.','Customisation goes beyond adding a site name. We work through what your team needs to see, control and manage, then agree the app and installation scope.')+cards([
          ['Dashboard and site layout','Organise the workspace around your entrances, areas and included modules. Make the controls your team needs easy to find.','grid'],
          ['Equipment and camera views','Include connected boom, swing and sliding gates alongside compatible CCTV views and configured detection equipment.','lock'],
          ['People and permissions','Define your authorised operators and the access responsibilities agreed for each role.','users'],
          ['Schedules and workflows','Tailor access windows, booking routines and event response around the way your client operates.','clock']
        ]))+combinedDemo+
        section(heading('CUSTOM CONFIGURATION EXAMPLES','Different sites.<br>The same connected approach.','These examples show how MagicKeys can be presented for different equipment and operating needs. They illustrate configurations rather than completed client installations.')+
          `<div class="custom-example-grid">${image('app-cctv.svg','MagicKeys CCTV and anti-tailgating configuration in the same app layout','CCTV and anti-tailgating example · The same navigation, header and controls across the platform.',true)}${image('commercial-entry-concept.webp','Bright commercial entrance with two-leaf gates, a boom barrier and CCTV','Commercial entrance example · Physical equipment and software are scoped together.')}</div>`)+
        section(heading('FROM YOUR REQUIREMENTS TO A PROPOSAL','Tell us what<br>your site needs to do.','Start with your equipment and working day. We will identify the connection options, tailor the workflow and confirm what can be delivered.')+rows([
          ['01','Your existing setup','Share the entrances, controllers, cameras and other systems already in place. We assess compatibility and practical connection options.'],
          ['02','Your operating priorities','Explain who needs to use the system, which tasks take time and how you want access, CCTV and alerts to work together.'],
          ['03','Your agreed configuration','We define the app changes, equipment connections and commissioning scope in the project proposal. Additional integrations are confirmed before inclusion.']
        ])+link('Explore integration options','/security-integrations/'))+cta('Let’s design your MagicKeys app.','Bring your requirements to the team. We will work through a fully customised configuration for your client and site.','Customisation')
    },
    {
      route:'/security-integrations/', title:'MagicKeys Security & Integrations | Existing systems, connected',
      description:'Explore secure client sign-in, operator permissions and activity records in MagicKeys, plus a 15-camera apartment CCTV and anti-tailgating demonstration.',
      content:hero('SECURITY &amp; SYSTEM INTEGRATION','Secure access.<br><span>Connected systems.</span>','Bring apartment CCTV, foyer anti-tailgating detection and entrance activity into one customised MagicKeys app. Explore a 15-camera configuration for foyers, lifts, car parks and shared spaces, with linked alerts for your authorised team.',secureVisual,'Discuss security & integration',button('Try the apartment demo','#apartment-security-demo','btn-outline'))+
        section(heading('SECURITY WITH CLEAR RESPONSIBILITIES','The right people.<br>The right level of control.','A secure setup combines the portal, the operating roles and a properly commissioned installation.')+cards([
          ['Secure client sign-in','Approved users enter their organisation’s existing portal. This public website does not collect passwords or issue gate commands.','lock'],
          ['Encrypted portal connection','Use the secure HTTPS portal address provided for your organisation. Account access remains within your dedicated client workspace.','shield'],
          ['Site-specific permissions','Agree which authorised operators can use your workspace and the controls appropriate to their responsibilities.','users'],
          ['Recorded activity','Review the access events and operator actions recorded by the configured system, with equipment feedback kept clear.','log']
        ]))+
        section(heading('INTEGRATION AROUND YOUR EXISTING SETUP','Connect the systems<br>you already use.','MagicKeys is designed for broad integration with existing site systems. We assess the available interfaces and connection options, then tailor the integration to what can be delivered for your installation.')+
          `<div class="integration-grid"><article><span>01 / ACCESS</span><h3>Gates &amp; controllers</h3><p>Assess the existing gate controllers, available control connections and position feedback for swing, sliding and boom equipment.</p></article><article><span>02 / VISIBILITY</span><h3>Cameras &amp; detection</h3><p>Review compatible CCTV and entrance-detection equipment, camera views and the configured events your team needs to see.</p></article><article><span>03 / YOUR WORKFLOW</span><h3>Other client systems</h3><p>Bring the systems you already use into the discussion. Available interfaces and the required workflow determine the integration method and confirmed project scope.</p></article></div>`+
          `<div class="scope-note"><strong>Compatibility is confirmed before we promise an integration.</strong><p>The team reviews the existing system, available access and the connection method. Your proposal sets out the functions and integrations that will be delivered.</p></div>`)+
        section(heading('A PRACTICAL HANDOVER','Configured.<br>Checked. Understood.','Security is supported by clear responsibilities and a setup that your nominated operators understand.')+rows([
          ['01','Agree the access policy','Define who should have access, which controls they need and how changes to authorised operators should be handled.'],
          ['02','Confirm equipment and feedback','Check control behaviour and available equipment responses onsite. Local gate safety devices remain essential to the commissioned installation.'],
          ['03','Use your organisation’s portal','The marketing site keeps client access separate. Existing clients sign in at their confirmed organisation-specific portal address.']
        ])+link('Open Client Login','/client-login/'))+cta('Bring your existing systems to the conversation.','Tell the team what is installed and what you want connected. We will assess the interfaces and confirm a practical integration scope.','Security & integrations')
    },
    {
      route:'/solutions/', title:'MagicKeys Site Solutions | Commercial, schools & shared property',
      description:'Tailor MagicKeys access control, CCTV and Anti-Tailgating Systems for commercial, education, body corporate, logistics and shared venue requirements.',
      content:hero('BUILT AROUND YOUR SITE','The right setup.<br><span>For the way you operate.</span>','A shared entrance, school campus and vehicle yard have different priorities. MagicKeys is fully customisable, so the equipment, dashboard and access workflow can be tailored to each client.',image('commercial-entry-concept.webp','Modern commercial site with gates, boom barrier and cameras','Site configuration example · Layout and equipment are agreed for each installation.'))+
        solutions+
        section(heading('REAL OPERATING NEEDS','Start with the people<br>and the working day.','The site type is a starting point. The final configuration is built around your requirements and confirmed equipment connections.')+cards([
          ['Commercial &amp; facilities','Coordinate connected vehicle entrances, CCTV views and approved access hours for your nominated facilities or security operators.','grid'],
          ['Education &amp; shared venues','Plan campus access around school hours and approved venue bookings. Discuss optional CCTV and guidance packages against your site procedures.','clock'],
          ['Body corporate &amp; shared property','Bring managed driveway controls and configured Anti-Tailgating alerts into a workspace for the people responsible for the building.','users'],
          ['Logistics &amp; vehicle access','Organise entry, exit and service-yard controls with camera visibility and recorded activity where included in the project.','lock']
        ]))+cta('Tell us how your site works.','We will work through your entrances, users, existing systems and priorities to build a suitable MagicKeys proposal.','Site solution')
    },
    {
      route:'/how-it-works/', title:'How MagicKeys Works | Assess, customise, install & hand over',
      description:'See how RJL Commercial assesses your site, customises MagicKeys, connects compatible equipment and commissions the installation for your authorised team.',
      content:hero('FROM REQUIREMENTS TO HANDOVER','One project.<br><span>A connected result.</span>','We bring the app, your site equipment and the operating workflow into one considered project. The proposal confirms the customisation, connections and installation scope before delivery.',image('commercial-entry-concept.webp','Commercial entrance equipment and CCTV site concept','Site configuration example · Installation and commissioning are scoped for your project.'))+
        how+section(heading('THE PROJECT IN DETAIL','A setup your team<br>can work with.','Each stage resolves a practical part of your MagicKeys system.')+rows([
          ['01','Review equipment and requirements','Map entrances, existing controllers, cameras and detection equipment. Agree who uses the system and what they need it to do.'],
          ['02','Define the customised app','Work through the dashboard layout, access rules, included modules and any additional client-system integrations. Confirm the functions to be delivered.'],
          ['03','Install and connect','Connect the compatible equipment included in the proposal. Set up the operating rules, schedules and nominated access roles for the site.'],
          ['04','Commission the agreed behaviour','Check commands, reported responses and configured events onsite. Resolve the equipment and operating details before handover.'],
          ['05','Hand over to authorised operators','Give your nominated team its portal access and explain the agreed workflow. Keep a clear contact path for questions about the system.']
        ]))+cta('Start with a site discussion.','Share your equipment and operating requirements. The team will explain the next steps and shape a project around what your site needs.','Site assessment')
    },
    {
      route:'/development/', title:'In Development | AI threat & fire detection with human acknowledgement',
      description:'MagicKeys is developing AI-assisted threat and fire detection with authorised human review and acknowledgement. Availability is not yet confirmed.',
      content:hero('IN DEVELOPMENT / MAGICKEYS','AI detection.<br><span>Human acknowledgement.</span>','We are developing AI-assisted threat and fire detection as part of the wider MagicKeys system. The proposed workflow brings potential events to authorised people for review and acknowledgement before an agreed response.',developmentVisual,'Discuss the development programme')+
        section(`<div class="development-notice"><span class="development-status">IN DEVELOPMENT</span><h2>A developing capability.<br>A clear human role.</h2><p>Threat and fire detection is in the development stage. It is presented here as the direction of the product, with availability and deliverable scope to be confirmed by the team. It is not an included, currently commissioned capability.</p></div>`)+
        section(heading('THE DEVELOPMENT FOCUS','Earlier context.<br>Considered decisions.','The programme is focused on connecting potential visual events with a practical staff review process.')+cards([
          ['Threat detection','Developing AI-assisted analysis to flag potential threats for authorised staff to assess. Detection scope will be confirmed as the capability develops.','shield'],
          ['Fire detection','Developing AI-assisted analysis to flag potential signs of fire for review. This capability does not replace the site’s required fire systems or procedures.','bell'],
          ['Human acknowledgement','A nominated person reviews the visual context and acknowledges the event before following the agreed response workflow.','users']
        ]))+
        section(heading('PROPOSED HUMAN REVIEW WORKFLOW','Flag the event.<br>Keep people in control.','The intended workflow connects an automated prompt with a human decision and the site’s agreed procedure.')+rows([
          ['01','Flag','The developing capability identifies a potential visual event from the configured camera context.'],
          ['02','Review','Authorised staff receive the relevant context and assess what is happening.'],
          ['03','Acknowledge','A person acknowledges the event. The proposed process keeps human judgement central to the next step.'],
          ['04','Respond under agreed procedures','Any future equipment or guidance response must be defined, tested and agreed for the site. Availability and scope remain subject to development.']
        ])+faq([
          ['Can we include this in a system installed today?','Availability has not been confirmed. Ask the team about the development status and the capabilities that can be delivered in your current project.'],
          ['Will an AI alert automatically open gates or trigger an emergency response?','The proposed workflow includes authorised human review and acknowledgement. Any future response actions will need an agreed and commissioned site-specific scope.']
        ]))+cta('Discuss where MagicKeys is heading.','Talk to the team about your requirements and the development programme. We will distinguish current deliverables from developing capabilities.','AI threat & fire detection development')
    },
    {
      route:'/client-login/', title:'MagicKeys Client Login | Your organisation’s secure portal',
      description:'Open your organisation’s existing MagicKeys client portal. Approved Balwyn High School users can sign in using their existing account.',
      content:login+section(heading('EXISTING CLIENTS','The portal for<br>your organisation.','Your controls, schedules and permissions remain in your dedicated client workspace.')+faq([
          ['Which login should I use?','Use the confirmed portal address for your organisation. The Balwyn High School link on this page is specifically for that organisation’s approved users.'],
          ['My organisation is not listed. What should I do?','Contact the MagicKeys team for the correct portal address. Do not enter account credentials on this public marketing website.'],
          ['Can I operate a gate on this website?','The website demonstrations are simulated. Actual site controls are available only through your organisation’s approved portal and account permissions.']
        ]))
    },
    {
      route:'/contact/', title:'Contact the MagicKeys Team | Discuss your site & custom app',
      description:'Contact the MagicKeys team on 0400 101 132 to discuss access control, CCTV, Anti-Tailgating Systems, customisation and existing-system integration.',
      content:hero('CONTACT THE MAGICKEYS TEAM','Let’s connect<br><span>your site.</span>','Tell us what you need to control, see and manage. We will discuss your existing equipment, the way your team works and a MagicKeys configuration that fits your requirements.',contactVisual,'Call the team','').replace('<section class="page-hero">','<section class="page-hero" id="contact">').replace('<a class="btn btn-orange" href="/contact/">Call the team','<a class="btn btn-orange" href="tel:+61400101132">Call the team')+
        section(`<div class="enquiry-context" id="enquiry-context" hidden><span class="eyebrow">YOUR ENQUIRY</span><p id="enquiry-subject"></p></div>`+
          heading('A USEFUL FIRST CONVERSATION','Your requirements.<br>A practical starting point.','You do not need a finished specification. These details help the team understand the site and shape the next step.')+
          cards([
            ['Your site','The type of property, entrances and the people who need to manage access.','grid'],
            ['Your equipment','Existing gate controllers, boom barriers, cameras and other systems you want connected.','lock'],
            ['Your priorities','The controls, views, schedules or alerts that would make your working day easier.','clock']
          ]))+
        section(heading('QUESTIONS BEFORE YOU CALL','A few details<br>about MagicKeys.','Discuss the final scope with the team so the proposal reflects the system that can be delivered for your site.')+faq([
          ['Is the MagicKeys app fully customisable?','Yes. The app can be customised to suit each client’s requirements. The dashboard, site controls, access rules and workflows are agreed as part of the project.'],
          ['Can MagicKeys integrate with our existing systems?','MagicKeys is designed for broad integration. The team assesses your equipment, available interfaces and required workflow before confirming the connection method and deliverable scope.'],
          ['Do you install Anti-Tailgating Systems?','Yes. We install Anti-Tailgating Systems and assess compatible entrance-detection equipment, placement and configured event rules for the site.'],
          ['Are CCTV and optional packages included automatically?','Your proposal confirms the included modules, compatible equipment and commissioned functions. CCTV, Sentinel and Emergency Guidance are discussed against your site requirements.'],
          ['Is AI threat and fire detection available now?','The AI-assisted threat and fire detection capability is in development. The proposed workflow includes human review and acknowledgement; availability will be confirmed separately.']
        ]))+
        cta('Speak with the MagicKeys team.','Call 0400 101 132 to discuss your site and the configuration you need.','MagicKeys').replace('href="/contact/?interest=MagicKeys"','href="tel:+61400101132"').replace('Discuss your requirements','Call 0400 101 132')
    }
  ];
}

function writeSite({pages,intro,symbols,posters,dialogs}) {
  const navigationLink=(route,label,current) => `<a href="${route}"${current===route?' aria-current="page"':''}>${label}</a>`;
  const platformNav=[['/platform/','Platform overview'],['/gate-control/','Gate control'],['/anti-tailgating/','Anti-tailgating &amp; integration'],['/cctv/','CCTV &amp; Sentinel'],['/emergency-guidance/','Emergency Guidance']];
  const setupNav=[['/customisation/','Fully customisable app'],['/security-integrations/','Security &amp; integrations'],['/solutions/','Site solutions'],['/how-it-works/','How it works'],['/development/','In development: AI detection']];
  function navGroup(title,items,current) {
    return `<details class="nav-group"${items.some(([url])=>url===current)?' data-active-group':''}><summary>${title}<span aria-hidden="true">⌄</span></summary><div class="nav-dropdown">${items.map(([url,label])=>navigationLink(url,label,current)).join('')}</div></details>`;
  }
  function header(route) {
    return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="/" aria-label="MagicKeys home"><img src="/assets/magickeys-logo.png" alt="MagicKeys" width="2061" height="763"></a><button class="nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-navigation"><span></span><span></span></button><nav id="main-navigation" aria-label="Main navigation">${navGroup('Explore MagicKeys',platformNav.filter(([url])=>url!=='/anti-tailgating/'),route)}${navGroup('Your setup',setupNav,route)}${navigationLink('/anti-tailgating/','Anti-tailgating &amp; integration',route)}<a href="/client-login/" class="nav-login"${route==='/client-login/'?' aria-current="page"':''}>${icon('lock')}Client login</a>${button('Contact the team','/contact/','btn-orange btn-nav')}</nav></div></header>`;
  }
  const footer=`<footer class="site-footer"><div class="section-shell footer-main"><div><a class="brand footer-brand" href="/" aria-label="MagicKeys home"><img src="/assets/magickeys-logo.png" alt="MagicKeys" width="2061" height="763"></a><p>All-in-one access control.<br>CCTV. And more.</p></div><nav class="footer-nav" aria-label="Footer navigation"><div><span>EXPLORE MAGICKEYS</span>${platformNav.map(([url,label])=>navigationLink(url,label)).join('')}</div><div><span>YOUR SETUP</span>${setupNav.map(([url,label])=>navigationLink(url,label)).join('')}${navigationLink('/contact/','Contact the team')}${navigationLink('/client-login/','Client login')}<button class="plain-button" id="privacy-open">Privacy information</button></div></nav><div class="footer-rjl"><span>DEVELOPED &amp; MANAGED BY</span><a href="https://www.rjlcommercialgroup.com" target="_blank" rel="noopener noreferrer"><img src="/assets/rjl-logo.png" alt="RJL Commercial Fencing and Gates" width="900" height="210"></a><a class="footer-phone" href="tel:+61400101132">0400 101 132</a></div></div><div class="section-shell footer-bottom"><span>© <span id="copyright-year">2026</span> MagicKeys · RJL Commercial</span><span>magickeys.com.au <span class="footer-dot">●</span> Melbourne, Australia</span></div></footer>`;
  const anchorRoutes={'portal-tour':'/platform/','platform':'/platform/','interactive-demo':'/gate-control/','solutions':'/solutions/','upgrades':'/cctv/','how-it-works':'/how-it-works/','client-access':'/client-login/','contact':'/contact/'};
  function normalise(content,route) {
    return content.replace(/(?<!\/)assets\//g,'/assets/').replace(/href="#([^"]+)"/g,(full,id)=>{
      if(!anchorRoutes[id] || content.includes(`id="${id}"`)) return full;
      return `href="${anchorRoutes[id]}${id==='upgrades'?'':'#'+id}"`;
    });
  }
  function document(page) {
    const usesModels=page.content.includes('data-scene-kind=');
    return `<!doctype html>
<html lang="en-AU"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0c3152">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}">
<link rel="canonical" href="${origin}${page.route}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${page.route}"><meta property="og:image" content="${origin}/assets/app-reference.jpg">
<link rel="icon" href="/assets/magickeys-logo.png" type="image/png"><link rel="preload" href="/assets/zing-sans-rust.otf" as="font" type="font/otf" crossorigin><link rel="stylesheet" href="/assets/site.css">
${usesModels?'<script src="/assets/scene3d.js" defer></script><script src="/assets/scene3d-mounts.js" defer></script>':''}<script src="/assets/site.js" defer></script><script src="/assets/multipage.js" defer></script>${page.content.includes('data-security-demo')?'<script src="/assets/security-demo.js" defer></script>':''}${page.content.includes('data-clear-space-demo')?'<script src="/assets/clear-space.js" defer></script>':''}<script src="/assets/camera-style.js" defer></script>
</head><body data-page="${page.route}" class="${page.route==='/'?'home-page':'detail-page'}">
${page.route==='/'?normalise(intro,page.route):''}<a class="skip-link" href="#main">Skip to content</a>${symbols}${header(page.route)}
<main id="main" tabindex="-1">${normalise(page.content,page.route)}</main>
${footer}${usesModels?normalise(posters,page.route):''}${dialogs.replace(/(?<!\/)assets\//g,'/assets/')}
</body></html>`;
  }
  for(const page of pages) {
    const path=page.route==='/'?'dist/index.html':join('dist',page.route.slice(1),'index.html');
    mkdirSync(dirname(path),{recursive:true});
    writeFileSync(path,document(page));
  }
  const notFound={route:'/404.html',title:'Page not found | MagicKeys',description:'Find your way back to the MagicKeys platform.',content:section(`<div class="not-found"><div class="eyebrow">MAGICKEYS / 404</div><h1>Let’s get you<br>to the right place.</h1><p>This page could not be found. Explore MagicKeys or contact the team for help.</p><div class="hero-actions">${button('Explore MagicKeys','/')}${button('Contact the team','/contact/','btn-dark')}</div></div>`)};
  writeFileSync('dist/404.html',document(notFound).replace('<link rel="canonical"','<meta name="robots" content="noindex"><link rel="canonical"'));
  writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page=>`  <url><loc>${origin}${page.route}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
  const azure=JSON.parse(readFileSync('dist/staticwebapp.config.json','utf8'));
  azure.routes.forEach(route=>{if(route.route==='/login'||route.route==='/login/') route.redirect='/client-login/';});
  writeFileSync('dist/staticwebapp.config.json',JSON.stringify(azure,null,2)+'\n');
  console.log('Built '+pages.length+' distinct MagicKeys pages, shared navigation, sitemap and 404.');
}

