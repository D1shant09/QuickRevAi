function sm2(card, rating) {
    const q = { again: 1, hard: 2, good: 4, easy: 5 }[rating];

    let { interval, easeFactor, repetitions } = card;

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Update interval and repetitions
    if (q < 3) {
        repetitions = 0;
        interval = 1;
    } else {
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
    }

    // Calculate next due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    return { interval, easeFactor, repetitions, dueDate };
}

module.exports = { sm2 };
