import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const Flashcard = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentIndex < flashcards.length - 1) {
            handleNext();
        }
        if (isRightSwipe && currentIndex > 0) {
            handlePrev();
        }
    };

    if (!flashcards || flashcards.length === 0) return <div>No flashcards available.</div>;

    const handleNext = () => {
        setFlipped(false);
        setTimeout(() => setCurrentIndex(prev => Math.min(prev + 1, flashcards.length - 1)), 150);
    };

    const handlePrev = () => {
        setFlipped(false);
        setTimeout(() => setCurrentIndex(prev => Math.max(prev - 1, 0)), 150);
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleDotClick = (index) => {
        setFlipped(false);
        setTimeout(() => setCurrentIndex(index), 150);
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div className="w-full max-w-[512px] mx-auto flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full mb-6 overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                ></div>
            </div>

            <div className="text-neutral-400 mb-4 text-sm font-medium">Card {currentIndex + 1} of {flashcards.length}</div>

            {/* Card Area */}
            <div
                className="w-full h-80 perspective-1000 cursor-pointer mb-8"
                onClick={handleFlip}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ perspective: "1000px" }}
            >
                <div
                    className="relative w-full h-full transition-transform duration-500"
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
                        className="absolute inset-0 bg-[#151515] border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <span className="absolute top-4 left-4 text-xs font-bold text-blue-500/50 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">Question</span>
                        <h3 className="text-2xl font-medium text-white break-words w-full">{currentCard.question}</h3>
                    </div>
                    {/* Back View */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/50 rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <span className="absolute top-4 left-4 text-xs font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-2 py-1 rounded">Answer</span>
                        <p className="text-xl text-neutral-100 font-medium overflow-y-auto break-words w-full">{currentCard.answer}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="w-full flex items-center justify-between mb-8 gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-4 bg-white/5 disabled:opacity-30 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5 w-16 h-16"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleFlip}
                    className="flex-1 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 h-16"
                >
                    <RotateCw className="w-5 h-5" /> Flip Card
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-4 bg-white/5 disabled:opacity-30 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5 w-16 h-16"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex flex-wrap justify-center gap-2 px-4">
                {flashcards.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-blue-400 w-6' : 'bg-white/20 hover:bg-white/40'}`}
                        aria-label={`Go to card ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Flashcard;
