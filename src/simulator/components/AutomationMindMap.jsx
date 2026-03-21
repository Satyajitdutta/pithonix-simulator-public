import React from 'react';
import { Target, Zap, Clock, AlertTriangle, Database, Cpu, Layers } from 'lucide-react';

const AutomationMindMap = ({ industryData, selectedSystems = [], challenges = [], automationTools = [] }) => {
    const width = 950;

    // Fallbacks
    const legacyNodes = selectedSystems.length > 0 ? selectedSystems : (industryData?.legacySystems?.slice(0, 2) || [{ name: "Legacy ERP" }]);
    const challengeNodes = challenges.length > 0 ? challenges : (industryData?.primaryChallenges?.slice(0, 2) || [{ statement: "Manual Sync" }]);
    const stackNodes = automationTools.length > 0 ? automationTools : [{ tool: "Twilio" }, { tool: "OpenAI" }];

    const height = Math.max(450, 100 + Math.max(legacyNodes.length, challengeNodes.length, stackNodes.length) * 120);

    // Node rendering helper
    const renderNode = (x, y, label, type, Icon, highlight = null) => {
        const bg = type === 'root' ? '#0A2342' : type === 'legacy' ? '#F1F5F9' : type === 'challenge' ? '#FEF2F2' : type === 'stack' ? '#E0F2FE' : '#F0FDF4';
        const border = type === 'root' ? '#00B4D8' : type === 'legacy' ? '#CBD5E1' : type === 'challenge' ? '#FECACA' : type === 'stack' ? '#BAE6FD' : '#BBF7D0';
        const text = type === 'root' ? '#FFFFFF' : '#1A1A2E';

        return (
            <g transform={`translate(${x - 75}, ${y - 30})`} className="animate-fade-in">
                <rect width="150" height="60" rx="12" fill={bg} stroke={border} strokeWidth={type === 'root' ? "3" : "2"} className="drop-shadow-sm" />
                <foreignObject x="-10" y="-15" width="170" height="85" className="overflow-visible">
                    <div className="w-[150px] h-[60px] mx-auto mt-[15px] flex flex-col items-center justify-center p-2 text-center relative">
                        <div className="flex items-center gap-1.5 mb-1">
                            {Icon && <Icon size={12} className={type === 'root' ? 'text-blue-400' : 'text-slate-500'} />}
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60" style={{ color: text }}>{type === 'root' ? 'AUTONOMIC CORE' : type}</span>
                        </div>
                        <span className="text-[10px] font-bold leading-tight line-clamp-2" style={{ color: text }}>{label}</span>
                        {highlight && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                                {highlight}
                            </div>
                        )}
                    </div>
                </foreignObject>
            </g>
        );
    };

    const xLegacy = 100;
    const xChallenge = 350;
    const xEngine = 600;
    const xStack = 850;
    const yEngine = height / 2;

    const getY = (index, total) => {
        const spacing = 120;
        const startY = height / 2 - ((total - 1) * spacing) / 2;
        return startY + index * spacing;
    };

    return (
        <div className="w-full bg-slate-50/50 rounded-3xl border border-slate-100 p-4 md:p-8 overflow-x-auto relative scrollbar-hide">
            <div className="absolute top-4 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Architectural Tooling Map</span>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[700px] h-auto drop-shadow-xl my-4">
                {/* Connection Lines */}
                <g fill="none" strokeWidth="2" strokeDasharray="4 4" className="opacity-40">

                    {/* Legacy to Challenge */}
                    {legacyNodes.map((_, i) => {
                        const yL = getY(i, legacyNodes.length);
                        const cIdx = Math.min(i, challengeNodes.length - 1);
                        const yC = getY(cIdx, challengeNodes.length);
                        return (
                            <path key={`lc-${i}`} d={`M ${xLegacy + 75} ${yL} C ${xLegacy + 150} ${yL}, ${xChallenge - 150} ${yC}, ${xChallenge - 75} ${yC}`} stroke="#94A3B8" />
                        );
                    })}

                    {/* Challenge to Engine */}
                    {challengeNodes.map((_, i) => {
                        const yC = getY(i, challengeNodes.length);
                        return (
                            <path key={`ce-${i}`} d={`M ${xChallenge + 75} ${yC} C ${xChallenge + 150} ${yC}, ${xEngine - 150} ${yEngine}, ${xEngine - 75} ${yEngine}`} stroke="#EF4444" />
                        );
                    })}

                    {/* Engine to Stack */}
                    {stackNodes.map((_, i) => {
                        const yS = getY(i, stackNodes.length);
                        return (
                            <path key={`es-${i}`} d={`M ${xEngine + 75} ${yEngine} C ${xEngine + 150} ${yEngine}, ${xStack - 150} ${yS}, ${xStack - 75} ${yS}`} stroke="#3B82F6" />
                        );
                    })}
                </g>

                {/* Nodes rendering */}

                {/* 1. Legacy Nodes */}
                {legacyNodes.map((sys, i) => (
                    <React.Fragment key={sys?.id || i}>
                        {renderNode(xLegacy, getY(i, legacyNodes.length), sys?.name || (typeof sys === 'string' ? sys : "Legacy System"), "legacy", Database, sys?.category || 'SYSTEM')}
                    </React.Fragment>
                ))}

                {/* 2. Challenge Nodes */}
                {challengeNodes.map((ch, i) => (
                    <g key={i}>
                        {renderNode(xChallenge, getY(i, challengeNodes.length), ch?.statement || (typeof ch === 'string' ? ch : "Manual Friction"), "challenge", AlertTriangle)}
                        {/* Course Correction Badge */}
                        <g transform={`translate(${xChallenge - 40}, ${getY(i, challengeNodes.length) + 35})`}>
                            <rect width="80" height="18" rx="4" fill="#0A2342" />
                            <text x="40" y="12" textAnchor="middle" fill="#38BDF8" className="text-[7px] font-black uppercase tracking-widest">
                                {ch?.courseCorrectionTime || 'RAPID'} RESOLVE
                            </text>
                        </g>
                    </g>
                ))}

                {/* 3. Central Pithonix Engine */}
                {renderNode(xEngine, yEngine, "n8n + JEET ORCHESTRATION", "root", Cpu)}

                {/* 4. Target Tech Stack Nodes */}
                {stackNodes.map((tool, i) => (
                    <React.Fragment key={i}>
                        {renderNode(xStack, getY(i, stackNodes.length), tool?.tool || tool?.name || (typeof tool === 'string' ? tool : "Integration"), "stack", Layers, tool?.connectionType || 'INTEGRATION')}
                    </React.Fragment>
                ))}
            </svg>

            {/* Legend/Info Panels */}
            <div className="grid grid-cols-2 gap-8 mt-4 border-t border-slate-200/50 pt-6">
                <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={12} />
                        Legacy Friction Drivers
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {(challengeNodes[0]?.initialHurdles || ["System Silos", "Manual Handover"]).map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 text-[9px] font-bold rounded border border-amber-100 italic">
                                "{h}"
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="text-green-500" size={12} />
                        Intelligence Amplification
                    </h5>
                    <div className="text-sm font-black text-[#0A2342]">
                        {challengeNodes[0]?.projection || "Seamless End-to-End Orchestration"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationMindMap;
