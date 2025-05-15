const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Route pour envoyer un email de confirmation de rendez-vous
router.post('/appointment-confirmation', emailController.sendAppointmentConfirmation);

// Route pour envoyer un email de confirmation de devis (déjà existant)
router.post('/quote-confirmation', emailController.sendQuoteConfirmation);

module.exports = router;
