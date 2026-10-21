/* Disconnected hardware demonstrations. Never sends network or gate commands. */
(() => {
  const cards = [...document.querySelectorAll('[data-va-card]')];
  if (!cards.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Map();
  const pose = card => card.querySelector('[data-scene-kind]');
  function command(card, state) {
    const stage = pose(card);
    if (!stage || !['open', 'closed'].includes(state)) return;
    clearTimeout(timers.get(stage.id));
    const bollard = card.dataset.vaKind === 'bollard';
    const status = card.querySelector('.va-current');
    stage.dataset.state = state;
    stage.setAttribute('aria-label', 'Simulated ' + (bollard ? 'bollards, ' : (card.dataset.vaKind === 'sliding' ? 'sliding gate, ' : 'boom gate, ')) + (state === 'open' ? (bollard ? 'lowered' : 'open') : (bollard ? 'raised' : 'closed')));
    const poster = stage.querySelector('.model-poster');
    poster.src = '/assets/model-' + card.dataset.vaKind + '-' + state + '.svg';
    globalThis.MagicKeysViews?.update(stage.id, { kind: card.dataset.vaKind, state, animate: !reduced.matches });
    card.querySelectorAll('[data-va-state]').forEach(button => { button.disabled = button.dataset.vaState === state; });
    status.dataset.state = 'moving';
    status.querySelector('span').textContent = state === 'open' ? (bollard ? 'LOWERING' : 'OPENING') : (bollard ? 'RAISING' : 'CLOSING');
    const finish = () => {
      status.dataset.state = state;
      status.querySelector('span').textContent = state === 'open' ? (bollard ? 'LOWERED' : 'OPEN') : (bollard ? 'RAISED' : 'CLOSED');
    };
    if (reduced.matches) finish();
    else timers.set(stage.id, setTimeout(finish, bollard ? 1850 : 1250));
  }
  cards.forEach(card => {
    card.querySelectorAll('[data-va-state]').forEach(button => button.addEventListener('click', () => {
      if (button.disabled) return;
      stopAuto();
      command(card, button.dataset.vaState);
    }));
  });
  const heroCards = cards.filter(card => card.closest('#hero-preview'));
  const toggle = document.getElementById('hero-preview-toggle');
  let automatic = false;
  let cycleTimer;
  function stopAuto() {
    automatic = false;
    clearTimeout(cycleTimer);
    if (toggle) toggle.textContent = reduced.matches ? 'Preview next state' : 'Play preview';
  }
  function cycle() {
    if (!automatic || reduced.matches || document.hidden) return;
    heroCards.forEach(card => command(card, pose(card).dataset.state === 'closed' ? 'open' : 'closed'));
    cycleTimer = setTimeout(cycle, 4700);
  }
  toggle?.addEventListener('click', () => {
    if (reduced.matches) { heroCards.forEach(card => command(card, pose(card).dataset.state === 'closed' ? 'open' : 'closed')); return; }
    if (automatic) stopAuto();
    else { automatic = true; toggle.textContent = 'Pause preview'; cycle(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto(); });
  reduced.addEventListener?.('change', () => { stopAuto(); });
  if (toggle && heroCards.length) {
    if (reduced.matches) toggle.textContent = 'Preview next state';
    else { automatic = true; toggle.textContent = 'Pause preview'; cycleTimer = setTimeout(cycle, 1600); }
  }
})();
