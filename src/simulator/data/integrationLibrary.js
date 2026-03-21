const integrationLibrary = {
    "Healthcare & Hospitals": {
        core: [
            { tool: "HMIS", connectionType: "API", purpose: "Patient and clinical data", color: "#00B4D8" },
            { tool: "SAP HR", connectionType: "SFTP", purpose: "Payroll and headcount", color: "#0A2342" },
            { tool: "LMS", connectionType: "API", purpose: "Training and certifications", color: "#F4A261" },
            { tool: "LIMS", connectionType: "API", purpose: "Lab results and quality", color: "#10B981" },
            { tool: "Oracle Finance", connectionType: "API", purpose: "Budget and procurement", color: "#6366F1" },
            { tool: "Attendance", connectionType: "Webhook", purpose: "Real-time staff tracking", color: "#EC4899" }
        ]
    },
    "Banking & Financial Services": {
        core: [
            { tool: "Core Banking", connectionType: "API", purpose: "Transaction and account data", color: "#00B4D8" },
            { tool: "SAP HR", connectionType: "API", purpose: "People and payroll data", color: "#0A2342" },
            { tool: "Finacle", connectionType: "API", purpose: "Retail banking operations", color: "#F4A261" },
            { tool: "KYC Platform", connectionType: "API", purpose: "Customer due diligence", color: "#10B981" },
            { tool: "Temenos", connectionType: "API", purpose: "Core banking integration", color: "#6366F1" },
            { tool: "Compliance Hub", connectionType: "Webhook", purpose: "Regulatory tracking", color: "#EC4899" }
        ]
    },
    "IT & Technology Services": {
        core: [
            { tool: "Jira", connectionType: "API", purpose: "Sprint and delivery tracking", color: "#00B4D8" },
            { tool: "Salesforce", connectionType: "API", purpose: "Client and revenue data", color: "#0A2342" },
            { tool: "GitHub", connectionType: "Webhook", purpose: "Engineer activity signals", color: "#F4A261" },
            { tool: "Workday", connectionType: "API", purpose: "HR and talent data", color: "#10B981" },
            { tool: "ServiceNow", connectionType: "API", purpose: "Incident and ops data", color: "#6366F1" },
            { tool: "Harvest", connectionType: "API", purpose: "Timesheet and billing", color: "#EC4899" }
        ]
    },
    "GCC / Global Capability Centre": {
        core: [
            { tool: "Workday", connectionType: "API", purpose: "Global HR and headcount", color: "#00B4D8" },
            { tool: "SuccessFactors", connectionType: "API", purpose: "Performance management", color: "#0A2342" },
            { tool: "Jira", connectionType: "API", purpose: "Delivery tracking", color: "#F4A261" },
            { tool: "LMS", connectionType: "API", purpose: "Skills and L&D tracking", color: "#10B981" },
            { tool: "PowerBI", connectionType: "API", purpose: "Stakeholder reporting", color: "#6366F1" },
            { tool: "Teams", connectionType: "Webhook", purpose: "Engagement signals", color: "#EC4899" }
        ]
    },
    "Manufacturing & Industrial": {
        core: [
            { tool: "SAP ERP", connectionType: "API", purpose: "Production and procurement", color: "#00B4D8" },
            { tool: "SCADA", connectionType: "OPC-UA", purpose: "Live production signals", color: "#0A2342" },
            { tool: "QMS", connectionType: "API", purpose: "Quality control data", color: "#F4A261" },
            { tool: "MES", connectionType: "API", purpose: "Manufacturing execution", color: "#10B981" },
            { tool: "EHS Platform", connectionType: "API", purpose: "Safety and compliance", color: "#6366F1" },
            { tool: "WMS", connectionType: "API", purpose: "Warehouse and inventory", color: "#EC4899" }
        ]
    },
    "Retail & FMCG": {
        core: [
            { tool: "POS System", connectionType: "API", purpose: "Real-time sales data", color: "#00B4D8" },
            { tool: "WMS", connectionType: "API", purpose: "Warehouse and stock levels", color: "#0A2342" },
            { tool: "Supplier Portal", connectionType: "EDI", purpose: "Supply chain signals", color: "#F4A261" },
            { tool: "CRM", connectionType: "API", purpose: "Customer data", color: "#10B981" },
            { tool: "Demand Platform", connectionType: "API", purpose: "Forecast and planning", color: "#6366F1" },
            { tool: "HR System", connectionType: "API", purpose: "Store staffing data", color: "#EC4899" }
        ]
    },
    "Education & EdTech": {
        core: [
            { tool: "SIS", connectionType: "API", purpose: "Student information system", color: "#00B4D8" },
            { tool: "LMS", connectionType: "API", purpose: "Learning and engagement data", color: "#0A2342" },
            { tool: "CRM", connectionType: "API", purpose: "Admissions funnel data", color: "#F4A261" },
            { tool: "HR System", connectionType: "API", purpose: "Faculty management", color: "#10B981" },
            { tool: "Finance System", connectionType: "API", purpose: "Fee and revenue tracking", color: "#6366F1" }
        ]
    },
    "Infrastructure & Real Estate": {
        core: [
            { tool: "MS Project", connectionType: "API", purpose: "Project milestone tracking", color: "#00B4D8" },
            { tool: "Procore", connectionType: "API", purpose: "Construction management", color: "#0A2342" },
            { tool: "SAP ERP", connectionType: "API", purpose: "Finance and procurement", color: "#F4A261" },
            { tool: "Vendor Portal", connectionType: "API", purpose: "Supplier performance", color: "#10B981" },
            { tool: "BIM Platform", connectionType: "API", purpose: "Design and engineering", color: "#6366F1" },
            { tool: "HR System", connectionType: "API", purpose: "Workforce management", color: "#EC4899" }
        ]
    },
    "Pharmaceuticals & Life Sciences": {
        core: [
            { tool: "LIMS", connectionType: "API", purpose: "Lab and batch quality data", color: "#00B4D8" },
            { tool: "ERP", connectionType: "API", purpose: "Production and inventory", color: "#0A2342" },
            { tool: "QMS", connectionType: "API", purpose: "Quality management", color: "#F4A261" },
            { tool: "Regulatory Hub", connectionType: "API", purpose: "Submission tracking", color: "#10B981" },
            { tool: "Veeva", connectionType: "API", purpose: "Clinical and commercial data", color: "#6366F1" },
            { tool: "HR System", connectionType: "API", purpose: "Talent and compliance", color: "#EC4899" }
        ]
    },
    "Logistics & Supply Chain": {
        core: [
            { tool: "TMS", connectionType: "API", purpose: "Transport management system", color: "#00B4D8" },
            { tool: "WMS", connectionType: "API", purpose: "Warehouse management", color: "#0A2342" },
            { tool: "GPS Platform", connectionType: "Real-time", purpose: "Live vehicle tracking", color: "#F4A261" },
            { tool: "ERP", connectionType: "API", purpose: "Finance and procurement", color: "#10B981" },
            { tool: "Customer Portal", connectionType: "Webhook", purpose: "SLA and delivery status", color: "#6366F1" },
            { tool: "HR System", connectionType: "API", purpose: "Driver and staff data", color: "#EC4899" }
        ]
    }
};

export const getIntegrations = (industry) => integrationLibrary[industry]?.core || integrationLibrary["IT & Technology Services"].core;

export default integrationLibrary;
