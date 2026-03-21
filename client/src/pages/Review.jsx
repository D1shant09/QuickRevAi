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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (currentIndex >= dueCards.length) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">All caught up!</h2>
                <p className="text-neutral-400 mb-8 max-w-sm text-lg">No cards due right now. Enjoy your free time or generate new study materials!</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition font-medium flex gap-2 shadow-lg items-center">
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
            </div>
        );
    }

    const currentCard = dueCards[currentIndex];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-[512px] flex flex-col relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Review Time</h1>
                        <p className="text-sm text-neutral-400">{currentIndex + 1} of {dueCards.length} cards remaining</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
                    <div
                        className="bg-purple-500 h-full transition-all duration-300"
                        style={{ width: `${((currentIndex) / dueCards.length) * 100}%` }}
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
                            className="bg-[#151515] border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                            style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                position: "absolute",
                                inset: 0,
                            }}
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold text-blue-500/50 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">Question</span>
                            <div className="absolute top-4 right-4 text-xs font-medium text-neutral-500 bg-white/5 px-2 py-0.5 rounded truncate max-w-[120px]" title={currentCard.docTitle}>{currentCard.docTitle}</div>
                            <h3 className="text-2xl font-medium text-white break-words w-full">{currentCard.question}</h3>
                            <div className="absolute bottom-5 text-sm text-neutral-500 hover:text-white transition-colors">Tap to flip</div>
                        </div>
                        {/* Back View */}
                        <div
                            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/50 rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                            style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                background: "#151515",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "32px",
                                textAlign: "center",
                            }}
                        >
                            <span className="absolute top-4 left-4 text-xs font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-2 py-1 rounded">Answer</span>
                            <p className="text-xl text-neutral-100 font-medium overflow-y-auto break-words w-full">{currentCard.answer}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Buttons */}
                <div className={`transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <p className="text-center text-sm text-neutral-400 mb-4 font-medium tracking-wide uppercase">How well did you know this?</p>
                    <div className="grid grid-cols-4 gap-3">
                        <button onClick={() => handleRating('again')} className="py-3 px-2 rounded-xl font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">Again</button>
                        <button onClick={() => handleRating('hard')} className="py-3 px-2 rounded-xl font-bold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-colors">Hard</button>
                        <button onClick={() => handleRating('good')} className="py-3 px-2 rounded-xl font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors">Good</button>
                        <button onClick={() => handleRating('easy')} className="py-3 px-2 rounded-xl font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors">Easy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;
