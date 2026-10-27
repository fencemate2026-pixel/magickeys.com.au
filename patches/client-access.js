(() => {
  const checkbox = document.getElementById('client-show-password');
  const password = document.getElementById('client-password');
  if (checkbox && password) checkbox.addEventListener('change', () => {
    password.type = checkbox.checked ? 'text' : 'password';
  });
  const help = document.getElementById('client-login-help');
  const helpLink = document.querySelector('a[href="#client-login-help"]');
  if (help && helpLink) helpLink.addEventListener('click', () => { help.open = true; });
  // Native HTTPS form submission goes directly to the existing client portal.
  // No credential interception, browser storage, analytics or synthetic success.
})();
