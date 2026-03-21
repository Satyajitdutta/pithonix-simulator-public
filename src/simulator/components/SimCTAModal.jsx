import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

const SimCTAModal = ({ isOpen, onClose, onSend }) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onSend(email);
            setSent(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[10001] bg-[#0A2342]/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-popIn">
                {!sent ? (
                    <>
                        <h3 className="text-3xl font-black text-[#0A2342] mb-4 uppercase tracking-tight">
                            Get Your Full Report
                        </h3>
                        <p className="text-[#4A4A6A] mb-8 leading-relaxed">
                            We'll send your Automation, Intelligence, and Outcome Blueprints directly to your inbox as a high-fidelity PDF.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-4 border-2 rounded-xl outline-none focus:ring-2 focus:ring-[#00B4D8] transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="sim-btn-primary w-full text-xl flex justify-center items-center gap-2">
                                Send My Blueprint <ArrowRight size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle className="mx-auto text-[#06D6A0] mb-6" size={64} />
                        <h3 className="text-3xl font-black text-[#0A2342] mb-4 uppercase tracking-tight">
                            Success!
                        </h3>
                        <p className="text-[#4A4A6A] mb-8">
                            Your personalised report is on its way to <strong>{email}</strong>.
                        </p>
                        <button onClick={onClose} className="sim-btn-primary px-12">
                            Back to Simulator
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimCTAModal;
