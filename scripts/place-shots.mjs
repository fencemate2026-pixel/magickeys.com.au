// In-use pictures. The screen is the real workspace composite. The page does not operate equipment.
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const arrow = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const button = (text, href) => `<a class="btn btn-orange" href="${href}">${text} ${arrow}</a>`;
const heading = (eyebrow, title, text) => `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div><p>${text}</p></div>`;
const NOTE = 'Example only. The screen is the MagicKeys workspace. This page does not open a gate.';
const OFFICE_NOTE = 'This picture is an example. It is not the MagicKeys office. The screen is the MagicKeys workspace. This page does not open a gate.';

function frame(label, src, line, alt) {
  return { label, src, line, alt };
}

function block({ id, eyebrow, title, text, frames, note = NOTE, interest, cta = 'Discuss this site' }) {
  const first = frames[0];
  const controls = frames.length > 1
    ? `<div class="screen-controls" role="group" aria-label="Choose what is on the screen">${frames.map((item, index) => `<button type="button" data-screen-src="/assets/${item.src}" data-screen-line="${escape(item.line)}" data-screen-alt="${escape(item.alt)}"${index === 0 ? ' disabled' : ''}>${escape(item.label)}</button>`).join('')}</div>`
    : '';
  const ask = interest
    ? `<div class="life-actions">${button(cta, '/contact/?interest=' + encodeURIComponent(interest) + '#project-enquiry')}</div>`
    : '';
  return `<section class="section-shell section-space" id="${id}">${heading(eyebrow, title, text)}<figure class="screen-shot"${frames.length > 1 ? ' data-screen-shot' : ''}><img src="/assets/${first.src}" width="1400" height="933" alt="${escape(first.alt)}" loading="lazy"><figcaption><strong>${escape(first.label)}</strong><span data-screen-caption>${escape(first.line)}</span></figcaption>${controls}</figure><p class="screen-note">${note}</p>${ask}</section>`;
}

export const schoolScreen = block({
  id: 'school-in-use',
  eyebrow: 'THE WORKSPACE',
  title: 'The desk.<br><span>Then reception.</span>',
  text: 'Staff open the commissioned gate from this screen. The same login sits on the office desk, on the reception screen, and on the desk after hours for bookings.',
  frames: [
    frame('Office desk', 'use-school-office-schedules.webp', 'School office. The week’s gate schedules.', 'School office desk with MagicKeys gate schedules on the monitor'),
    frame('Reception', 'use-school-lobby-gates.webp', 'Reception. The same workspace on the wall screen.', 'School reception wall screen showing the MagicKeys workspace'),
    frame('After hours', 'use-school-office-bookings.webp', 'After hours. Bookings on the office desk.', 'School office desk with MagicKeys bookings on the monitor')
  ],
  note: 'The buttons only change the picture. A phone we have not added does nothing. You see only the gates assigned to you. A portal pulse runs only where we commissioned it. A reported position needs a sensor. Safety devices stay in charge.'
});

function commercial(interest, cta) {
  return block({
    id: 'in-use',
    eyebrow: 'ON THE DESK',
    title: 'The plan for the week.<br><span>Then the gates.</span>',
    text: 'A facilities desk. You switch the screen between the weekly plan and the gates.',
    frames: [
      frame('Schedules', 'use-commercial-schedules.webp', 'Facilities desk. The weekly access plan.', 'Facilities desk with MagicKeys schedules on the monitor'),
      frame('Gates', 'use-commercial-gates.webp', 'Facilities desk. Gates in the same workspace.', 'Facilities desk with MagicKeys gate controls on the monitor')
    ],
    interest,
    cta
  });
}

function yard(interest, cta) {
  return block({
    id: 'in-use',
    eyebrow: 'THE GATEHOUSE',
    title: 'The vehicle gates.<br><span>Then the yard cameras.</span>',
    text: 'The person in the gatehouse uses one workspace for the vehicle gates and the yard cameras.',
    frames: [
      frame('Gates', 'use-yard-gates.webp', 'Gatehouse. Boom, sliding gate and bollards.', 'Warehouse gatehouse with MagicKeys vehicle gates on the monitor'),
      frame('Cameras', 'use-yard-cameras.webp', 'Gatehouse. The yard cameras.', 'Warehouse gatehouse with MagicKeys camera views on the monitor')
    ],
    interest,
    cta
  });
}

const foyer = block({
  id: 'in-use',
  eyebrow: 'THE FOYER',
  title: 'The entrance on the wall.<br><span>Then the cameras.</span>',
  text: 'A foyer screen for the entrance, then the camera views for the same door.',
  frames: [
    frame('Gates', 'use-apartment-foyer-gates.webp', 'Foyer screen. The entrance controls.', 'Apartment foyer wall screen showing MagicKeys entrance controls'),
    frame('Cameras', 'use-apartment-foyer-cameras.webp', 'Foyer screen. Cameras for that entrance.', 'Apartment foyer wall screen showing MagicKeys camera views')
  ],
  interest: 'Anti-Tailgating Systems',
  cta: 'Discuss the foyer'
});

const cameras = block({
  id: 'in-use',
  eyebrow: 'WHERE PEOPLE WATCH',
  title: 'A camera desk.<br><span>Or the screen in the foyer.</span>',
  text: 'One person watches from the desk. Another can leave the same views up in the foyer.',
  frames: [
    frame('Camera desk', 'use-camera-desk.webp', 'Back office. Camera views on the desk.', 'Quiet office desk with MagicKeys camera views on the monitor'),
    frame('Foyer', 'use-apartment-foyer-cameras.webp', 'Foyer. The same kind of camera view, on the wall.', 'Foyer wall screen showing MagicKeys camera views')
  ],
  interest: 'CCTV & Sentinel',
  cta: 'Discuss your cameras'
});

const apartmentDesk = block({
  id: 'in-use',
  eyebrow: 'THE MANAGER’S DESK',
  title: 'Cameras first.<br><span>Then the vehicle gates.</span>',
  text: 'A building manager’s desk. Cameras, then the vehicle gates, in the same workspace.',
  frames: [
    frame('Cameras', 'use-apartment-desk-cameras.webp', 'Manager’s desk. Camera views.', 'Building manager desk with MagicKeys camera views on the monitor'),
    frame('Gates', 'use-apartment-desk-gates.webp', 'Manager’s desk. The vehicle gates.', 'Building manager desk with MagicKeys gate controls on the monitor')
  ],
  interest: 'Security & integrations',
  cta: 'Discuss the existing systems'
});

const owners = block({
  id: 'in-use',
  eyebrow: 'THE BUILDING',
  title: 'The manager’s desk.<br><span>And the foyer screen.</span>',
  text: 'The manager works from the desk. Residents and visitors see the entrance on the screen in the foyer.',
  frames: [
    frame('Manager desk', 'use-apartment-desk-gates.webp', 'Manager’s desk. The vehicle gates.', 'Building manager desk with MagicKeys gate controls on the monitor'),
    frame('Foyer', 'use-apartment-foyer-gates.webp', 'Foyer screen. The entrance.', 'Apartment foyer wall screen showing MagicKeys entrance controls')
  ],
  interest: 'Owners corporations & apartments',
  cta: 'Discuss the building'
});

const care = block({
  id: 'in-use',
  eyebrow: 'RECEPTION',
  title: 'The entrance.<br><span>And the weekly plan.</span>',
  text: 'The person on reception keeps the entrance and the weekly plan on one screen.',
  frames: [
    frame('Gates', 'use-care-gates.webp', 'Care reception. The entrance on the desk.', 'Aged care reception desk with MagicKeys entrance controls on the monitor'),
    frame('Schedules', 'use-care-schedules.webp', 'Care reception. The weekly plan.', 'Aged care reception desk with MagicKeys schedules on the monitor')
  ],
  interest: 'Aged care & retirement living',
  cta: 'Discuss a care site'
});

const solutions = block({
  id: 'in-use',
  eyebrow: 'THREE PLACES',
  title: 'School, foyer,<br><span>or the yard.</span>',
  text: 'You get the same workspace in each place. Pick the one that looks like your site.',
  frames: [
    frame('School', 'use-school-office-schedules.webp', 'A school office desk.', 'School office desk with MagicKeys gate schedules on the monitor'),
    frame('Apartments', 'use-apartment-foyer-gates.webp', 'An apartment foyer screen.', 'Apartment foyer wall screen showing MagicKeys entrance controls'),
    frame('Yard', 'use-yard-gates.webp', 'A warehouse gatehouse.', 'Warehouse gatehouse with MagicKeys vehicle gates on the monitor')
  ],
  interest: 'Site solution',
  cta: 'Discuss your site'
});

const guidance = block({
  id: 'in-use',
  eyebrow: 'EMERGENCY GUIDANCE',
  title: 'We agree the words<br><span>with the site.</span>',
  text: 'A person confirms the step. This screen does not run an evacuation.',
  frames: [
    frame('Agreed with the site', 'use-guidance-desk.webp', 'The words follow the site’s own procedure. A person confirms the step.', 'Office desk with an emergency guidance screen that a person confirms')
  ],
  interest: 'Emergency Guidance',
  cta: 'Discuss emergency guidance'
});

const review = block({
  id: 'in-use',
  eyebrow: 'IN DEVELOPMENT',
  title: 'A person looks first.',
  text: 'This is the idea we are building. It is not switched on.',
  frames: [
    frame('A person looks first', 'use-review-desk.webp', 'Someone on the team looks at the picture before it is treated as an alert.', 'Office desk with a development screen saying a person looks first')
  ],
  interest: 'AI threat & fire detection development',
  cta: 'Ask about the development work'
});

const contact = block({
  id: 'in-use',
  eyebrow: 'AN EXAMPLE DESK',
  title: 'The screen,<br><span>on a desk.</span>',
  text: 'A desk picture, so you can see the screen. It is not a photo of our office.',
  note: OFFICE_NOTE,
  frames: [
    frame('Schedules', 'use-commercial-schedules.webp', 'Example desk. The weekly plan.', 'Example office desk with MagicKeys schedules on the monitor'),
    frame('Gates', 'use-commercial-gates.webp', 'Example desk. The gates.', 'Example office desk with MagicKeys gate controls on the monitor')
  ],
  interest: 'MagicKeys',
  cta: 'Send your site details'
});

const places = {
  '/': '',
  '/solutions/schools/': '',
  '/platform/': commercial('Platform', 'Discuss the platform'),
  '/customisation/': commercial('Customisation', 'Discuss a custom app'),
  '/solutions/commercial-properties/': commercial('Commercial property & facilities', 'Discuss a commercial site'),
  '/melbourne/': commercial('Melbourne access control', 'Discuss a Melbourne site'),
  '/how-it-works/': commercial('Site assessment', 'Ask for a site assessment'),
  '/gate-control/': yard('Gate control', 'Discuss your gates'),
  '/solutions/warehouses-logistics/': yard('Warehouses, factories & logistics', 'Discuss a yard'),
  '/anti-tailgating/': foyer,
  '/cctv/': cameras,
  '/security-integrations/': apartmentDesk,
  '/solutions/owners-corporations/': owners,
  '/solutions/aged-care/': care,
  '/solutions/': solutions,
  '/emergency-guidance/': guidance,
  '/development/': review,
  '/contact/': contact
};

export function placeFor(route) {
  return places[route] || '';
}
