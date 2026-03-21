const industryBenchmarks = {
    "Healthcare & Hospitals": {
        attritionCostPerHire: 187000,
        monthlyHRHours: 340,
        slaBreachRate: 12.4,
        financeCloseDays: 8,
        complianceHoursMonthly: 180,
        clinicalTurnoverPct: 23,
        monthEndReconciliationDays: 6,
        procurementCycleWeeks: 4.2,
        automationROI: { hoursSavedMonthly: 127, processesAutomated: 8, touchpointsEliminated: 34, hitlGates: 6 },
        signals: [
            { signalName: "Clinical Staff Attrition Signal", description: "3 nurses in your ICU ward show 40% drop in shift acceptance over 6 weeks — attrition risk elevated", confidence: 83, horizon: "60 days ahead", action: "Nurse manager alert + retention interview scheduled" },
            { signalName: "Compliance Gap Detection", description: "2 departments have certification renewals expiring in 34 days — regulatory risk elevated", confidence: 97, horizon: "34 days ahead", action: "HR compliance alert sent to dept heads" },
            { signalName: "Budget Variance Warning", description: "Pharma procurement running 11% over budget — month-end overrun projected at ₹14L", confidence: 78, horizon: "3 weeks ahead", action: "CFO variance alert with drill-down report" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Compliance reporting automated across 6 depts" },
            { month: 2, capability: "Attrition risk detection live for clinical staff" },
            { month: 3, capability: "Procurement variance alerts active" },
            { month: 6, capability: "Full predictive intelligence layer operational" }
        ],
        agentsActivated: ["Attrition Prediction Agent", "Compliance Intelligence Agent", "Finance Variance Agent", "HR Data Consolidation Agent"],
        outcomeNarratives: {
            operational: "Your operations team currently spends 23 days per quarter on manual compliance reporting across 6 departments. With Pithonix deployed, the Data Consolidation Agent pulls from your HMIS, LMS, and attendance system nightly. By week 6, your compliance officer receives a pre-built report every Monday at 7am — verified, formatted, and ready to submit. The 23-day process becomes a 4-hour review.",
            revenue: "Clinical staff attrition at your scale costs ₹4.3Cr annually in recruitment, onboarding, and productivity loss. The Attrition Prediction Agent identifies at-risk nurses and doctors 60 days before they resign, enabling targeted retention conversations. Conservative modelling puts attrition reduction at 18% in year one — recovering ₹77L in direct replacement costs.",
            growth: "Your leadership team currently makes bed allocation, staffing, and procurement decisions based on last month's data. The Intelligence Layer gives them a live operations dashboard — patient load predictions 72 hours ahead, staff availability signals, and procurement demand forecasting. Decisions that took 3 days of data gathering now take 20 minutes.",
            employee: "Your nursing and administrative staff spend 34% of their time on documentation, reporting, and manual data entry. Pithonix automates 8 of the highest-volume manual workflows — freeing 127 hours per month across your HR and operations teams. That is time returned to patient care and strategic work.",
            manager: "Ward managers and department heads currently receive operational data weekly at best. With Pithonix, they receive a personalised intelligence brief every morning — their team's attendance, open tickets, compliance status, and budget position — in one place, before their first meeting."
        },
        estimatedROI: { annualValue: "₹1.8Cr", reduction: "34%", paybackMonths: 7 },
        discoveryScore: 83,
        legacySystems: [
            { id: 'epic', name: 'Epic EHR', category: 'Clinical Records' },
            { id: 'cerner', name: 'Oracle Cerner', category: 'Clinical Records' },
            { id: 'workday', name: 'Workday Healthcare', category: 'HR' }
        ],
        primaryChallenges: [
            {
                statement: "Credentialing Backlog",
                initialHurdles: ["Manual verify with boards", "Missing documents"],
                courseCorrectionTime: "4 weeks",
                projection: "85% faster onboarding"
            }
        ]
    },
    "Banking & Financial Services": {
        attritionCostPerHire: 264000,
        monthlyHRHours: 280,
        complianceHoursMonthly: 420,
        financeCloseDays: 4.5,
        auditPrepDays: 22,
        regulatoryReportingHours: 160,
        talentAcquisitionDays: 38,
        automationROI: { hoursSavedMonthly: 163, processesAutomated: 11, touchpointsEliminated: 47, hitlGates: 9 },
        signals: [
            { signalName: "Regulatory Breach Risk", description: "4 KYC reviews overdue by more than 30 days — RBI compliance window closing in 12 days", confidence: 94, horizon: "12 days ahead", action: "Compliance head alert with case list and priority ranking" },
            { signalName: "Talent Attrition Signal", description: "2 relationship managers in your wealth division show disengagement signals — attrition risk high", confidence: 79, horizon: "45 days ahead", action: "HR business partner alert with retention playbook" },
            { signalName: "Budget Overrun Detection", description: "Branch operations spend tracking 14% above Q3 budget — overrun of ₹28L projected", confidence: 82, horizon: "18 days ahead", action: "CFO variance report with branch-level drill-down" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "KYC and compliance gap tracking automated" },
            { month: 2, capability: "Attrition early warning for revenue teams live" },
            { month: 3, capability: "Branch performance intelligence dashboards active" },
            { month: 6, capability: "Full regulatory intelligence layer deployed" }
        ],
        agentsActivated: ["Regulatory Compliance Agent", "Talent Risk Agent", "Branch Intelligence Agent", "Audit Preparation Agent"],
        outcomeNarratives: {
            operational: "Your compliance team currently takes 22 days to prepare for each RBI audit — pulling data from 7 systems manually. Pithonix connects to your core banking, HR, and transaction systems. The Compliance Agent tracks every regulatory deadline and builds the audit evidence pack automatically. Audit prep drops from 22 days to 4 days.",
            revenue: "High-performing relationship managers in banking cost ₹2.6L to replace and take 4 months to reach full productivity. Early identification of attrition risk in your revenue-generating teams protects ₹1.8Cr in productivity value annually at your headcount.",
            growth: "Your branch heads make staffing and service decisions based on monthly MIS reports that are 3 weeks old. Real-time branch intelligence — customer wait times, transaction volumes, staff utilisation — means faster, more profitable decisions at every branch.",
            employee: "Branch and operations staff spend 37% of their time on regulatory documentation and manual reporting. Automating the 11 highest-volume compliance workflows returns 163 hours per month to your teams — time that goes into client relationships, not paperwork.",
            manager: "Your regional managers currently consolidate branch performance data manually before every leadership review. Pithonix delivers an automated regional performance brief — revenue, compliance, staffing, and customer satisfaction — 24 hours before every review meeting."
        },
        estimatedROI: { annualValue: "₹2.7Cr", reduction: "41%", paybackMonths: 6 },
        discoveryScore: 87,
        legacySystems: [
            { id: 'finacle', name: 'Finacle', category: 'Core Banking' },
            { id: 'sap-hr', name: 'SAP HR', category: 'Human Resources' },
            { id: 'tcs-baNcs', name: 'TCS BaNCS', category: 'Payments' },
            { id: 'oracle-flexcube', name: 'Oracle FLEXCUBE', category: 'Core Banking' }
        ],
        primaryChallenges: [
            {
                statement: "Manual KYC/AML Verification Lag",
                initialHurdles: ["Data Silos in Legacy DB", "Non-standardized Document OCR"],
                courseCorrectionTime: "3.5 weeks",
                projection: "92% reduction in verification TAT"
            },
            {
                statement: "Cross-platform Reconciliation Errors",
                initialHurdles: ["Batch processing delays", "Manual Entry Mismatches"],
                courseCorrectionTime: "2 weeks",
                projection: "99.9% reconciliation accuracy"
            }
        ]
    },
    "IT & Technology Services": {
        attritionCostPerHire: 312000,
        projectDeliverySlippage: 34,
        billingLeakagePct: 8.3,
        talentAcquisitionDays: 52,
        oncallBurdenHours: 140,
        automationROI: { hoursSavedMonthly: 189, processesAutomated: 13, touchpointsEliminated: 52, hitlGates: 7 },
        signals: [
            { signalName: "Billing Leakage Alert", description: "3 active client projects showing 8.3% unbilled time — ₹23L revenue at risk this quarter", confidence: 91, horizon: "Real-time", action: "Finance team alert with project and timesheet breakdown" },
            { signalName: "Attrition Risk — Engineering", description: "4 senior engineers in your product team show reduced commit frequency and L&D disengagement", confidence: 77, horizon: "60-90 days ahead", action: "Engineering manager alert with individual risk profiles" },
            { signalName: "Project Delivery Risk", description: "2 client projects tracking 3 weeks behind schedule — SLA breach probable in 18 days", confidence: 86, horizon: "18 days ahead", action: "PMO alert with resource reallocation recommendation" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Timesheet and billing leakage tracking automated" },
            { month: 2, capability: "Engineer attrition early warning live" },
            { month: 3, capability: "Real-time project delivery risk monitoring active" },
            { month: 6, capability: "Full delivery intelligence platform operational" }
        ],
        agentsActivated: ["Delivery Risk Agent", "Billing Intelligence Agent", "Talent Retention Agent", "PMO Intelligence Agent"],
        outcomeNarratives: {
            operational: "Your PMO currently identifies project delivery risks during weekly status meetings — by which point corrective action costs 3x more than early intervention. The Operations Intelligence Agent monitors sprint velocity, resource allocation, and client SLA thresholds in real time. Risk signals surface 18 days before breach — not 3 days after.",
            revenue: "Billing leakage across professional services firms averages 8.3% of revenue. At your scale, that is ₹1.2Cr per quarter in unbilled work. The Finance Intelligence Agent tracks timesheet entries against project budgets daily — closing the leakage gap within 90 days of deployment.",
            growth: "Technology companies that retain senior engineers grow 2.3x faster than those that replace them. Protecting your top-quartile engineering talent through early attrition detection is the single highest-ROI use of intelligence in your organisation.",
            employee: "Your engineers spend an average of 4.2 hours per week on status reporting, timesheet reconciliation, and internal process documentation. Automating these workflows returns 189 hours per month across your teams — time that goes back to building product.",
            manager: "Engineering managers and delivery leads currently spend 6 hours per week compiling project health reports. Pithonix delivers an automated delivery intelligence brief every Monday — sprint status, resource utilisation, client SLA risk, and billing health — before the week begins."
        },
        estimatedROI: { annualValue: "₹3.1Cr", reduction: "38%", paybackMonths: 5 },
        discoveryScore: 89,
        legacySystems: [
            { id: 'jira', name: 'Jira Software', category: 'Project Management' },
            { id: 'github', name: 'GitHub Enterprise', category: 'DevOps' },
            { id: 'aws', name: 'AWS Console', category: 'Infrastructure' },
            { id: 'servicenow', name: 'ServiceNow', category: 'ITSM' }
        ],
        primaryChallenges: [
            {
                statement: "Project Delivery Slippage",
                initialHurdles: ["Resource over-allocation", "Siloed sprint data"],
                courseCorrectionTime: "1.5 weeks",
                projection: "28% improvement in velocity"
            }
        ]
    },
    "GCC / Global Capability Centre": {
        attritionCostPerHire: 358000,
        talentAcquisitionDays: 47,
        billingEfficiencyLoss: 18.2,
        complianceHoursMonthly: 240,
        headcountPlanningCycleWeeks: 6,
        automationROI: { hoursSavedMonthly: 211, processesAutomated: 14, touchpointsEliminated: 61, hitlGates: 8 },
        signals: [
            { signalName: "Headcount Risk Signal", description: "Global demand for 23 new positions confirmed — current hiring velocity will miss target by 7 weeks", confidence: 88, horizon: "7 weeks ahead", action: "TA head alert with recruitment acceleration plan" },
            { signalName: "Skill Obsolescence Risk", description: "14% of your engineering team have not updated core certifications in 18 months — client delivery risk elevated", confidence: 83, horizon: "60 days ahead", action: "L&D team alert with personalised upskilling paths" },
            { signalName: "Attrition Cluster Signal", description: "3 team leads in your analytics practice show coordinated disengagement — possible group exit risk", confidence: 74, horizon: "90 days ahead", action: "CHRO alert with retention intervention recommendation" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Headcount forecasting and hiring gap alerts live" },
            { month: 2, capability: "Skill gap and L&D automation deployed" },
            { month: 3, capability: "Global stakeholder reporting automated" },
            { month: 6, capability: "Full GCC intelligence platform operational" }
        ],
        agentsActivated: ["Headcount Intelligence Agent", "Skill Gap Agent", "Global Reporting Agent", "Attrition Cluster Agent"],
        outcomeNarratives: {
            operational: "Your GCC operations team manages headcount planning, compliance reporting, and performance cycles across multiple global stakeholders — typically requiring 6-week planning cycles and 4 rounds of manual consolidation. Pithonix compresses this to a continuously updated intelligence layer that gives your COO a live view of capacity, skills, and risk at any moment.",
            revenue: "GCC billing efficiency loss averages 18.2% due to unplanned attrition, skill gaps, and headcount mismatches. At your scale, recovering even 40% of that leakage represents ₹3.2Cr in annual value. The Intelligence Layer identifies the root causes before they hit your P&L.",
            growth: "Global clients demand predictable, scalable delivery from their GCC partners. The single biggest growth inhibitor is reactive talent management — replacing lost capacity instead of building planned capacity. Predictive talent intelligence makes your GCC a proactive delivery partner, not a reactive one.",
            employee: "Your GCC employees cite administrative burden as the top driver of disengagement in exit interviews. Automating 14 high-volume internal workflows — timesheet processing, leave management, compliance submissions, performance data collection — removes the work your best people hate most.",
            manager: "GCC team leads currently compile global stakeholder reports manually — averaging 8 hours per week in data gathering alone. Pithonix delivers automated stakeholder-ready reports with live delivery metrics, team health indicators, and risk flags — before every global review call."
        },
        estimatedROI: { annualValue: "₹4.1Cr", reduction: "44%", paybackMonths: 6 },
        discoveryScore: 91
    },
    "Manufacturing & Industrial": {
        attritionCostPerHire: 124000,
        operationsBottleneckCost: 2400000,
        qualityEscapeCost: 1840000,
        oeePercent: 68,
        supplyChainVariancePct: 18,
        maintenanceReactivePct: 72,
        automationROI: { hoursSavedMonthly: 143, processesAutomated: 9, touchpointsEliminated: 38, hitlGates: 7 },
        signals: [
            { signalName: "Production Bottleneck Signal", description: "Line 3 throughput tracking 22% below baseline — bottleneck at assembly stage predicted in 48 hours", confidence: 87, horizon: "48 hours ahead", action: "Operations head alert with resource reallocation recommendation" },
            { signalName: "Quality Escape Risk", description: "Batch QC variance trending above control limits — rejection risk elevated for next 2 production runs", confidence: 81, horizon: "Next production cycle", action: "Quality manager alert with inspection priority list" },
            { signalName: "Supply Chain Variance Alert", description: "Key component supplier delivery tracking 3 weeks late — production schedule impact of ₹18L", confidence: 93, horizon: "3 weeks ahead", action: "Procurement head alert with alternative supplier options" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "OEE tracking and bottleneck alerts live" },
            { month: 2, capability: "Predictive quality control monitoring deployed" },
            { month: 3, capability: "Supply chain variance intelligence active" },
            { month: 6, capability: "Full manufacturing intelligence platform operational" }
        ],
        agentsActivated: ["OEE Intelligence Agent", "Quality Prediction Agent", "Supply Chain Agent", "Maintenance Intelligence Agent"],
        outcomeNarratives: {
            operational: "Your operations team currently identifies production bottlenecks during shift-end reviews — hours after the throughput loss has occurred. The Operations Intelligence Agent monitors line velocity, resource allocation, and quality metrics in real time, surfacing bottleneck risk 48 hours before it materialises. Your line managers intervene before loss, not after.",
            revenue: "Production bottlenecks and quality escapes cost your organisation ₹4.2Cr annually. Predictive intervention — catching the warning signs 48-72 hours early — reduces this cost by an estimated 34% in year one. That is ₹1.4Cr in recovered production value.",
            growth: "Manufacturing organisations with real-time OEE visibility grow 19% faster than those relying on lagging indicators. Moving your OEE tracking from monthly reports to live intelligence is the foundation of every growth investment your leadership will make.",
            employee: "Your shop floor supervisors and quality managers spend 4 hours per shift on manual data recording, shift handover documentation, and compliance paperwork. Automating these workflows returns 143 hours per month to your production teams — time that goes into quality improvement and process optimisation.",
            manager: "Plant managers currently receive production data in daily reports compiled manually by supervisors. Pithonix delivers a live plant intelligence dashboard — OEE by line, quality metrics, maintenance status, and supply chain risk — available at any time on any device."
        },
        estimatedROI: { annualValue: "₹2.2Cr", reduction: "31%", paybackMonths: 8 },
        discoveryScore: 82
    },
    "Retail & FMCG": {
        attritionCostPerHire: 98000,
        inventoryVariancePct: 4.7,
        demandForecastError: 23,
        promotionalROI: 2.3,
        shrinkagePct: 1.8,
        automationROI: { hoursSavedMonthly: 118, processesAutomated: 8, touchpointsEliminated: 29, hitlGates: 5 },
        signals: [
            { signalName: "Inventory Variance Alert", description: "3 SKUs in your top-selling category showing 4.7% variance — stockout risk in 12 days", confidence: 89, horizon: "12 days ahead", action: "Category manager alert with reorder recommendation" },
            { signalName: "Demand Surge Signal", description: "Regional event calendar and social signals indicate 34% demand spike in 3 stores next week", confidence: 76, horizon: "7 days ahead", action: "Store operations alert with staffing and inventory recommendation" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Inventory variance monitoring and stockout alerts live" },
            { month: 2, capability: "Demand surge prediction for store operations deployed" },
            { month: 3, capability: "Promotional ROI tracking automated" },
            { month: 6, capability: "Full retail intelligence platform operational" }
        ],
        agentsActivated: ["Inventory Intelligence Agent", "Demand Forecast Agent", "Store Operations Agent"],
        outcomeNarratives: {
            operational: "Your category managers currently reconcile inventory data from your POS, WMS, and supplier portals manually — a 3-day process that produces a picture that is already outdated. Pithonix connects all three systems and delivers a live inventory intelligence view. Stockout risk is visible 12 days before it hits the shelf.",
            revenue: "Demand forecasting error at your scale costs ₹2.1Cr annually in lost sales from stockouts and ₹1.4Cr in excess inventory write-offs. Reducing forecast error from 23% to 11% — a realistic 90-day outcome — recovers ₹1.7Cr in year one.",
            growth: "Retail chains with real-time demand intelligence open new locations 40% more successfully than those using historical averages. Your expansion decisions become data-driven from day one.",
            employee: "Store managers spend 6 hours per week on manual stock counts, shift scheduling, and performance reporting. Automating these workflows returns 118 hours per month across your store network.",
            manager: "Regional managers currently visit stores to assess performance. Pithonix delivers a live regional intelligence dashboard — sales velocity, stock health, staff utilisation, and shrinkage signals — before every review."
        },
        estimatedROI: { annualValue: "₹1.9Cr", reduction: "29%", paybackMonths: 9 },
        discoveryScore: 79
    },
    "Education & EdTech": {
        attritionCostPerHire: 112000,
        facultyRetentionRate: 71,
        studentAttritionPct: 18,
        admissionConversionRate: 34,
        automationROI: { hoursSavedMonthly: 94, processesAutomated: 7, touchpointsEliminated: 24, hitlGates: 4 },
        signals: [
            { signalName: "Student Attrition Signal", description: "14 students in your MBA programme show declining engagement signals — dropout risk elevated", confidence: 81, horizon: "45 days ahead", action: "Academic advisor alert with individual outreach recommendation" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Student engagement monitoring and at-risk alerts live" },
            { month: 2, capability: "Admissions funnel intelligence deployed" },
            { month: 3, capability: "Faculty performance and retention tracking active" },
            { month: 6, capability: "Full institutional intelligence platform operational" }
        ],
        agentsActivated: ["Student Success Agent", "Admissions Intelligence Agent", "Faculty Retention Agent"],
        outcomeNarratives: {
            operational: "Your academic operations team manages admissions, faculty performance, and student engagement across multiple programmes — typically through separate systems with no unified view. Pithonix connects your SIS, LMS, and CRM to deliver a live institutional intelligence layer.",
            revenue: "Student attrition at 18% costs your institution ₹2.8Cr annually in lost fee revenue and reputational impact. Early identification of at-risk students — 45 days before dropout — enables targeted intervention that reduces attrition by an estimated 22% in year one.",
            growth: "Institutions with real-time admission funnel intelligence convert 41% more applications than those managing the process manually. Your admissions team gets a live funnel view — application status, conversion probability, and intervention timing.",
            employee: "Faculty and administrative staff spend 31% of their time on manual reporting, attendance tracking, and compliance documentation. Automating these workflows returns 94 hours per month to your institution.",
            manager: "Programme directors currently compile student performance and engagement data manually for accreditation reviews. Pithonix delivers automated programme health reports — attendance, assessment outcomes, engagement scores, and risk flags — on demand."
        },
        estimatedROI: { annualValue: "₹1.4Cr", reduction: "26%", paybackMonths: 10 },
        discoveryScore: 76
    },
    "Infrastructure & Real Estate": {
        attritionCostPerHire: 142000,
        projectOverrunPct: 28,
        compliancePenaltiesAnnual: 4200000,
        vendorPaymentDelayDays: 34,
        automationROI: { hoursSavedMonthly: 134, processesAutomated: 9, touchpointsEliminated: 33, hitlGates: 8 },
        signals: [
            { signalName: "Project Overrun Signal", description: "Phase 2 construction tracking 3 weeks behind — cost overrun of ₹34L projected at current velocity", confidence: 84, horizon: "3 weeks ahead", action: "Project head alert with timeline recovery options" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Project milestone tracking and overrun alerts live" },
            { month: 2, capability: "Vendor performance and payment intelligence deployed" },
            { month: 3, capability: "Compliance deadline tracking automated" },
            { month: 6, capability: "Full project intelligence platform operational" }
        ],
        agentsActivated: ["Project Intelligence Agent", "Vendor Risk Agent", "Compliance Tracking Agent"],
        outcomeNarratives: {
            operational: "Your project management teams track progress through weekly site reports and manual milestone updates — a process that surfaces overrun risk 3 weeks after intervention would have been cost-effective. The Operations Intelligence Agent monitors milestone velocity, vendor delivery, and resource allocation in real time.",
            revenue: "Construction project overruns at your scale average 28% of project value. Predictive schedule intelligence reduces overruns by an estimated 19% in year one — recovering ₹2.1Cr in direct project cost.",
            growth: "Infrastructure developers with real-time project intelligence win more bids by demonstrating delivery predictability. Your track record becomes a competitive differentiator.",
            employee: "Site managers and project coordinators spend 5 hours per week on manual progress reporting and vendor coordination. Automating these workflows returns 134 hours per month to your teams.",
            manager: "Project directors currently compile cross-site performance reports manually for board reviews. Pithonix delivers an automated portfolio intelligence brief — schedule health, budget status, vendor performance, and risk flags — 24 hours before every board meeting."
        },
        estimatedROI: { annualValue: "₹2.4Cr", reduction: "33%", paybackMonths: 8 },
        discoveryScore: 81
    },
    "Pharmaceuticals & Life Sciences": {
        attritionCostPerHire: 228000,
        regulatorySubmissionDays: 45,
        batchRejectionRate: 3.2,
        auditFindingsPerYear: 8.4,
        automationROI: { hoursSavedMonthly: 156, processesAutomated: 11, touchpointsEliminated: 43, hitlGates: 9 },
        signals: [
            { signalName: "Batch Quality Risk", description: "QC variance in batch BX-2247 trending above control limits — rejection risk at 34% probability", confidence: 86, horizon: "Current production cycle", action: "Quality director alert with inspection priority and deviation report" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Batch quality monitoring and deviation alerts live" },
            { month: 2, capability: "Regulatory submission tracking automated" },
            { month: 3, capability: "Audit preparation intelligence deployed" },
            { month: 6, capability: "Full quality intelligence platform operational" }
        ],
        agentsActivated: ["Quality Assurance Agent", "Regulatory Intelligence Agent", "Batch Monitoring Agent", "Audit Preparation Agent"],
        outcomeNarratives: {
            operational: "Your quality and regulatory teams currently manage batch documentation, deviation tracking, and audit preparation across disconnected systems. Pithonix connects your LIMS, ERP, and QMS to deliver a unified compliance intelligence layer — audit-ready at any time.",
            revenue: "Batch rejections at 3.2% of production runs cost your organisation ₹3.8Cr annually in direct write-offs and regulatory impact. Predictive quality intelligence reduces rejection rate to below 1.8% within 90 days.",
            growth: "Pharma organisations with real-time regulatory intelligence bring products to market 34% faster than those managing compliance reactively. Your regulatory team works from live intelligence, not retrospective reports.",
            employee: "Your quality and regulatory staff spend 43% of their time on documentation, data reconciliation, and audit preparation. Automating these workflows returns 156 hours per month to your teams.",
            manager: "Quality directors and regulatory heads currently prepare compliance dashboards manually for every leadership review. Pithonix delivers automated compliance intelligence — batch quality, audit status, deviation tracking, and submission timelines — on demand."
        },
        estimatedROI: { annualValue: "₹3.4Cr", reduction: "39%", paybackMonths: 7 },
        discoveryScore: 88
    },
    "Logistics & Supply Chain": {
        attritionCostPerHire: 118000,
        onTimeDeliveryRate: 82,
        warehouseEfficiency: 67,
        lastMileFailureRate: 12.3,
        automationROI: { hoursSavedMonthly: 127, processesAutomated: 9, touchpointsEliminated: 34, hitlGates: 6 },
        signals: [
            { signalName: "Last Mile Failure Risk", description: "3 delivery zones showing 12.3% failure rate — customer SLA breach risk elevated this week", confidence: 88, horizon: "48 hours ahead", action: "Operations head alert with route optimisation recommendation" }
        ],
        sixMonthForecast: [
            { month: 1, capability: "Last-mile failure tracking and alerts live" },
            { month: 2, capability: "Warehouse efficiency monitoring deployed" },
            { month: 3, capability: "SLA breach prediction intelligence active" },
            { month: 6, capability: "Full delivery intelligence platform operational" }
        ],
        agentsActivated: ["Delivery Intelligence Agent", "Warehouse Optimisation Agent", "SLA Risk Agent"],
        outcomeNarratives: {
            operational: "Your operations team currently identifies last-mile delivery failures after they occur — through customer complaints and daily exception reports. The SLA Intelligence Agent monitors route performance, driver capacity, and delivery patterns in real time, surfacing risk 48 hours before breach.",
            revenue: "Last-mile failure at 12.3% costs your organisation ₹2.4Cr annually in SLA penalties, re-delivery costs, and customer churn. Reducing failure rate to below 6% — a 90-day outcome — recovers ₹1.2Cr in direct operational cost.",
            growth: "Logistics companies with real-time delivery intelligence win and retain enterprise clients at 2.4x the rate of those operating reactively. Your delivery predictability becomes a commercial differentiator.",
            employee: "Your dispatch and warehouse teams spend 4 hours per shift on manual routing, exception handling, and status reporting. Automating these workflows returns 127 hours per month to your operations.",
            manager: "Operations managers currently compile delivery performance reports manually for every client review. Pithonix delivers automated delivery intelligence — on-time rates, zone performance, driver utilisation, and SLA risk — before every client call."
        },
        estimatedROI: { annualValue: "₹1.8Cr", reduction: "31%", paybackMonths: 8 },
        discoveryScore: 84
    }
};

export const getBenchmark = (industry) => industryBenchmarks[industry] || industryBenchmarks["IT & Technology Services"];

export default industryBenchmarks;
