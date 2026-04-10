const PORTAL_PILLAR_LIBRARY = {
  business_management: {
    label: 'Business and Management',
    keywords: [
      'business',
      'strategy',
      'strategic',
      'budget',
      'budgeting',
      'cost',
      'costs',
      'spend',
      'profit',
      'loss',
      'margin',
      'margins',
      'roi',
      'return on investment',
      'capital',
      'capex',
      'opex',
      'financial',
      'finance',
      'cash',
      'cashflow',
      'revenue',
      'sales',
      'utilisation',
      'utilization',
      'budget compliance',
      'maintenance cost',
      'replacement asset value',
      'manager',
      'managers',
      'management',
      'kpi',
      'kpis',
      'target',
      'targets',
      'performance',
      'performance review',
      'scorecard',
      'scorecards',
      'follow through',
      'follow-through',
      'followed through',
      'action owner',
      'action owners',
      'ownership',
      'accountability',
      'missed target',
      'missed targets'
    ],
    themes: {
      findings: [
        'technical activity is not yet strongly tied back to business performance',
        'cost, budget, or asset value decisions may still be happening without a clear operational case',
        'the business impact of downtime, maintenance spend, or asset use is not fully visible'
      ],
      recommendations: [
        'link technical issues back to cost, uptime, output, and financial impact',
        'build a clear view of budget, cost drivers, and return on corrective action',
        'assign ownership for reviewing business impact alongside technical performance'
      ],
      next_steps: [
        'confirm the main business cost driver',
        'build a simple ROI or impact view',
        'review technical priorities against financial effect'
      ],
      implementation: [
        'start with the losses, delays, or spend lines causing the most business drag',
        'confirm the operational issue behind each cost line',
        'review whether the proposed action makes business as well as technical sense'
      ]
    },
    playbooks: {
      business_operating_control: {
        label: 'Business Operating Control Handbook',
        version: '1.0',
        sector: 'Cross Industry',
        operating_philosophy: [
          'treat business control as a live operating system, not a monthly reporting exercise',
          'link cost, budget, profit, cash, and strategy to named owners and corrective action',
          'use visible review cadence and evidence based challenge',
          'force action on the biggest commercial and financial risks first'
        ],
        control_areas: [
          {
            key: 'market_standing',
            label: 'Market Standing',
            controls: [
              'market share position',
              'customer demand trends',
              'competitor positioning',
              'revenue growth direction'
            ],
            failure: [
              'decisions made without real market data',
              'late reaction to competitor movement',
              'sales decline without understanding why'
            ],
            good: [
              'clear visibility of market position',
              'regular competitor and demand review',
              'sales performance understood and acted on'
            ]
          },
          {
            key: 'innovation',
            label: 'Innovation',
            controls: [
              'project pipeline and stage gates',
              'approval and prioritisation of initiatives',
              'delivery tracking from idea to launch'
            ],
            failure: [
              'ideas started but never finished',
              'no structured approval or kill decision',
              'resources wasted on low value projects'
            ],
            good: [
              'clear stage gate process',
              'active pipeline with ownership',
              'projects delivered or stopped based on value'
            ]
          },
          {
            key: 'productivity',
            label: 'Productivity',
            controls: [
              'output versus target',
              'downtime and loss tracking',
              'efficiency and utilisation'
            ],
            failure: [
              'no clear performance baseline',
              'losses not measured or challenged',
              'output gaps accepted as normal'
            ],
            good: [
              'targets clearly defined',
              'losses tracked and challenged',
              'performance gaps trigger action'
            ]
          },
          {
            key: 'physical_resources',
            label: 'Physical Resources',
            controls: [
              'asset condition and availability',
              'maintenance execution',
              'stock and equipment readiness'
            ],
            failure: [
              'equipment failures due to neglect',
              'stockouts or excess inventory',
              'no visibility of asset condition'
            ],
            good: [
              'assets maintained and reliable',
              'stock aligned to operational need',
              'issues identified before failure'
            ]
          },
          {
            key: 'financial_resources',
            label: 'Financial Resources',
            controls: [
              'budget control',
              'spend approval and limits',
              'financial tracking and reconciliation'
            ],
            failure: [
              'uncontrolled or reactive spending',
              'no link between spend and outcome',
              'weak financial discipline'
            ],
            good: [
              'spend controlled and justified',
              'clear budget versus actual visibility',
              'financial decisions tied to operational need'
            ]
          },
          {
            key: 'profitability',
            label: 'Profitability',
            controls: [
              'margin tracking',
              'cost drivers',
              'revenue versus cost relationship'
            ],
            failure: [
              'profit not understood at operational level',
              'costs increasing without challenge',
              'revenue not linked to performance'
            ],
            good: [
              'clear visibility of profit drivers',
              'costs actively managed',
              'profit linked to operational performance'
            ]
          },
          {
            key: 'managerial_performance',
            label: 'Managerial Performance',
            controls: [
              'kpi ownership',
              'performance review cadence',
              'accountability structure'
            ],
            failure: [
              'no ownership of results',
              'poor follow through',
              'meetings without action'
            ],
            good: [
              'clear accountability per area',
              'regular performance review',
              'actions tracked and closed'
            ]
          },
          {
            key: 'public_responsibility',
            label: 'Public Responsibility',
            controls: [
              'regulatory compliance',
              'ehs standards',
              'policy adherence'
            ],
            failure: [
              'compliance treated as paperwork',
              'gaps only found during audit',
              'no ownership of standards'
            ],
            good: [
              'compliance actively managed',
              'regular internal checks',
              'issues identified and corrected early'
            ]
          }
        ],
        module_backbone: [
          {
            key: 'cost_driver_analysis',
            label: 'Cost driver and loss analysis',
            workstream: 'Workstream 1',
            modules: [
              'Cost driver and loss analysis',
              'Budget control and variance review',
              'Profit leakage and margin control',
              'Financial visibility and reporting control'
            ]
          },
          {
            key: 'market_and_commercial_control',
            label: 'Market and commercial control',
            workstream: 'Workstream 2',
            modules: [
              'Market performance and commercial position review',
              'Commercial risk and exposure review',
              'Cashflow and working capital control',
              'Strategic alignment and direction review'
            ]
          },
          {
            key: 'management_and_investment_control',
            label: 'Management and investment control',
            workstream: 'Workstream 3',
            modules: [
              'Management accountability and performance control',
              'CAPEX and investment control'
            ]
          }
        ],
        modules_detail: {
          cost_driver_analysis: {
            objective: 'Identify the main factors driving cost so action can be taken on the real cause.',
            controls: [
              'track key drivers regularly',
              'compare actual versus standard assumptions',
              'validate data across operations and finance'
            ],
            failure: [
              'costs are reviewed only at summary level so root causes are missed',
              'action is slow because the real driver is not isolated'
            ],
            good: [
              'a small set of measurable drivers is reviewed on a fixed cadence',
              'clear actions are raised on the biggest causes'
            ],
            audit_questions: [
              'Show the current cost driver model and the defined drivers for each cost line.',
              'Explain what changed in the top 3 cost drivers over the last 3 reporting periods.',
              'Provide the raw data source for each driver and confirm where it is pulled from.',
              'Show who owns the driver model and when it was last formally reviewed.',
              'Show the top cost variance and prove which driver caused it.',
              'Show the corrective actions raised against the top drivers and their current status.',
              'Show at least one completed action and the measurable before and after impact.',
              'Prove that driver changes align with real operational events such as downtime, volume, or process change.'
            ],
            evidence_requirements: [
              'cost breakdown by asset line product or cost centre from cmms or erp',
              'monthly variance analysis showing actual versus standard or budget',
              'raw operational data driving cost movement such as downtime labour material energy or waste',
              'root cause analysis records linked to the top cost variances',
              'action tracker with owner due date and closure evidence for each major driver',
              'approved cost driver assumptions and calculation basis',
              'reconciliation between operational data and financial cost figures'
            ],
            corrective_action_patterns: [
              'assign a named owner to each major cost driver',
              'introduce a fixed cadence cost driver review with defined inputs and outputs',
              'reconcile operational data to financial cost data and resolve gaps',
              'separate mixed or unclear cost lines into defined driver categories',
              'escalate repeated variance above a defined threshold with management visibility',
              'track root cause action owner and closure status for each driver issue',
              'standardise the cost driver model and review assumptions on a fixed cycle'
            ],
            severity_rules: [
              'low when variance is less than 5 percent explained supported by evidence and no actions are open',
              'medium when variance is between 5 and 10 percent with owner assigned and action in progress',
              'medium when variance is understood but corrective action is overdue',
              'high when variance is greater than 10 percent with no confirmed root cause',
              'high when the same cost driver repeats for two or more review cycles without closure',
              'high when operational data cannot be reconciled to financial records',
              'high when driver data is missing delayed or inconsistent across systems',
              'low when the trend is stable for three consecutive cycles with actions closed and verified'
            ]
          },
          budget_control_review: {
            objective: 'Keep spending aligned to approved budget and explain variances quickly.',
            controls: [
              'review budget versus actual',
              'enforce spend approval limits',
              'reforecast when assumptions change'
            ],
            failure: [
              'overspend is discovered late',
              'overspend is accepted without corrective action'
            ],
            good: [
              'variances are reviewed regularly',
              'variances are explained clearly and tied to owners and updated forecasts'
            ],
            audit_questions: [
              'Show approved budget latest forecast and actual spend for the current period.',
              'Explain the top 3 variances and what is driving each one.',
              'Show approval records for any overspend reallocation or forecast change.',
              'Show all open budget related actions and who owns them.',
              'Show evidence that budget holders reviewed and signed off their numbers.',
              'Prove that repeated variances have been escalated and not ignored.',
              'Show that actual spend is correctly mapped to budget lines with no unexplained miscoding.'
            ],
            evidence_requirements: [
              'approved budget and latest forecast signed off by finance and management',
              'monthly budget versus actual report with line level variance explanation',
              'purchase order invoice and approval trail for spend',
              'budget holder comments and actions on each material variance',
              'spend approval matrix with authority limits',
              'approved records of budget changes transfers or rephasing',
              'reconciliation between general ledger postings and budget categories'
            ],
            corrective_action_patterns: [
              'assign budget ownership at line item level with accountability for variance',
              'enforce approval controls before spend above defined thresholds',
              'run a fixed monthly budget versus actual review with documented outputs',
              'correct misallocation in general ledger coding and cost centre booking',
              'require documented explanation and action for all material variances',
              'reforecast when actual spend or assumptions change materially',
              'escalate recurring overspend into formal management review'
            ],
            severity_rules: [
              'low when spend is within 5 percent of budget forecast is current and no actions are open',
              'medium when spend is between 5 and 10 percent over budget with explanation and owner assigned',
              'medium when approval evidence is incomplete for a material spend item but action is in place',
              'high when spend is greater than 10 percent over budget without approved reforecast',
              'high when there is a material variance with no assigned owner or corrective action',
              'high when the same budget line misses target for two or more consecutive periods',
              'high when there is a mismatch between general ledger postings and budget categories with no reconciliation',
              'low when budget forecast and actuals align and all actions are closed'
            ]
          },
          profit_leakage_margin_control: {
            objective: 'Identify and stop losses in revenue pricing discounts waste write offs billing and margin erosion before they reduce profit.',
            controls: [
              'margin by product customer channel and site reviewed on a set cycle',
              'pricing discount and rebate approvals enforced',
              'revenue billing and cash reconciliations performed regularly',
              'write offs credits and adjustments tracked with reasons and approval',
              'leakage actions assigned tracked and closed with evidence'
            ],
            failure: [
              'margin erosion is not detected early',
              'discounts credits or write offs are approved without control',
              'billing errors mispricing or waste repeat without root cause closure',
              'leakage is seen as isolated incidents instead of a system issue'
            ],
            good: [
              'leakage is measured by stream owner and cause',
              'exceptions are reviewed quickly and corrected at source',
              'repeated losses are escalated and stopped',
              'closure is proven with trend improvement and documented evidence'
            ],
            audit_questions: [
              'Show the margin bridge from last month to this month with every major movement explained.',
              'Prove that all discounts above threshold were approved before invoice issue.',
              'Show the list of write offs credits and rebates for the period with approval evidence.',
              'Show the billing to cash reconciliation and explain every unmatched item.',
              'Prove that pricing exceptions were logged approved and recovered where required.',
              'Show evidence that the top 5 leakage items were assigned owners and closed.',
              'Show the trend for repeated leakage in the same customer product or site.',
              'Prove that the same leakage issue did not recur after corrective action.'
            ],
            evidence_requirements: [
              'margin bridge by product customer site or channel',
              'approved price lists and discount approval logs',
              'credit note rebate and write off register with authorisation',
              'billing invoice and cash reconciliation records',
              'leakage tracker with owner due date and closure proof',
              'exception reports for pricing rebates returns and adjustments',
              'root cause analysis records for repeated margin losses',
              'system extracts from erp billing and finance records'
            ],
            corrective_action_patterns: [
              'assign a named owner to each leakage category',
              'introduce weekly leakage and margin review',
              'require approval for discounts rebates and write offs above threshold',
              'reconcile pricing billing and cash on a fixed cycle',
              'split losses into clear categories such as pricing waste billing and recovery',
              'escalate recurring leakage above threshold',
              'track root cause action and closure date for every major issue',
              'standardize margin review across customer product and site'
            ],
            severity_rules: [
              'low when margin is within tolerance and variance is explained with evidence',
              'low when leakage is isolated below threshold and has a named owner',
              'medium when margin decline is 5 to 10 percent and the cause is partially explained',
              'medium when a leakage item is open but within agreed corrective action time',
              'high when margin decline is above 10 percent with no confirmed root cause',
              'high when repeated leakage appears in 2 or more review cycles without closure',
              'high when discounts rebates or write offs exceed authority or lack approval',
              'high when billing to cash reconciliation has material unexplained items or unrecovered losses'
            ]
          },
          financial_visibility_reporting_control: {
            objective: 'Ensure management receives accurate timely decision ready financial information with clear ownership reconciled data and visible exceptions.',
            controls: [
              'monthly reporting timetable with fixed deadlines and named owners',
              'reconciliations between general ledger sub ledgers and operational source data',
              'variance analysis for revenue cost margin and balance sheet items',
              'dashboard standards defining kpi formulas thresholds and source systems',
              'approval and sign off of reports before circulation',
              'data quality checks for completeness accuracy and coding',
              'exception logs for late missing or corrected data'
            ],
            failure: [
              'reports are late inconsistent or incomplete',
              'numbers do not reconcile between systems or to source data',
              'dashboards show activity but not decisions or exceptions',
              'owners cannot explain variances or data changes',
              'management acts on outdated or unreliable information',
              'corrections are made after reports are issued without traceability'
            ],
            good: [
              'reports are issued on time and tie back to source records',
              'variances are explained clearly with owner comments and actions',
              'dashboards are simple accurate and decision ready',
              'reconciliations are completed and reviewed each cycle',
              'data issues are tracked assigned and closed',
              'management can see risk trend and action status at a glance'
            ],
            audit_questions: [
              'Show the reporting calendar and prove each report was issued on time for the last 3 cycles.',
              'Show the reconciliation between the management report and the general ledger.',
              'Prove that every material variance has an owner comment and action.',
              'Show the source data behind the dashboard KPI formulas.',
              'Prove who reviewed and signed off the report before distribution.',
              'Show the list of corrections made after issue and why they were needed.',
              'Show how late or missing inputs were escalated and resolved.',
              'Prove that management received the report in a format suitable for decision making.',
              'Show evidence that data quality checks were completed before publication.',
              'Show where unresolved exceptions were flagged to leadership.'
            ],
            evidence_requirements: [
              'reporting timetable with due dates and named owners',
              'signed monthly management packs or reporting sign off sheets',
              'general ledger to report reconciliation files',
              'source system extracts supporting each kpi and financial line',
              'variance reports with comments actions and owners',
              'dashboard logic or kpi definitions with data source references',
              'data quality checklists and exception logs',
              'evidence of corrections reissues or restatements',
              'email or workflow approval trail for report release',
              'action tracker for reporting defects and data issues'
            ],
            corrective_action_patterns: [
              'assign a single owner to every report and kpi',
              'introduce a fixed monthly close and reporting review cycle',
              'reconcile key figures before report release',
              'standardize kpi definitions and dashboard logic',
              'flag and escalate late missing or inconsistent inputs',
              'require comments for every material variance',
              'track data issues separately from business issues',
              'reissue corrected reports only through controlled change'
            ],
            severity_rules: [
              'low when the report is on time reconciled and fully explained',
              'low when minor data corrections are made before release and do not affect decisions',
              'medium when the report is late by one cycle step or has a small unexplained variance',
              'medium when one or more kpis lack complete source support but the issue is owned',
              'high when the report is late and used for decisions before correction',
              'high when material figures do not reconcile to source systems',
              'high when repeated reporting errors occur across 2 or more cycles',
              'high when no owner exists for a broken report missing kpi or unresolved data issue'
            ]
          },
          management_accountability_performance_control: {
            objective: 'Ensure managers own results follow controls and deliver against agreed business and operational targets.',
            controls: [
              'clear kpi ownership for each manager and function',
              'monthly performance review with actions deadlines and escalation',
              'defined authority limits and approval rules',
              'attendance of key owners at review meetings',
              'tracking of overdue actions repeated misses and closed items',
              'performance scorecards linked to business priorities',
              'evidence of follow up on agreed actions'
            ],
            failure: [
              'nobody owns the kpi or the corrective action',
              'reviews happen but nothing changes afterward',
              'managers miss targets repeatedly without escalation',
              'decisions are made without follow through or proof',
              'scorecards exist but they are not used to manage performance'
            ],
            good: [
              'every target has one accountable owner',
              'reviews show actual target variance root cause and action',
              'escalation happens quickly when misses repeat',
              'actions are tracked to closure with proof',
              'management decisions are visible in the record'
            ],
            audit_questions: [
              'Show who owns each KPI and prove they accepted that ownership.',
              'Show the last 3 performance reviews with actions and closure status.',
              'Prove that repeated KPI misses were escalated to the next level.',
              'Show evidence that missed actions were followed up and closed.',
              'Show the manager scorecard used for performance decisions.',
              'Prove that authority limits were applied before approvals were made.',
              'Show where poor performance changed decisions resources or priorities.',
              'Show evidence that no KPI was left without an owner or review date.'
            ],
            evidence_requirements: [
              'kpi ownership matrix with named managers',
              'monthly performance review packs',
              'action tracker with owners due dates and closure evidence',
              'escalation log for repeated misses',
              'scorecards showing target actual variance and trend',
              'approval matrix and delegated authority records',
              'meeting minutes or review notes showing decisions and follow up',
              'evidence of completed corrective actions and sign off'
            ],
            corrective_action_patterns: [
              'assign one owner per kpi or control',
              'introduce fixed monthly review cadence',
              'escalate repeated misses after a defined threshold',
              'track all actions in one live register',
              'require evidence before closing an action',
              'link performance review to business priorities',
              'separate one off misses from systemic issues',
              'use standard scorecards across all departments'
            ],
            severity_rules: [
              'low when the kpi is on target and ownership is clear',
              'low when one minor miss is explained and closed on time',
              'medium when the kpi is off target but the issue has an owner and action plan',
              'medium when one action is overdue but escalation has started',
              'high when the kpi is missed for 2 or more cycles without closure',
              'high when no owner is assigned to a key performance item',
              'high when repeated misses are not escalated or reviewed',
              'high when managers are being held accountable without supporting evidence or tracking'
            ]
          },
          capex_investment_control: {
            objective: 'Ensure capital spend and investment decisions are justified approved controlled and delivered against business need.',
            controls: [
              'defined capex request and approval process',
              'business case with scope benefit cost and payback',
              'delegated authority limits for spend approval',
              'project tracking for budget timing and delivery status',
              'post approval change control for scope cost and timeline',
              'evidence that investment benefits are reviewed after delivery',
              'separation between urgent replacement spend and strategic investment'
            ],
            failure: [
              'projects are approved without a proper business case',
              'spend is committed before formal approval',
              'scope cost or timeline changes are not controlled',
              'capex is used to hide recurring operating failures',
              'delivered projects are not reviewed for actual benefit'
            ],
            good: [
              'every project has a clear business justification and owner',
              'approval follows authority limits before money is committed',
              'budget and delivery status are reviewed regularly',
              'changes are documented and reapproved where needed',
              'completed investments are checked against promised results'
            ],
            audit_questions: [
              'Show the current capex register with owner budget approval status and delivery date.',
              'Show the business case for the last 3 approved projects including justification benefit and payback.',
              'Prove that no project started spending before formal approval was given.',
              'Show the delegated authority rules used for capex approval and evidence they were followed.',
              'Show where scope cost or timing changed and prove change control was applied.',
              'Show how urgent replacement spend is separated from strategic investment decisions.',
              'Show evidence that completed projects were reviewed against expected benefit and performance.',
              'Prove that overspend or delayed delivery was escalated and managed.'
            ],
            evidence_requirements: [
              'live capex register with project status and ownership',
              'approved business cases with cost benefit and payback',
              'signed approval records against authority matrix',
              'project tracking reports for cost timing and completion',
              'change requests and reapproval records',
              'purchase approval trail and commitment records',
              'post implementation reviews or benefit realization checks',
              'escalation records for delayed overspent or off scope projects'
            ],
            corrective_action_patterns: [
              'require a standard business case before approval',
              'block spend until formal approval is complete',
              'track every project in one live capex register',
              'introduce change control for scope cost and timing changes',
              'separate replacement capex from growth or strategic capex',
              'review delivered projects against promised benefits',
              'escalate overspend and delay at fixed review points',
              'link investment approval to business priorities and risk'
            ],
            severity_rules: [
              'low when the project is approved tracked and delivered to plan',
              'low when minor timing changes are documented and controlled',
              'medium when a project is delayed or over budget but action and ownership are clear',
              'medium when one approval record is incomplete but the business case and control are otherwise sound',
              'high when spend is committed before approval',
              'high when cost or scope changes are made without control',
              'high when major projects have no clear business case owner or benefit review',
              'high when capex decisions repeatedly fail to deliver expected value'
            ]
          }
        }
      }
    }
  },

  reliability_engineering: {
    label: 'Process and Equipment Reliability',
    keywords: [
      'reliability',
      'engineering',
      'equipment',
      'asset',
      'assets',
      'failure',
      'failures',
      'breakdown',
      'breakdowns',
      'downtime',
      'bad actor',
      'bad actors',
      'rca',
      'root cause',
      'predictive',
      'vibration',
      'oil analysis',
      'mtbf',
      'oee',
      'inspection',
      'condition monitoring',
      'pm',
      'ppm',
      'planned maintenance'
    ],
    themes: {
      findings: [
        'reliability control is not yet strong enough',
        'repeat failure or weak engineering control is still driving loss',
        'equipment strategy may not yet match the real site failure pattern'
      ],
      recommendations: [
        'review the true failure pattern and the assets driving the loss',
        'tighten engineering control, PM logic, and closeout discipline',
        'separate short term containment from long term reliability correction'
      ],
      next_steps: [
        'confirm the bad actor list',
        'review the repeat loss pattern',
        'assign ownership for reliability closeout'
      ],
      implementation: [
        'start with the biggest loss points first',
        'confirm what has already been tried',
        'put in place corrective action that can be verified in operation'
      ]
    },
    playbooks: {
      fmcg_operational_excellence: {
        label: 'FMCG Operational Excellence Handbook',
        version: '1.0',
        sector: 'FMCG',
        operating_philosophy: [
          'run the site as one operating system, not disconnected tools',
          'treat safety, quality, reliability, cost, and improvement as linked controls',
          'use daily management, visual control, and closed loop action tracking',
          'use structured problem solving to prevent repeat failure'
        ],
        standards_stack: [
          'ISO 9001',
          'ISO 14001',
          'ISO 45001',
          'EFQM',
          'Baldrige',
          'Shingo',
          'Lean',
          'Six Sigma',
          'Lean Six Sigma',
          'TPS'
        ],
        operating_model: {
          pillars: [
            'safety',
            'quality',
            'reliability',
            'improvement'
          ],
          governance: [
            'tiered daily meetings',
            'visual management',
            'named owners',
            'closed loop action tracking'
          ]
        },
        handbook_chapters: [
          'purpose and operating philosophy',
          'standards and governance',
          'maintenance and reliability',
          'quality and food safety',
          'ehs and compliance',
          'capex and project delivery',
          'kpi and review cadence',
          'problem solving and rca',
          'training and competency',
          'audit improvement and document control'
        ],
        module_backbone: [
          {
            key: 'maintenance_reliability_standard',
            label: 'Maintenance and Reliability Standard',
            workstream: 'Workstream 1',
            modules: [
              'Maintenance execution control',
              'Asset reliability control',
              'Root cause analysis control',
              'Planned maintenance control',
              'Spare parts and materials control'
            ],
            control_areas: [
              'maintenance execution',
              'asset reliability',
              'root cause analysis',
              'planned maintenance',
              'spare parts and materials'
            ],
            review_focus: [
              'planned work is executed on time and closed with evidence',
              'critical assets are ranked and reviewed for repeat failure',
              'major failures trigger structured rca with verified closure',
              'pm tasks are linked to failure modes and asset criticality',
              'critical spares are available accurate and traceable'
            ],
            evidence_focus: [
              'cmms work order history',
              'critical asset register',
              'failure history',
              'rca reports',
              'pm compliance records',
              'spares register',
              'stock accuracy records'
            ],
            red_flags: [
              'reactive work dominates the schedule',
              'critical assets fail repeatedly without root cause closure',
              'pm tasks are missed or not linked to failure mode',
              'critical spares are unavailable or inaccurate'
            ]
          },
          {
            key: 'quality_food_safety_standard',
            label: 'Quality and Food Safety Standard',
            workstream: 'Workstream 2',
            modules: [
              'First pass yield and defect review',
              'Hold release and deviation management review',
              'Traceability control review',
              'CAPA and layered audit review'
            ],
            control_areas: [
              'first pass yield',
              'defect tracking',
              'deviation control',
              'hold and release',
              'traceability',
              'capa effectiveness',
              'layered process audits'
            ],
            review_focus: [
              'quality is built into the process',
              'deviations and holds are controlled with ownership',
              'traceability works from raw material to finished goods',
              'capa has due dates and effectiveness checks'
            ],
            evidence_focus: [
              'yield reports',
              'defect logs',
              'deviation records',
              'hold release records',
              'traceability test results',
              'capa tracker',
              'audit findings'
            ],
            red_flags: [
              'traceability gaps',
              'open capas without effectiveness checks',
              'repeat quality escapes',
              'quality managed at end of line only'
            ]
          },
          {
            key: 'ehs_compliance_standard',
            label: 'EHS and Compliance Standard',
            workstream: 'Workstream 3',
            modules: [
              'Risk assessment and task hazard control review',
              'Permit to work LOTO and contractor control review',
              'Incident learning and closeout review',
              'Environmental monitoring and compliance review'
            ],
            control_areas: [
              'risk assessment',
              'permit to work',
              'loto',
              'contractor control',
              'incident investigation',
              'training and competency',
              'waste water energy and emissions control'
            ],
            review_focus: [
              'critical tasks have current risk assessments',
              'high risk work uses controlled permits and loto',
              'contractors are approved and controlled',
              'incidents are investigated and trends reviewed',
              'environmental impacts are monitored and controlled'
            ],
            evidence_focus: [
              'risk assessments',
              'permits',
              'loto records',
              'contractor files',
              'incident logs',
              'competency records',
              'environmental monitoring records'
            ],
            red_flags: [
              'high risk tasks without risk assessment',
              'weak contractor control',
              'incident repeats without learning',
              'environmental checks missing or outdated'
            ]
          },
          {
            key: 'capex_change_control_standard',
            label: 'CAPEX and Change Control Standard',
            workstream: 'Workstream 4',
            modules: [
              'Problem statement and baseline review',
              'Business case and payback review',
              'Risk and change control review',
              'Commissioning validation and 30 60 90 day review'
            ],
            control_areas: [
              'problem definition',
              'financial justification',
              'risk review',
              'scope control',
              'fat sat',
              'commissioning',
              'validation',
              'post startup review'
            ],
            review_focus: [
              'projects start with a clear baseline and business case',
              'scope and risk are reviewed before spend',
              'commissioning and validation are planned',
              'benefits are checked after startup'
            ],
            evidence_focus: [
              'business case',
              'baseline data',
              'risk assessments',
              'change control records',
              'commissioning plans',
              'validation records',
              '30 60 90 day reviews'
            ],
            red_flags: [
              'capex approved without baseline',
              'no risk review before install',
              'weak handover to operations',
              'no post startup benefit check'
            ]
          },
          {
            key: 'kpi_governance_standard',
            label: 'KPI Governance and Review Cadence',
            workstream: 'Workstream 5',
            modules: [
              'Daily performance control review',
              'Weekly reliability and action review',
              'Monthly cost OEE and loss review',
              'Quarterly strategy and capability review'
            ],
            control_areas: [
              'daily tier review',
              'weekly pm and rca review',
              'monthly cost and oee review',
              'quarterly strategic review',
              'owner accountability',
              'escalation rules'
            ],
            review_focus: [
              'daily review covers safety downtime output and quality losses',
              'weekly review covers pm compliance schedule adherence and rca actions',
              'monthly review covers cost oee complaints energy and waste',
              'quarterly review covers capability gaps capex benefits and strategic targets'
            ],
            evidence_focus: [
              'tier meeting records',
              'kpi dashboards',
              'pm compliance reports',
              'schedule adherence reports',
              'oee trends',
              'complaint trends',
              'energy and waste reports'
            ],
            red_flags: [
              'kpis reported without action',
              'no named owner for missed targets',
              'weekly losses repeat without closure',
              'review cadence not being followed'
            ]
          },
          {
            key: 'problem_solving_training_document_control',
            label: 'Problem Solving Training and Document Control',
            workstream: 'Workstream 6',
            modules: [
              'Structured RCA and problem solving review',
              'Training matrix and competence review',
              'Document control and version discipline review',
              'Audit readiness and action closeout review'
            ],
            control_areas: [
              'a3 dmaic rca method use',
              'skills matrix',
              'competence signoff',
              'document ownership',
              'version control',
              'audit closure discipline'
            ],
            review_focus: [
              'significant issues use structured problem solving',
              'competence is verified not assumed',
              'controlled documents have owner version and review date',
              'audit findings are risk ranked and closed out'
            ],
            evidence_focus: [
              'rca forms',
              'training matrix',
              'competence records',
              'document register',
              'approved sop list',
              'audit tracker'
            ],
            red_flags: [
              'repeat problems without root cause',
              'training attendance treated as competence',
              'obsolete documents still in use',
              'audit findings staying open too long'
            ]
          }
        ],
                modules_detail: {
          maintenance_execution_control: {
            title: 'Maintenance execution control',
            moduleName: 'Maintenance execution control',
            moduleNames: [
              'Maintenance execution control'
            ],
            objective: 'Ensure planned maintenance is executed on time, to standard, and with traceable closeout.',
            controls: [
              'weekly and daily maintenance schedules with named owners',
              'work order prioritization and approval rules',
              'planned versus reactive work review',
              'closeout checks for completed work',
              'parts labor and downtime capture against each job'
            ],
            failure: [
              'work is postponed repeatedly without escalation',
              'jobs are closed with no real evidence of completion',
              'reactive work dominates the schedule',
              'maintenance records are incomplete or inconsistent'
            ],
            good: [
              'planned work is completed on schedule',
              'every job has a clear scope owner and closeout record',
              'reactive work is monitored and reduced',
              'execution data is reliable and used for improvement'
            ],
            audit_questions: [
              'Show the last 12 weeks of planned versus completed maintenance.',
              'Prove that deferred work was approved and re scheduled.',
              'Show evidence that completed jobs were physically verified.',
              'Show the top recurring maintenance tasks and their closeout history.',
              'Show the reactive maintenance percentage by month.',
              'Show who approved priority changes to the schedule.',
              'Show missed PMs and the actions taken.',
              'Show work order history for a critical asset.'
            ],
            evidence_requirements: [
              'cmms work order history',
              'weekly maintenance plan',
              'completion sign off records',
              'deferral approval log',
              'downtime and reactive work report',
              'technician feedback or shift handover notes',
              'asset job history',
              'parts issue and labor records'
            ],
            corrective_action_patterns: [
              'assign one owner per work order',
              'escalate overdue planned work',
              'review missed PMs weekly',
              'separate reactive and planned work',
              'require evidence before closeout',
              'standardize job completion records',
              'track recurring failures by asset',
              'reprioritize work based on risk and impact'
            ],
            severity_rules: [
              'low when work is completed on time and fully documented',
              'low when a minor delay exists but is approved and recovered quickly',
              'medium when planned work completion slips but backlog is controlled',
              'medium when repeated closeout gaps exist but an owner is active',
              'high when critical work is repeatedly missed or deferred',
              'high when reactive work dominates and no recovery plan exists',
              'high when work orders are closed without proof',
              'high when backlog is growing on critical assets with no escalation'
            ]
          },

          asset_reliability_control: {
            title: 'Asset reliability control',
            moduleName: 'Asset reliability control',
            moduleNames: [
              'Asset reliability control'
            ],
            objective: 'Keep critical assets stable, available, and fit for purpose through structured reliability management.',
            controls: [
              'critical asset register',
              'failure mode tracking',
              'repeat failure review',
              'reliability KPIs such as MTBF MTTR and downtime',
              'asset health checks and condition monitoring',
              'root cause analysis for major failures'
            ],
            failure: [
              'the same asset fails repeatedly',
              'reliability data is not reviewed',
              'failures are handled only as repairs not as system issues',
              'critical assets have no clear reliability plan'
            ],
            good: [
              'critical assets are identified and reviewed regularly',
              'repeat failures are analysed and removed',
              'reliability KPIs are visible and acted on',
              'asset risk is reduced over time'
            ],
            audit_questions: [
              'Show the critical asset list and risk ranking.',
              'Show MTBF and MTTR trends for the top assets.',
              'Prove that repeat failures had root cause analysis.',
              'Show the action log from major asset failures.',
              'Show condition monitoring records for critical equipment.',
              'Show how reliability improvements were measured.',
              'Show the top 10 failure modes by asset.',
              'Show evidence that findings were converted into action.'
            ],
            evidence_requirements: [
              'critical asset register',
              'reliability dashboard',
              'failure history reports',
              'rca reports',
              'condition monitoring logs',
              'maintenance improvement tracker',
              'asset criticality assessment',
              'downtime records'
            ],
            corrective_action_patterns: [
              'rank assets by business risk',
              'review repeat failures monthly',
              'convert rca findings into engineering actions',
              'track reliability actions to closure',
              'increase monitoring on critical assets',
              'remove chronic failure causes',
              'standardize failure coding',
              'escalate persistent unreliability'
            ],
            severity_rules: [
              'low when asset performance is stable and monitored',
              'low when a one off failure is contained and closed',
              'medium when repeat failures are emerging on a non critical asset',
              'medium when reliability actions exist but are overdue',
              'high when a critical asset failure repeats without root cause closure',
              'high when downtime is rising on business critical equipment',
              'high when reliability data is missing or unusable',
              'high when a critical asset has no reliability ownership'
            ]
          },

          root_cause_analysis_control: {
            title: 'Root cause analysis control',
            moduleName: 'Root cause analysis control',
            moduleNames: [
              'Root cause analysis control'
            ],
            objective: 'Find and remove the real cause of failures, not just the symptom.',
            controls: [
              'rca trigger criteria for major breakdowns',
              'formal investigation process',
              'evidence based problem solving',
              'action tracking with ownership and deadlines',
              'review of repeat issues and effectiveness of fixes'
            ],
            failure: [
              'problems are blamed on operators or age only',
              'investigations are shallow and repetitive',
              'the same failure returns after repair',
              'actions are not verified after closure'
            ],
            good: [
              'rca is triggered for the right events',
              'causes are supported by evidence',
              'actions address system causes not just symptoms',
              'effectiveness is checked after implementation'
            ],
            audit_questions: [
              'Show which failures required RCA in the last 6 months.',
              'Show the evidence used to support each root cause.',
              'Show the difference between symptom and root cause in the report.',
              'Show which actions were verified as effective.',
              'Show repeat failures after RCA and what changed.',
              'Show who approved RCA closure.',
              'Show overdue RCA actions and escalation.',
              'Show the most common recurring causes.'
            ],
            evidence_requirements: [
              'rca reports',
              'failure event logs',
              'photographs measurements and inspection records',
              'action tracker',
              'verification of effectiveness',
              'escalation records',
              'maintenance and downtime history',
              'meeting notes from review sessions'
            ],
            corrective_action_patterns: [
              'trigger rca above a defined failure threshold',
              'require evidence before cause acceptance',
              'separate short term containment from long term fix',
              'track action owner and verification date',
              'review repeat issues monthly',
              'standardize rca format',
              'escalate unresolved causes',
              'close actions only after proof of effectiveness'
            ],
            severity_rules: [
              'low when rca is completed and actions are verified',
              'low when one issue is under review with clear ownership',
              'medium when rca is late but containment is in place',
              'medium when actions are open but tracked',
              'high when repeat failures continue after rca closure',
              'high when no evidence supports the claimed root cause',
              'high when major failures are not investigated',
              'high when the same issue keeps returning with no learning applied'
            ]
          },

          planned_maintenance_control: {
            title: 'Planned maintenance control',
            moduleName: 'Planned maintenance control',
            moduleNames: [
              'Planned maintenance control'
            ],
            objective: 'Use preventive and predictive maintenance to reduce failures and protect uptime.',
            controls: [
              'pm schedule by asset criticality',
              'pm compliance tracking',
              'condition based tasks where appropriate',
              'pm task standardization',
              'review of pm effectiveness'
            ],
            failure: [
              'pms are skipped delayed or done poorly',
              'tasks are too generic to prevent failure',
              'pm workload is not balanced against capacity',
              'pm does not reduce breakdowns'
            ],
            good: [
              'pms are executed on time and reviewed for value',
              'tasks match asset risk and failure mode',
              'pm compliance is strong',
              'breakdown trend improves over time'
            ],
            audit_questions: [
              'Show PM compliance for the last 12 months.',
              'Show which PMs were missed and why.',
              'Show how PM tasks map to failure modes.',
              'Show evidence that PMs reduced breakdowns.',
              'Show review of PMs that added no value.',
              'Show the backlog of overdue PMs.',
              'Show who approved PM task changes.',
              'Show condition monitoring used in place of fixed interval PM.'
            ],
            evidence_requirements: [
              'pm calendar',
              'cmms task list',
              'compliance reports',
              'failure trend reports',
              'pm review records',
              'asset history',
              'technician feedback',
              'change approval records'
            ],
            corrective_action_patterns: [
              'review pms against failure data',
              'remove low value pm tasks',
              'shift to condition based tasks where justified',
              'monitor compliance weekly',
              'escalate overdue pms',
              'standardize pm instructions',
              'link pms to criticality',
              'track effect of pm changes on downtime'
            ],
            severity_rules: [
              'low when pm compliance is on target',
              'low when a minor delay is recovered and recorded',
              'medium when compliance drops but risk is still contained',
              'medium when several pms are overdue with owner visibility',
              'high when critical pms are repeatedly missed',
              'high when breakdowns rise despite pm activity',
              'high when pm task quality is poor or not linked to failure mode',
              'high when no pm control exists for critical assets'
            ]
          },

          spare_parts_materials_control: {
            title: 'Spare parts and materials control',
            moduleName: 'Spare parts and materials control',
            moduleNames: [
              'Spare parts and materials control',
              'Spare parts readiness and calibration review'
            ],
            objective: 'Ensure critical parts are available, traceable, and controlled without excess waste or stockout risk.',
            controls: [
              'critical spares list',
              'min max or reorder controls',
              'inventory accuracy checks',
              'issue and return traceability',
              'obsolescence and slow moving review'
            ],
            failure: [
              'critical parts are missing when needed',
              'stock records do not match physical stock',
              'excess stock ties up cash',
              'parts are issued without traceability'
            ],
            good: [
              'critical spares are defined and available',
              'inventory is accurate and reviewed',
              'stock usage is traceable to work orders',
              'obsolete items are controlled'
            ],
            audit_questions: [
              'Show the critical spares list and stock status.',
              'Show the last inventory accuracy check.',
              'Show stockouts of critical parts and their impact.',
              'Show issue and return history for high value parts.',
              'Show slow moving and obsolete stock review.',
              'Show purchase triggers for key spares.',
              'Show who approved inventory changes.',
              'Show stock linked to maintenance jobs.'
            ],
            evidence_requirements: [
              'spare parts register',
              'stock count records',
              'issue return logs',
              'reorder and min max settings',
              'obsolete stock report',
              'purchase history',
              'work order parts usage',
              'criticality assessment'
            ],
            corrective_action_patterns: [
              'define critical spares by asset risk',
              'review stock levels regularly',
              'investigate stock variances quickly',
              'tighten issue controls',
              'remove obsolete stock',
              'reconcile physical and system stock',
              'link parts usage to work orders',
              'escalate shortages on critical items'
            ],
            severity_rules: [
              'low when critical spares are available and accurate',
              'low when a minor stock variance is corrected quickly',
              'medium when some slow moving stock exists but risk is managed',
              'medium when one critical item is below reorder point with control in place',
              'high when a critical part stockout delays repair',
              'high when inventory records are repeatedly inaccurate',
              'high when parts are issued without traceability',
              'high when spares control failure affects production continuity'
            ]
          }
        },
        kpi_framework: {
          daily: [
            'safety',
            'downtime',
            'output',
            'quality losses'
          ],
          weekly: [
            'pm compliance',
            'schedule adherence',
            'top losses',
            'rca actions'
          ],
          monthly: [
            'cost',
            'oee trends',
            'complaints',
            'energy',
            'waste'
          ],
          quarterly: [
            'strategic targets',
            'capex benefits',
            'capability gaps'
          ],
          core_metrics: [
            'mtbf',
            'mttr',
            'oee',
            'pm compliance',
            'planned work ratio',
            'reactive versus planned work',
            'backlog age',
            'maintenance cost',
            'scrap',
            'complaints',
            'ehs events'
          ]
        },
        templates: [
          'daily tier meeting agenda',
          'breakdown rca form',
          'pm compliance tracker',
          'oee dashboard',
          'capex business case template',
          'risk assessment form',
          'change control form',
          'audit checklist',
          'training matrix',
          'action log'
        ],
        policy_statements: [
          'we will operate safely and comply with all legal and company requirements',
          'we will protect product quality and traceability at every stage',
          'we will maintain critical assets to prevent repeat failures and quality losses',
          'we will reduce waste variation and downtime through structured improvement',
          'we will manage environmental impacts through controlled processes and continual improvement'
        ]
      }
    }
  },

  work_management: {
    label: 'Work Management',
    keywords: [
      'planning',
      'planner',
      'scheduling',
      'schedule',
      'backlog',
      'work order',
      'work orders',
      'priority',
      'prioritisation',
      'prioritization',
      'job plan',
      'job pack',
      'wrench time',
      'shutdown',
      'shutdowns',
      'execution',
      'task list',
      'work management'
    ],
    themes: {
      findings: [
        'work execution control is not yet strong enough',
        'planning, scheduling, or backlog discipline is creating avoidable loss',
        'the right work may not be reaching the right people at the right time'
      ],
      recommendations: [
        'tighten planning, priority setting, and schedule control',
        'remove weak work order quality and old unmanaged backlog',
        'protect prepared work from daily reactive disruption'
      ],
      next_steps: [
        'confirm where the work flow breaks down',
        'review backlog quality and ownership',
        'set a simple scheduling control routine'
      ],
      implementation: [
        'start with the jobs or delays causing the biggest drag',
        'confirm where planning quality is weak',
        'review whether the new work control actually holds under daily pressure'
      ]
    }
  },

  people_organization: {
    label: 'People and Organization',
    keywords: [
      'people',
      'staff',
      'team',
      'training',
      'competence',
      'capability',
      'roles',
      'responsibility',
      'responsibilities',
      'ownership',
      'handover',
      'leadership',
      'manager',
      'supervisor',
      'engagement',
      'organisation',
      'organization',
      'autonomous maintenance',
      'operator checks',
      'cross functional'
    ],
    themes: {
      findings: [
        'role clarity, capability, or ownership is still too weak',
        'the structure may not be supporting the work properly',
        'training, leadership, or handover discipline is not strong enough yet'
      ],
      recommendations: [
        'define ownership and accountability clearly',
        'close the biggest competence and training gaps first',
        'review whether the organization structure supports the real workload'
      ],
      next_steps: [
        'confirm role ownership',
        'list the main training or support gaps',
        'review handover and follow through discipline'
      ],
      implementation: [
        'start with the tasks or people creating the biggest daily drag',
        'confirm ownership person by person',
        'review whether the new split actually holds in practice'
      ]
    }
  },

  supply_chain_materials: {
    label: 'Supply Chain and Materials',
    keywords: [
      'stores',
      'stock',
      'inventory',
      'spares',
      'spare',
      'parts',
      'supplier',
      'suppliers',
      'vendor',
      'vendors',
      'lead time',
      'lead times',
      'kitting',
      'purchase',
      'purchasing',
      'buying',
      'materials',
      'stockout',
      'stockouts',
      'inventory turnover',
      'critical spares'
    ],
    themes: {
      findings: [
        'parts, stock, or supplier control is not yet strong enough',
        'resource availability may still be too reactive',
        'materials control may be increasing downtime risk or unnecessary spend'
      ],
      recommendations: [
        'confirm the critical item and spares position',
        'tighten stock accuracy, replenishment, and supplier control',
        'reduce panic buying and improve job readiness through better materials flow'
      ],
      next_steps: [
        'build the critical item view',
        'review stock accuracy and lead times',
        'assign ownership for supplier and replenishment control'
      ],
      implementation: [
        'start with the highest risk missing or late items first',
        'confirm where materials flow is breaking down',
        'set a routine that keeps the stock and supply view live'
      ]
    }
  }
};

const PORTAL_INTELLIGENCE_LIBRARY = {
  general_business_control: {
    label: 'General Business Control',
    keywords: [
      'general',
      'business',
      'control',
      'review',
      'issue',
      'problem',
      'gap',
      'stability',
      'performance'
    ],
    themes: {
      findings: [
        'control of this area is not yet strong enough',
        'the current position is not fully visible',
        'ownership and follow through still need tightening'
      ],
      recommendations: [
        'define the issue clearly',
        'confirm one owner',
        'put in place a simple review routine'
      ],
      next_steps: [
        'confirm the real gap',
        'name one owner',
        'review progress regularly'
      ],
      implementation: [
        'start with the exact issue seen on site',
        'confirm what is missing',
        'set the first practical action and review it'
      ]
    }
  },

  finance_cashflow: {
    label: 'Finance and Cashflow',
    keywords: [
      'finance',
      'financial',
      'cash',
      'cashflow',
      'income',
      'payment',
      'payments',
      'invoice',
      'invoices',
      'debtor',
      'debtors',
      'credit control',
      'overdue',
      'profit',
      'loss',
      'margin',
      'margins',
      'cost',
      'costs',
      'expense',
      'expenses',
      'pricing',
      'revenue'
    ],
    themes: {
      findings: [
        'income visibility is weak',
        'payment status is not being kept current',
        'overdue money is reducing cash visibility',
        'financial control is relying on delayed follow up instead of a live routine'
      ],
      recommendations: [
        'build one live tracker for income, paid amounts, overdue amounts, and disputed amounts',
        'assign one owner to review unpaid accounts weekly',
        'follow up late payments early instead of waiting for cash pressure to build',
        'connect income tracking back to the actual work, jobs, or services delivered'
      ],
      next_steps: [
        'put in place one live debtor and payment tracker',
        'set a weekly review of overdue accounts',
        'assign one named owner for payment follow up'
      ],
      implementation: [
        'start with all current invoices or expected income lines',
        'mark each one as paid, overdue, part paid, disputed, or unknown',
        'review the list weekly and act on the highest risk accounts first'
      ]
    }
  },

  sales_marketing: {
    label: 'Sales and Marketing',
    keywords: [
      'sales',
      'marketing',
      'lead',
      'leads',
      'customer growth',
      'pipeline',
      'quote',
      'quotes',
      'conversion',
      'brand',
      'promotion',
      'advertising',
      'market',
      'audience',
      'pricing strategy',
      'offer',
      'offers'
    ],
    themes: {
      findings: [
        'customer growth is being limited by weak market clarity or weak follow up',
        'the business does not yet have a strong live view of where leads come from and which ones convert',
        'sales effort may be happening without one clear targeting and follow up routine'
      ],
      recommendations: [
        'define the target customer more clearly',
        'track leads, quotes, wins, and losses in one simple live view',
        'review which channels are bringing real enquiries and which are wasting time',
        'set one routine for quote follow up and conversion review'
      ],
      next_steps: [
        'put one lead and quote tracker in place',
        'define target market and offer clearly',
        'review conversion performance weekly'
      ],
      implementation: [
        'list active leads and recent quotes',
        'mark where each lead came from and what happened to it',
        'identify the best channels and improve follow up discipline first'
      ]
    }
  },

  stock_purchasing: {
    label: 'Stock and Purchasing',
    keywords: [
      'stock',
      'stores',
      'spares',
      'parts',
      'inventory',
      'purchasing',
      'purchase',
      'buying',
      'supplier',
      'suppliers',
      'lead time',
      'min max',
      'min',
      'max'
    ],
    themes: {
      findings: [
        'stock control is not yet reliable enough',
        'critical items may not be fully protected',
        'purchasing decisions may still be too reactive'
      ],
      recommendations: [
        'confirm the critical item list',
        'review stock accuracy',
        'tighten purchasing and replenishment control'
      ],
      next_steps: [
        'build one clean item list',
        'confirm min and max settings',
        'review emergency buying'
      ],
      implementation: [
        'start with the highest risk parts first',
        'confirm what is missing or wrong',
        'set a routine to keep the stock view current'
      ]
    }
  },

  quality_customer: {
    label: 'Quality and Customer Issues',
    keywords: [
      'quality',
      'customer',
      'complaint',
      'complaints',
      'reject',
      'rework',
      'spec',
      'standard',
      'defect',
      'defects',
      'non conformance',
      'nonconformance'
    ],
    themes: {
      findings: [
        'quality control is not fully stable',
        'the issue may be affecting customer confidence',
        'the current control points may not be strong enough'
      ],
      recommendations: [
        'define the exact quality gap',
        'check where the control point is failing',
        'assign ownership for containment and permanent fix'
      ],
      next_steps: [
        'confirm the defect pattern',
        'set immediate containment',
        'review the root cause properly'
      ],
      implementation: [
        'start with the failures seen most often',
        'confirm where they are being introduced',
        'put stronger checks in place and monitor the result'
      ]
    }
  },

  operations_workflow: {
    label: 'Operations and Workflow',
    keywords: [
      'process',
      'workflow',
      'planning',
      'schedule',
      'scheduling',
      'handover',
      'routine',
      'operations',
      'delay',
      'delays',
      'flow',
      'throughput'
    ],
    themes: {
      findings: [
        'workflow discipline is not strong enough',
        'handover or control points are too weak',
        'the current way of working may not hold under daily pressure'
      ],
      recommendations: [
        'map the current flow clearly',
        'tighten the weak handover points',
        'set visible control points and ownership'
      ],
      next_steps: [
        'confirm where the flow breaks down',
        'assign one owner for the full process',
        'review the result regularly'
      ],
      implementation: [
        'start with the step that fails most often',
        'remove unclear handoffs',
        'check whether the new flow actually holds in real use'
      ]
    }
  },

  people_training: {
    label: 'People and Training',
    keywords: [
      'people',
      'staff',
      'team',
      'training',
      'competence',
      'capability',
      'roles',
      'responsibility',
      'responsibilities',
      'delegation',
      'delegate',
      'handover',
      'supervisor',
      'engineer',
      'manager',
      'ownership'
    ],
    themes: {
      findings: [
        'role clarity is still weak',
        'the work is not yet sitting with the right people',
        'training or handover discipline is not strong enough',
        'too much work may still be depending on one person'
      ],
      recommendations: [
        'define who owns which tasks clearly',
        'close the biggest training or confidence gaps first',
        'set a routine to check whether delegated work stayed with the right person',
        'avoid relying on assumptions about who knows what'
      ],
      next_steps: [
        'build a live ownership split',
        'list the remaining training gaps',
        'review handover performance regularly'
      ],
      implementation: [
        'start with the tasks or roles that are creating the biggest drag today',
        'confirm ownership person by person',
        'check daily or weekly whether the new split is actually holding'
      ]
    }
  },

  leadership_accountability: {
    label: 'Leadership and Accountability',
    keywords: [
      'leadership',
      'accountability',
      'owner',
      'ownership',
      'manager',
      'management',
      'decision',
      'decisions',
      'follow through',
      'followup',
      'follow up'
    ],
    themes: {
      findings: [
        'ownership is not yet clear enough',
        'follow through may be too weak',
        'decisions may not be sticking in practice'
      ],
      recommendations: [
        'define who owns the outcome',
        'set a review point for follow through',
        'remove confusion around who decides and who checks'
      ],
      next_steps: [
        'confirm one named owner',
        'set clear review timing',
        'challenge open drift quickly'
      ],
      implementation: [
        'start with the issue that keeps slipping',
        'make ownership visible',
        'review whether the action actually holds after agreement'
      ]
    }
  },

  maintenance_reliability: {
    label: 'Maintenance and Reliability',
    keywords: [
      'maintenance',
      'pm',
      'ppm',
      'asset',
      'equipment',
      'breakdown',
      'failure',
      'failures',
      'reliability',
      'bad actor',
      'downtime',
      'inspection',
      'planned maintenance'
    ],
    themes: {
      findings: [
        'reliability control is not yet strong enough',
        'repeat issues may still be driving reactive work',
        'current maintenance control may not match real site need'
      ],
      recommendations: [
        'review the repeat issue pattern properly',
        'tighten PM timing and task quality',
        'track corrective action to verified closure'
      ],
      next_steps: [
        'confirm the bad actor list',
        'review PM timing',
        'assign ownership for repeat failure closeout'
      ],
      implementation: [
        'start with the biggest loss points first',
        'confirm what has already been tried',
        'separate short term containment from permanent fix'
      ]
    }
  },

  safety_compliance: {
    label: 'Safety and Compliance',
    keywords: [
      'safety',
      'risk',
      'compliance',
      'permit',
      'loto',
      'lockout',
      'incident',
      'near miss',
      'contractor',
      'inspection',
      'statutory'
    ],
    themes: {
      findings: [
        'control of this risk is not yet strong enough',
        'compliance evidence may be incomplete',
        'ownership or checking discipline may be too weak'
      ],
      recommendations: [
        'confirm the exact risk and current controls',
        'tighten ownership and verification',
        'keep current evidence that the controls are working'
      ],
      next_steps: [
        'confirm the control standard',
        'name one owner',
        'review compliance evidence regularly'
      ],
      implementation: [
        'start with the highest risk gap first',
        'confirm what proof exists today',
        'put in place a simple review and signoff routine'
      ]
    }
  }
};

function portalIntelligenceCleanPointText(text) {
  let value = String(text || '').trim().replace(/\?+$/, '');

  value = value.replace(/^check if\s+/i, '');
  value = value.replace(/^check whether\s+/i, '');
  value = value.replace(/^check for\s+/i, '');
  value = value.replace(/^confirm if\s+/i, '');
  value = value.replace(/^confirm whether\s+/i, '');
  value = value.replace(/^review whether\s+/i, '');
  value = value.replace(/^verify whether\s+/i, '');

  return value;
}

function detectPrimaryBusinessPillar(text) {
  const source = String(text || '').toLowerCase();
  const pillars = Object.keys(PORTAL_PILLAR_LIBRARY);

  let bestPillar = 'business_management';
  let bestScore = 0;

  pillars.forEach(function(pillarKey) {
    const pillar = PORTAL_PILLAR_LIBRARY[pillarKey];
    let score = 0;

    (pillar.keywords || []).forEach(function(keyword) {
      if (source.includes(String(keyword).toLowerCase())) {
        score += 1;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestPillar = pillarKey;
    }
  });

  return bestPillar;
}

function getPrimaryBusinessPillarLibrary(text) {
  const pillarKey = detectPrimaryBusinessPillar(text);
  return PORTAL_PILLAR_LIBRARY[pillarKey] || PORTAL_PILLAR_LIBRARY.business_management;
}

function portalIntelligenceLower(text) {
  return String(text || '').trim().toLowerCase();
}

function portalIntelligenceJoinLines(lines) {
  return (lines || []).filter(function(line) {
    return String(line || '').trim().length > 0;
  }).join('\n');
}

function portalIntelligenceCleanPointText(text) {
  let value = String(text || '').trim().replace(/\?+$/, '');

  value = value.replace(/^check if\s+/i, '');
  value = value.replace(/^check whether\s+/i, '');
  value = value.replace(/^check for\s+/i, '');
  value = value.replace(/^confirm if\s+/i, '');
  value = value.replace(/^confirm whether\s+/i, '');
  value = value.replace(/^review whether\s+/i, '');
  value = value.replace(/^verify whether\s+/i, '');

  return value;
}

function detectPortalIssueCategory(title, purpose, extraText) {
  const source = [
    String(title || ''),
    String(purpose || ''),
    String(extraText || '')
  ].join(' ').toLowerCase();

  const categories = Object.keys(PORTAL_INTELLIGENCE_LIBRARY);

  let bestCategory = 'general_business_control';
  let bestScore = 0;

  categories.forEach(function(categoryKey) {
    const category = PORTAL_INTELLIGENCE_LIBRARY[categoryKey];
    let score = 0;

    (category.keywords || []).forEach(function(keyword) {
      if (source.includes(String(keyword).toLowerCase())) {
        score += 1;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestCategory = categoryKey;
    }
  });

  return bestCategory;
}

function getPortalIssueLibrary(title, purpose, extraText) {
  const categoryKey = detectPortalIssueCategory(title, purpose, extraText);
  return PORTAL_INTELLIGENCE_LIBRARY[categoryKey] || PORTAL_INTELLIGENCE_LIBRARY.general_business_control;
}

function detectPortalIssueType(title) {
  const lowerTitle = portalIntelligenceLower(title);

  if (lowerTitle.includes('audit') || lowerTitle.includes('compliance')) return 'audit';
  if (lowerTitle.includes('safety') || lowerTitle.includes('risk') || lowerTitle.includes('confined space')) return 'safety';
  if (lowerTitle.includes('failure') || lowerTitle.includes('breakdown') || lowerTitle.includes('reliability')) return 'breakdown';
  if (lowerTitle.includes('process') || lowerTitle.includes('workflow') || lowerTitle.includes('planning')) return 'process';

  return 'general';
}

function buildSpecificSecondVisitQuestions(action, reviewAnswers, issueType) {
  const title = String(action.title || '').trim();

  const failedChecks = reviewAnswers.filter(function(item) {
    return item.responseType === 'check' && item.status === 'no';
  });

  const uncertainChecks = reviewAnswers.filter(function(item) {
    return item.responseType === 'check' && item.status === 'not_sure';
  });

  const questions = [];

  function pushQuestion(text) {
    const value = String(text || '').trim();
    if (!value) return;
    if (!questions.includes(value)) {
      questions.push(value);
    }
  }

  function cleanPointText(text) {
    let value = String(text || '').trim().replace(/\?+$/, '');

    value = value.replace(/^check if\s+/i, '');
    value = value.replace(/^check whether\s+/i, '');
    value = value.replace(/^check for\s+/i, '');
    value = value.replace(/^confirm if\s+/i, '');
    value = value.replace(/^confirm whether\s+/i, '');
    value = value.replace(/^review whether\s+/i, '');
    value = value.replace(/^verify whether\s+/i, '');

    return value;
  }

  if (failedChecks.length) {
    failedChecks.forEach(function(item) {
      const point = cleanPointText(item.text);
      pushQuestion('You marked this as a gap: "' + point + '". Show me exactly where it is breaking down in practice.');
      pushQuestion('What is the direct impact because "' + point + '" is not in place?');
      pushQuestion('What has already been tried to fix "' + point + '"?');
      pushQuestion('What proof or records can you show me for "' + point + '" today?');
    });
  }

  if (uncertainChecks.length) {
    uncertainChecks.forEach(function(item) {
      const point = cleanPointText(item.text);
      pushQuestion('You marked this as not sure: "' + point + '". Who can confirm the real position?');
      pushQuestion('What record, example, or proof can confirm whether "' + point + '" is actually happening?');
    });
  }

  if (!failedChecks.length && !uncertainChecks.length) {
    pushQuestion('What is the main issue still not fully clear in ' + title + '?');
    pushQuestion('What evidence can you show me on site for the current position?');
    pushQuestion('What is the next fact we need to confirm before closing this area?');
  }

  if ((/equipment/i.test(title) || /asset/i.test(title)) && failedChecks.length) {
    pushQuestion('Which assets are missing from the current list, if any?');
    pushQuestion('How are critical assets currently identified, ranked, or flagged?');
    pushQuestion('Who owns updates to the equipment list when equipment changes happen?');
  }

  if ((/pm/i.test(title) || /maintenance timing/i.test(title) || /planned maintenance/i.test(title)) && failedChecks.length) {
    pushQuestion('Which PM tasks are currently too late, too early, or repeatedly missed?');
    pushQuestion('What is the real effect of the current PM timing on downtime or overdue work?');
    pushQuestion('Who reviews PM timing now and how often is it challenged?');
  }

  if ((/delegation/i.test(title) || /delegate/i.test(title)) && failedChecks.length) {
    pushQuestion('Which tasks are still sitting with the wrong person today?');
    pushQuestion('What is stopping proper handover right now?');
    pushQuestion('Which delegated tasks keep coming back and why?');
  }

  if ((/training/i.test(title) || /user/i.test(title)) && failedChecks.length) {
    pushQuestion('Who still needs training in this area right now?');
    pushQuestion('What part of the process are people still getting wrong or avoiding?');
    pushQuestion('How is training completion checked and signed off in practice?');
  }

  if ((/job type/i.test(title)) && failedChecks.length) {
    pushQuestion('What job types are currently being used and where are they causing confusion?');
    pushQuestion('Which work is being coded wrongly or inconsistently today?');
    pushQuestion('Who should own the final job type list going forward?');
  }

  if (issueType === 'breakdown' && failedChecks.length) {
    pushQuestion('What tends to happen just before the failure or problem appears?');
    pushQuestion('Is there any repeat pattern by shift, product, asset, or team?');
  }

  if (issueType === 'process' && failedChecks.length) {
    pushQuestion('Where does the workflow break down most often under normal daily pressure?');
    pushQuestion('What workarounds are people using instead of the intended process?');
  }

  return questions.slice(0, 8);
}

function buildSecondVisitImpact(action, answeredFollowUpText) {
  const title = String(action.title || '').trim();
  const purpose = String(action.purpose || '').trim();
  const raw = String(answeredFollowUpText || '').trim();
  const categoryKey = detectPortalIssueCategory(title, purpose, raw);
  const library = getPortalIssueLibrary(title, purpose, raw);

  if (!raw) {
    return {
      findingsExtra: '',
      recommendationsExtra: '',
      nextImplementationExtra: '',
      implementationGuidanceExtra: '',
      rcaProblemExtra: '',
      rcaImmediateExtra: '',
      rcaRootExtra: ''
    };
  }

  const answers = raw
    .split(/\n\s*\n/)
    .map(function(block) { return String(block || '').trim(); })
    .filter(function(block) { return block.length > 0; })
    .map(function(block) {
      const match = block.match(/Answer:\s*([\s\S]*)$/i);
      return match ? match[1].trim() : block.trim();
    })
    .filter(function(text) { return text.length > 0; });

  const shortSummary = answers.slice(0, 3).join(' ');
  const findingsSeed = (library.themes && library.themes.findings) ? library.themes.findings[0] : 'the issue is still not fully controlled';
  const recommendationsSeed = portalIntelligenceJoinLines((library.themes && library.themes.recommendations) || []);
  const nextStepsSeed = portalIntelligenceJoinLines((library.themes && library.themes.next_steps) || []);
  const implementationSeed = portalIntelligenceJoinLines((library.themes && library.themes.implementation) || []);

  if (categoryKey === 'people_training' && (portalIntelligenceLower(title).includes('delegation') || portalIntelligenceLower(title).includes('delegate'))) {
    return {
      findingsExtra: 'The second visit answers suggest that task ownership and practical handover are still not stable. Current site feedback also indicates: ' + shortSummary,
      recommendationsExtra: portalIntelligenceJoinLines([
        'Define exactly which daily and weekly tasks should stay with the supervisor and which should move to engineers.',
        'Assign named ownership for the first tasks to be handed over.',
        'Set a simple daily check so delegated tasks are followed through and do not drift back.'
      ]),
      nextImplementationExtra: 'Build a live delegation split, name the owner for each task, and review handover performance daily until the new pattern holds.',
      implementationGuidanceExtra: 'Start with the tasks mentioned during the second visit. Move the easiest repeatable tasks first, confirm who owns each one, and check each day whether the task stayed with that person.',
      rcaProblemExtra: ' The second visit answers show that task ownership and practical handover are still not stable.',
      rcaImmediateExtra: ' Current site answers suggest the delegation gap is being driven by unclear ownership, weak follow through, or limited confidence in handover.',
      rcaRootExtra: ' The root issue appears linked to weak ownership clarity and no firm daily handover control.'
    };
  }

  return {
    findingsExtra: 'The second visit answers suggest that ' + findingsSeed + '. Current site feedback also indicates: ' + shortSummary,
    recommendationsExtra: recommendationsSeed || 'Use the second visit answers to confirm the exact blocker and set the first practical fix.',
    nextImplementationExtra: nextStepsSeed || 'Turn the second visit answers into a short action plan with ownership and review dates.',
    implementationGuidanceExtra: implementationSeed || 'Read back through the second visit answers, group them into the main blockers, and build the first corrective actions from those site facts.',
    rcaProblemExtra: ' The second visit answers added more practical site evidence around the issue.',
    rcaImmediateExtra: ' Site answers suggest the current working conditions are now clearer than they were at first review.',
    rcaRootExtra: ' The root issue now looks more tied to the themes raised during the second visit.'
  };
}