import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send } from 'lucide-react';

const SimConversation = ({ messages, onSendMessage, isTyping }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isTyping) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[600px] sim-card overflow-hidden">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                    >
                        <div className={`max-w-[80%] p-4 rounded-xl shadow-sm ${msg.role === 'user'
                                ? 'bg-[#0A2342] text-white'
                                : 'bg-[#F1F5F9] text-[#1A1A2E] border-l-4 border-[#00B4D8]'
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-[#F1F5F9] p-4 rounded-xl flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-[#4A4A6A] rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-[#4A4A6A] rounded-full animate-delay-150"></span>
                            <span className="w-1.5 h-1.5 bg-[#4A4A6A] rounded-full animate-delay-300"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
                <input
                    type="text"
                    placeholder="Describe your challenge in your own words..."
                    className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#00B4D8] transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-[#0A2342] text-white p-3 rounded-lg hover:bg-[#00B4D8] disabled:opacity-50 transition-all"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default SimConversation;
