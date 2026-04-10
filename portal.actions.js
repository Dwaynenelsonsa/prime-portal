function backToAdminProjectDetail() {
  selectedActionId = null;
  clearMessage('admin-action-message');

  const actionDetail = document.getElementById('admin-action-detail');
  if (actionDetail) {
    actionDetail.classList.remove('active');
  }

  renderAdminProjectDetail();
}

function showAdminActionDetail(actionId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, actionId);
  if (!action) return;

  ensureInvestigationFields(action);

  const actionDetail = document.getElementById('admin-action-detail');

  if (selectedActionId === actionId) {
    selectedActionId = null;
    currentWorkspaceActionId = actionId;

    if (actionDetail) {
      actionDetail.classList.remove('active');
    }

    clearMessage('admin-action-message');
    renderAdminProjectDetail();
    return;
  }

  selectedActionId = actionId;
  currentWorkspaceActionId = actionId;

  updateClient(selectedAdminClientId, function(currentClient) {
    const currentAction = getActionById(currentClient, actionId);
    if (!currentAction) return;
    ensureInvestigationFields(currentAction);
  });

  clearMessage('admin-action-message');
  renderAdminProjectDetail();

  const refreshedClient = getClientById(selectedAdminClientId);
  const refreshedAction = refreshedClient ? getActionById(refreshedClient, actionId) : null;
  if (!refreshedAction) return;

  document.getElementById('admin-action-title').textContent = refreshedAction.title || '';
  document.getElementById('admin-action-purpose-text').textContent = refreshedAction.purpose || '';

  if (document.getElementById('admin-action-known-info')) {
    document.getElementById('admin-action-known-info').value = refreshedAction.knownInfo || '';
  }

  if (document.getElementById('admin-action-missing-info')) {
    document.getElementById('admin-action-missing-info').value = refreshedAction.missingInfo || '';
  }

  if (document.getElementById('admin-action-followup-questions')) {
    document.getElementById('admin-action-followup-questions').value = refreshedAction.followUpQuestions || '';
  }

  if (document.getElementById('admin-action-client-input')) {
    document.getElementById('admin-action-client-input').value = refreshedAction.clientInput || '';
  }

  document.getElementById('admin-rca-problem-statement').value = refreshedAction.rcaProblemStatement || '';
  document.getElementById('admin-rca-immediate-cause').value = refreshedAction.rcaImmediateCause || '';
  document.getElementById('admin-rca-why1').value = refreshedAction.rcaWhy1 || '';
  document.getElementById('admin-rca-why2').value = refreshedAction.rcaWhy2 || '';
  document.getElementById('admin-rca-why3').value = refreshedAction.rcaWhy3 || '';
  document.getElementById('admin-rca-why4').value = refreshedAction.rcaWhy4 || '';
  document.getElementById('admin-rca-why5').value = refreshedAction.rcaWhy5 || '';
  document.getElementById('admin-rca-root-cause').value = refreshedAction.rcaRootCause || '';
  document.getElementById('admin-rca-contributing-factors').value = refreshedAction.rcaContributingFactors || '';
  document.getElementById('admin-rca-systemic-causes').value = refreshedAction.rcaSystemicCauses || '';

  document.getElementById('admin-action-findings').value = refreshedAction.findings || '';
  document.getElementById('admin-action-recommendations').value = refreshedAction.recommendations || '';
  document.getElementById('admin-action-next-implementation').value = refreshedAction.nextImplementation || '';
  document.getElementById('admin-action-implementation-guidance').value = refreshedAction.implementationGuidance || '';

  if (actionDetail) {
    actionDetail.classList.add('active');
  }

  renderAdminActionDetail();
}

async function generateWebBackedNextStep(client, action, reviewPoint) {
  const status = reviewPoint.status || 'unanswered';

  try {
    const parsed = await primeForgeGenerateNextStep(client, action, reviewPoint);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Prime Forge did not return a valid next step object');
    }

    return {
      title: String(parsed.title || 'Next step').trim(),
      summary: String(parsed.summary || reviewPoint.text).trim(),
      howTo: Array.isArray(parsed.howTo) ? parsed.howTo.map(String) : [],
      whatToCollect: Array.isArray(parsed.whatToCollect) ? parsed.whatToCollect.map(String) : [],
      goodLooksLike: String(parsed.goodLooksLike || '').trim()
    };
  } catch (error) {
    console.error('PRIME FORGE NEXT STEP ERROR:', error);

    return {
      title: status === 'no' ? 'Fix this gap' : 'Confirm this point',
      summary: reviewPoint.text,
      howTo: [
        'Review the exact point that failed',
        'Confirm who owns this area',
        'Collect the missing proof or control',
        'Put the fix in place and check it is now working'
      ],
      whatToCollect: [
        'Current record or document for this point',
        'Owner confirmation',
        'Recent site example'
      ],
      goodLooksLike: 'This point is controlled, owned, and backed by current evidence.'
    };
  }
}

function syncAutoConcerns(action) {
  const autoConcerns = [];

  function toFindingText(text, status, notes) {
    let finding = text;

    if (status === 'no') {
      finding = 'Gap found. ' + text;
    }

    if (status === 'not_sure') {
      finding = 'Needs confirmation. ' + text;
    }

    if (notes) {
      finding += ' | Notes: ' + notes;
    }

    return finding;
  }

  (action.reviewPoints || []).forEach(function(it) {
    const responseType = it.responseType || 'check';
    const notes = String(it.notes || '').trim();

    if (responseType === 'data_capture') {
      return;
    }

    if (it.status === 'no' || it.status === 'not_sure') {
      autoConcerns.push(toFindingText(it.text, it.status, notes));
    }
  });

  action.autoConcerns = autoConcerns;

  if (!Array.isArray(action.autoNextSteps)) {
    action.autoNextSteps = [];
  }
}

function renderIssuesNextStepsList(action, targetId, emptyText) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const manualConcerns = Array.isArray(action.concernsFound)
    ? action.concernsFound.map(function(text, index) {
        return {
          text: text,
          index: index,
          type: 'manual'
        };
      })
    : [];

  const autoConcerns = Array.isArray(action.autoConcerns)
    ? action.autoConcerns.map(function(text, index) {
        return {
          text: text,
          index: index,
          type: 'auto'
        };
      })
    : [];

  const manualNextSteps = Array.isArray(action.nextSteps)
    ? action.nextSteps.map(function(text, index) {
        return {
          text: text,
          index: index,
          type: 'manual'
        };
      })
    : [];

  const autoNextSteps = Array.isArray(action.autoNextSteps)
    ? action.autoNextSteps.map(function(step, index) {
        return {
          step: step || {},
          index: index,
          type: 'auto'
        };
      })
    : [];

  const totalItems = manualConcerns.length + autoConcerns.length + manualNextSteps.length + autoNextSteps.length;

  if (!totalItems) {
    target.innerHTML = '<li class="concern-item empty-item">' + escapeHtml(emptyText) + '</li>';
    return;
  }

  const autoNextStepsByReviewPoint = {};
  autoNextSteps.forEach(function(item) {
    const key = item.step && item.step.reviewPointId ? item.step.reviewPointId : 'auto-' + item.index;
    autoNextStepsByReviewPoint[key] = item;
  });

  const reviewPairs = Array.isArray(action.reviewPoints)
    ? action.reviewPoints
        .filter(function(point) {
          return point.status === 'no' || point.status === 'not_sure';
        })
        .map(function(point) {
          const concernText =
            point.status === 'no'
              ? 'Gap found. ' + point.text
              : 'Needs confirmation. ' + point.text;

          const stepItem = autoNextStepsByReviewPoint[point.id] || null;

          return {
            concernText: concernText + (point.notes ? ' | Notes: ' + point.notes : ''),
            stepItem: stepItem,
            reviewPointId: point.id
          };
        })
    : [];

  const manualConcernHtml = manualConcerns.map(function(item) {
    return `
      <li class="fix-card">
        <div class="fix-detail" style="display:block;">
          <div class="fix-detail-block">
            <strong>Concern</strong>
            <p>${escapeHtml(item.text)}</p>
          </div>
          <div class="fix-detail-block">
            <button class="btn btn-small btn-danger" type="button" onclick="removeListItem('concerns', ${item.index})">Remove</button>
          </div>
        </div>
      </li>
    `;
  }).join('');

  const pairedHtml = reviewPairs.map(function(pair, index) {
    const step = pair.stepItem ? pair.stepItem.step : null;
    const key = 'paired-' + index;

    return `
      <li class="fix-card">
        <button class="fix-toggle" type="button" onclick="window.toggleNextStepDetail('${key}')">
          <span>${escapeHtml(step && step.title ? step.title : 'Issue and next step')}</span>
          <span class="fix-toggle-icon">+</span>
        </button>
        <div class="fix-detail" id="nextstep-detail-${key}">
          <div class="fix-detail-block">
            <strong>Concern</strong>
            <p>${escapeHtml(pair.concernText)}</p>
          </div>

          ${
            step ? `
              ${step.summary ? `
                <div class="fix-detail-block">
                  <strong>What this means</strong>
                  <p>${escapeHtml(step.summary)}</p>
                </div>
              ` : ''}

              ${Array.isArray(step.howTo) && step.howTo.length ? `
                <div class="fix-detail-block">
                  <strong>How to do it</strong>
                  <ol>
                    ${step.howTo.map(function(row) {
                      return '<li>' + escapeHtml(row) + '</li>';
                    }).join('')}
                  </ol>
                </div>
              ` : ''}

              ${Array.isArray(step.whatToCollect) && step.whatToCollect.length ? `
                <div class="fix-detail-block">
                  <strong>What to collect</strong>
                  <ul>
                    ${step.whatToCollect.map(function(row) {
                      return '<li>' + escapeHtml(row) + '</li>';
                    }).join('')}
                  </ul>
                </div>
              ` : ''}

              ${step.goodLooksLike ? `
                <div class="fix-detail-block">
                  <strong>What good looks like</strong>
                  <p>${escapeHtml(step.goodLooksLike)}</p>
                </div>
              ` : ''}
            `
            : `
              <div class="fix-detail-block">
                <strong>Next step</strong>
                <p>No linked next step yet.</p>
              </div>
            `
          }
        </div>
      </li>
    `;
  }).join('');

  const manualNextStepHtml = manualNextSteps.map(function(item) {
    const key = 'manual-' + item.index;

    return `
      <li class="fix-card">
        <button class="fix-toggle" type="button" onclick="window.toggleNextStepDetail('${key}')">
          <span>${escapeHtml(item.text)}</span>
          <span class="fix-toggle-icon">+</span>
        </button>
        <div class="fix-detail" id="nextstep-detail-${key}">
          <div class="fix-detail-block">
            <strong>Manual next step</strong>
            <p>${escapeHtml(item.text)}</p>
          </div>
          <div class="fix-detail-block">
            <button class="btn btn-small btn-danger" type="button" onclick="removeListItem('nextSteps', ${item.index})">Remove</button>
          </div>
        </div>
      </li>
    `;
  }).join('');

  target.innerHTML = manualConcernHtml + pairedHtml + manualNextStepHtml;
}

function getConcernCount(action) {
  const manual = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
  const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
  return manual + auto;
}

window.toggleFixDetail = function(index) {
  const detail = document.getElementById('fix-detail-' + index);
  if (!detail) return;

  const toggle = detail.previousElementSibling;
  const icon = toggle ? toggle.querySelector('.fix-toggle-icon') : null;
  const isOpen = detail.style.display === 'block';

  detail.style.display = isOpen ? 'none' : 'block';

  if (icon) {
    icon.textContent = isOpen ? '+' : '-';
  }
};

window.toggleNextStepDetail = function(key) {
  const detail = document.getElementById('nextstep-detail-' + key);
  if (!detail) return;

  const toggle = detail.previousElementSibling;
  const icon = toggle ? toggle.querySelector('.fix-toggle-icon') : null;
  const isOpen = detail.style.display === 'block';

  detail.style.display = isOpen ? 'none' : 'block';

  if (icon) {
    icon.textContent = isOpen ? '+' : '-';
  }
};

function renderAdminActionDetail() {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, selectedActionId);
  if (!action) return;

  ensureInvestigationFields(action);
  syncAutoConcerns(action);

  const totalNextSteps =
    (Array.isArray(action.nextSteps) ? action.nextSteps.length : 0) +
    (Array.isArray(action.autoNextSteps) ? action.autoNextSteps.length : 0);

  document.getElementById('admin-action-progress').textContent = getActionProgress(action) + '%';
  document.getElementById('admin-action-completed-count').textContent = getActionCompletedCount(action);
  document.getElementById('admin-action-open-count').textContent = getActionOpenCount(action);
  document.getElementById('admin-action-concerns-count').textContent = getConcernCount(action);
  document.getElementById('admin-action-nextsteps-count').textContent = totalNextSteps;

    renderCheckboxSection('reviewPoints', 'admin-action-checks-box', 'admin-checks-progress');
  renderDocumentStatusSection('evidence', 'admin-action-evidence-box');
  renderIssuesNextStepsList(action, 'admin-action-issues-nextsteps-list', 'No concerns or next steps added yet');
  renderSecondVisitQuestionItems(action);

  const knownInfo = document.getElementById('admin-action-known-info');
  const missingInfo = document.getElementById('admin-action-missing-info');
  const followUpQuestions = document.getElementById('admin-action-followup-questions');
  const clientInput = document.getElementById('admin-action-client-input');

  const rcaProblemStatement = document.getElementById('admin-rca-problem-statement');
  const rcaImmediateCause = document.getElementById('admin-rca-immediate-cause');
  const rcaWhy1 = document.getElementById('admin-rca-why1');
  const rcaWhy2 = document.getElementById('admin-rca-why2');
  const rcaWhy3 = document.getElementById('admin-rca-why3');
  const rcaWhy4 = document.getElementById('admin-rca-why4');
  const rcaWhy5 = document.getElementById('admin-rca-why5');
  const rcaRootCause = document.getElementById('admin-rca-root-cause');
  const rcaContributingFactors = document.getElementById('admin-rca-contributing-factors');
  const rcaSystemicCauses = document.getElementById('admin-rca-systemic-causes');

  const findings = document.getElementById('admin-action-findings');
  const recommendations = document.getElementById('admin-action-recommendations');
  const nextImplementation = document.getElementById('admin-action-next-implementation');
  const implementationGuidance = document.getElementById('admin-action-implementation-guidance');

  if (knownInfo && knownInfo !== document.activeElement) knownInfo.value = action.knownInfo || '';
  if (missingInfo && missingInfo !== document.activeElement) missingInfo.value = action.missingInfo || '';
  if (followUpQuestions && followUpQuestions !== document.activeElement) followUpQuestions.value = action.followUpQuestions || '';
  if (clientInput && clientInput !== document.activeElement) clientInput.value = action.clientInput || '';

  if (rcaProblemStatement && rcaProblemStatement !== document.activeElement) rcaProblemStatement.value = action.rcaProblemStatement || '';
  if (rcaImmediateCause && rcaImmediateCause !== document.activeElement) rcaImmediateCause.value = action.rcaImmediateCause || '';
  if (rcaWhy1 && rcaWhy1 !== document.activeElement) rcaWhy1.value = action.rcaWhy1 || '';
  if (rcaWhy2 && rcaWhy2 !== document.activeElement) rcaWhy2.value = action.rcaWhy2 || '';
  if (rcaWhy3 && rcaWhy3 !== document.activeElement) rcaWhy3.value = action.rcaWhy3 || '';
  if (rcaWhy4 && rcaWhy4 !== document.activeElement) rcaWhy4.value = action.rcaWhy4 || '';
  if (rcaWhy5 && rcaWhy5 !== document.activeElement) rcaWhy5.value = action.rcaWhy5 || '';
  if (rcaRootCause && rcaRootCause !== document.activeElement) rcaRootCause.value = action.rcaRootCause || '';
  if (rcaContributingFactors && rcaContributingFactors !== document.activeElement) rcaContributingFactors.value = action.rcaContributingFactors || '';
  if (rcaSystemicCauses && rcaSystemicCauses !== document.activeElement) rcaSystemicCauses.value = action.rcaSystemicCauses || '';

  if (findings && findings !== document.activeElement) findings.value = action.findings || '';
  if (recommendations && recommendations !== document.activeElement) recommendations.value = action.recommendations || '';
  if (nextImplementation && nextImplementation !== document.activeElement) nextImplementation.value = action.nextImplementation || '';
  if (implementationGuidance && implementationGuidance !== document.activeElement) implementationGuidance.value = action.implementationGuidance || '';
}

function ensureInvestigationFields(action) {
  if (!action) return;

  action.priority = action.priority || 'P3';

  action.knownInfo = action.knownInfo || '';
  action.missingInfo = action.missingInfo || '';
  action.followUpQuestions = action.followUpQuestions || '';
  action.clientInput = action.clientInput || '';

  action.rcaProblemStatement = action.rcaProblemStatement || '';
  action.rcaImmediateCause = action.rcaImmediateCause || '';
  action.rcaWhy1 = action.rcaWhy1 || '';
  action.rcaWhy2 = action.rcaWhy2 || '';
  action.rcaWhy3 = action.rcaWhy3 || '';
  action.rcaWhy4 = action.rcaWhy4 || '';
  action.rcaWhy5 = action.rcaWhy5 || '';
  action.rcaRootCause = action.rcaRootCause || '';
  action.rcaContributingFactors = action.rcaContributingFactors || '';
  action.rcaSystemicCauses = action.rcaSystemicCauses || '';

  action.findings = action.findings || '';
  action.recommendations = action.recommendations || '';
  action.nextImplementation = action.nextImplementation || '';
  action.implementationGuidance = action.implementationGuidance || '';
}

function renderCheckboxSection(sectionName, containerId, progressId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, selectedActionId);
  if (!action) return;

    ensureInvestigationFields(action);
  syncAutoConcerns(action);

  const items = action[sectionName] || [];
  const container = document.getElementById(containerId);
  const progress = document.getElementById(progressId);

  if (!items.length) {
    container.innerHTML = renderEmptyState('No items yet.');
    if (progress) {
      progress.textContent = '0/0 answered';
    }
    return;
  }

  container.innerHTML = items.map(function(it) {
    const responseType = it.responseType || 'check';
    const status = it.status || 'unanswered';
    const answer = String(it.answer || '').trim();
    const notesVisible = responseType === 'check' ? status !== 'unanswered' : true;
    const categoryLabel = it.category ? '<span class="response-category-badge">' + escapeHtml(it.category) + '</span>' : '';
    const displayStatus = responseType === 'data_capture'
      ? (answer ? 'Answered' : 'Needs input')
      : getResponseStatusLabel(status);

    return `
      <div class="response-item response-${responseType === 'data_capture' ? (answer ? 'yes' : 'unanswered') : status}">
        <button class="response-summary" type="button" onclick="toggleResponseItem('${sectionName}','${it.id}')">
          <div class="response-summary-text-wrap">
            ${categoryLabel}
            <span class="response-summary-text">${escapeHtml(it.text)}</span>
          </div>
          <span class="response-summary-right">
            <span class="response-status-badge response-status-${responseType === 'data_capture' ? (answer ? 'yes' : 'unanswered') : status}">${escapeHtml(displayStatus)}</span>
            <span class="response-toggle-icon">+</span>
          </span>
        </button>

        <div class="response-detail" id="response-detail-${sectionName}-${it.id}" style="display:none;">
          ${
            responseType === 'data_capture'
              ? `
                <div class="response-actions">
                  ${it.source === 'custom' ? `<button class="btn btn-small btn-danger" type="button" onclick="removeSectionItem('${sectionName}','${it.id}')">Remove</button>` : ''}
                </div>

                <textarea
                  class="response-notes"
                  placeholder="Enter the answer here"
                  oninput="updateSectionAnswer('${sectionName}','${it.id}',this.value)"
                >${escapeHtml(it.answer || '')}</textarea>

                <textarea
                  class="response-notes"
                  placeholder="Add supporting notes if needed"
                  oninput="updateSectionNote('${sectionName}','${it.id}',this.value)"
                >${escapeHtml(it.notes || '')}</textarea>
              `
              : `
                <div class="response-actions">
                  <button class="btn btn-small ${status === 'yes' ? 'response-active response-yes' : ''}" type="button" onclick="setSectionResponse('${sectionName}','${it.id}','yes')">Yes</button>
                  <button class="btn btn-small ${status === 'no' ? 'response-active response-no' : ''}" type="button" onclick="setSectionResponse('${sectionName}','${it.id}','no')">No</button>
                  <button class="btn btn-small ${status === 'not_sure' ? 'response-active response-not-sure' : ''}" type="button" onclick="setSectionResponse('${sectionName}','${it.id}','not_sure')">Not sure</button>
                  ${it.source === 'custom' ? `<button class="btn btn-small btn-danger" type="button" onclick="removeSectionItem('${sectionName}','${it.id}')">Remove</button>` : ''}
                </div>

                ${notesVisible ? `
                  <textarea
                    class="response-notes"
                    placeholder="Add notes if needed"
                    oninput="updateSectionNote('${sectionName}','${it.id}',this.value)"
                  >${escapeHtml(it.notes || '')}</textarea>
                ` : ''}
              `
          }
        </div>
      </div>
    `;
  }).join('');

  const answered = items.filter(function(it) {
    if ((it.responseType || 'check') === 'data_capture') {
      return String(it.answer || '').trim().length > 0;
    }
    return it.status && it.status !== 'unanswered';
  }).length;

  if (progress) {
    progress.textContent = answered + '/' + items.length + ' answered';
  }
}

function renderDocumentStatusSection(sectionName, containerId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, selectedActionId);
  if (!action) return;

  const items = action[sectionName] || [];
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state-wrap">
        <p>No client documents added yet.</p>
        <button class="btn btn-small" type="button" onclick="addSectionItem('evidence')">Add document</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="document-status-actions" style="margin-bottom: 12px;">
      <button class="btn btn-small" type="button" onclick="addSectionItem('evidence')">Add document</button>
    </div>
    ${items.map(function(it) {
      const status = it.status || 'unanswered';

      return `
        <div class="doc-status-row">
          <div class="doc-status-left">
            <span>${escapeHtml(it.text)}</span>
          </div>

          <div class="doc-status-toggle">
            <button
              class="status-btn yes ${status === 'yes' ? 'active' : ''}"
              type="button"
              onclick="setSectionResponse('${sectionName}','${it.id}','yes')"
            >
              Yes
            </button>

            <button
              class="status-btn no ${status === 'no' ? 'active' : ''}"
              type="button"
              onclick="setSectionResponse('${sectionName}','${it.id}','no')"
            >
              No
            </button>

            ${it.source === 'custom' ? `
              <button
                class="btn btn-small btn-danger"
                type="button"
                onclick="removeSectionItem('${sectionName}','${it.id}')"
              >
                Remove
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function getResponseStatusLabel(status) {
  if (status === 'yes') return 'Yes';
  if (status === 'no') return 'No';
  if (status === 'not_sure') return 'Not sure';
  return 'Not answered';
}

window.toggleResponseItem = function(sectionName, itemId) {
  const detail = document.getElementById('response-detail-' + sectionName + '-' + itemId);
  if (!detail) return;

  const isHidden = detail.style.display === 'none' || detail.style.display === '';
  detail.style.display = isHidden ? 'block' : 'none';
};

window.updateSectionAnswer = function(sectionName, itemId, value) {
  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    const item = (action[sectionName] || []).find(function(it) {
      return it.id === itemId;
    });

    if (!item) return;

    item.answer = value;
    item.status = String(value || '').trim() ? 'answered' : 'unanswered';
  });

  updateClientStatus(selectedAdminClientId);
};

async function setSectionResponse(sectionName, itemId, status) {
  updateClient(selectedAdminClientId, function(client) {
    const actionIdToUse = selectedActionId || currentWorkspaceActionId;
    const action = actionIdToUse ? getActionById(client, actionIdToUse) : null;
    if (!action) return;

    const item = (action[sectionName] || []).find(function(it) {
      return it.id === itemId;
    });

    if (!item) return;

    item.status = status;

    if (item.responseType === 'data_capture') {
      item.answer = '';
    }

    item.responseType = 'check';

    if (sectionName === 'evidence') {
      item.checked = status === 'yes';
    }
  });

  if (sectionName === 'reviewPoints' && status === 'yes') {
    updateClient(selectedAdminClientId, function(client) {
      const actionIdToUse = selectedActionId || currentWorkspaceActionId;
      const action = actionIdToUse ? getActionById(client, actionIdToUse) : null;
      if (!action) return;

      action.autoNextSteps = (action.autoNextSteps || []).filter(function(step) {
        return !(step && step.reviewPointId === itemId);
      });
    });
  }

  updateClient(selectedAdminClientId, function(client) {
    const actionIdToUse = selectedActionId || currentWorkspaceActionId;
    const action = actionIdToUse ? getActionById(client, actionIdToUse) : null;
    if (!action) return;

    syncAutoConcerns(action);
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

  if (sectionName === 'reviewPoints' && (status === 'no' || status === 'not_sure')) {
    const client = getClientById(selectedAdminClientId);
    const actionIdToUse = selectedActionId || currentWorkspaceActionId;
    const action = client && actionIdToUse ? getActionById(client, actionIdToUse) : null;
    const item = action
      ? (action.reviewPoints || []).find(function(it) { return it.id === itemId; })
      : null;

    if (client && action && item) {
      updateClient(selectedAdminClientId, function(clientToUpdate) {
        const actionToUpdate = getActionById(clientToUpdate, actionIdToUse);
        if (!actionToUpdate) return;

        if (!Array.isArray(actionToUpdate.autoNextSteps)) {
          actionToUpdate.autoNextSteps = [];
        }

        actionToUpdate.autoNextSteps = (actionToUpdate.autoNextSteps || []).filter(function(step) {
          return !(step && step.reviewPointId === itemId);
        });

        actionToUpdate.autoNextSteps.push({
          reviewPointId: itemId,
          title: 'Building action...',
          summary: 'System is building a practical next step for this point.',
          howTo: [],
          whatToCollect: [],
          goodLooksLike: ''
        });
      });

      renderAdminActionDetail();

      try {
        const aiStep = await generateWebBackedNextStep(client, action, item);

        updateClient(selectedAdminClientId, function(clientToUpdate) {
          const actionToUpdate = getActionById(clientToUpdate, actionIdToUse);
          if (!actionToUpdate) return;

          if (!Array.isArray(actionToUpdate.autoNextSteps)) {
            actionToUpdate.autoNextSteps = [];
          }

          actionToUpdate.autoNextSteps = (actionToUpdate.autoNextSteps || []).filter(function(step) {
            return !(step && step.reviewPointId === itemId);
          });

          actionToUpdate.autoNextSteps.push({
            reviewPointId: itemId,
            title: aiStep.title,
            summary: aiStep.summary,
            howTo: aiStep.howTo,
            whatToCollect: aiStep.whatToCollect,
            goodLooksLike: aiStep.goodLooksLike
          });
        });

        updateClientStatus(selectedAdminClientId);
        renderAdminActionDetail();
        renderAdminProjectDetail();

        if (currentClientId === selectedAdminClientId) {
          renderClientDashboard(currentClientId);
        }
      } catch (error) {
        console.error('AI next step generation failed FULL:', error);
        console.error('AI next step generation failed JSON:', JSON.stringify(error, null, 2));

        updateClient(selectedAdminClientId, function(clientToUpdate) {
          const actionToUpdate = getActionById(clientToUpdate, actionIdToUse);
          if (!actionToUpdate) return;

          actionToUpdate.autoNextSteps = (actionToUpdate.autoNextSteps || []).filter(function(step) {
            return !(step && step.reviewPointId === itemId);
          });

          actionToUpdate.autoNextSteps.push({
            reviewPointId: itemId,
            title: 'Next step generation failed',
            summary: 'The review point was saved, but the local AI step did not come back.',
            howTo: [
              'Check that the local AI server is running on port 8000',
              'Check that Ollama is running',
              'Retry the review point'
            ],
            whatToCollect: [],
            goodLooksLike: 'The point saves straight away and a useful next step appears after a short delay.'
          });
        });

        renderAdminActionDetail();
      }
    }
  }
}

function addSectionItem(sectionName) {
  const promptText = sectionName === 'evidence' ? 'Add a client document' : 'Add a new item';
  const text = prompt(promptText);
  if (!text || !text.trim()) return;

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    if (!Array.isArray(action[sectionName])) {
      action[sectionName] = [];
    }

    action[sectionName].push({
      id: generateUniqueItemId(),
      text: text.trim(),
      category: sectionName === 'reviewPoints' ? 'General' : 'Client document',
      responseType: sectionName === 'reviewPoints' ? 'check' : 'check',
      checked: false,
      status: 'unanswered',
      answer: '',
      notes: '',
      source: 'custom'
    });

    if (sectionName === 'reviewPoints') {
      syncAutoConcerns(action);
    }
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }
}

function removeSectionItem(sectionName, itemId) {
  const ok = confirm(sectionName === 'evidence' ? 'Remove this document item?' : 'Remove this custom item?');
  if (!ok) return;

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    action[sectionName] = (action[sectionName] || []).filter(function(it) {
      return it.id !== itemId;
    });

    if (sectionName === 'reviewPoints') {
      syncAutoConcerns(action);
    }
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }
}

function addListItem(listName) {
  const text = prompt(listName === 'concerns' ? 'Add a concern found' : 'Add a next step');
  if (!text || !text.trim()) return;

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    if (listName === 'concerns') {
      action.concernsFound.push(text.trim());
    }

    if (listName === 'nextSteps') {
      action.nextSteps.push(text.trim());
    }
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }
}

function removeListItem(listName, index) {
  const ok = confirm('Remove this item?');
  if (!ok) return;

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    if (listName === 'concerns') {
      action.concernsFound.splice(index, 1);
    }

    if (listName === 'nextSteps') {
      action.nextSteps.splice(index, 1);
    }
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }
}

function saveActionDetail() {
  clearMessage('admin-action-message');

  const actionIdToUse = selectedActionId || currentWorkspaceActionId;

  updateClient(selectedAdminClientId, function(client) {
    const action = actionIdToUse ? getActionById(client, actionIdToUse) : null;
    if (!action) return;

    action.internalNotes = document.getElementById('admin-action-internal-notes').value.trim();

    action.knownInfo = document.getElementById('admin-action-known-info').value.trim();
    action.missingInfo = document.getElementById('admin-action-missing-info').value.trim();
    action.followUpQuestions = document.getElementById('admin-action-followup-questions').value.trim();
    action.clientInput = document.getElementById('admin-action-client-input').value.trim();

    action.rcaProblemStatement = document.getElementById('admin-rca-problem-statement').value.trim();
    action.rcaImmediateCause = document.getElementById('admin-rca-immediate-cause').value.trim();
    action.rcaWhy1 = document.getElementById('admin-rca-why1').value.trim();
    action.rcaWhy2 = document.getElementById('admin-rca-why2').value.trim();
    action.rcaWhy3 = document.getElementById('admin-rca-why3').value.trim();
    action.rcaWhy4 = document.getElementById('admin-rca-why4').value.trim();
    action.rcaWhy5 = document.getElementById('admin-rca-why5').value.trim();
    action.rcaRootCause = document.getElementById('admin-rca-root-cause').value.trim();
    action.rcaContributingFactors = document.getElementById('admin-rca-contributing-factors').value.trim();
    action.rcaSystemicCauses = document.getElementById('admin-rca-systemic-causes').value.trim();

        action.findings = document.getElementById('admin-action-findings').value.trim();
    action.recommendations =
document.getElementById('admin-action-recommendations').value.trim();
    action.nextImplementation =
document.getElementById('admin-action-next-implementation').value.trim();
    action.implementationGuidance =
document.getElementById('admin-action-implementation-guidance').value.trim();
    if (!action.phase1Status || action.phase1Status === 'not_started') {
      action.phase1Status = 'in_progress';
    }

    if (typeof action.phase2Queued !== 'boolean') {
      action.phase2Queued = false;
    }

    if (!action.reportStage) {
      action.reportStage = 'v1';
    }

    if (!action.workflowStatus || action.workflowStatus === 'not_started') {
      action.workflowStatus = 'draft_generated';
    }
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

    showMessage('admin-action-message', 'Phase 1 draft saved for this issue.', 'good');
  showMessage('admin-project-message', 'Phase 1 draft saved for this issue.', 'good');

  const actionMessage = document.getElementById('admin-action-message');
  if (actionMessage) {
    actionMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function deleteAction() {
  const ok = confirm('Delete this action from the project?');
  if (!ok) return;

  updateClient(selectedAdminClientId, function(client) {
    client.actions = client.actions.filter(function(action) {
      return action.id !== selectedActionId;
    });
  });

  updateClientStatus(selectedAdminClientId);
  selectedActionId = null;
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

  backToAdminProjectDetail();
}