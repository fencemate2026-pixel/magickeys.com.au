// One disconnected apartment configuration, never a connection to client equipment.
export const securityCameras = [
  'Foyer 01 · inner doors','Foyer 02 · inner doors','Foyer 03 · inner doors',
  'Main reception','Lift lobby','Residential corridor','Car park entry ramp',
  'Car park exit','Basement parking','Basement lift access','Service entrance',
  'Parcel room','Pedestrian entrance','Driveway overview','Bicycle parking'
];
export function securityDemo(model) {
  return `<div class="security-demo" id="apartment-security-demo" data-security-demo>
    <div class="sd-brandbar"><img src="/assets/magickeys-logo.png" width="2061" height="763" alt="MagicKeys"><div><strong>APARTMENT SECURITY</strong><span>CCTV + entrance detection, together</span></div><span class="sd-demo-badge">INTERACTIVE DEMO</span></div>
    <div class="sd-toolbar"><div><span class="sd-led" aria-hidden="true"></span><strong>Your building. One connected view.</strong></div><div><span><b>15</b> camera views</span><span><b>3</b> foyer zones</span></div></div>
    <div class="sd-workspace"><div class="sd-vision"><div class="sd-panel-heading"><span>SELECTED CAMERA</span><span id="sd-camera-code">CAM 01</span></div>
      <div class="sd-camera-main" id="sd-camera-main" data-event="false"><div class="sd-scene" id="sd-camera-scene" role="img" aria-label="Illustrative camera view: Foyer 01, inner doors" style="--camera-x:0%;--camera-y:0%"></div><div class="sd-view-top"><span>ILLUSTRATIVE CAMERA VIEW</span><span id="sd-camera-label">Foyer 01 · inner doors</span></div><div class="sd-event-overlay" aria-hidden="true"><span class="sd-event-tag">TAILGATING EVENT · REVIEW REQUIRED</span></div><div class="sd-view-bottom"><span>MagicKeys / CCTV</span><span id="sd-view-status">Example view · no live connection</span></div></div>
      <div class="sd-camera-caption"><strong id="sd-selected-title">Foyer 01 · inner doors</strong><span>Select any camera below to change the view.</span></div>
    </div><div class="sd-detection"><div class="sd-panel-heading"><span>ANTI-TAILGATING</span><span class="sd-zone-status" id="sd-zone-status">READY</span></div>
      <div class="sd-zone-buttons" role="group" aria-label="Select a foyer detection zone">${[1,2,3].map((n,i)=>`<button type="button" id="sd-zone-${n}" data-security-zone="${i}" aria-pressed="${i===0}">Foyer 0${n}</button>`).join('')}</div>
      ${model('sd-foyer-model','foyer','foyer doors and ceiling detector',true)}
      <div class="sd-detection-summary"><div><b id="sd-authorisations">—</b><span>Authorised entries</span></div><div><b id="sd-detected">—</b><span>People detected</span></div></div>
      <div class="sd-demo-actions"><button type="button" id="sd-simulate" class="sd-simulate">Simulate tailgating</button><button type="button" id="sd-acknowledge" disabled>Mark reviewed</button><button type="button" id="sd-reset" disabled>Reset demo</button></div>
    </div></div>
    <div class="sd-camera-wall-heading"><div><span class="sd-led" aria-hidden="true"></span><strong>YOUR CAMERA WALL</strong><span>15 views · select to inspect</span></div><span>FOYERS / LIFTS / PARKING / PERIMETER</span></div>
    <div class="sd-camera-wall" role="group" aria-label="15 illustrative CCTV cameras">${securityCameras.map((name,i)=>`<button type="button" class="sd-camera-tile" id="sd-cam-${i+1}" data-security-camera="${i}" data-camera-label="${name}" aria-label="Select camera ${String(i+1).padStart(2,'0')}: ${name}" aria-pressed="${i===0}" style="--camera-x:${(i%5)*25}%;--camera-y:${Math.floor(i/5)*50}%"><span class="sd-scene" aria-hidden="true"></span><span class="sd-tile-number">CAM ${String(i+1).padStart(2,'0')}</span><span class="sd-tile-alert" aria-hidden="true">EVENT</span><span class="sd-tile-name">${name}</span></button>`).join('')}</div>
    <div class="sd-event-log" role="status" aria-live="polite" aria-atomic="true"><span class="sd-event-icon" aria-hidden="true">●</span><div><strong id="sd-event-title">Ready to explore</strong><p id="sd-event-description">Select a camera, choose a foyer, then simulate a tailgating event to see the linked view and operator alert.</p></div></div>
    <div class="sd-footnote"><span>CONFIGURATION EXAMPLE</span><p>Illustrative camera scenes and simulated detection. No live cameras, notifications or equipment are connected. Camera compatibility, detection equipment and operator workflows are assessed and agreed for each site.</p><img src="/assets/rjl-logo.png" width="900" height="210" alt="RJL Commercial"></div>
    <noscript><p class="sd-noscript">Enable JavaScript to select cameras and try the anti-tailgating demonstration.</p></noscript>
  </div>`;
}
