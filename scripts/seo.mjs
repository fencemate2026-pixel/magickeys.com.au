// One preferred hostname, unique metadata and truthful, visible structured data.
export const origin='https://www.magickeys.com.au';
export const metadata={
  '/':['Gate Automation, Door Access & CCTV Melbourne | MagicKeys','Open and close connected gates, integrate compatible existing door access and CCTV, and manage school or commercial sites in one MagicKeys portal.','MagicKeys'],
  '/platform/':['All-in-One Access Control Software Melbourne | MagicKeys','MagicKeys connects gate automation, compatible existing door access, CCTV views, access schedules and site activity in one customisable Melbourne control portal.','All-in-one access control platform'],
  '/gate-control/':['Remote Gate Control & Automation Melbourne | MagicKeys','Open and close connected sliding gates, swing gates, boom gates and bollards with MagicKeys. Explore authorised remote control, access schedules and status feedback.','Gate automation'],
  '/anti-tailgating/':['Anti-Tailgating Systems Melbourne | OPTEX & HYD | MagicKeys','Overhead anti-tailgating for Melbourne entrances. Explore OPTEX Accurance OV-102, HYD integration and configured door interlocks that hold entry until the zone clears.','Anti-tailgating systems'],
  '/cctv/':['Existing CCTV & Gate Access Integration Melbourne | MagicKeys','Connect compatible existing CCTV camera views to MagicKeys alongside authorised gate and door controls. Assess school, commercial and shared-property camera systems.','Existing CCTV integration'],
  '/emergency-guidance/':['Emergency Guidance for Melbourne Sites | MagicKeys','Discuss site-specific Emergency Guidance, staff prompts and agreed gate responses for Melbourne properties. Equipment and procedures are assessed for your site.','Emergency Guidance'],
  '/customisation/':['Custom Gate & Door Access Control App Melbourne | MagicKeys','A fully customisable MagicKeys portal for compatible gate automation, existing door access, CCTV, staff permissions and schedules. Tailored to your Melbourne site.','Customised gate and door access'],
  '/security-integrations/':['Door Access, RFID & Wiegand Integration | MagicKeys','Integrate compatible existing door controllers, RFID and Wiegand readers, intercoms, CCTV and gate automation into one MagicKeys site management workspace.','Existing door access integration'],
  '/solutions/':['School & Commercial Access Automation Melbourne | MagicKeys','Explore MagicKeys all-in-one gate automation, existing door access and CCTV integration for Melbourne schools, commercial sites and owners corporations.','Site automation solutions'],
  '/how-it-works/':['Access Control Assessment & Installation Melbourne | MagicKeys','See how RJL Commercial assesses your Melbourne site, customises MagicKeys, connects compatible access equipment and commissions the agreed installation.','Assessment and installation'],
  '/development/':['AI Threat & Fire Detection in Development | MagicKeys','Explore MagicKeys AI-assisted threat and fire detection in development, with proposed human review and acknowledgement. Availability is not yet confirmed.','AI detection in development'],
  '/client-login/':['MagicKeys Client Login | Secure Site Access','Open your existing MagicKeys client portal to sign in. Your account, credentials and site permissions are managed in your organisation’s secure workspace.','Client login'],
  '/client-signup/':['MagicKeys Client Sign Up | Request access','Request a MagicKeys client account. Send your name, email, mobile, organisation and site details for the team to verify.','Client sign up'],
  '/client-signup/thanks/':['MagicKeys Client Sign Up | We will be in touch shortly','Your MagicKeys access request has been received. The team will check your details and contact you about your account.','Sign-up confirmation'],
  '/contact/':['Discuss Gate Automation & CCTV Integration | MagicKeys','Talk to MagicKeys about automating gates, integrating compatible existing door access or CCTV, and planning school and commercial control systems in Melbourne.','Contact MagicKeys']
};
export function applyMetadata(pages){
  return pages.map(p=>{const m=metadata[p.route];return {...p,...(m?{title:m[0],description:m[1],label:m[2]}:{}),noindex:p.route==='/client-login/'||p.route.startsWith('/client-signup/')};});
}
const area={'@type':'City',name:'Melbourne',containedInPlace:{'@type':'State',name:'Victoria',containedInPlace:{'@type':'Country',name:'Australia'}}};
const services={
  '/':'All-in-one gate automation, door access and CCTV integration', '/platform/':'Customised gate, door access and CCTV control software',
  '/gate-control/':'Remote gate automation for swing gates, sliding gates, boom barriers and bollards',
  '/anti-tailgating/':'Overhead anti-tailgating system integration',
  '/cctv/':'Existing CCTV camera system integration','/emergency-guidance/':'Site-specific Emergency Guidance integration',
  '/customisation/':'Access control app customisation','/security-integrations/':'Existing door access, RFID, Wiegand and intercom integration',
  '/how-it-works/':'Access control assessment and installation','/melbourne/':'Melbourne access control and CCTV integration'
};
export function structuredData(page){
  const url=origin+page.route, org=origin+'/#organisation', web=origin+'/#website';
  const graph=[
    {'@type':'Organization','@id':org,name:'MagicKeys',url:origin+'/',logo:{'@type':'ImageObject',url:origin+'/assets/magickeys-logo.png',width:2061,height:763},telephone:'+61400101132',description:'MagicKeys by RJL Commercial: gate automation, compatible existing door access and CCTV integration for Melbourne schools and commercial sites.',areaServed:area,parentOrganization:{'@type':'Organization',name:'RJL Commercial',url:'https://www.rjlcommercialgroup.com/'}},
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
