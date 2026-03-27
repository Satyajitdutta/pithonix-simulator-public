import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Trophy, FileText, Mail, X, CheckCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getOutcomeSimulation } from '../services/geminiSimService';
import { getBenchmark } from '../data/industryBenchmarks';
import { downloadReport } from '../services/simPdfService';
import { sendLead } from '../services/simEmailService';
import { runValueCalculations, detectHiddenIssues, formatLakhs } from '../services/valueCalculationService';
import ValueIntelligenceDashboard from '../components/ValueIntelligenceDashboard';

const PANELS = [
    { key: 'operational', label: 'Operational Transformation', icon: '⚙️' },
    { key: 'revenue', label: 'Revenue Protection', icon: '💰' },
    { key: 'growth', label: 'Growth Intelligence', icon: '📈' },
    { key: 'employee', label: 'Employee Experience', icon: '👥' },
    { key: 'manager', label: 'Manager Intelligence', icon: '🧠' }
];

const DiscoveryRing = ({ score }) => {
    const r = 36, circ = 2 * Math.PI * r;
    return (
        <div className="flex flex-col items-center">
            <svg width={100} height={100} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(102,252,241,0.15)" strokeWidth="8" />
                <circle cx="50" cy="50" r={r} fill="none" stroke="#66fcf1" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * circ} ${circ}`} transform="rotate(-90 50 50)" />
                <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="900" fill="#f0f5f9">{score}</text>
            </svg>
            <span className="text-[10px] font-black text-[#8b8c8d] uppercase tracking-widest -mt-1">Discovery Score</span>
        </div>
    );
};

const LeadModal = ({ isOpen, onClose, onSubmit, orgName }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', challenge: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const isValid = form.name.trim() && form.email.trim().includes('@') && form.phone.trim();

    const handleSubmit = async () => {
        setSending(true);
        try { await onSubmit(form); } catch { /* swallow */ }
        setSent(true);
        setSending(false);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1f2833] border border-[rgba(102,252,241,0.15)] rounded-2xl max-w-md w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                {sent ? (
                    <div className="text-center py-6">
                        <CheckCircle className="mx-auto text-[#66fcf1] mb-4" size={48} />
                        <h3 className="text-xl font-black text-[#f0f5f9] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sent Successfully</h3>
                        <p className="text-[#c5c6c7] text-sm">Your personalised blueprint for {orgName} is on its way. A Pithonix architect will follow up within 24 hours.</p>
                        <button onClick={onClose} className="mt-6 bg-[#66fcf1] text-[#0b0c10] px-8 py-3 rounded-xl font-bold hover:bg-[#45a29e] transition-all">Close</button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-[#f0f5f9]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Get Your Full Blueprint</h3>
                                <p className="text-sm text-[#8b8c8d] mt-1">Receive your complete AI diagnostic report personalised for {orgName}.</p>
                            </div>
                            <button onClick={onClose} className="text-[#8b8c8d] hover:text-[#f0f5f9]"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { field: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                                { field: 'email', label: 'Work Email', placeholder: 'you@company.com', type: 'email' },
                                { field: 'phone', label: 'Phone / WhatsApp', placeholder: '+91 98765 43210', type: 'tel' }
                            ].map(({ field, label, placeholder, type }) => (
                                <div key={field}>
                                    <label className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest mb-1 block">{label}</label>
                                    <input type={type} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder}
                                        className="w-full border-2 border-[rgba(102,252,241,0.15)] bg-[#2a3340] text-[#f0f5f9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#66fcf1] transition-all placeholder:text-[#8b8c8d]" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest mb-1 block">Primary Challenge (optional)</label>
                                <textarea value={form.challenge} onChange={e => setForm(p => ({ ...p, challenge: e.target.value }))} placeholder="Describe your biggest operational challenge..."
                                    rows={2} className="w-full border-2 border-[rgba(102,252,241,0.15)] bg-[#2a3340] text-[#f0f5f9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#66fcf1] transition-all resize-none placeholder:text-[#8b8c8d]" />
                            </div>
                        </div>
                        <button onClick={handleSubmit} disabled={!isValid || sending}
                            className={`w-full mt-6 py-3 rounded-xl font-black text-base flex items-center justify-center gap-2 ${isValid ? 'bg-[#66fcf1] text-[#0b0c10] hover:bg-[#45a29e]' : 'bg-[#2a3340] text-[#8b8c8d] cursor-not-allowed'} transition-all`}>
                            {sending ? <><Loader2 className="animate-spin" size={16} /> Sending...</> : <><Mail size={16} /> Send My Blueprint</>}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const SimulatorScreen5 = ({ simState, setSimState, onAddUseCase }) => {
    const { orgName, industry, size, useCases = [], automationBlueprint, intelligenceBlueprint, insightCount = 0, valueInputs = {} } = simState;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePanel, setActivePanel] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [valueCalcs, setValueCalcs] = useState(null);
    const [hiddenIssues, setHiddenIssues] = useState([]);
    const [simCount, setSimCount] = useState(1);

    useEffect(() => {
        // Run value calculations before even calling Gemini
        const calcs = runValueCalculations(simState);
        setValueCalcs(calcs);
        const issues = detectHiddenIssues(useCases);
        setHiddenIssues(issues);

        const load = async () => {
            try {
                const valueContext = calcs ? {
                    currentAnnualPain: formatLakhs(calcs.currentAnnualPain?.total),
                    recoverableValue: formatLakhs(calcs.recoverableValue),
                    roiMultiple: calcs.roiMultiple,
                    paybackWeeks: calcs.paybackWeeks,
                    hiddenIssueTitles: issues.map(h => h.title).join(', '),
                    clientEstimate: valueInputs.clientRevenueEstimate?.displayText || 'Not provided',
                    confidenceLevel: valueInputs.clientConfidenceLevel || 'Not provided'
                } : null;

                const result = await getOutcomeSimulation({ industry, orgName, useCases, automationBlueprint, intelligenceBlueprint, valueContext }) || { success: false, data: {} };
                const outcomeData = result.success ? result.data : (result.data || {});
                setData(outcomeData);
            } catch (err) {
                console.error("Outcome Simulation Error:", err);
                const bench = getBenchmark(industry);
                setData({
                    operational: { narrative: bench.outcomeNarratives?.operational, metrics: [{ label: 'Reporting Time', before: '23 days', after: '4 hours' }, { label: 'Error Rate', before: '12%', after: '<1%' }] },
                    revenue: { narrative: bench.outcomeNarratives?.revenue, metrics: [] },
                    growth: { narrative: bench.outcomeNarratives?.growth, metrics: [] },
                    employee: { narrative: bench.outcomeNarratives?.employee, metrics: [] },
                    manager: { narrative: bench.outcomeNarratives?.manager, metrics: [] },
                    discoveryScore: bench.discoveryScore,
                    estimatedROI: bench.estimatedROI
                });
            } finally { setLoading(false); }
        };
        load();
    }, [simCount]);

    // Handle "Add to Blueprint" from hidden issue card
    const handleAddHiddenIssue = async (issue) => {
        const newUseCase = {
            challenge: issue.title,
            department: issue.relatedDepartment?.split('/')[0]?.trim() || 'Operations',
            impact: issue.description.slice(0, 100),
            urgency: 'HIGH',
            urgencyReason: issue.estimatedAdditionalImpact
        };
        setSimState(prev => ({
            ...prev,
            useCases: [...(prev.useCases || []), newUseCase],
            insightCount: (prev.insightCount || 0) + 1
        }));
        // Regenerate
        setLoading(true);
        setSimCount(n => n + 1);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-6">
            <Trophy className="animate-bounce text-[#e8623a]" size={64} />
            <h2 className="text-3xl font-black text-[#f0f5f9]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Simulating Final Outcomes...</h2>
            <p className="text-[#8b8c8d]">Running value calculations for {orgName}</p>
        </div>
    );

    const bench = getBenchmark(industry);
    const discoveryScore = data?.discoveryScore || bench.discoveryScore || 82;
    const clientEstimate = valueInputs.clientRevenueEstimate;

    return (
        <div id="screen5-content" className="space-y-10 animate-fadeIn max-w-5xl mx-auto pb-24">
            {/* ─── 1. HEADER ────────────────────────────────────────────────── */}
            <div className="text-center space-y-2">
                <Sparkles className="mx-auto text-[#66fcf1]" size={40} />
                <h2 className="text-4xl font-black text-[#f0f5f9] uppercase tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Your Complete Intelligence Outcome — Simulation {simCount}
                </h2>
                <p className="text-[#8b8c8d]">
                    <strong className="text-[#c5c6c7]">{orgName}</strong> · {industry} · {size}
                </p>
            </div>

            {/* ─── 2. VALUE INTELLIGENCE DASHBOARD ────────────────────────── */}
            {valueCalcs && (
                <div className="sim-card p-6 space-y-6">
                    <ValueIntelligenceDashboard
                        valueCalculations={valueCalcs}
                        hiddenIssues={hiddenIssues}
                        clientEstimate={clientEstimate}
                        orgName={orgName}
                        onAddHiddenIssue={handleAddHiddenIssue}
                    />
                </div>
            )}

            {/* ─── 3. CLIENT IMPACT ANCHOR CALLOUT ─────────────────────────── */}
            {simState.currentImpact && (
                <div className="border-l-4 border-[#e8623a] bg-[rgba(232,98,58,0.05)] rounded-xl p-5">
                    <div className="text-[10px] font-black text-[#e8623a] uppercase tracking-widest mb-1">You Told Us</div>
                    <p className="text-sm font-semibold text-[#f0f5f9] italic">"{simState.currentImpact}"</p>
                    <p className="text-xs text-[#8b8c8d] mt-2">Here is our analysis, calibrated to your organisation.</p>
                </div>
            )}

            {/* ─── 4. THREE HEADLINE ROI METRIC CARDS ──────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Annual Value at Risk', value: valueCalcs ? `₹${formatLakhs(valueCalcs.currentAnnualPain?.total)}` : (data?.estimatedROI?.annualValue || 'Calculating...'), color: '#e8623a' },
                    { label: 'Expected Recovery', value: valueCalcs ? `₹${formatLakhs(valueCalcs.recoverableValue)}` : (data?.estimatedROI?.reduction || 'Calculating...'), color: '#10B981' },
                    { label: 'Payback Period', value: valueCalcs?.paybackWeeks ? `${valueCalcs.paybackWeeks} weeks` : '12–18 weeks', color: '#66fcf1' }
                ].map((m, i) => (
                    <div key={i} className="bg-[#1f2833] border border-[rgba(102,252,241,0.12)] rounded-xl p-5 text-center">
                        <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                        <div className="text-[10px] text-[#8b8c8d] uppercase tracking-widest mt-1">{m.label}</div>
                    </div>
                ))}
            </div>

            {/* ─── 5. FIVE COLLAPSIBLE OUTCOME PANELS ──────────────────────── */}
            <div className="space-y-3">
                <h4 className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest">5-Layer Outcome View</h4>
                {PANELS.map((p, i) => {
                    const pd = data?.[p.key] || {};
                    const isActive = activePanel === i;
                    return (
                        <div key={p.key} className={`sim-card overflow-hidden transition-all duration-300 ${isActive ? 'shadow-lg border-[rgba(102,252,241,0.25)]' : ''}`}>
                            <button onClick={() => setActivePanel(isActive ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{p.icon}</span>
                                    <span className="font-black text-[#f0f5f9]">{p.label}</span>
                                </div>
                                {isActive ? <ChevronUp size={18} className="text-[#66fcf1]" /> : <ChevronDown size={18} className="text-[#8b8c8d]" />}
                            </button>
                            {isActive && (
                                <div className="px-6 pb-6 space-y-4 animate-fadeIn">
                                    <p className="text-sm text-[#c5c6c7] leading-relaxed">{pd.narrative || bench.outcomeNarratives?.[p.key]}</p>
                                    {Array.isArray(pd.metrics) && pd.metrics.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                            {pd.metrics.map((m, mi) => (
                                                <div key={mi} className="text-center">
                                                    <div className="text-[10px] text-[#8b8c8d] uppercase tracking-widest mb-1">{m.label}</div>
                                                    <div className="text-xs text-[#8b8c8d] line-through">{m.before}</div>
                                                    <div className="text-sm font-black text-green-400">{m.after}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ─── 6. ADD ANOTHER USE CASE ──────────────────────────────────── */}
            <div className="border-t border-b border-[rgba(102,252,241,0.12)] py-5 flex items-center justify-between">
                <p className="text-sm text-[#8b8c8d]">Simulation {simCount} complete · {useCases.length} use case{useCases.length !== 1 ? 's' : ''} analysed</p>
                <button onClick={onAddUseCase}
                    className="text-sm font-black text-[#66fcf1] hover:underline">
                    + Explore Another Use Case
                </button>
            </div>

            {/* ─── 7. DISCOVERY RING ────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-4">
                <DiscoveryRing score={discoveryScore} />
                <p className="text-xs text-[#8b8c8d] text-center max-w-sm">
                    Discovery score reflects depth of diagnostic — based on {insightCount} insights captured across {useCases.length} use cases.
                </p>
            </div>

            {/* ─── 8. CTA SECTION ──────────────────────────────────────────── */}
            <div className="bg-[#1f2833] border border-[rgba(102,252,241,0.15)] rounded-2xl p-8 text-center space-y-4">
                <h3 className="text-2xl font-black text-[#f0f5f9] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>Request Intelligence Blueprint</h3>
                <p className="text-[#8b8c8d] text-sm max-w-lg mx-auto">
                    Get your full personalised blueprint — Automation + Intelligence + Outcome layers — as a high-fidelity PDF delivered to your inbox.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center mt-2">
                    <button
                        onClick={async () => { setPdfLoading(true); try { await downloadReport(orgName); } finally { setPdfLoading(false); } }}
                        disabled={pdfLoading}
                        className="bg-[#66fcf1] text-[#0b0c10] px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#45a29e] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {pdfLoading ? <><Loader2 className="animate-spin" size={20} /> Generating...</> : <><FileText size={20} /> Download Simulation Report</>}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-[#66fcf1] text-[#66fcf1] px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#66fcf1] hover:text-[#0b0c10] transition-all flex items-center justify-center gap-3"
                    >
                        <Mail size={20} /> Get My Full Report
                    </button>
                </div>
            </div>

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(form) => sendLead({ ...simState, valueCalcs }, form)}
                orgName={orgName}
            />
        </div>
    );
};

export default SimulatorScreen5;
