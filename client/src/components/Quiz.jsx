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
            <div className="w-full max-w-[512px] mx-auto rounded-3xl p-8 flex flex-col items-center text-center shadow-xl" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.2)' }}>
                <h3 className="text-3xl font-bold mb-6" style={{ color: '#00ADB5' }}>Quiz Complete!</h3>

                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(238,238,238,0.1)" strokeWidth="10" />
                        <circle
                            cx="50" cy="50" r="45" fill="none"
                            stroke="#A6B1E1" strokeWidth="10"
                            strokeDasharray={`${(score / quiz.length) * 283} 283`}
                            className="transition-all duration-1000 ease-out"
                        />

                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: '#EEEEEE' }}>{score}</span>
                        <span className="text-sm pt-1 mt-1 font-medium w-12 text-center" style={{ color: 'rgba(238,238,238,0.4)', borderTop: '1px solid rgba(238,238,238,0.2)' }}>{quiz.length}</span>
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
                    className="w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ background: 'rgba(238,238,238,0.08)', color: '#EEEEEE', border: '1px solid rgba(238,238,238,0.1)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(238,238,238,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(238,238,238,0.08)'}
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
                <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{ color: '#00ADB5', background: 'rgba(0,173,181,0.1)', border: '1px solid rgba(0,173,181,0.2)' }}>Question {currentIndex + 1} of {quiz.length}</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(238,238,238,0.5)' }}>Score: {score}</span>
            </div>

            {/* Question Card */}
            <div className="w-full rounded-2xl p-6 sm:p-8 shadow-xl mb-6" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.15)' }}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-8 leading-relaxed" style={{ color: '#EEEEEE' }}>
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt, i) => {
                        const isCorrectOption = i === currentQuestion.correct;
                        const isSelected = i === selectedOption;

                        let borderColor = 'rgba(0,173,181,0.15)';
                        let bg = '#222831';
                        let textColor = 'rgba(238,238,238,0.7)';
                        let icon = null;

                        if (showAnswer) {
                            if (isCorrectOption) {
                                bg = 'rgba(34,197,94,0.1)';
                                borderColor = '#22c55e';
                                textColor = '#86efac';
                                icon = <CheckCircle2 className="w-5 h-5" style={{ color: '#4ade80' }} />;
                            } else if (isSelected) {
                                bg = 'rgba(239,68,68,0.1)';
                                borderColor = '#ef4444';
                                textColor = '#fca5a5';
                                icon = <XCircle className="w-5 h-5" style={{ color: '#f87171' }} />;
                            } else {
                                bg = 'rgba(34,40,49,0.4)';
                                borderColor = 'transparent';
                                textColor = 'rgba(238,238,238,0.25)';
                            }
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleOptionSelect(i)}
                                disabled={showAnswer}
                                className="w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center justify-between"
                                style={{ background: bg, borderColor, color: textColor }}
                                onMouseEnter={e => { if (!showAnswer) { e.currentTarget.style.borderColor = '#00ADB5'; } }}
                                onMouseLeave={e => { if (!showAnswer) { e.currentTarget.style.borderColor = 'rgba(0,173,181,0.15)'; } }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-sm transition-colors" style={{
                                        background: showAnswer && isCorrectOption ? 'rgba(34,197,94,0.15)' : showAnswer && isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(0,173,181,0.08)',
                                        color: showAnswer && isCorrectOption ? '#4ade80' : showAnswer && isSelected ? '#f87171' : '#00ADB5'
                                    }}>
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
                    className="w-full py-4 font-bold rounded-xl transition-all duration-300 animate-in slide-in-from-bottom-4 flex items-center justify-center gap-2"
                    style={{ background: '#00ADB5', color: '#222831', boxShadow: '0 0 20px rgba(0,173,181,0.25)' }}
                >
                    {currentIndex === quiz.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default Quiz;
