const mongoose = require('mongoose');
const reviewLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    docTitle: { type: String },
    cardIndex: { type: Number, required: true },
    rating: { type: String, enum: ['again', 'hard', 'good', 'easy'], required: true },
    correct: { type: Boolean, required: true },
    reviewedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ReviewLog', reviewLogSchema);
