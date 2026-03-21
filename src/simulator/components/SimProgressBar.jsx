import React from 'react';

const SimProgressBar = ({ currentStep, totalSteps }) => {
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between mb-2 text-sm font-bold text-[#4A4A6A]">
                <span>STEP {currentStep} OF {totalSteps}</span>
                <span>{Math.round(percentage)}% COMPLETE</span>
            </div>
            <div className="sim-progress-bar-bg">
                <div
                    className="sim-progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default SimProgressBar;
