import React from 'react';
import { formatLakhs } from '../services/valueCalculationService';

const ValueImpactBar = ({ currentPain, residual, recoverable, roiMultiple, clientEstimate }) => {
    const hasClientEstimate = clientEstimate?.amount && clientEstimate?.displayText;
    const ourTotal = currentPain?.total || 0;

    let variancePct = null;
    let varianceUp = false;
    if (hasClientEstimate && clientEstimate.inINR > 0 && ourTotal > 0) {
        variancePct = Math.round(((ourTotal - clientEstimate.inINR) / clientEstimate.inINR) * 100);
        varianceUp = variancePct > 0;
    }

    return (
        <div className="space-y-4">
            {/* Main bar */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Current pain */}
                <div className="bg-white p-6 text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Annual Impact</div>
                    <div className="text-3xl font-black text-[#0A2342]">₹{formatLakhs(ourTotal)}</div>
                    <div className="text-xs text-slate-400 mt-1">Across {currentPain?.breakdown?.length || 0} identified challenge{(currentPain?.breakdown?.length || 0) !== 1 ? 's' : ''}</div>
                </div>

                {/* Arrow */}
                <div className="bg-[#0A2342] flex flex-col items-center justify-center px-6 py-4 text-white min-w-[120px]">
                    <div className="text-xl font-black text-[#00B4D8]">→</div>
                    <div className="text-xs font-black mt-0.5 whitespace-nowrap">PITHONIX</div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap">90-day deploy</div>
                </div>

                {/* Post-Pithonix */}
                <div className="bg-white p-6 text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Residual After Recovery</div>
                    <div className="text-3xl font-black text-slate-400">₹{formatLakhs(residual)}</div>
                    <div className="text-xs text-[#00B4D8] font-bold mt-1">₹{formatLakhs(recoverable)} recoverable</div>
                </div>

                {/* ROI badge */}
                <div className="bg-[#F4A261] flex flex-col items-center justify-center px-8 py-4">
                    <div className="text-5xl font-black text-[#0A2342]">{roiMultiple}x</div>
                    <div className="text-[10px] font-black text-[#0A2342]/70 uppercase tracking-widest mt-1">ROI</div>
                </div>
            </div>

            {/* Client estimate comparison */}
            {hasClientEstimate && variancePct !== null && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm px-4 py-3 rounded-xl"
                    style={{ background: varianceUp ? '#FFFBF5' : '#F0FDFA', border: `1px solid ${varianceUp ? '#F4A261' : '#00B4D8'}` }}>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Your estimate</span>
                        <span className="font-black text-[#0A2342]">{clientEstimate.displayText}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Our analysis</span>
                        <span className="font-black text-[#0A2342]">₹{formatLakhs(ourTotal)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Variance</span>
                        <span className="font-black" style={{ color: varianceUp ? '#F4A261' : '#00B4D8' }}>
                            {Math.abs(variancePct)}% {varianceUp ? 'higher' : 'lower'} than your estimate
                        </span>
                    </div>
                    <p className="w-full text-xs text-slate-500 italic">
                        {varianceUp
                            ? 'Your actual exposure may be higher than you estimated. This is common — hidden costs are rarely captured in initial estimates.'
                            : 'Good news — our analysis suggests your exposure may be better than feared, particularly with early intervention.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default ValueImpactBar;
