const STORAGE_KEY = 'primePortalClients';
const SESSION_KEY = 'primePortalSession';
const PRIME_PORTAL_BACKEND_URL = '/api';

let portalClientsCache = [];
let portalClientsLoaded = false;

async function preloadPortalClients() {
  try {
    const response = await fetch(PRIME_PORTAL_BACKEND_URL + '/clients');

    if (!response.ok) {
      throw new Error('Client preload failed with status ' + response.status);
    }

    const data = await response.json();
    const clients = data && Array.isArray(data.clients) ? data.clients : [];

    portalClientsCache = clients;
    portalClientsLoaded = true;
    return portalClientsCache;
  } catch (err) {
    console.error('Failed to preload clients from backend:', err);
    portalClientsCache = [];
    portalClientsLoaded = true;
    return portalClientsCache;
  }
}

async function persistPortalClients() {
  const response = await fetch(PRIME_PORTAL_BACKEND_URL + '/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clients: portalClientsCache
    })
  });

  if (!response.ok) {
    throw new Error('Client save failed with status ' + response.status);
  }

  const data = await response.json();

  if (!data || !data.ok) {
    throw new Error((data && data.error) || 'Client save failed');
  }

  return data;
}

function saveClients(clients) {
  portalClientsCache = Array.isArray(clients) ? clients : [];
  portalClientsLoaded = true;

  return persistPortalClients().catch(function(err) {
    console.error('Failed to save clients to backend:', err);
    throw err;
  });
}

function getClients() {
  if (!portalClientsLoaded) {
    console.warn('getClients() called before preloadPortalClients() finished. Returning current cache.');
  }

  return portalClientsCache;
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getClientById(clientId) {
  return getClients().find(function(client) {
    return client.clientId === clientId;
  }) || null;
}

function updateClient(clientId, updater) {
  const clients = getClients();
  const index = clients.findIndex(function(client) {
    return client.clientId === clientId;
  });

  if (index === -1) return null;
  updater(clients[index]);
  saveClients(clients);
  return clients[index];
}

function getActionById(client, actionId) {
  return client.actions.find(function(action) {
    return action.id === actionId;
  }) || null;
}

function getActionTrackableItems(action) {
  return []
    .concat(Array.isArray(action.reviewPoints) ? action.reviewPoints : [])
    .concat(Array.isArray(action.evidence) ? action.evidence : []);
}

function getActionCompletedCount(action) {
  return getActionTrackableItems(action).filter(function(item) {
    return item.checked || (item.status && item.status !== 'unanswered');
  }).length;
}

function getActionTotalCount(action) {
  return getActionTrackableItems(action).length;
}

function getActionOpenCount(action) {
  return getActionTotalCount(action) - getActionCompletedCount(action);
}

function getActionProgress(action) {
  const total = getActionTotalCount(action);
  if (!total) return 0;
  return Math.round((getActionCompletedCount(action) / total) * 100);
}

function getActionNextStepCount(action) {
  const manual = Array.isArray(action.nextSteps) ? action.nextSteps.length : 0;
  const auto = Array.isArray(action.autoNextSteps) ? action.autoNextSteps.length : 0;
  return manual + auto;
}

function getActionAllNextSteps(action) {
  const manual = Array.isArray(action.nextSteps)
    ? action.nextSteps.map(function(text) {
        return {
          title: text,
          summary: text,
          howTo: [],
          whatToCollect: [],
          goodLooksLike: ''
        };
      })
    : [];

  const auto = Array.isArray(action.autoNextSteps)
    ? action.autoNextSteps.map(function(step) {
        return {
          title: step.title || 'Next step',
          summary: step.summary || '',
          howTo: Array.isArray(step.howTo) ? step.howTo : [],
          whatToCollect: Array.isArray(step.whatToCollect) ? step.whatToCollect : [],
          goodLooksLike: step.goodLooksLike || ''
        };
      })
    : [];

  return manual.concat(auto);
}

function getActionEvidenceGuidance(action) {
  const items = [];

  if (Array.isArray(action.autoNextSteps)) {
    action.autoNextSteps.forEach(function(step) {
      if (Array.isArray(step.whatToCollect)) {
        step.whatToCollect.forEach(function(row) {
          items.push(row);
        });
      }
    });
  }

  return Array.from(new Set(items));
}

function getClientCompletedCount(client) {
  return client.actions.reduce(function(total, action) {
    return total + getActionCompletedCount(action);
  }, 0);
}

function getClientTotalCount(client) {
  return client.actions.reduce(function(total, action) {
    return total + getActionTotalCount(action);
  }, 0);
}

function getClientOpenCount(client) {
  return getClientTotalCount(client) - getClientCompletedCount(client);
}

function getClientProgress(client) {
  const total = getClientTotalCount(client);
  if (!total) return 0;
  return Math.round((getClientCompletedCount(client) / total) * 100);
}

function getClientConcernCount(client) {
  if (!client || !Array.isArray(client.actions)) return 0;

  return client.actions.reduce(function(total, action) {
    const manual = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
    const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
    return total + manual + auto;
  }, 0);
}

function getClientStartedCount(client) {
  return client.actions.filter(function(action) {
    const manualConcerns = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
    const autoConcerns = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
    const concerns = manualConcerns + autoConcerns;
    const nextSteps = getActionNextStepCount(action);

    return getActionCompletedCount(action) > 0 || concerns > 0 || nextSteps > 0;
  }).length;
}

function getClientsNeedingAttention(clients) {
  return clients.filter(function(client) {
    return getClientConcernCount(client) > 0;
  }).length;
}

function getAverageProgress(clients) {
  if (!clients.length) return 0;
  const total = clients.reduce(function(sum, client) {
    return sum + getClientProgress(client);
  }, 0);
  return Math.round(total / clients.length);
}

function getAreaStatusLabel(action) {
  const progress = getActionProgress(action);
  const manual = Array.isArray(action.concernsFound) ? action.concernsFound.length : 0;
  const auto = Array.isArray(action.autoConcerns) ? action.autoConcerns.length : 0;
  const concerns = manual + auto;

  if (progress === 100 && concerns === 0) return { text: 'Complete', className: 'pill pill-good' };
  if (concerns > 0) return { text: 'Needs Attention', className: 'pill pill-bad' };
  if (progress > 0) return { text: 'In Progress', className: 'pill pill-warn' };
  return { text: 'Not Started', className: 'pill' };
}

function updateClientStatus(clientId) {
  updateClient(clientId, function(client) {
    const progress = getClientProgress(client);
    const concerns = getClientConcernCount(client);

    if (progress === 100 && concerns === 0) {
      client.status = 'Complete';
    } else if (concerns > 0) {
      client.status = 'Review';
    } else {
      client.status = 'In Progress';
    }
  });
}
