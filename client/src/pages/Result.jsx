import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, Layers, HelpCircle, ArrowLeft } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';

const Result = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const doc = state?.document;
    const [activeTab, setActiveTab] = useState('summary');

    if (!doc) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <header className="w-full bg-black/60 border-b border-white/10 backdrop-blur-2xl z-20">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition mt-1">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1 bg-purple-500/10 inline-block px-2 py-0.5 rounded border border-purple-500/20">{doc.sourceType}</div>
                            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{doc.title}</h1>
                            <p className="text-neutral-500 text-sm">Generated {new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex bg-black border border-white/10 rounded-xl p-1.5 shadow-xl">
                        <TabButton icon={<BookOpen size={16} />} label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                        <TabButton icon={<Layers size={16} />} label="Flashcards" isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} />
                        <TabButton icon={<HelpCircle size={16} />} label="Quiz" isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-6 py-12 relative z-10 w-full max-w-6xl mx-auto">
                {activeTab === 'summary' && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-3"><BookOpen className="w-7 h-7" /> Executive Summary</h2>
                        <div className="text-neutral-200 leading-relaxed text-lg whitespace-pre-line font-medium">{doc.summary}</div>
                    </div>
                )}

                {activeTab === 'flashcards' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Flashcard flashcards={doc.flashcards} />
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Quiz quiz={doc.quiz} />
                    </div>
                )}
            </main>
        </div>
    );
};

const TabButton = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2.5 text-sm ${isActive ? 'bg-white/15 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}`}
    >
        {icon} {label}
    </button>
);

export default Result;
