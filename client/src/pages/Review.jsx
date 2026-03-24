import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Review = () => {
    const [dueCards, setDueCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDue = async () => {
            try {
                const res = await api.get('/generate/due');
                setDueCards(res.data.dueCards);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDue();
    }, []);

    const handleRating = async (rating) => {
        const currentCard = dueCards[currentIndex];
        try {
            await api.post(`/generate/review/${currentCard.docId}/${currentCard.cardIndex}`, { rating });
            setFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 150);
        } catch (err) {
            console.error('Failed to submit rating', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#222831', color: '#EEEEEE' }}>
                <div className="animate-spin h-12 w-12 border-4 border-t-transparent rounded-full" style={{ borderColor: '#00ADB5', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (currentIndex >= dueCards.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: '#222831', color: '#EEEEEE' }}>
                <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#00ADB5' }} />
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#00ADB5' }}>All caught up!</h2>
                <p className="mb-8 max-w-sm text-lg" style={{ color: 'rgba(238,238,238,0.5)' }}>No cards due right now. Enjoy your free time or generate new study materials!</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-xl transition font-medium flex gap-2 items-center" style={{ background: '#393E46', color: '#EEEEEE', border: '1px solid rgba(0,173,181,0.2)' }}>
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
            </div>
        );
    }

    const currentCard = dueCards[currentIndex];

    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden" style={{ background: '#222831', color: '#EEEEEE' }}>
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,173,181,0.08)' }}></div>

            <div className="w-full max-w-[512px] flex flex-col relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg transition" style={{ background: 'rgba(238,238,238,0.05)', color: 'rgba(238,238,238,0.5)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(238,238,238,0.1)'; e.currentTarget.style.color = '#EEEEEE'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(238,238,238,0.05)'; e.currentTarget.style.color = 'rgba(238,238,238,0.5)'; }}>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#EEEEEE' }}>Review Time</h1>
                        <p className="text-sm" style={{ color: 'rgba(238,238,238,0.5)' }}>{currentIndex + 1} of {dueCards.length} cards remaining</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full h-2 rounded-full mb-8 overflow-hidden" style={{ background: 'rgba(238,238,238,0.1)' }}>
                    <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ width: `${((currentIndex) / dueCards.length) * 100}%`, background: '#00ADB5' }}
                    ></div>
                </div>

                {/* Flip UI */}
                <div
                    className="w-full h-80 cursor-pointer mb-8"
                    onClick={() => setFlipped(!flipped)}
                    style={{ perspective: "1000px", isolation: "isolate" }}
                >
                    <div
                        style={{
                            transformStyle: "preserve-3d",
                            WebkitTransformStyle: "preserve-3d",
                            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                            transition: "transform 0.5s ease",
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        {/* Front View */}
                        <div
                            className="rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                            style={{
                                background: '#393E46',
                                border: '1px solid rgba(0,173,181,0.2)',
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                position: "absolute",
                                inset: 0,
                            }}
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ color: '#00ADB5', background: 'rgba(0,173,181,0.1)' }}>Question</span>
                            <div className="absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded truncate max-w-[120px]" style={{ color: 'rgba(238,238,238,0.4)', background: 'rgba(238,238,238,0.05)' }} title={currentCard.docTitle}>{currentCard.docTitle}</div>
                            <h3 className="text-2xl font-medium break-words w-full" style={{ color: '#EEEEEE' }}>{currentCard.question}</h3>
                            <div className="absolute bottom-5 text-sm transition-colors" style={{ color: 'rgba(238,238,238,0.4)' }}>Tap to flip</div>
                        </div>
                        {/* Back View */}
                        <div
                            className="rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                            style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                background: '#393E46',
                                border: '1px solid rgba(0,173,181,0.35)',
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "32px",
                                textAlign: "center",
                            }}
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ color: '#00ADB5', background: 'rgba(0,173,181,0.15)' }}>Answer</span>
                            <p className="text-xl font-medium overflow-y-auto break-words w-full" style={{ color: '#EEEEEE' }}>{currentCard.answer}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Buttons */}
                <div className={`transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <p className="text-center text-sm mb-4 font-medium tracking-wide uppercase" style={{ color: 'rgba(238,238,238,0.5)' }}>How well did you know this?</p>
                    <div className="grid grid-cols-4 gap-3">
                        <button onClick={() => handleRating('again')} className="py-3 px-2 rounded-xl font-bold transition-colors" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>Again</button>
                        <button onClick={() => handleRating('hard')} className="py-3 px-2 rounded-xl font-bold transition-colors" style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>Hard</button>
                        <button onClick={() => handleRating('good')} className="py-3 px-2 rounded-xl font-bold transition-colors" style={{ background: 'rgba(0,173,181,0.1)', color: '#00ADB5', border: '1px solid rgba(0,173,181,0.2)' }}>Good</button>
                        <button onClick={() => handleRating('easy')} className="py-3 px-2 rounded-xl font-bold transition-colors" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>Easy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;
