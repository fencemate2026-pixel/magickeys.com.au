/* A disconnected entry-control state machine. No equipment commands or network calls. */
(() => {
  const root=document.querySelector('[data-clear-space-demo]');
  if(!root) return;
  const get=id=>document.getElementById(id);
  let state='waiting', authorised=false, timer;
  const copy={
    waiting:['AWAITING SWIPE','Someone directly behind you?','Present a valid swipe to see how the configured entry check responds when a second person is in your space.','Door closed · Waiting for authorisation'],
    blocked:['ENTRY HELD','Someone is directly behind you.','Your swipe is valid, but two people are in the entry zone. The door stays closed and the prompt lets you know someone is behind you.','Please ask the person behind to step out of your space.'],
    clear:['SPACE CLEAR','One person. Valid authorisation.','The person behind has moved out of the zone. The configured entry check can now release the door for the resident.','Space clear · Authorised entry being released'],
    open:['ENTRY ALLOWED','The door can now open.','The door opens once the entry space is clear and the resident’s authorisation remains valid. The other person must request their own access.','Door open · One authorised person entering']
  };
  function render() {
    root.dataset.state=state;
    ['ce-status','ce-title','ce-message','ce-prompt'].forEach((id,i)=>get(id).textContent=copy[state][i]);
    get('ce-people').textContent=state==='waiting'||state==='blocked'?'2':'1';
    get('ce-credential').textContent=authorised?'✓':'—';
    get('ce-door-state').textContent=state==='open'?'DOOR OPEN':'DOOR CLOSED';
    get('ce-swipe').disabled=state!=='waiting';
    get('ce-step-back').disabled=state!=='blocked';
    get('ce-open').disabled=state!=='clear';
    get('ce-camera').setAttribute('aria-label',state==='open'?'Overhead camera: one authorised resident entering through the open sliding door':state==='clear'?'Overhead camera: one resident waiting at the closed sliding door, space clear':'Overhead camera: two people waiting before the closed sliding door');
  }
  function allowEntry() {
    if(state!=='clear'||!authorised) return;
    clearTimeout(timer); state='open'; render();
  }
  get('ce-swipe').addEventListener('click',()=>{
    if(state!=='waiting') return;
    authorised=true;state='blocked';render();
  });
  get('ce-step-back').addEventListener('click',()=>{
    if(state!=='blocked'||!authorised) return;
    state='clear';render();timer=setTimeout(allowEntry,1800);
  });
  get('ce-open').addEventListener('click',allowEntry);
  get('ce-reset').addEventListener('click',()=>{
    clearTimeout(timer);authorised=false;state='waiting';render();
  });
  render();
})();
