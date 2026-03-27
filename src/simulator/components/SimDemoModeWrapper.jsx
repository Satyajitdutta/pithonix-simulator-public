import React, { useState } from 'react';

const SimDemoModeWrapper = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);

    return (
        <div className={`relative ${isDemoMode ? 'fixed inset-0 z-[9999] bg-[#0b0c10] overflow-auto' : ''}`}>
            <div className="absolute top-8 right-8 z-[10000]">
                <button
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border transition-all ${isDemoMode
                            ? 'bg-[#66fcf1] text-[#0b0c10] border-[#66fcf1]'
                            : 'bg-[#1f2833] text-[#f0f5f9] border-[rgba(102,252,241,0.3)] hover:bg-[#2a3340]'
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-[#0b0c10] animate-pulse' : 'bg-[#66fcf1]'}`} />
                    {isDemoMode ? 'DEMO MODE ACTIVE' : 'ENTER DEMO MODE'}
                </button>
            </div>
            {children}
        </div>
    );
};

export default SimDemoModeWrapper;
