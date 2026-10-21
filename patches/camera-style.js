/* One shared example clock per page; this is simulated footage, not a live feed. */
(() => {
  const clocks=[...document.querySelectorAll('[data-cctv-clock]')];
  if(!clocks.length) return;
  const started=Date.now(), base=14*3600+32*60+18;
  function tick() {
    const seconds=(base+Math.floor((Date.now()-started)/1000))%86400;
    const time=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
    clocks.forEach(clock=>clock.textContent=time);
    setTimeout(tick,1000);
  }
  tick();
})();
