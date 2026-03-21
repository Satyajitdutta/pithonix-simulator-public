const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const sendLead = async (simState, contactData) => {
    const useCaseSummary = simState.useCases?.map((uc, i) =>
        `${i + 1}. ${uc.challenge} (${uc.department}) — Urgency: ${uc.urgency}`
    ).join('\n') || 'No use cases captured';

    const vc = simState.valueCalcs || {};
    const vi = simState.valueInputs || {};
    const rates = vi.rateInputs || {};
    const { formatLakhs } = await import('./valueCalculationService');

    const hiddenIssuesSummary = (simState.hiddenIssues || []).map((h, i) =>
        `${i + 1}. ${h.title} (Connected to: ${h.relatedToUseCase}) | Impact: ${h.estimatedAdditionalImpact} | Confidence: ${h.confidenceLevel}%`
    ).join('\n') || 'None detected';

    const ratesSummary = Object.entries(rates).length
        ? Object.entries(rates).map(([k, v]) => `${k}: ${v}`).join(' · ')
        : 'Industry averages used';

    const techStack = simState.clientTools?.length > 0
        ? simState.clientTools.map(t => `${t.name} (${t.category})`).join(', ')
        : 'Not provided';

    const templateParams = {
        to_email: 'satyajit.d@pithonix.ai',
        from_name: contactData.name,
        from_email: contactData.email,
        from_phone: contactData.phone,
        org_name: simState.orgName,
        role: simState.role,
        industry: simState.industry,
        size: simState.size,
        use_cases: useCaseSummary,
        challenge_summary: contactData.challenge || '',
        insights_generated: simState.insightCount || 0,
        session_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
        // Value intelligence
        current_annual_pain: vc.currentAnnualPain ? '₹' + formatLakhs(vc.currentAnnualPain.total) : 'N/A',
        recoverable_value: vc.recoverableValue ? '₹' + formatLakhs(vc.recoverableValue) : 'N/A',
        roi_multiple: vc.roiMultiple ? vc.roiMultiple + 'x' : 'N/A',
        payback_weeks: vc.paybackWeeks ? vc.paybackWeeks + ' weeks' : 'N/A',
        hidden_issues: hiddenIssuesSummary,
        client_estimate: vi.clientRevenueEstimate?.displayText || 'Not provided',
        confidence_level: vi.clientConfidenceLevel || 'Not provided',
        rate_inputs: ratesSummary,
        tech_stack: techStack,
        integration_complexity: simState.integrationComplexity || 'Unknown'
    };


    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.log('EmailJS not configured. Lead data:', templateParams);
        return { success: true, mode: 'console' };
    }

    try {
        // Use EmailJS REST API directly — no SDK package needed
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                template_params: templateParams
            })
        });
        if (!res.ok) throw new Error(`EmailJS API ${res.status}`);
        return { success: true };
    } catch (err) {
        console.error('EmailJS REST API error:', err.message);
        console.log('Lead data captured locally:', templateParams);
        return { success: true, mode: 'console' };
    }
};
