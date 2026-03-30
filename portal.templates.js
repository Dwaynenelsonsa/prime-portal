function item(text, category) {
  return {
    id: generateUniqueItemId(),
    text: text,
    category: category || 'General',
    checked: false,
    status: 'unanswered',
    notes: '',
    source: 'template'
  };
}

function createAction(title, purpose, checks, questions, evidence, redFlags, suggestedFixes) {
  const reviewPoints = []
    .concat((checks || []).map(function(text) {
      return item(text, 'Review');
    }))
    .concat((questions || []).map(function(text) {
      return item(text, 'Review');
    }));

  return {
    id: generateUniqueActionId(),
    title: title,
    purpose: purpose,
    reviewPoints: reviewPoints,
    evidence: evidence.map(function(text) {
      return item(text, 'Evidence');
    }),
    redFlags: redFlags.slice(),
    suggestedFixes: (suggestedFixes || []).slice(),
    concernsFound: [],
    autoConcerns: [],
    nextSteps: [],
    internalNotes: ''
  };
}

function getCoreActionTemplate() {
  return [
    createAction(
      'Kickoff and scope check',
      'Set the project boundaries, pain points, expectations, and decision owners before you go deep.',
      ['Confirm scope of work', 'Confirm priority pain points', 'Confirm site contacts', 'Confirm access to documents and systems', 'Confirm timeline and deliverables'],
      ['What is hurting performance most right now?', 'What keeps repeating?', 'What result would make this project a win?', 'Who signs off decisions?', 'What is out of scope?'],
      ['Proposal or quote', 'Org chart', 'Asset list', 'Downtime summary', 'Site contact list'],
      ['Scope not clear', 'Too many priorities', 'No owner for decisions', 'No access to documents', 'Different people saying different things']
    ),
    createAction(
      'Safety and compliance review',
      'Check whether the engineering setup is safe, controlled, and legally covered where needed.',
      ['Review LOTO or isolation process', 'Check permit to work', 'Check contractor control', 'Check statutory inspections', 'Check incident and near miss records'],
      ['Who owns permits?', 'How are contractors controlled?', 'What compliance tasks are mandatory?', 'What gets missed under pressure?', 'What safety issues repeat?'],
      ['Permit forms', 'Isolation procedure', 'Inspection certs', 'Training records', 'Incident log'],
      ['Broken isolation control', 'Expired inspections', 'Poor contractor paperwork', 'Weak signoff', 'Safety shortcuts during breakdowns']
    ),
    createAction(
      'Site walkthrough and line observation',
      'Walk the plant properly and observe how the engineering and production reality matches what people say.',
      ['Walk the critical lines', 'Observe condition of equipment', 'Check cleanliness and access', 'Look at engineering workshop and stores', 'Watch operator and engineering interaction'],
      ['Which line hurts most when down?', 'Where do jobs get delayed?', 'What equipment is always causing trouble?', 'What is being worked around?', 'What is being ignored?'],
      ['Photos if allowed', 'Layout drawings', 'Line list', 'Current open jobs'],
      ['Unsafe workarounds', 'Poor housekeeping', 'Chronic leaks or damage', 'Blocked access', 'Visible neglected equipment']
    ),
    createAction(
      'Asset criticality review',
      'Work out which assets matter most to output, safety, quality, and compliance.',
      ['Identify production critical assets', 'Check quality critical assets', 'Check safety critical assets', 'Check no backup assets', 'Check long lead time assets'],
      ['If this stops, what happens?', 'Is there a backup?', 'What is the cost of downtime?', 'What is the quality impact?', 'What is the safety impact?'],
      ['Asset register', 'Downtime data', 'Spares list', 'Lead times', 'Line dependency map'],
      ['No clear critical asset ranking', 'Everything treated as priority', 'No backup for key equipment', 'Critical spares not held']
    ),
    createAction(
      'Breakdown history review',
      'Look at repeat failures, downtime trends, bad actors, and where the site keeps getting dragged into firefighting.',
      ['Review top downtime causes', 'Review repeat failures', 'Check line level trends', 'Check time to repair', 'Check emergency job pattern'],
      ['What fails most often?', 'What costs the most downtime?', 'What faults keep coming back?', 'What has already been tried?', 'What gets fixed short term only?'],
      ['Downtime reports', 'CMMS work orders', 'Shift logs', 'Breakdown Pareto'],
      ['No reliable breakdown data', 'Same failures recurring', 'No ownership of bad actors', 'No RCA on major failures']
    ),
    createAction(
      'PM and inspection review',
      'Check whether PMs and inspections exist, make sense, and actually help prevent failure.',
      ['Review PM library', 'Check PM quality', 'Check intervals', 'Check inspection routes', 'Check compliance PMs'],
      ['Which PMs are useful?', 'Which PMs are just box ticking?', 'Which assets have no PM?', 'What PMs get skipped first?', 'Are PMs reviewed after failures?'],
      ['PM tasks', 'Completion reports', 'Overdue PM report', 'Inspection sheets', 'Asset list'],
      ['Poor PM task quality', 'Wrong intervals', 'No PM on critical assets', 'High overdue levels', 'No link to failure history']
    ),
    createAction(
      'Work order and backlog review',
      'Check how work is raised, prioritised, and whether backlog is healthy or just a dump of old jobs.',
      ['Review open work orders', 'Check age of backlog', 'Review priority codes', 'Check quality of job descriptions', 'Check repeat jobs'],
      ['How is backlog reviewed?', 'What sits open too long?', 'How are priorities set?', 'Is backlog cleaned regularly?', 'What jobs never get planned?'],
      ['Backlog report', 'Sample work orders', 'Priority code guide', 'Weekly review notes'],
      ['Old junk backlog', 'Weak job descriptions', 'No clear priorities', 'Too much reactive work', 'Repeat jobs not challenged']
    ),
    createAction(
      'Planning and scheduling review',
      'Check whether work is properly prepared, scheduled, and protected or constantly blown apart by reactive chaos.',
      ['Review planner role', 'Check weekly schedule', 'Check job readiness', 'Check labour loading', 'Check schedule compliance'],
      ['Who plans work?', 'Who schedules work?', 'How often does the schedule collapse?', 'Are parts ready before work starts?', 'How much planned work gets interrupted?'],
      ['Weekly schedule', 'Job packs', 'Schedule compliance report', 'Labour plan', 'Delay logs'],
      ['No real planner function', 'Work starts without parts', 'Schedule changes constantly', 'No frozen schedule window']
    ),
    createAction(
      'Stores and critical spares review',
      'Check whether the stores setup protects uptime or makes reactive work worse.',
      ['Review critical spares list', 'Check stock accuracy', 'Check min and max settings', 'Check obsolete stock', 'Check emergency buying'],
      ['Which parts hurt most when missing?', 'Who owns spares decisions?', 'How accurate is stock?', 'What gets bought in panic mode?', 'What is held with no reason?'],
      ['Critical spares list', 'Stock records', 'Issue history', 'Supplier lead times', 'Emergency purchase records'],
      ['Missing critical spares', 'Poor stock accuracy', 'No min and max logic', 'Too many emergency buys', 'Stores not trusted']
    ),
    createAction(
      'Contractor control review',
      'Check whether contractor work is controlled, safe, documented, and tied into engineering properly.',
      ['Review contractor onboarding', 'Check permits and RAMS', 'Check supervision approach', 'Check contractor performance follow up', 'Check signoff and closeout'],
      ['Who approves contractor work?', 'Who checks their documents?', 'How are they supervised?', 'How are issues escalated?', 'How is work signed off?'],
      ['Contractor files', 'RAMS', 'Permits', 'Induction records', 'Contractor job history'],
      ['Poor contractor paperwork', 'No supervision', 'Weak signoff', 'Unclear ownership', 'Contractors working outside process']
    ),
    createAction(
      'CMMS and data quality review',
      'Check whether the system data can actually be trusted for planning, reporting, and decision making.',
      ['Review asset hierarchy', 'Check naming consistency', 'Check work order closeout quality', 'Check failure coding', 'Check BOM and parts links'],
      ['Can you trust the reports?', 'Are assets duplicated?', 'Are closeout comments useful?', 'Can you track bad actors properly?', 'Is data entered consistently?'],
      ['CMMS asset tree', 'Sample work orders', 'Failure code list', 'BOM records', 'Report outputs'],
      ['Dirty asset data', 'Duplicate assets', 'Weak closeout comments', 'No useful coding', 'Reports not trusted']
    ),
    createAction(
      'KPI and reporting baseline',
      'Check what the site measures today and whether those KPIs are useful or just noise.',
      ['Review downtime KPIs', 'Review PM compliance', 'Review backlog KPIs', 'Review MTTR or MTBF if used', 'Check reporting cadence'],
      ['What KPIs matter to management?', 'What gets reviewed weekly?', 'What is missing from reports?', 'What numbers are not trusted?', 'What drives action?'],
      ['KPI reports', 'Weekly review decks', 'Shift reports', 'Engineering meeting notes'],
      ['Too many KPIs', 'No action from reports', 'No baseline', 'Manual reporting errors', 'Different reports show different stories']
    ),
    createAction(
      'Skills and structure review',
      'Check whether the team setup, roles, skills, and meeting rhythm are strong enough to support the work.',
      ['Review team structure', 'Check role clarity', 'Check supervisor or planner coverage', 'Check training matrix', 'Check meeting rhythm'],
      ['Who owns what?', 'Where are the skills gaps?', 'Is there enough planning support?', 'How are apprentices or juniors supported?', 'What meetings actually help?'],
      ['Org chart', 'Training matrix', 'Shift roster', 'Role descriptions', 'Meeting schedule'],
      ['Blurred roles', 'No training plan', 'No planner support', 'Too much dependency on one person', 'Weak handovers']
    ),
    createAction(
      'Root cause and repeat failure review',
      'Check whether repeat problems are being properly challenged or just patched over again and again.',
      ['Review repeat failure list', 'Check RCA use', 'Check follow through on actions', 'Check bad actor ownership', 'Check learning from major breakdowns'],
      ['What failures keep coming back?', 'Do you use RCA properly?', 'Who owns closeout?', 'Which actions stay open too long?', 'What is being patched short term only?'],
      ['RCA reports', 'Repeat failure logs', 'Action trackers', 'Downtime trend reports'],
      ['No RCA culture', 'Repeat failures accepted as normal', 'Actions not closed', 'No owner for bad actors']
    ),
    createAction(
      'Findings summary',
      'Pull the review into a clear picture of the main gaps, risks, and priorities.',
      ['Group key findings', 'Separate urgent from important', 'Link findings to business impact', 'Check evidence for each point', 'Prepare summary view'],
      ['What are the top 5 issues?', 'What needs immediate action?', 'What can wait?', 'What is causing the most waste?', 'What will management care about most?'],
      ['Site notes', 'Photos if allowed', 'Reports reviewed', 'Action list', 'Interview notes'],
      ['Too much detail with no priorities', 'Weak link to impact', 'No clear next step', 'Findings too vague']
    ),
    createAction(
      '30 60 90 day action plan',
      'Turn the findings into a practical next step plan with ownership and timing.',
      ['Set quick wins', 'Set 60 day system fixes', 'Set 90 day stabilisation actions', 'Assign owners', 'Set review points'],
      ['What can be fixed in 30 days?', 'What needs more time?', 'Who owns each action?', 'What support is needed?', 'How will progress be reviewed?'],
      ['Findings summary', 'Action tracker', 'Priority list', 'Resource view'],
      ['Too many actions', 'No owners', 'No timing', 'No review rhythm', 'Plan too vague to use']
    )
  ];
}

function getTemplatePack(templateName) {
  if (templateName === 'Reliability Improvement') {
    return [
      createAction('Failure mode review', 'Review how key assets fail and whether current controls match actual failure modes.', ['Check key failure modes', 'Check failure patterns', 'Check maintenance strategy match'], ['How do these assets usually fail?', 'What are the dominant failure modes?'], ['Failure history', 'RCA records'], ['Strategy does not match real failure mode']),
      createAction('Bad actor list', 'Identify the assets causing the highest pain and make sure they are being managed properly.', ['Rank top bad actors', 'Check ownership', 'Check current actions'], ['Which 5 assets create most pain?', 'Who owns them?'], ['Downtime Pareto', 'Bad actor tracker'], ['Same bad actors every month'])
    ];
  }

  if (templateName === 'Engineering Department Rebuild') {
    return [
      createAction('Roles and responsibilities', 'Review who owns what and where accountability is weak.', ['Check role clarity', 'Check overlap', 'Check gaps'], ['Who owns planning?', 'Who owns stores?', 'Who owns contractor control?'], ['Org chart', 'Role descriptions'], ['Nobody clearly owns key systems']),
      createAction('Training matrix', 'Check skills coverage and training gaps.', ['Review skill matrix', 'Check mandatory training', 'Check depth in key skills'], ['Where are the skill gaps?', 'Who can cover critical tasks?'], ['Training matrix'], ['One person dependency'])
    ];
  }

  if (templateName === 'PM System Rebuild') {
    return [
      createAction('PM task quality review', 'Check whether PM tasks are specific, useful, and practical.', ['Review sample PMs', 'Check task clarity'], ['Would a tech know what good looks like from this PM?'], ['PM library'], ['Vague PM instructions']),
      createAction('PM completion and overdue review', 'Check whether PM completion and overdue control is healthy.', ['Review completion rate', 'Review overdue trends'], ['What overdue PMs are on critical assets?'], ['PM reports'], ['Overdues accepted as normal'])
    ];
  }

  if (templateName === 'Stores and Parts Control') {
    return [
      createAction('Critical spares list', 'Check whether critical spares are clearly identified and justified.', ['Review critical spares list', 'Check ranking'], ['How were these classed as critical?'], ['Critical spares list'], ['No criticality logic']),
      createAction('Stock accuracy', 'Check whether the system matches the shelf.', ['Review counts', 'Spot check bins'], ['How often are counts done?'], ['Stock records'], ['System stock not trusted'])
    ];
  }

  if (templateName === 'Shutdown Readiness') {
    return [
      createAction('Scope freeze', 'Check whether shutdown scope is controlled.', ['Review scope list', 'Check freeze point'], ['Is scope still moving?'], ['Shutdown scope list'], ['Scope creep late in plan']),
      createAction('Job packs ready', 'Check work packs, method, and detail.', ['Review job packs', 'Check task clarity'], ['Are jobs ready to hand over?'], ['Job packs'], ['Jobs not ready to execute'])
    ];
  }

  return [];
}

function buildTemplateActions(modules) {
  const core = getCoreActionTemplate();
  let extras = [];
  (modules || []).forEach(function(moduleName) {
    extras = extras.concat(getTemplatePack(moduleName));
  });
  return core.concat(extras);
}

function getSelectedModules() {
  return Array.from(document.querySelectorAll('.module-checkbox:checked')).map(function(box) {
    return box.value;
  });
}