import React, { useState } from 'react';
import SimProgressBar from './components/SimProgressBar';
import SimDemoModeWrapper from './components/SimDemoModeWrapper';
import SimulatorScreen1 from './screens/SimulatorScreen1';
import SimulatorScreen2 from './screens/SimulatorScreen2';
import SimulatorScreen3 from './screens/SimulatorScreen3';
import SimulatorScreen4 from './screens/SimulatorScreen4';
import SimulatorScreen5 from './screens/SimulatorScreen5';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import './simulator.css';

const SimulatorApp = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [simState, setSimState] = useState({
        orgName: '',
        role: '',
        size: '',
        industry: '',
        useCases: [],
        selectedAgents: [],
        automationBlueprint: null,
        intelligenceBlueprint: null,
        outcomeSimulation: null,
        insightCount: 0,
        valueInputs: {
            clientRevenueEstimate: null,
            clientConfidenceLevel: null,
            rateInputs: {}
        },
        hiddenIssues: [],
        valueCalculations: null,
        valueIntelligenceReady: false,
        clientTools: [],
        clientToolsRaw: "",
        integrationComplexity: "",
        currentImpact: "",
        sessionStartTime: null,
        conversationHistory: [],
    });


    const nextStep = () => setCurrentStep(prev => Math.min(5, prev + 1));
    const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

    return (
        <SimDemoModeWrapper>
            <div className="simulator-container h-screen flex flex-col bg-[#0b0c10] overflow-hidden">
                <header className="bg-[#0b0c10] border-b border-[rgba(102,252,241,0.12)] p-6 flex-shrink-0 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            {currentStep > 1 && currentStep < 5 && (
                                <button
                                    onClick={prevStep}
                                    className="p-2 hover:bg-[#2a3340] rounded-full transition-all text-[#f0f5f9]"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            )}
                            <h1 className="text-2xl font-black text-[#f0f5f9] tracking-tight uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Pithonix <span className="text-[#66fcf1]">Discovery</span>
                            </h1>
                        </div>
                        <div className="flex-1">
                            <SimProgressBar currentStep={currentStep} totalSteps={5} />
                        </div>

                        {currentStep === 2 && simState.blueprintReady && (
                            <button
                                onClick={nextStep}
                                className="bg-[#66fcf1] hover:bg-[#45a29e] text-[#0b0c10] px-5 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 animate-pulse-subtle text-xs"
                            >
                                GENERATE BLUEPRINT <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex-1 max-w-6xl w-full mx-auto px-6 overflow-hidden min-h-0">
                    {currentStep === 1 && (
                        <div className="h-full overflow-y-auto pb-10 scrollbar-hide">
                            <SimulatorScreen1
                                onNext={nextStep}
                                simState={simState}
                                setSimState={setSimState}
                            />
                        </div>
                    )}
                    {currentStep === 2 && (
                        <SimulatorScreen2
                            onNext={nextStep}
                            simState={simState}
                            setSimState={setSimState}
                        />
                    )}
                    {currentStep === 3 && (
                        <div className="h-full overflow-y-auto pb-10 scrollbar-hide">
                            <SimulatorScreen3
                                onNext={nextStep}
                                simState={simState}
                                setSimState={setSimState}
                            />
                        </div>
                    )}
                    {currentStep === 4 && (
                        <div className="h-full overflow-y-auto pb-10 scrollbar-hide">
                            <SimulatorScreen4
                                onNext={nextStep}
                                simState={simState}
                                setSimState={setSimState}
                            />
                        </div>
                    )}
                    {currentStep === 5 && (
                        <div className="h-full overflow-y-auto pb-10 scrollbar-hide">
                            <SimulatorScreen5
                                simState={simState}
                                setSimState={setSimState}
                                onAddUseCase={() => setCurrentStep(2)}
                            />
                        </div>
                    )}
                </main>

                {/* Footer info - Condensed */}
                {currentStep < 5 && (
                    <footer className="max-w-6xl w-full mx-auto px-6 py-4 flex-shrink-0 text-[10px] text-[#8b8c8d] font-bold uppercase tracking-widest flex items-center justify-center gap-4">
                        <span>Pithonix Global Enterprise Intelligence</span>
                        <span className="w-1 h-1 bg-[#8b8c8d] rounded-full" />
                        <span className="text-[#66fcf1]">HARI Intelligence Engine · Gemini 2.5 Pro</span>
                    </footer>
                )}
            </div>
        </SimDemoModeWrapper>
    );
};

export default SimulatorApp;
