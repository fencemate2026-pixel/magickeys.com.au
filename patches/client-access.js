(() => {
  const checkbox = document.getElementById('client-show-password');
  const password = document.getElementById('client-password');
  if (checkbox && password) checkbox.addEventListener('change', () => {
    password.type = checkbox.checked ? 'text' : 'password';
  });
  // Native HTTPS form submission goes directly to the existing client portal.
  // No credential interception, browser storage, analytics or synthetic success.
})();
