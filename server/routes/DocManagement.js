const express = require('express');
const multer = require('multer');
const { Document } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Upload a document
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, filename } = req.file;

        const existingDoc = await Document.findOne({ where: { name: originalname}, order: [['version', 'DESC']],});
        const document = await Document.create({
            name: originalname,
            path: `uploads/${filename}`,
            version: existingDoc ? existingDoc.version + 1 : 1,
        });

        await AuditLog.create({
            action: 'Upload',
            documentName: originalname,
            user: 'admin',
        });
        res.json(document);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed' });
    }
});



// Fetch all documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.findAll();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch documents' });
    }
});






module.exports = router;
