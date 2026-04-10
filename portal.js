const adminFileInput = document.getElementById('admin-file-input');

if (adminFileInput) {
  adminFileInput.addEventListener('change', function(event) {
    handleFileUpload(event.target.files);
    event.target.value = '';
  });
}

async function initPortal() {
  currentClientId = null;
  selectedAdminClientId = null;
  selectedActionId = null;
  clientAreaShowAll = false;

  await preloadPortalClients();

  const newClientIdField = document.getElementById('new-client-id');
  const newClientPinField = document.getElementById('new-client-pin');
  const adminDashboard = document.getElementById('admin-dashboard');

  if (newClientIdField) {
    generateClientIdField();
  }

  if (newClientPinField) {
    generateClientPinField();
  }

  if (adminDashboard) {
    renderAdminDashboard();
  }

  showPage('client-login');
}

initPortal().catch(function(err) {
  console.error('Portal init failed:', err);
});