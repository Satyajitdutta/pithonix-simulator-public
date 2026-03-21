import React from 'react';
import { ArrowRight, Zap, Clock, Users, ShieldAlert } from 'lucide-react';

const SimAutomationFlow = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Before vs After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <div className="bg-[#00B4D8] text-white p-2 rounded-full shadow-lg border-4 border-white">
                        <ArrowRight size={24} />
                    </div>
                </div>

                {/* Current State */}
                <div className="sim-card p-6 border-l-4 border-slate-300">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14} /> Current Manual Process
                    </h4>
                    <ul className="space-y-3">
                        {data.currentSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-[#4A4A6A]">
                                <span className="font-bold text-slate-400">{i + 1}.</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Automated State */}
                <div className="sim-card p-6 border-l-4 border-[#00B4D8] bg-[#0A2342] text-white">
                    <h4 className="text-xs font-black text-[#00B4D8] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={14} /> Pithonix Automated Flow
                    </h4>
                    <ul className="space-y-3">
                        {data.automatedSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-[#1A1A2E] rounded-lg text-sm text-slate-300 border border-slate-700">
                                <span className="font-bold text-[#00B4D8]">✓</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Integration Layer */}
            <div className="sim-card p-6 bg-slate-50 border-dashed border-2">
                <h4 className="text-xs font-black text-[#4A4A6A] uppercase tracking-widest mb-4">
                    SYSTEM INTEGRATIONS (LAYER 1)
                </h4>
                <div className="flex flex-wrap gap-3">
                    {data.integrations.map((int, i) => (
                        <span key={i} className="px-3 py-1 bg-white border rounded-full text-xs font-bold text-[#0A2342] shadow-sm">
                            {int}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimAutomationFlow;
