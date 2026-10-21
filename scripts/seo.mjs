// One preferred hostname, unique metadata and truthful, visible structured data.
export const origin='https://www.magickeys.com.au';
export const metadata={
  '/':['Access Control & CCTV Melbourne | MagicKeys','Melbourne access control, CCTV and anti-tailgating in one MagicKeys app. Connect gates, boom barriers and bollards for apartments, schools and commercial sites.','MagicKeys'],
  '/platform/':['Access Control App Melbourne | MagicKeys Platform','Explore the MagicKeys access control app for Melbourne properties: gate controls, CCTV, schedules, venue bookings and activity in one customised workspace.','Access control platform'],
  '/gate-control/':['Gate Control Melbourne | Boom Gates & Bollards | MagicKeys','Control compatible sliding gates, swing gates, boom gates and rising bollards in one MagicKeys app. Discuss your Melbourne property and installation requirements.','Gate control'],
  '/anti-tailgating/':['Anti-Tailgating Systems Melbourne | OPTEX & HYD | MagicKeys','Overhead anti-tailgating for Melbourne entrances. Explore OPTEX Accurance OV-102, HYD integration and configured door interlocks that hold entry until the zone clears.','Anti-tailgating systems'],
  '/cctv/':['CCTV Integration Melbourne | Connected Cameras | MagicKeys','Bring compatible CCTV camera views and access controls into one MagicKeys workspace. Discuss Melbourne apartment, school, aged care and commercial requirements.','CCTV integration'],
  '/emergency-guidance/':['Emergency Guidance for Melbourne Sites | MagicKeys','Discuss site-specific Emergency Guidance, staff prompts and agreed gate responses for Melbourne properties. Equipment and procedures are assessed for your site.','Emergency Guidance'],
  '/customisation/':['Custom Access Control App Melbourne | MagicKeys','Customise the MagicKeys app around your Melbourne site, entrances, operator roles and workflows. Bring compatible gates, CCTV and schedules into one workspace.','Customised access control'],
  '/security-integrations/':['Security System Integration Melbourne | MagicKeys','Connect compatible Melbourne access control, CCTV, gate controllers and overhead anti-tailgating. Equipment interfaces and feedback are assessed for each site.','Security integration'],
  '/solutions/':['Melbourne Security Solutions by Industry | MagicKeys','Explore Melbourne access control and CCTV solutions for owners corporations, schools, aged care, commercial buildings, warehouses and logistics sites.','Site solutions'],
  '/how-it-works/':['Access Control Assessment & Installation Melbourne | MagicKeys','See how RJL Commercial assesses your Melbourne site, customises MagicKeys, connects compatible access equipment and commissions the agreed installation.','Assessment and installation'],
  '/development/':['AI Threat & Fire Detection in Development | MagicKeys','Explore MagicKeys AI-assisted threat and fire detection in development, with proposed human review and acknowledgement. Availability is not yet confirmed.','AI detection in development'],
  '/client-login/':['MagicKeys Client Login | Secure Site Access','Open your existing MagicKeys client portal to sign in. Your account, credentials and site permissions are managed in your organisation’s secure workspace.','Client login'],
  '/contact/':['Contact MagicKeys Melbourne | Access Control & CCTV','Discuss Melbourne access control, CCTV, anti-tailgating and gate integration with RJL Commercial. Call 0400 101 132 or send your site requirements.','Contact MagicKeys']
};
export function applyMetadata(pages){
  return pages.map(p=>{const m=metadata[p.route];return {...p,...(m?{title:m[0],description:m[1],label:m[2]}:{}),noindex:p.route==='/client-login/'};});
}
const area={'@type':'City',name:'Melbourne',containedInPlace:{'@type':'State',name:'Victoria',containedInPlace:{'@type':'Country',name:'Australia'}}};
const services={
  '/':'Access control and CCTV integration', '/platform/':'Customised access control platform',
  '/gate-control/':'Gate, boom barrier and rising bollard integration',
  '/anti-tailgating/':'Overhead anti-tailgating system integration',
  '/cctv/':'CCTV camera integration','/emergency-guidance/':'Site-specific Emergency Guidance integration',
  '/customisation/':'Access control app customisation','/security-integrations/':'Security system integration',
  '/how-it-works/':'Access control assessment and installation','/melbourne/':'Melbourne access control and CCTV integration'
};
export function structuredData(page){
  const url=origin+page.route, org=origin+'/#organisation', web=origin+'/#website';
  const graph=[
    {'@type':'Organization','@id':org,name:'MagicKeys',url:origin+'/',logo:{'@type':'ImageObject',url:origin+'/assets/magickeys-logo.png',width:2061,height:763},telephone:'+61400101132',description:'MagicKeys by RJL Commercial: customised access control, CCTV and entrance integration for Melbourne sites.',areaServed:area,parentOrganization:{'@type':'Organization',name:'RJL Commercial',url:'https://www.rjlcommercialgroup.com/'}},
    {'@type':'WebSite','@id':web,url:origin+'/',name:'MagicKeys',inLanguage:'en-AU',publisher:{'@id':org}},
    {'@type':page.route==='/contact/'?'ContactPage':page.route==='/solutions/'?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:'en-AU',isPartOf:{'@id':web},about:{'@id':org}}
  ];
  if(page.route!=='/'&&!page.noindex&&page.route!=='/404.html'){
    const items=[{name:'MagicKeys',item:origin+'/'}];
    if(page.route.startsWith('/solutions/')) items.push({name:'Site solutions',item:origin+'/solutions/'});
    items.push({name:page.label||page.title.split(' | ')[0],item:url});
    graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))});
    graph[2].breadcrumb={'@id':url+'#breadcrumb'};
  }
  const service=services[page.route]||(page.route.startsWith('/solutions/')?`${page.label} access control and CCTV integration`:null);
  if(service&&!page.noindex){
    graph.push({'@type':'Service','@id':url+'#service',name:service,serviceType:service,url,provider:{'@id':org},areaServed:area,description:page.description});
    graph[2].mainEntity={'@id':url+'#service'};
  }
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c');
}
export function seoHead(page){
  return `<meta name="robots" content="${page.noindex?'noindex, follow':'index, follow, max-image-preview:large'}"><meta property="og:locale" content="en_AU"><meta property="og:site_name" content="MagicKeys"><meta property="og:image:width" content="1891"><meta property="og:image:height" content="895"><meta property="og:image:alt" content="MagicKeys app workspace with site access controls"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeAttribute(page.title)}"><meta name="twitter:description" content="${escapeAttribute(page.description)}"><meta name="twitter:image" content="${origin}/assets/app-reference.jpg"><script type="application/ld+json">${structuredData(page)}</script>`;
}
function escapeAttribute(s){return String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');}
