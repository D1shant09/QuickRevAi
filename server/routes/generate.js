const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateFromText } = require('../utils/gemini');
const { scrapeUrlText } = require('../utils/scraper');
const { upload, uploadToCloudinary, extractTextFromPDF } = require('../utils/pdfParser');
const Document = require('../models/Document');

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

router.get('/:id', async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, user: req.user.id });
        if (!doc) return res.status(404).json({ error: 'Document not found.' });
        res.json(doc);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch document.' });
    }
});

module.exports = router;
