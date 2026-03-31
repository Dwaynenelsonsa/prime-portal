function getClientActionConcernCount(action) {
  const manual = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
  const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
  return manual + auto;
}

function getClientActionConcernList(action) {
  const manual = Array.isArray(action.concernsFound) ? action.concernsFound : [];
  const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns : [];
  return manual.concat(auto);
}

function toggleClientAreaView() {
  clientAreaShowAll = !clientAreaShowAll;
  const client = getClientById(currentClientId);
  if (!client) return;
  renderClientProjectAreas(client);
}

function renderClientProjectAreas(client) {
  const actionsWrap = document.getElementById('client-dashboard-actions');
  const toggleBtn = document.getElementById('client-area-toggle-btn');
  const allActions = client.actions.slice();

  const priorityActions = allActions.filter(function(action) {
    return getActionCompletedCount(action) > 0 || getClientActionConcernCount(action) > 0 || getActionNextStepCount(action) > 0;
  });

  let actionsToShow = [];
  if (clientAreaShowAll) {
    actionsToShow = allActions;
  } else {
    actionsToShow = priorityActions.length ? priorityActions : allActions.slice(0, 6);
  }

  toggleBtn.textContent = clientAreaShowAll ? 'Show Priority Areas' : 'View All Areas';

  if (!actionsToShow.length) {
    actionsWrap.innerHTML = renderEmptyState('No project areas saved yet.');
    return;
  }

  actionsWrap.innerHTML = actionsToShow.map(function(action) {
    const progress = getActionProgress(action);
    const completed = getActionCompletedCount(action);
    const total = getActionTotalCount(action);
    const concerns = getClientActionConcernCount(action);
    const nextSteps = getActionNextStepCount(action);
    const status = getAreaStatusLabel(action);

    return `
      <div class="project-area-card" onclick="showClientActionSummary('${action.id}')">
        <div class="project-area-top">
          <div class="project-area-title">${escapeHtml(action.title)}</div>
          <span class="${status.className}">${escapeHtml(status.text)}</span>
        </div>

        <div class="project-area-desc">${escapeHtml(action.purpose)}</div>

        <div class="progress-wrap">
          <div class="progress-head">
            <span>Progress</span>
            <span>${completed}/${total} complete</span>
          </div>
          <div class="progress"><span style="width:${progress}%;"></span></div>
        </div>

        <div class="project-area-stats">
          <div class="project-area-stat">
            <small>Progress</small>
            <strong>${progress}%</strong>
          </div>
          <div class="project-area-stat">
            <small>Concerns</small>
            <strong>${concerns}</strong>
          </div>
          <div class="project-area-stat">
            <small>Next Steps</small>
            <strong>${nextSteps}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function buildClientActionSummary(action) {
  const progress = getActionProgress(action);
  const completed = getActionCompletedCount(action);
  const total = getActionTotalCount(action);
  const concerns = getClientActionConcernCount(action);
  const nextSteps = getActionNextStepCount(action);

  let summary = '';
  if (progress === 0 && concerns === 0 && nextSteps === 0) {
    summary = 'This area has not been worked through yet in any meaningful way.';
  } else if (progress === 100 && concerns === 0) {
    summary = 'This area is complete and no active concerns are currently logged.';
  } else if (concerns > 0) {
    summary = 'This area has active concerns and still needs follow through to close the gaps properly.';
  } else {
    summary = 'This area is in progress and work has started, but there is still more to be done before it is complete.';
  }

  let currentStatus = completed + '/' + total + ' checklist items complete';
  if (concerns > 0) {
    currentStatus += ', ' + concerns + ' concern' + (concerns === 1 ? '' : 's') + ' identified';
  }
  if (nextSteps > 0) {
    currentStatus += ', ' + nextSteps + ' next step' + (nextSteps === 1 ? '' : 's') + ' logged';
  }

  return {
    summary: summary,
    status: currentStatus
  };
}

function renderClientDashboard(clientId) {
  const client = getClientById(clientId);
  if (!client) {
    logoutClient();
    return;
  }

  currentClientId = client.clientId;

  const progress = getClientProgress(client);
  const docs = client.files.length;
  const concerns = getClientConcernCount(client);
  const started = getClientStartedCount(client);
  const updates = client.notes.length;

  document.getElementById('client-side-client-name').textContent = client.clientName;
  document.getElementById('client-side-project-name').textContent = client.projectName;
  document.getElementById('client-project-status-pill').textContent = client.status;
  document.getElementById('client-project-status-pill').className = getStatusPillClass(client.status);

  document.getElementById('client-metric-progress').textContent = progress + '%';
  document.getElementById('client-metric-started').textContent = started;
  document.getElementById('client-metric-concerns').textContent = concerns;
  document.getElementById('client-metric-docs').textContent = docs;
  document.getElementById('client-metric-updates').textContent = updates;
  document.getElementById('client-progress-text').textContent = getClientCompletedCount(client) + '/' + getClientTotalCount(client) + ' items complete';
  document.getElementById('client-progress-bar').style.width = progress + '%';

  renderClientProjectAreas(client);

  document.getElementById('client-dashboard-activity').innerHTML = client.notes.length
    ? client.notes.slice().reverse().map(renderNoteItem).join('')
    : renderEmptyState('No project activity saved yet.');

  document.getElementById('client-progress-detail-list').innerHTML = client.actions.map(function(action) {
    const status = getAreaStatusLabel(action);
    return renderDetailLine(
      action.title,
      action.purpose,
      status.text,
      status.className
    );
  }).join('');

  document.getElementById('client-documents-detail-list').innerHTML = client.files.length
    ? client.files.slice().reverse().map(renderFileItem).join('')
    : renderEmptyState('No documents uploaded yet.');

  document.getElementById('client-activity-detail-list').innerHTML = client.notes.length
    ? client.notes.slice().reverse().map(renderNoteItem).join('')
    : renderEmptyState('No project notes saved yet.');

  backToClientDashboard();
}

function showClientDetail(type) {
  document.getElementById('client-dashboard-main').classList.add('hide');
  document.querySelectorAll('#client-dashboard .detail-view').forEach(function(view) {
    view.classList.remove('active');
  });
  document.getElementById('client-detail-' + type).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToClientDashboard() {
  document.getElementById('client-dashboard-main').classList.remove('hide');
  document.querySelectorAll('#client-dashboard .detail-view').forEach(function(view) {
    view.classList.remove('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showClientActionSummary(actionId) {
  const client = getClientById(currentClientId);
  if (!client) return;

  const action = getActionById(client, actionId);
  if (!action) return;

  document.getElementById('client-dashboard-main').classList.add('hide');
  document.querySelectorAll('#client-dashboard .detail-view').forEach(function(view) {
    view.classList.remove('active');
  });

  const summaryData = buildClientActionSummary(action);

  document.getElementById('client-action-summary-title').textContent = action.title;
  document.getElementById('client-action-summary-text').textContent = summaryData.summary;
  document.getElementById('client-action-current-status').textContent = summaryData.status;

  const allConcerns = getClientActionConcernList(action);

  document.getElementById('client-action-concerns-list').innerHTML = allConcerns.length
    ? allConcerns.map(function(t) {
        return '<li>' + escapeHtml(t) + '</li>';
      }).join('')
    : '<li>No concerns identified yet</li>';

  const allNextSteps = getActionAllNextSteps(action);

  document.getElementById('client-action-nextsteps-list').innerHTML = allNextSteps.length
    ? allNextSteps.map(function(step) {
        return '<li><strong>' + escapeHtml(step.title || '') + '</strong><br>' + escapeHtml(step.summary || '') + '</li>';
      }).join('')
    : '<li>No next steps added yet</li>';

  const evidenceGuidance = getActionEvidenceGuidance(action);

  const evidenceList = document.getElementById('client-action-evidence-list');
  if (evidenceList) {
    evidenceList.innerHTML = evidenceGuidance.length
      ? evidenceGuidance.map(function(t) {
          return '<li>' + escapeHtml(t) + '</li>';
        }).join('')
      : '<li>No specific evidence listed yet</li>';
  }

  document.getElementById('client-action-summary').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function clientLogin() {
  clearMessage('client-login-message');

  const clientId = document.getElementById('client-login-id').value.trim();
  const pin = document.getElementById('client-login-pin').value.trim();

  if (!/^\d{8}$/.test(clientId)) {
    showMessage('client-login-message', 'Enter a valid 8 digit client ID.', 'bad');
    return;
  }

  try {
    const result = await pb.collection('clients').getFirstListItem(`client_code="${clientId}"`);

    if (!result) {
      showMessage('client-login-message', 'Client not found.', 'bad');
      return;
    }

    console.log('Entered PIN:', pin);
      console.log('PocketBase PIN:', result.pin);

      if (pin && pin !== result.pin) {
        showMessage('client-login-message', 'Wrong PIN.', 'bad');
        return;
      }

    currentClientId = clientId;
    saveSession({ type: 'client', clientId: clientId });

    renderClientDashboard(clientId);
    showPage('client-dashboard');

    document.getElementById('client-login-id').value = '';
    document.getElementById('client-login-pin').value = '';
  } catch (error) {
    console.error('PocketBase client login failed:', error);
    showMessage('client-login-message', 'Client not found.', 'bad');
  }
}

function logoutClient() {
  currentClientId = null;
  clearSession();
  backToClientDashboard();
  showPage('client-login');
}