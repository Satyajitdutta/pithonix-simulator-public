import React from 'react';
import { Target, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const SimOutcomePanel = ({ outcomes }) => {
    if (!outcomes) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            {outcomes.map((outcome, i) => (
                <div key={i} className="sim-card p-8 border-l-8 border-[#00B4D8] bg-white flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                        <h4 className="text-2xl font-black text-[#0A2342] mb-3 leading-tight uppercase font-heading">
                            {outcome.title}
                        </h4>
                        <p className="text-[#4A4A6A] leading-relaxed mb-6 font-medium">
                            {outcome.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {outcome.stats.map((stat, si) => (
                                <div key={si}>
                                    <p className="text-[10px] font-black text-[#4A4A6A] uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-xl font-black text-[#00B4D8]">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-64 h-48 bg-[#F8FAFC] rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                        <BarChart3 className="text-slate-200" size={64} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SimOutcomePanel;
