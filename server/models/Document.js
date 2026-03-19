const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Document'
    },
    sourceType: {
        type: String, // 'pdf', 'url', 'text'
        required: true
    },
    summary: {
        type: String
    },
    flashcards: [{
        question: String,
        answer: String
    }],
    quiz: [{
        question: String,
        options: [String],
        correct: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
