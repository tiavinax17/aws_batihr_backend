const express = require('express');
const router = express.Router();
const devisController = require('../controllers/devisController');

// Route pour soumettre une demande de devis
router.post('/', devisController.submitDevis);

module.exports = router;
