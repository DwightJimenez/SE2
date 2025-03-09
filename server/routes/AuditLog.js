const express = require('express');
const { AuditLog } = require('../models');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['timestamp', 'DESC']],
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

module.exports = router
