import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const Quiz = ({ quiz }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    if (!quiz || quiz.length === 0) return <div>No quiz questions available.</div>;

    const currentQuestion = quiz[currentIndex];

    const handleOptionSelect = (index) => {
        if (showAnswer || isFinished) return;

        setSelectedOption(index);
        setShowAnswer(true);

        const isCorrect = index === currentQuestion.correct;
        if (isCorrect) setScore(score + 1);

        setUserAnswers([...userAnswers, isCorrect]);
    };

    const handleNext = () => {
        if (currentIndex < quiz.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowAnswer(false);
        setScore(0);
        setIsFinished(false);
        setUserAnswers([]);
    };

    if (isFinished) {
        return (
            <div className="w-full max-w-[512px] mx-auto bg-[#151515] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">Quiz Complete!</h3>

                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                        <circle
                            cx="50" cy="50" r="45" fill="none"
                            stroke="url(#gradient)" strokeWidth="10"
                            strokeDasharray={`${(score / quiz.length) * 283} 283`}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{score}</span>
                        <span className="text-neutral-500 text-sm border-t border-white/20 w-12 pt-1 mt-1 font-medium">{quiz.length}</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
                    {userAnswers.map((isCorrect, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${isCorrect ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                            title={`Question ${idx + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleRetry}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" /> Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[512px] mx-auto flex flex-col items-center">
            {/* Progress */}
            <div className="w-full flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-pink-500 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20">Question {currentIndex + 1} of {quiz.length}</span>
                <span className="text-sm font-medium text-neutral-400">Score: {score}</span>
            </div>

            {/* Question Card */}
            <div className="w-full bg-[#151515] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-8 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt, i) => {
                        const isCorrectOption = i === currentQuestion.correct;
                        const isSelected = i === selectedOption;

                        let styleClass = "bg-black/60 border-white/10 hover:bg-white/10 text-neutral-300";
                        let icon = null;

                        if (showAnswer) {
                            if (isCorrectOption) {
                                styleClass = "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                                icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                            } else if (isSelected) {
                                styleClass = "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                                icon = <XCircle className="w-5 h-5 text-red-400" />;
                            } else {
                                styleClass = "bg-black/40 border-transparent opacity-30 scale-95";
                            }
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleOptionSelect(i)}
                                disabled={showAnswer}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center justify-between group ${styleClass} ${!showAnswer && 'hover:border-blue-500/50 hover:-translate-y-0.5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-sm transition-colors ${showAnswer && isCorrectOption ? 'bg-green-500/20 text-green-400' : showAnswer && isSelected ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-neutral-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'}`}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="font-medium">{opt}</span>
                                </div>
                                {icon}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Next Button */}
            {showAnswer && (
                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 animate-in slide-in-from-bottom-4 flex items-center justify-center gap-2"
                >
                    {currentIndex === quiz.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default Quiz;
