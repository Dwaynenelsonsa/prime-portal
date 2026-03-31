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