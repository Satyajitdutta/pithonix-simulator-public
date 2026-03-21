import React, { useState } from 'react';

const SimDemoModeWrapper = ({ children }) => {
    const [isDemoMode, setIsDemoMode] = useState(false);

    return (
        <div className={`relative ${isDemoMode ? 'fixed inset-0 z-[9999] bg-white overflow-auto' : ''}`}>
            <div className="absolute top-8 right-8 z-[10000]">
                <button
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border transition-all ${isDemoMode
                            ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                            : 'bg-white text-[#0A2342] border-[#0A2342] hover:bg-[#F8FAFC]'
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-white animate-pulse' : 'bg-[#00B4D8]'}`} />
                    {isDemoMode ? 'DEMO MODE ACTIVE' : 'ENTER DEMO MODE'}
                </button>
            </div>
            {children}
        </div>
    );
};

export default SimDemoModeWrapper;
