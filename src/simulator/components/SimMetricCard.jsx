import React from 'react';

const SimMetricCard = ({ label, value, subtext, icon: Icon, trend }) => {
    return (
        <div className="sim-card p-6 border-b-4 border-[#00B4D8] hover:translate-y-[-4px] transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg">
                    <Icon className="text-[#0A2342]" size={20} />
                </div>
                {trend && (
                    <span className="text-[10px] font-black text-[#06D6A0] bg-[#E0F2F1] px-2 py-1 rounded">
                        {trend}
                    </span>
                )}
            </div>
            <h5 className="text-[10px] font-black text-[#4A4A6A] uppercase tracking-widest mb-1">
                {label}
            </h5>
            <div className="text-2xl font-black text-[#0A2342] mb-1">
                {value}
            </div>
            <p className="text-xs text-[#4A4A6A] font-medium">
                {subtext}
            </p>
        </div>
    );
};

export default SimMetricCard;
