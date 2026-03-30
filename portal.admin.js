async function createClient() {
  const clientName = document.getElementById('new-client-name').value.trim();
  const projectName = document.getElementById('new-project-scope').value
  .split('\n')
  .map(function(line) { return line.trim(); })
  .filter(function(line) { return line.length > 0; })
  .slice(0, 3)
  .join(' | ');
  let clientId = document.getElementById('new-client-id').value.trim();
  let pin = document.getElementById('new-client-pin').value.trim();
  const selectedModules = getSelectedModules();

  if (!clientName || !projectName) {
    showMessage('create-client-message', 'Enter client name and at least one scope point first.', 'bad');
    return;
  }

  if (!clientId) clientId = generateUniqueClientId();
  if (!pin) pin = generatePin();

  if (!/^\d{8}$/.test(clientId)) {
    showMessage('create-client-message', 'Client ID must be 8 digits.', 'bad');
    return;
  }

  if (!/^\d{4}$/.test(pin)) {
    showMessage('create-client-message', 'PIN must be 4 digits.', 'bad');
    return;
  }

  const clients = getClients();
  if (clients.some(function(client) { return client.clientId === clientId; })) {
    showMessage('create-client-message', 'That client ID already exists. Generate a new one.', 'bad');
    return;
  }

  showMessage('create-client-message', 'Creating client and building project areas...', 'good');

  const defaultActions = getCoreActionTemplate();
  let aiActions = await generateAIModuleActions(selectedModules, projectName);

  if (selectedModules.length && !aiActions.length) {
    aiActions = buildFallbackAIActions(selectedModules);
  }

  const newClient = {
    clientId: clientId,
    pin: pin,
    clientName: clientName,
    projectName: projectName,
    modules: selectedModules,
    status: 'In Progress',
    actions: selectedModules.length ? aiActions : defaultActions,
    files: [],
    notes: [
      {
        title: 'Portal access created',
        body: 'Client access has been created and the core checklist has been loaded.',
        date: getTodayDisplayDate(),
        relative: 'Today'
      }
    ]
  };

  clients.push(newClient);
  saveClients(clients);
  renderAdminDashboard();
  showMessage('create-client-message', 'Client created. ID: ' + clientId + '  PIN: ' + pin, 'good');
  resetCreateClientForm();
}

function adminLogin() {
  clearMessage('admin-login-message');
  saveSession({ type: 'admin' });
  renderAdminDashboard();
  showPage('admin-dashboard');

  const usernameField = document.getElementById('admin-username');
  const passwordField = document.getElementById('admin-password');

  if (usernameField) usernameField.value = '';
  if (passwordField) passwordField.value = '';
}

function logoutAdmin() {
  selectedAdminClientId = null;
  selectedActionId = null;
  clearSession();
  backToAdminDashboard();
  showPage('admin-login');
}

function suggestModulesFromProjectTitle() {
  const titleInput = document.getElementById('new-project-name');
  if (!titleInput) return;

  const title = titleInput.value.trim().toLowerCase();
  const checkboxes = document.querySelectorAll('.module-checkbox');

  checkboxes.forEach(function(box) {
    box.checked = false;
  });

  if (!title) {
    showMessage('create-client-message', 'Enter a project title first.', 'bad');
    return;
  }

  const rules = [
    {
      keywords: ['reliability', 'downtime', 'breakdown', 'breakdowns', 'failure', 'failures', 'rca'],
      module: 'Reliability Improvement'
    },
    {
      keywords: ['department', 'team', 'structure', 'rebuild', 'engineering manager', 'engineering function'],
      module: 'Engineering Department Rebuild'
    },
    {
      keywords: ['pm', 'ppm', 'preventive maintenance', 'maintenance system', 'planner', 'scheduling'],
      module: 'PM System Rebuild'
    },
    {
      keywords: ['stores', 'store', 'spares', 'parts', 'inventory', 'stock', 'stock control'],
      module: 'Stores and Parts Control'
    },
    {
      keywords: ['shutdown', 'turnaround', 'outage', 'planned stop', 'readiness'],
      module: 'Shutdown Readiness'
    }
  ];

  let matched = [];

  rules.forEach(function(rule) {
    const hit = rule.keywords.some(function(keyword) {
      return title.includes(keyword);
    });

    if (hit) {
      matched.push(rule.module);
    }
  });

  checkboxes.forEach(function(box) {
    if (matched.includes(box.value)) {
      box.checked = true;
    }
  });

  if (matched.length) {
    showMessage('create-client-message', 'Suggested modules selected based on project title.', 'good');
  } else {
    showMessage('create-client-message', 'No direct match found. Select modules manually.', 'bad');
  }
}

function renderAdminDashboard() {
  const clients = getClients();
  const completedCount = clients.filter(function(client) { return client.status === 'Complete'; }).length;
  const activeCount = clients.filter(function(client) { return client.status !== 'Complete'; }).length;

  document.getElementById('admin-total-clients').textContent = clients.length;
  document.getElementById('admin-active-projects').textContent = activeCount;
  document.getElementById('admin-completed-projects').textContent = completedCount;
  document.getElementById('admin-average-progress').textContent = getAverageProgress(clients) + '%';
  document.getElementById('admin-needing-attention').textContent = getClientsNeedingAttention(clients);

  const list = document.getElementById('admin-client-list');

  if (!clients.length) {
    list.innerHTML = renderEmptyState('No clients yet. Create your first client above.');
    return;
  }

  list.innerHTML = clients.map(function(client) {
    const completed = getClientCompletedCount(client);
    const total = getClientTotalCount(client);
    const progress = getClientProgress(client);
    const concerns = getClientConcernCount(client);

    return `
      <article class="client-item">
        <div class="client-top">
          <div>
            <strong>${escapeHtml(client.clientName)}</strong>
            <div class="muted">${escapeHtml(client.projectName)}</div>
          </div>
          <span class="${getStatusPillClass(client.status)}">${escapeHtml(client.status)}</span>
        </div>

        <div class="mini-grid">
          <div class="mini-box"><small>Client ID</small><strong>${escapeHtml(client.clientId)}</strong></div>
          <div class="mini-box"><small>PIN</small><strong>${escapeHtml(client.pin)}</strong></div>
          <div class="mini-box"><small>Files</small><strong>${client.files.length}</strong></div>
          <div class="mini-box"><small>Concerns</small><strong>${concerns}</strong></div>
        </div>

        <div class="progress-wrap">
          <div class="progress-head"><span>Overall progress</span><span>${completed}/${total} items complete</span></div>
          <div class="progress"><span style="width:${progress}%;"></span></div>
        </div>

        <div class="portal-actions">
          <button class="btn btn-primary" onclick="showAdminProject('${client.clientId}')">Open Project</button>
          <button class="btn" onclick="quickUploadForClient('${client.clientId}')">Upload Files</button>
          <button class="btn" onclick="resetClientPinFromList('${client.clientId}')">Reset PIN</button>
          <button class="btn btn-danger" onclick="deleteClient('${client.clientId}')">Delete Client</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderAdminProjectDetail() {
  const client = getClientById(selectedAdminClientId);
  if (!client) {
    backToAdminDashboard();
    return;
  }

  const progress = getClientProgress(client);
  const completed = getClientCompletedCount(client);
  const open = getClientOpenCount(client);
  const concerns = getClientConcernCount(client);

  document.getElementById('admin-project-title').textContent = 'Project Workspace. ' + client.clientName;
  document.getElementById('admin-detail-progress').textContent = progress + '%';
  document.getElementById('admin-detail-completed').textContent = completed;
  document.getElementById('admin-detail-open').textContent = open;
  document.getElementById('admin-detail-documents').textContent = client.files.length;
  document.getElementById('admin-detail-concerns').textContent = concerns;
  document.getElementById('admin-detail-progress-text').textContent = completed + '/' + getClientTotalCount(client) + ' items complete';
  document.getElementById('admin-detail-progress-bar').style.width = progress + '%';

  document.getElementById('admin-project-actions-list').innerHTML = client.actions.length
    ? client.actions.map(function(action) {
        const prog = getActionProgress(action);
        const status = getAreaStatusLabel(action);
        return `
          <div class="task-item task-item-clean">
            <div class="task-check">
              <span class="tick ${prog === 100 ? 'done' : ''}"></span>
            </div>

            <div class="task-main">
              <div class="task-title">${escapeHtml(action.title)}</div>
              <div class="task-purpose">${escapeHtml(action.purpose)}</div>
            </div>

            <div class="task-side">
              <span class="${status.className}">${status.text}</span>
              <button class="btn btn-small" type="button" onclick="showAdminActionDetail('${action.id}')">Open</button>
            </div>
          </div>
        `;
      }).join('')
    : renderEmptyState('No actions saved yet.');

  document.getElementById('admin-project-files-list').innerHTML = client.files.length
    ? client.files.slice().reverse().map(renderFileItem).join('')
    : renderEmptyState('No files uploaded yet.');

  document.getElementById('admin-project-notes-list').innerHTML = client.notes.length
    ? client.notes.slice().reverse().map(renderNoteItem).join('')
    : renderEmptyState('No project notes saved yet.');
}

function showAdminProject(clientId) {
  const client = getClientById(clientId);
  if (!client) return;

  selectedAdminClientId = client.clientId;
  selectedActionId = null;
  document.getElementById('admin-dashboard-main').classList.add('hide');
  document.getElementById('admin-project-detail').classList.add('active');
  document.getElementById('admin-action-detail').classList.remove('active');

  renderAdminProjectDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToAdminDashboard() {
  document.getElementById('admin-dashboard-main').classList.remove('hide');
  document.getElementById('admin-project-detail').classList.remove('active');
  document.getElementById('admin-action-detail').classList.remove('active');
  document.getElementById('admin-add-note-panel').classList.add('hidden');
  document.getElementById('admin-add-action-panel').classList.add('hidden');
  clearMessage('admin-project-message');
  clearMessage('admin-action-message');
  renderAdminDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAddNotePanel(forceOpen) {
  const panel = document.getElementById('admin-add-note-panel');
  if (forceOpen === false) {
    panel.classList.add('hidden');
    document.getElementById('admin-note-title').value = '';
    document.getElementById('admin-note-body').value = '';
    return;
  }
  panel.classList.toggle('hidden');
}

function toggleAddActionPanel(forceOpen) {
  const panel = document.getElementById('admin-add-action-panel');
  if (forceOpen === false) {
    panel.classList.add('hidden');
    document.getElementById('admin-new-action-title').value = '';
    document.getElementById('admin-new-action-purpose').value = '';
    document.getElementById('admin-new-action-checks').value = '';
    document.getElementById('admin-new-action-questions').value = '';
    document.getElementById('admin-new-action-evidence').value = '';
    return;
  }
  panel.classList.toggle('hidden');
}

function saveProjectNote() {
  clearMessage('admin-project-message');

  const title = document.getElementById('admin-note-title').value.trim();
  const body = document.getElementById('admin-note-body').value.trim();

  if (!title || !body) {
    showMessage('admin-project-message', 'Enter a note title and project note first.', 'bad');
    return;
  }

  updateClient(selectedAdminClientId, function(client) {
    client.notes.push({
      title: title,
      body: body,
      date: getTodayDisplayDate(),
      relative: 'Today'
    });
  });

  toggleAddNotePanel(false);
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

  showMessage('admin-project-message', 'Project note added.', 'good');
}

function saveCustomAction() {
  clearMessage('admin-project-message');

  const title = document.getElementById('admin-new-action-title').value.trim();
  const purpose = document.getElementById('admin-new-action-purpose').value.trim();
  const checks = splitLines(document.getElementById('admin-new-action-checks').value);
  const questions = splitLines(document.getElementById('admin-new-action-questions').value);
  const evidence = splitLines(document.getElementById('admin-new-action-evidence').value);
  const redFlags = [];

  if (!title || !purpose) {
    showMessage('admin-project-message', 'Enter an action title and purpose first.', 'bad');
    return;
  }

  updateClient(selectedAdminClientId, function(client) {
    client.actions.push(createAction(title, purpose, checks, questions, evidence, redFlags));
  });

  updateClientStatus(selectedAdminClientId);
  toggleAddActionPanel(false);
  renderAdminProjectDetail();

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }

  showMessage('admin-project-message', 'Custom action added.', 'good');
}

function triggerAdminFileUpload() {
  document.getElementById('admin-file-input').click();
}

function quickUploadForClient(clientId) {
  selectedAdminClientId = clientId;
  document.getElementById('admin-file-input').click();
}

function handleFileUpload(files) {
  if (!selectedAdminClientId || !files || !files.length) return;

  const uploadedFiles = Array.from(files).map(function(file) {
    return {
      name: file.name,
      type: getFileTypeLabel(file.name),
      uploaded: getTodayUploadDate()
    };
  });

  updateClient(selectedAdminClientId, function(client) {
    client.files = client.files.concat(uploadedFiles);
  });

  renderAdminDashboard();
  if (document.getElementById('admin-project-detail').classList.contains('active')) {
    renderAdminProjectDetail();
    showMessage('admin-project-message', 'File list updated in demo mode.', 'good');
  }

  if (currentClientId === selectedAdminClientId) {
    renderClientDashboard(currentClientId);
  }
}

function resetSelectedClientPin() {
  const newPin = generatePin();
  updateClient(selectedAdminClientId, function(client) {
    client.pin = newPin;
  });
  renderAdminProjectDetail();
  renderAdminDashboard();
  showMessage('admin-project-message', 'Client PIN reset to ' + newPin, 'good');
}

function resetClientPinFromList(clientId) {
  const newPin = generatePin();
  updateClient(clientId, function(client) {
    client.pin = newPin;
  });
  renderAdminDashboard();
  alert('New PIN for client ' + clientId + ': ' + newPin);
}

function deleteClient(clientId) {
  const client = getClientById(clientId);
  if (!client) return;

  const firstConfirm = confirm('Delete client ' + client.clientName + '?');
  if (!firstConfirm) return;

  const clients = getClients().filter(function(item) {
    return item.clientId !== clientId;
  });
  saveClients(clients);

  if (selectedAdminClientId === clientId) {
    selectedAdminClientId = null;
    selectedActionId = null;
  }

  if (currentClientId === clientId) {
    currentClientId = null;
    clearSession();
    showPage('client-login');
  }

  renderAdminDashboard();
  backToAdminDashboard();
  alert('Client deleted.');
}

function clearPortalData() {
  const ok = confirm('Clear all demo clients and portal data from this browser?');
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  selectedAdminClientId = null;
  selectedActionId = null;
  currentClientId = null;
  backToAdminDashboard();
  renderAdminDashboard();
  alert('Demo portal data cleared.');
}

function scrollToCreateClient() {
  document.getElementById('create-client-card').scrollIntoView({ behavior: 'smooth' });
}

function scrollToClientList() {
  document.getElementById('clients-list-card').scrollIntoView({ behavior: 'smooth' });
}

async function suggestModulesWithAI() {
  clearMessage('create-client-message');

  const scopeInput = document.getElementById('new-project-scope');
  const listWrap = document.getElementById('suggested-modules-list');

  if (!scopeInput || !listWrap) return;

  const scopePoints = scopeInput.value.trim();

  if (!scopePoints) {
    showMessage('create-client-message', 'Enter at least one scope point first.', 'bad');
    return;
  }

  listWrap.innerHTML = '<div class="module-option">Loading AI suggestions...</div>';

  try {
    const prompt = `
You are helping build a simple engineering support project.

Read the client issues and suggest only the most relevant workstreams and modules.

Client issues:
${scopePoints}

Rules:
- Return an array of workstream groups
- Use max 3 workstreams
- Name them exactly: "Workstream 1", "Workstream 2", "Workstream 3"
- Use plain everyday English
- Write so anyone can understand it
- Do not use jargon, consultant words, or management language
- Do not guess problems that are not clearly written
- If there is only one issue, stay focused on that one issue
- If there are multiple issues, only cover those issues
- Prefer fewer modules over too many
- Keep workstream labels short and easy to understand
- Keep module names short, clear, and practical
- Do not use words like baseline, governance, triage, cadence, framework, ownership mapping, or capacity model
- Each module must describe a real task somebody can go and do
- Avoid vague words like structure, basics, setup, optimise, improve, template, framework
- Use simple site language
- Prefer modules like "List equipment", "Set PM timing", "Create job types", "Train first users"
- Every module should sound like a practical action
- If a module is too vague, rewrite it into a clear task
- Every title must make sense to a normal person
- When in doubt, reduce scope instead of expanding it

Required format:
[
  {
    "workstream": "Workstream 1",
    "label": "Simple short label",
    "modules": ["Short clear module name", "Short clear module name"]
  }
]

Bad module examples:
["Set up structure", "Configure basics", "Improve process", "Create template"]

Better module examples:
["List equipment", "Set PM timing", "Create job types", "Train first users"]

Return JSON only.
`;

    const response = await puter.ai.chat(prompt, {
      model: "gpt-5.4-nano"
    });

    let raw = typeof response === 'string' ? response : String(response || '').trim();
    let groups = [];

    try {
      groups = JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          groups = JSON.parse(match[0]);
        } catch (err) {
          groups = [];
        }
      }
    }

    if (!Array.isArray(groups) || !groups.length) {
      groups = [
        {
          workstream: 'Workstream 1',
          label: 'General engineering review',
          modules: ['General Engineering Review']
        }
      ];
    }

    groups = groups
      .filter(function(group) {
        return group && Array.isArray(group.modules) && group.modules.length;
      })
      .slice(0, 3)
      .map(function(group, index) {
        return {
          workstream: 'Workstream ' + (index + 1),
          label: String(group.label || 'Project delivery focus').trim(),
          modules: group.modules
            .map(function(item) {
              return String(item).trim();
            })
            .filter(function(item) {
              return item.length > 0;
            })
            .slice(0, 5)
        };
      });

    listWrap.innerHTML = groups.map(function(group) {
      const modulesHtml = group.modules.map(function(moduleName) {
        return `
          <label class="module-option">
            <input type="checkbox" value="${escapeHtml(moduleName)}" class="module-checkbox" checked />
            ${escapeHtml(moduleName)}
          </label>
        `;
      }).join('');

      return `
        <div class="module-group">
          <div class="module-group-title">${escapeHtml(group.workstream)}</div>
          <div class="module-group-label">${escapeHtml(group.label)}</div>
          <div class="module-grid">
            ${modulesHtml}
          </div>
        </div>
      `;
    }).join('');

    showMessage('create-client-message', 'AI module suggestions loaded.', 'good');
  } catch (error) {
    console.error(error);
    listWrap.innerHTML = '';
    showMessage('create-client-message', 'AI suggestion failed. Try again.', 'bad');
  }
}

function buildFallbackAIActions(moduleNames) {
  const fallbackMap = {
    'Reduce breakdowns': {
      purpose: 'Review the repeat breakdown picture, confirm the biggest loss points, and set corrective actions that can actually be closed.',
      checks: [
        'Check the top 10 repeat breakdowns by asset or line',
        'Check whether each repeat breakdown has a usable closeout note',
        'Check whether failure codes are consistent and usable',
        'Check whether breakdown ownership is clear',
        'Check whether previous corrective actions were actually closed'
      ],
      questions: [
        'Which assets are causing the most repeat downtime',
        'What keeps getting patched instead of fixed',
        'Who owns repeat failure review today',
        'What breakdown data can actually be trusted',
        'What would stop the firefighting fastest'
      ],
      evidence: [
        'Last 90 days of breakdown records',
        'Failure code list',
        'Sample breakdown closeout notes',
        'Repeat failure tracker',
        'Downtime Pareto by asset or line'
      ],
      suggestedFixes: [
        {
          title: 'Build the repeat failure list',
          summary: 'Create one clear list of the failures that keep coming back so effort goes to the right place first.',
          howTo: [
            'Pull the last 90 days of breakdown records',
            'Group the failures by asset and failure type',
            'Rank them by downtime and repeat count',
            'Assign an owner to each top repeat failure',
            'Review progress weekly'
          ],
          clientNeeds: [
            'Last 90 days of work orders',
            'Downtime report',
            'Named owner for repeat failure review'
          ],
          evidence: [
            'Repeat failure list',
            'Ranked downtime view',
            'Owner action tracker'
          ]
        }
      ]
    },

    'Handle with fewer staff': {
      purpose: 'Review how engineering work is being covered with limited headcount and confirm what must be protected first.',
      checks: [
        'Check how breakdown cover is managed across the shift',
        'Check what planned work is being dropped first',
        'Check whether key assets still have minimum inspection cover',
        'Check where one person dependency exists',
        'Check whether urgent work is clearly prioritised'
      ],
      questions: [
        'What work is no longer getting done properly',
        'Which assets are most exposed right now',
        'Where is the single biggest resource gap',
        'What work is being delayed until there is a breakdown',
        'What must not be missed even with low staffing'
      ],
      evidence: [
        'Current roster',
        'Overdue work order list',
        'PM compliance by area',
        'Critical asset list',
        'Shift cover plan'
      ],
      suggestedFixes: [
        {
          title: 'Define minimum cover',
          summary: 'Set the minimum engineering work that must still happen so the site does not drift into uncontrolled risk.',
          howTo: [
            'List critical assets and must do checks',
            'Separate work into must do and can wait',
            'Assign minimum daily and weekly cover',
            'Review what cannot be covered with current staffing',
            'Escalate the uncovered risk clearly'
          ],
          clientNeeds: [
            'Current staffing roster',
            'Critical asset list',
            'Overdue work view'
          ],
          evidence: [
            'Minimum cover list',
            'Priority work split',
            'Escalated risk register'
          ]
        }
      ]
    },

    'Check audit': {
      purpose: 'Review whether site documents, records, and control points would stand up properly during an audit.',
      checks: [
        'Check whether required records exist for the area',
        'Check whether records are current and signed where needed',
        'Check whether document versions are controlled',
        'Check whether actions from previous findings were closed',
        'Check whether the site can produce evidence quickly'
      ],
      questions: [
        'What records are usually missing',
        'Which documents are out of date',
        'What gets signed late or not at all',
        'What would an auditor challenge first',
        'Who owns audit readiness in this area'
      ],
      evidence: [
        'Latest controlled documents',
        'Sample signed records',
        'Previous audit findings',
        'Action closeout tracker',
        'Document register'
      ],
      suggestedFixes: [
        {
          title: 'Build the missing evidence list',
          summary: 'Create one list of the missing or weak records so the site can close the gaps before audit pressure hits.',
          howTo: [
            'List the required records for the area',
            'Check current versions and signoff status',
            'Mark what is missing or weak',
            'Assign an owner and due date to each gap',
            'Review closure weekly until complete'
          ],
          clientNeeds: [
            'Document register',
            'Sample records',
            'Previous audit findings'
          ],
          evidence: [
            'Gap list',
            'Closure tracker',
            'Updated document set'
          ]
        }
      ]
    },

    'Collect current records': {
      purpose: 'Gather the current records needed to understand the real condition of the system before making changes.',
      checks: [
        'Check whether the required records are easy to locate',
        'Check whether the records cover the full period needed',
        'Check whether the records are complete and readable',
        'Check whether the records match what is happening on site',
        'Check whether ownership of the records is clear'
      ],
      questions: [
        'What records are missing right now',
        'Which records are incomplete',
        'Who controls the master copy',
        'What records are trusted least',
        'What records are needed first to move forward'
      ],
      evidence: [
        'Current record list',
        'Source folder or system path',
        'Sample extracts',
        'Named owner list'
      ],
      suggestedFixes: [
        {
          title: 'Create one live record list',
          summary: 'Build one simple list of the records needed, where they are held, and who owns them.',
          howTo: [
            'List the required records',
            'Add owner and storage location',
            'Mark what is missing',
            'Collect the first full set',
            'Review the list with the site owner'
          ],
          clientNeeds: [
            'Access to current files',
            'Named process owners',
            'List of required records'
          ],
          evidence: [
            'Live record list',
            'Missing record tracker',
            'Owner confirmed register'
          ]
        }
      ]
    },

    'List all': {
      purpose: 'Build a complete working list for this area so nothing critical is missed or assumed.',
      checks: [
        'Check whether the current list exists at all',
        'Check whether duplicates are present',
        'Check whether naming is consistent',
        'Check whether critical items are clearly flagged',
        'Check whether the list is owned and maintained'
      ],
      questions: [
        'What is missing from the current list',
        'What is duplicated or unclear',
        'Who owns the list today',
        'Which items matter most to operations',
        'What should be controlled first'
      ],
      evidence: [
        'Current item list',
        'System extract',
        'Critical item list',
        'Owner confirmation'
      ],
      suggestedFixes: [
        {
          title: 'Build the master list',
          summary: 'Create one clean master list so the area can be managed without duplicates, gaps, or guesswork.',
          howTo: [
            'Pull the current source lists',
            'Remove duplicates and bad naming',
            'Add missing critical items',
            'Mark owner and status',
            'Approve the live version'
          ],
          clientNeeds: [
            'Current system list',
            'Owner input',
            'Critical item criteria'
          ],
          evidence: [
            'Approved master list',
            'Duplicate cleanup log',
            'Owner signoff'
          ]
        }
      ]
    },

    'Schedule': {
      purpose: 'Review whether the work is being scheduled properly and whether the schedule can actually hold.',
      checks: [
        'Check whether weekly work is scheduled in advance',
        'Check whether job readiness is confirmed before start',
        'Check whether labour and time are realistic',
        'Check whether the schedule is constantly being broken by reactive work',
        'Check whether schedule compliance is measured'
      ],
      questions: [
        'What planned work gets pushed out most often',
        'Why does the schedule break down',
        'Who approves schedule changes',
        'Are parts and permits ready before work starts',
        'What would make the schedule hold better'
      ],
      evidence: [
        'Weekly schedule',
        'Schedule compliance report',
        'Delay reasons',
        'Job readiness checklist'
      ],
      suggestedFixes: [
        {
          title: 'Protect the weekly schedule',
          summary: 'Set a schedule that is realistic, ready, and hard to break unless there is a true priority change.',
          howTo: [
            'Build the next weekly schedule',
            'Check readiness for each planned job',
            'Remove work that is not ready',
            'Track schedule breaks by reason',
            'Review compliance weekly'
          ],
          clientNeeds: [
            'Current backlog',
            'Weekly labour view',
            'Job readiness information'
          ],
          evidence: [
            'Approved weekly schedule',
            'Compliance report',
            'Delay reason tracker'
          ]
        }
      ]
    }
  };

  function pickFallback(moduleName) {
    const name = String(moduleName || '').toLowerCase();

    if (name.includes('breakdown')) return fallbackMap['Reduce breakdowns'];
    if (name.includes('staff') || name.includes('roster') || name.includes('manpower')) return fallbackMap['Handle with fewer staff'];
    if (name.includes('audit')) return fallbackMap['Check audit'];
    if (name.includes('record') || name.includes('document')) return fallbackMap['Collect current records'];
    if (name.includes('list') || name.includes('inventory') || name.includes('register')) return fallbackMap['List all'];
    if (name.includes('schedule') || name.includes('plan')) return fallbackMap['Schedule'];

    return {
      purpose: 'Review this area properly, confirm the real gaps, and define corrective actions that can actually be followed through.',
      checks: [
        'Check whether the current setup is clear and usable',
        'Check whether ownership is clear',
        'Check whether the main gaps are known',
        'Check whether the current controls are working',
        'Check whether repeat issues are being challenged'
      ],
      questions: [
        'What is the main problem in this area',
        'What keeps going wrong here',
        'Who owns this area today',
        'What is the biggest gap right now',
        'What would good look like here'
      ],
      evidence: [
        'Current procedure or standard',
        'Recent records from this area',
        'Relevant site data',
        'Owner or stakeholder input'
      ],
      suggestedFixes: [
        {
          title: 'Set one clear owner',
          summary: 'Make one person clearly responsible for reviewing the gap and closing the follow up actions.',
          howTo: [
            'Confirm the owner for the area',
            'Define the main gap clearly',
            'Set the first corrective action',
            'Review progress weekly'
          ],
          clientNeeds: [
            'Named owner',
            'Current process detail',
            'Recent examples'
          ],
          evidence: [
            'Owner confirmed',
            'Gap statement',
            'Action tracker'
          ]
        }
      ]
    };
  }

  return (moduleNames || []).map(function(moduleName) {
    const fallback = pickFallback(moduleName);

    return createAction(
      moduleName,
      fallback.purpose,
      fallback.checks,
      fallback.questions,
      fallback.evidence,
      [],
      fallback.suggestedFixes
    );
  });
}
async function generateAIModuleActions(moduleNames, projectName) {
  if (!moduleNames || !moduleNames.length) {
    return [];
  }

  const prompt = `
You are helping an engineering consultancy build practical project action templates for manufacturing and engineering improvement work.

Project title:
${projectName}

Selected service modules:
${moduleNames.join(', ')}

Return JSON only.
Return an array of objects.
Each object must have:
title
purpose
checks
questions
evidence
redFlags
suggestedFixes

Rules:
- Keep title short and practical
- Purpose must be one plain English sentence
- checks must be 4 to 6 items
- questions must be 4 to 6 items
- evidence must be 3 to 5 items
- redFlags must be 3 to 5 items
- suggestedFixes must be 4 to 6 items
- Use practical engineering and site language
- No fluff
- No generic management speak
- Make it useful for a real site assessment
- Make each item short and direct
- suggestedFixes must be objects, not plain strings
- Each suggested fix object must have:
  title
  summary
  howTo
  clientNeeds
  evidence
- summary must explain what the fix means in plain English
- howTo must be 3 to 5 practical steps
- clientNeeds must be 2 to 4 things the client needs to provide, put in place, buy, confirm, or organise
- evidence must be 2 to 4 items to keep as proof
- Do not return placeholder wording
- Do not say more detail has not been added yet
- Make the fix detail directly usable on site

Example format:
[
  {
    "title": "PM Job List Review",
    "purpose": "Review and rebuild the PM job list so it is practical and usable.",
    "checks": [
      "Check whether all key assets have PM tasks",
      "Check whether PM frequencies make sense"
    ],
    "questions": [
      "Who owns the PM system today",
      "What PM work is missed most often"
    ],
    "evidence": [
      "PM task list",
      "Asset register"
    ],
    "redFlags": [
      "High overdue PMs",
      "No PM ownership"
    ],
    "suggestedFixes": [
      {
        "title": "Build the PM job list",
        "summary": "Create a clear PM job list so each key asset has the right planned task and frequency.",
        "howTo": [
          "List all key assets",
          "Group similar equipment",
          "Write the main PM task for each asset",
          "Set the right frequency",
          "Review with engineering and production"
        ],
        "clientNeeds": [
          "Asset list",
          "Current PM list",
          "Known breakdown history"
        ],
        "evidence": [
          "Updated PM list",
          "Approved frequency table"
        ]
      }
    ]
  }
]
`;

  try {
    const response = await puter.ai.chat(prompt, {
      model: "gpt-5.4-nano"
    });

    let raw = typeof response === 'string' ? response : String(response || '').trim();
    let parsed = [];

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
  .filter(function(action) {
    return action && action.title && action.purpose;
  })
  .map(function(action) {
    return createAction(
      String(action.title || '').trim(),
      String(action.purpose || '').trim(),
      Array.isArray(action.checks) ? action.checks.map(String) : [],
      Array.isArray(action.questions) ? action.questions.map(String) : [],
      Array.isArray(action.evidence) ? action.evidence.map(String) : [],
      Array.isArray(action.redFlags) ? action.redFlags.map(String) : [],
      Array.isArray(action.suggestedFixes)
  ? action.suggestedFixes.map(function(fix) {
      if (typeof fix === 'string') {
        return fix;
      }

      return {
        title: String(fix.title || '').trim(),
        summary: String(fix.summary || '').trim(),
        howTo: Array.isArray(fix.howTo) ? fix.howTo.map(String) : [],
        clientNeeds: Array.isArray(fix.clientNeeds) ? fix.clientNeeds.map(String) : [],
        evidence: Array.isArray(fix.evidence) ? fix.evidence.map(String) : []
      };
    })
  : []

    );
  });
  } catch (error) {
    console.error('AI action generation failed:', error);
    return [];
  }
}

function exportClientReport() {
  const client = getClientById(selectedAdminClientId);
  if (!client) {
    alert('No client selected.');
    return;
  }

  const actionsHtml = (client.actions || []).map(function(action) {
    const concerns = []
      .concat(Array.isArray(action.concernsFound) ? action.concernsFound : [])
      .concat(Array.isArray(action.autoConcerns) ? action.autoConcerns : []);

    const nextSteps = getActionAllNextSteps(action);
    const status = getAreaStatusLabel(action);

    let findingText = 'No major concern has been logged for this area yet.';
    if (concerns.length > 0) {
      findingText = concerns[0];
    }

    let recommendationText = 'Continue review and confirm whether this area needs further action.';
    if (nextSteps.length > 0) {
      recommendationText = nextSteps[0].summary || nextSteps[0].title || recommendationText;
    }

    let clientNeedText = 'Further discussion may be needed to confirm the next action.';
    if (Array.isArray(nextSteps[0]?.whatToCollect) && nextSteps[0].whatToCollect.length > 0) {
      clientNeedText = nextSteps[0].whatToCollect.slice(0, 3).join(', ');
    }

    let priorityText = 'Low';
    if (status.text === 'Needs Attention') priorityText = 'High';
    else if (status.text === 'In Progress') priorityText = 'Medium';

    return `
      <section style="margin-bottom: 28px; padding: 18px 0; border-bottom: 1px solid #d6dbe3;">
        <h2 style="margin: 0 0 8px; font-size: 22px; color: #0f172a;">${escapeHtml(action.title || '')}</h2>
        <p style="margin: 0 0 12px; color: #475569;"><strong>Purpose:</strong> ${escapeHtml(action.purpose || '')}</p>

        <div style="margin-bottom: 10px;">
          <strong style="color: #0f172a;">Finding</strong>
          <p style="margin: 4px 0 0; color: #1e293b;">${escapeHtml(findingText)}</p>
        </div>

        <div style="margin-bottom: 10px;">
          <strong style="color: #0f172a;">Recommendation</strong>
          <p style="margin: 4px 0 0; color: #1e293b;">${escapeHtml(recommendationText)}</p>
        </div>

        <div style="margin-bottom: 10px;">
          <strong style="color: #0f172a;">What we need from you</strong>
          <p style="margin: 4px 0 0; color: #1e293b;">${escapeHtml(clientNeedText)}</p>
        </div>

        <div>
          <strong style="color: #0f172a;">Priority</strong>
          <p style="margin: 4px 0 0; color: #1e293b;">${escapeHtml(priorityText)}</p>
        </div>
      </section>
    `;
  }).join('');

  const urgentActions = (client.actions || [])
    .filter(function(action) {
      return getAreaStatusLabel(action).text === 'Needs Attention';
    })
    .slice(0, 5)
    .map(function(action) {
      const nextSteps = getActionAllNextSteps(action);
      return `
        <li style="margin-bottom: 8px;">
          <strong>${escapeHtml(action.title || '')}:</strong>
          ${escapeHtml(nextSteps[0]?.title || 'Review and close the gap in this area.')}
        </li>
      `;
    }).join('');

      const logoHtml = `
      <div style="position: absolute; left: -30px; top: -25px; z-index: 2;">
        <img src="logo.png" alt="Prime Engineering Solutions Logo" style="height: 300px; width: auto; object-fit: contain;" onerror="this.style.display='none';">
      </div>
    `;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(client.clientName || 'Client')} Recommendation Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #111827;
          line-height: 1.5;
          background: #ffffff;
        }

        .report-wrap {
          max-width: 1000px;
          margin: 0 auto;
        }

        .report-header {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 20px;
  border-bottom: 2px solid #2563eb;
  padding: 20px 0 18px 0;
  margin-bottom: 28px;
  min-height: 220px;
}

        .report-title {
          text-align: right;
        }

        .report-title h1 {
          margin: 0 0 6px;
          font-size: 30px;
          color: #0f172a;
        }

        .report-title p {
          margin: 2px 0;
          color: #475569;
          font-size: 14px;
        }

        .summary-box {
          background: #f8fafc;
          border: 1px solid #dbe3ee;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 24px;
        }

        h2, h3 {
          color: #0f172a;
        }

        p, li {
          font-size: 14px;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(220px, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        .meta-card {
          background: #f8fafc;
          border: 1px solid #dbe3ee;
          border-radius: 10px;
          padding: 12px;
        }

        .footer-note {
          margin-top: 32px;
          font-size: 13px;
          color: #475569;
          border-top: 1px solid #d6dbe3;
          padding-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="report-wrap">
        <div class="report-header">
  ${logoHtml}

  <div class="report-title">
            <h1>Client Recommendation Report</h1>
            <p><strong>Date:</strong> ${escapeHtml(getTodayLongDate())}</p>
            <p><strong>Prepared by:</strong> Dwayne Nelson</p>
            <p><strong>Company:</strong> Prime Engineering Solutions</p>
          </div>
        </div>

        <div class="summary-box">
          <h2 style="margin-top: 0;">Project Summary</h2>
          <div class="meta-grid">
            <div class="meta-card"><strong>Client</strong><br>${escapeHtml(client.clientName || '')}</div>
            <div class="meta-card"><strong>Project</strong><br>${escapeHtml(client.projectName || '')}</div>
            <div class="meta-card"><strong>Status</strong><br>${escapeHtml(client.status || '')}</div>
            <div class="meta-card"><strong>Overall Progress</strong><br>${getClientProgress(client)}%</div>
          </div>
        </div>

        <div class="summary-box">
          <h2 style="margin-top: 0;">Executive Summary</h2>
          <p>
            This report gives a practical view of the main gaps found so far, along with the recommendations needed to move the project forward in a controlled way.
            The focus is on clear actions, real site needs, and what should be prioritised first.
          </p>
        </div>

        <div>
          ${actionsHtml}
        </div>

        <div class="summary-box">
          <h2 style="margin-top: 0;">Immediate Priority Actions</h2>
          ${
            urgentActions
              ? `<ul>${urgentActions}</ul>`
              : '<p>No urgent actions are currently logged.</p>'
          }
        </div>

        <div class="footer-note">
          This report was prepared by Dwayne Nelson on behalf of Prime Engineering Solutions.
        </div>
      </div>
    </body>
    </html>
  `;

  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    alert('Please allow popups to export the report.');
    return;
  }

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
}

function clearSuggestedModules() {
  const listWrap = document.getElementById('suggested-modules-list');
  if (!listWrap) return;
  listWrap.innerHTML = '';
  clearMessage('create-client-message');
}