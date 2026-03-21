const hiddenIssueMap = [
    {
        id: "attrition-skills-gap",
        triggerDepartment: "HR",
        triggerKeywords: ["attrition", "turnover", "resign", "leaving", "retention", "leave"],
        hiddenIssue: {
            title: "Hidden Skills Gap Risk",
            description: "High attrition in technical roles creates an invisible skills gap that typically takes 4-6 months to surface in delivery metrics — by which point client relationships and revenue are already affected.",
            relatedDepartment: "Operations / Sales",
            estimatedAdditionalImpact: "18-24% of attrition cost",
            confidenceLevel: 87,
            whyYouMissedIt: "Skills gap impact is rarely captured in attrition reporting — it shows up later as project delays or client churn.",
            agentsThatAddress: ["L&D Intelligence Agent", "Operations Intelligence Agent"]
        }
    },
    {
        id: "attrition-recruitment-spend",
        triggerDepartment: "HR",
        triggerKeywords: ["attrition", "hiring", "recruit", "turnover", "exit", "headcount"],
        hiddenIssue: {
            title: "Recruitment Advertising Waste",
            description: "Reactive hiring — replacing attrition rather than predicting it — inflates recruitment advertising spend by 34-47% compared to planned hiring. This spend is rarely tracked against attrition as a root cause.",
            relatedDepartment: "Finance",
            estimatedAdditionalImpact: "34-47% of recruitment budget",
            confidenceLevel: 79,
            whyYouMissedIt: "Recruitment costs sit in the HR budget. The root cause (attrition) sits in the HR narrative. Finance never connects them.",
            agentsThatAddress: ["Attrition Prediction Agent", "Budget Forecasting Agent"]
        }
    },
    {
        id: "finance-close-decision-lag",
        triggerDepartment: "Finance",
        triggerKeywords: ["month", "close", "reporting", "mis", "variance", "board", "finance", "report"],
        hiddenIssue: {
            title: "Leadership Decision Lag",
            description: "When month-end data arrives 3 weeks late, your leadership team makes Q+1 decisions on Q-1 reality. This decision lag compounds across departments — particularly in headcount planning and capital allocation.",
            relatedDepartment: "HR / Operations",
            estimatedAdditionalImpact: "2-4% of operational budget",
            confidenceLevel: 83,
            whyYouMissedIt: "Decision lag is invisible — leaders adapt to working with stale data and stop noticing the gap between what they know and what is actually happening.",
            agentsThatAddress: ["Finance Close Agent", "Reporting Intelligence Agent"]
        }
    },
    {
        id: "sla-client-churn",
        triggerDepartment: "Operations",
        triggerKeywords: ["sla", "delivery", "deadline", "client", "breach", "delay", "service"],
        hiddenIssue: {
            title: "Silent Client Churn Risk",
            description: "SLA breaches that are resolved without formal escalation are rarely tracked against client health scores. Research shows that 3 unescalated breaches in 12 months predict a 68% churn probability in the following year.",
            relatedDepartment: "Sales / Finance",
            estimatedAdditionalImpact: "Lost revenue per churned client",
            confidenceLevel: 74,
            whyYouMissedIt: "Client health scoring typically relies on NPS surveys and escalation logs — not operational delivery data. The signal is in ops. The outcome is in sales.",
            agentsThatAddress: ["SLA Intelligence Agent", "Customer Churn Agent"]
        }
    },
    {
        id: "manual-process-compliance-risk",
        triggerDepartment: "HR",
        triggerKeywords: ["manual", "excel", "spreadsheet", "process", "report", "data", "entry"],
        hiddenIssue: {
            title: "Compliance Exposure from Manual Processes",
            description: "Every manual data entry point is a potential compliance gap. Organisations relying on Excel-based HR processes face an average of 8.4 audit findings per year — each requiring 3-5 days of remediation effort and carrying regulatory penalty risk.",
            relatedDepartment: "Legal / Finance",
            estimatedAdditionalImpact: "₹8-15L annual remediation cost",
            confidenceLevel: 81,
            whyYouMissedIt: "Compliance risk from manual processes is categorised as an IT or audit issue — not an HR process issue. The root cause is invisible in most risk registers.",
            agentsThatAddress: ["HR Compliance Agent", "HITL Compliance Agent"]
        }
    },
    {
        id: "resource-allocation-revenue-leak",
        triggerDepartment: "Operations",
        triggerKeywords: ["resource", "allocation", "capacity", "utilisation", "headcount", "project", "utilization"],
        hiddenIssue: {
            title: "Revenue Leak from Under-utilisation",
            description: "Resource misallocation creates two simultaneous losses — over-allocated teams that burn out and under-deliver, and under-allocated teams that represent idle payroll cost. Together these typically account for 11-18% of total payroll as wasted capacity value.",
            relatedDepartment: "Finance / HR",
            estimatedAdditionalImpact: "11-18% of total payroll cost",
            confidenceLevel: 76,
            whyYouMissedIt: "Resource utilisation is tracked at project level. The organisation-level pattern of systematic misallocation is never aggregated or analysed.",
            agentsThatAddress: ["Resource Optimisation Agent", "Operations Intelligence Agent"]
        }
    },
    {
        id: "manager-time-tax",
        triggerDepartment: "HR",
        triggerKeywords: ["manager", "performance", "review", "feedback", "reporting", "status", "meeting"],
        hiddenIssue: {
            title: "The Manager Time Tax",
            description: "Middle managers without intelligence layers spend an average of 6-8 hours per week compiling status reports, chasing data, and preparing for review meetings. This is 15-20% of their total working time — removed from team leadership, client relationships, and strategic work.",
            relatedDepartment: "All Departments",
            estimatedAdditionalImpact: "15-20% of management payroll",
            confidenceLevel: 88,
            whyYouMissedIt: "Manager time is never measured as a process cost. It appears as 'overhead' — invisible in P&L and rarely discussed in efficiency reviews.",
            agentsThatAddress: ["Reporting Intelligence Agent", "Performance Intelligence Agent"]
        }
    },
    {
        id: "hiring-quality-delivery",
        triggerDepartment: "HR",
        triggerKeywords: ["hiring", "talent", "recruitment", "skill", "quality", "capability", "recruit"],
        hiddenIssue: {
            title: "Hiring Quality Impact on Delivery",
            description: "Reactive talent acquisition — filling vacancies rather than building capability — degrades hire quality under time pressure. Research shows reactive hiring produces 23% lower performance scores in the first 12 months compared to planned hiring against a skills blueprint.",
            relatedDepartment: "Operations / Sales",
            estimatedAdditionalImpact: "23% performance gap per reactive hire",
            confidenceLevel: 72,
            whyYouMissedIt: "Hiring quality impact on operational delivery is almost never tracked. The connection between TA decisions and delivery outcomes is invisible without a unified intelligence layer.",
            agentsThatAddress: ["Attrition Prediction Agent", "L&D Intelligence Agent", "Performance Intelligence Agent"]
        }
    },
    {
        id: "vendor-payment-cash-flow",
        triggerDepartment: "Finance",
        triggerKeywords: ["vendor", "payment", "procurement", "invoice", "payable", "supplier", "accounts"],
        hiddenIssue: {
            title: "Cash Flow Erosion from Payment Patterns",
            description: "Late vendor payments — typically caused by manual approval queues — cost organisations in two ways: early payment discounts missed (averaging 2.3% of invoice value) and late payment penalties incurred. Combined this represents 3-5% of total procurement spend annually.",
            relatedDepartment: "Operations",
            estimatedAdditionalImpact: "3-5% of annual procurement spend",
            confidenceLevel: 84,
            whyYouMissedIt: "Early payment discounts are tracked as savings in finance. Missed discounts are never tracked at all — they are simply never realised.",
            agentsThatAddress: ["Vendor Intelligence Agent", "Finance Close Agent"]
        }
    },
    {
        id: "data-silos-cross-dept",
        triggerDepartment: "IT",
        triggerKeywords: ["data", "system", "integration", "silo", "manual", "export", "report", "scattered"],
        hiddenIssue: {
            title: "Cross-Departmental Decision Blindness",
            description: "When HR, Finance, and Operations operate from separate data systems with no unified view, decisions in one department routinely create unplanned costs in another. A hiring surge in HR creates an unplanned infrastructure cost in IT and a space cost in Operations — visible to no one until it is too late to optimise.",
            relatedDepartment: "All Departments",
            estimatedAdditionalImpact: "6-12% of operational budget",
            confidenceLevel: 79,
            whyYouMissedIt: "Cross-departmental cost impact of isolated decisions is never modelled. Each department optimises locally. The system underperforms globally.",
            agentsThatAddress: ["Data Consolidation Agent", "Reporting Intelligence Agent", "HITL Compliance Agent"]
        }
    }
];

export default hiddenIssueMap;
