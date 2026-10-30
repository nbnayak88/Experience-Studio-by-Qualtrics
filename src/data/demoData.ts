import { ScopingData } from '../types/scoping';

export const DEMO_SCOPING_DATA: ScopingData = {
  meta: {
    title: "Global Enterprise Qualtrics EX Scoping",
    context: "Qualtrics Employee Experience (EX) rollout alongside live SAP SuccessFactors Employee Central (EC) and Performance & Goals (PMGM). Target go-live is 3-4 months (16-week window).",
    projectStart: "2026-11-02"
  },
  sections: [
    {
      code: "CTX",
      name: "Project Context & Objectives",
      description: "Governance, executive sponsors, success metrics, and decision rights for the 16-week implementation."
    },
    {
      code: "INT",
      name: "Core Integration & Architecture",
      description: "Data feeds from SAP SuccessFactors EC, SFTP vs API connectors, single sign-on (SSO), and respondent directory sync."
    },
    {
      code: "LIF",
      name: "Lifecycle & Pulse EX Scenarios",
      description: "Use cases covering Candidate, Onboarding 30-60-90, Exit, and Employee Engagement & Manager pulses."
    },
    {
      code: "GOV",
      name: "Data Governance, Privacy & Reporting",
      description: "Anonymity thresholds, legal compliance (Works Council / GDPR), demographic hierarchy, and dashboard role-based access."
    }
  ],
  questions: [
    {
      id: "CTX-01",
      section: "CTX",
      sectionName: "Project Context & Objectives",
      useCases: ["ALL"],
      priority: "P1",
      owner: "Executive Sponsor",
      neededBy: "Week 2",
      responseType: "Free text",
      question: "Who is the executive sponsor, and what decision rights do they hold over scope, budget and the target go-live date?",
      why: "Avoids stalled steering committee decisions during an accelerated 3-4 month delivery window.",
      kickoff: true,
      keyLabel: "Executive sponsor and decision rights"
    },
    {
      id: "CTX-02",
      section: "CTX",
      sectionName: "Project Context & Objectives",
      useCases: ["ALL"],
      priority: "P1",
      owner: "HR Leadership",
      neededBy: "Week 2",
      responseType: "Free text",
      question: "What are the primary business outcomes expected from this Qualtrics EX rollout, and how will program success be measured?",
      why: "Anchors survey instrumentation and analytics directly to verifiable organizational KPIs.",
      kickoff: true,
      keyLabel: "Primary business outcomes and success KPIs"
    },
    {
      id: "CTX-03",
      section: "CTX",
      sectionName: "Project Context & Objectives",
      useCases: ["ALL"],
      priority: "P2",
      owner: "Project Manager",
      neededBy: "Week 4",
      responseType: "Single select",
      question: "Are there any hard freeze periods (e.g., annual performance cycles or fiscal year-end) that prohibit survey deployment?",
      why: "Prevents scheduling conflicts with existing SAP PMGM review milestones.",
      kickoff: false,
      keyLabel: "Survey blackout and freeze windows"
    },
    {
      id: "INT-01",
      section: "INT",
      sectionName: "Core Integration & Architecture",
      useCases: ["ALL"],
      priority: "P1",
      owner: "SAP Integration Architect",
      neededBy: "Week 2",
      responseType: "Technical architecture select",
      question: "Will participant employee data be ingested from SAP SuccessFactors via SAP Integration Suite (CPI), Qualtrics SF Connector, or daily automated SFTP CSV feeds?",
      why: "Technical integration architecture dictates tenant provisioning, firewall rules, and API service credentials.",
      kickoff: true,
      keyLabel: "SAP EC participant feed mechanism"
    },
    {
      id: "INT-02",
      section: "INT",
      sectionName: "Core Integration & Architecture",
      useCases: ["ALL"],
      priority: "P1",
      owner: "IT Security",
      neededBy: "Week 2",
      responseType: "Yes/No with domain details",
      question: "Is SAML 2.0 Single Sign-On (SSO) configured for all target participants, and will it support both Corporate and Frontline identity providers?",
      why: "Essential for secure access to Qualtrics participant dashboards and seamless respondent authentication without passwords.",
      kickoff: true,
      keyLabel: "SAML 2.0 SSO identity setup"
    },
    {
      id: "INT-03",
      section: "INT",
      sectionName: "Core Integration & Architecture",
      useCases: ["ALL"],
      priority: "P2",
      owner: "SAP Integration Architect",
      neededBy: "Week 4",
      responseType: "Free text",
      question: "What is the expected frequency and execution window for delta employee synchronization from SAP Employee Central (EC)?",
      why: "Timely lifecycle triggers depend on timely employee status updates in Qualtrics Employee Directory.",
      kickoff: false,
      keyLabel: "EC delta sync frequency"
    },
    {
      id: "LIF-01",
      section: "LIF",
      sectionName: "Lifecycle & Pulse EX Scenarios",
      useCases: ["ONB"],
      priority: "P1",
      owner: "Talent / Onboarding Lead",
      neededBy: "Week 2",
      responseType: "Multi-select",
      question: "At which milestones should New Hire Onboarding feedback be collected (e.g., Day 7, Day 30, Day 60, Day 90)?",
      why: "Defines event-driven trigger logic based on EC 'Hire Date' field and automated distribution cadence.",
      kickoff: true,
      keyLabel: "Onboarding touchpoint milestones"
    },
    {
      id: "LIF-02",
      section: "LIF",
      sectionName: "Lifecycle & Pulse EX Scenarios",
      useCases: ["EXIT"],
      priority: "P1",
      owner: "HR Operations Lead",
      neededBy: "Week 2",
      responseType: "Select + rule",
      question: "How will Exit survey invitations be triggered from SAP EC termination events, and should involuntary separations be excluded?",
      why: "Requires business filter rules in integration pipelines to respect severance and sensitive termination reasons.",
      kickoff: true,
      keyLabel: "Exit survey trigger & exclusion logic"
    },
    {
      id: "LIF-03",
      section: "LIF",
      sectionName: "Lifecycle & Pulse EX Scenarios",
      useCases: ["PULSE"],
      priority: "P1",
      owner: "Employee Experience Lead",
      neededBy: "Week 4",
      responseType: "Numeric + cadence",
      question: "What is the target question count, core driver model (e.g., eNPS, Intent to Stay), and language localization scope for the Wave 1 Pulse?",
      why: "Survey length directly impacts completion rate; translations dictate template build duration.",
      kickoff: false,
      keyLabel: "Pulse driver model & languages"
    },
    {
      id: "LIF-04",
      section: "LIF",
      sectionName: "Lifecycle & Pulse EX Scenarios",
      useCases: ["MGR"],
      priority: "P2",
      owner: "Talent Development Lead",
      neededBy: "Week 4",
      responseType: "Workflow description",
      question: "Will manager effectiveness feedback be integrated into SAP PMGM goal-setting cycles or retained strictly as developmental feedback?",
      why: "Determines whether survey reports need to align with performance review timelines or remain strictly confidential.",
      kickoff: false,
      keyLabel: "Manager feedback alignment with PMGM"
    },
    {
      id: "GOV-01",
      section: "GOV",
      sectionName: "Data Governance, Privacy & Reporting",
      useCases: ["ALL"],
      priority: "P1",
      owner: "Legal / DPO",
      neededBy: "Week 2",
      responseType: "Threshold number",
      question: "What is the minimum respondent reporting threshold (n-count) for aggregate dashboard reporting across departments and managers?",
      why: "A non-negotiable data privacy safeguard to prevent individual employee identification (typically n=5 or n=10).",
      kickoff: true,
      keyLabel: "Anonymity threshold (n-count)"
    },
    {
      id: "GOV-02",
      section: "GOV",
      sectionName: "Data Governance, Privacy & Reporting",
      useCases: ["ALL"],
      priority: "P1",
      owner: "Employee Relations / Works Council",
      neededBy: "Week 2",
      responseType: "Timeline & status",
      question: "Is Works Council or Labor Union pre-approval required for Germany, Austria, or France, and what is their formal review timeline?",
      why: "Works Council approval has a 6-12 week lead time and can critically block launch if not initiated at kickoff.",
      kickoff: true,
      keyLabel: "Works Council / Labor union approval path"
    },
    {
      id: "GOV-03",
      section: "GOV",
      sectionName: "Data Governance, Privacy & Reporting",
      useCases: ["ALL"],
      priority: "P2",
      owner: "HRIS Manager",
      neededBy: "Week 4",
      responseType: "Hierarchy structure",
      question: "Which organizational hierarchy from SAP EC (Supervisor Hierarchy or Matrix/Custom Line) will dictate dashboard roll-up permissions?",
      why: "Qualtrics dashboard permissions rely on a clean parent-child relationship in participant metadata.",
      kickoff: false,
      keyLabel: "Organizational hierarchy source"
    },
    {
      id: "GOV-04",
      section: "GOV",
      sectionName: "Data Governance, Privacy & Reporting",
      useCases: ["CAND"],
      priority: "P3",
      owner: "Recruiting Lead",
      neededBy: "Week 8",
      responseType: "Consent workflow",
      question: "For Candidate Experience (RCM), how will candidate GDPR consent for post-interview surveys be captured within SuccessFactors Career Site or ATS?",
      why: "Ensures external candidate email addresses can be legally solicited for feedback.",
      kickoff: false,
      keyLabel: "Candidate GDPR consent mechanism"
    }
  ],
  useCases: [
    {
      name: "New Hire Onboarding EX",
      covers: "Day 30, Day 60, and Day 90 milestone pulses measuring enablement, manager support, and culture acclimatization.",
      sfTrigger: "Employee Central hire date calculation / Onboarding 2.0 completion event",
      dependsOn: "SAP EC employee directory, Hire Date, Manager ID",
      fit: "High",
      fitReason: "Direct win with live EC data; immediate visibility into early turnover risk."
    },
    {
      name: "Lifecycle Exit EX",
      covers: "Confidential exit surveys for departing employees uncovering root causes of turnover and team culture feedback.",
      sfTrigger: "Employee Central termination action reason and effective termination date",
      dependsOn: "SAP EC termination workflow, personal/forwarding email capture",
      fit: "High",
      fitReason: "High strategic value; leverages native EC termination events directly."
    },
    {
      name: "Company-Wide Engagement & Culture Pulse",
      covers: "Annual or bi-annual census pulse with eNPS, key drivers, executive dashboards, and action planning.",
      sfTrigger: "Scheduled batch distribution via Qualtrics Participant Directory",
      dependsOn: "Clean EC employee hierarchy, department and location metadata",
      fit: "High",
      fitReason: "Core foundational Qualtrics solution; establishes benchmark indices."
    },
    {
      name: "Manager Effectiveness 180° Pulse",
      covers: "Upward feedback for frontline managers focused on coaching, clarity of goals, and team psychological safety.",
      sfTrigger: "Scheduled 6-month cycle tied to PMGM mid-year reviews",
      dependsOn: "SAP PMGM manager assignments, minimum team size n>=5",
      fit: "Medium-High",
      fitReason: "Synergistic with live PMGM module, requires careful anonymity governance."
    },
    {
      name: "Candidate Experience (RCM)",
      covers: "Post-application and post-interview candidate perception survey for hired and non-hired candidates.",
      sfTrigger: "SuccessFactors Recruiting (RCM) candidate status changes",
      dependsOn: "SAP RCM module (scheduled for Phase 2 go-live)",
      fit: "Low-Medium",
      fitReason: "SAP RCM module goes live later this year; recommend Phase 2 rollout."
    }
  ],
  sfModules: [
    {
      module: "Employee Central (EC)",
      status: "Live & Primary HRIS",
      exRelevance: "Master employee demographic directory, reporting lines, hire/exit dates, locations.",
      touchpoint: "Daily automated sync into Qualtrics Directory",
      dataTrigger: "Hire, Job Change, Termination events",
      confirmQuestion: "Are custom fields (e.g., hybrid working model, cost center) populated consistently in EC?"
    },
    {
      module: "Performance & Goals (PMGM)",
      status: "Live & In Cycle",
      exRelevance: "Performance ratings, review cycle completion dates, goal achievement metrics.",
      touchpoint: "Survey driver attribution and review blackout window coordination",
      dataTrigger: "Year-end review closed status",
      confirmQuestion: "Will performance rating metadata be authorized by HR leadership for correlation with engagement scores?"
    },
    {
      module: "Recruiting Management (RCM)",
      status: "Planned Go-Live Q3",
      exRelevance: "Candidate touchpoints, requisition data, interview stage progression.",
      touchpoint: "Webhook or SFTP export of candidate interview stages",
      dataTrigger: "Candidate status = Interview Completed / Dispositioned",
      confirmQuestion: "Should candidate experience scoping be deferred until RCM reaches integration test phase?"
    },
    {
      module: "Onboarding 2.0 (ONB)",
      status: "Planned Go-Live Q4",
      exRelevance: "Onboarding task completion dates, buddy assignment, new hire checklist.",
      touchpoint: "Direct event trigger or fallback to EC hire date delta",
      dataTrigger: "Onboarding step 100% completed",
      confirmQuestion: "Can we use EC hire date for Wave 1 Onboarding EX rather than waiting for ONB 2.0 go-live?"
    },
    {
      module: "Learning Management (LMS)",
      status: "Planned Next Year",
      exRelevance: "Post-course training evaluations, leadership development effectiveness.",
      touchpoint: "LMS course completion event trigger",
      dataTrigger: "Curriculum status = Completed",
      confirmQuestion: "Are Qualtrics course feedback templates required in Wave 1 or Phase 2?"
    }
  ],
  dataFields: [
    {
      attribute: "Personnel ID (User ID)",
      ecArea: "Biographical Info",
      purpose: "Unique participant identifier across Qualtrics and SuccessFactors.",
      sensitivity: "Low",
      neededFor: "All use cases (Primary Key)"
    },
    {
      attribute: "Corporate Email Address",
      ecArea: "Contact Info",
      purpose: "Primary survey invitation channel and SSO identity match.",
      sensitivity: "Low",
      neededFor: "All use cases (Distribution)"
    },
    {
      attribute: "Manager ID (Supervisor)",
      ecArea: "Job Information",
      purpose: "Constructs organizational hierarchy for role-based dashboard reporting.",
      sensitivity: "Low",
      neededFor: "All use cases (Hierarchy)"
    },
    {
      attribute: "Hire Date",
      ecArea: "Employment Details",
      purpose: "Calculates tenure bands and triggers Day 30/60/90 onboarding pulses.",
      sensitivity: "Low",
      neededFor: "Onboarding EX & Tenured analytics"
    },
    {
      attribute: "Termination Date & Reason",
      ecArea: "Employment Details",
      purpose: "Triggers exit survey distribution and segments voluntary vs involuntary leavers.",
      sensitivity: "Medium",
      neededFor: "Exit EX"
    },
    {
      attribute: "Performance Rating (Latest)",
      ecArea: "PMGM Review Form",
      purpose: "Correlates engagement drivers with high-performer retention.",
      sensitivity: "High",
      neededFor: "Executive Engagement Analytics"
    },
    {
      attribute: "Gender / Diversity Attributes",
      ecArea: "Personal Information",
      purpose: "Diversity, equity, and inclusion (DEI) intersectional experience metrics.",
      sensitivity: "High",
      neededFor: "DEI Experience Reporting"
    },
    {
      attribute: "Department & Business Unit",
      ecArea: "Job Information",
      purpose: "Filtering and slicing dashboard results by operational segment.",
      sensitivity: "Low",
      neededFor: "All use cases (Reporting)"
    },
    {
      attribute: "Job Level / Grade",
      ecArea: "Job Information",
      purpose: "Identifies frontline vs professional vs leadership sentiment disparities.",
      sensitivity: "Medium",
      neededFor: "Engagement & Culture Pulses"
    },
    {
      attribute: "Legal Entity / Country",
      ecArea: "Job Information",
      purpose: "Enforces Works Council restrictions and localized language routing.",
      sensitivity: "Low",
      neededFor: "All use cases (Compliance)"
    }
  ],
  plan: [
    {
      phase: "Phase 1: Project Kickoff & Scoping Sign-off",
      startWeek: 1,
      endWeek: 2,
      activities: [
        "Executive steering alignment",
        "Scoping questionnaire completion",
        "Technical architecture confirmation",
        "Works Council briefing"
      ]
    },
    {
      phase: "Phase 2: SuccessFactors EC Integration & Data Feed",
      startWeek: 3,
      endWeek: 6,
      activities: [
        "SAP EC data extraction job configuration",
        "SFTP / API connector setup",
        "Data dictionary & privacy field sign-off",
        "Automated directory synchronization test"
      ]
    },
    {
      phase: "Phase 3: Qualtrics EX Platform Build & SSO",
      startWeek: 5,
      endWeek: 9,
      activities: [
        "SAML 2.0 SSO configuration & testing",
        "Survey instrument build & translations",
        "Role-based hierarchy configuration",
        "Executive & Manager dashboard construction"
      ]
    },
    {
      phase: "Phase 4: End-to-End Pilot & User Acceptance Testing",
      startWeek: 10,
      endWeek: 13,
      activities: [
        "Pilot distribution with champion group (n=200)",
        "Dashboard permission audit & anonymization test",
        "Manager training & action planning briefing",
        "Executive sign-off on go-live readiness"
      ]
    },
    {
      phase: "Phase 5: Wave 1 Go-Live & Program Launch",
      startWeek: 14,
      endWeek: 16,
      activities: [
        "Company-wide communication rollout",
        "Live survey distribution launch",
        "Real-time participation tracking",
        "Post go-live stabilization & transition to Phase 2"
      ]
    }
  ],
  risks: [
    {
      risk: "Works Council approval in Germany/Austria delays Wave 1 launch schedule.",
      likelihood: 4,
      impact: 5,
      mitigation: "Engage Works Council in Week 1 with standardized data minimization and anonymity whitepaper.",
      owner: "Legal / DPO"
    },
    {
      risk: "SAP EC employee hierarchy contains broken manager links or circular loops.",
      likelihood: 4,
      impact: 4,
      mitigation: "Run SAP EC hierarchy audit report in Week 2; deploy fallback HRBP hierarchy rule in Qualtrics.",
      owner: "HRIS Manager"
    },
    {
      risk: "Survey fatigue caused by uncoordinated overlapping surveys with PMGM cycle.",
      likelihood: 3,
      impact: 3,
      mitigation: "Establish unified survey calendar and implement 60-day participant contact frequency rules.",
      owner: "Employee Experience Lead"
    },
    {
      risk: "SSO certificate latency or firewall delays between corporate IT and Qualtrics.",
      likelihood: 3,
      impact: 4,
      mitigation: "Initiate IT security ticket on Day 1; validate sandbox SSO within first two weeks.",
      owner: "IT Security"
    },
    {
      risk: "Sensitive demographic fields (DEI / Performance) rejected by local compliance.",
      likelihood: 3,
      impact: 4,
      mitigation: "Design modular survey logic allowing conditional exclusion of sensitive fields by country.",
      owner: "Legal / DPO"
    }
  ],
  stakeholders: [
    {
      role: "Executive Sponsor",
      why: "Owns overall strategic transformation, budget approval, and escalations.",
      involvement: "Fortnightly steering committee & major milestone approvals"
    },
    {
      role: "HR Leadership",
      why: "Ensures alignment with global people strategy and talent retention goals.",
      involvement: "Weekly core check-in and dashboard metric sign-off"
    },
    {
      role: "SAP Integration Architect",
      why: "Configures SAP CPI / SFTP data feeds and employee master directory sync.",
      involvement: "Technical workshops & integration sprint delivery"
    },
    {
      role: "IT Security",
      why: "Validates SAML 2.0 SSO, data encryption in transit, and vendor security.",
      involvement: "Architecture review, SSO configuration, and sign-off"
    },
    {
      role: "Legal / DPO",
      why: "Ensures compliance with GDPR, DPIA, and employee anonymity safeguards.",
      involvement: "Privacy assessment, threshold sign-off, and review"
    },
    {
      role: "Employee Relations / Works Council",
      why: "Represents employee rights, survey question acceptability, and data rules.",
      involvement: "Formal consultation rounds and agreements"
    },
    {
      role: "HRIS Manager",
      why: "Maintains data quality in SAP Employee Central and PMGM.",
      involvement: "Field mapping, data cleansing, and validation runs"
    },
    {
      role: "Employee Experience Lead",
      why: "Designs survey questionnaires, driver models, and action planning.",
      involvement: "Day-to-day project lead and Qualtrics solution owner"
    },
    {
      role: "Talent / Onboarding Lead",
      why: "Defines onboarding lifecycle milestones and success metrics.",
      involvement: "Lifecycle milestone design and review"
    },
    {
      role: "HR Operations Lead",
      why: "Manages offboarding workflows and exit survey triggers in EC.",
      involvement: "Exit process mapping and sensitive trigger rules"
    },
    {
      role: "Talent Development Lead",
      why: "Oversees manager effectiveness and leadership competencies.",
      involvement: "Manager pulse design and development reporting"
    },
    {
      role: "Recruiting Lead",
      why: "Coordinates future Phase 2 candidate feedback touchpoints in RCM.",
      involvement: "Advisory on recruiting touchpoints and consent"
    },
    {
      role: "Project Manager",
      why: "Controls 16-week timeline, risks, milestones, and deliverable sign-offs.",
      involvement: "Daily coordination, standups, and progress reporting"
    }
  ],
  owners: [
    "Executive Sponsor",
    "HR Leadership",
    "SAP Integration Architect",
    "IT Security",
    "Legal / DPO",
    "Employee Relations / Works Council",
    "HRIS Manager",
    "Employee Experience Lead",
    "Talent / Onboarding Lead",
    "HR Operations Lead",
    "Talent Development Lead",
    "Recruiting Lead",
    "Project Manager"
  ],
  tagToUseCase: {
    "ALL": null,
    "ONB": "New Hire Onboarding EX",
    "EXIT": "Lifecycle Exit EX",
    "PULSE": "Company-Wide Engagement & Culture Pulse",
    "MGR": "Manager Effectiveness 180° Pulse",
    "CAND": "Candidate Experience (RCM)"
  }
};
