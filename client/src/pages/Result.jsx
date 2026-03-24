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
        <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#222831', color: '#EEEEEE' }}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-[500px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,173,181,0.05), transparent)' }}></div>
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,173,181,0.08)' }}></div>

            {/* Header */}
            <header className="w-full backdrop-blur-2xl z-20" style={{ background: 'rgba(34,40,49,0.9)', borderBottom: '1px solid rgba(0,173,181,0.15)' }}>
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg mt-1 transition" style={{ background: 'rgba(238,238,238,0.05)', color: 'rgba(238,238,238,0.5)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(238,238,238,0.1)'; e.currentTarget.style.color = '#EEEEEE'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(238,238,238,0.05)'; e.currentTarget.style.color = 'rgba(238,238,238,0.5)'; }}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-widest mb-1 inline-block px-2 py-0.5 rounded" style={{ color: '#00ADB5', background: 'rgba(0,173,181,0.1)', border: '1px solid rgba(0,173,181,0.2)' }}>{doc.sourceType}</div>
                            <h1 className="text-3xl font-bold mb-2 leading-tight" style={{ color: '#EEEEEE' }}>{doc.title}</h1>
                            <p className="text-sm" style={{ color: 'rgba(238,238,238,0.4)' }}>Generated {new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex rounded-xl p-1.5 shadow-xl" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                        <TabButton icon={<BookOpen size={16} />} label="Summary" isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                        <TabButton icon={<Layers size={16} />} label="Flashcards" isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} />
                        <TabButton icon={<HelpCircle size={16} />} label="Quiz" isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto px-6 py-12 relative z-10 w-full max-w-6xl mx-auto">
                {activeTab === 'summary' && (
                    <div className="rounded-3xl p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#00ADB5' }}><BookOpen className="w-7 h-7" /> Executive Summary</h2>
                        <div className="leading-relaxed text-lg whitespace-pre-line font-medium" style={{ color: '#EEEEEE' }}>{doc.summary}</div>
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
        className="px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2.5 text-sm"
        style={isActive
            ? { background: 'rgba(0,173,181,0.15)', color: '#00ADB5' }
            : { color: 'rgba(238,238,238,0.4)' }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#EEEEEE'; e.currentTarget.style.background = 'rgba(238,238,238,0.05)'; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(238,238,238,0.4)'; e.currentTarget.style.background = 'transparent'; } }}
    >
        {icon} {label}
    </button>
);

export default Result;
