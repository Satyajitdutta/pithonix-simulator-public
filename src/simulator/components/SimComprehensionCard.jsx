import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

const SimComprehensionCard = ({ data, onConfirm, onClarify }) => {
    if (!data) return null;

    return (
        <div className="sim-card border-2 border-[#00B4D8] p-6 animate-fadeIn">
            <h3 className="text-xs font-black text-[#00B4D8] uppercase tracking-widest mb-4">
                WHAT I UNDERSTOOD
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-[#4A4A6A] uppercase mb-1 block">Challenge</label>
                    <p className="text-lg font-bold text-[#0A2342] leading-tight">{data.challenge}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-[#4A4A6A] uppercase mb-1 block">Department Affected</label>
                        <p className="text-sm font-bold text-[#0A2342]">{data.department}</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-[#4A4A6A] uppercase mb-1 block">Business Impact</label>
                        <p className="text-sm font-bold text-[#0A2342]">{data.impact}</p>
                    </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                    <label className="text-[10px] font-bold text-[#4A4A6A] uppercase mb-1 block">
                        Urgency Assessment: <span className={
                            data.urgency === 'HIGH' ? 'text-red-600' : 'text-[#F4A261]'
                        }>{data.urgency}</span>
                    </label>
                    <p className="text-xs text-[#4A4A6A]">{data.urgencyReason}</p>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button
                        onClick={onConfirm}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#0A2342] text-white py-3 rounded-lg font-bold hover:bg-[#06D6A0] transition-all"
                    >
                        <CheckCircle size={18} />
                        That's it
                    </button>
                    <button
                        onClick={onClarify}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0A2342] text-[#0A2342] py-3 rounded-lg font-bold hover:bg-slate-50 transition-all"
                    >
                        <HelpCircle size={18} />
                        Let me clarify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimComprehensionCard;
