/* Shared navigation, legacy bookmarks and a disconnected custom configuration demo. */
(() => {
  // Scale a complete landscape app as one screen, preserving its desktop proportions.
  document.querySelectorAll('[data-app-viewport]').forEach(viewport=>{
    const fit=()=>viewport.style.setProperty('--app-screen-scale',String(viewport.clientWidth/Number(viewport.dataset.appViewport)));
    fit();
    if(typeof ResizeObserver!=='undefined') new ResizeObserver(fit).observe(viewport);
    else window.addEventListener('resize',fit);
  });
  const groups=[...document.querySelectorAll('.nav-group')];
  groups.forEach(group=>group.addEventListener('toggle',()=>{
    if(group.open) groups.forEach(other=>{if(other!==group) other.open=false;});
  }));
  document.addEventListener('click',event=>{
    if(!event.target.closest('.nav-group')) groups.forEach(group=>group.open=false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape') {
      const open=groups.find(group=>group.open);
      if(open) {open.open=false;open.querySelector('summary')?.focus();}
    }
  });

  // Keep previously shared homepage section bookmarks useful after the split.
  if(window.location.pathname==='/') {
    const oldSections={
      'portal-tour':'/platform/#portal-tour',
      'platform':'/platform/#platform',
      'interactive-demo':'/gate-control/#interactive-demo',
      'solutions':'/solutions/#solutions',
      'upgrades':'/cctv/',
      'how-it-works':'/how-it-works/#how-it-works',
      'client-access':'/client-login/#client-access',
      'contact':'/contact/#contact'
    };
    const destination=oldSections[window.location.hash.slice(1)];
    if(destination) window.location.replace(destination);
  }

  document.querySelectorAll('[data-gate-target]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.gateTarget;
    const state=button.dataset.gateState;
    const stage=document.getElementById(id);
    if(!stage) return;
    stage.dataset.state=state;
    const title=stage.closest('.custom-gate-card')?.querySelector('h3')?.textContent || 'gate';
    stage.setAttribute('aria-label','Simulated '+title.toLowerCase()+', '+state);
    globalThis.MagicKeysViews?.update(id,{state,animate:true});
    const status=document.getElementById(id+'-status');
    if(status) status.textContent='Demo: '+state;
    document.querySelectorAll('[data-gate-target]').forEach(control=>{
      if(control.dataset.gateTarget===id) control.disabled=control.dataset.gateState===state;
    });
  }));

  // Pass a product interest to the contact page without storing visitor data.
  const subjects=new Set(['MagicKeys','Platform','Gate control','Anti-Tailgating Systems','CCTV & Sentinel','Emergency Guidance','Customisation','Security & integrations','Site solution','Site assessment','AI threat & fire detection development']);
  const interest=new URLSearchParams(window.location.search).get('interest');
  if(subjects.has(interest)) {
    const context=document.getElementById('enquiry-context');
    const label=document.getElementById('enquiry-subject');
    if(context&&label) {label.textContent='Discuss '+interest;context.hidden=false;}
  }
})();
