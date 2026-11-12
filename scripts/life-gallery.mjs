// Photoreal configuration examples. The pictures are not live equipment.
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const arrow = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
const button = (text, href) => `<a class="btn btn-orange" href="${href}">${text} ${arrow}</a>`;
const heading = (eyebrow, title, text) => `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div><p>${text}</p></div>`;
const section = (id, content) => `<section class="section-shell section-space" id="${id}">${content}</section>`;
const sizes = {
  'life-ground-spikes.webp': [384, 512],
  'life-school-boom.webp': [1248, 773],
  'life-staff-door.webp': [1248, 773],
  'life-double-doors.webp': [1248, 773],
  'life-acb-004.webp': [1248, 773],
  'life-sliding-gate.webp': [1248, 773],
  'life-bollards.webp': [1248, 773],
  'life-swing-gates.webp': [1248, 773]
};

function shot(file, alt, title, text, { open = '', wide = false, portrait = false, id = '' } = {}) {
  const [width, height] = sizes[file];
  const controls = open
    ? `<div class="life-controls"><button type="button" data-life-state="raised">Show raised</button><button type="button" data-life-state="closed" disabled>Show closed</button><span data-life-status>CLOSED</span></div>`
    : '';
  const cardClass = `life-card${wide ? ' life-card-wide' : ''}${portrait ? ' life-card-portrait' : ''}`;
  return `<figure class="${cardClass}"${id ? ` id="${id}"` : ''}${open ? ` data-life-shot data-life-closed="/assets/${file}" data-life-open="/assets/${open}"` : ''}><img src="/assets/${file}" width="${width}" height="${height}" alt="${escape(alt)}" loading="lazy"><figcaption><strong>${escape(title)}</strong><span>${text}</span></figcaption>${controls}</figure>`;
}

export function schoolGallery() {
  return section('school-pictures', heading('SCHOOL ENTRANCES', 'What a school<br><span>often already has.</span>', 'These pictures are examples. They are not a photo of your campus. This page does not open a gate or a door.') +
    `<div class="life-grid">${shot('life-school-boom.webp', 'Example of a school drop-off boom gate and a camera pole beside a brick building', 'Drop-off boom', 'A vehicle entrance beside a campus building, with a camera pole in the same view.')}${shot('life-staff-door.webp', 'Example of an existing single staff door with a card reader and a door closer', 'Staff door', 'A single door, with a reader and a closer. We check the controller behind that door separately.')}${shot('life-swing-gates.webp', 'Example of closed double swing gates between stone piers', 'Service swing gates', 'Closed double gates between stone piers. A school uses this sort of entrance for service vehicles.')}</div>` +
    `<p class="life-note">We assess Compass and an ACB-004 the same way. The school or the site authorises the connection. We then check the interface we can support. Neither connection is already switched on.</p>` +
    `<div class="life-actions">${button('Discuss your school', '/contact/?interest=School%20automation%20and%20Compass#project-enquiry')}</div>`);
}

export function hardwareGallery({ spikes = true } = {}) {
  const title = spikes
    ? 'Tyre spikes in the road.<br><span>Then a sliding gate and bollards.</span>'
    : 'A sliding gate.<br><span>Then rising bollards.</span>';
  const intro = spikes
    ? 'The first picture is an RJL project photo. The other two are examples. In the proposal, we name the equipment we can connect. We cannot promise that every brand will connect.'
    : 'Each picture is an example. In the proposal, we name the equipment we can connect. We cannot promise that every brand will connect.';
  const spikeCard = spikes
    ? shot('life-ground-spikes.webp', 'RJL project photo of tyre spikes lying in a steel channel in the roadway, with a separate boom arm behind them', 'Tyre spikes in the road', 'RJL project photo. The teeth sit in a steel channel in the road. The boom arm is a separate barrier behind them. This is a vehicle exit, not a school drop-off. The picture does not move the equipment.', { portrait: true, id: 'ground-spikes-example' })
    : '';
  const note = spikes
    ? 'There is one photograph, so this card has no raised and closed switch. The spikes lie in the roadway. They are not attached to the boom arm. This entrance is not a school drop-off.'
    : 'These pictures are examples of vehicle entrances. This page does not move the equipment.';
  return section('hardware-examples', heading('THE DRIVEWAY', title, intro) +
    `<div class="life-grid">${spikeCard}${shot('life-sliding-gate.webp', 'Cantilever sliding gate with vertical slats, a ground track and an amber beacon', 'Sliding gate', 'A cantilever gate, with a ground track and a beacon. We confirm position feedback on the operator that is installed.')}${shot('life-bollards.webp', 'Three raised stainless bollards with orange reflective bands', 'Rising bollards', 'Three posts, raised, across a paved entrance. We commission the lowering and the raising with the safety devices on site.')}</div>` +
    `<p class="life-note">${note}</p>` +
    `<div class="life-actions">${button('Discuss these entrances', '/contact/?interest=Gate%20control#project-enquiry')}</div>`);
}

export function doorGallery() {
  return section('existing-doors', heading('DOORS ALREADY THERE', 'Keep the doors.<br><span>We look at the controller.</span>', 'A single staff door and a double foyer door. Both are examples. We look at the controller, the readers and the locks.') +
    `<div class="life-grid life-grid-two">${shot('life-staff-door.webp', 'Example of an existing single staff door with a card reader', 'Single staff door', 'A door, reader and closer already on the building. The picture does not say which controller is behind the wall.')}${shot('life-double-doors.webp', 'Example of existing double glass foyer doors with a card reader', 'Double foyer doors', 'A two-leaf glass door. You see this in a school hall or an apartment foyer.')}</div>` +
    `<p class="life-note">We confirm the readers and the door controller on the doors you already have. We cannot promise that every door or every brand will connect.</p>` +
    `<div class="life-actions">${button('Discuss your existing doors', '/contact/?interest=Existing%20doors%20and%20access%20control#project-enquiry')}</div>`);
}

export function acbGallery() {
  return section('acb-004', heading('ACB-004, SAME CHECK', 'An access board<br><span>you may already have.</span>', 'An ACB-004 is a four-door network access controller. Public descriptions list Wiegand readers, a TCP/IP connection and relay outputs for the electric locks. The picture is an illustrative render of that kind of board. It is not a photograph of your cabinet, and it is not a wiring diagram.') +
    `<div class="life-acb"><figure class="life-card"><img src="/assets/life-acb-004.webp" width="1248" height="773" alt="Illustrative render of an open access-control cabinet with a four-relay network board" loading="lazy"><figcaption><strong>Four-door network board</strong><span>Example only. We check the readers, the locks and the network connection on the ACB-004 you have.</span></figcaption></figure><div class="life-acb-copy"><p><strong>Already using an ACB-004?</strong> We assess that board the same way we assess Compass. The site authorises the connection first. The readers, the locks and the network side have to be ones we can support. We agree what is included before we offer a connection.</p><p>It is not an automatically included or commissioned integration. This website does not connect to a controller.</p>${button('Discuss an ACB-004 assessment', '/contact/?interest=ACB-004%20access%20control%20board#project-enquiry')}</div></div>`);
}
