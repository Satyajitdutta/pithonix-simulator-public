import React, { useState } from 'react';
import { Building2, Users, Briefcase, Globe } from 'lucide-react';
import { convertToINR } from '../services/valueCalculationService';

const ROLES = ['CEO / Managing Director', 'COO / Operations', 'CIO / IT Director', 'CHRO / HR Director', 'CFO / Finance Head', 'CTO / Technology Head', 'VP / Senior Director', 'General Manager', 'Department Head', 'Other'];
const INDUSTRIES = ['Healthcare & Hospitals', 'Banking & Financial Services', 'IT & Technology Services', 'GCC / Global Capability Centre', 'Manufacturing & Industrial', 'Retail & FMCG', 'Education & EdTech', 'Infrastructure & Real Estate', 'Pharmaceuticals & Life Sciences', 'Logistics & Supply Chain'];
const SIZES = [
    { label: '100–500 employees', value: '100–500 employees', icon: '🏢' },
    { label: '500–2,000 employees', value: '500–2,000 employees', icon: '🏙️' },
    { label: '2,000–10,000 employees', value: '2,000–10,000 employees', icon: '🌆' },
    { label: '10,000+ employees', value: '10,000+ employees', icon: '🌐' }
];
const CURRENCIES = ['₹', '$', 'AED', 'SAR'];
const UNITS = ['Thousands', 'Lakhs', 'Crores'];
const CONFIDENCE_LEVELS = [
    { value: 'guess', label: 'Just a guess' },
    { value: 'estimate', label: 'Reasonable estimate' },
    { value: 'data', label: 'Based on data' }
];

const SimulatorScreen1 = ({ onNext, simState, setSimState }) => {
    const [local, setLocal] = useState({
        orgName: simState.orgName || '',
        role: simState.role || '',
        size: simState.size || '',
        industry: simState.industry || ''
    });

    // Estimate fields
    const [estimateCurrency, setEstimateCurrency] = useState('₹');
    const [estimateUnit, setEstimateUnit] = useState('Lakhs');
    const [estimateAmount, setEstimateAmount] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState(null);

    const update = (field, value) => setLocal(prev => ({ ...prev, [field]: value }));
    const isComplete = local.orgName.trim() && local.role && local.size && local.industry;

    const estimateDisplay = estimateAmount
        ? `You estimate ${estimateCurrency}${estimateAmount} ${estimateUnit} annually`
        : null;

    const handleNext = () => {
        if (!isComplete) return;

        let clientEstimate = null;
        if (estimateAmount && parseFloat(estimateAmount) > 0) {
            const inINR = convertToINR(estimateAmount, estimateCurrency, estimateUnit);
            clientEstimate = {
                amount: parseFloat(estimateAmount),
                currency: estimateCurrency,
                unit: estimateUnit,
                displayText: `${estimateCurrency}${estimateAmount} ${estimateUnit}`,
                inINR
            };
        }

        setSimState(prev => ({
            ...prev,
            ...local,
            valueInputs: {
                ...(prev.valueInputs || {}),
                clientRevenueEstimate: clientEstimate,
                clientConfidenceLevel: confidenceLevel
            }
        }));
        onNext();
    };

    return (
        <div className="max-w-2xl mx-auto animate-fadeIn space-y-8 py-4">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#0A2342] uppercase tracking-tight">
                    Tell HARI About Your Organisation
                </h2>
                <p className="text-[#4A4A6A]">4 inputs. 60 seconds. A personalised AI blueprint.</p>
            </div>

            {/* Org Name */}
            <div className="sim-card p-6 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#4A4A6A] uppercase tracking-widest">
                    <Building2 size={14} className="text-[#00B4D8]" />
                    Organisation Name
                </label>
                <input
                    type="text"
                    value={local.orgName}
                    onChange={e => update('orgName', e.target.value)}
                    placeholder="e.g. Meridian Global Healthcare"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#0A2342] font-semibold focus:outline-none focus:border-[#00B4D8] transition-all"
                />
            </div>

            {/* Role */}
            <div className="sim-card p-6 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#4A4A6A] uppercase tracking-widest">
                    <Briefcase size={14} className="text-[#00B4D8]" />
                    Your Role
                </label>
                <select
                    value={local.role}
                    onChange={e => update('role', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#0A2342] font-semibold focus:outline-none focus:border-[#00B4D8] transition-all bg-white"
                >
                    <option value="">Select your role</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            {/* Size — 2x2 tile grid */}
            <div className="sim-card p-6 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#4A4A6A] uppercase tracking-widest">
                    <Users size={14} className="text-[#00B4D8]" />
                    Organisation Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {SIZES.map(s => (
                        <button
                            key={s.value}
                            onClick={() => update('size', s.value)}
                            className={`p-4 rounded-xl border-2 text-left transition-all font-semibold text-sm flex items-center gap-3
              ${local.size === s.value
                                    ? 'border-[#0A2342] bg-[#00B4D8]/10 text-[#0A2342]'
                                    : 'border-slate-200 text-slate-500 hover:border-[#00B4D8]/50 hover:bg-slate-50'
                                }`}
                        >
                            <span className="text-2xl">{s.icon}</span>
                            <span>{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Industry */}
            <div className="sim-card p-6 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-[#4A4A6A] uppercase tracking-widest">
                    <Globe size={14} className="text-[#00B4D8]" />
                    Primary Industry
                </label>
                <select
                    value={local.industry}
                    onChange={e => update('industry', e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#0A2342] font-semibold focus:outline-none focus:border-[#00B4D8] transition-all bg-white"
                >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
            </div>

            {/* ─── FEATURE 1: Client estimate + confidence ────────────────── */}
            <div className="sim-card p-6 space-y-4">
                <div>
                    <label className="text-xs font-black text-[#4A4A6A] uppercase tracking-widest block mb-0.5">
                        Your estimate <span className="text-slate-300 font-normal normal-case">(optional — helps us calibrate your simulation)</span>
                    </label>
                    <p className="text-sm text-[#4A4A6A] mt-1">What do you estimate this is costing your organisation annually?</p>
                </div>

                {/* Compound currency input */}
                <div className="flex items-center gap-2">
                    <select
                        value={estimateCurrency}
                        onChange={e => setEstimateCurrency(e.target.value)}
                        className="border-2 border-slate-200 rounded-xl px-2 py-3 text-sm font-black text-[#0A2342] bg-white focus:outline-none focus:border-[#00B4D8] transition-all"
                    >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        type="number"
                        value={estimateAmount}
                        onChange={e => setEstimateAmount(e.target.value)}
                        placeholder="e.g. 3.5"
                        className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-[#0A2342] font-semibold focus:outline-none focus:border-[#00B4D8] transition-all"
                    />
                    <select
                        value={estimateUnit}
                        onChange={e => setEstimateUnit(e.target.value)}
                        className="border-2 border-slate-200 rounded-xl px-2 py-3 text-sm font-black text-[#0A2342] bg-white focus:outline-none focus:border-[#00B4D8] transition-all"
                    >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>

                {/* Dynamic display text */}
                {estimateDisplay && (
                    <p className="text-sm font-bold text-[#00B4D8] animate-fadeIn">{estimateDisplay}</p>
                )}

                {/* Confidence pills */}
                <div>
                    <p className="text-xs font-black text-[#4A4A6A] uppercase tracking-widest mb-2">How confident are you in this estimate?</p>
                    <div className="flex gap-2 flex-wrap">
                        {CONFIDENCE_LEVELS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setConfidenceLevel(prev => prev === value ? null : value)}
                                className={`px-4 py-2 rounded-full text-sm font-black border-2 transition-all ${confidenceLevel === value
                                    ? 'border-[#0A2342] bg-[#0A2342] text-white'
                                    : 'border-slate-200 text-slate-500 hover:border-[#00B4D8]'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!isComplete}
                className={`w-full py-4 rounded-2xl font-black text-xl transition-all
          ${isComplete
                        ? 'bg-[#0A2342] text-white hover:bg-[#00B4D8] shadow-xl'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
            >
                Begin Discovery →
            </button>
        </div>
    );
};

export default SimulatorScreen1;
