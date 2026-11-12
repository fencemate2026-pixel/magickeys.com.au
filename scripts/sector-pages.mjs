import { schoolGallery, hardwareGallery, doorGallery, acbGallery } from './life-gallery.mjs';
import { schoolScreen } from './place-shots.mjs';
// Substantive industry pages: each describes its own operating needs and project scope.
export const sectors = [
  {
    slug:'owners-corporations', label:'Owners corporations & apartments',
    title:'Body Corporate Access Control Melbourne | MagicKeys',
    description:'Access control, CCTV and anti-tailgating for Melbourne owners corporations and apartment buildings. Connect foyer doors, boom gates and rising bollards.',
    h1:'Apartment security.<br><span>Connected access.</span>', eyebrow:'MELBOURNE / BODY CORPORATE & OWNERS CORPORATIONS',
    intro:'Bring foyer access, car park entrances and CCTV into one MagicKeys workspace. We work with owners corporation managers, building managers and committees to scope access control for Melbourne apartment buildings and mixed-use developments.',
    image:'app-cctv.svg', alt:'MagicKeys apartment workspace with simulated gates, doors, foyer cameras and overhead anti-tailgating tracking',
    heading:'From the foyer<br>to the basement.',
    lead:'A resident entrance, visitor driveway and contractor loading area need different rules. Start with how people actually move through the building, then assess the equipment and responsibilities at each point.',
    needs:[
      ['Foyer anti-tailgating','An approved credential should not become an invitation for a second person to follow. Discuss overhead human tracking, direction detection and a configured clear-space entry check. Where the agreed integration supports it, the door stays locked while a following person occupies the entry zone.'],
      ['Shared car park access','Connect compatible boom gates, sliding gates and rising bollards to nominated operator controls. Confirm resident, visitor and contractor access arrangements, operating schedules and available position feedback for each entrance.'],
      ['Building manager visibility','Bring included CCTV views and access events into the same app. Agree who can review a foyer alert, operate a driveway barrier and change schedules, so daily management has clear responsibilities.']
    ],
    planningTitle:'A proposal the committee can assess.',
    planning:'For an existing apartment building, share the number of entrances, current access system, camera and gate details, known tailgating concerns and the owners corporation’s priorities. We assess available interfaces before proposing changes. For a new development, involve the builder, access contractor and building manager early so detection areas, door behaviour and operating procedures are coordinated.',
    local:'For apartment towers and mixed-use precincts in Glen Waverley, Box Hill, Doncaster, Southbank, Docklands and across Melbourne, discuss the foyer and car park as one operating system. This approach is relevant to larger developments with shared amenities, multiple entrances and different resident, retail and contractor access needs.',
    links:[['Try the anti-tailgating entry sequence','/anti-tailgating/'],['Explore boom gates and bollards','/gate-control/']],
    questions:[
      ['Can MagicKeys work with our existing apartment access control?','We assess the installed controllers, credentials, door interfaces, cameras and available feedback. The proposal confirms what can be retained, connected or replaced; compatibility is checked for the actual equipment.'],
      ['Can a second person prevent a foyer door from opening?','A configured anti-tailgating interlock can hold an entry request while a second person is in the detection zone. The zone must clear and the agreed access conditions must be satisfied before release. Door safety, emergency egress and detection behaviour must be assessed and commissioned for the site.'],
      ['What should an owners corporation provide for a quote?','Entrance locations, equipment details, the number of buildings, operator roles and examples of the access issues you want to resolve help us prepare a useful assessment. We can then discuss installation scope and handover with your nominated manager.']
    ]
  },
  {
    slug:'schools', label:'Schools & education',
    title:'School Gate Automation | MagicKeys',
    description:'Staff open the commissioned school gate from the office desk. The scope and the monthly total are written before you commit. Thomastown, Melbourne.',
    h1:'Open the<br><span>commissioned gate.</span>', eyebrow:'MELBOURNE / SCHOOLS & EDUCATION',
    intro:'Staff open the commissioned gate from the office. Existing door access is assessed on the doors the school already has. CCTV views are MagicKeys Advanced and need their own commissioning. We write the scope and the monthly total before you commit.',
    image:'app-schedules.svg', alt:'MagicKeys weekly gate schedules on a school office screen',
    heading:'The school day.<br>Then hire. Then the gear you keep.',
    lead:'A school entrance has three jobs. The day needs the gate open at drop-off and shut when the day ends. A hirer needs one entrance for a set window. Readers and cameras already on the campus can stay where we can connect them. Compass stays the school record.',
    needs:[
      ['School day','You need the gate open at drop-off and shut when the day ends. The person you name runs the schedule from the login. Schedules are part of this plan. They are not an Advanced extra.'],
      ['Venue hire','You name the hirer, the gate or door, and the window. We end that window at the finish. Hire does not add a second gate for free.'],
      ['Gear you keep','Readers and cameras you already have can stay where we can connect them. Existing door access is assessed. A camera view stays off until we show the amount. CCTV and PTZ are MagicKeys Advanced and need their own commissioning.']
    ],
    planningTitle:'Compass stays the school record.',
    planning:'MagicKeys is the entrance workspace. Compass stays the school record. A connection needs the school and Compass, on a supported interface. It is not included because the school already uses Compass. Until that connection is written into the scope, staff keep the school record in Compass and open the commissioned gate in MagicKeys.',
    local:'An ACB-004 is assessed the same way. The school authorises the connection, and the readers, the locks and the network link have to be ones we can support. It is not an automatically included or commissioned integration.',
    links:[['Explore gate automation','/gate-control/'],['See how doors are assessed','/security-integrations/'],['Melbourne service areas','/melbourne/']],
    questions:[
      ['Can the school day use different gate schedules?','Schedules are part of this plan. They are not an Advanced extra. You give us drop-off and the end of the day, and the person you name runs that schedule from the login. Term dates and exceptions are written in the scope before we commission them.'],
      ['How does venue hire work?','You name the hirer, the gate or door, and the window. We end that window at the finish. Hire does not add a second gate for free. A second gate is shown as an amount before it is switched on.'],
      ['Can MagicKeys connect Compass?','Compass stays the school record. A connection needs the school and Compass, on a supported interface. It is not included because the school already uses Compass.'],
      ['Can an installed ACB-004 be connected?','An ACB-004 is assessed the same way as Compass. The school authorises the connection, and the readers, the locks and the network link have to be ones we can support. It is not an automatically included or commissioned integration.'],
      ['Is threat and fire detection included?','Threat and fire detection is in development. A person reviews the alert and acknowledges it before any agreed response. It does not replace the school\'s required fire systems. It does not open a gate. It is not included until we confirm it in writing.'],
      ['What happens if the plan stops?','If the plan stops, the app stops for the whole site. The base plan is one owner login, Open on the commissioned gate, and that owner\'s recent activity. An extra person, a guest key, an extra phone number, a left-open alert, a camera view or a second gate is shown as an amount before it is switched on.']
    ]
  },
  {
    slug:'aged-care', label:'Aged care & retirement living',
    title:'Aged Care Access Control Melbourne | MagicKeys',
    description:'Customised access control and CCTV for Melbourne aged care and retirement living. Plan staff entrances, visitor access, vehicle gates and operator roles.',
    h1:'Aged care access.<br><span>Considered control.</span>', eyebrow:'MELBOURNE / AGED CARE & RETIREMENT LIVING',
    intro:'Bring connected entrances, vehicle gates and included camera views into a MagicKeys workspace tailored to your facility. We discuss access control for Melbourne aged care operators, retirement villages and their facilities teams around the people who use each space.',
    image:'app-overview.svg', alt:'MagicKeys access control overview with site-specific controls and CCTV in the standard app layout',
    heading:'Access that reflects<br>the people using it.',
    lead:'Visitors, staff, service providers and residents have different needs. Define the access purpose of each entrance with your care and facilities teams before selecting equipment or setting operating rules.',
    needs:[
      ['Staff and service entrances','Discuss controlled staff doors, contractor arrivals and delivery access. Agree nominated operator roles and the access windows required for different parts of the facility, with compatible equipment assessed onsite.'],
      ['Visitor and vehicle arrival','Bring compatible boom gates, sliding gates or rising bollards into a coordinated driveway workflow. Define reception responsibilities, visitor arrival arrangements and how staff confirm the entrance is clear before operating equipment.'],
      ['Context for authorised staff','Include relevant CCTV views and recorded access activity where agreed. Consider camera positioning, privacy expectations and who may review events. Any overhead detection needs to account for carers accompanying residents and people using mobility aids.']
    ],
    planningTitle:'Define the care context before the controls.',
    planning:'An aged care project needs input from facility management and the people responsible for care, privacy and emergency procedures. Map normal movement, supported movement, visitor access and service routes. Confirm how required emergency egress and accessible passage are maintained. MagicKeys is an access management platform; it is not a clinical monitoring system, resident supervision service or guarantee that someone cannot leave a facility.',
    local:'For Melbourne aged care facilities and retirement villages, discuss the main reception, staff areas, service driveways and shared village amenities together. We assess a practical integration scope for the particular site rather than applying the same access restrictions to every entrance.',
    links:[['Explore equipment integration','/security-integrations/'],['Review vehicle access controls','/gate-control/']],
    questions:[
      ['Can anti-tailgating suit an aged care entrance?','It depends on the doorway and its purpose. Carers may need to accompany residents, so a simple one-person rule may be inappropriate. We assess the detection area, assisted passage, operating procedures and emergency arrangements before proposing any interlock.'],
      ['Can our reception and facilities teams have different roles?','The workspace can be customised around nominated operator responsibilities. The agreed scope defines which controls each role needs and how access changes are managed.'],
      ['Can MagicKeys connect to existing gates and cameras?','Compatibility depends on the installed equipment and available interfaces. Share your controller and camera details so the team can assess which connections and feedback can be delivered.']
    ]
  },
  {
    slug:'commercial-properties', label:'Commercial property & facilities',
    title:'Commercial Access Control Melbourne | MagicKeys',
    description:'Connect Melbourne commercial property access control, CCTV, boom gates and bollards in one app. Built around building managers and facilities teams.',
    h1:'Commercial access.<br><span>One working view.</span>', eyebrow:'MELBOURNE / COMMERCIAL PROPERTY & FACILITIES',
    intro:'Coordinate connected entrances, CCTV and approved access schedules in one customised MagicKeys workspace. Discuss access control for Melbourne office buildings, business parks, retail properties and mixed-use sites with RJL Commercial.',
    image:'app-vehicle-access.svg', alt:'MagicKeys commercial workspace with boom gate, sliding gate, rising bollards and linked camera views',
    heading:'Tenants, visitors<br>and service access.',
    lead:'A commercial building has more than one type of arrival. Start with the lobby, car park, loading area and staff entrances, then agree how the facilities team should manage each one.',
    needs:[
      ['Managed car parks','Bring compatible boom barriers and sliding gates into the app with agreed operating hours and nominated controls. Assess available gate feedback, visitor arrival arrangements and the relationship between entry and exit lanes.'],
      ['Lobby and staff-only areas','Discuss CCTV context and overhead anti-tailgating for suitable controlled doorways. For an interlocked entrance, define the detection zone, the conditions that hold a release request and the operator response to a flagged event.'],
      ['Clear facilities responsibilities','Tailor the workspace around building management, reception and security roles. Review access events and configured equipment information, with responsibilities for schedule changes and after-hours access agreed before handover.']
    ],
    planningTitle:'Plan the interfaces before the installation.',
    planning:'Provide the entrances to include, existing access and CCTV equipment, tenancy hours, service routes and the intended operator roles. We assess compatible interfaces and available feedback, then confirm what will be connected and commissioned. For a mixed-use property, separate residential, tenant, retail and contractor needs in the project brief so the final workflow reflects the building’s real operation.',
    local:'Discuss commercial access projects in the Melbourne CBD, Docklands, Southbank, Richmond, Cremorne, inner suburbs and metropolitan business precincts. The coverage conversation includes both existing buildings and proposed developments, with project suitability confirmed by the team.',
    links:[['Review anti-tailgating integration','/anti-tailgating/'],['See the customised platform','/customisation/']],
    questions:[
      ['Can we retain our current commercial access system?','We assess the existing controllers and available integration interfaces first. The project proposal identifies the equipment that can be connected and any changes required.'],
      ['Can one app show several entrance types?','The workspace can include compatible swing gates, sliding gates, boom barriers, rising bollards and included CCTV views. Each connection and its operating behaviour are confirmed in the project scope.'],
      ['Is the demonstration connected to a real building?','No. The website demonstrates possible layouts and simulated controls. Your installed workspace is customised and commissioned for the equipment and procedures agreed for your property.']
    ]
  },
  {
    slug:'warehouses-logistics', label:'Warehouses, factories & logistics',
    title:'Warehouse & Factory Access Control Melbourne | MagicKeys',
    description:'Melbourne warehouse and factory access control for sliding gates, boom gates, service yards and CCTV. Plan delivery access in one MagicKeys workspace.',
    h1:'Warehouse access.<br><span>Built around operations.</span>', eyebrow:'MELBOURNE / WAREHOUSES, FACTORIES & LOGISTICS',
    intro:'Coordinate connected vehicle entrances, service-yard access and included CCTV in one MagicKeys workspace. We assess access control for Melbourne warehouses, factories, distribution sites and industrial facilities around the way your operation moves.',
    image:'app-vehicle-access.svg', alt:'MagicKeys industrial workspace with simulated sliding gate, boom barrier, retractable bollards and linked camera views',
    heading:'Keep the access plan<br>close to operations.',
    lead:'Staff arrivals, delivery vehicles and after-hours contractors place different demands on an industrial entrance. Map the routes and handover points before defining the controls.',
    needs:[
      ['Sliding gates and vehicle barriers','Assess compatible sliding gate controllers, boom gates and rising bollards. Agree the available operator commands and feedback, along with the safety devices and local controls needed for the installed equipment.'],
      ['Delivery and contractor windows','Discuss schedules for regular operating hours and approved service access. Confirm who can authorise exceptions and how the facilities or yard team handles arrivals outside the normal window.'],
      ['Camera views beside the controls','Include relevant entry, exit and yard CCTV views where scoped. A nominated operator can review the entrance context within the workspace, while recorded activity helps the team understand configured access events.']
    ],
    planningTitle:'Start with vehicle routes and equipment.',
    planning:'Share a site plan, vehicle entrance details, current gate and camera equipment, operating hours and the people responsible for access decisions. Discuss pedestrian routes and the relationship between gate operation, forklifts and delivery vehicles. The access platform does not replace traffic management, physical separation or local gate safety systems; those arrangements must remain part of the site plan.',
    local:'Discuss industrial access projects in Melbourne’s northern, western and south-eastern employment areas, including Thomastown, Epping, Campbellfield, Tullamarine, Truganina, Laverton North and Dandenong South. Installation suitability and the proposed equipment connections are confirmed for each project.',
    links:[['Try sliding gate and barrier controls','/gate-control/'],['See the installation process','/how-it-works/']],
    questions:[
      ['Can we manage separate entry and exit gates?','The app can be configured for multiple compatible entrances. We confirm the controllers, feedback and operating responsibilities for each gate before commissioning the agreed setup.'],
      ['Can access schedules follow our shifts?','Discuss your shift patterns, delivery windows and approved exceptions with the team. The delivered schedules depend on the connected equipment and the agreed project requirements.'],
      ['Will the app replace onsite gate safety devices?','No. The local gate controller, safety devices and commissioned installation remain essential. A requested movement and a confirmed equipment response are treated separately.']
    ]
  }
];

export function sectorCards({includeCoverage=true}={}) {
  return `<div class="product-grid">${sectors.map(s=>`<a class="product-card" href="/solutions/${s.slug}/"><h3>${s.label}</h3><p>${s.intro.split('. ')[0]}.</p><span>Explore the requirements →</span></a>`).join('')}${includeCoverage?'<a class="product-card" href="/melbourne/"><h3>Melbourne service areas</h3><p>Discuss access control, CCTV and entrance integration across metropolitan Melbourne.</p><span>Find your area →</span></a>':''}</div>`;
}

const sectorGalleries={
  schools:()=>schoolGallery(),
  'owners-corporations':()=>doorGallery(),
  'aged-care':()=>doorGallery(),
  'commercial-properties':()=>hardwareGallery()+doorGallery(),
  'warehouses-logistics':()=>hardwareGallery()
};

function schoolLocal(s, {hero, image, section, heading, cards, rows, faq, link, button}) {
  const proof = 'More than 5,889 completed RJL jobs. 40+ years combined experience. 24/7. Thomastown, Melbourne.';
  const top = hero(
    s.eyebrow,
    s.h1,
    s.intro,
    image(s.image, s.alt, 'School office example. Schedules for the commissioned gate. This page does not open a gate.'),
    'Book a site report',
    button('Request a client login', '/client-signup/', 'btn-outline'),
    '/contact/?interest=School%20automation%20and%20Compass#project-enquiry'
  ).replace('</div></div><div class="page-hero-visual">', `</div><p>${proof}</p></div><div class="page-hero-visual">`);
  return {
    route:'/solutions/schools/', title:s.title, description:s.description, label:s.label,
    content:top +
      section(heading('THREE JOBS', s.heading, s.lead) + cards(s.needs)) +
      section(heading('THE SCHOOL RECORD', s.planningTitle, s.planning) + `<p>${s.local}</p>`) +
      section(heading('IN THE LOGIN', 'What the named person<br>can run.', 'The base plan is one owner login, Open on the commissioned gate, and that owner\'s recent activity. Anything else is shown as an amount before it is switched on.') + cards([
        ['Commissioned gates', 'We test Open and Close with you on site. The person you name uses those controls after handover. A hold is only on a gate we have commissioned for it.', 'lock'],
        ['School-day schedules', 'Schedules are part of the entrance workspace. The person you name can change them. Morning drop-off, afternoon pickup and the staff hours you set are written in the scope.', 'clock'],
        ['Venue hire', 'You set the hirer, the entrance and the times in the login. We end that window at the finish. Hire does not add a second entrance for free.', 'users'],
        ['Doors and cameras you keep', 'We assess existing door access you already have. A camera view stays off until we show the amount and commission it. CCTV views, PTZ, emergency guidance and projector broadcasts are MagicKeys Advanced.', 'grid'],
        ['Recent activity', 'The owner sees their own recent Open on the commissioned gate: which gate, what they did, and the time they did it. Clients see only the gates assigned to them.', 'log']
      ])) +
      schoolScreen +
      schoolGallery() +
      section(heading('THE WORK BEHIND THE DESK', 'RJL installs it.<br>Then the school runs the login.', 'These figures are RJL\'s. They are not a count of schools, and they are not a rating.') + cards([
        ['5,889+ completed RJL jobs', 'We have finished more than 5,889 jobs at RJL. That figure is not a count of schools.', 'check'],
        ['40+ years combined experience', 'That is combined experience at RJL. It is not the age of the app.', 'users'],
        ['24/7 call-out', 'Ring 0400 101 132 at any hour when a gate or motor is stuck. The visit is a call-out. It is not inside the access plan.', 'clock']
      ])) +
      section(heading('STRAIGHT ANSWERS', 'Before you book<br>the site report.', 'The monthly total is written before anything is switched on. The pictures on this page do not move a gate.') + faq(s.questions) + `<div class="overview-links">${link('Melbourne service areas','/melbourne/')}${link('Compare site solutions','/solutions/')}${s.links.map(([text,url])=>link(text,url)).join('')}</div>`) +
      section(heading('LATER', 'Threat and fire detection<br>is in development.', 'A person reviews the alert and acknowledges it before any agreed response. It does not replace the school\'s required fire systems. It does not open a gate. It is not included until we confirm it in writing.') + link('See what is in development','/development/')) +
      section(heading('WHAT HAPPENS NEXT', 'Three steps.<br>Then the named staff.', 'The walk is free. The scope and the monthly total come in writing. Then we commission the entrance.') + rows([
        ['01', 'Walk the campus', 'We walk the entrances with you. The walk is free. You show us the gate, the doors you want assessed, and who should run the login.'],
        ['02', 'Write the scope', 'We send the scope and the monthly total in writing. An extra person, a guest key, an extra phone number, a left-open alert, a camera view or a second gate is an amount on that page before it is switched on.'],
        ['03', 'Commission and hand over', 'We commission the entrance. The staff you name run it, as that scope lists them. If the plan stops, the app stops for the whole site.']
      ])) +
      section(`<div class="conversion-panel"><div><div class="eyebrow">YOUR NEXT STEP</div><h2>Book the site report.</h2><p>Call <a href="tel:+61400101132">0400 101 132</a> or email <a href="mailto:info@rjlcommercialgroup.com">info@rjlcommercialgroup.com</a>. <a href="/client-signup/">Request a client login</a>. The sign-up form does not ask for a password. We will be in touch shortly.</p><p>RJL Commercial. Thomastown, Melbourne. Safety devices stay in charge. A reported position needs a sensor. A portal pulse runs only where we commissioned it. Pictures on this website do not move a gate. A phone we have not added does nothing. Clients see only assigned gates. Emergency guidance does not replace the school's emergency procedures.</p></div>${button('Book a site report','/contact/?interest=School%20automation%20and%20Compass#project-enquiry')}</div>`, 'section-shell conversion-section')
  };
}

export function localPages(helpers) {
  const {hero,image,section,heading,cards,rows,faq,cta,link} = helpers;
  const pages=sectors.map(s=>s.slug==='schools' ? schoolLocal(s, helpers) : ({
    route:`/solutions/${s.slug}/`,title:s.title,description:s.description,label:s.label,
    content:hero(s.eyebrow,s.h1,s.intro,image(s.image,s.alt,'MagicKeys configuration example · Features and compatible equipment are confirmed for your installation.'),'Discuss your site')+
      section(heading('YOUR OPERATING REQUIREMENTS',s.heading,s.lead)+cards(s.needs))+
      section(heading('ASSESSMENT / INSTALLATION / HANDOVER',s.planningTitle,s.planning)+rows([
        ['01','Map the entrances','Agree which doors, gates and camera views belong in the workspace, who uses them and which parts of the current installation can be retained.'],
        ['02','Confirm the configuration','Define compatible connections, permissions, schedules and the expected response of each entrance before installation.'],
        ['03','Commission and hand over','Check the agreed behaviour onsite, review available feedback and explain the operating workflow to nominated staff.']
      ])+`<div class="overview-links">${s.links.map(([text,url])=>link(text,url)).join('')}</div>`)+
      section(heading('MELBOURNE SITE DISCUSSIONS','Local requirements.<br>Individual assessment.',s.local)+`<div class="overview-links">${link('Melbourne service areas','/melbourne/')}${link('Compare site solutions','/solutions/')}</div>`+faq(s.questions))+
      (sectorGalleries[s.slug]?sectorGalleries[s.slug]():'')+
      cta('Tell us about your entrances.','Call 0400 101 132 or share your location, equipment and priorities. The team will discuss a suitable MagicKeys assessment.',s.label)
  }));
  pages.push({route:'/melbourne/',title:'Access Control & CCTV Melbourne | MagicKeys Service Areas',label:'Melbourne service areas',description:'Discuss Melbourne access control, CCTV and anti-tailgating with MagicKeys. Solutions for apartments, owners corporations, schools, aged care and commercial sites.',content:
    hero('MELBOURNE / ACCESS CONTROL & CCTV','Melbourne access.<br><span>Connected entrances.</span>','MagicKeys by RJL Commercial brings compatible access control, CCTV and entrance management into one customised app. Discuss your Melbourne property with the team, from an apartment foyer to a school campus, care facility or industrial yard.',image('app-cctv.svg','MagicKeys workspace with gates, doors, cameras and foyer detection for Melbourne properties','Configuration example · Your layout and included functions are agreed for your site.'))+
    section(heading('BUILT AROUND YOUR PROPERTY','Find the right<br>starting point.','Choose the property type that matches your operation. Each guide explains the entrances, operator roles and integration questions to discuss with our team.')+sectorCards({includeCoverage:false}))+
    section(heading('METROPOLITAN MELBOURNE','Your location.<br>Your site requirements.','We discuss projects across Melbourne. Share your suburb and equipment details so the team can confirm site attendance, installation scope and suitability.')+cards([
      ['CBD & inner Melbourne','Melbourne CBD, Docklands, Southbank, Carlton, Richmond and Cremorne: discuss commercial lobbies, apartment foyers, shared car parks and mixed-use access.'],
      ['Eastern & north-eastern suburbs','Glen Waverley, Mount Waverley, Box Hill, Doncaster, Burwood, Balwyn, Ringwood and surrounding areas: discuss apartment buildings, schools, care facilities and commercial entrances.'],
      ['Northern suburbs','Thomastown, Epping, Bundoora, Campbellfield and Tullamarine: discuss school campuses, industrial gates, service yards and managed vehicle access.'],
      ['Western suburbs','Footscray, Sunshine, Truganina, Laverton North and Werribee: discuss warehouse entrances, vehicle barriers and growing residential or commercial precincts.'],
      ['South-eastern & bayside suburbs','Clayton, Mulgrave, Dandenong, Dandenong South, Moorabbin and surrounding areas: discuss factories, offices, education sites and retirement living.'],
      ['Elsewhere in Melbourne?','Contact the team with your location. We confirm project coverage and practical installation requirements before proposing a configuration.']
    ]))+
    section(heading('CONNECTED CAPABILITIES','One app.<br>A practical project scope.','Connect the parts your operators need, with compatible interfaces assessed for each installation.')+`<div class="overview-links">${link('Gate control, boom gates & bollards','/gate-control/')}${link('CCTV camera integration','/cctv/')}${link('Overhead anti-tailgating','/anti-tailgating/')}${link('Site assessment & installation','/how-it-works/')}</div>`+faq([
      ['Do you assess existing access control systems?','Yes. Start by sharing the site location and current controller, gate and camera details. We assess available interfaces and feedback before confirming what can be integrated.'],
      ['Can you help a Glen Waverley apartment building with tailgating?','Discuss your foyer layout, current door system and the access behaviour you need. The team can assess overhead detection and a configured entry interlock, with emergency egress and safe operation considered for the site.'],
      ['What does a MagicKeys proposal include?','The proposal confirms included app modules, compatible equipment connections, operating rules, installation and commissioning scope. Availability, timing and pricing are discussed against the individual site.']
    ]))+cta('Start with your Melbourne site.','Tell us your suburb, property type, entrances and current equipment. We will discuss the right next step for your project.','Melbourne access control')});
  return pages;
}
