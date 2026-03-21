import React from 'react';
import { ShieldAlert, Workflow, LineChart, HeartHandshake, Check } from 'lucide-react';

const ICON_MAP = {
    ShieldAlert,
    Workflow,
    LineChart,
    HeartHandshake
};

const SimAgentPanel = ({ agents, selectedAgents, onToggleAgent }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => {
                const Icon = ICON_MAP[agent.icon] || Workflow;
                const isSelected = selectedAgents.includes(agent.id);

                return (
                    <div
                        key={agent.id}
                        onClick={() => onToggleAgent(agent.id)}
                        className={`sim-card p-5 cursor-pointer transition-all border-2 ${isSelected
                                ? 'border-[#00B4D8] bg-[#E0F2F1]'
                                : 'border-transparent bg-white hover:border-slate-200'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#00B4D8] text-white' : 'bg-slate-50 text-[#0A2342]'}`}>
                                <Icon size={20} />
                            </div>
                            {isSelected && (
                                <div className="bg-[#0A2342] text-white p-1 rounded-full">
                                    <Check size={12} />
                                </div>
                            )}
                        </div>
                        <h5 className="font-bold text-[#0A2342] text-sm mb-1">{agent.name}</h5>
                        <p className="text-[10px] font-black text-[#00B4D8] uppercase tracking-wider mb-2">{agent.role}</p>
                        <p className="text-xs text-[#4A4A6A] leading-relaxed">{agent.capability}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default SimAgentPanel;
