function backToAdminProjectDetail() {
  selectedActionId = null;
  document.getElementById('admin-project-detail').classList.add('active');
  document.getElementById('admin-action-detail').classList.remove('active');
  clearMessage('admin-action-message');
  renderAdminProjectDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAdminActionDetail(actionId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, actionId);
  if (!action) return;

  selectedActionId = actionId;
  clearMessage('admin-action-message');

  document.getElementById('admin-project-detail').classList.remove('active');
  document.getElementById('admin-action-detail').classList.add('active');

  document.getElementById('admin-action-title').textContent = action.title;
  document.getElementById('admin-action-purpose-text').textContent = action.purpose;
  document.getElementById('admin-action-internal-notes').value = action.internalNotes || '';

  renderAdminActionDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function generateWebBackedNextStep(client, action, reviewPoint) {
  const notes = String(reviewPoint.notes || '').trim();
  const status = reviewPoint.status || 'unanswered';

  const prompt = `
You are helping Prime Engineering Solutions give a practical fix for a failed review point.

Company style:
- plain English
- practical
- direct
- no vague wording
- no consultant fluff
- sound like a real engineering advisor

Project scope:
${client.projectName}

Action title:
${action.title}

Action purpose:
${action.purpose}

Review point:
${reviewPoint.text}

Response:
${status}

Notes:
${notes || 'None'}

Write one practical action for this exact failed point only.

Rules:
- be specific to this issue
- do not use generic lines like "check the current situation"
- name the actual records, owners, controls, or actions where possible
- if web search is not needed, still give a strong practical answer
- keep it grounded for engineering, maintenance, reliability, audit, CMMS, stores, planning, contractor control, shutdowns, or compliance work
- if the point is outside engineering scope, still give a practical business answer, not fluff
- do not invent system names, forms, database names, departments, or document titles
- do not assume healthcare processes unless they were clearly stated in the project scope, action, review point, or notes
- if a detail is unknown, say exactly what needs to be confirmed instead of making it up
- keep the action tightly linked to the failed review point only

Return JSON only in this format:
{
  "title": "short action title tied to the failed point",
  "summary": "plain English meaning with no made up details",
  "howTo": ["step 1", "step 2", "step 3"],
  "whatToCollect": ["item 1", "item 2"],
  "goodLooksLike": "one plain English sentence"
}
`;

  let raw = '';

  try {
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Local AI request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error || 'Local AI returned an error');
    }

    raw = String(data.response || '').trim();
  } catch (error) {
    console.error('LOCAL AI ERROR:', error);

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

  let parsed = null;

  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    }
  }

  if (!parsed || typeof parsed !== 'object') {
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

  return {
    title: String(parsed.title || 'Next step').trim(),
    summary: String(parsed.summary || reviewPoint.text).trim(),
    howTo: Array.isArray(parsed.howTo) ? parsed.howTo.map(String) : [],
    whatToCollect: Array.isArray(parsed.whatToCollect) ? parsed.whatToCollect.map(String) : [],
    goodLooksLike: String(parsed.goodLooksLike || '').trim()
  };
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
    const notes = String(it.notes || '').trim();

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
  rKaNCgLvMEXxNzMxj2F7FYi1AdRrTo6Nhu('evidence', 'admin-action-evidence-box');
  renderIssuesNextStepsList(action, 'admin-action-issues-nextsteps-list', 'No concerns or next steps added yet');
}

function renderCheckboxSection(sectionName, containerId, progressId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, selectedActionId);
  if (!action) return;

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
    const status = it.status || 'unanswered';
    const notesVisible = status !== 'unanswered';
    const categoryLabel = it.category ? '<span class="response-category-badge">' + escapeHtml(it.category) + '</span>' : '';

    return `
      <div class="response-item response-${status}">
        <button class="response-summary" type="button" onclick="toggleResponseItem('${sectionName}','${it.id}')">
          <div class="response-summary-text-wrap">
            ${categoryLabel}
            <span class="response-summary-text">${escapeHtml(it.text)}</span>
          </div>
          <span class="response-summary-right">
            <span class="response-status-badge response-status-${status}">${getResponseStatusLabel(status)}</span>
            <span class="response-toggle-icon">+</span>
          </span>
        </button>

        <div class="response-detail" id="response-detail-${sectionName}-${it.id}" style="display:none;">
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
        </div>
      </div>
    `;
  }).join('');

  const answered = items.filter(function(it) {
    return it.status && it.status !== 'unanswered';
  }).length;

  if (progress) {
    progress.textContent = answered + '/' + items.length + ' answered';
  }
}

function rKaNCgLvMEXxNzMxj2F7FYi1AdRrTo6Nhu(sectionName, containerId) {
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

async function setSectionResponse(sectionName, itemId, status) {
  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    const item = (action[sectionName] || []).find(function(it) {
      return it.id === itemId;
    });

    if (!item) return;
    item.status = status;

    if (sectionName === 'evidence') {
      item.checked = status === 'yes';
    }
  });

  if (sectionName === 'reviewPoints' && status === 'yes') {
    updateClient(selectedAdminClientId, function(client) {
      const action = getActionById(client, selectedActionId);
      if (!action) return;

      action.autoNextSteps = (action.autoNextSteps || []).filter(function(step) {
        return !(step && step.reviewPointId === itemId);
      });
    });
  }

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
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
    const action = client ? getActionById(client, selectedActionId) : null;
    const item = action
      ? (action.reviewPoints || []).find(function(it) { return it.id === itemId; })
      : null;

    if (client && action && item) {
      updateClient(selectedAdminClientId, function(clientToUpdate) {
        const actionToUpdate = getActionById(clientToUpdate, selectedActionId);
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
          const actionToUpdate = getActionById(clientToUpdate, selectedActionId);
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
          const actionToUpdate = getActionById(clientToUpdate, selectedActionId);
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
      checked: false,
      status: 'unanswered',
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

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    action.internalNotes = document.getElementById('admin-action-internal-notes').value.trim();
  });

  updateClientStatus(selectedAdminClientId);
  renderAdminActionDetail();
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

  showMessage('admin-action-message', 'Action saved.', 'good');
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