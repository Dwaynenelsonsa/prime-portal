document.getElementById('admin-file-input').addEventListener('change', function(event) {
  handleFileUpload(event.target.files);
  event.target.value = '';
});

function initPortal() {
  currentClientId = null;
  selectedAdminClientId = null;
  selectedActionId = null;
  clientAreaShowAll = false;

  generateClientIdField();
  generateClientPinField();
  renderAdminDashboard();

  showPage('client-login');
}

initPortal();

const ADMIN_PUTER_USERNAME = 'dwaynenelsonsa';

window.setupAIAccess = async function() {
  const aiOnly = document.querySelectorAll('.ai-only');
  const aiGuest = document.querySelectorAll('.ai-guest-message');
  const aiSignIn = document.querySelectorAll('.ai-signin-button');

  let isAdminAI = false;

  try {
    const signedIn = await puter.auth.isSignedIn();

    if (signedIn) {
      const user = await puter.auth.getUser();

      const username = String(
        (user && (user.username || user.name || user.email)) || ''
      ).toLowerCase();

      if (username === ADMIN_PUTER_USERNAME.toLowerCase()) {
        isAdminAI = true;
      }
    }
  } catch (error) {
    console.error('Puter auth check failed:', error);
  }

  aiOnly.forEach(function(el) {
    el.style.display = isAdminAI ? '' : 'none';
  });

  aiGuest.forEach(function(el) {
    el.style.display = isAdminAI ? 'none' : '';
  });

  aiSignIn.forEach(function(el) {
    el.style.display = isAdminAI ? 'none' : '';
  });
};

window.signInToAI = async function() {
  try {
    await puter.auth.signIn();
    await setupAIAccess();
  } catch (error) {
    console.error('Puter sign-in failed:', error);
  }
};

window.addEventListener('load', function() {
  setupAIAccess();
});