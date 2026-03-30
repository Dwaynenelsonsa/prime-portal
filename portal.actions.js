function backToAdminProjectDetail() {
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

Write a practical next step for this exact issue.

Rules:
- be specific to this issue
- do not use generic lines like "check the current situation"
- name the actual records, owners, controls, or actions where possible
- if this clearly needs current outside information, use web search
- if web search is not needed, still give a strong practical answer
- keep it grounded for engineering, maintenance, reliability, audit, CMMS, stores, planning, contractor control, shutdowns, or compliance work
- if the point is outside engineering scope, still give a practical business answer, not fluff

Return JSON only in this format:
{
  "title": "short action title",
  "summary": "what this means in plain English",
  "howTo": ["step 1", "step 2", "step 3", "step 4"],
  "whatToCollect": ["item 1", "item 2", "item 3"],
  "goodLooksLike": "one plain English sentence"
}
`;

  let response;

try {
  response = await puter.ai.chat(prompt, {
  model: "gpt-5.4-nano"
});

} catch (error) {
  console.error('PUTER CHAT RAW ERROR:', error);
  console.error('PUTER CHAT RAW ERROR JSON:', JSON.stringify(error, null, 2));
  throw error;
}

  const raw = typeof response === 'string'
    ? response
    : String(response?.text || response?.message?.content || '').trim();

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

function renderConcernList(action, targetId, emptyText) {
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
    ? action.autoConcerns.map(function(text) {
        return {
          text: text,
          type: 'auto'
        };
      })
    : [];

  const allConcerns = manualConcerns.concat(autoConcerns);

  if (!allConcerns.length) {
    target.innerHTML = '<li class="concern-item empty-item">' + escapeHtml(emptyText) + '</li>';
    return;
  }

  target.innerHTML = allConcerns.map(function(item) {
    if (item.type === 'manual') {
      return `
        <li class="concern-item">
          <span class="concern-text">${escapeHtml(item.text)}</span>
          <button class="btn btn-small btn-danger" type="button" onclick="removeListItem('concerns', ${item.index})">Remove</button>
        </li>
      `;
    }

    return `
      <li class="concern-item">
        <span class="concern-text">${escapeHtml(item.text)}</span>
        <span class="auto-concern-badge">Auto</span>
      </li>
    `;
  }).join('');
}

function renderNextStepList(action, targetId, emptyText) {
  const target = document.getElementById(targetId);
  if (!target) return;

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
        step: step,
        index: index,
        type: 'auto'
      };
    })
  : [];

  if (!manualNextSteps.length && !autoNextSteps.length) {
    target.innerHTML = '<li class="concern-item empty-item">' + escapeHtml(emptyText) + '</li>';
    return;
  }

  const manualHtml = manualNextSteps.map(function(item) {
    return `
      <li class="fix-card">
        <button class="fix-toggle" type="button" onclick="window.toggleNextStepDetail('manual-${item.index}')">
          <span>${escapeHtml(item.text)}</span>
          <span class="fix-toggle-icon">+</span>
        </button>
        <div class="fix-detail" id="nextstep-detail-manual-${item.index}">
          <div class="fix-detail-block">
            <strong>What this means</strong>
            <p>${escapeHtml(item.text)}</p>
          </div>
        </div>
      </li>
    `;
  }).join('');

  const autoHtml = autoNextSteps.map(function(item) {
    const step = item.step || {};

    return `
      <li class="fix-card">
        <button class="fix-toggle" type="button" onclick="window.toggleNextStepDetail('auto-${item.index}')">
          <span>${escapeHtml(step.title || 'Next step')}</span>
          <span class="fix-toggle-icon">+</span>
        </button>
        <div class="fix-detail" id="nextstep-detail-auto-${item.index}">
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
        </div>
      </li>
    `;
  }).join('');

  target.innerHTML = manualHtml + autoHtml;
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
    icon.textContent = isOpen ? '+' : '−';
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
    icon.textContent = isOpen ? '+' : '−';
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
  renderCheckboxSection('evidence', 'admin-action-evidence-box', 'admin-evidence-progress');

  document.getElementById('admin-action-suggested-fixes-list').innerHTML = (action.suggestedFixes || []).length
  ? action.suggestedFixes.map(function(fix, index) {
      if (typeof fix === 'string') {
        return `
          <li class="fix-card">
            <button class="fix-toggle" type="button" onclick="window.toggleFixDetail(${index})">
              <span>${escapeHtml(fix)}</span>
              <span class="fix-toggle-icon">+</span>
            </button>
            <div class="fix-detail" id="fix-detail-${index}">
              <div class="fix-detail-block">
                <strong>What this means</strong>
                <p>${escapeHtml(fix)}</p>
              </div>
            </div>
          </li>
        `;
      }

      return `
        <li class="fix-card">
          <button class="fix-toggle" type="button" onclick="window.toggleFixDetail(${index})">
            <span>${escapeHtml(fix.title || 'Suggested fix')}</span>
            <span class="fix-toggle-icon">+</span>
          </button>
          <div class="fix-detail" id="fix-detail-${index}">
            ${fix.summary ? `
              <div class="fix-detail-block">
                <strong>What this means</strong>
                <p>${escapeHtml(fix.summary)}</p>
              </div>
            ` : ''}

            ${Array.isArray(fix.howTo) && fix.howTo.length ? `
              <div class="fix-detail-block">
                <strong>How to do it</strong>
                <ol>
                  ${fix.howTo.map(function(step) {
                    return '<li>' + escapeHtml(step) + '</li>';
                  }).join('')}
                </ol>
              </div>
            ` : ''}

            ${Array.isArray(fix.clientNeeds) && fix.clientNeeds.length ? `
              <div class="fix-detail-block">
                <strong>What to collect</strong>
                <ul>
                  ${fix.clientNeeds.map(function(item) {
                    return '<li>' + escapeHtml(item) + '</li>';
                  }).join('')}
                </ul>
              </div>
            ` : ''}

            ${Array.isArray(fix.evidence) && fix.evidence.length ? `
              <div class="fix-detail-block">
                <strong>Evidence to keep</strong>
                <ul>
                  ${fix.evidence.map(function(item) {
                    return '<li>' + escapeHtml(item) + '</li>';
                  }).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </li>
      `;
    }).join('')
  : '<li class="fix-card"><div class="fix-detail" style="display:block;">No AI suggested fixes added yet</div></li>';

  renderConcernList(action, 'admin-action-concerns-list', 'No concerns added yet');
  renderNextStepList(action, 'admin-action-nextsteps-list', 'No next steps added yet');
}

function renderCheckboxSection(sectionName, containerId, progressId) {
  const client = getClientById(selectedAdminClientId);
  if (!client) return;

  const action = getActionById(client, selectedActionId);
  if (!action) return;

  syncAutoConcerns(action);

  const items = action[sectionName] || [];
  const container = document.getElementById(containerId);

  if (!items.length) {
    container.innerHTML = renderEmptyState('No items yet.');
    document.getElementById(progressId).textContent = '0/0 complete';
    return;
  }

  if (sectionName === 'evidence') {
    container.innerHTML = items.map(function(it) {
      return `
        <label class="check-item ${it.checked ? 'done' : ''}">
          <div class="check-item-left">
            <input type="checkbox" ${it.checked ? 'checked' : ''} onchange="toggleSectionItem('${sectionName}','${it.id}',this.checked)" />
            <span>${escapeHtml(it.text)}</span>
          </div>
          ${it.source === 'custom' ? `<button class="btn btn-small btn-danger" type="button" onclick="removeSectionItem('${sectionName}','${it.id}')">Remove</button>` : ''}
        </label>
      `;
    }).join('');

    const done = items.filter(function(it) { return it.checked; }).length;
    document.getElementById(progressId).textContent = done + '/' + items.length + ' complete';
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

  document.getElementById(progressId).textContent = answered + '/' + items.length + ' answered';
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
  });

  if (sectionName === 'reviewPoints' && (status === 'no' || status === 'not_sure')) {
    const client = getClientById(selectedAdminClientId);
    const action = client ? getActionById(client, selectedActionId) : null;
    const item = action
      ? (action.reviewPoints || []).find(function(it) { return it.id === itemId; })
      : null;

    if (client && action && item) {
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
      } catch (error) {
  console.error('AI next step generation failed FULL:', error);
  console.error('AI next step generation failed JSON:', JSON.stringify(error, null, 2));
}
    }
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
}

function addSectionItem(sectionName) {
  const text = prompt('Add a new item');
  if (!text || !text.trim()) return;

  updateClient(selectedAdminClientId, function(client) {
    const action = getActionById(client, selectedActionId);
    if (!action) return;

    action[sectionName].push({
      id: generateUniqueItemId(),
      text: text.trim(),
      category: sectionName === 'reviewPoints' ? 'General' : 'Evidence',
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
  const ok = confirm('Remove this custom item?');
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