import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, BrainCog } from 'lucide-react';
import ShinyText from "../components/ShinyText";

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/generate/analytics');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to load analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#222831', color: '#EEEEEE' }}>
            <div className="animate-spin h-12 w-12 border-4 border-t-transparent rounded-full" style={{ borderColor: '#00ADB5', borderTopColor: 'transparent' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center" style={{ background: '#222831', color: '#EEEEEE' }}>
            {/* Header */}
            <header className="w-full backdrop-blur-xl sticky top-0 z-50" style={{ background: 'rgba(34,40,49,0.9)', borderBottom: '1px solid rgba(0,173,181,0.15)' }}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <ShinyText text="QuickRev AI" speed={4} className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/upload')} />
                    <div className="flex items-center gap-6">
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: 'rgba(238,238,238,0.5)', background: 'rgba(238,238,238,0.05)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,238,238,0.5)'; e.currentTarget.style.background = 'rgba(238,238,238,0.05)'; }}>
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[768px] mx-auto px-6 py-12 flex-1 relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: '#EEEEEE' }}>Analytics</h2>
                        <p style={{ color: 'rgba(238,238,238,0.5)' }}>Track your spaced repetition mastery</p>
                    </div>
                </div>

                {stats && stats.totalReviewed === 0 ? (
                    <div className="rounded-2xl p-12 flex flex-col items-center text-center" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                        <BrainCog className="w-16 h-16 mb-4" style={{ color: 'rgba(238,238,238,0.3)' }} />
                        <p className="text-lg mb-6" style={{ color: '#EEEEEE' }}>No review data yet. Start reviewing your flashcards to see analytics.</p>
                        <button onClick={() => navigate('/review')} className="px-6 py-3 rounded-xl font-bold transition-all active:scale-95" style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 20px rgba(0,173,181,0.25)' }}>
                            Start Reviewing
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <div className="p-5 rounded-2xl flex flex-col" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                                <span className="text-sm font-medium mb-1" style={{ color: 'rgba(238,238,238,0.5)' }}>Total Reviewed</span>
                                <span className="text-3xl font-bold" style={{ color: '#EEEEEE' }}>{stats.totalReviewed}</span>
                            </div>
                            <div className="p-5 rounded-2xl flex flex-col" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                                <span className="text-sm font-medium mb-1" style={{ color: 'rgba(238,238,238,0.5)' }}>Accuracy Rate</span>
                                <span className={`text-3xl font-bold`} style={{ color: stats.accuracyRate >= 70 ? '#4ade80' : stats.accuracyRate >= 40 ? '#fb923c' : '#f87171' }}>
                                    {stats.accuracyRate}%
                                </span>
                            </div>
                            <div className="p-5 rounded-2xl flex flex-col" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                                <span className="text-sm font-medium mb-1" style={{ color: 'rgba(238,238,238,0.5)' }}>Study Streak</span>
                                <span className="text-3xl font-bold flex items-center gap-2" style={{ color: '#fb923c' }}>
                                    {stats.streak} 🔥
                                </span>
                            </div>
                            <div className="p-5 rounded-2xl flex flex-col" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                                <span className="text-sm font-medium mb-1" style={{ color: 'rgba(238,238,238,0.5)' }}>Due Today</span>
                                <span className="text-3xl font-bold" style={{ color: '#EEEEEE' }}>
                                    {stats.completedToday} <span className="text-lg" style={{ color: 'rgba(238,238,238,0.4)' }}>/ {stats.dueToday}</span>
                                </span>
                            </div>
                        </div>

                        {/* Document Mastery */}
                        <div className="rounded-2xl p-6 mb-10" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                            <h3 className="text-xl font-bold mb-6" style={{ color: '#EEEEEE' }}>Document Mastery</h3>
                            <div className="space-y-6">
                                {stats.docMastery.map((doc, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium truncate pr-4" style={{ color: '#EEEEEE' }}>{doc.title}</span>
                                            <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{doc.masteryPercent}%</span>
                                        </div>
                                        <div style={{ background: 'rgba(238,238,238,0.1)', borderRadius: '999px', height: '8px', marginBottom: '8px' }}>
                                            <div style={{ width: `${doc.masteryPercent}%`, background: '#00ADB5', borderRadius: '999px', height: '8px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div className="text-xs font-medium" style={{ color: 'rgba(238,238,238,0.4)' }}>
                                            {doc.mastered} mastered · {doc.learning} learning · {doc.newCards} new
                                        </div>
                                    </div>
                                ))}
                                {stats.docMastery.length === 0 && (
                                    <p className="italic" style={{ color: 'rgba(238,238,238,0.4)' }}>No documents to master.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Analytics;
