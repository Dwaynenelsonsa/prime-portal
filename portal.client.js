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

  function getWorkflowLabel(action) {
    const workflowStatus = String(action.workflowStatus || 'not_started').trim();

    if (workflowStatus === 'saved_to_report') return 'Saved to Report';
    if (workflowStatus === 'draft_generated' || workflowStatus === 'rca_generated') return 'Working Draft';
    return 'Not Started';
  }

  function getRcaLabel(action) {
    const hasRca =
      String(action.rcaRootCause || '').trim().length > 0 ||
      String(action.rcaProblemStatement || '').trim().length > 0;

    if (hasRca) return 'Complete';

    const workflowStatus = String(action.workflowStatus || '').trim();
    if (workflowStatus === 'rca_generated') return 'In Progress';

    return 'Not Started';
  }

  function getShortLine(text, fallback) {
  const lines = String(text || '')
    .split('\n')
    .map(function(line) { return line.trim(); })
    .filter(function(line) { return line.length > 0; });

  let result = lines.length ? lines[0] : fallback;

  if (result.length > 120) {
    result = result.substring(0, 120).trim() + '...';
  }

  return result;
}

  function getClientInputState(action) {
    const hasMissingInfo = String(action.missingInfo || '').trim().length > 0;
    const hasClientInput = String(action.clientInput || '').trim().length > 0;

    if (hasMissingInfo && !hasClientInput) {
      return 'Client input required';
    }

    return 'No client action required';
  }

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
    const status = getAreaStatusLabel(action);
    const workflowLabel = getWorkflowLabel(action);
    const rcaLabel = getRcaLabel(action);
    const findingSummary = getShortLine(
      action.findings,
      'No finding summary added yet.'
    );
    const recommendationSummary = getShortLine(
      action.recommendations,
      'No recommendation summary added yet.'
    );
    return `
      <div class="project-area-card project-area-command-card" onclick="showClientActionSummary('${action.id}')">
        <div class="project-area-command-head">
          <div class="project-area-command-title-wrap">
            <div class="project-area-title">${escapeHtml(action.title)}</div>
            <div class="project-area-desc">${escapeHtml(action.purpose)}</div>
          </div>
          <span class="${status.className}">${escapeHtml(status.text)}</span>
        </div>

        <div class="project-area-command-metrics">
          <div class="project-area-command-metric">
            <small>Progress</small>
            <strong>${progress}%</strong>
            <span>${completed}/${total} complete</span>
          </div>

          <div class="project-area-command-metric">
            <small>Workflow</small>
            <strong>${escapeHtml(workflowLabel)}</strong>
            <span>Execution state</span>
          </div>

          <div class="project-area-command-metric">
            <small>RCA</small>
            <strong>${escapeHtml(rcaLabel)}</strong>
            <span>Cause review state</span>
          </div>

          <div class="project-area-command-metric">
            <small>Concerns</small>
            <strong>${concerns}</strong>
            <span>Logged issues</span>
          </div>
        </div>

        <div class="project-area-command-progress">
          <div class="project-area-command-progress-head">
            <span>Delivery progress</span>
            <span>${completed}/${total} complete</span>
          </div>
          <div class="progress">
            <span style="width:${progress}%;"></span>
          </div>
        </div>

        <div class="project-area-command-summary-grid">
          <div class="project-area-command-summary-box">
            <small>Finding Signal</small>
            <div>${escapeHtml(findingSummary)}</div>
          </div>

          <div class="project-area-command-summary-box">
            <small>Recommendation Signal</small>
            <div>${escapeHtml(recommendationSummary)}</div>
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
  const updates = client.notes.length;
  const totalAreas = Array.isArray(client.actions) ? client.actions.length : 0;

  const savedToReport = (client.actions || []).filter(function(action) {
    return String(action.workflowStatus || '').trim() === 'saved_to_report';
  }).length;

  const rcaComplete = (client.actions || []).filter(function(action) {
    return (
      String(action.rcaRootCause || '').trim().length > 0 ||
      String(action.rcaProblemStatement || '').trim().length > 0
    );
  }).length;

  const awaitingInput = (client.actions || []).filter(function(action) {
    return (
      String(action.missingInfo || '').trim().length > 0 &&
      String(action.clientInput || '').trim().length === 0
    );
  }).length;

  const highPriorityAreas = (client.actions || []).filter(function(action) {
    return getAreaStatusLabel(action).text === 'Needs Attention';
  });

  const workflowInProgress = (client.actions || []).filter(function(action) {
    const workflowStatus = String(action.workflowStatus || 'not_started').trim();
    return workflowStatus === 'draft_generated' || workflowStatus === 'rca_generated';
  }).length;

  const completedAreas = (client.actions || []).filter(function(action) {
    return getAreaStatusLabel(action).text === 'Complete';
  }).length;

  const notStartedAreas = (client.actions || []).filter(function(action) {
    return getAreaStatusLabel(action).text === 'Not Started';
  }).length;

  document.getElementById('client-side-client-name').textContent = client.clientName;
  document.getElementById('client-side-project-name').textContent = client.projectName;
  document.getElementById('client-project-status-pill').textContent = client.status;
  document.getElementById('client-project-status-pill').className = getStatusPillClass(client.status);

  const totalCompletedItems = getClientCompletedCount(client);
  const totalTrackableItems = getClientTotalCount(client);

  document.getElementById('client-metric-progress').textContent = progress + '%';
  document.getElementById('client-metric-total-areas').textContent = totalAreas;
  document.getElementById('client-metric-saved-report').textContent = savedToReport;
  document.getElementById('client-metric-concerns').textContent = concerns;
  document.getElementById('client-metric-rca-complete').textContent = rcaComplete;
  document.getElementById('client-metric-awaiting-input').textContent = awaitingInput;
  document.getElementById('client-metric-docs').textContent = docs;
  document.getElementById('client-metric-updates').textContent = updates;
  document.getElementById('client-progress-text').textContent = totalCompletedItems + '/' + totalTrackableItems + ' items complete';
  document.getElementById('client-progress-text-top').textContent = totalCompletedItems + '/' + totalTrackableItems + ' items complete';
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

    const highPriorityList = document.getElementById('client-high-priority-list');
  const rcaProgressList = document.getElementById('client-rca-progress-list');
  const statusBreakdownList = document.getElementById('client-status-breakdown-list');

  if (highPriorityList) {
    highPriorityList.innerHTML = highPriorityAreas.length
      ? highPriorityAreas.slice(0, 5).map(function(action) {
          return '<li><strong>' + escapeHtml(action.title || '') + '</strong><br>' + escapeHtml(getAreaStatusLabel(action).text) + '</li>';
        }).join('')
      : '<li>No high priority areas flagged right now</li>';
  }

  if (rcaProgressList) {
    rcaProgressList.innerHTML =
      '<li><strong>RCA completed:</strong> ' + rcaComplete + '</li>' +
      '<li><strong>Working draft:</strong> ' + workflowInProgress + '</li>' +
      '<li><strong>Saved to report:</strong> ' + savedToReport + '</li>';
  }

  if (statusBreakdownList) {
    statusBreakdownList.innerHTML =
      '<li><strong>Complete:</strong> ' + completedAreas + '</li>' +
      '<li><strong>Needs attention:</strong> ' + highPriorityAreas.length + '</li>' +
      '<li><strong>Not started:</strong> ' + notStartedAreas + '</li>' +
      '<li><strong>Total areas:</strong> ' + totalAreas + '</li>';
  }

  const statusBars = document.getElementById('client-status-bars');
  if (statusBars) {
    const completePercent = totalAreas ? Math.round((completedAreas / totalAreas) * 100) : 0;
    const attentionPercent = totalAreas ? Math.round((highPriorityAreas.length / totalAreas) * 100) : 0;
    const notStartedPercent = totalAreas ? Math.round((notStartedAreas / totalAreas) * 100) : 0;

    statusBars.innerHTML =
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>Complete</span><span>' + completedAreas + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-complete" style="width:' + completePercent + '%;"></span></div>' +
      '</div>' +
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>Needs Attention</span><span>' + highPriorityAreas.length + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-attention" style="width:' + attentionPercent + '%;"></span></div>' +
      '</div>' +
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>Not Started</span><span>' + notStartedAreas + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-not-started" style="width:' + notStartedPercent + '%;"></span></div>' +
      '</div>';
  }

  const workflowBars = document.getElementById('client-workflow-bars');
  if (workflowBars) {
    const savedPercent = totalAreas ? Math.round((savedToReport / totalAreas) * 100) : 0;
    const rcaPercent = totalAreas ? Math.round((rcaComplete / totalAreas) * 100) : 0;
    const draftPercent = totalAreas ? Math.round((workflowInProgress / totalAreas) * 100) : 0;

    workflowBars.innerHTML =
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>Saved to Report</span><span>' + savedToReport + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-saved" style="width:' + savedPercent + '%;"></span></div>' +
      '</div>' +
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>RCA Completed</span><span>' + rcaComplete + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-rca" style="width:' + rcaPercent + '%;"></span></div>' +
      '</div>' +
      '<div class="status-bar-row">' +
        '<div class="status-bar-head"><span>Working Draft</span><span>' + workflowInProgress + ' areas</span></div>' +
        '<div class="status-bar-track"><span class="status-bar-fill status-bar-fill-draft" style="width:' + draftPercent + '%;"></span></div>' +
      '</div>';
  }

  const deliveryPosition = document.getElementById('client-delivery-position-list');
  if (deliveryPosition) {
    deliveryPosition.innerHTML =
      '<div class="plain-stat-row"><span>Live Project Status</span><strong>' + escapeHtml(client.status || 'In Progress') + '</strong></div>' +
      '<div class="plain-stat-row"><span>Current Progress</span><strong>' + progress + '%</strong></div>' +
      '<div class="plain-stat-row"><span>Trackable Items Closed</span><strong>' + totalCompletedItems + '</strong></div>' +
      '<div class="plain-stat-row"><span>Trackable Items Remaining</span><strong>' + Math.max(totalTrackableItems - totalCompletedItems, 0) + '</strong></div>';
  }

  const reportReadiness = document.getElementById('client-report-readiness-list');
  if (reportReadiness) {
    const reportReadinessText =
      savedToReport >= Math.max(1, Math.ceil(totalAreas * 0.6))
        ? 'Strong'
        : savedToReport > 0
          ? 'Building'
          : 'Early Stage';

    reportReadiness.innerHTML =
      '<div class="plain-stat-row"><span>Report Readiness</span><strong>' + reportReadinessText + '</strong></div>' +
      '<div class="plain-stat-row"><span>Areas Already In Live Report</span><strong>' + savedToReport + '</strong></div>' +
      '<div class="plain-stat-row"><span>Areas With RCA Complete</span><strong>' + rcaComplete + '</strong></div>' +
      '<div class="plain-stat-row"><span>Areas Still Requiring Attention</span><strong>' + highPriorityAreas.length + '</strong></div>';
  }

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

function showClientRcaView() {
  const client = getClientById(currentClientId);
  if (!client) return;

  const rcaList = document.getElementById('client-rca-detail-list');
  if (!rcaList) return;

  const actionsWithRca = (client.actions || []).filter(function(action) {
    return (
      String(action.rcaProblemStatement || '').trim().length > 0 ||
      String(action.rcaImmediateCause || '').trim().length > 0 ||
      String(action.rcaRootCause || '').trim().length > 0 ||
      String(action.rcaContributingFactors || '').trim().length > 0 ||
      String(action.rcaSystemicCauses || '').trim().length > 0
    );
  });

  if (!actionsWithRca.length) {
    rcaList.innerHTML = renderEmptyState('No RCA records have been completed yet.');
  } else {
    rcaList.innerHTML = actionsWithRca.map(function(action) {
      function cleanValue(text, fallback) {
        const value = String(text || '').trim();
        return value || fallback;
      }

      function renderWhy(label, value) {
        const cleaned = String(value || '').trim();
        if (!cleaned) return '';
        return `
          <div class="mini-panel">
            <h4>${escapeHtml(label)}</h4>
            <p>${escapeHtml(cleaned)}</p>
          </div>
        `;
      }

      return `
        <div class="card" style="margin-bottom: 16px;">
          <div class="section-title">
            <div>
              <h3 style="margin-bottom: 6px;">${escapeHtml(action.title || 'Problem Area')}</h3>
              <span class="muted">${escapeHtml(action.purpose || '')}</span>
            </div>
          </div>

          <div class="guide-grid">
            <div class="mini-panel">
              <h4>Problem Statement</h4>
              <p>${escapeHtml(cleanValue(action.rcaProblemStatement, 'No problem statement added yet.'))}</p>
            </div>

            <div class="mini-panel">
              <h4>Immediate Cause</h4>
              <p>${escapeHtml(cleanValue(action.rcaImmediateCause, 'No immediate cause added yet.'))}</p>
            </div>

            ${renderWhy('Why 1', action.rcaWhy1)}
            ${renderWhy('Why 2', action.rcaWhy2)}
            ${renderWhy('Why 3', action.rcaWhy3)}
            ${renderWhy('Why 4', action.rcaWhy4)}
            ${renderWhy('Why 5', action.rcaWhy5)}

            <div class="mini-panel">
              <h4>Root Cause</h4>
              <p>${escapeHtml(cleanValue(action.rcaRootCause, 'No root cause added yet.'))}</p>
            </div>

            <div class="mini-panel">
              <h4>Contributing Factors</h4>
              <p>${escapeHtml(cleanValue(action.rcaContributingFactors, 'No contributing factors added yet.'))}</p>
            </div>

            <div class="mini-panel">
              <h4>Systemic Causes</h4>
              <p>${escapeHtml(cleanValue(action.rcaSystemicCauses, 'No systemic causes added yet.'))}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('client-dashboard-main').classList.add('hide');
  document.querySelectorAll('#client-dashboard .detail-view').forEach(function(view) {
    view.classList.remove('active');
  });
  document.getElementById('client-detail-rca').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showClientReportView() {
  const client = getClientById(currentClientId);
  if (!client) return;

  const reportWrap = document.getElementById('client-report-detail-content');
  if (!reportWrap) return;

  function firstUsefulLine(text, fallback) {
    const lines = String(text || '')
      .split('\n')
      .map(function(line) {
        return line.trim();
      })
      .filter(function(line) {
        return line.length > 0;
      });

    return lines.length ? lines[0] : fallback;
  }

  const actions = (client.actions || []).map(function(action) {
    const status = getAreaStatusLabel(action).text;
    const findingText = firstUsefulLine(
      action.findings,
      'No formal finding has been added for this problem area yet.'
    );
    const recommendationText = firstUsefulLine(
      action.recommendations || action.nextImplementation || action.implementationGuidance,
      'No formal recommendation has been added for this problem area yet.'
    );
    const requiredFromClient = String(action.missingInfo || '').trim()
      ? String(action.missingInfo || '').trim()
      : 'No client information is currently outstanding for this area.';
    const rcaSummary = String(action.rcaRootCause || '').trim()
      ? String(action.rcaRootCause || '').trim()
      : 'No formal RCA root cause has been completed for this area yet.';

    return {
      title: String(action.title || 'Problem Area').trim(),
      purpose: String(action.purpose || '').trim(),
      status: status,
      findingText: findingText,
      recommendationText: recommendationText,
      requiredFromClient: requiredFromClient,
      rcaSummary: rcaSummary
    };
  });

  const completedCount = actions.filter(function(action) {
    return action.status === 'Complete';
  }).length;

  const attentionCount = actions.filter(function(action) {
    return action.status === 'Needs Attention';
  }).length;

  const executiveSummary = actions.length
    ? 'This live report shows the current project position across ' +
      actions.length +
      ' problem area' +
      (actions.length === 1 ? '' : 's') +
      '. ' +
      completedCount +
      ' area' +
      (completedCount === 1 ? ' is' : 's are') +
      ' currently complete and ' +
      attentionCount +
      ' area' +
      (attentionCount === 1 ? ' needs' : 's need') +
      ' attention.'
    : 'No live report sections are available yet.';

  reportWrap.innerHTML =
    '<div class="card" style="margin-bottom: 16px;">' +
      '<div class="section-title">' +
        '<div>' +
          '<h3 style="margin-bottom: 6px;">Project Report Overview</h3>' +
          '<span class="muted">' + escapeHtml(client.projectName || '') + '</span>' +
        '</div>' +
        '<span class="' + getStatusPillClass(client.status || 'In Progress') + '">' +
          escapeHtml(client.status || 'In Progress') +
        '</span>' +
      '</div>' +
      '<div class="metrics" style="margin-top: 18px;">' +
        '<div class="metric">' +
          '<small>Total Problem Areas</small>' +
          '<strong>' + actions.length + '</strong>' +
        '</div>' +
        '<div class="metric">' +
          '<small>Complete</small>' +
          '<strong>' + completedCount + '</strong>' +
        '</div>' +
        '<div class="metric">' +
          '<small>Needs Attention</small>' +
          '<strong>' + attentionCount + '</strong>' +
        '</div>' +
        '<div class="metric">' +
          '<small>Overall Progress</small>' +
          '<strong>' + getClientProgress(client) + '%</strong>' +
        '</div>' +
        '<div class="metric">' +
          '<small>Documents</small>' +
          '<strong>' + client.files.length + '</strong>' +
        '</div>' +
      '</div>' +
      '<div class="summary-box" style="margin-top: 18px;">' +
        '<h4>Executive Summary</h4>' +
        '<p>' + escapeHtml(executiveSummary) + '</p>' +
      '</div>' +
    '</div>' +
    (
      actions.length
        ? actions.map(function(action) {
            return (
              '<div class="card" style="margin-bottom: 16px;">' +
                '<div class="section-title">' +
                  '<div>' +
                    '<h3 style="margin-bottom: 6px;">' + escapeHtml(action.title) + '</h3>' +
                    '<span class="muted">' + escapeHtml(action.purpose) + '</span>' +
                  '</div>' +
                  '<span class="' + getStatusPillClass(action.status) + '">' + escapeHtml(action.status) + '</span>' +
                '</div>' +
                '<div class="guide-grid">' +
                  '<div class="mini-panel">' +
                    '<h4>Finding</h4>' +
                    '<p>' + escapeHtml(action.findingText) + '</p>' +
                  '</div>' +
                  '<div class="mini-panel">' +
                    '<h4>Recommendation</h4>' +
                    '<p>' + escapeHtml(action.recommendationText) + '</p>' +
                  '</div>' +
                  '<div class="mini-panel">' +
                    '<h4>Required From Client</h4>' +
                    '<p style="white-space: pre-line;">' + escapeHtml(action.requiredFromClient) + '</p>' +
                  '</div>' +
                  '<div class="mini-panel">' +
                    '<h4>RCA Summary</h4>' +
                    '<p>' + escapeHtml(action.rcaSummary) + '</p>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          }).join('')
        : renderEmptyState('No live report sections are available yet.')
    );

  document.getElementById('client-dashboard-main').classList.add('hide');
  document.querySelectorAll('#client-dashboard .detail-view').forEach(function(view) {
    view.classList.remove('active');
  });
  document.getElementById('client-detail-report').classList.add('active');
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

function clientLogin() {
  clearMessage('client-login-message');

  const clientId = document.getElementById('client-login-id').value.trim();
  const pin = document.getElementById('client-login-pin').value.trim();

  if (!/^\d{8}$/.test(clientId)) {
    showMessage('client-login-message', 'Enter a valid 8 digit client ID.', 'bad');
    return;
  }

  const client = getClientById(clientId);

  if (!client) {
    showMessage('client-login-message', 'Client not found.', 'bad');
    return;
  }

  if (pin && pin !== client.pin) {
    showMessage('client-login-message', 'Wrong PIN.', 'bad');
    return;
  }

  currentClientId = clientId;
  saveSession({ type: 'client', clientId: clientId });
  renderClientDashboard(clientId);
  showPage('client-dashboard');

  document.getElementById('client-login-id').value = '';
  document.getElementById('client-login-pin').value = '';
}

function logoutClient() {
  currentClientId = null;
  clearSession();
  backToClientDashboard();
  showPage('client-login');
}