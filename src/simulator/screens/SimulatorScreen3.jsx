import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { getAutomationBlueprint } from '../services/geminiSimService';
import { getBenchmark } from '../data/industryBenchmarks';
import { getIntegrations } from '../data/integrationLibrary';
import AutomationMindMap from '../components/AutomationMindMap';

const SimulatorScreen3 = ({ onNext, simState, setSimState }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHitlDetail, setShowHitlDetail] = useState(false);
    const { orgName, industry, useCases, automationBlueprint } = simState;

    useEffect(() => {
        if (automationBlueprint) { setData(automationBlueprint); setLoading(false); return; }
        const load = async () => {
            try {
                const result = await getAutomationBlueprint(useCases, {
                    industry,
                    orgName,
                    clientTools: simState.clientTools,
                    clientToolsRaw: simState.clientToolsRaw,
                    role: simState.role,
                    size: simState.size
                }, simState) || { success: false, data: {} };

                const blueprintData = result.success ? result.data : (result.data || {});
                const bench = getBenchmark(industry);
                const enriched = {
                    ...blueprintData,
                    metrics: blueprintData?.metrics || bench.automationROI,
                    useCaseBlueprints: blueprintData?.useCaseBlueprints || []
                };
                setData(enriched);
                setSimState(prev => ({ ...prev, automationBlueprint: enriched, insightCount: (prev.insightCount || 0) + 3 }));
            } catch (err) {
                console.error("Blueprint Loading Error:", err);
                const bench = getBenchmark(industry);
                setData({
                    useCaseBlueprints: [],
                    automationFlow: { trigger: 'Event', dataCollection: 'Multi-system', processing: 'AI Engine', hitlGate: 'Review Gate', output: 'Automated Output' },
                    metrics: bench.automationROI
                });
            } finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
            <Loader2 className="animate-spin text-[#66fcf1] mb-4" size={48} />
            <h2 className="text-2xl font-black text-[#f0f5f9] animate-pulse" style={{ fontFamily: 'Montserrat, sans-serif' }}>Designing Your Automation Layer...</h2>
            <p className="text-[#8b8c8d] mt-2">Mapping {orgName}'s processes to Pithonix Core Architecture.</p>
        </div>
    );

    const defaultIntegrations = getIntegrations(industry);
    const benchFallback = getBenchmark(industry)?.legacySystems?.slice(0, 2) || [];
    const clientTools = (simState.clientTools && simState.clientTools.length > 0) ? simState.clientTools : benchFallback;
    const hasRawTools = Boolean(simState.clientToolsRaw && simState.clientToolsRaw.trim().length > 0);
    const isGreenfield = simState.startingFromScratch || (!hasRawTools && (clientTools.length === 0 || (clientTools.length === 1 && (clientTools[0]?.name || clientTools[0]) === 'Legacy Systems')));

    const rawToolsArray = hasRawTools ? simState.clientToolsRaw.split(',').map(t => ({ name: t.trim(), connectionType: 'Custom' })).filter(t => t.name) : [];
    const allClientTools = [...clientTools, ...rawToolsArray];

    const recommendedTools = defaultIntegrations.filter(di => {
        const diTool = di.tool.toLowerCase();
        return !allClientTools.some(ct => {
            const ctName = (ct?.name || (typeof ct === 'string' ? ct : '')).toLowerCase();
            return ctName.includes(diTool) || diTool.includes(ctName);
        });
    }).slice(0, 3);

    const flow = data.automationFlow || {};
    const metrics = data.metrics || {};

    return (
        <div className="space-y-10 animate-fadeIn relative">
            {/* HITL Detail Modal */}
            {showHitlDetail && (
                <div className="fixed inset-0 bg-[#0b0c10]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-[#1f2833] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[rgba(102,252,241,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#e8623a]" />
                        <h3 className="text-xl font-black text-[#f0f5f9] mb-4 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span className="w-8 h-8 rounded-lg bg-[rgba(232,98,58,0.1)] flex items-center justify-center text-[#e8623a]">
                                👁️
                            </span>
                            Human-In-The-Loop Detail
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] font-black text-[#8b8c8d] uppercase tracking-widest mb-1">Gate Description</div>
                                <div className="text-sm text-[#c5c6c7] leading-relaxed font-semibold">
                                    {flow.hitlGate || "Verification point during the automated workflow."}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] font-black text-[#8b8c8d] uppercase tracking-widest mb-1">Stakeholder</div>
                                    <div className="text-sm text-[#f0f5f9] font-bold">{simState.role}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-[#8b8c8d] uppercase tracking-widest mb-1">Primary Objective</div>
                                    <div className="text-sm text-[#f0f5f9] font-bold">Strategic Validation</div>
                                </div>
                            </div>
                            <div className="bg-[#2a3340] p-4 rounded-xl border border-[rgba(102,252,241,0.08)]">
                                <p className="text-xs text-[#a78bfa] font-bold mb-1">WHY THIS MATTERS?</p>
                                <p className="text-[11px] text-[#c5c6c7]">
                                    Pithonix doesn't replace high-level decision making. This gate ensures your industry expertise is applied where it matters most, while AI handles the 90% manual heavy lifting.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHitlDetail(false)}
                            className="mt-6 w-full py-3 bg-[#66fcf1] text-[#0b0c10] font-black rounded-xl hover:bg-[#45a29e] transition-colors"
                        >
                            CLOSE DETAIL
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-[#f0f5f9] mb-1 uppercase tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Layer 1: Automation Blueprint</h2>
                    <p className="text-[#8b8c8d]">Your current state vs. the Pithonix augmented future.</p>
                </div>
                <button onClick={onNext} className="sim-btn-primary">Build Intelligence Layer →</button>
            </div>

            {/* Before/After Cards */}
            {(Array.isArray(data.useCaseBlueprints) ? data.useCaseBlueprints : []).slice(0, 3).map((bp, i) => (
                <div key={i} className="sim-card overflow-hidden">
                    <div className="bg-[#2a3340] text-[#66fcf1] px-6 py-3 text-sm font-black uppercase tracking-widest border-b border-[rgba(102,252,241,0.12)]">{bp.name}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 border-r border-dashed border-[rgba(102,252,241,0.1)]">
                            <div className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest mb-3">Today</div>
                            <p className="text-sm text-[#c5c6c7] mb-4">{bp.today?.description || bp.today?.desc}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">Time</span><span className="font-black text-red-400">{bp.today?.timeDays} days</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">People</span><span className="font-black text-red-400">{bp.today?.peopleInvolved || bp.today?.people} FTEs</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">Error Rate</span><span className="font-black text-red-400">{bp.today?.errorRate}</span></div>
                            </div>
                        </div>
                        <div className="p-6 bg-[rgba(102,252,241,0.03)]">
                            <div className="text-xs font-black text-[#66fcf1] uppercase tracking-widest mb-3">Automated</div>
                            <p className="text-sm text-[#c5c6c7] mb-4">{bp.automated?.description || bp.automated?.desc}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">Time</span><span className="font-black text-green-400">{bp.automated?.timeHours} hours</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">People</span><span className="font-black text-green-400">HITL only</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#8b8c8d]">Error Rate</span><span className="font-black text-green-400">{bp.automated?.errorRate || '<1%'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dynamic Mind Map Architecture */}
            <div className="sim-card p-2 overflow-hidden border-2 border-[rgba(102,252,241,0.12)] shadow-xl">
                <div className="px-6 pt-6 pb-2">
                    <h4 className="text-[10px] font-black text-[#8b8c8d] uppercase tracking-widest mb-1 leading-tight flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]" />
                        Industrial Automation Mind Map
                    </h4>
                    <p className="text-xs text-[#c5c6c7] font-bold">Mapping Legacy Constraints to AI Intelligence</p>
                </div>
                <AutomationMindMap
                    industryData={getBenchmark(industry)}
                    selectedSystems={simState.clientTools}
                    challenges={(Array.isArray(data.useCaseBlueprints) ? data.useCaseBlueprints : []).map(bp => bp?.mindMapData)}
                    automationTools={isGreenfield ? defaultIntegrations.slice(0, 3) : recommendedTools}
                />
            </div>

            {/* Integration Grid */}
            <div className="sim-card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest">Architecture Tooling</h4>
                    {isGreenfield && (
                        <span className="text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded">GREENFIELD OPPORTUNITY</span>
                    )}
                </div>

                {isGreenfield ? (
                    <div className="bg-[#2a3340] p-4 rounded-xl border border-[rgba(102,252,241,0.08)] mb-4">
                        <p className="text-sm text-[#f0f5f9] font-semibold">Legacy / Disconnected Environment Detected</p>
                        <p className="text-xs text-[#c5c6c7] mt-1">
                            This represents a massive opportunity. Because you aren't tied to complex legacy technical debt,
                            Pithonix can deploy an optimized, modern automation stack from day one, resulting in faster time-to-value.
                        </p>
                    </div>
                ) : (
                    <div className="mb-6">
                        <h5 className="text-[10px] font-bold text-[#8b8c8d] uppercase tracking-widest mb-3">Your Stack (Integrating With)</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allClientTools.map((t, i) => {
                                const toolName = t?.name || (typeof t === 'string' ? t : 'Legacy Tool');
                                const initChar = toolName ? toolName.charAt(0).toUpperCase() : '?';
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-[rgba(102,252,241,0.05)] rounded-xl border border-[rgba(102,252,241,0.1)] relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#66fcf1]" />
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1f2833] text-[#66fcf1] font-black text-xs shrink-0 border border-[rgba(102,252,241,0.2)]">
                                            {initChar}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-[#f0f5f9]">{toolName}</div>
                                            <div className="text-[10px] text-[#8b8c8d]">{t?.connectionType || 'API/Data'}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <h5 className="text-[10px] font-bold text-[#8b8c8d] uppercase tracking-widest mb-3">
                        {isGreenfield ? 'Recommended Core Stack' : 'Recommended Additions for Full Automation'}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(isGreenfield ? defaultIntegrations.slice(0, 3) : recommendedTools).map((intg, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-[#2a3340] rounded-xl border border-[rgba(102,252,241,0.1)] border-dashed">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 opacity-60" style={{ background: intg.color }}>
                                    {intg.tool.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-xs font-black text-[#f0f5f9] opacity-80">{intg.tool}</div>
                                    <div className="text-[10px] text-[#8b8c8d]">{intg.connectionType}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Hours Saved Monthly', value: metrics.hoursSavedMonthly, unit: 'hrs' },
                    { label: 'Processes Automated', value: metrics.processesAutomated, unit: '' },
                    { label: 'Touchpoints Eliminated', value: metrics.touchpointsEliminated, unit: '' },
                    { label: 'HITL Gates', value: metrics.hitlGatesRequired || metrics.hitlGates, unit: '' }
                ].map((m, i) => (
                    <div key={i} className={`bg-[#1f2833] border border-[rgba(102,252,241,0.12)] rounded-xl p-5 text-center transition-all ${m.label === 'HITL Gates' ? 'cursor-pointer hover:bg-[#2a3340] ring-1 ring-[#e8623a]/30' : ''}`}
                        onClick={() => m.label === 'HITL Gates' && setShowHitlDetail(true)}>
                        <div className="text-3xl font-black text-[#66fcf1]">{m.value}{m.unit}</div>
                        <div className="text-[10px] text-[#8b8c8d] uppercase tracking-widest mt-1">{m.label} {m.label === 'HITL Gates' && 'ℹ️'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimulatorScreen3;
