import React from 'react';

const HiddenIssueCard = ({ issue, onAddToBlueprint, adding }) => {
    const confidenceColor = issue.confidenceLevel >= 85 ? '#10B981' : issue.confidenceLevel >= 75 ? '#F4A261' : '#94A3B8';

    return (
        <div className="rounded-xl border-l-4 border-[#F4A261] bg-[#FFFBF5] p-5 space-y-3" style={{ borderColor: '#F4A261' }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                    <span className="text-lg mt-0.5">⚠</span>
                    <h5 className="font-black text-[#0A2342] text-sm leading-tight">{issue.title}</h5>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: confidenceColor + '22', color: confidenceColor }}>
                        {issue.confidenceLevel}% confidence
                    </span>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#4A4A6A] leading-relaxed">{issue.description}</p>

            {/* Connected to */}
            {issue.relatedToUseCase && (
                <div className="text-xs">
                    <span className="font-black text-[#4A4A6A] uppercase tracking-widest text-[10px]">Connected to: </span>
                    <span className="text-[#0A2342] font-semibold">{issue.relatedToUseCase}</span>
                </div>
            )}

            {/* Why missed */}
            <div className="bg-white/70 rounded-lg px-3 py-2">
                <span className="text-[10px] font-black text-[#F4A261] uppercase tracking-widest block mb-0.5">Why this is typically missed:</span>
                <p className="text-xs text-[#4A4A6A] italic leading-relaxed">{issue.whyYouMissedIt}</p>
            </div>

            {/* Impact + Agents row */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] font-black text-[#4A4A6A] uppercase tracking-widest block mb-1">Additional value at risk:</span>
                    <span className="text-sm font-black text-[#F4A261]">{issue.estimatedAdditionalImpact}</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                    {(issue.agentsThatAddress || []).slice(0, 2).map((agent, i) => (
                        <span key={i} className="text-[9px] bg-[#0A2342]/10 text-[#0A2342] px-2 py-0.5 rounded-full font-semibold">{agent}</span>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={() => onAddToBlueprint(issue)}
                disabled={adding}
                className="w-full text-xs font-black text-[#0A2342] border-2 border-[#F4A261] rounded-xl py-2 px-4 hover:bg-[#F4A261] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {adding ? (
                    <><span className="animate-spin text-sm">⟳</span> Adding to Blueprint...</>
                ) : (
                    <>+ Add This to My Blueprint</>
                )}
            </button>
        </div>
    );
};

export default HiddenIssueCard;
