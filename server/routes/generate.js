const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateFromText } = require('../utils/gemini');
const { scrapeUrlText } = require('../utils/scraper');
const { upload, uploadToCloudinary, extractTextFromPDF } = require('../utils/pdfParser');
const Document = require('../models/Document');
const { sm2 } = require('../utils/sm2');

router.use(authMiddleware);

const saveDocument = async (userId, sourceType, title, generatedData) => {
    const doc = new Document({
        user: userId,
        title,
        sourceType,
        summary: generatedData.summary,
        flashcards: generatedData.flashcards,
        quiz: generatedData.quiz
    });
    await doc.save();
    return doc;
};

router.post('/text', async (req, res) => {
    try {
        const { text, title } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required.' });

        const generatedData = await generateFromText(text);
        const doc = await saveDocument(req.user.id, 'text', title || 'Pasted Text', generatedData);

        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate content.' });
    }
});

router.post('/url', async (req, res) => {
    try {
        const { url, title } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required.' });

        const extractedText = await scrapeUrlText(url);
        const generatedData = await generateFromText(extractedText);
        const doc = await saveDocument(req.user.id, 'url', title || url, generatedData);

        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate content from URL.' });
    }
});

router.post('/pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'PDF file is required.' });

        // Assuming we still want to upload to cloudinary to fulfill requirement, although we just parse buffer
        await uploadToCloudinary(req.file.buffer).catch(err => console.log('Cloudinary upload warning:', err));

        const extractedText = await extractTextFromPDF(req.file.buffer);
        const generatedData = await generateFromText(extractedText);
        const doc = await saveDocument(req.user.id, 'pdf', req.body.title || req.file.originalname, generatedData);

        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process PDF.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents.' });
    }
});

router.get('/due', async (req, res) => {
    try {
        const now = new Date();
        const docs = await Document.find({ user: req.user.id });
        const dueCards = [];
        docs.forEach(doc => {
            doc.flashcards.forEach((card, index) => {
                if (new Date(card.dueDate) <= now) {
                    dueCards.push({
                        docId: doc._id,
                        docTitle: doc.title,
                        cardIndex: index,
                        question: card.question,
                        answer: card.answer,
                        interval: card.interval,
                        easeFactor: card.easeFactor,
                        repetitions: card.repetitions,
                        dueDate: card.dueDate,
                    });
                }
            });
        });
        res.json({ dueCards, count: dueCards.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch due cards.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, user: req.user.id });
        if (!doc) return res.status(404).json({ error: 'Document not found.' });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch document.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const doc = await Document.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!doc) {
            return res.status(404).json({ error: 'Document not found.' });
        }
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document.' });
    }
});

router.post('/review/:docId/:cardIndex', async (req, res) => {
    try {
        const { rating } = req.body;
        if (!['again', 'hard', 'good', 'easy'].includes(rating)) {
            return res.status(400).json({ error: 'Invalid rating.' });
        }
        const doc = await Document.findOne({
            _id: req.params.docId,
            user: req.user.id
        });
        if (!doc) return res.status(404).json({ error: 'Document not found.' });

        const card = doc.flashcards[req.params.cardIndex];
        if (!card) return res.status(404).json({ error: 'Card not found.' });

        const updated = sm2(card, rating);
        doc.flashcards[req.params.cardIndex].interval = updated.interval;
        doc.flashcards[req.params.cardIndex].easeFactor = updated.easeFactor;
        doc.flashcards[req.params.cardIndex].repetitions = updated.repetitions;
        doc.flashcards[req.params.cardIndex].dueDate = updated.dueDate;
        doc.markModified('flashcards');
        await doc.save();

        res.json({ message: 'Card reviewed.', card: doc.flashcards[req.params.cardIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save review.' });
    }
});

module.exports = router;
