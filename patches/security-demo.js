/* Disconnected camera wall and physical foyer detection demonstration. */
(() => {
  const root=document.querySelector('[data-security-demo]');
  if(!root) return;
  const get=id=>document.getElementById(id);
  const cameras=[...root.querySelectorAll('[data-security-camera]')];
  const zones=[...root.querySelectorAll('[data-security-zone]')];
  let selected=0, zone=0, eventZone=null, reviewed=false;
  function selectCamera(index) {
    selected=index;
    const camera=cameras[index];
    cameras.forEach((tile,i)=>tile.setAttribute('aria-pressed',String(i===index)));
    const label=camera.dataset.cameraLabel;
    get('sd-camera-code').textContent='CAM '+String(index+1).padStart(2,'0');
    get('sd-recording-code').textContent='CAM '+String(index+1).padStart(2,'0');
    get('sd-camera-label').textContent=label;
    get('sd-selected-title').textContent=label;
    get('sd-camera-scene').setAttribute('aria-label',eventZone===selected?'Illustrative overhead camera view: '+label:'Illustrative camera view: '+label);
    get('sd-camera-scene').style.setProperty('--camera-x',((index%5)*25)+'%');
    get('sd-camera-scene').style.setProperty('--camera-y',(Math.floor(index/5)*50)+'%');
    get('sd-camera-main').dataset.event=String(eventZone===selected&&!reviewed);
    const overhead=eventZone===selected&&index<3;
    get('sd-camera-main').dataset.overhead=String(overhead);
    get('sd-camera-scene').dataset.overhead=String(overhead);
    get('sd-camera-scene').dataset.people=eventZone===selected?'two':'one';
    get('sd-view-status').textContent=eventZone===selected?(reviewed?'Example event · marked reviewed':'Example event · review required'):'Example view · no live connection';
  }
  function render() {
    const active=eventZone!==null;
    root.dataset.alert=String(active&&!reviewed);
    cameras.forEach((camera,i)=>camera.dataset.event=String(eventZone===i&&!reviewed));
    zones.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===zone)));
    get('sd-zone-status').textContent=active?(reviewed?'REVIEWED':'EVENT FLAGGED'):'READY';
    get('sd-authorisations').textContent=active?'1':'—';
    get('sd-detected').textContent=active?'2':'—';
    get('sd-simulate').disabled=active;
    get('sd-acknowledge').disabled=!active||reviewed;
    get('sd-reset').disabled=!active;
    const stage=get('sd-foyer-model');
    stage.dataset.state=active?'alert':'closed';
    stage.setAttribute('aria-label',active?'Overhead foyer camera: two people passing after one authorised entry':'Overhead foyer camera: one person passing through the inner doorway');
    selectCamera(selected);
  }
  cameras.forEach((camera,i)=>camera.addEventListener('click',()=>selectCamera(i)));
  zones.forEach((button,i)=>button.addEventListener('click',()=>{
    zone=i; get('sd-zone-recording-code').textContent='FOYER 0'+(i+1)+' / OVERHEAD'; eventZone=null; reviewed=false; selectCamera(i); render();
    get('sd-event-title').textContent='Foyer 0'+(zone+1)+' selected';
    get('sd-event-description').textContent='The ceiling camera looks directly down over the inner doorway. Run the demo to show a second person following one authorised entry.';
  }));
  get('sd-simulate').addEventListener('click',()=>{
    eventZone=zone; reviewed=false; selectCamera(zone); render();
    get('sd-event-title').textContent='Tailgating event · Foyer 0'+(zone+1);
    get('sd-event-description').textContent='Demo: two people detected after one authorised entry. The linked camera is highlighted for an authorised operator to review and follow the agreed site procedure.';
  });
  get('sd-acknowledge').addEventListener('click',()=>{
    reviewed=true; render();
    get('sd-event-title').textContent='Event marked reviewed · Foyer 0'+(eventZone+1);
    get('sd-event-description').textContent='Demo review recorded. Marking an event reviewed does not confirm that an entrance is secure. Reset the demonstration to try again.';
    get('sd-reset').focus();
  });
  get('sd-reset').addEventListener('click',()=>{
    eventZone=null; reviewed=false; render();
    get('sd-event-title').textContent='Demonstration reset';
    get('sd-event-description').textContent='Select any of the 15 camera views, or choose another foyer to try the detection example again.';
    get('sd-simulate').focus();
  });
  selectCamera(0);
})();
