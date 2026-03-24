import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

const Flashcard = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const touchStartX = useRef(null);

    if (!flashcards || flashcards.length === 0)
        return <div className="text-center" style={{ color: 'rgba(238,238,238,0.4)' }}>No flashcards available.</div>;

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
            <div style={{ width: "100%", background: "rgba(238,238,238,0.1)", height: "6px", borderRadius: "999px", marginBottom: "16px", overflow: "hidden" }}>
                <div style={{ width: `${((currentIndex + 1) / total) * 100}%`, background: "#00ADB5", height: "100%", borderRadius: "999px", transition: "width 0.3s ease" }} />
            </div>

            <div style={{ color: "rgba(238,238,238,0.4)", fontSize: "14px", marginBottom: "16px" }}>
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
                            background: "#393E46",
                            border: "1px solid rgba(0,173,181,0.2)",
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
                            fontSize: "11px", fontWeight: "700", color: "#00ADB5",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            background: "rgba(0,173,181,0.1)", padding: "4px 8px", borderRadius: "6px"
                        }}>Question</span>
                        <p style={{ color: "#EEEEEE", fontSize: "20px", fontWeight: "500", lineHeight: "1.5", wordBreak: "break-word" }}>
                            {current.question}
                        </p>
                        <span style={{ position: "absolute", bottom: "12px", color: "rgba(238,238,238,0.25)", fontSize: "12px" }}>
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
                            background: "#393E46",
                            border: "1px solid rgba(0,173,181,0.35)",
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
                            fontSize: "11px", fontWeight: "700", color: "#00ADB5",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                            background: "rgba(0,173,181,0.15)", padding: "4px 8px", borderRadius: "6px"
                        }}>Answer</span>
                        <p style={{ color: "#EEEEEE", fontSize: "20px", fontWeight: "500", lineHeight: "1.5", wordBreak: "break-word" }}>
                            {current.answer}
                        </p>
                        <span style={{ position: "absolute", bottom: "12px", color: "rgba(238,238,238,0.25)", fontSize: "12px" }}>
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
                        background: "rgba(238,238,238,0.05)", border: "1px solid rgba(238,238,238,0.08)",
                        color: "#EEEEEE", cursor: currentIndex === 0 ? "not-allowed" : "pointer",
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
                        background: "#00ADB5",
                        border: "none", color: "#222831", fontWeight: "700",
                        fontSize: "15px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        boxShadow: "0 0 20px rgba(0,173,181,0.3)",
                    }}
                >
                    <RotateCw size={18} /> Flip Card
                </button>

                <button
                    onClick={goNext}
                    disabled={currentIndex === total - 1}
                    style={{
                        width: "56px", height: "56px", borderRadius: "12px",
                        background: "rgba(238,238,238,0.05)", border: "1px solid rgba(238,238,238,0.08)",
                        color: "#EEEEEE", cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
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
                            background: idx === currentIndex ? "#00ADB5" : "rgba(238,238,238,0.2)",
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