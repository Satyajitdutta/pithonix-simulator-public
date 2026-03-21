import React, { useState } from 'react';

const rateFieldConfig = {
    HR: [
        { id: 'avgMonthlySalary', label: 'Average monthly salary (fully loaded)', placeholder: 'e.g. 85000', prefix: '₹', suffix: '/month', tooltip: 'Include PF, benefits, overheads — typically 1.3x to 1.5x CTC' },
        { id: 'costPerHire', label: 'Average cost per hire', placeholder: 'e.g. 45000', prefix: '₹', suffix: '/hire', tooltip: 'Include agency fees, interview time, onboarding cost' },
        { id: 'hrFTECount', label: 'Number of HR staff', placeholder: 'e.g. 12', prefix: '', suffix: 'people', tooltip: 'HR team headcount' }
    ],
    Finance: [
        { id: 'financeTeamSize', label: 'Finance team size', placeholder: 'e.g. 8', prefix: '', suffix: 'people', tooltip: 'Finance and accounts team' },
        { id: 'avgFinanceSalary', label: 'Average finance staff monthly cost', placeholder: 'e.g. 95000', prefix: '₹', suffix: '/month', tooltip: 'Loaded cost per person' },
        { id: 'annualRevenue', label: 'Annual revenue (approximate)', placeholder: 'e.g. 250', prefix: '₹', suffix: 'Crores', tooltip: 'Used to calculate variance impact as percentage of revenue' }
    ],
    Operations: [
        { id: 'avgHourlyRate', label: 'Average hourly cost of operations staff', placeholder: 'e.g. 650', prefix: '₹', suffix: '/hour', tooltip: 'Monthly salary ÷ working hours' },
        { id: 'slaBreachPenalty', label: 'Average SLA breach penalty or cost', placeholder: 'e.g. 25000', prefix: '₹', suffix: '/incident', tooltip: 'Contract penalty or estimated business impact' }
    ],
    IT: [
        { id: 'ticketVolumeMonthly', label: 'Monthly helpdesk ticket volume', placeholder: 'e.g. 340', prefix: '', suffix: 'tickets/month', tooltip: 'Average tickets across all categories' },
        { id: 'avgResolutionTime', label: 'Average resolution time', placeholder: 'e.g. 4.5', prefix: '', suffix: 'hours', tooltip: 'From ticket open to close' }
    ],
    Sales: [
        { id: 'avgDealSize', label: 'Average deal size', placeholder: 'e.g. 35', prefix: '₹', suffix: 'Lakhs', tooltip: 'Average closed deal value' },
        { id: 'salesCycleWeeks', label: 'Average sales cycle', placeholder: 'e.g. 12', prefix: '', suffix: 'weeks', tooltip: 'From first contact to closed deal' }
    ]
};

const MAX_FIELDS = 4;

const RateInputCard = ({ useCases, orgName, onSubmit, onSkip }) => {
    // Collect unique departments
    const departments = [...new Set(useCases.map(uc => uc.department).filter(Boolean))];

    // Collect relevant fields, max 4
    const relevantFields = departments
        .flatMap(dept => rateFieldConfig[dept] || [])
        .filter((f, i, arr) => arr.findIndex(x => x.id === f.id) === i)
        .slice(0, MAX_FIELDS);

    const [values, setValues] = useState({});

    const update = (id, val) => setValues(prev => ({ ...prev, [id]: val }));

    const handleSubmit = () => {
        const parsed = {};
        for (const [k, v] of Object.entries(values)) {
            const num = parseFloat(v);
            if (!isNaN(num)) parsed[k] = num;
        }
        onSubmit(parsed);
    };

    if (relevantFields.length === 0) {
        onSkip();
        return null;
    }

    return (
        <div className="sim-card border-l-4 border-[#00B4D8] p-5 space-y-4 animate-fadeIn">
            {/* Card header */}
            <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                    <p className="text-sm font-black text-[#0A2342] leading-snug">
                        To make your simulation specific to <strong>{orgName}</strong> — not generic benchmarks — help us with a few numbers.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-widest">All optional · Takes 60 seconds</p>
                </div>
            </div>

            {/* Rate fields */}
            <div className="space-y-3">
                {relevantFields.map(field => (
                    <div key={field.id} className="space-y-1">
                        <label className="text-xs font-black text-[#4A4A6A]">
                            {field.label}
                        </label>
                        <div className="flex items-center gap-2">
                            {field.prefix && (
                                <span className="text-sm font-black text-[#0A2342] w-6 shrink-0 text-right">{field.prefix}</span>
                            )}
                            <input
                                type="number"
                                value={values[field.id] || ''}
                                onChange={e => update(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00B4D8] transition-all"
                            />
                            {field.suffix && (
                                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">{field.suffix}</span>
                            )}
                        </div>
                        {field.tooltip && (
                            <p className="text-[10px] text-slate-400 ml-8">{field.tooltip}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-[#0A2342] text-white py-2.5 px-4 rounded-xl text-sm font-black hover:bg-[#00B4D8] transition-all"
                >
                    Use These Numbers →
                </button>
                <button
                    onClick={onSkip}
                    className="flex-1 border-2 border-slate-200 text-[#4A4A6A] py-2.5 px-4 rounded-xl text-sm font-bold hover:border-slate-300 transition-all"
                >
                    Skip — use industry averages
                </button>
            </div>
        </div>
    );
};

export default RateInputCard;
