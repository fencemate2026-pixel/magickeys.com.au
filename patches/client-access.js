(() => {
  const form = document.getElementById('client-login-form');
  if (!form) return;
  const password = document.getElementById('client-password');
  const toggle = document.getElementById('client-show-password');
  const message = document.getElementById('client-login-message');
  const button = form.querySelector('[type="submit"]');
  toggle.addEventListener('click', () => {
    const showing = password.type === 'password';
    password.type = showing ? 'text' : 'password';
    toggle.textContent = showing ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(showing));
  });
  const state = new URLSearchParams(location.search).get('signin');
  const notices = {
    failed: 'We couldn’t sign you in. Check your username and password, or contact the team for help.',
    retry: 'Too many sign-in attempts. Please wait 15 minutes before trying again.',
    unavailable: 'Sign-in is temporarily unavailable. Please try again or contact the team.',
  };
  if (notices[state]) { message.textContent = notices[state]; message.hidden = false; }
  if (state) { const url = new URL(location.href); url.searchParams.delete('signin'); history.replaceState(null, '', url.pathname + url.search + url.hash); }
  form.addEventListener('submit', () => {
    // Native HTTPS POST goes directly to the secure portal. Never store credentials.
    button.disabled = true;
    button.querySelector('span').textContent = 'Opening your workspace…';
    message.hidden = true;
  });
  addEventListener('pageshow', () => {
    button.disabled = false;
    button.querySelector('span').textContent = 'Sign in to my workspace';
    password.value = '';
    password.type = 'password';
    toggle.textContent = 'Show';
    toggle.setAttribute('aria-pressed', 'false');
  });
})();
