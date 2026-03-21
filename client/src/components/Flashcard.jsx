import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

const Flashcard = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const touchStartX = useRef(null);

    if (!flashcards || flashcards.length === 0)
        return <div className="text-center text-neutral-400">No flashcards available.</div>;

    const total = flashcards.length;
    const current = flashcards[currentIndex];

    const goNext = () => {
        if (currentIndex >= total - 1) return;
        setFlipped(false);
        setTimeout(() => setCurrentIndex((i) => i + 1), 150);
    };

    const goPrev = () => {
        if (currentIndex <= 0) return;
        setFlipped(false);
        setTimeout(() => setCurrentIndex((i) => i - 1), 150);
    };

    const handleDotClick = (idx) => {
        setFlipped(false);
        setTimeout(() => setCurrentIndex(idx), 150);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) goNext();
        else if (diff < -50) goPrev();
        touchStartX.current = null;
    };

    return (
        <div style={{ width: "100%", maxWidth: "512px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Progress bar */}
            <div style={{ width: "100%", background: "rgba(255,255,255,0.1)", height: "6px", borderRadius: "999px", marginBottom: "16px", overflow: "hidden" }}>
                <div style={{ width: `${((currentIndex + 1) / total) * 100}%`, background: "#3b82f6", height: "100%", borderRadius: "999px", transition: "width 0.3s ease" }} />
            </div>

            <div style={{ color: "#a3a3a3", fontSize: "14px", marginBottom: "16px" }}>
                Card {currentIndex + 1} of {total}
            </div>

            {/* Card flip container */}
            <div
                onClick={() => setFlipped((f) => !f)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    width: "100%",
                    height: "300px",
                    perspective: "1200px",
                    cursor: "pointer",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        transition: "transform 0.6s ease",
                        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* Front */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            background: "#151515",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "32px",
                            textAlign: "center",
                        }}
                    >
                        <span style={{
                            position: "absolute", top: "12px", left: "12px",
                            fontSize: "11px", fontWeight: "700", color: "rgba(59,130,246,0.6)",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            background: "rgba(59,130,246,0.1)", padding: "4px 8px", borderRadius: "6px"
                        }}>Question</span>
                        <p style={{ color: "#fff", fontSize: "20px", fontWeight: "500", lineHeight: "1.5", wordBreak: "break-word" }}>
                            {current.question}
                        </p>
                        <span style={{ position: "absolute", bottom: "12px", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
                            Tap to reveal answer
                        </span>
                    </div>

                    {/* Back */}
                    <div
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
                        <span style={{
                            position: "absolute", top: "12px", left: "12px",
                            fontSize: "11px", fontWeight: "700", color: "rgba(216,180,254,0.8)",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            background: "rgba(168,85,247,0.2)", padding: "4px 8px", borderRadius: "6px"
                        }}>Answer</span>
                        <p style={{ color: "#f3f4f6", fontSize: "20px", fontWeight: "500", lineHeight: "1.5", wordBreak: "break-word" }}>
                            {current.answer}
                        </p>
                        <span style={{ position: "absolute", bottom: "12px", color: "rgba(216,180,254,0.3)", fontSize: "12px" }}>
                            Tap to flip back
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ width: "100%", display: "flex", gap: "12px", marginBottom: "20px" }}>
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    style={{
                        width: "56px", height: "56px", borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        color: "#fff", cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                        opacity: currentIndex === 0 ? 0.3 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={() => setFlipped((f) => !f)}
                    style={{
                        flex: 1, height: "56px", borderRadius: "12px",
                        background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                        border: "none", color: "#fff", fontWeight: "700",
                        fontSize: "15px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                >
                    <RotateCw size={18} /> Flip Card
                </button>

                <button
                    onClick={goNext}
                    disabled={currentIndex === total - 1}
                    style={{
                        width: "56px", height: "56px", borderRadius: "12px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        color: "#fff", cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
                        opacity: currentIndex === total - 1 ? 0.3 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", padding: "0 16px" }}>
                {flashcards.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        style={{
                            width: idx === currentIndex ? "24px" : "10px",
                            height: "10px",
                            borderRadius: "999px",
                            background: idx === currentIndex ? "#3b82f6" : "rgba(255,255,255,0.2)",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.3s ease",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Flashcard;
