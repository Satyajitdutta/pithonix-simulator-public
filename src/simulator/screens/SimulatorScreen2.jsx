import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send, BrainCircuit, Sparkles, AlertCircle, ChevronRight, CheckCircle, RefreshCcw, Info, User, Bot, Database } from 'lucide-react';
import {
    getOpeningMessage,
    getScenarioReasoningResponse,
    getScenarioConfirmationResponse,
    extractStructuredChallenge,
    thoughtManager,
    testConnection
} from '../services/geminiSimService';
import { getBenchmark } from '../data/industryBenchmarks';

const CONV_STATE = {
    THINKING_OPENING: 'thinking_opening',
    PROPOSING_SCENARIOS: 'proposing_scenarios',
    AWAITING_CONFIRMATION: 'awaiting_confirmation',
    PROBING_DETAILS: 'probing_details',
    GENERATING_BLUEPRINT: 'generating_blueprint'
};

const SimulatorScreen2 = ({ onNext, simState, setSimState }) => {
    // --- STATE MANAGEMENT ---
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isHariThinking, setIsHariThinking] = useState(false);
    const [convState, setConvState] = useState(CONV_STATE.THINKING_OPENING);
    const [currentThought, setCurrentThought] = useState('');
    const [comprehensionCard, setComprehensionCard] = useState(null);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const conversationId = useRef(`conv_${Date.now()}`);
    const turnCount = useRef(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isHariThinking, currentThought]);

    const started = useRef(false);

    // --- INITIALIZATION ---
    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const startConversation = async () => {
            setIsHariThinking(true);
            try {
                // Verify API connection
                const isOnline = await testConnection();
                if (!isOnline) throw new Error("Strategic link offline. Check API configuration.");

                const response = await getOpeningMessage(simState, conversationId.current);

                // Update thoughts if present
                if (response.thought) {
                    setCurrentThought(response.thought);
                }

                setMessages([{
                    id: Date.now(),
                    role: 'hari',
                    text: response.text,
                    thought: response.thought,
                    timestamp: new Date()
                }]);

                setConvState(CONV_STATE.PROPOSING_SCENARIOS);
                // Opening message is turn 0, ready for turn 1
                turnCount.current = 1;
            } catch (err) {
                console.error("HARI Init Error:", err);
                setError("HARI is having trouble processing the strategic landscape. Please refresh or check your API key.");
            } finally {
                setIsHariThinking(false);
            }
        };

        startConversation();
    }, []);

    // --- CORE HANDLERS ---
    const handleSend = async () => {
        if (!inputValue.trim() || isHariThinking) return;

        let enhancedText = inputValue.trim();
        if (simState.blueprintReady) {
            enhancedText += "\n\n[SYSTEM INSTRUCTION: The user has answered your final question. The strategic discovery phase is officially complete. Provide a definitive, conclusive summary confirming you understand their bottleneck. Do NOT ask any further questions. End by stating clearly that you have enough intelligence to architect the final blueprint.]";
        }

        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsHariThinking(true);
        setError(null);

        try {
            let response;
            const history = {
                messages,
                lastModelResponse: messages.filter(m => m.role === 'hari').pop()?.text
            };

            // State-based routing
            if (convState === CONV_STATE.PROPOSING_SCENARIOS) {
                response = await getScenarioReasoningResponse(enhancedText, history, simState, history.lastModelResponse, conversationId.current, turnCount.current);
                setConvState(CONV_STATE.AWAITING_CONFIRMATION);
            }
            else if (convState === CONV_STATE.AWAITING_CONFIRMATION) {
                response = await getScenarioConfirmationResponse(enhancedText, history, simState, history.lastModelResponse, conversationId.current, turnCount.current);

                // Extract structured comprehension card after confirmation
                const extraction = await extractStructuredChallenge(
                    [...messages, userMsg].map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n'),
                    userMsg.text,
                    simState,
                    conversationId.current,
                    turnCount.current + 1
                );

                if (extraction.success) {
                    setComprehensionCard(extraction.data);
                    // Persist to global simState so Step 3 can use it
                    setSimState(prev => ({
                        ...prev,
                        useCases: [
                            ...(prev.useCases || []),
                            {
                                id: Date.now(),
                                industry: prev.industry,
                                ...extraction.data
                            }
                        ]
                    }));
                }

                setConvState(CONV_STATE.PROBING_DETAILS);
            }
            else {
                // Continue probing
                response = await getScenarioReasoningResponse(enhancedText, history, simState, history.lastModelResponse, conversationId.current, turnCount.current);
            }

            if (response.thought) setCurrentThought(response.thought);

            const aiText = (response.text || "").trim() || "I'm analyzing the strategic implications of these operational friction points. Could you tell me more about how this specifically affects your team's daily workflow?";

            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'hari',
                text: aiText,
                thought: response.thought,
                timestamp: new Date()
            }]);

            turnCount.current += 1;

            // Enforce 5-turn limit for Blueprint Readiness
            if (turnCount.current >= 5 && !simState.blueprintReady) {
                setSimState(prev => ({ ...prev, blueprintReady: true }));
            }

        } catch (err) {
            console.error("HARI Thinking Error:", err);
            setError("The reasoning chain was interrupted. Let's try that again.");
        } finally {
            setIsHariThinking(false);
        }
    };

    // --- RENDER HELPERS ---
    const renderLegacySelector = () => {
        if (turnCount.current < 2) return null; // Wait for some context

        const bench = getBenchmark(simState.industry);
        const systems = bench?.legacySystems || [];

        return (
            <div className="mb-6 animate-fade-in-up">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-blue-500 h-4 w-4" />
                        <h3 className="text-[#0A2342] font-black tracking-tight text-xs uppercase">Confirm Your Legacy Ecosystem</h3>
                        <span className="ml-auto text-[8px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-black">DETECTION ACTIVE</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-4 font-medium leading-relaxed">
                        HARI has detected several industry-standard applications in your landscape. Please select the ones you currently operate on:
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {systems.map((sys) => {
                            const isSelected = (simState.clientTools || []).some(t => t.id === sys.id);
                            return (
                                <button
                                    key={sys.id}
                                    onClick={() => {
                                        setSimState(prev => {
                                            const current = prev.clientTools || [];
                                            const exists = current.some(t => t.id === sys.id);
                                            const newTools = exists
                                                ? current.filter(t => t.id !== sys.id)
                                                : [...current, sys];
                                            return { ...prev, clientTools: newTools };
                                        });
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                        : 'border-white bg-white hover:border-slate-200 shadow-sm'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {sys.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#0A2342]">{sys.name}</span>
                                        <span className="text-[8px] text-slate-400 uppercase font-black">{sys.category}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2 flex items-center gap-2">
                            <span>Unlisted Custom Applications</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Custom CRM, AS400, proprietary software... (comma separated)"
                            value={simState.clientToolsRaw || ""}
                            onChange={(e) => setSimState(prev => ({ ...prev, clientToolsRaw: e.target.value }))}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-all font-semibold text-[#0A2342] placeholder:text-slate-400 placeholder:font-normal"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderComprehensionCard = () => {
        if (!comprehensionCard) return null;

        return (
            <div className="mb-6 animate-fade-in-up">
                <div className="bg-[#0A2342] border border-blue-400/30 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2 border-b border-blue-400/10 pb-2">
                        <Sparkles className="text-blue-400 h-3 w-3" />
                        <h3 className="text-white font-black tracking-[0.1em] uppercase text-[9px]">HARI Comprehension Profile</h3>
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-[8px] text-green-400 font-black tracking-widest uppercase">Live Sync</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-0.5">
                            <p className="text-blue-300/60 text-[7px] uppercase font-black tracking-widest">Core Challenge</p>
                            <p className="text-white font-bold text-xs leading-tight line-clamp-1">{comprehensionCard.challenge}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-blue-300/60 text-[7px] uppercase font-black tracking-widest">Impact Layer</p>
                            <p className="text-white font-bold text-xs line-clamp-1">{comprehensionCard.department}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-blue-300/60 text-[7px] uppercase font-black tracking-widest">Urgency</p>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded inline-block ${comprehensionCard.urgency === 'HIGH' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                {comprehensionCard.urgency}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-blue-300/60 text-[7px] uppercase font-black tracking-widest">Hypothesis</p>
                            <p className="text-blue-100 font-medium text-[10px] italic line-clamp-1 truncate">
                                {comprehensionCard.rootCause}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto overflow-hidden">
            {/* Header Section (Sticky-like) */}
            <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/80 backdrop-blur-sm z-30 py-2">
                <div>
                    <h2 className="text-2xl font-black text-[#0A2342] leading-tight">Strategic Discovery</h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(turnCount.current / 5) * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase 1: Diagnostic</span>
                    </div>
                </div>
            </div>

            {/* Main Conversation Area */}
            <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
                {/* Thinking Overlay (Mini) */}
                {isHariThinking && currentThought && (
                    <div className="absolute top-4 right-4 z-20 max-w-xs animate-fade-in">
                        <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/30 p-3 rounded-2xl shadow-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <BrainCircuit className="h-4 w-4 text-blue-400 animate-pulse" />
                                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">HARI Internal Reasoning</span>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed italic">
                                {currentThought}
                            </p>
                        </div>
                    </div>
                )}

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-[#0A2342] text-white'
                                    }`}>
                                    {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <div className={`p-5 rounded-2xl ${m.role === 'user'
                                        ? 'bg-[#0A2342] text-white rounded-tr-none'
                                        : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none ring-1 ring-slate-200/50'
                                        }`}>
                                        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                                            {m.text}
                                        </div>
                                    </div>
                                    <p className={`text-[10px] font-bold text-slate-400 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {renderLegacySelector()}
                    {renderComprehensionCard()}

                    {isHariThinking && (
                        <div className="flex justify-start items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-[#0A2342]/10 rounded-xl flex items-center justify-center">
                                <Loader2 className="h-5 w-5 text-[#0A2342] animate-spin" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">HARI is thinking...</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center p-4">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-2xl flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                                <button onClick={() => window.location.reload()} className="ml-4 p-1 hover:bg-red-100 rounded-full transition-colors">
                                    <RefreshCcw size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    {simState.blueprintReady && (
                        <div className="flex flex-col items-center gap-4 animate-fade-in mb-6">
                            <div className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-[#0A2342] to-[#153457] rounded-2xl shadow-lg border border-blue-500/30">
                                <div className="flex flex-col">
                                    <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1">Strategic Discovery Complete</p>
                                    <p className="text-blue-100/70 text-[10px] font-medium tracking-tight">HARI has sufficient intelligence. You may answer the final question or proceed immediately.</p>
                                </div>
                                <button
                                    onClick={onNext}
                                    className="bg-blue-500 hover:bg-blue-400 text-[#0A2342] py-3 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md group whitespace-nowrap"
                                >
                                    <Sparkles className="h-4 w-4 text-[#0A2342] group-hover:rotate-12 transition-transform" />
                                    GENERATE BLUEPRINT
                                    <ChevronRight className="h-4 w-4 text-[#0A2342] group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="relative group">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (inputValue.trim()) handleSend();
                                }
                            }}
                            placeholder="Share your specific operational challenges..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-16 focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-all resize-none shadow-sm min-h-[80px]"
                            disabled={isHariThinking}
                        />

                        <div className="absolute right-3 bottom-3 flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:inline bg-slate-100 px-2 py-1 rounded-md">
                                {simState.blueprintReady ? '0 interactions remaining' : `${Math.max(0, 5 - turnCount.current)} interactions remaining`}
                            </span>
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isHariThinking}
                                className={`p-3 rounded-xl transition-all ${!inputValue.trim() || isHariThinking
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#0A2342] text-white shadow-lg hover:scale-105 active:scale-95 group-hover:bg-[#153457]'
                                    }`}
                            >
                                {isHariThinking ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Insights */}
            {!simState.blueprintReady && (
                <div className="mt-4 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                        <Info size={14} className="text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {isHariThinking ? 'HARI Thinking...' : 'Strategic Intent: Root Cause Discovery'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulatorScreen2;
