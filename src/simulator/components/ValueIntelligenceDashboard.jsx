import React, { useState } from 'react';
import ValueImpactBar from './ValueImpactBar';
import HiddenIssueCard from './HiddenIssueCard';
import { formatLakhs, formatINR } from '../services/valueCalculationService';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ValueIntelligenceDashboard = ({
    valueCalculations,
    hiddenIssues = [],
    clientEstimate,
    orgName,
    onAddHiddenIssue
}) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [addingIssue, setAddingIssue] = useState(null);

    if (!valueCalculations) return null;

    const { currentAnnualPain, postPithonixResidual, recoverableValue, paybackWeeks, roiMultiple } = valueCalculations;

    const handleAdd = async (issue) => {
        setAddingIssue(issue.id);
        try {
            await onAddHiddenIssue(issue);
        } finally {
            setAddingIssue(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Value Intelligence Summary</div>
                    <h3 className="text-xl font-black text-[#0A2342]">{orgName}</h3>
                </div>
                {paybackWeeks && (
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payback Period</div>
                        <div className="text-2xl font-black text-[#00B4D8]">{paybackWeeks} weeks</div>
                    </div>
                )}
            </div>

            {/* SECTION A — Value Impact Bar */}
            <ValueImpactBar
                currentPain={currentAnnualPain}
                residual={postPithonixResidual?.residual}
                recoverable={recoverableValue}
                roiMultiple={roiMultiple}
                clientEstimate={clientEstimate}
            />

            {/* SECTION B — Calculation Transparency */}
            <div className="sim-card overflow-hidden">
                <button
                    onClick={() => setShowBreakdown(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-all"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#4A4A6A] uppercase tracking-widest">How We Calculated This</span>
                        <span className="text-[10px] text-slate-400">(Your numbers, not generic benchmarks)</span>
                    </div>
                    {showBreakdown ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {showBreakdown && (
                    <div className="px-5 pb-5 animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        {['Challenge', 'Annual Cost', 'Calculation', 'Key Assumptions'].map(h => (
                                            <th key={h} className="text-left py-2 pr-4 font-black text-[#4A4A6A] uppercase tracking-widest text-[10px]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(currentAnnualPain?.breakdown || []).map((item, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            <td className="py-3 pr-4 font-semibold text-[#0A2342] max-w-[180px]">
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">{item.department}</div>
                                                {item.useCaseName}
                                            </td>
                                            <td className="py-3 pr-4 font-black text-[#0A2342] whitespace-nowrap">₹{formatLakhs(item.annualCost)}</td>
                                            <td className="py-3 pr-4 text-slate-500 max-w-[220px] leading-relaxed">{item.calculation}</td>
                                            <td className="py-3 text-slate-400 max-w-[200px]">
                                                <ul className="space-y-0.5">
                                                    {(item.assumptions || []).map((a, j) => <li key={j}>· {a}</li>)}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[#0A2342]">
                                        <td className="py-3 font-black text-[#0A2342] uppercase tracking-widest text-[10px]">Total</td>
                                        <td className="py-3 font-black text-[#0A2342] text-sm">₹{formatLakhs(currentAnnualPain?.total)}</td>
                                        <td colSpan={2} className="py-3 text-xs text-slate-400">
                                            {roiMultiple}x ROI · {paybackWeeks} week payback at ₹27L typical investment
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION C — Hidden Intelligence Alerts */}
            {hiddenIssues.length > 0 && (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-black text-[#0A2342] uppercase tracking-tight">What You May Not Have Considered</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Our analysis identified <strong>{hiddenIssues.length}</strong> inter-related issue{hiddenIssues.length !== 1 ? 's' : ''} connected to your stated challenges.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {hiddenIssues.map((issue, i) => (
                            <HiddenIssueCard
                                key={issue.id || i}
                                issue={issue}
                                onAddToBlueprint={handleAdd}
                                adding={addingIssue === issue.id}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValueIntelligenceDashboard;
