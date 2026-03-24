import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, LogOut, ArrowRight, Clock, Link as LinkIcon, Type, Trash2, Layers } from 'lucide-react';
import ShinyText from "../components/ShinyText";

const Dashboard = () => {
    const [docs, setDocs] = useState([]);
    const [dueCount, setDueCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocs();
        fetchDue();
    }, []);

    const fetchDue = async () => {
        try {
            const res = await api.get('/generate/due');
            setDueCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch due count:', err);
        }
    };

    const fetchDocs = async () => {
        try {
            const res = await api.get('/generate');
            setDocs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        if (!window.confirm('Are you sure you want to delete this study material?')) return;
        try {
            await api.delete(`/generate/${id}`);
            setDocs((prev) => prev.filter((doc) => doc._id !== id));
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getIconForType = (type) => {
        if (type === 'pdf') return <FileText className="w-5 h-5" style={{ color: '#00ADB5' }} />;
        if (type === 'url') return <LinkIcon className="w-5 h-5" style={{ color: '#00ADB5' }} />;
        return <Type className="w-5 h-5" style={{ color: '#00ADB5' }} />;
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center" style={{ background: '#222831', color: '#EEEEEE' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#00ADB5' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center" style={{ background: '#222831', color: '#EEEEEE' }}>
            {/* Header */}
            <header className="w-full backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(34,40,49,0.9)', borderBottom: '1px solid rgba(0,173,181,0.15)' }}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <ShinyText text="QuickRev AI" speed={4} className="text-2xl font-bold" />
                    <div className="flex items-center gap-6">
                        <span className="text-sm hidden sm:inline-block" style={{ color: 'rgba(238,238,238,0.5)' }}>Welcome, <span className="font-medium" style={{ color: '#EEEEEE' }}>{user?.name || user?.email}</span></span>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: 'rgba(238,238,238,0.5)', background: 'rgba(238,238,238,0.05)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,238,238,0.5)'; e.currentTarget.style.background = 'rgba(238,238,238,0.05)'; }}>
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-6xl mx-auto px-6 py-12 flex-1">
                {/* Due Cards Banner */}
                <div className="w-full rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.2)' }}>
                    <div className="absolute right-0 top-0 w-64 h-full pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,173,181,0.1), transparent)' }}></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2`} style={dueCount > 0 ? { background: 'rgba(0,173,181,0.15)', borderColor: 'rgba(0,173,181,0.5)', color: '#00ADB5', boxShadow: '0 0 20px rgba(0,173,181,0.2)' } : { background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#4ade80' }}>
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1" style={{ color: '#EEEEEE' }}>Daily Review</h3>
                            <p className="text-sm font-medium" style={{ color: dueCount > 0 ? '#00ADB5' : '#4ade80' }}>
                                {dueCount > 0 ? `${dueCount} cards due today` : 'No cards due today'}
                            </p>
                        </div>
                    </div>
                    {dueCount > 0 && (
                        <button
                            onClick={() => navigate('/review')}
                            className="w-full sm:w-auto px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 z-10 relative"
                            style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 20px rgba(0,173,181,0.3)' }}
                        >
                            Start Review
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: '#EEEEEE' }}>Your Documents</h2>
                        <p style={{ color: 'rgba(238,238,238,0.5)' }}>Manage and review your AI-generated study materials.</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all hover:scale-105 active:scale-95"
                        style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 20px rgba(0,173,181,0.25)' }}
                    >
                        <Plus className="w-5 h-5" /> New Material
                    </button>
                </div>

                {docs.length === 0 ? (
                    <div className="rounded-2xl p-16 flex flex-col items-center text-center" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(0,173,181,0.1)', border: '1px solid rgba(0,173,181,0.2)', boxShadow: 'inset 0 0 20px rgba(0,173,181,0.15)' }}>
                            <FileText className="w-10 h-10" style={{ color: 'rgba(238,238,238,0.4)' }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#EEEEEE' }}>No documents yet</h3>
                        <p className="mb-8 max-w-sm" style={{ color: 'rgba(238,238,238,0.5)' }}>You haven't generated any study materials yet. Upload a PDF, link, or text to get started.</p>
                        <button onClick={() => navigate('/upload')} className="px-6 py-3 rounded-xl font-medium transition flex items-center gap-2" style={{ background: 'rgba(0,173,181,0.1)', border: '1px solid rgba(0,173,181,0.25)', color: '#00ADB5' }}>
                            Create your first document <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map(doc => (
                            <div
                                key={doc._id}
                                onClick={() => navigate(`/result`, { state: { document: doc } })}
                                className="group rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,173,181,0.5)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,173,181,0.15)'}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom-left, rgba(0,173,181,0.1), transparent)' }}></div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteDocument(doc._id); }}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                    style={{ color: '#f87171' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    title="Delete document"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="p-3 rounded-xl border transition-colors" style={{ background: '#222831', borderColor: 'rgba(0,173,181,0.15)' }}>
                                        {getIconForType(doc.sourceType)}
                                    </div>
                                    <h3 className="text-lg font-bold truncate max-w-[200px]" style={{ color: '#EEEEEE' }} title={doc.title}>{doc.title}</h3>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(0,173,181,0.1)' }}>
                                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(238,238,238,0.4)' }}>
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" style={{ color: '#00ADB5' }}>
                                        View Result <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
