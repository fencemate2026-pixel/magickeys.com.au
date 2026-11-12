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

  // Tilt a landscape tablet toward a fine pointer. Small screens and reduced motion stay flat in CSS.
  const finePointer=window.matchMedia('(pointer: fine)').matches;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(finePointer&&!reduceMotion) {
    document.querySelectorAll('.hero-tablet').forEach(tablet=>{
      tablet.addEventListener('pointermove',event=>{
        const rect=tablet.getBoundingClientRect();
        if(!rect.width||!rect.height) return;
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        tablet.style.setProperty('--tablet-y',(x*12).toFixed(2)+'deg');
        tablet.style.setProperty('--tablet-x',(-y*8).toFixed(2)+'deg');
        tablet.classList.add('is-tilting');
      });
      tablet.addEventListener('pointerleave',()=>{
        tablet.style.setProperty('--tablet-y','0deg');
        tablet.style.setProperty('--tablet-x','0deg');
        tablet.classList.remove('is-tilting');
      });
    });
  }

  // Pass a known product interest to the contact page. Unknown text is ignored.
  const subjects=new Set(['MagicKeys','Platform','Gate control','Anti-Tailgating Systems','CCTV & Sentinel','Emergency Guidance','Customisation','Security & integrations','Site solution','Site assessment','AI threat & fire detection development','All-in-one site automation','School automation and Compass','Melbourne access control','Owners corporations & apartments','Schools & education','Aged care & retirement living','Commercial property & facilities','Warehouses, factories & logistics','Existing doors and access control','ACB-004 access control board']);
  const interest=new URLSearchParams(window.location.search).get('interest');
  const known=subjects.has(interest);
  const field=document.getElementById('enquiry-interest');
  if(field) field.value='MagicKeys project enquiry'+(known?': '+interest:'');
  if(known) {
    const context=document.getElementById('enquiry-context');
    const label=document.getElementById('enquiry-subject');
    if(context&&label) {label.textContent='Discuss '+interest;context.hidden=false;}
  }

  // Keep the property chooser label in sync when a visitor picks a site type.
  const chooser=document.getElementById('plan-your-site');
  if(chooser) {
    const mark=()=>{
      const id=(window.location.hash||'#plan-school').slice(1);
      chooser.querySelectorAll('.plan-choice').forEach(link=>{
        if(link.getAttribute('href')==='#'+id) link.setAttribute('aria-current','true');
        else if(typeof link.removeAttribute==='function') link.removeAttribute('aria-current');
      });
    };
    mark();
    window.addEventListener('hashchange',mark);
  }

  // Explain a missed enquiry field without replacing the browser's own check.
  document.querySelectorAll('form').forEach(form=>{
    if(form.getAttribute('name')!=='project-enquiry') return;
    const note=form.querySelector('[data-form-error]');
    form.addEventListener('invalid',()=>{ if(note) note.hidden=false; },true);
    form.addEventListener('input',()=>{
      if(note&&typeof form.checkValidity==='function'&&form.checkValidity()) note.hidden=true;
    });
  });

  document.querySelectorAll('[data-life-shot]').forEach(shot=>{
    const img=shot.querySelector('img');
    const status=shot.querySelector('[data-life-status]');
    if(!img) return;
    shot.querySelectorAll('[data-life-state]').forEach(button=>{
      button.addEventListener('click',()=>{
        const state=button.getAttribute('data-life-state');
        const next=state==='raised'?shot.getAttribute('data-life-open'):shot.getAttribute('data-life-closed');
        if(next) img.src=next;
        shot.querySelectorAll('[data-life-state]').forEach(other=>{
          other.disabled=other.getAttribute('data-life-state')===state;
        });
        if(status) status.textContent=state==='raised'?'RAISED':'CLOSED';
      });
    });
  });

  document.querySelectorAll('[data-screen-shot]').forEach(shot=>{
    const img=shot.querySelector('img');
    const line=shot.querySelector('[data-screen-caption]');
    const title=shot.querySelector('strong');
    if(!img) return;
    shot.querySelectorAll('[data-screen-src]').forEach(button=>{
      button.addEventListener('click',()=>{
        if(button.disabled) return;
        const src=button.getAttribute('data-screen-src');
        const alt=button.getAttribute('data-screen-alt');
        const text=button.getAttribute('data-screen-line');
        if(src) img.src=src;
        if(alt) img.alt=alt;
        if(line&&text) line.textContent=text;
        if(title) title.textContent=button.textContent.trim();
        shot.querySelectorAll('[data-screen-src]').forEach(other=>{
          other.disabled=other===button;
        });
      });
    });
  });
})();
