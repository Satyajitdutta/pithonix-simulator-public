import React, { useState, useEffect } from 'react';
import { Loader2, BrainCircuit, Sparkles } from 'lucide-react';
import { getIntelligenceBlueprint } from '../services/geminiSimService';
import { getBenchmark } from '../data/industryBenchmarks';
import { agentLibrary } from '../data/agentLibrary';

const AgentCard = ({ agent, delay, justification }) => {
    const [phase, setPhase] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), delay);
        const t2 = setTimeout(() => setPhase(2), delay + 500);
        const t3 = setTimeout(() => setPhase(3), delay + 1000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [delay]);

    const stateMap = [
        { bg: 'bg-[#1f2833] border-[rgba(102,252,241,0.08)]', dot: 'bg-[#8b8c8d]', label: 'PENDING', textColor: 'text-[#8b8c8d]' },
        { bg: 'bg-[#2a3340] border-[rgba(102,252,241,0.1)]', dot: 'bg-[#8b8c8d] animate-pulse', label: 'SCANNING...', textColor: 'text-[#c5c6c7]' },
        { bg: 'bg-[rgba(232,98,58,0.05)] border-[rgba(232,98,58,0.2)]', dot: 'bg-[#e8623a] animate-pulse', label: 'INITIALISING...', textColor: 'text-[#e8623a]' },
        { bg: 'bg-[#1f2833] border-[rgba(102,252,241,0.25)]', dot: 'bg-[#66fcf1] animate-pulse', label: 'ACTIVE', textColor: 'text-[#66fcf1]' }
    ];
    const s = stateMap[phase];

    return (
        <div
            className={`p-3 rounded-xl border transition-all duration-500 cursor-help relative group ${s.bg}`}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
        >
            <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${s.textColor}`}>{s.label}</span>
            </div>
            <div className="text-xs font-bold text-[#f0f5f9]">{agent.icon} {agent.name}</div>
            <div className="text-[10px] text-[#8b8c8d] mt-0.5">{agent.category}</div>

            {showInfo && justification && (
                <div className="absolute left-0 right-0 bottom-full mb-2 z-50 bg-[#2a3340] text-[#c5c6c7] p-3 rounded-xl text-[10px] leading-relaxed shadow-2xl animate-fadeIn border border-[rgba(102,252,241,0.15)]">
                    <div className="font-black text-[#66fcf1] uppercase tracking-widest mb-1 text-[8px]">Intelligence Justification</div>
                    {justification}
                </div>
            )}
        </div>
    );
};

const SimulatorScreen4 = ({ onNext, simState, setSimState }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orgName, industry, useCases, automationBlueprint, intelligenceBlueprint } = simState;

    useEffect(() => {
        const load = async () => {
            try {
                const metrics = automationBlueprint?.metrics;
                const result = await getIntelligenceBlueprint(useCases, metrics, { industry, orgName }, simState) || { success: false, data: {} };
                const blueprintData = result.success ? result.data : (result.data || {});

                // Add isFallback to the data state directly for UI access
                setData({ ...blueprintData, isFallback: result.isFallback });

                setSimState(prev => ({ ...prev, intelligenceBlueprint: blueprintData, insightCount: (prev.insightCount || 0) + (blueprintData?.intelligenceSignals?.length || 3) }));
            } catch (err) {
                console.error("Intelligence Loading Error:", err);
                const bench = getBenchmark(industry);
                const fallback = { intelligenceSignals: bench.signals, sixMonthForecast: bench.sixMonthForecast, agentsActivated: bench.agentsActivated, isFallback: true };
                setData(fallback);
                setSimState(prev => ({ ...prev, intelligenceBlueprint: fallback }));
            } finally { setLoading(false); }
        };
        load();
    }, []);

    const handleNext = () => {
        onNext();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[500px]">
            <BrainCircuit className="animate-pulse text-[#66fcf1] mb-4" size={48} />
            <h2 className="text-2xl font-black text-[#f0f5f9]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Synthesising Intelligence Signals...</h2>
        </div>
    );

    const signals = Array.isArray(data?.intelligenceSignals) ? data.intelligenceSignals : [];
    const forecast = Array.isArray(data?.sixMonthForecast) ? data.sixMonthForecast : [];
    const activatedData = Array.isArray(data?.agentsActivated) ? data.agentsActivated : [];

    // Map existing agentLibrary to the activated agents from AI with robust matching
    const displayAgents = activatedData.map(ad => {
        const rawName = ad?.name || (typeof ad === 'string' ? ad : '');
        const agent = agentLibrary.find(a =>
            a.name.toLowerCase() === rawName.toLowerCase() ||
            a.name.toLowerCase().includes(rawName.toLowerCase()) ||
            rawName.toLowerCase().includes(a.name.toLowerCase())
        );
        return agent ? { ...agent, justification: ad.justification } : null;
    }).filter(Boolean).slice(0, 6);

    // Fallback if AI didn't return any valid agents
    const finalAgents = displayAgents.length > 0 ? displayAgents : agentLibrary.slice(0, 6).map(a => ({ ...a, justification: "General operational monitoring." }));

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black text-[#f0f5f9] uppercase tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Layer 2: <span className="text-[#66fcf1]">Intelligence Blueprint</span></h1>
                        {data?.isFallback && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-[rgba(232,98,58,0.1)] border border-[rgba(232,98,58,0.3)] rounded-full animate-bounce shadow-sm">
                                <span className="w-2 h-2 bg-[#e8623a] rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-[#e8623a] uppercase tracking-tighter">Benchmark Fallback Active</span>
                            </div>
                        )}
                    </div>
                    <p className="text-[#8b8c8d]">Foresight signals that move from efficiency to exponential value.</p>
                </div>
                <button onClick={handleNext} className="sim-btn-primary">Final Outcome Simulation →</button>
            </div>

            {/* Intelligence Signal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {signals.map((sig, i) => (
                    <div key={i} className="sim-card p-6 border-l-4 border-[#66fcf1] relative overflow-hidden">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Signal</span>
                                </div>
                                <h5 className="font-black text-[#f0f5f9] text-base">{sig.signalName}</h5>
                            </div>
                            <span className="text-xs font-black text-[#66fcf1] text-right">{sig.horizon}</span>
                        </div>
                        <p className="text-sm text-[#c5c6c7] mb-4 leading-relaxed">{sig.description}</p>
                        <div className="mb-3">
                            <div className="flex justify-between text-[10px] font-black text-[#8b8c8d] uppercase mb-1">
                                <span>Confidence</span><span>{sig.confidence}%</span>
                            </div>
                            <div className="h-1.5 bg-[rgba(102,252,241,0.1)] rounded-full overflow-hidden">
                                <div className="h-1.5 bg-[#66fcf1] rounded-full transition-all duration-1000" style={{ width: `${sig.confidence}%` }} />
                            </div>
                        </div>
                        <div className="text-[10px] text-[#66fcf1] bg-[rgba(102,252,241,0.08)] px-3 py-2 rounded-lg font-semibold">
                            ↗ {sig.action}
                        </div>
                    </div>
                ))}
            </div>

            {/* 6-Month Forecast Timeline */}
            <div className="sim-card p-6">
                <h4 className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest mb-6">6-Month Capability Roadmap</h4>
                <div className="flex items-start justify-between gap-4 overflow-x-auto">
                    {forecast.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center min-w-[130px]">
                            <div className="w-10 h-10 rounded-full bg-[#1f2833] border border-[rgba(102,252,241,0.2)] flex items-center justify-center text-[#66fcf1] font-black text-sm mb-2">
                                M{item.month}
                            </div>
                            {i < forecast.length - 1 && (
                                <div className="hidden md:block absolute ml-[130px] mt-5 w-[calc(25%-30px)] h-0.5 bg-[rgba(102,252,241,0.15)]" />
                            )}
                            <p className="text-xs text-[#c5c6c7] font-semibold leading-tight">{item.capability}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Activation Animation */}
            <div className="sim-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-[#e8623a]" />
                    <h4 className="text-xs font-black text-[#8b8c8d] uppercase tracking-widest">Agents Activating</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {finalAgents.map((agent, i) => (
                        <AgentCard key={agent.id} agent={agent} delay={i * 400} justification={agent.justification} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimulatorScreen4;
