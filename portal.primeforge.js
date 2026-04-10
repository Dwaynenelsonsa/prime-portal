const PRIME_FORGE_BASE_URL = 'http://127.0.0.1:8000';

async function callPrimeForge(task, prompt, extraPayload) {
  const payload = {
    task: task,
    prompt: prompt,
    model_type: 'fast',
    ...(extraPayload || {})
  };

  const response = await fetch(PRIME_FORGE_BASE_URL + '/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Prime Forge request failed with status ' + response.status);
  }

  const data = await response.json();

  if (!data || !data.ok) {
    throw new Error((data && data.error) || 'Prime Forge returned an invalid response');
  }

  return String(data.response || '').trim();
}

function parseJsonFromPrimeForge(raw, fallbackType) {
  const text = String(raw || '').trim();

  if (!text) {
    return fallbackType === 'array' ? [] : null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    if (fallbackType === 'array') {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
      return [];
    }

    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    return null;
  }
}

async function primeForgeSuggestModules(scopePoints) {
  const prompt = `
You are helping build a simple engineering support project.

Read the client issues and suggest only the most relevant workstreams and modules.

Client issues:
${scopePoints}

Rules:
Return an array of workstream groups
Use max 3 workstreams
Name them exactly: "Workstream 1", "Workstream 2", "Workstream 3"
Use plain everyday English
Write so anyone can understand it
Do not use jargon, consultant words, or management language
Do not guess problems that are not clearly written
If there is only one issue, stay focused on that one issue
If there are multiple issues, only cover those issues
Prefer fewer modules over too many
Keep workstream labels short and easy to understand
Keep module names short, clear, and practical
Do not use words like baseline, governance, triage, cadence, framework, ownership mapping, or capacity model
Each module must describe a real task somebody can go and do
Avoid vague words like structure, basics, setup, optimise, improve, template, framework
Use simple site language
Prefer modules like "List equipment", "Set PM timing", "Create job types", "Train first users"
Every module should sound like a practical action
If a module is too vague, rewrite it into a clear task
Every title must make sense to a normal person
When in doubt, reduce scope instead of expanding it

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

  const raw = await callPrimeForge('suggest_modules', prompt);
  return parseJsonFromPrimeForge(raw, 'array');
}

async function primeForgeGenerateActions(projectName, moduleNames) {
  const prompt = `
You are building advanced engineering and operational review workstreams for a real consultancy project.

Project title:
${projectName}

Selected service modules:
${moduleNames.join(', ')}

Return JSON only.
Return an array of objects.
Each object must have:
title
purpose
impactType
checks
questions
evidence
redFlags
suggestedFixes

Allowed impactType values only:
safety
production_stop
compliance
quality
recurring_failure
cost
production_risk
improvement

Priority intent behind those impact types:
safety = immediate health and safety risk
production_stop = active production stoppage or immediate severe output loss
compliance = active statutory, legal, or compliance risk
quality = product or quality failure risk
recurring_failure = repeat breakdown or repeat loss pattern
cost = major waste, cost, or efficiency loss
production_risk = high risk of near term disruption to production
improvement = longer term improvement, structure, training, or control gap

Critical rules:
Return a maximum of 4 actions total
Prefer 3 strong actions over 4 weak actions
Each action must be a distinct workstream with clear separation
Do not create overlapping actions
Do not repeat the same idea with slightly different wording
Do not create shallow actions that are only document gathering, awareness, communication, or planning unless the issue clearly requires that as a distinct workstream
Do not create generic filler actions
Do not create vague actions with titles like review, update, improve, prepare, support, alignment, awareness, framework, setup, basics, documentation review, or action plan unless the title is made specific to the operational gap
Do not return duplicate compliance actions just because the topic mentions audit or safety
Do not make every action P1 in disguise by overusing impactType values like safety or compliance
Use P1 type impact only where the issue is immediate, exposed, and serious
Use P2 type impact where the issue creates clear operational, quality, cost, or repeat failure risk
Use P3 type impact where the issue is improvement, structure, training, or longer term control

Action design rules:
Keep title short, concrete, and site realistic
Purpose must be one plain English sentence and must explain what the workstream is trying to control or fix
checks must be 3 to 5 items
questions must be 3 to 5 items
evidence must be 2 to 4 items
redFlags must be 2 to 4 items
suggestedFixes must be 1 to 2 items only
Each action must sound like a real engineering, compliance, audit, maintenance, reliability, quality, or operational workstream
Use practical site language
No consultant fluff
No vague management language
No generic admin filler
No placeholder wording
No broad client review actions
No general support plan actions
No generic awareness review actions unless the issue is clearly training or behavioural
If the issue is narrow, stay narrow
If the issue is urgent, focus on containment and control first
If the issue is audit related, focus on real controls, records, ownership, evidence, statutory gaps, and inspection readiness
If the issue is reliability related, focus on assets, failure patterns, PM, RCA, ownership, and closeout
If the issue is safety related, focus on hazards, controls, training, permits, isolation, contractor control, inspections, and legal readiness where relevant

Specificity rules:
Every check must describe a real control to confirm
Every question must help uncover a real operational gap
Every evidence item must be a real record, proof point, or physical control
Every red flag must describe a real failure mode or weak control
Avoid repeated wording like:
Check completeness and accuracy
Ensure regular updates
Are staff aware of responsibilities
Verify records exist
Prepare documentation
If you are about to write one of those, rewrite it into something specific and operational

suggestedFixes rules:
suggestedFixes must be objects, not plain strings
Each suggested fix object must have:
title
summary
howTo
clientNeeds
evidence
summary must explain what the fix means in plain English
howTo must be 3 to 5 practical steps
clientNeeds must be 2 to 4 concrete things the client must provide, confirm, assign, buy, organise, or put in place
evidence must be 2 to 4 concrete proof items
Make each suggested fix directly usable on site

Output quality rules:
Return only strong workstreams
Reject weak or repetitive workstreams internally before answering
Do not pad the answer to reach 4 actions
Fewer is better if the issue is focused

Example of the standard expected:
[
  {
    "title": "Site Safety Control Gap Review",
    "purpose": "Identify where site safety controls are missing, weak, or not being followed so immediate exposure can be reduced.",
    "impactType": "safety",
    "checks": [
      "Check whether live site hazards have current risk assessments",
      "Check whether high risk tasks have clear controls in place",
      "Check whether unsafe conditions are being tolerated on the floor",
      "Check whether supervisors are actively enforcing controls"
    ],
    "questions": [
      "What unsafe conditions are currently accepted as normal",
      "Which work areas would fail an inspection today",
      "Who owns daily safety control on site",
      "What hazards have not been closed properly"
    ],
    "evidence": [
      "Current risk assessments",
      "Open hazard list",
      "Supervisor inspection records"
    ],
    "redFlags": [
      "No current risk assessments for live hazards",
      "Unsafe conditions left open",
      "No clear control ownership"
    ],
    "suggestedFixes": [
      {
        "title": "Close the exposed safety gaps first",
        "summary": "Act on the unsafe conditions and missing controls first so the site is not left exposed while the wider system is being rebuilt.",
        "howTo": [
          "List the immediate unsafe conditions",
          "Assign one owner to each exposed gap",
          "Set the first containment actions",
          "Check closure on the floor",
          "Record evidence of closure"
        ],
        "clientNeeds": [
          "Named site owner",
          "Access to open hazard list",
          "Supervisor time for floor verification"
        ],
        "evidence": [
          "Closed hazard tracker",
          "Photos or inspection proof",
          "Owner signoff"
        ]
      }
    ]
  }
]
`;

  const raw = await callPrimeForge('generate_actions', prompt);
  return parseJsonFromPrimeForge(raw, 'array');
}

async function primeForgeGenerateNextStep(client, action, reviewPoint) {
  const notes = String(reviewPoint.notes || '').trim();
  const status = reviewPoint.status || 'unanswered';

  const prompt = `
You are helping Prime Engineering Solutions give a practical fix for a failed review point.

Company style:
plain English
practical
direct
no vague wording
no consultant fluff
sound like a real engineering advisor

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
be specific to this issue
do not use generic lines like "check the current situation"
name the actual records, owners, controls, or actions where possible
if web search is not needed, still give a strong practical answer
keep it grounded for engineering, maintenance, reliability, audit, stores, planning, contractor control, shutdowns, compliance, business, operations, or people issues
if the point is outside engineering scope, still give a practical business answer
do not invent system names, forms, database names, departments, or document titles
if a detail is unknown, say exactly what needs to be confirmed instead of making it up
keep the action tightly linked to the failed review point only

Return JSON only in this format:
{
  "title": "short action title tied to the failed point",
  "summary": "plain English meaning with no made up details",
  "howTo": ["step 1", "step 2", "step 3"],
  "whatToCollect": ["item 1", "item 2"],
  "goodLooksLike": "one plain English sentence"
}
`;

  const raw = await callPrimeForge('generate_next_step', prompt);
  return parseJsonFromPrimeForge(raw, 'object');
}