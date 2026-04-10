const ADMIN_USER = 'admin';
const ADMIN_PASS = 'prime123';
const DELETE_CONFIRM_PIN = '6422';

let currentClientId = null;
let selectedAdminClientId = null;
let selectedActionId = null;
let clientAreaShowAll = false;

function showMessage(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = 'status-message show ' + type;
}

function getTodayLongDate() {
  const now = new Date();

  return now.toLocaleDateString('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function clearMessage(elementId) {
  const el = document.getElementById(elementId);
  el.textContent = '';
  el.className = 'status-message';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateUniqueClientId() {
  const clients = getClients();
  const existingIds = new Set(clients.map(function(client) { return client.clientId; }));
  let id = '';
  do {
    id = String(Math.floor(10000000 + Math.random() * 90000000));
  } while (existingIds.has(id));
  return id;
}

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateUniqueActionId() {
  return 'action_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
}

function generateUniqueItemId() {
  return 'item_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
}

function generateClientIdField() {
  document.getElementById('new-client-id').value = generateUniqueClientId();
}

function generateClientPinField() {
  document.getElementById('new-client-pin').value = generatePin();
}

function resetCreateClientForm() {
  document.getElementById('new-client-name').value = '';
  document.getElementById('new-project-scope').value = '';
  document.getElementById('new-client-id').value = '';
  document.getElementById('new-client-pin').value = '';
  document.getElementById('suggested-modules-list').innerHTML = '';

  document.querySelectorAll('.module-checkbox').forEach(function(box) {
    box.checked = false;
  });

  clearMessage('create-client-message');
  generateClientIdField();
  generateClientPinField();
}

function getTodayDisplayDate() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return weekday + '/' + month + '/' + year;
}

function getTodayUploadDate() {
  const now = new Date();
  return now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function getStatusPillClass(status) {
  if (status === 'Complete') return 'pill pill-good';
  if (status === 'Review') return 'pill pill-warn';
  return 'pill';
}

function getPriorityLabel(priority) {
  if (priority === 'P1') return 'P1 Immediate Risk';
  if (priority === 'P2') return 'P2 Short Term Risk';
  return 'P3 Planned Work';
}

function getPriorityPillClass(priority) {
  if (priority === 'P1') return 'pill pill-bad';
  if (priority === 'P2') return 'pill pill-warn';
  return 'pill';
}

function renderEmptyState(message) {
  return '<div class="empty-state">' + escapeHtml(message) + '</div>';
}

function renderNoteItem(note) {
  return `
    <article class="update-item">
      <div class="update-top">
        <strong>${escapeHtml(note.title)}</strong>
        <span class="muted">${escapeHtml(note.relative || 'Update')}</span>
      </div>
      <p style="margin-top: 10px;">${escapeHtml(note.body)}</p>
      <div class="date-line">${escapeHtml(note.date)}</div>
    </article>
  `;
}

function renderFileItem(file) {
  return `
    <div class="doc-item">
      <div class="doc-left">
        <div>
          <strong>${escapeHtml(file.name)}</strong>
          <div class="muted">Uploaded ${escapeHtml(file.uploaded)}</div>
        </div>
      </div>
      <span class="pill">${escapeHtml(file.type)}</span>
    </div>
  `;
}

function renderDetailLine(title, text, pillText, pillClass) {
  return `
    <div class="detail-item">
      <div class="detail-top">
        <strong>${escapeHtml(title)}</strong>
        <span class="${pillClass}">${escapeHtml(pillText)}</span>
      </div>
      <p style="margin-top:10px;">${escapeHtml(text)}</p>
    </div>
  `;
}

function splitLines(value) {
  return value.split('\n').map(function(line) {
    return line.trim();
  }).filter(function(line) {
    return line.length > 0;
  });
}

function getFileTypeLabel(fileName) {
  const parts = fileName.split('.');
  if (parts.length < 2) return 'FILE';
  return parts.pop().toUpperCase();
}