import { ScopingData } from '../types/scoping';
import { DEMO_SCOPING_DATA } from './demoData';

export interface ExperienceDomain {
  id: string;
  name: string;
  shortCode: string;
  tagline: string;
  iconName: string;
  data: ScopingData;
}

export const EXPERIENCE_DOMAINS: ExperienceDomain[] = [
  {
    id: 'ex',
    name: 'Employee Experience (EX)',
    shortCode: 'EX',
    tagline: 'Workforce sentiment, onboarding, pulses & SuccessFactors integration',
    iconName: 'Users',
    data: {
      ...DEMO_SCOPING_DATA,
      meta: {
        title: 'Global Enterprise Employee Experience (EX) Scoping',
        context: 'Employee Experience rollout alongside SAP SuccessFactors Employee Central (EC) and Performance & Goals (PMGM). Target go-live is 3-4 months (16-week window).',
        projectStart: '2026-11-02'
      }
    }
  },
  {
    id: 'cx',
    name: 'Customer Experience (CX)',
    shortCode: 'CX',
    tagline: 'Omnichannel NPS, post-purchase touchpoints, CSAT & CRM integration',
    iconName: 'HeartHandshake',
    data: {
      meta: {
        title: 'Enterprise Customer Experience (CX) Scoping',
        context: 'Omnichannel customer journey feedback integrated with CRM (Salesforce / SAP Service Cloud) and e-Commerce order workflows. Target 16-week go-live.',
        projectStart: '2026-11-02'
      },
      sections: [
        { code: 'STRAT', name: 'CX Strategy & KPIs', description: 'Executive sponsorship, CSAT/NPS targets, and customer journey governance.' },
        { code: 'JOURN', name: 'Customer Journey Touchpoints', description: 'Digital onboarding, post-purchase, support ticket resolution, and churn alerts.' },
        { code: 'INTEG', name: 'CRM & Omnichannel Feeds', description: 'Real-time webhook triggers from Salesforce / SAP CRM, SMS/Email delivery gateways.' },
        { code: 'CLOSED', name: 'Closed-Loop Actioning', description: 'Detractor alerting, frontline agent coaching, and escalation SLAs.' }
      ],
      questions: [
        {
          id: 'CX-01',
          section: 'STRAT',
          sectionName: 'CX Strategy & KPIs',
          useCases: ['ALL'],
          priority: 'P1',
          owner: 'Chief Experience Officer',
          neededBy: 'Week 2',
          responseType: 'Strategic metric select',
          question: 'What is the primary customer loyalty anchor metric (Relational NPS, Transactional CSAT, or Customer Effort Score CES)?',
          why: 'Dictates the core survey driver methodology and longitudinal benchmarking structure.',
          kickoff: true,
          keyLabel: 'Primary CX anchor metric'
        },
        {
          id: 'CX-02',
          section: 'JOURN',
          sectionName: 'Customer Journey Touchpoints',
          useCases: ['PURCHASE'],
          priority: 'P1',
          owner: 'Head of Customer Journey',
          neededBy: 'Week 2',
          responseType: 'Workflow trigger select',
          question: 'At what exact delay following order delivery or contract signing should the post-transaction pulse be triggered?',
          why: 'Sending too early captures logistics friction instead of product satisfaction; sending too late tanks response rate.',
          kickoff: true,
          keyLabel: 'Post-transaction send delay'
        },
        {
          id: 'CX-03',
          section: 'INTEG',
          sectionName: 'CRM & Omnichannel Feeds',
          useCases: ['SUPPORT'],
          priority: 'P1',
          owner: 'CRM Technical Architect',
          neededBy: 'Week 2',
          responseType: 'API protocol select',
          question: 'Will support ticket closed events be published via real-time Webhooks or nightly batch API extracts from the CRM?',
          why: 'Real-time webhooks enable immediate detractor recovery within 1 hour of ticket closure.',
          kickoff: true,
          keyLabel: 'Support ticket event webhook trigger'
        },
        {
          id: 'CX-04',
          section: 'CLOSED',
          sectionName: 'Closed-Loop Actioning',
          useCases: ['DETRACTOR'],
          priority: 'P1',
          owner: 'Customer Care Lead',
          neededBy: 'Week 4',
          responseType: 'SLA rule description',
          question: 'What is the target SLA for customer care agents to reach out to customers scoring NPS 0-6 (Detractor)?',
          why: 'Closing the loop on detractors recovers up to 35% of accounts at risk of defection.',
          kickoff: false,
          keyLabel: 'Detractor recovery SLA rule'
        },
        {
          id: 'CX-05',
          section: 'JOURN',
          sectionName: 'Customer Journey Touchpoints',
          useCases: ['ALL'],
          priority: 'P2',
          owner: 'Digital Marketing Lead',
          neededBy: 'Week 4',
          responseType: 'Multi-select',
          question: 'Which delivery channels (Email, SMS, In-App Modal, WhatsApp) will be enabled for Wave 1 customer invitations?',
          why: 'Omnichannel routing requires SMS sender ID registration and compliance validation.',
          kickoff: false,
          keyLabel: 'Omnichannel invitation channels'
        }
      ],
      useCases: [
        {
          name: 'Digital Purchase & Onboarding Experience',
          covers: 'Post-checkout and first 30 days customer onboarding perception surveys.',
          sfTrigger: 'CRM Account Activation & ERP Billing event',
          dependsOn: 'Customer ID, Order Value, Product SKU',
          fit: 'High',
          fitReason: 'Direct revenue impact and immediate visibility into customer initial delight.'
        },
        {
          name: 'Support Case Resolution Pulse (CSAT)',
          covers: 'Immediate post-resolution survey measuring agent helpfulness and first-contact resolution.',
          sfTrigger: 'Service Cloud ticket closed status',
          dependsOn: 'Case ID, Support Agent ID, Case Category',
          fit: 'High',
          fitReason: 'Critical operational KPI tied to contact center productivity and quality.'
        },
        {
          name: 'Quarterly Executive Relationship NPS',
          covers: 'Strategic account perception pulse sent to executive buyer champions.',
          sfTrigger: 'Scheduled quarterly batch based on CRM account tier',
          dependsOn: 'Account Executive, Contract Renewal Date, ARR Tier',
          fit: 'Medium-High',
          fitReason: 'Key predictor of contract renewals and expansion opportunities.'
        }
      ],
      sfModules: [
        {
          module: 'CRM / Service Cloud (Salesforce/SAP)',
          status: 'Live & Operational',
          exRelevance: 'Customer contact directory, case history, account owner hierarchy.',
          touchpoint: 'Bi-directional webhook event stream',
          dataTrigger: 'Case Closed, Opportunity Won',
          confirmQuestion: 'Is customer contact opt-in status synchronized in real time?'
        },
        {
          module: 'ERP / Billing (SAP S/4HANA)',
          status: 'Live & Operational',
          exRelevance: 'Invoicing milestones, order delivery confirmations.',
          touchpoint: 'Order status sync via Kafka / Middleware',
          dataTrigger: 'Delivery Status = Completed',
          confirmQuestion: 'Can delivery carrier timestamp be queried programmatically?'
        }
      ],
      dataFields: [
        { attribute: 'Customer Account ID', ecArea: 'Account Master', purpose: 'Unique customer identifier across systems.', sensitivity: 'Low', neededFor: 'All touchpoints' },
        { attribute: 'Contact Email & Mobile', ecArea: 'Contact Info', purpose: 'Survey delivery via Email and SMS.', sensitivity: 'Medium', neededFor: 'Distribution' },
        { attribute: 'Net Revenue / Tier', ecArea: 'Commercial Data', purpose: 'Slicing CSAT by account value.', sensitivity: 'High', neededFor: 'Executive Reporting' },
        { attribute: 'Support Agent ID', ecArea: 'Case Master', purpose: 'Attributing feedback to support representatives.', sensitivity: 'Low', neededFor: 'Agent Coaching' }
      ],
      plan: [
        { phase: 'Phase 1: CX Journey Architecture', startWeek: 1, endWeek: 3, activities: ['Journey touchpoint mapping', 'Questionnaire design', 'CRM schema confirmation'] },
        { phase: 'Phase 2: CRM & Webhook Integration', startWeek: 3, endWeek: 7, activities: ['Service Cloud event triggers', 'SMS/Email gateway setup', 'Data privacy compliance'] },
        { phase: 'Phase 3: Closed-Loop Alerting & Dashboards', startWeek: 7, endWeek: 11, activities: ['Detractor ticketing workflow', 'Executive dashboard build', 'Agent scorecards'] },
        { phase: 'Phase 4: Pilot & Field Testing', startWeek: 11, endWeek: 13, activities: ['Pilot survey launch with VIP cohort', 'SLA routing verification'] },
        { phase: 'Phase 5: Wave 1 CX Go-Live', startWeek: 14, endWeek: 16, activities: ['Global rollout across all accounts', 'Live closed-loop monitoring'] }
      ],
      risks: [
        { risk: 'Survey fatigue caused by high transaction volume across multiple orders.', likelihood: 4, impact: 4, mitigation: 'Enforce strict 90-day survey quarantine rules per customer contact.', owner: 'Head of Customer Journey' },
        { risk: 'Customer support agents delaying case closure to manipulate CSAT scores.', likelihood: 3, impact: 4, mitigation: 'Audit automated case closure triggers and tie metrics to team-level outcomes.', owner: 'Customer Care Lead' }
      ],
      stakeholders: [
        { role: 'Chief Experience Officer', why: 'Executive sponsor owning brand perception and churn reduction.', involvement: 'Fortnightly steering' },
        { role: 'Head of Customer Journey', why: 'Designs customer interaction moments and survey drivers.', involvement: 'Weekly sprint lead' },
        { role: 'CRM Technical Architect', why: 'Manages API connectors and event webhook pipelines.', involvement: 'Integration sprint delivery' },
        { role: 'Customer Care Lead', why: 'Supervises support agent closed-loop workflows.', involvement: 'Operational readiness' }
      ],
      owners: ['Chief Experience Officer', 'Head of Customer Journey', 'CRM Technical Architect', 'Customer Care Lead', 'Digital Marketing Lead'],
      tagToUseCase: {
        'ALL': null,
        'PURCHASE': 'Digital Purchase & Onboarding Experience',
        'SUPPORT': 'Support Case Resolution Pulse (CSAT)',
        'DETRACTOR': 'Support Case Resolution Pulse (CSAT)'
      }
    }
  },
  {
    id: 'lx',
    name: 'Logistics & Supply Chain Experience (LX)',
    shortCode: 'LX',
    tagline: 'Carrier feedback, warehouse vendor sentiment, delivery NPS & TMS integration',
    iconName: 'Truck',
    data: {
      meta: {
        title: 'Supply Chain & Logistics Experience Scoping',
        context: 'End-to-end supplier, 3PL carrier, and dock appointment feedback integrated with SAP Transportation Management (TM) and Warehouse Management (EWM).',
        projectStart: '2026-11-02'
      },
      sections: [
        { code: 'GOV', name: 'Logistics Governance', description: 'Carrier partner agreements, SLA benchmarks, and dispute escalation.' },
        { code: 'DOCK', name: 'Dock & Warehouse Operations', description: 'Turnaround time sentiment, dock appointment efficiency, and driver safety.' },
        { code: 'CARRIER', name: 'Carrier & Supplier Experience', description: 'Payment transparency, rate parity, and collaborative scheduling.' }
      ],
      questions: [
        {
          id: 'LX-01',
          section: 'GOV',
          sectionName: 'Logistics Governance',
          useCases: ['ALL'],
          priority: 'P1',
          owner: 'VP Global Supply Chain',
          neededBy: 'Week 2',
          responseType: 'Free text',
          question: 'What are the top 3 friction points reported by freight carriers at receiving distribution centers?',
          why: 'Focuses survey design on actionable logistics bottlenecks (dwell time, unlading delays).',
          kickoff: true,
          keyLabel: 'Top carrier friction points'
        },
        {
          id: 'LX-02',
          section: 'DOCK',
          sectionName: 'Dock & Warehouse Operations',
          useCases: ['DOCK'],
          priority: 'P1',
          owner: 'Warehouse Logistics Director',
          neededBy: 'Week 2',
          responseType: 'Select with rule',
          question: 'How will truck drivers submit feedback at gate checkout (QR code on bill of lading, SMS prompt, or kiosk)?',
          why: 'Frontline drivers have minimal dwell time; survey must be under 60 seconds with mobile-first UI.',
          kickoff: true,
          keyLabel: 'Driver checkout feedback channel'
        },
        {
          id: 'LX-03',
          section: 'CARRIER',
          sectionName: 'Carrier & Supplier Experience',
          useCases: ['SUPPLIER'],
          priority: 'P2',
          owner: 'Procurement Operations Lead',
          neededBy: 'Week 4',
          responseType: 'Numeric threshold',
          question: 'What invoice dispute resolution threshold triggers an automated vendor relationship review?',
          why: 'Preserves critical strategic supplier capacity in tight freight markets.',
          kickoff: false,
          keyLabel: 'Invoice dispute escalation trigger'
        }
      ],
      useCases: [
        {
          name: 'Carrier Dock & Dwell Time Pulse',
          covers: 'Quick feedback from freight drivers evaluating gate check-in and unloading speed.',
          sfTrigger: 'SAP TM Gate Departure confirmation',
          dependsOn: 'Carrier SCAC Code, Driver Mobile, Distribution Center ID',
          fit: 'High',
          fitReason: 'Direct correlation with carrier detention fees and yard turnaround times.'
        },
        {
          name: 'Quarterly Strategic Supplier Sentiment',
          covers: 'In-depth procurement pulse covering forecasting clarity, payment speed, and collaborative R&D.',
          sfTrigger: 'SAP Ariba / ERP quarterly purchase order review',
          dependsOn: 'Vendor ID, Category Spend, Buyer ID',
          fit: 'High',
          fitReason: 'Strengthens tier-1 supplier resilience and secures preferred capacity.'
        }
      ],
      sfModules: [
        {
          module: 'SAP Transportation Management (TM)',
          status: 'Live & Operational',
          exRelevance: 'Freight order status, carrier tender confirmations, dock check-in/out.',
          touchpoint: 'EDI / REST API freight event notifications',
          dataTrigger: 'Freight Order Closed',
          confirmQuestion: 'Is driver phone number recorded on digital bills of lading?'
        },
        {
          module: 'SAP Extended Warehouse Management (EWM)',
          status: 'Live & Operational',
          exRelevance: 'Inbound delivery receipt and dock door utilization.',
          touchpoint: 'Goods receipt posting event',
          dataTrigger: 'Goods Receipt Complete',
          confirmQuestion: 'Can gate dwell duration be passed as demographic metadata?'
        }
      ],
      dataFields: [
        { attribute: 'Carrier SCAC Code', ecArea: 'Carrier Master', purpose: 'Identifies logistics provider.', sensitivity: 'Low', neededFor: 'Carrier Benchmarking' },
        { attribute: 'Distribution Center / Yard ID', ecArea: 'Facility Master', purpose: 'Attributes feedback to specific warehouse yards.', sensitivity: 'Low', neededFor: 'Facility Scorecards' },
        { attribute: 'Dwell Time in Yard (Minutes)', ecArea: 'TM Execution', purpose: 'Objective telemetry paired with driver subjective sentiment.', sensitivity: 'Medium', neededFor: 'Root Cause Analytics' }
      ],
      plan: [
        { phase: 'Phase 1: Logistics Touchpoint Scoping', startWeek: 1, endWeek: 3, activities: ['Yard workflow audit', 'Driver questionnaire design', 'TM event scoping'] },
        { phase: 'Phase 2: Gate Trigger & Mobile Build', startWeek: 4, endWeek: 8, activities: ['EWM webhook listener', 'QR code packaging on bills of lading'] },
        { phase: 'Phase 3: Yard Manager Dashboards', startWeek: 8, endWeek: 12, activities: ['Real-time dwell alerting', 'Carrier executive scorecards'] },
        { phase: 'Phase 4: Wave 1 Distribution Center Go-Live', startWeek: 13, endWeek: 16, activities: ['Pilot in top 3 hubs', 'Global carrier network rollout'] }
      ],
      risks: [
        { risk: 'Low completion rate from truck drivers due to tight driving shift schedules.', likelihood: 4, impact: 4, mitigation: 'Design ultra-compact 3-question survey with one-tap star ratings and zero login requirement.', owner: 'Warehouse Logistics Director' }
      ],
      stakeholders: [
        { role: 'VP Global Supply Chain', why: 'Owns carrier network strategy and vendor retention.', involvement: 'Steering sponsor' },
        { role: 'Warehouse Logistics Director', why: 'Manages distribution yard operations.', involvement: 'Weekly operations lead' },
        { role: 'Procurement Operations Lead', why: 'Negotiates freight contracts and SLA penalties.', involvement: 'Supplier survey review' }
      ],
      owners: ['VP Global Supply Chain', 'Warehouse Logistics Director', 'Procurement Operations Lead'],
      tagToUseCase: {
        'ALL': null,
        'DOCK': 'Carrier Dock & Dwell Time Pulse',
        'SUPPLIER': 'Quarterly Strategic Supplier Sentiment'
      }
    }
  },
  {
    id: 'sx',
    name: 'Student & Academic Experience (SX)',
    shortCode: 'SX',
    tagline: 'Admissions, course evaluations, campus services & SIS / LMS integration',
    iconName: 'GraduationCap',
    data: {
      meta: {
        title: 'Higher Education Student Experience (SX) Scoping',
        context: 'Holistic student lifecycle feedback covering Orientation, Mid-Term Course Evaluations, Campus Wellbeing, and Graduation Readiness integrated with SIS & Canvas/Blackboard LMS.',
        projectStart: '2026-11-02'
      },
      sections: [
        { code: 'ACAD', name: 'Academic & Curriculum Quality', description: 'Course evaluations, faculty effectiveness, and learning outcomes.' },
        { code: 'CAMP', name: 'Campus Life & Student Services', description: 'Housing, dining, mental health resources, and financial aid.' },
        { code: 'LIFECYCLE', name: 'Enrollment & Graduation', description: 'Admissions conversion, freshman orientation, and career placement.' }
      ],
      questions: [
        {
          id: 'SX-01',
          section: 'ACAD',
          sectionName: 'Academic & Curriculum Quality',
          useCases: ['COURSE'],
          priority: 'P1',
          owner: 'Dean of Academic Affairs',
          neededBy: 'Week 2',
          responseType: 'Rating model select',
          question: 'What core pedagogical framework will evaluate course instruction across STEM vs Humanities departments?',
          why: 'Ensures course feedback is equitable across seminar and lecture formats.',
          kickoff: true,
          keyLabel: 'Pedagogical course evaluation model'
        },
        {
          id: 'SX-02',
          section: 'CAMP',
          sectionName: 'Campus Life & Student Services',
          useCases: ['SERVICES'],
          priority: 'P1',
          owner: 'VP Student Life',
          neededBy: 'Week 2',
          responseType: 'Workflow trigger select',
          question: 'How will confidential mental health and counseling satisfaction data be siloed from academic records?',
          why: 'FERPA and HIPAA compliance mandate strict anonymity boundaries.',
          kickoff: true,
          keyLabel: 'FERPA & health confidentiality siloing'
        }
      ],
      useCases: [
        {
          name: 'Mid-Term & End-of-Term Course Evaluations',
          covers: 'Automated student feedback for faculty and instructional improvements.',
          sfTrigger: 'LMS term schedule completion event',
          dependsOn: 'Course ID, Section, Instructor ID, Student Enrollment',
          fit: 'High',
          fitReason: 'Mandatory institutional requirement for tenure and curriculum reviews.'
        },
        {
          name: 'Freshman Orientation & Transition Pulse',
          covers: '30-day pulse assessing student belonging, dorm life, and academic advising.',
          sfTrigger: 'SIS registration date + 30 days',
          dependsOn: 'Student ID, Major, Residential Status',
          fit: 'High',
          fitReason: 'Strongest predictor of freshman year retention.'
        }
      ],
      sfModules: [
        {
          module: 'Student Information System (SIS / Banner)',
          status: 'Live & Master Academic Directory',
          exRelevance: 'Student enrollment status, majors, academic standing.',
          touchpoint: 'Nightly automated roster sync',
          dataTrigger: 'Term Registration Active',
          confirmQuestion: 'Are course section numbers standardized across all colleges?'
        },
        {
          module: 'Learning Management System (Canvas / Blackboard)',
          status: 'Live & In Use',
          exRelevance: 'In-course survey delivery and completion tracking.',
          touchpoint: 'LTI 1.3 Canvas Integration',
          dataTrigger: 'Term Week 12 reached',
          confirmQuestion: 'Is LTI 1.3 enabled for automatic course survey popups?'
        }
      ],
      dataFields: [
        { attribute: 'Student ID', ecArea: 'Student Master', purpose: 'Unique student identifier.', sensitivity: 'High', neededFor: 'All evaluations' },
        { attribute: 'Major / College', ecArea: 'Academic Plan', purpose: 'Deans departmental analysis.', sensitivity: 'Low', neededFor: 'College Level Reporting' },
        { attribute: 'Course & Section Code', ecArea: 'Enrollment', purpose: 'Course evaluation mapping.', sensitivity: 'Low', neededFor: 'Faculty Reviews' }
      ],
      plan: [
        { phase: 'Phase 1: Academic Governance & Survey Instrument Design', startWeek: 1, endWeek: 3, activities: ['Senate committee review', 'FERPA privacy sign-off'] },
        { phase: 'Phase 2: SIS & Canvas LMS Connector Setup', startWeek: 4, endWeek: 8, activities: ['LTI 1.3 integration', 'Automated student roster feed'] },
        { phase: 'Phase 3: Faculty Dashboard Build & Permission Siloing', startWeek: 8, endWeek: 12, activities: ['Department chair reports', 'Anonymity threshold validation'] },
        { phase: 'Phase 4: Wave 1 Term Go-Live', startWeek: 13, endWeek: 16, activities: ['Campus-wide course evaluation rollout'] }
      ],
      risks: [
        { risk: 'Faculty resistance or concerns about evaluation fairness and tenure scoring.', likelihood: 4, impact: 4, mitigation: 'Involve Faculty Senate in question phrasing and set strict minimum class size n>=5.', owner: 'Dean of Academic Affairs' }
      ],
      stakeholders: [
        { role: 'Dean of Academic Affairs', why: 'Academic sponsor owning curriculum quality.', involvement: 'Steering chair' },
        { role: 'VP Student Life', why: 'Oversees housing, mental health, and student well-being.', involvement: 'Weekly review' },
        { role: 'Campus Registrar & SIS Lead', why: 'Maintains student enrollment and course rosters.', involvement: 'Technical data feed' }
      ],
      owners: ['Dean of Academic Affairs', 'VP Student Life', 'Campus Registrar & SIS Lead'],
      tagToUseCase: {
        'ALL': null,
        'COURSE': 'Mid-Term & End-of-Term Course Evaluations',
        'SERVICES': 'Freshman Orientation & Transition Pulse'
      }
    }
  },
  {
    id: 'fx',
    name: 'Finance & Vendor Experience (FX)',
    shortCode: 'FX',
    tagline: 'Procure-to-pay sentiment, invoice resolution feedback, audit & ERP integration',
    iconName: 'Receipt',
    data: {
      meta: {
        title: 'Finance & Procure-to-Pay Experience (FX) Scoping',
        context: 'Scoping vendor payment sentiment, shared service finance responsiveness, and budgeting stakeholder experience alongside SAP S/4HANA Finance.',
        projectStart: '2026-11-02'
      },
      sections: [
        { code: 'AP', name: 'Accounts Payable & Billing', description: 'Vendor payment friction, invoice dispute resolution, and payment terms.' },
        { code: 'BUDGET', name: 'Budgeting & Financial Planning', description: 'Business unit satisfaction with FP&A forecasting, reporting, and capital approval.' }
      ],
      questions: [
        {
          id: 'FX-01',
          section: 'AP',
          sectionName: 'Accounts Payable & Billing',
          useCases: ['ALL'],
          priority: 'P1',
          owner: 'Chief Accounting Officer',
          neededBy: 'Week 2',
          responseType: 'Process workflow',
          question: 'How quickly after invoice settlement should a supplier experience survey be dispatched?',
          why: 'Assesses whether payment was received on terms before memory of friction fades.',
          kickoff: true,
          keyLabel: 'Invoice settlement pulse cadence'
        }
      ],
      useCases: [
        {
          name: 'Procure-to-Pay Supplier Satisfaction',
          covers: 'Evaluates supplier onboarding, PO processing clarity, and invoice reconciliation.',
          sfTrigger: 'SAP S/4HANA AP Payment Cleared status',
          dependsOn: 'Vendor Master ID, Payment Terms, Invoice Amount',
          fit: 'High',
          fitReason: 'Directly impacts early-payment discount capture and supplier relations.'
        }
      ],
      sfModules: [
        {
          module: 'SAP S/4HANA Finance & AP',
          status: 'Live & Master Ledger',
          exRelevance: 'Vendor payment clearing, invoice processing logs, dispute tags.',
          touchpoint: 'Payment run completion batch feed',
          dataTrigger: 'Payment Run Posted',
          confirmQuestion: 'Is vendor contact email stored reliably in Vendor Master?'
        }
      ],
      dataFields: [
        { attribute: 'Vendor ID & Tax Number', ecArea: 'Vendor Master', purpose: 'Identifies payee account.', sensitivity: 'Medium', neededFor: 'Vendor History' },
        { attribute: 'Days Payable Outstanding (DPO)', ecArea: 'Ledger Details', purpose: 'Comparing satisfaction against payment terms.', sensitivity: 'High', neededFor: 'Financial Analytics' }
      ],
      plan: [
        { phase: 'Phase 1: Procure-to-Pay Scoping', startWeek: 1, endWeek: 3, activities: ['Vendor journey review', 'Payment trigger mapping'] },
        { phase: 'Phase 2: ERP Connector & Supplier Feed', startWeek: 4, endWeek: 8, activities: ['SAP S/4HANA AP webhook configuration'] },
        { phase: 'Phase 3: Controller & Treasury Dashboards', startWeek: 8, endWeek: 12, activities: ['Dispute metrics build'] },
        { phase: 'Phase 4: Wave 1 Vendor Launch', startWeek: 13, endWeek: 16, activities: ['Rollout across top 500 vendors'] }
      ],
      risks: [
        { risk: 'Suppliers confusing satisfaction surveys with official payment queries.', likelihood: 3, impact: 3, mitigation: 'Explicitly display paid invoice reference number and clear FAQ in survey header.', owner: 'Chief Accounting Officer' }
      ],
      stakeholders: [
        { role: 'Chief Accounting Officer', why: 'Executive sponsor for accounts payable efficiency.', involvement: 'Steering' },
        { role: 'Head of Shared Financial Services', why: 'Manages invoice dispute resolution team.', involvement: 'Weekly operational lead' }
      ],
      owners: ['Chief Accounting Officer', 'Head of Shared Financial Services'],
      tagToUseCase: {
        'ALL': null
      }
    }
  },
  {
    id: 'px',
    name: 'Project & Transformation Experience (PX)',
    shortCode: 'PX',
    tagline: 'Agile delivery health, stakeholder alignment, milestone quality & PMO gates',
    iconName: 'Workflow',
    data: {
      meta: {
        title: 'Project & Transformation Experience (PX) Scoping',
        context: 'Measuring program health, stakeholder alignment, sprint velocity friction, and milestone delivery confidence across enterprise transformation initiatives.',
        projectStart: '2026-11-02'
      },
      sections: [
        { code: 'ALIGN', name: 'Strategic Alignment & Sponsorship', description: 'Business stakeholder buy-in, scope creep sentiment, and decision rights.' },
        { code: 'AGILE', name: 'Delivery Team Pulse', description: 'Sprint team morale, psychological safety, blocker resolution speed, and tooling.' }
      ],
      questions: [
        {
          id: 'PX-01',
          section: 'ALIGN',
          sectionName: 'Strategic Alignment & Sponsorship',
          useCases: ['ALL'],
          priority: 'P1',
          owner: 'Program Transformation Director',
          neededBy: 'Week 2',
          responseType: 'Alignment scoring model',
          question: 'What is the cadence for collecting transformation confidence pulses from business unit heads (Bi-weekly or Monthly)?',
          why: 'Detects divergence between IT project delivery and actual business expectation early.',
          kickoff: true,
          keyLabel: 'Transformation confidence cadence'
        }
      ],
      useCases: [
        {
          name: 'Program Health & Milestone Confidence Pulse',
          covers: 'Rapid 4-question pulse tracking milestone delivery confidence and scope clarity.',
          sfTrigger: 'Jira / Project Milestone Completion',
          dependsOn: 'Project ID, Sprint Number, Role, Business Unit',
          fit: 'High',
          fitReason: 'Prevents multi-million dollar transformation failures by surfacing hidden team blockers.'
        }
      ],
      sfModules: [
        {
          module: 'Jira / Enterprise PMO Tooling',
          status: 'Live & In Use',
          exRelevance: 'Sprint milestones, release schedules, stakeholder assignments.',
          touchpoint: 'Sprint Close Webhook / REST API',
          dataTrigger: 'Sprint Status = Closed',
          confirmQuestion: 'Are team rosters updated with business stakeholder tags?'
        }
      ],
      dataFields: [
        { attribute: 'Project & Epic ID', ecArea: 'PMO Master', purpose: 'Maps sentiment to specific transformation initiative.', sensitivity: 'Low', neededFor: 'Project Scorecards' },
        { attribute: 'Team Morale & Confidence Index', ecArea: 'Survey Metric', purpose: 'Leading indicator of delivery delays.', sensitivity: 'Medium', neededFor: 'Executive Steering' }
      ],
      plan: [
        { phase: 'Phase 1: PMO Scoping & Pulse Framework', startWeek: 1, endWeek: 3, activities: ['Survey cadence alignment', 'Steering sign-off'] },
        { phase: 'Phase 2: PMO System Integration', startWeek: 4, endWeek: 8, activities: ['Jira / Azure DevOps webhook connection'] },
        { phase: 'Phase 3: Transformation Health Scorecards', startWeek: 8, endWeek: 12, activities: ['Milestone confidence dashboard build'] },
        { phase: 'Phase 4: Wave 1 PMO Rollout', startWeek: 13, endWeek: 16, activities: ['Launch across top 10 enterprise programs'] }
      ],
      risks: [
        { risk: 'Delivery teams fearing negative feedback could impact annual performance ratings.', likelihood: 3, impact: 4, mitigation: 'Enforce strict team-level aggregation and decouple from individual KPI evaluations.', owner: 'Program Transformation Director' }
      ],
      stakeholders: [
        { role: 'Program Transformation Director', why: 'Steering lead for enterprise agility and program governance.', involvement: 'Steering sponsor' },
        { role: 'Lead Agile Coach', why: 'Designs sprint health questions and team psychological safety.', involvement: 'Weekly delivery lead' }
      ],
      owners: ['Program Transformation Director', 'Lead Agile Coach'],
      tagToUseCase: {
        'ALL': null
      }
    }
  }
];
