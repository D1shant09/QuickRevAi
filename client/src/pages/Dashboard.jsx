import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, LogOut, ArrowRight, Clock, Link as LinkIcon, Type } from 'lucide-react';

const Dashboard = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocs();
    }, []);

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getIconForType = (type) => {
        if (type === 'pdf') return <FileText className="w-5 h-5 text-pink-400" />;
        if (type === 'url') return <LinkIcon className="w-5 h-5 text-purple-400" />;
        return <Type className="w-5 h-5 text-blue-400" />;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#121212] flex flex-col items-center">
            {/* Header */}
            <header className="w-full bg-black/40 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">QuickRev AI</h1>
                    <div className="flex items-center gap-6">
                        <span className="text-neutral-400 text-sm hidden sm:inline-block">Welcome, <span className="text-white font-medium">{user?.name || user?.email}</span></span>
                        <button onClick={handleLogout} className="text-neutral-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-6xl mx-auto px-6 py-12 flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Your Documents</h2>
                        <p className="text-neutral-400">Manage and review your AI-generated study materials.</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> New Material
                    </button>
                </div>

                {docs.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-16 flex flex-col items-center text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]">
                            <FileText className="w-10 h-10 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
                        <p className="text-neutral-400 mb-8 max-w-sm">You haven't generated any study materials yet. Upload a PDF, link, or text to get started.</p>
                        <button onClick={() => navigate('/upload')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 border border-white/10 rounded-xl font-medium transition flex items-center gap-2">
                            Create your first document <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map(doc => (
                            <div
                                key={doc._id}
                                onClick={() => navigate(`/result`, { state: { document: doc } })}
                                className="group bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 group-hover:bg-black/60 transition-colors">
                                        {getIconForType(doc.sourceType)}
                                    </div>
                                    <h3 className="text-lg font-bold text-white truncate max-w-[200px]" title={doc.title}>{doc.title}</h3>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 relative z-10">
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
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
