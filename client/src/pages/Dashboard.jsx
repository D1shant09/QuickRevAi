import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, Layers, ChevronRight, LogOut, Plus } from 'lucide-react';

const Dashboard = () => {
    const [docs, setDocs] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary'); // summary, flashcards, quiz

    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await api.get('/generate');
            setDocs(res.data);
            if (res.data.length > 0) setActiveDoc(res.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            {/* Sidebar */}
            <div className="w-80 bg-black/40 border-r border-white/10 flex flex-col backdrop-blur-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">QuickRev AI</h2>
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <button
                        onClick={() => navigate('/upload')}
                        className="w-full py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-purple-500/30 text-purple-300 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    >
                        <Plus className="w-5 h-5" /> New Study Material
                    </button>

                    <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mt-6 mb-2">Your Documents</div>
                    {docs.length === 0 ? (
                        <p className="text-neutral-500 text-sm text-center py-4">No documents yet.</p>
                    ) : (
                        docs.map(doc => (
                            <button
                                key={doc._id}
                                onClick={() => setActiveDoc(doc)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${activeDoc?._id === doc._id ? 'bg-white/10 border border-white/10 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="truncate pr-4">
                                    <h3 className={`font-medium truncate ${activeDoc?._id === doc._id ? 'text-white' : 'text-neutral-300'}`}>{doc.title}</h3>
                                    <p className="text-xs text-neutral-500 mt-1 uppercase">{doc.sourceType}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeDoc?._id === doc._id ? 'text-purple-400 translate-x-1' : 'text-neutral-600 group-hover:text-neutral-400'}`} />
                            </button>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="truncate pr-4 text-sm text-neutral-400">{user?.email}</div>
                        <button onClick={handleLogout} className="text-neutral-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10" aria-label="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {activeDoc ? (
                    <>
                        <div className="border-b border-white/10 bg-black/20 p-6 flex flex-col md:flex-row md:items-end justify-between gap-4 backdrop-blur-sm z-10">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-2">{activeDoc.title}</h1>
                                <p className="text-neutral-500 text-sm">Generated on {new Date(activeDoc.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'summary' ? 'bg-white/10 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    <BookOpen className="w-4 h-4" /> Summary
                                </button>
                                <button
                                    onClick={() => setActiveTab('flashcards')}
                                    className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'flashcards' ? 'bg-white/10 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    <Layers className="w-4 h-4" /> Flashcards
                                </button>
                                <button
                                    onClick={() => setActiveTab('quiz')}
                                    className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'quiz' ? 'bg-white/10 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    <HelpCircle className="w-4 h-4" /> Quiz
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-12 bg-gradient-to-br from-[#0a0a0a] to-[#121212] relative">
                            {/* Decorative background blurs inside content area */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

                            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                                {activeTab === 'summary' && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-3"><BookOpen className="w-6 h-6" /> Executive Summary</h2>
                                        <p className="text-neutral-300 leading-relaxed text-lg whitespace-pre-line">{activeDoc.summary}</p>
                                    </div>
                                )}

                                {activeTab === 'flashcards' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {activeDoc.flashcards?.map((fc, i) => (
                                            <Flashcard key={i} question={fc.question} answer={fc.answer} index={i} />
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'quiz' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {activeDoc.quiz?.map((q, i) => (
                                            <QuizQuestion key={i} question={q} index={i} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-neutral-500">
                        <Layers className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-xl">Select a document or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Flashcard Component (Glassmorphism Flip Card)
const Flashcard = ({ question, answer, index }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="h-64 w-full perspective-1000 group cursor-pointer"
            onClick={() => setFlipped(!flipped)}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>

                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-center items-center text-center group-hover:border-blue-500/30 transition-colors">
                    <div className="absolute top-4 left-4 text-xs font-bold text-blue-500/50 uppercase tracking-widest">Q{index + 1}</div>
                    <h3 className="text-lg font-medium text-white">{question}</h3>
                    <div className="absolute bottom-4 text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Click to flip <ChevronRight className="w-3 h-3" /></div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-center items-center text-center rotate-y-180">
                    <div className="absolute top-4 left-4 text-xs font-bold text-purple-400 uppercase tracking-widest">Answer</div>
                    <p className="text-base text-neutral-200 leading-relaxed overflow-y-auto w-full break-words">{answer}</p>
                </div>

            </div>
        </div>
    );
};

// Quiz Question Component
const QuizQuestion = ({ question, index }) => {
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleSelect = (optionIndex) => {
        if (showAnswer) return;
        setSelected(optionIndex);
        setShowAnswer(true);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md">
            <h3 className="text-xl font-medium mb-6 text-white flex gap-4">
                <span className="text-pink-500 font-bold">{index + 1}.</span>
                {question.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, i) => {
                    let styleClass = "bg-black/40 border-white/10 hover:bg-white/10 text-neutral-300";

                    if (showAnswer) {
                        if (i === question.correct) {
                            styleClass = "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.1)] scale-[1.02]";
                        } else if (i === selected) {
                            styleClass = "bg-red-500/20 border-red-500 text-red-300";
                        } else {
                            styleClass = "bg-black/40 border-white/5 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            disabled={showAnswer}
                            className={`p-5 rounded-xl border text-left transition-all duration-300 ${styleClass}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex z-0 items-center justify-center font-bold text-sm ${showAnswer && i === question.correct ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-neutral-400'}`}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <span>{opt}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
